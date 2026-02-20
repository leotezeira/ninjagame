// ============================================================
// world/calendar.js — Tiempo real, calendario, turnos
// ============================================================

export const calendarMethods = {

    // ── Tiempo real ──────────────────────────────────────────

    getRealTimeState() {
        const now         = Date.now();
        const absoluteTurn = Math.floor(now / this.REAL_TURN_MS);
        const turnOfDay    = absoluteTurn % this.turnsPerDay;
        const absoluteDay  = Math.floor(now / this.REAL_DAY_MS);
        return { now, absoluteTurn, turnOfDay, absoluteDay };
    },

    getTimeOfDay() {
        return this.getRealTimeState().turnOfDay;
    },

    getTimeOfDayLabel() {
        return this.timeOfDayNames[this.getTimeOfDay()] || 'MAÑANA';
    },

    startRealTimeTick() {
        if (this._realTimeTicker) clearInterval(this._realTimeTicker);
        this._realTimeTicker = setInterval(() => this.onRealTimeTick(), 10_000);
    },

    onRealTimeTick() {
        if (!this.player) return;
        const { absoluteDay } = this.getRealTimeState();

        if (!this.player.lastProcessedDay) this.player.lastProcessedDay = absoluteDay;

        if (this.player.lastProcessedDay !== absoluteDay) {
            this.player.lastProcessedDay = absoluteDay;
            this._advanceCalendarDay();
            if (this.player.travelState) this.processNextTravelDay();
            this.saveGame();
        }

        this.updateWorldHUD();
        this.processWeeklyExpenses();
        this.processPassiveRecovery();

        if (this.isVillageScreenActive()) this.updateOnlinePlayers();
    },

    _advanceCalendarDay() {
        this.player.day += 1;
        this.player.weekday = (this.player.weekday + 1) % 7;
        if (this.player.day > this.daysPerMonth) {
            this.player.day = 1;
            this.player.month += 1;
            if (this.player.month > this.monthsPerYear) {
                this.player.month = 1;
                this.player.year += 1;
            }
        }
        this.updateSeasonAndWeather(true);
        this.applyDailyUpkeep();
        this.checkRandomDailyEvents();
        this.renegadeDailyTick();
        this.checkExamDay();
    },

    // advanceTurns se mantiene para compatibilidad con código que lo llame
    advanceTurns(turns, reason = '') {
        if (!this.player) return;
        this.tickUrgentMission(turns);
        for (let i = 0; i < turns; i++) {
            const baseRegen   = Math.max(1, Math.floor(this.player.maxChakra * 0.02));
            const isAfternoon = this.getTimeOfDay() === 1;
            const regen       = Math.floor(baseRegen * (isAfternoon ? 0.9 : 1));
            this.player.chakra = Math.min(this.player.maxChakra, this.player.chakra + regen);
        }
        this.checkRecurringEvents();
        this.saveGame();
        if (this.isVillageScreenActive()) this.updateVillageUI();
    },

    // ── Estación y clima ─────────────────────────────────────

    getSeasonFromMonth(month) {
        if (month <= 3) return 'primavera';
        if (month <= 6) return 'verano';
        if (month <= 9) return 'otono';
        return 'invierno';
    },

    rollWeatherForSeason(season) {
        const options = this.weatherOptionsBySeason[season] || ['soleado'];
        return options[Math.floor(Math.random() * options.length)];
    },

    updateSeasonAndWeather(rollWeather = true) {
        this.player.season = this.getSeasonFromMonth(this.player.month);
        if (rollWeather) this.player.weather = this.rollWeatherForSeason(this.player.season);
    },

    getSeasonLabel() {
        const map = { primavera:'Primavera', verano:'Verano', otono:'Otoño', invierno:'Invierno' };
        return map[this.player.season] || 'Primavera';
    },

    getWeatherLabel() {
        const map = { soleado:'Soleado', nublado:'Nublado', lluvia:'Lluvia', tormenta:'Tormenta', nieve:'Nieve' };
        return map[this.player.weather] || 'Soleado';
    },

    // ── Fatiga ───────────────────────────────────────────────

    addFatigue(amount)    { this.player.fatigue = this.clamp(this.player.fatigue + amount, 0, 100); },
    reduceFatigue(amount) { this.player.fatigue = this.clamp(this.player.fatigue - amount, 0, 100); },

    getFatiguePenalty() {
        const f = this.player.fatigue;
        if (f <= 25) return 0;
        if (f <= 50) return 5;
        if (f <= 75) return 10;
        return 20;
    },

    checkFatigueFaint() {
        if (!this.player || this.player.fatigue < 76) return false;
        if (Math.random() >= 0.15) return false;
        this.disableCombatButtons();
        this.addCombatLog('😵 Te desmayas por la fatiga y pierdes tu turno.', 'log-miss');
        setTimeout(() => this.enemyTurn(), 1200);
        return true;
    },

    // ── Recuperación pasiva ──────────────────────────────────

    processPassiveRecovery() {
        if (!this.player) return;
        if (!this.player.lastRecoveryTime) { this.player.lastRecoveryTime = Date.now(); return; }
        const elapsed        = Date.now() - this.player.lastRecoveryTime;
        const elapsedMinutes = elapsed / 60_000;
        if (elapsedMinutes < 1) return;
        const minutes     = Math.floor(elapsedMinutes);
        const recoveryPct = 0.10 * minutes;
        this.player.hp     = Math.min(this.player.maxHp,     this.player.hp     + Math.floor(this.player.maxHp     * recoveryPct));
        this.player.chakra = Math.min(this.player.maxChakra, this.player.chakra + Math.floor(this.player.maxChakra * recoveryPct));
        this.reduceFatigue(10 * minutes);
        this.player.lastRecoveryTime = Date.now();
        this.saveGame();
    },

    // ── Gastos semanales ─────────────────────────────────────

    processWeeklyExpenses() {
        if (!this.player) return;
        const { absoluteDay } = this.getRealTimeState();
        const currentWeek     = Math.floor(absoluteDay / 7);
        if (typeof this.player.lastWeekProcessedForExpenses !== 'number') {
            this.player.lastWeekProcessedForExpenses = currentWeek;
        }
        if (currentWeek === this.player.lastWeekProcessedForExpenses) return;
        this.player.lastWeekProcessedForExpenses = currentWeek;

        const weeklyExpense = this.WEEKLY_TOTAL;
        const weeklyRent    = this.WEEKLY_RENT;
        const weeklyFood    = this.WEEKLY_FOOD;

        if (this.player.ryo >= weeklyExpense) {
            this.player.ryo -= weeklyExpense;
            if (this.isVillageScreenActive()) {
                this.gameAlert(`💰 Gastos semanales: -${weeklyRent} ryos (alquiler) -${weeklyFood} ryos (comida) = -${weeklyExpense} ryos total`);
            }
        } else {
            const deficit = weeklyExpense - this.player.ryo;
            this.player.ryo = 0;
            const fatigaIncrease = Math.min(20, Math.floor(deficit / 5));
            this.addFatigue(fatigaIncrease);
            if (this.isVillageScreenActive()) {
                alert(`⚠️ ¡No hay suficientes fondos! Te faltan ${deficit} ryos. Tu fatiga aumentó ${fatigaIncrease} puntos.`);
            }
        }
        this.saveGame();
    },

    applyDailyUpkeep() {
        if (!Array.isArray(this.player.team) || this.player.team.length === 0) return;
        let totalCost = 0;
        for (const npcId of this.player.team) {
            const npc = this.recruitableNPCs[npcId];
            if (npc) totalCost += npc.costPerDay;
        }
        if (totalCost <= 0) return;
        if (this.player.ryo >= totalCost) {
            this.player.ryo -= totalCost;
        } else {
            alert('💸 No tienes Ryo para pagar al equipo. Los compañeros se han ido.');
            this.player.team = [];
        }
    },

    // ── Eventos ──────────────────────────────────────────────

    checkRecurringEvents() {
        if (!this.player) return;
        if (this.getTimeOfDay() !== 0) return;
        const todayEvents = this.recurringEvents.filter(e => {
            try { return e.when(this.player); } catch { return false; }
        });
        if (todayEvents.length > 0) {
            alert(`🗓️ Eventos de hoy:\n${todayEvents.map(e => `• ${e.name}`).join('\n')}`);
        }
    },

    checkRandomDailyEvents() {
        if (this.player.isRenegade) {
            const hideouts = new Set(['bosque','olas','ame','valle']);
            this.player.blackMarketToday = hideouts.has(this.player.location);
            if (!this.player.blackMarketToday) this.player.blackMarketOffer = null;
            this.player.visitingMasterToday = false;
            return;
        }
        const isActive = Math.random() < 0.07;
        this.player.blackMarketToday = isActive;
        if (!isActive) this.player.blackMarketOffer = null;

        if (this.player.day === 1 && this.getTimeOfDay() === 0) {
            if (Math.random() < 0.10 && this.player.location === 'konoha') {
                this.spawnUrgentMission('🏯 Invasión de la aldea', 3);
            }
        }
        this.player.visitingMasterToday = (Math.random() < 0.04 && this.player.location === 'konoha');
    },

    // ── Misiones urgentes ────────────────────────────────────

    async spawnUrgentMission(title, daysLimit) {
        const turnsLimit = daysLimit * this.turnsPerDay;
        this.player.urgentMission = {
            name:          title,
            createdAt:     { day: this.player.day, month: this.player.month, year: this.player.year },
            turnsLeft:     turnsLimit,
            ryoMultiplier: 2,
            expMultiplier: 1.2,
        };
        await this.gameAlert(`🚨 MISIÓN URGENTE: ${title}\nTiempo límite: ${daysLimit} días`, '❌');
    },

    tickUrgentMission(turnsPassed) {
        if (!this.player.urgentMission) return;
        this.player.urgentMission.turnsLeft -= turnsPassed;
        if (this.player.urgentMission.turnsLeft <= 0) {
            this.gameAlert('⏳ Fallaste una misión urgente. Pierdes reputación.', '❌');
            this.applyReputationDelta(this.player.location, -10);
            this.player.urgentMission = null;
        }
    },

    // ── Reputación ───────────────────────────────────────────

    applyReputationDelta(locationId, delta) {
        if (!this.player.reputation) this.player.reputation = {};
        const current = this.player.reputation[locationId] || 0;
        this.player.reputation[locationId] = this.clamp(current + delta, -100, 100);
    },

    getReputationTier(locationId) {
        const rep = (this.player.reputation?.[locationId]) || 0;
        if (rep < 0)   return 'Enemigo';
        if (rep <= 20) return 'Desconocido';
        if (rep <= 50) return 'Conocido';
        if (rep <= 80) return 'Respetado';
        return 'Héroe';
    },

    getReputationDiscount(locationId) {
        const rep = (this.player.reputation?.[locationId]) || 0;
        if (rep < 0)   return 0;
        if (rep <= 20) return 0;
        if (rep <= 50) return 0.05;
        if (rep <= 80) return 0.10;
        return 0.15;
    },

    isFestivalActive() {
        return this.player.location === 'konoha' && this.player.month === 5 && this.player.day === 15;
    },

    applyPriceDiscount(basePrice) {
        let price = basePrice;
        const repDiscount = this.getReputationDiscount(this.player.location);
        if (this.isFestivalActive()) price = Math.floor(price * 0.5);
        price = Math.floor(price * (1 - repDiscount));
        return Math.max(1, price);
    },

    // ── Días absolutos (para exámenes) ───────────────────────

    getAbsoluteDay(p = this.player) {
        return (p.year * this.monthsPerYear * this.daysPerMonth)
            + ((p.month - 1) * this.daysPerMonth)
            + (p.day - 1);
    },

    getAbsoluteDayForDate(year, month, day) {
        return (year * this.monthsPerYear * this.daysPerMonth)
            + ((month - 1) * this.daysPerMonth)
            + (day - 1);
    },

    getNextExamAbsoluteDay(currentAbs) {
        const y = this.player.year;
        const a = this.getAbsoluteDayForDate(y, 1, 1);
        const b = this.getAbsoluteDayForDate(y, 7, 1);
        if (currentAbs <= a) return a;
        if (currentAbs <= b) return b;
        return this.getAbsoluteDayForDate(y + 1, 1, 1);
    },

    // ── Eventos próximos ─────────────────────────────────────

    async getUpcomingEvents(daysAhead) {
        const events = [];
        let d = this.player.day, m = this.player.month, y = this.player.year;

        for (let i = 0; i <= daysAhead; i++) {
            const temp = { ...this.player, day: d, month: m, year: y };
            if (temp.location === 'konoha' && temp.month === 5  && temp.day === 15) events.push(`Festival de Konoha (${i} día${i===1?'':'s'})`);
            if (temp.day === 15)                                                       events.push(`Luna Llena (${i} día${i===1?'':'s'})`);
            if (temp.location === 'konoha' && temp.day === 1  && (temp.month===1||temp.month===7)) events.push(`Examen Chunin (${i} día${i===1?'':'s'})`);
            if (temp.location === 'konoha' && temp.day === 30)                         events.push(`Torneo de la Aldea (${i} día${i===1?'':'s'})`);

            d++;
            if (d > this.daysPerMonth) { d = 1; m++; if (m > this.monthsPerYear) { m = 1; y++; } }
        }

        if (this.player.urgentMission) {
            const daysLeft = Math.ceil(this.player.urgentMission.turnsLeft / this.turnsPerDay);
            events.unshift(`🚨 Urgente: ${this.player.urgentMission.name} (${daysLeft} días)`);
        }
        if (this.player.blackMarketToday)     events.unshift('🕶️ Mercado Negro (hoy)');
        if (this.player.visitingMasterToday)  events.unshift('👤 Maestro visitante (hoy: 1 jutsu gratis)');

        return events.slice(0, 4);
    },

    isVillageScreenActive() {
        const el = document.getElementById('village-screen');
        return el && el.classList.contains('active');
    },

};
