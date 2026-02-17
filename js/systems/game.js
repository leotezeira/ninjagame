import { BASE_GAME } from '../content/data.js';

export function createGame() {
    const game = {
        ...BASE_GAME,

rollDice(sides = 20) {
            return Math.floor(Math.random() * sides) + 1;
        },

        showScreen(screenId) {
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            document.getElementById(screenId).classList.add('active');
        },

        showClanSelect() {
            const container = document.getElementById('clan-select');
            container.innerHTML = '';
            
            Object.keys(this.clans).forEach(clanKey => {
                const clan = this.clans[clanKey];
                const card = document.createElement('div');
                card.className = 'clan-card';
                card.onclick = () => this.selectClan(clanKey);
                
                card.innerHTML = `
                    <h3>${clan.icon} ${clan.name}</h3>
                    <p>${clan.description}</p>
                    <div class="clan-stats">
                        <div class="stat">❤️ HP: ${clan.hp}</div>
                        <div class="stat">💙 Chakra: ${clan.chakra}</div>
                        <div class="stat">👊 Taijutsu: ${clan.taijutsu}</div>
                        <div class="stat">🌀 Ninjutsu: ${clan.ninjutsu}</div>
                        <div class="stat">👁️ Genjutsu: ${clan.genjutsu}</div>
                    </div>
                `;
                
                container.appendChild(card);
            });
            
            this.showScreen('clan-screen');
        },

        selectClan(clanKey) {
            const clan = this.clans[clanKey];
            this.player = {
                clan: clan.name,
                clanKey: clanKey,
                maxHp: clan.hp,
                hp: clan.hp,
                maxChakra: clan.chakra,
                chakra: clan.chakra,
                taijutsu: clan.taijutsu,
                ninjutsu: clan.ninjutsu,
                genjutsu: clan.genjutsu,
                level: 1,
                exp: 0,
                expToNext: 100,
                ryo: 500,
                rank: 'Genin',
                element: clan.element,
                inventory: [],
                learnedJutsus: [],
                kekkeiGenkai: null,
                kekkeiLevel: 0,
                kekkeiExp: 0,
                permanentBonuses: {},
                combatsWon: 0,

                // Mundo / calendario
                location: 'konoha',
                day: 1,
                month: 1,
                year: 1024,
                timeOfDay: 0, // 0=mañana, 1=tarde, 2=noche, 3=madrugada
                weekday: 0, // 0..6
                weather: 'soleado',
                season: 'primavera',

                // Sistemas
                fatigue: 0, // 0..100
                team: [], // hasta 2 NPCs
                friendship: {}, // npcId -> 0..100
                reputation: {
                    konoha: 50,
                    bosque: 0,
                    olas: 0,
                    suna: 0,
                    kiri: 0,
                    iwa: 0,
                    kumo: 0,
                    ame: 0,
                    valle: 0,
                    nieve: 0
                },

                // Misiones con tiempo
                urgentMission: null
            };
            
            this.doKekkeiGenkaiRoll();
        },

        doKekkeiGenkaiRoll() {
            this.showScreen('kekkei-screen');
            
            setTimeout(() => {
                const roll = Math.random() * 100;
                let wonKekkei = null;
                
                for (let kg of this.kekkeiGenkaiList) {
                    if (roll <= kg.chance) {
                        wonKekkei = kg;
                        break;
                    }
                }
                
                const resultDiv = document.getElementById('kekkei-result');
                
                if (wonKekkei) {
                    this.player.kekkeiGenkai = wonKekkei;
                    this.player.kekkeiLevel = 1;
                    this.player.kekkeiExp = 0;
                    this.applyKekkeiGenkaiBonuses();
                    
                    resultDiv.innerHTML = `
                        <h2>🌟 ¡KEKKEI GENKAI DESBLOQUEADO! 🌟</h2>
                        <h1 style="font-size: 2.5em; margin: 20px 0;">${wonKekkei.name}</h1>
                        <p style="font-size: 1.2em;">${wonKekkei.levels[0].name}</p>
                        <p style="margin-top: 15px; color: #000;">¡Eres uno de los POCOS elegidos! (${kg.chance}% de probabilidad)</p>
                    `;
                } else {
                    resultDiv.innerHTML = `
                        <h2>Sorteo de Kekkei Genkai</h2>
                        <p style="font-size: 1.2em; margin: 20px 0;">No fuiste bendecido con un Kekkei Genkai...</p>
                        <p>Los Kekkei Genkai son extremadamente raros. Tu determinación te hará fuerte.</p>
                    `;
                    resultDiv.style.background = 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)';
                }
            }, 1000);
        },

        applyKekkeiGenkaiBonuses() {
            if (!this.player.kekkeiGenkai) return;
            
            const currentLevel = this.player.kekkeiGenkai.levels[this.player.kekkeiLevel - 1];
            const bonus = currentLevel.bonus;
            
            if (bonus.all) {
                this.player.taijutsu += bonus.all;
                this.player.ninjutsu += bonus.all;
                this.player.genjutsu += bonus.all;
            }
            if (bonus.taijutsu) this.player.taijutsu += bonus.taijutsu;
            if (bonus.ninjutsu) this.player.ninjutsu += bonus.ninjutsu;
            if (bonus.genjutsu) this.player.genjutsu += bonus.genjutsu;
            if (bonus.maxHp) {
                this.player.maxHp += bonus.maxHp;
                this.player.hp = this.player.maxHp;
            }
            if (bonus.maxChakra) {
                this.player.maxChakra += bonus.maxChakra;
                this.player.chakra = this.player.maxChakra;
            }
            
            this.player.critChance = bonus.critChance || 0;
            this.player.chakraRegen = bonus.chakraRegen || 0;
        },

        finishCharacterCreation() {
            this.showScreen('village-screen');
            this.updateVillageUI();
            this.showMissions();
            this.saveGame();
        },

        updateVillageUI() {
            document.getElementById('player-name-village').textContent = `${this.player.clan} Ninja`;
            document.getElementById('player-rank').textContent = this.player.rank;
            document.getElementById('player-level-village').textContent = this.player.level;
            document.getElementById('player-ryo').textContent = this.player.ryo;
            document.getElementById('player-exp-village').textContent = `${this.player.exp}/${this.player.expToNext}`;
            
            this.updateBar('village-health-bar', this.player.hp, this.player.maxHp, 'HP');
            this.updateBar('village-chakra-bar', this.player.chakra, this.player.maxChakra, 'Chakra');
            
            const kekkeiDisplay = document.getElementById('kekkei-display');
            if (this.player.kekkeiGenkai) {
                const currentLevel = this.player.kekkeiGenkai.levels[this.player.kekkeiLevel - 1];
                const nextLevel = this.player.kekkeiGenkai.levels[this.player.kekkeiLevel];
                
                let html = `<div class="kekkei-level">
                    <div style="text-align: center;">
                        <span style="background: linear-gradient(135deg, #ffd700, #ff8c00); color: #000; padding: 5px 15px; border-radius: 8px; font-weight: bold;">
                            ⚡ ${this.player.kekkeiGenkai.name} - ${currentLevel.name}
                        </span>
                    </div>`;
                
                if (nextLevel) {
                    const expNeeded = nextLevel.exp - this.player.kekkeiExp;
                    const progress = (this.player.kekkeiExp / nextLevel.exp) * 100;
                    html += `
                        <p style="margin-top: 10px; text-align: center; font-size: 0.9em;">
                            EXP Kekkei: ${this.player.kekkeiExp} / ${nextLevel.exp}
                        </p>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <p style="text-align: center; font-size: 0.85em; color: #ffd700;">
                            Próximo: ${nextLevel.name} (${expNeeded} EXP)
                        </p>`;
                } else {
                    html += `<p style="margin-top: 10px; text-align: center; color: #ffd700;">¡NIVEL MÁXIMO!</p>`;
                }
                
                html += `</div>`;
                kekkeiDisplay.innerHTML = html;
            } else {
                kekkeiDisplay.innerHTML = '';
            }
            
            const elementDisplay = document.getElementById('element-display');
            if (this.player.element) {
                const elem = this.elements[this.player.element];
                elementDisplay.innerHTML = `<span class="element-badge element-${this.player.element}">${elem.icon} ${elem.name}</span>`;
            }

            this.ensureWorldHUD();
            this.updateWorldHUD();
        },

        updateBar(elementId, current, max, label) {
            const bar = document.getElementById(elementId);
            const percentage = (current / max) * 100;
            bar.style.width = percentage + '%';
            bar.textContent = `${label}: ${Math.max(0, Math.floor(current))}/${max}`;
        },

        // -----------------------------
        // Mundo / calendario (núcleo)
        // -----------------------------
        migratePlayerSave() {
            if (!this.player) return;

            const defaults = {
                location: 'konoha',
                day: 1,
                month: 1,
                year: 1024,
                timeOfDay: 0,
                weekday: 0,
                weather: 'soleado',
                season: 'primavera',
                fatigue: 0,
                team: [],
                friendship: {},
                reputation: {
                    konoha: 50,
                    bosque: 0,
                    olas: 0,
                    suna: 0,
                    kiri: 0,
                    iwa: 0,
                    kumo: 0,
                    ame: 0,
                    valle: 0,
                    nieve: 0
                },
                urgentMission: null
            };

            for (const [key, value] of Object.entries(defaults)) {
                if (this.player[key] === undefined || this.player[key] === null) {
                    this.player[key] = (typeof structuredClone === 'function')
                        ? structuredClone(value)
                        : JSON.parse(JSON.stringify(value));
                }
            }

            // Normalizar
            this.player.fatigue = this.clamp(this.player.fatigue, 0, 100);
            this.player.timeOfDay = this.clamp(this.player.timeOfDay, 0, 3);
            this.player.weekday = this.clamp(this.player.weekday, 0, 6);
            this.player.day = this.clamp(this.player.day, 1, this.daysPerMonth);
            this.player.month = this.clamp(this.player.month, 1, this.monthsPerYear);
            this.player.year = Math.max(1, this.player.year);

            this.updateSeasonAndWeather(false);
        },

        clamp(value, min, max) {
            return Math.min(max, Math.max(min, value));
        },

        getSeasonFromMonth(month) {
            if (month >= 1 && month <= 3) return 'primavera';
            if (month >= 4 && month <= 6) return 'verano';
            if (month >= 7 && month <= 9) return 'otono';
            return 'invierno';
        },

        rollWeatherForSeason(season) {
            const options = this.weatherOptionsBySeason[season] || ['soleado'];
            const idx = Math.floor(Math.random() * options.length);
            return options[idx];
        },

        updateSeasonAndWeather(rollWeather = true) {
            this.player.season = this.getSeasonFromMonth(this.player.month);
            if (rollWeather) {
                this.player.weather = this.rollWeatherForSeason(this.player.season);
            }
        },

        getTimeOfDayLabel() {
            return this.timeOfDayNames[this.player.timeOfDay] || 'MAÑANA';
        },

        getSeasonLabel() {
            const map = { primavera: 'Primavera', verano: 'Verano', otono: 'Otoño', invierno: 'Invierno' };
            return map[this.player.season] || 'Primavera';
        },

        getWeatherLabel() {
            const map = { soleado: 'Soleado', nublado: 'Nublado', lluvia: 'Lluvia', tormenta: 'Tormenta', nieve: 'Nieve' };
            return map[this.player.weather] || 'Soleado';
        },

        addFatigue(amount) {
            this.player.fatigue = this.clamp(this.player.fatigue + amount, 0, 100);
        },

        reduceFatigue(amount) {
            this.player.fatigue = this.clamp(this.player.fatigue - amount, 0, 100);
        },

        getFatiguePenalty() {
            const f = this.player.fatigue;
            if (f <= 25) return 0;
            if (f <= 50) return 5;
            if (f <= 75) return 10;
            return 20;
        },

        checkFatigueFaint() {
            // 76-100%: riesgo de desmayo
            if (!this.player) return false;
            if (this.player.fatigue < 76) return false;

            const chance = 0.15;
            if (Math.random() >= chance) return false;

            this.disableCombatButtons();
            this.addCombatLog('😵 Te desmayas por la fatiga y pierdes tu turno.', 'log-miss');
            setTimeout(() => this.enemyTurn(), 1200);
            return true;
        },

        getEffectiveStats() {
            const penalty = this.getFatiguePenalty();
            const base = {
                taijutsu: this.player.taijutsu,
                ninjutsu: this.player.ninjutsu,
                genjutsu: this.player.genjutsu
            };

            const team = this.getTeamBonuses();
            return {
                taijutsu: Math.max(1, base.taijutsu - penalty),
                ninjutsu: Math.max(1, base.ninjutsu - penalty),
                genjutsu: Math.max(1, base.genjutsu - penalty),
                combatDamageBonus: team.combatDamageBonus,
                teamEvasionBonus: team.teamEvasionBonus,
                missionRyoMult: team.missionRyoMult,
                missionExpMult: team.missionExpMult,
                travelDayDelta: team.travelDayDelta,
                betweenCombatHealPct: team.betweenCombatHealPct
            };
        },

        getTeamBonuses() {
            const bonuses = {
                missionRyoMult: 1,
                missionExpMult: 1,
                travelDayDelta: 0,
                combatDamageBonus: 0,
                teamEvasionBonus: 0,
                betweenCombatHealPct: 0
            };

            const team = Array.isArray(this.player.team) ? this.player.team : [];
            if (team.length > 0) {
                // Viajar más rápido y seguro
                bonuses.travelDayDelta = -1;
            }

            for (const npcId of team) {
                const npc = this.recruitableNPCs[npcId];
                if (!npc) continue;
                if (npc.perk === 'mission_ryo') bonuses.missionRyoMult *= (1 + npc.perkValue);
                if (npc.perk === 'mission_exp') bonuses.missionExpMult *= (1 + npc.perkValue);
                if (npc.perk === 'combat_damage') bonuses.combatDamageBonus += npc.perkValue;
                if (npc.perk === 'team_evasion') bonuses.teamEvasionBonus += npc.perkValue;
                if (npc.perk === 'between_heal') bonuses.betweenCombatHealPct += npc.perkValue;
            }
            return bonuses;
        },

        advanceTurns(turns, reason = '') {
            if (!this.player) return;

            // Misiones urgentes: el tiempo corre con cualquier acción
            this.tickUrgentMission(turns);

            for (let i = 0; i < turns; i++) {
                // Avanza turno del día
                this.player.timeOfDay = (this.player.timeOfDay + 1) % this.turnsPerDay;

                // Regeneración pasiva muy leve por turno (afectada por tarde)
                const baseRegen = Math.max(1, Math.floor(this.player.maxChakra * 0.02));
                const regenMultiplier = this.player.timeOfDay === 1 ? 0.9 : 1; // tarde
                const regen = Math.floor(baseRegen * regenMultiplier);
                this.player.chakra = Math.min(this.player.maxChakra, this.player.chakra + regen);

                // Cambio de día
                if (this.player.timeOfDay === 0) {
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
                }
            }

            this.checkRecurringEvents();
            this.saveGame();

            if (this.isVillageScreenActive()) {
                this.updateVillageUI();
            }
        },

        isVillageScreenActive() {
            const el = document.getElementById('village-screen');
            return el && el.classList.contains('active');
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
                return;
            }

            // Si no pagás, se van
            alert('💸 No tienes Ryo para pagar al equipo. Los compañeros se han ido.');
            this.player.team = [];
        },

        checkRecurringEvents() {
            if (!this.player) return;
            // Solo mostramos popups en el inicio de cada mañana para no spamear
            if (this.player.timeOfDay !== 0) return;

            const todayEvents = this.recurringEvents.filter(e => {
                try { return e.when(this.player); } catch { return false; }
            });

            if (todayEvents.length > 0) {
                const names = todayEvents.map(e => `• ${e.name}`).join('\n');
                alert(`🗓️ Eventos de hoy:\n${names}`);
            }
        },

        checkRandomDailyEvents() {
            // Mercado negro (aleatorio)
            const chance = 0.07; // 7% al día
            const isActive = Math.random() < chance;
            this.player.blackMarketToday = isActive;
            if (!isActive) {
                this.player.blackMarketOffer = null;
            }

            // Inicio de mes: invasión 10%
            if (this.player.day === 1 && this.player.timeOfDay === 0) {
                if (Math.random() < 0.10 && this.player.location === 'konoha') {
                    this.spawnUrgentMission('🏯 Invasión de la aldea', 3);
                }
            }

            // Maestro visitante (aleatorio)
            if (Math.random() < 0.04 && this.player.location === 'konoha') {
                this.player.visitingMasterToday = true;
            } else {
                this.player.visitingMasterToday = false;
            }
        },

        getBlackMarketOffer() {
            if (!this.player.blackMarketToday) return null;
            const stamp = `${this.player.year}-${this.player.month}-${this.player.day}`;
            if (this.player.blackMarketOffer && this.player.blackMarketOffer.stamp === stamp) {
                return this.player.blackMarketOffer;
            }

            // Elegir un jutsu raro (prioriza master, luego jonin)
            const rarePool = [...(this.academyJutsus.master || []), ...(this.academyJutsus.jonin || [])];
            const available = rarePool.filter(j => !this.player.learnedJutsus?.some(l => l.name === j.name));
            const chosen = (available.length ? available : rarePool)[Math.floor(Math.random() * rarePool.length)];

            const base = Math.floor((chosen.price || 2000) * 1.5);
            const price = this.applyPriceDiscount(base);

            this.player.blackMarketOffer = {
                stamp,
                jutsu: chosen,
                name: chosen.name,
                rank: chosen.rank,
                price
            };

            return this.player.blackMarketOffer;
        },

        buyBlackMarketJutsu() {
            if (!this.player.blackMarketToday) {
                alert('El Mercado Negro no está disponible ahora.');
                return;
            }
            if (this.player.location !== 'konoha') {
                alert('Este contacto del Mercado Negro solo está en Konoha.');
                return;
            }
            if (this.player.timeOfDay === 3) {
                alert('Es madrugada. No es seguro comerciar ahora.');
                return;
            }

            const offer = this.getBlackMarketOffer();
            if (!offer) return;

            const already = this.player.learnedJutsus?.some(l => l.name === offer.jutsu.name);
            if (already) {
                alert('Ya aprendiste ese jutsu.');
                return;
            }
            if (this.player.ryo < offer.price) {
                alert('No tienes suficiente Ryo para el Mercado Negro.');
                return;
            }

            this.player.ryo -= offer.price;
            this.player.learnedJutsus.push(offer.jutsu);
            this.player.blackMarketToday = false;
            this.player.blackMarketOffer = null;
            alert(`🕶️ Compraste y aprendiste: ${offer.jutsu.name}`);
            this.updateVillageUI();
            this.showAcademy('master');
            this.saveGame();
        },

        spawnUrgentMission(title, daysLimit) {
            const turnsLimit = daysLimit * this.turnsPerDay;
            this.player.urgentMission = {
                name: title,
                createdAt: { day: this.player.day, month: this.player.month, year: this.player.year },
                turnsLeft: turnsLimit,
                ryoMultiplier: 2,
                expMultiplier: 1.2
            };
            alert(`🚨 MISIÓN URGENTE: ${title}\nTiempo límite: ${daysLimit} días`);
        },

        buildUrgentMissionTemplate() {
            // Plantilla simple (puede evolucionar a varias urgentes distintas)
            // Ajuste por rango del jugador
            const rank = (this.player.rank || 'Genin');
            let enemyType = 'genin';
            let count = 2;
            let baseRyo = 400;
            let baseExp = 120;
            if (rank === 'Chunin') { enemyType = 'chunin'; count = 2; baseRyo = 700; baseExp = 180; }
            else if (rank === 'Jonin') { enemyType = 'jonin'; count = 2; baseRyo = 1200; baseExp = 260; }
            else if (rank === 'ANBU' || rank === 'Kage') { enemyType = 'akatsuki'; count = 1; baseRyo = 1800; baseExp = 320; }

            return {
                name: this.player.urgentMission?.name || 'Misión urgente',
                rank: 'U',
                description: 'Requiere atención inmediata. Recompensa mejorada.',
                enemies: [{ type: enemyType, index: 0, count }],
                ryo: baseRyo,
                exp: baseExp,
                isUrgent: true,
                turns: 2
            };
        },

        startUrgentMission() {
            if (!this.player?.urgentMission) {
                alert('No tienes misiones urgentes activas.');
                return;
            }
            const urgent = this.player.urgentMission;
            const mission = this.buildUrgentMissionTemplate();
            mission.ryo = Math.floor(mission.ryo * (urgent.ryoMultiplier || 2));
            mission.exp = Math.floor(mission.exp * (urgent.expMultiplier || 1.2));
            this.startMission(mission);
        },

        tickUrgentMission(turnsPassed) {
            if (!this.player.urgentMission) return;
            this.player.urgentMission.turnsLeft -= turnsPassed;
            if (this.player.urgentMission.turnsLeft <= 0) {
                alert('⏳ Fallaste una misión urgente. Pierdes reputación.');
                this.applyReputationDelta(this.player.location, -10);
                this.player.urgentMission = null;
            }
        },

        applyReputationDelta(locationId, delta) {
            if (!this.player.reputation) this.player.reputation = {};
            const current = this.player.reputation[locationId] || 0;
            this.player.reputation[locationId] = this.clamp(current + delta, 0, 100);
        },

        getReputationTier(locationId) {
            const rep = (this.player.reputation && this.player.reputation[locationId]) || 0;
            if (rep <= 20) return 'Desconocido';
            if (rep <= 50) return 'Conocido';
            if (rep <= 80) return 'Respetado';
            return 'Héroe';
        },

        getReputationDiscount(locationId) {
            const rep = (this.player.reputation && this.player.reputation[locationId]) || 0;
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
            if (this.isFestivalActive()) {
                price = Math.floor(price * 0.5);
            }
            price = Math.floor(price * (1 - repDiscount));
            return Math.max(1, price);
        },

        // -----------------------------
        // HUD Calendario (inyectada)
        // -----------------------------
        ensureWorldHUD() {
            const village = document.getElementById('village-screen');
            if (!village) return;

            let hud = document.getElementById('world-hud');
            if (hud) return;

            hud = document.createElement('div');
            hud.id = 'world-hud';
            hud.className = 'player-info';
            hud.style.marginTop = '15px';
            hud.style.borderColor = 'rgba(52, 152, 219, 0.55)';

            // Insertar luego del primer .player-info (info del jugador)
            const firstInfo = village.querySelector('.player-info');
            if (firstInfo && firstInfo.parentNode) {
                firstInfo.parentNode.insertBefore(hud, firstInfo.nextSibling);
            } else {
                village.insertBefore(hud, village.firstChild);
            }

            hud.innerHTML = `
                <div style="display:flex; gap:12px; flex-wrap:wrap; align-items:center; justify-content:space-between;">
                    <div>
                        <div style="color:#ff8c00; font-weight:bold;">🗓️ <span id="hud-date"></span></div>
                        <div style="margin-top:4px;">
                            <span style="background: rgba(255,140,0,0.18); border:1px solid rgba(255,140,0,0.35); padding:4px 10px; border-radius:999px; font-weight:bold; display:inline-block;">
                                <span id="hud-time"></span>
                            </span>
                            <span style="margin-left:8px; color: rgba(240,240,240,0.85);">🌿 <span id="hud-season"></span></span>
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <div>📍 Ubicación: <b id="hud-location"></b></div>
                        <div style="margin-top:4px;">🌡️ Clima: <b id="hud-weather"></b></div>
                    </div>
                </div>
                <div style="margin-top:12px; display:grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap:10px;">
                    <div class="info-item">😓 Fatiga: <b id="hud-fatigue"></b></div>
                    <div class="info-item">👥 Equipo: <b id="hud-team"></b></div>
                    <div class="info-item">🏅 Reputación: <b id="hud-rep"></b></div>
                </div>
                <div style="margin-top:12px;">
                    <div style="color:#ff8c00; font-weight:bold;">PRÓXIMOS EVENTOS:</div>
                    <div id="hud-events" style="margin-top:6px; font-size:0.95em;"></div>
                </div>
                <div style="margin-top:12px; text-align:center;">
                    <button class="btn btn-small" onclick="game.restInVillage()">Descansar (+1 turno)</button>
                    <button class="btn btn-small btn-secondary" onclick="game.sleepInVillage()">Dormir (+2 turnos)</button>
                    <button class="btn btn-small" onclick="game.toggleTravelPanel()">Viajar</button>
                    <button class="btn btn-small" onclick="game.activateVillageTab('missions')">Misión</button>
                    <button class="btn btn-small" onclick="game.activateVillageTab('training')">Entrenar</button>
                    <button class="btn btn-small" onclick="game.activateVillageTab('shop')">Tienda</button>
                </div>
                <div id="travel-panel" style="display:none; margin-top:12px; padding-top:12px; border-top:1px solid rgba(74,85,131,0.45);">
                    <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center; justify-content:space-between;">
                        <div style="color:#ff8c00; font-weight:bold;">🧭 Viaje</div>
                        <div style="font-size:0.9em; color: rgba(240,240,240,0.78);">Cada día consume 10% Chakra y puede haber encuentros</div>
                    </div>
                    <div style="margin-top:10px; display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div>
                            <div style="margin-bottom:6px;">Destino</div>
                            <select id="travel-destination" style="width:100%; padding:10px; border-radius:8px; background: rgba(0,0,0,0.4); color:#fff; border:1px solid rgba(74,85,131,0.6);"></select>
                        </div>
                        <div>
                            <div style="margin-bottom:6px;">Opciones</div>
                            <label style="display:flex; gap:8px; align-items:center; background: rgba(0,0,0,0.25); padding:10px; border-radius:8px; border:1px solid rgba(74,85,131,0.4);">
                                <input type="checkbox" id="travel-group" />
                                Viajar en grupo (+1 día, más seguro)
                            </label>
                        </div>
                    </div>
                    <div style="margin-top:10px; text-align:center;">
                        <button class="btn btn-small" onclick="game.startTravelFromHUD()">Iniciar viaje</button>
                        <button class="btn btn-small btn-secondary" onclick="game.toggleRecruitPanel()">Reclutar equipo</button>
                    </div>
                    <div id="recruit-panel" style="display:none; margin-top:10px;"></div>
                </div>
            `;

            this.populateTravelDestinations();
            this.renderRecruitPanel();
        },

        updateWorldHUD() {
            const hud = document.getElementById('world-hud');
            if (!hud || !this.player) return;

            const loc = this.locations[this.player.location] || { name: this.player.location, icon: '📍' };
            const dateText = `${this.monthNames[this.player.month - 1]}, Día ${this.player.day}, Año ${this.player.year} · ${this.weekdayNames[this.player.weekday]}`;
            document.getElementById('hud-date').textContent = dateText;
            document.getElementById('hud-time').textContent = `${this.getTimeOfDayLabel()}`;
            document.getElementById('hud-season').textContent = this.getSeasonLabel();
            document.getElementById('hud-location').textContent = `${loc.icon} ${loc.name}`;
            document.getElementById('hud-weather').textContent = this.getWeatherLabel();
            document.getElementById('hud-fatigue').textContent = `${this.player.fatigue}%`;

            const teamNames = (this.player.team || []).map(id => this.recruitableNPCs[id]?.name || id);
            document.getElementById('hud-team').textContent = teamNames.length ? teamNames.join(', ') : 'Solo';

            const rep = (this.player.reputation && this.player.reputation[this.player.location]) || 0;
            document.getElementById('hud-rep').textContent = `${rep} (${this.getReputationTier(this.player.location)})`;

            const events = this.getUpcomingEvents(7);
            const eventsDiv = document.getElementById('hud-events');
            if (events.length === 0) {
                eventsDiv.textContent = '• Ninguno';
            } else {
                eventsDiv.innerHTML = events.map(e => `• ${e}`).join('<br>');
            }

            this.populateTravelDestinations();
            this.renderRecruitPanel();
        },

        getUpcomingEvents(daysAhead) {
            const events = [];

            // Copia ligera del calendario
            let d = this.player.day;
            let m = this.player.month;
            let y = this.player.year;
            let loc = this.player.location;

            for (let i = 0; i <= daysAhead; i++) {
                const temp = { ...this.player, day: d, month: m, year: y, location: loc };

                // Festival
                if (temp.location === 'konoha' && temp.month === 5 && temp.day === 15) {
                    const inDays = i;
                    events.push(`Festival de Konoha (${inDays} día${inDays === 1 ? '' : 's'})`);
                }

                // Luna llena
                if (temp.day === 15) {
                    const inDays = i;
                    events.push(`Luna Llena (${inDays} día${inDays === 1 ? '' : 's'})`);
                }

                // Examen
                if (temp.location === 'konoha' && temp.day === 1 && (temp.month === 1 || temp.month === 7)) {
                    const inDays = i;
                    events.push(`Examen Chunin (${inDays} día${inDays === 1 ? '' : 's'})`);
                }

                // Torneo
                if (temp.location === 'konoha' && temp.day === 30) {
                    const inDays = i;
                    events.push(`Torneo de la Aldea (${inDays} día${inDays === 1 ? '' : 's'})`);
                }

                // avanzar 1 día
                d += 1;
                if (d > this.daysPerMonth) {
                    d = 1;
                    m += 1;
                    if (m > this.monthsPerYear) {
                        m = 1;
                        y += 1;
                    }
                }
            }

            // Urgente
            if (this.player.urgentMission) {
                const turnsLeft = this.player.urgentMission.turnsLeft;
                const daysLeft = Math.ceil(turnsLeft / this.turnsPerDay);
                events.unshift(`🚨 Urgente: ${this.player.urgentMission.name} (${daysLeft} días)`);
            }

            // Mercado negro
            if (this.player.blackMarketToday) {
                events.unshift('🕶️ Mercado Negro (hoy)');
            }

            // Maestro visitante
            if (this.player.visitingMasterToday) {
                events.unshift('👤 Maestro visitante (hoy: 1 jutsu gratis)');
            }

            return events.slice(0, 4);
        },

        activateVillageTab(tabName) {
            // Tabs principales del village (misiones/academia/tienda/entrenamiento/stats)
            const village = document.getElementById('village-screen');
            if (!village) return;

            // Activar contenido
            village.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            const activeContent = document.getElementById(tabName + '-tab');
            if (activeContent) activeContent.classList.add('active');

            // Activar botón por onclick
            village.querySelectorAll('.tabs .tab-btn').forEach(btn => {
                const oc = btn.getAttribute('onclick') || '';
                if (oc.includes(`showTab('${tabName}')`)) btn.classList.add('active');
                else if (oc.includes("showTab('")) btn.classList.remove('active');
            });

            if (tabName === 'missions') this.showMissions();
            else if (tabName === 'academy') this.showAcademy('genin');
            else if (tabName === 'shop') this.showShop();
            else if (tabName === 'training') this.showTraining();
            else if (tabName === 'stats') this.showStats();
        },

        toggleTravelPanel() {
            const el = document.getElementById('travel-panel');
            if (!el) return;
            el.style.display = el.style.display === 'none' ? 'block' : 'none';
        },

        populateTravelDestinations() {
            const sel = document.getElementById('travel-destination');
            if (!sel) return;
            const current = this.player?.location;
            const opts = Object.entries(this.locations)
                .filter(([id, info]) => id !== current)
                .map(([id, info]) => ({ id, label: `${info.icon} ${info.name}` }));

            const previous = sel.value;
            sel.innerHTML = opts.map(o => `<option value="${o.id}">${o.label}</option>`).join('');
            if (previous && opts.some(o => o.id === previous)) sel.value = previous;
        },

        toggleRecruitPanel() {
            const el = document.getElementById('recruit-panel');
            if (!el) return;
            el.style.display = el.style.display === 'none' ? 'block' : 'none';
        },

        renderRecruitPanel() {
            const el = document.getElementById('recruit-panel');
            if (!el || !this.player) return;

            const team = new Set(this.player.team || []);
            const canAdd = team.size < 2;

            const rows = Object.values(this.recruitableNPCs).map(npc => {
                const inTeam = team.has(npc.id);
                const disabled = (!inTeam && !canAdd);
                const btnLabel = inTeam ? 'Quitar' : 'Reclutar';
                const btnClass = inTeam ? 'btn btn-small btn-secondary' : 'btn btn-small';
                const onclick = inTeam
                    ? `game.dismissTeammate('${npc.id}')`
                    : `game.recruitTeammate('${npc.id}')`;
                const safe = disabled ? 'disabled' : '';

                return `
                    <div class="shop-item" style="margin:8px 0;">
                        <h4>👥 ${npc.name}</h4>
                        <p>💰 ${npc.costPerDay} Ryo/día</p>
                        <p style="font-size:0.9em;">${this.describeNpcPerk(npc)}</p>
                        <button class="${btnClass}" onclick="${onclick}" ${safe}>${btnLabel}</button>
                    </div>
                `;
            });

            el.innerHTML = `
                <div style="color:#ff8c00; font-weight:bold; margin-bottom:8px;">Equipo (máx. 2 compañeros)</div>
                ${rows.join('')}
            `;
        },

        describeNpcPerk(npc) {
            switch (npc.perk) {
                case 'mission_ryo': return `+${Math.round(npc.perkValue * 100)}% Ryo en misiones`;
                case 'mission_exp': return `+${Math.round(npc.perkValue * 100)}% EXP en misiones`;
                case 'combat_damage': return `+${npc.perkValue} daño físico (auto)`;
                case 'team_evasion': return `+${Math.round(npc.perkValue * 100)}% evasión del equipo`;
                case 'between_heal': return `Cura entre combates (+${Math.round(npc.perkValue * 100)}% HP)`;
                default: return 'Apoyo';
            }
        },

        recruitTeammate(npcId) {
            if (!this.player) return;
            const npc = this.recruitableNPCs[npcId];
            if (!npc) return;
            this.player.team = Array.isArray(this.player.team) ? this.player.team : [];
            if (this.player.team.includes(npcId)) return;
            if (this.player.team.length >= 2) {
                alert('Tu equipo ya está completo (máx. 2 compañeros).');
                return;
            }
            this.player.team.push(npcId);
            this.player.friendship[npcId] = this.player.friendship[npcId] ?? 0;
            alert(`👥 ${npc.name} se unió a tu equipo.`);
            this.updateVillageUI();
            this.saveGame();
        },

        dismissTeammate(npcId) {
            if (!this.player || !Array.isArray(this.player.team)) return;
            this.player.team = this.player.team.filter(id => id !== npcId);
            alert('Compañero removido del equipo.');
            this.updateVillageUI();
            this.saveGame();
        },

        startTravelFromHUD() {
            const sel = document.getElementById('travel-destination');
            if (!sel) return;
            const destination = sel.value;
            const groupTravel = document.getElementById('travel-group')?.checked || false;
            this.travel(destination, { groupTravel });
        },

        travel(destination, opts = {}) {
            if (!this.player) return;
            if (!destination || !this.locations[destination]) {
                alert('Destino inválido.');
                return;
            }
            if (destination === this.player.location) {
                alert('Ya estás en ese lugar.');
                return;
            }

            // No viajar si estás en combate
            if (document.getElementById('combat-screen')?.classList.contains('active')) {
                alert('No puedes viajar en medio de un combate.');
                return;
            }

            const groupTravel = !!opts.groupTravel;
            const travelDays = this.getTravelDays(this.player.location, destination, { groupTravel });

            this.player.travelState = {
                from: this.player.location,
                to: destination,
                remainingDays: travelDays,
                groupTravel,
                startedAt: { day: this.player.day, month: this.player.month, year: this.player.year }
            };

            const fromLoc = this.locations[this.player.location];
            const toLoc = this.locations[destination];
            alert(`🧭 Viaje iniciado: ${fromLoc.icon} ${fromLoc.name} → ${toLoc.icon} ${toLoc.name}\nDuración estimada: ${travelDays} día(s)`);

            this.processNextTravelDay();
        },

        getTravelDays(fromId, toId, opts = {}) {
            const groupTravel = !!opts.groupTravel;

            const getKonohaDistance = (id) => {
                if (id === 'konoha') return 0;
                return this.locations[id]?.daysFromKonoha ?? 4;
            };

            let baseDays = 0;
            if (fromId === 'konoha' || toId === 'konoha') {
                const other = fromId === 'konoha' ? toId : fromId;
                baseDays = Math.max(1, getKonohaDistance(other));
            } else {
                // simplificación: via Konoha (hub)
                baseDays = Math.max(2, getKonohaDistance(fromId) + getKonohaDistance(toId));
            }

            // Estación y clima
            if (this.player.season === 'invierno') baseDays += 1;
            if (this.player.weather === 'lluvia') baseDays += 1;
            if (this.player.weather === 'tormenta') baseDays += 2;
            if (this.player.weather === 'nieve') baseDays += 1;

            // Viajar en grupo (más seguro, pero más lento)
            if (groupTravel) baseDays += 1;

            // Equipo acelera (-1 día)
            const team = Array.isArray(this.player.team) ? this.player.team : [];
            if (team.length > 0) baseDays = Math.max(1, baseDays - 1);

            return baseDays;
        },

        getTravelEncounterChance(groupTravel) {
            let chance = 0.25;
            if (this.player.weather === 'tormenta' || this.player.weather === 'nieve') chance += 0.10;
            if (this.player.weather === 'lluvia') chance += 0.05;

            const team = Array.isArray(this.player.team) ? this.player.team : [];
            if (team.length > 0) chance -= 0.05;
            if (groupTravel) chance -= 0.08;

            return this.clamp(chance, 0.05, 0.60);
        },

        processNextTravelDay() {
            if (!this.player?.travelState) return;

            const state = this.player.travelState;
            if (state.remainingDays <= 0) {
                this.finishTravelArrival();
                return;
            }

            state.remainingDays -= 1;

            // Costos del día
            const chakraCost = Math.max(1, Math.floor(this.player.maxChakra * 0.10));
            this.player.chakra = Math.max(0, this.player.chakra - chakraCost);
            this.addFatigue(5);
            this.advanceTurns(this.turnsPerDay, 'travel');

            // Encuentro aleatorio
            const encounterChance = this.getTravelEncounterChance(state.groupTravel);
            const hasEncounter = Math.random() < encounterChance;

            if (hasEncounter) {
                const enemy = this.generateTravelEncounterEnemy(state.to);
                this.startTravelEncounter(enemy);
                return;
            }

            // Continuar viaje
            if (state.remainingDays <= 0) {
                this.finishTravelArrival();
                return;
            }

            // Feedback mínimo
            this.updateVillageUI();
            setTimeout(() => this.processNextTravelDay(), 300);
        },

        generateTravelEncounterEnemy(destinationId) {
            const dist = this.locations[destinationId]?.daysFromKonoha ?? 4;
            let poolKey = 'genin';
            if (dist <= 3) poolKey = 'genin';
            else if (dist <= 5) poolKey = 'chunin';
            else if (dist <= 7) poolKey = 'jonin';
            else poolKey = 'akatsuki';

            const pool = this.enemies[poolKey] || this.enemies.genin;
            const tpl = pool[Math.floor(Math.random() * pool.length)];
            const enemy = { ...tpl, maxHp: tpl.hp, maxChakra: tpl.chakra };

            // Escala suave por distancia
            const scale = 1 + Math.min(0.35, dist * 0.03);
            enemy.hp = Math.floor(enemy.hp * scale);
            enemy.maxHp = enemy.hp;
            enemy.attack = Math.floor(enemy.attack * scale);
            enemy.defense = Math.floor(enemy.defense * scale);
            return enemy;
        },

        startTravelEncounter(enemy) {
            this.currentMission = {
                name: 'Encuentro en el camino',
                rank: 'E',
                description: 'Un enemigo intercepta tu ruta.',
                enemies: [],
                ryo: 60,
                exp: 30,
                isTravelEncounter: true
            };
            this.currentEnemy = enemy;
            this.enemyQueue = [];
            this.totalWaves = 1;
            this.currentWave = 1;
            this.startCombat();
        },

        finishTravelArrival() {
            const state = this.player.travelState;
            const toId = state.to;
            const toLoc = this.locations[toId];
            this.player.location = toId;
            this.player.travelState = null;
            alert(`📍 Has llegado a ${toLoc.icon} ${toLoc.name}.`);
            this.updateVillageUI();
            this.saveGame();
        },

        sleepInVillage() {
            if (!this.player) return;
            // +2 turnos, recupera todo y reduce fatiga 50%
            this.player.hp = this.player.maxHp;
            this.player.chakra = this.player.maxChakra;
            this.player.fatigue = Math.floor(this.player.fatigue * 0.5);
            this.advanceTurns(2, 'sleep');
            alert('😴 Dormiste 12 horas. HP/Chakra restaurados y fatiga reducida.');
        },

        showTab(tabName) {
            // Wrapper para onclick inline sin depender de `event`
            this.activateVillageTab(tabName);
        },

        showMissions() {
            const missionList = document.getElementById('mission-list');
            missionList.innerHTML = '';

            if (this.player.urgentMission) {
                const turnsLeft = this.player.urgentMission.turnsLeft;
                const daysLeft = Math.ceil(turnsLeft / this.turnsPerDay);
                const urgentCard = document.createElement('div');
                urgentCard.className = 'mission-card';
                urgentCard.style.borderLeftColor = '#c0392b';
                urgentCard.style.background = 'rgba(192, 57, 43, 0.18)';
                urgentCard.onclick = () => this.startUrgentMission();
                urgentCard.innerHTML = `
                    <h4>🚨 ${this.player.urgentMission.name} [URGENTE]</h4>
                    <p>Tiempo límite: ${daysLeft} día(s) · Recompensa x${this.player.urgentMission.ryoMultiplier || 2}</p>
                    <p style="color:#ffd700; margin-top:8px;">Si fallas: -Reputación</p>
                `;
                missionList.appendChild(urgentCard);
            }
            
            let availableMissions = [];
            
            if (this.player.rank === 'Genin') {
                availableMissions = this.missions.genin;
            } else if (this.player.rank === 'Chunin') {
                availableMissions = this.missions.chunin;
            } else if (this.player.rank === 'Jonin') {
                availableMissions = this.missions.jonin;
            } else if (this.player.rank === 'ANBU' || this.player.rank === 'Kage') {
                availableMissions = this.missions.kage;
            }
            
            availableMissions.forEach(mission => {
                const card = document.createElement('div');
                card.className = 'mission-card';
                card.onclick = () => this.startMission(mission);

                const rank = (mission.rank || '').toUpperCase();
                const turnCostByRank = { D: 1, C: 2, B: 3, A: 4, S: 4 };
                const turns = mission.turns ?? (turnCostByRank[rank] ?? 2);

                const team = this.getTeamBonuses();
                const nightRyoMult = this.player.timeOfDay === 2 ? 1.2 : 1;
                const estRyo = Math.floor(mission.ryo * (team.missionRyoMult || 1) * nightRyoMult);
                const estExp = Math.floor(mission.exp * (team.missionExpMult || 1));
                
                card.innerHTML = `
                    <h4>📜 ${mission.name} [Rango ${mission.rank}]</h4>
                    <p>${mission.description}</p>
                    <p style="color: #ffd700; margin-top: 8px;">Recompensa: ${estRyo} Ryo | ${estExp} EXP</p>
                    <p style="opacity: 0.85; margin-top: 6px;">⏱️ Tiempo: ${turns} turno(s)</p>
                `;
                
                missionList.appendChild(card);
            });
        },

        showAcademy(rank) {
            const jutsuList = document.getElementById('academy-jutsu-list');
            jutsuList.innerHTML = '';

            if (this.player.location !== 'konoha') {
                jutsuList.innerHTML = '<div class="story-text">📍 La Academia Ninja solo está disponible en Konoha.</div>';
                return;
            }
            if (this.player.timeOfDay === 3) {
                jutsuList.innerHTML = '<div class="story-text">🌙 Es madrugada. La Academia está cerrada.</div>';
                return;
            }
            
            const jutsus = this.academyJutsus[rank] || [];
            
            jutsus.forEach(jutsu => {
                const isLearned = this.player.learnedJutsus.some(j => j.name === jutsu.name);
                const finalPrice = this.applyPriceDiscount(jutsu.price);
                
                const card = document.createElement('div');
                card.className = isLearned ? 'learned-jutsu' : 'jutsu-card';
                
                if (!isLearned) {
                    card.onclick = () => this.learnJutsu(jutsu);
                }
                
                card.innerHTML = `
                    <h4>${isLearned ? '✅' : '📖'} ${jutsu.name} [${jutsu.rank}]</h4>
                    <p>${jutsu.description}</p>
                    <p style="margin-top: 5px;">💙 ${jutsu.chakra} Chakra | ${jutsu.damage > 0 ? `⚔️ ${jutsu.damage} daño` : '🌀 Efecto especial'}</p>
                    <p style="color: ${isLearned ? '#2ecc71' : '#ffd700'}; margin-top: 8px;">
                        ${isLearned ? 'APRENDIDO' : `💰 ${finalPrice} Ryo`}
                    </p>
                `;
                
                jutsuList.appendChild(card);
            });

            if (this.player.blackMarketToday) {
                const offer = this.getBlackMarketOffer();
                const card = document.createElement('div');
                card.className = 'mission-card';
                card.style.borderLeftColor = '#95a5a6';
                card.onclick = () => this.buyBlackMarketJutsu();
                card.innerHTML = `
                    <h4>🕶️ Mercado Negro: ${offer.name} [${offer.rank}]</h4>
                    <p>Oferta del día (jutsu raro). Precio especial.</p>
                    <p style="color:#ffd700; margin-top: 8px;">💰 ${offer.price} Ryo</p>
                `;
                jutsuList.appendChild(card);
            }
        },

        showJutsuRank(rank) {
            const academyTab = document.getElementById('academy-tab');
            if (academyTab) {
                // Solo los botones de rango dentro del panel de Academia
                const rankButtons = academyTab.querySelectorAll('.tabs .tab-btn');
                rankButtons.forEach(btn => btn.classList.remove('active'));
                rankButtons.forEach(btn => {
                    const oc = btn.getAttribute('onclick') || '';
                    if (oc.includes(`showJutsuRank('${rank}')`)) btn.classList.add('active');
                });
            }

            this.showAcademy(rank);
        },

        learnJutsu(jutsu) {
            if (this.player.location !== 'konoha') {
                alert('La Academia solo está disponible en Konoha.');
                return;
            }
            if (this.player.timeOfDay === 3) {
                alert('Es madrugada. La Academia está cerrada.');
                return;
            }
            
            const alreadyLearned = this.player.learnedJutsus.some(j => j.name === jutsu.name);
            if (alreadyLearned) {
                alert('Ya aprendiste este jutsu!');
                return;
            }

            let finalPrice = this.applyPriceDiscount(jutsu.price);
            if (this.player.visitingMasterToday) {
                finalPrice = 0;
                this.player.visitingMasterToday = false;
                alert('👤 Maestro visitante: aprendés este jutsu gratis (una vez).');
            }

            if (this.player.ryo < finalPrice) {
                alert('¡No tienes suficiente Ryo!');
                return;
            }
            
            this.player.ryo -= finalPrice;
            this.player.learnedJutsus.push(jutsu);
            
            alert(`¡Has aprendido ${jutsu.name}!`);
            this.updateVillageUI();

            // Refrescar la academia en el rango activo
            const activeRankBtn = document.querySelector('#academy-tab .tabs .tab-btn.active');
            const label = (activeRankBtn?.textContent || 'Genin').toLowerCase().trim();
            const map = { genin: 'genin', chunin: 'chunin', jonin: 'jonin', maestros: 'master' };
            this.showAcademy(map[label] || 'genin');
            this.saveGame();
        },

        showShop() {
            const shopList = document.getElementById('shop-list');
            if (this.player.location !== 'konoha') {
                shopList.innerHTML = '<div class="story-text">📍 La Tienda de la Aldea solo está disponible en Konoha.</div>';
                return;
            }
            if (this.player.timeOfDay === 3) {
                shopList.innerHTML = '<div class="story-text">🌙 Es madrugada. La tienda está cerrada.</div>';
                return;
            }

            const festivalNote = this.isFestivalActive() ? ' (🎉 Festival: -50%)' : '';
            shopList.innerHTML = `<h4 style="grid-column: 1/-1; color: #ff8c00;">Consumibles${festivalNote}</h4>`;
            
            this.shopItems.consumables.forEach(item => {
                const card = this.createShopCard(item);
                shopList.appendChild(card);
            });
            
            shopList.innerHTML += '<h4 style="grid-column: 1/-1; color: #ff8c00; margin-top: 20px;">Armas</h4>';
            this.shopItems.weapons.forEach(item => {
                const card = this.createShopCard(item);
                shopList.appendChild(card);
            });
            
            shopList.innerHTML += '<h4 style="grid-column: 1/-1; color: #ff8c00; margin-top: 20px;">Armaduras</h4>';
            this.shopItems.armor.forEach(item => {
                const card = this.createShopCard(item);
                shopList.appendChild(card);
            });
        },

        createShopCard(item) {
            const card = document.createElement('div');
            card.className = 'shop-item';

            const finalPrice = this.applyPriceDiscount(item.price);
            const priceHtml = finalPrice < item.price
                ? `💰 ${finalPrice} Ryo <span style="opacity:0.75; text-decoration:line-through; margin-left:6px;">${item.price}</span>`
                : `💰 ${item.price} Ryo`;
            
            card.innerHTML = `
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <p class="price">${priceHtml}</p>
                <button class="btn btn-small" onclick='game.buyItem(${JSON.stringify(item).replace(/'/g, "\\'")})'>Comprar</button>
            `;
            
            return card;
        },

        buyItem(item) {
            if (this.player.location !== 'konoha') {
                alert('La tienda solo está disponible en Konoha.');
                return;
            }
            if (this.player.timeOfDay === 3) {
                alert('Es madrugada. La tienda está cerrada.');
                return;
            }

            const finalPrice = this.applyPriceDiscount(item.price);
            if (this.player.ryo < finalPrice) {
                alert('¡No tienes suficiente Ryo!');
                return;
            }
            
            this.player.ryo -= finalPrice;
            
            if (item.effect.hp || item.effect.chakra || item.effect.buff) {
                this.player.inventory.push({ name: item.name, effect: item.effect });
                alert(`¡Compraste ${item.name}! Ahora está en tu inventario.`);
            } else {
                if (item.effect.taijutsu) this.player.taijutsu += item.effect.taijutsu;
                if (item.effect.maxHp) {
                    this.player.maxHp += item.effect.maxHp;
                    this.player.hp += item.effect.maxHp;
                }
                alert(`¡Compraste ${item.name}! Tus stats han mejorado.`);
            }
            
            this.updateVillageUI();
            this.saveGame();
        },

        showTraining() {
            const trainingList = document.getElementById('training-list');
            if (this.player.location !== 'konoha') {
                trainingList.innerHTML = '<div class="story-text">📍 El Centro de Entrenamiento solo está disponible en Konoha.</div>';
                return;
            }
            if (this.player.timeOfDay === 3) {
                trainingList.innerHTML = '<div class="story-text">🌙 Es madrugada. El centro de entrenamiento está cerrado.</div>';
                return;
            }

            trainingList.innerHTML = '';
            
            this.training.forEach(item => {
                const card = document.createElement('div');
                card.className = 'shop-item';

                const finalPrice = this.applyPriceDiscount(item.price);
                const priceHtml = finalPrice < item.price
                    ? `💰 ${finalPrice} Ryo <span style="opacity:0.75; text-decoration:line-through; margin-left:6px;">${item.price}</span>`
                    : `💰 ${item.price} Ryo`;
                
                card.innerHTML = `
                    <h4>${item.name}</h4>
                    <p>${item.description}</p>
                    <p class="price">${priceHtml}</p>
                    <button class="btn btn-small" onclick='game.doTraining(${JSON.stringify(item).replace(/'/g, "\\'")})'>Entrenar</button>
                `;
                
                trainingList.appendChild(card);
            });
        },

        doTraining(item) {
            if (this.player.location !== 'konoha') {
                alert('El entrenamiento solo está disponible en Konoha.');
                return;
            }
            if (this.player.timeOfDay === 3) {
                alert('Es madrugada. El centro de entrenamiento está cerrado.');
                return;
            }

            const finalPrice = this.applyPriceDiscount(item.price);
            if (this.player.ryo < finalPrice) {
                alert('¡No tienes suficiente Ryo!');
                return;
            }
            
            // +1 turno y fatiga
            this.addFatigue(8);
            this.advanceTurns(1, 'training');

            this.player.ryo -= finalPrice;

            // Efectividad por estación
            let eff = 1;
            if (this.player.season === 'primavera') eff = 1.1;
            if (this.player.season === 'invierno') eff = 0.9;
            
            if (item.effect.taijutsu) this.player.taijutsu += Math.max(1, Math.floor(item.effect.taijutsu * eff));
            if (item.effect.ninjutsu) this.player.ninjutsu += Math.max(1, Math.floor(item.effect.ninjutsu * eff));
            if (item.effect.genjutsu) this.player.genjutsu += Math.max(1, Math.floor(item.effect.genjutsu * eff));
            if (item.effect.maxChakra) {
                const gain = Math.max(1, Math.floor(item.effect.maxChakra * eff));
                this.player.maxChakra += gain;
                this.player.chakra += gain;
            }
            if (item.effect.maxHp) {
                const gain = Math.max(1, Math.floor(item.effect.maxHp * eff));
                this.player.maxHp += gain;
                this.player.hp += gain;
            }
            
            alert(`¡Entrenamiento completado! ${item.name}`);
            this.updateVillageUI();
            this.saveGame();
        },

        showStats() {
            const statsDisplay = document.getElementById('stats-display');
            statsDisplay.innerHTML = `
                <div class="player-info">
                    <h3 style="color: #ff8c00;">${this.player.clan} Ninja</h3>
                    <div class="info-grid">
                        <div class="info-item">❤️ HP: ${Math.floor(this.player.hp)}/${this.player.maxHp}</div>
                        <div class="info-item">💙 Chakra: ${Math.floor(this.player.chakra)}/${this.player.maxChakra}</div>
                        <div class="info-item">👊 Taijutsu: ${this.player.taijutsu}</div>
                        <div class="info-item">🌀 Ninjutsu: ${this.player.ninjutsu}</div>
                        <div class="info-item">👁️ Genjutsu: ${this.player.genjutsu}</div>
                        <div class="info-item">⭐ Nivel: ${this.player.level}</div>
                        <div class="info-item">🥷 Rango: ${this.player.rank}</div>
                        <div class="info-item">💰 Ryo: ${this.player.ryo}</div>
                        <div class="info-item">🏆 Combates: ${this.player.combatsWon}</div>
                    </div>
                    <div style="margin-top: 20px;">
                        <h4 style="color: #ff8c00;">📚 Jutsus Aprendidos (${this.player.learnedJutsus.length})</h4>
                        ${this.player.learnedJutsus.length === 0 ? '<p>Ninguno - Ve a la Academia</p>' : 
                            this.player.learnedJutsus.map(jutsu => `<div class="stat">${jutsu.name} [${jutsu.rank}]</div>`).join('')}
                    </div>
                    <div style="margin-top: 20px;">
                        <h4 style="color: #ff8c00;">🎒 Inventario (${this.player.inventory.length})</h4>
                        ${this.player.inventory.length === 0 ? '<p>Vacío</p>' : 
                            this.player.inventory.map(item => `<div class="stat">${item.name}</div>`).join('')}
                    </div>
                </div>
            `;
        },

        restInVillage() {
            if (!this.player) return;
            // +1 turno (6 horas)
            this.player.hp = this.player.maxHp;
            this.player.chakra = this.player.maxChakra;
            this.reduceFatigue(15);
            this.advanceTurns(1, 'rest');
            alert('😌 Descansaste 6 horas. HP/Chakra restaurados y fatiga reducida.');
        },

        saveGame() {
            try {
                localStorage.setItem('ninjaRPGSave', JSON.stringify(this.player));
                console.log('Partida guardada');
            } catch(e) {
                console.error('Error guardando:', e);
            }
        },

        loadGame() {
            try {
                const save = localStorage.getItem('ninjaRPGSave');
                if (!save) {
                    alert('No hay partida guardada');
                    return;
                }
                
                this.player = JSON.parse(save);
                this.migratePlayerSave();
                this.showScreen('village-screen');
                this.updateVillageUI();
                this.showMissions();
                alert('¡Partida cargada!');
            } catch(e) {
                console.error('Error cargando:', e);
                alert('Error al cargar la partida');
            }
        },

        deleteCharacterAndRestart() {
            localStorage.removeItem('ninjaRPGSave');
            location.reload();
        },

        startMission(mission) {
            if (!this.player) return;

            // Fatiga por misión
            this.addFatigue(15);

            // Clonar misión para no mutar el catálogo
            const clonedMission = {
                ...mission,
                enemies: Array.isArray(mission.enemies) ? mission.enemies.map(g => ({ ...g })) : []
            };

            // Costo de tiempo (turnos) por complejidad
            const rank = (clonedMission.rank || '').toUpperCase();
            const turnCostByRank = { D: 1, C: 2, B: 3, A: 4, S: 4 };
            const turnCost = clonedMission.turns ?? (turnCostByRank[rank] ?? 2);
            this.advanceTurns(turnCost, 'mission');

            // Bonus por misión nocturna
            const isNight = this.player.timeOfDay === 2;
            const nightRyoMult = isNight ? 1.2 : 1;

            // Bonus por equipo
            const team = this.getTeamBonuses();
            const ryoMult = (team.missionRyoMult || 1) * nightRyoMult;
            const expMult = (team.missionExpMult || 1);

            clonedMission.ryo = Math.floor(clonedMission.ryo * ryoMult);
            clonedMission.exp = Math.floor(clonedMission.exp * expMult);

            this.currentMission = clonedMission;
            this.enemyQueue = [];
            
            // Crear cola de enemigos basado en la misión
            clonedMission.enemies.forEach(enemyGroup => {
                for (let i = 0; i < enemyGroup.count; i++) {
                    const enemyTemplate = this.enemies[enemyGroup.type][enemyGroup.index];
                    this.enemyQueue.push({ ...enemyTemplate, maxHp: enemyTemplate.hp, maxChakra: enemyTemplate.chakra });
                }
            });
            
            this.totalWaves = this.enemyQueue.length;
            this.currentWave = 1;
            
            // Iniciar con el primer enemigo
            this.currentEnemy = this.enemyQueue.shift();
            this.startCombat();
        },

        startCombat() {
            this.showScreen('combat-screen');
            this.combatLog = [];
            document.getElementById('combat-log').innerHTML = '';
            this.kawairimiUsed = false;
            this.defendActive = false;
            
            document.getElementById('combat-player-name').textContent = this.player.clan + ' Ninja';
            document.getElementById('enemy-name').textContent = this.currentEnemy.name + 
                (this.totalWaves > 1 ? ` (${this.currentWave}/${this.totalWaves})` : '');
            document.getElementById('enemy-stats').textContent = 
                `⚔️ Ataque: ${this.currentEnemy.attack} | 🛡️ Defensa: ${this.currentEnemy.defense} | 🎯 Precisión: +${this.currentEnemy.accuracy}`;
            
            this.updateBar('combat-player-health-bar', this.player.hp, this.player.maxHp, 'HP');
            this.updateBar('combat-player-chakra-bar', this.player.chakra, this.player.maxChakra, 'Chakra');
            this.updateBar('enemy-health-bar', this.currentEnemy.hp, this.currentEnemy.maxHp, 'HP');
            
            if (this.currentWave === 1) {
                if (this.currentMission && this.currentMission.isTravelEncounter) {
                    this.addCombatLog('⚠️ Encuentro durante el viaje.', 'log-special');
                } else {
                    this.addCombatLog(`¡Misión iniciada! ${this.totalWaves > 1 ? this.totalWaves + ' enemigos detectados!' : 'Un enemigo aparece!'}`, 'log-special');
                }
            }
            this.addCombatLog(`¡${this.currentEnemy.name} aparece!`, 'log-attack');
            
            this.combatTurn = 'player';
            this.enableCombatButtons();
        },

        addCombatLog(message, className = '') {
            const log = document.getElementById('combat-log');
            const entry = document.createElement('div');
            entry.className = `log-entry ${className}`;
            entry.innerHTML = message;
            log.appendChild(entry);
            log.scrollTop = log.scrollHeight;
        },

        enableCombatButtons() {
            document.getElementById('attack-btn').disabled = false;
            document.getElementById('jutsu-menu-btn').disabled = false;
            document.getElementById('genjutsu-btn').disabled = false;
            document.getElementById('defend-btn').disabled = false;
            document.getElementById('kawarimi-btn').disabled = this.kawairimiUsed;
            document.getElementById('item-btn').disabled = false;
        },

        disableCombatButtons() {
            document.getElementById('attack-btn').disabled = true;
            document.getElementById('jutsu-menu-btn').disabled = true;
            document.getElementById('genjutsu-btn').disabled = true;
            document.getElementById('defend-btn').disabled = true;
            document.getElementById('kawarimi-btn').disabled = true;
            document.getElementById('item-btn').disabled = true;
        },

        basicAttack() {
            if (this.combatTurn !== 'player') return;

            if (this.checkFatigueFaint()) return;
            
            this.disableCombatButtons();
            document.getElementById('jutsu-selection').style.display = 'none';
            document.getElementById('combat-inventory').style.display = 'none';

            const stats = this.getEffectiveStats();

            const attackRoll = this.rollDice(20);
            const isCrit = attackRoll === 20 || (this.rollDice(100) <= (this.player.critChance || 0));
            const totalAttack = attackRoll + stats.taijutsu;
            const enemyDefense = 10 + this.currentEnemy.defense;

            this.addCombatLog(`Atacas con Taijutsu: <span class="dice-roll">${attackRoll}</span> + ${stats.taijutsu} = ${totalAttack}`, 'log-attack');

            if (totalAttack >= enemyDefense || isCrit) {
                const damageRoll = this.rollDice(8);
                let damage = Math.max(1, damageRoll + Math.floor(stats.taijutsu / 2) + (stats.combatDamageBonus || 0));
                
                if (isCrit) {
                    damage *= 2;
                    this.addCombatLog('¡CRÍTICO! Daño duplicado', 'log-special');
                }
                
                this.currentEnemy.hp -= damage;
                this.addCombatLog(`¡Impacto! Infliges ${damage} de daño.`, 'log-damage');
                this.updateBar('enemy-health-bar', this.currentEnemy.hp, this.currentEnemy.maxHp, 'HP');
                
                if (this.currentEnemy.hp <= 0) {
                    this.winCombat();
                    return;
                }
            } else {
                this.addCombatLog('¡Fallaste el ataque!', 'log-miss');
            }

            setTimeout(() => this.enemyTurn(), 1500);
        },

        toggleJutsuMenu() {
            const menu = document.getElementById('jutsu-selection');
            const inventory = document.getElementById('combat-inventory');
            inventory.style.display = 'none';
            
            if (menu.style.display === 'none') {
                menu.style.display = 'block';
                this.loadJutsuList();
            } else {
                menu.style.display = 'none';
            }
        },

        loadJutsuList() {
            const jutsuList = document.getElementById('jutsu-list');
            jutsuList.innerHTML = '';
            
            if (this.player.learnedJutsus.length === 0) {
                jutsuList.innerHTML = '<p>No has aprendido jutsus. Ve a la Academia.</p>';
                return;
            }
            
            this.player.learnedJutsus.forEach(jutsu => {
                const btn = document.createElement('button');
                btn.className = 'jutsu-btn';
                btn.disabled = this.player.chakra < jutsu.chakra;
                btn.onclick = () => this.useJutsu(jutsu);
                
                btn.innerHTML = `
                    <h4>${jutsu.name}</h4>
                    <p style="font-size: 0.85em;">${jutsu.description}</p>
                    <p style="color: #3498db; margin-top: 5px;">💙 ${jutsu.chakra} Chakra</p>
                    ${jutsu.damage > 0 ? `<p style="color: #e74c3c;">⚔️ ${jutsu.damage} daño</p>` : ''}
                `;
                
                jutsuList.appendChild(btn);
            });
        },

        useJutsu(jutsu) {
            if (this.combatTurn !== 'player') return;
            if (this.checkFatigueFaint()) return;
            if (this.player.chakra < jutsu.chakra) return;

            const stats = this.getEffectiveStats();
            
            this.player.chakra -= jutsu.chakra;
            this.updateBar('combat-player-chakra-bar', this.player.chakra, this.player.maxChakra, 'Chakra');
            
            this.disableCombatButtons();
            document.getElementById('jutsu-selection').style.display = 'none';
            
            this.addCombatLog(`Usas ${jutsu.name}!`, 'log-special');
            
            if (jutsu.damage > 0) {
                const damage = jutsu.damage + Math.floor(stats.ninjutsu / 2);
                this.currentEnemy.hp -= damage;
                this.addCombatLog(`¡Infliges ${damage} de daño!`, 'log-damage');
                this.updateBar('enemy-health-bar', this.currentEnemy.hp, this.currentEnemy.maxHp, 'HP');
                
                if (this.currentEnemy.hp <= 0) {
                    this.winCombat();
                    return;
                }
            }
            
            setTimeout(() => this.enemyTurn(), 1500);
        },

        useGenjutsu() {
            if (this.combatTurn !== 'player') return;

            if (this.checkFatigueFaint()) return;
            
            if (this.player.chakra < 30) {
                alert('No tienes suficiente chakra!');
                return;
            }
            
            this.player.chakra -= 30;
            this.updateBar('combat-player-chakra-bar', this.player.chakra, this.player.maxChakra, 'Chakra');
            
            this.disableCombatButtons();
            document.getElementById('jutsu-selection').style.display = 'none';
            document.getElementById('combat-inventory').style.display = 'none';

            const stats = this.getEffectiveStats();

            const genjutsuRoll = this.rollDice(20) + stats.genjutsu;
            const enemyResist = this.rollDice(20) + (this.currentEnemy.genjutsu || 5);
            
            this.addCombatLog(`Lanzas Genjutsu: <span class="dice-roll">${genjutsuRoll}</span> vs ${enemyResist}`, 'log-special');
            
            if (genjutsuRoll > enemyResist) {
                this.addCombatLog('¡El enemigo está aturdido! Pierde su turno.', 'log-special');
                setTimeout(() => {
                    this.combatTurn = 'player';
                    this.enableCombatButtons();
                }, 1500);
            } else {
                this.addCombatLog('¡El enemigo resistió el Genjutsu!', 'log-miss');
                setTimeout(() => this.enemyTurn(), 1500);
            }
        },

        defend() {
            if (this.combatTurn !== 'player') return;

            if (this.checkFatigueFaint()) return;
            
            this.disableCombatButtons();
            document.getElementById('jutsu-selection').style.display = 'none';
            document.getElementById('combat-inventory').style.display = 'none';
            
            this.defendActive = true;
            const chakraRegen = 20 + (this.player.chakraRegen || 0);
            this.player.chakra = Math.min(this.player.chakra + chakraRegen, this.player.maxChakra);
            
            this.addCombatLog(`Te defiendes y recuperas ${chakraRegen} chakra.`, 'log-heal');
            this.updateBar('combat-player-chakra-bar', this.player.chakra, this.player.maxChakra, 'Chakra');
            
            setTimeout(() => this.enemyTurn(), 1500);
        },

        useKawarimi() {
            if (this.kawairimiUsed) {
                alert('Ya usaste Kawarimi en este combate!');
                return;
            }
            
            this.kawairimiUsed = true;
            this.addCombatLog('¡Preparas Kawarimi! Evitarás el próximo ataque.', 'log-special');
            document.getElementById('kawarimi-btn').disabled = true;
        },

        showInventoryInCombat() {
            const menu = document.getElementById('combat-inventory');
            const jutsuMenu = document.getElementById('jutsu-selection');
            jutsuMenu.style.display = 'none';
            
            if (menu.style.display === 'none') {
                menu.style.display = 'block';
                this.loadCombatInventory();
            } else {
                menu.style.display = 'none';
            }
        },

        loadCombatInventory() {
            const itemsList = document.getElementById('combat-items-list');
            itemsList.innerHTML = '';
            
            if (this.player.inventory.length === 0) {
                itemsList.innerHTML = '<p>No tienes items.</p>';
                return;
            }
            
            this.player.inventory.forEach((item, index) => {
                const btn = document.createElement('button');
                btn.className = 'btn btn-small';
                btn.style.width = '100%';
                btn.style.marginBottom = '5px';
                btn.onclick = () => this.useItemInCombat(index);
                btn.textContent = item.name;
                itemsList.appendChild(btn);
            });
        },

        useItemInCombat(index) {
            const item = this.player.inventory[index];
            
            if (item.effect.hp) {
                this.player.hp = Math.min(this.player.hp + item.effect.hp, this.player.maxHp);
                this.addCombatLog(`Usas ${item.name} y recuperas ${item.effect.hp} HP.`, 'log-heal');
                this.updateBar('combat-player-health-bar', this.player.hp, this.player.maxHp, 'HP');
            }
            
            if (item.effect.chakra) {
                this.player.chakra = Math.min(this.player.chakra + item.effect.chakra, this.player.maxChakra);
                this.addCombatLog(`Recuperas ${item.effect.chakra} Chakra.`, 'log-heal');
                this.updateBar('combat-player-chakra-bar', this.player.chakra, this.player.maxChakra, 'Chakra');
            }

            // Fatiga (algunos consumibles)
            if ((item.name || '').toLowerCase().includes('ramen')) {
                this.reduceFatigue(10);
                this.addCombatLog('🍜 Te sientes mejor: -10% fatiga.', 'log-heal');
            }
            
            this.player.inventory.splice(index, 1);
            document.getElementById('combat-inventory').style.display = 'none';
            
            this.disableCombatButtons();
            setTimeout(() => this.enemyTurn(), 1500);
        },

        enemyTurn() {
            this.combatTurn = 'enemy';
            this.addCombatLog(`${this.currentEnemy.name} ataca...`, 'log-attack');

            const attackRoll = this.rollDice(20);
            const totalAttack = attackRoll + this.currentEnemy.attack + (this.currentEnemy.accuracy || 0);
            const stats = this.getEffectiveStats();
            let playerDefense = 10 + Math.floor(stats.taijutsu / 2);
            if (stats.teamEvasionBonus > 0) {
                playerDefense += Math.floor(playerDefense * stats.teamEvasionBonus);
            }
            
            if (this.defendActive) {
                playerDefense += 5;
                this.defendActive = false;
            }

            setTimeout(() => {
                if (this.kawairimiUsed && !this.player.kawairimiActivated) {
                    this.addCombatLog('¡Usas Kawarimi! Te sustituyes y evitas el ataque.', 'log-special');
                    this.player.kawairimiActivated = true;
                    
                    this.combatTurn = 'player';
                    this.enableCombatButtons();
                    return;
                }
                
                this.addCombatLog(`Enemigo tira: <span class="dice-roll">${attackRoll}</span> + ${this.currentEnemy.attack} + ${this.currentEnemy.accuracy} = ${totalAttack} vs Defensa ${playerDefense}`, 'log-attack');

                if (totalAttack >= playerDefense) {
                    const baseDamage = this.rollDice(8) + this.rollDice(6);
                    const damage = Math.max(1, baseDamage + Math.floor(this.currentEnemy.attack / 1.5));
                    this.player.hp -= damage;
                    this.addCombatLog(`¡Te golpean duramente! Recibes ${damage} de daño.`, 'log-damage');
                    this.updateBar('combat-player-health-bar', this.player.hp, this.player.maxHp, 'HP');

                    if (this.player.hp <= 0) {
                        this.defeat();
                        return;
                    }
                } else {
                    this.addCombatLog('¡Esquivas el ataque!', 'log-miss');
                }

                this.combatTurn = 'player';
                this.enableCombatButtons();
            }, 1000);
        },

        winCombat() {
            this.addCombatLog(`¡${this.currentEnemy.name} ha sido derrotado!`, 'log-heal');

            // Fatiga por combate
            this.addFatigue(10);
            
            // Ganar recompensas parciales por cada enemigo
            const expPerEnemy = Math.floor(this.currentMission.exp / this.totalWaves);
            const ryoPerEnemy = Math.floor(this.currentMission.ryo / this.totalWaves);
            
            this.player.exp += expPerEnemy;
            this.player.ryo += ryoPerEnemy;
            this.player.combatsWon++;

            // Cura entre combates (Sakura)
            const stats = this.getEffectiveStats();
            if (stats.betweenCombatHealPct > 0) {
                const heal = Math.max(1, Math.floor(this.player.maxHp * stats.betweenCombatHealPct));
                this.player.hp = Math.min(this.player.maxHp, this.player.hp + heal);
                this.addCombatLog(`💗 Tu equipo te asiste y recuperas ${heal} HP.`, 'log-heal');
                this.updateBar('combat-player-health-bar', this.player.hp, this.player.maxHp, 'HP');
            }
            
            this.addCombatLog(`+${expPerEnemy} EXP | +${ryoPerEnemy} Ryo`, 'log-special');
            
            // Verificar si hay más enemigos
            if (this.enemyQueue.length > 0) {
                this.addCombatLog('¡El siguiente enemigo se acerca!', 'log-special');
                
                setTimeout(() => {
                    this.currentWave++;
                    this.currentEnemy = this.enemyQueue.shift();
                    this.kawairimiUsed = false; // Reiniciar Kawarimi para nuevo enemigo
                    this.player.kawairimiActivated = false;
                    this.startCombat();
                }, 2000);
                return;
            }

            // Combate durante viaje: reanudar viaje sin pantalla de victoria
            if (this.currentMission && this.currentMission.isTravelEncounter) {
                this.currentMission = null;
                this.currentEnemy = null;
                this.saveGame();

                setTimeout(() => {
                    this.showScreen('village-screen');
                    this.updateVillageUI();
                    if (this.player?.travelState) {
                        this.processNextTravelDay();
                    }
                }, 900);
                return;
            }
            
            // Todos los enemigos derrotados - misión completa
            let kekkeiExpGain = 0;
            if (this.player.kekkeiGenkai) {
                const fullMoonMult = (this.player.day === 15) ? 1.10 : 1;
                kekkeiExpGain = Math.floor((this.currentMission.exp / 2) * fullMoonMult);
                this.player.kekkeiExp += kekkeiExpGain;
                
                const nextLevel = this.player.kekkeiGenkai.levels[this.player.kekkeiLevel];
                if (nextLevel && this.player.kekkeiExp >= nextLevel.exp) {
                    this.levelUpKekkei();
                }
            }
            
            if (this.player.exp >= this.player.expToNext) {
                this.levelUp();
            }

            // Reputación
            if (this.currentMission && this.currentMission.isUrgent) {
                this.applyReputationDelta(this.player.location, 12);
                this.player.urgentMission = null;
            } else {
                this.applyReputationDelta(this.player.location, 5);
            }
            
            let victoryText = `¡Misión "${this.currentMission.name}" completada!<br>
                Has derrotado a ${this.totalWaves} enemigo(s).<br><br>
                Total: +${this.currentMission.exp} EXP<br>
                Total: +${this.currentMission.ryo} Ryo`;
            
            document.getElementById('mission-victory-text').innerHTML = victoryText;
            
            const kekkeiExpDiv = document.getElementById('kekkei-exp-gain');
            if (this.player.kekkeiGenkai && kekkeiExpGain > 0) {
                kekkeiExpDiv.innerHTML = `<p style="color: #ffd700;">⚡ +${kekkeiExpGain} EXP de Kekkei Genkai</p>`;
            } else {
                kekkeiExpDiv.innerHTML = '';
            }
            
            this.saveGame();
            
            setTimeout(() => {
                this.showScreen('mission-victory-screen');
            }, 2000);
        },

        levelUp() {
            this.player.level++;
            this.player.exp = 0;
            this.player.expToNext = Math.floor(this.player.expToNext * 1.5);
            
            this.player.maxHp += 15;
            this.player.hp = this.player.maxHp;
            this.player.maxChakra += 20;
            this.player.chakra = this.player.maxChakra;
            this.player.taijutsu += 2;
            this.player.ninjutsu += 2;
            this.player.genjutsu += 2;
            
            if (this.player.level === 4 && this.player.rank === 'Genin') {
                this.player.rank = 'Chunin';
                alert('¡PROMOCIÓN! Ahora eres Chunin. ¡Nuevas misiones disponibles!');
            } else if (this.player.level === 7 && this.player.rank === 'Chunin') {
                this.player.rank = 'Jonin';
                alert('¡PROMOCIÓN! Ahora eres Jonin. ¡Misiones de alto rango desbloqueadas!');
            } else if (this.player.level === 10 && this.player.rank === 'Jonin') {
                this.player.rank = 'ANBU';
                alert('¡PROMOCIÓN! Te has unido a ANBU. ¡Misiones S-Rank disponibles!');
            } else {
                alert(`¡NIVEL ${this.player.level}! Todos tus stats han aumentado.`);
            }
        },

        levelUpKekkei() {
            const nextLevel = this.player.kekkeiGenkai.levels[this.player.kekkeiLevel];
            
            if (!nextLevel) return;
            
            this.player.kekkeiLevel++;
            
            // Aplicar bonuses del nuevo nivel
            const newLevelData = this.player.kekkeiGenkai.levels[this.player.kekkeiLevel - 1];
            const prevLevelData = this.player.kekkeiGenkai.levels[this.player.kekkeiLevel - 2];
            
            // Calcular diferencia de bonuses
            if (newLevelData.bonus.all) {
                const diff = newLevelData.bonus.all - (prevLevelData?.bonus.all || 0);
                this.player.taijutsu += diff;
                this.player.ninjutsu += diff;
                this.player.genjutsu += diff;
            }
            
            if (newLevelData.bonus.taijutsu) {
                const diff = newLevelData.bonus.taijutsu - (prevLevelData?.bonus.taijutsu || 0);
                this.player.taijutsu += diff;
            }
            if (newLevelData.bonus.ninjutsu) {
                const diff = newLevelData.bonus.ninjutsu - (prevLevelData?.bonus.ninjutsu || 0);
                this.player.ninjutsu += diff;
            }
            if (newLevelData.bonus.genjutsu) {
                const diff = newLevelData.bonus.genjutsu - (prevLevelData?.bonus.genjutsu || 0);
                this.player.genjutsu += diff;
            }
            
            this.player.critChance = newLevelData.bonus.critChance || 0;
            this.player.chakraRegen = newLevelData.bonus.chakraRegen || 0;
            
            alert(`🌟 ¡${this.player.kekkeiGenkai.name} ha evolucionado!\n\nNuevo nivel: ${newLevelData.name}\n\n¡Tus poderes han aumentado!`);
        },

        returnToVillage() {
            this.showScreen('village-screen');
            this.updateVillageUI();
            this.showMissions();
        },

        defeat() {
            this.showScreen('defeat-screen');
        }
    };

    // Check if there's a saved game on load
    window.onload = function() {
        const hasSave = localStorage.getItem('ninjaRPGSave');
        if (!hasSave) {
            document.getElementById('load-btn').style.display = 'none';
        }
    };

    return game;
}
