// ============================================================
// world/travel.js — Viaje, encuentros, equipo reclutable
// ============================================================

export const travelMethods = {

    toggleTravelPanel() {
        const el = document.getElementById('travel-panel');
        if (!el) return;
        el.style.display = el.style.display === 'none' ? 'block' : 'none';
    },

    populateTravelDestinations() {
        const sel = document.getElementById('travel-destination');
        if (!sel) return;
        const current  = this.player?.location;
        const opts = Object.entries(this.locations)
            .filter(([id]) => id !== current)
            .filter(([id]) => !(this.player?.isRenegade && id === 'konoha'))
            .map(([id, info]) => ({ id, label: `${info.icon} ${info.name}` }));
        const previous = sel.value;
        sel.innerHTML  = opts.map(o => `<option value="${o.id}">${o.label}</option>`).join('');
        if (previous && opts.some(o => o.id === previous)) sel.value = previous;
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
        if (!destination || !this.locations[destination]) { alert('Destino inválido.'); return; }
        if (this.player.isRenegade && destination === 'konoha') { alert('🚫 Un renegado no puede entrar a Konoha.'); return; }
        if (destination === this.player.location) { alert('Ya estás en ese lugar.'); return; }
        if (document.getElementById('combat-screen')?.classList.contains('active')) {
            alert('No puedes viajar en medio de un combate.');
            return;
        }

        const groupTravel = !!opts.groupTravel;
        const travelDays  = this.getTravelDays(this.player.location, destination, { groupTravel });

        this.player.travelState = {
            from:         this.player.location,
            to:           destination,
            remainingDays: travelDays,
            groupTravel,
            startedAt:    { day: this.player.day, month: this.player.month, year: this.player.year },
        };

        const fromLoc = this.locations[this.player.location];
        const toLoc   = this.locations[destination];
        alert(`🧭 Viaje iniciado: ${fromLoc.icon} ${fromLoc.name} → ${toLoc.icon} ${toLoc.name}\nDuración estimada: ${travelDays} día(s)`);
        this.processNextTravelDay();
    },

    getTravelDays(fromId, toId, opts = {}) {
        const groupTravel = !!opts.groupTravel;
        const getDist     = id => (id === 'konoha' ? 0 : (this.locations[id]?.daysFromKonoha ?? 4));

        let baseDays = (fromId === 'konoha' || toId === 'konoha')
            ? Math.max(1, getDist(fromId === 'konoha' ? toId : fromId))
            : Math.max(2, getDist(fromId) + getDist(toId));

        if (this.player.season  === 'invierno')  baseDays += 1;
        if (this.player.weather === 'lluvia')     baseDays += 1;
        if (this.player.weather === 'tormenta')   baseDays += 2;
        if (this.player.weather === 'nieve')      baseDays += 1;
        if (groupTravel)                          baseDays += 1;
        if ((this.player.team || []).length > 0)  baseDays = Math.max(1, baseDays - 1);

        return baseDays;
    },

    getTravelEncounterChance(groupTravel) {
        let chance = 0.25;
        if (['tormenta','nieve'].includes(this.player.weather)) chance += 0.10;
        if (this.player.weather === 'lluvia')                   chance += 0.05;
        if ((this.player.team || []).length > 0)                chance -= 0.05;
        if (groupTravel)                                        chance -= 0.08;
        return this.clamp(chance, 0.05, 0.60);
    },

    processNextTravelDay() {
        if (!this.player?.travelState) return;
        const state = this.player.travelState;

        if (state.remainingDays <= 0) { this.finishTravelArrival(); return; }

        state.remainingDays -= 1;
        const chakraCost = Math.max(1, Math.floor(this.player.maxChakra * 0.10));
        this.player.chakra = Math.max(0, this.player.chakra - chakraCost);
        this.addFatigue(5);

        if (Math.random() < this.getTravelEncounterChance(state.groupTravel)) {
            this.startTravelEncounter(this.generateTravelEncounterEnemy(state.to));
            return;
        }

        if (state.remainingDays <= 0) { this.finishTravelArrival(); return; }
        this.updateVillageUI();
        setTimeout(() => this.processNextTravelDay(), 300);
    },

    generateTravelEncounterEnemy(destinationId) {
        const dist    = this.locations[destinationId]?.daysFromKonoha ?? 4;
        const poolKey = dist <= 3 ? 'genin' : dist <= 5 ? 'chunin' : dist <= 7 ? 'jonin' : 'akatsuki';
        const pool    = this.enemies[poolKey] || this.enemies.genin;
        const tpl     = pool[Math.floor(Math.random() * pool.length)];
        const scale   = 1 + Math.min(0.35, dist * 0.03);
        return {
            ...tpl,
            hp:       Math.floor(tpl.hp * scale),
            attack:   Math.floor(tpl.attack * scale),
            defense:  Math.floor(tpl.defense * scale),
            maxHp:    Math.floor(tpl.hp * scale),
            maxChakra: tpl.chakra,
        };
    },

    startTravelEncounter(enemy) {
        this.currentMission = {
            name:              'Encuentro en el camino',
            rank:              'E',
            description:       'Un enemigo intercepta tu ruta.',
            enemies:           [],
            ryo:               60,
            exp:               30,
            isTravelEncounter: true,
        };
        this.currentEnemy = enemy;
        this.enemyQueue   = [];
        this.totalWaves   = 1;
        this.currentWave  = 1;
        this.startCombat();
    },

    finishTravelArrival() {
        const state = this.player.travelState;
        const toLoc = this.locations[state.to];
        this.player.location    = state.to;
        this.player.travelState = null;
        alert(`📍 Has llegado a ${toLoc.icon} ${toLoc.name}.`);
        this.updateVillageUI();
        this.saveGame();
    },

    // ── Equipo reclutable ────────────────────────────────────

    toggleRecruitPanel() {
        const el = document.getElementById('recruit-panel');
        if (!el) return;
        el.style.display = el.style.display === 'none' ? 'block' : 'none';
    },

    renderRecruitPanel() {
        const el = document.getElementById('recruit-panel');
        if (!el || !this.player) return;
        const team   = new Set(this.player.team || []);
        const canAdd = team.size < 2;

        const rows = Object.values(this.recruitableNPCs).map(npc => {
            const inTeam  = team.has(npc.id);
            const disabled = (!inTeam && !canAdd) ? 'disabled' : '';
            const btnLabel = inTeam ? 'Quitar' : 'Reclutar';
            const btnClass = inTeam ? 'btn btn-small btn-secondary' : 'btn btn-small';
            const onclick  = inTeam ? `game.dismissTeammate('${npc.id}')` : `game.recruitTeammate('${npc.id}')`;
            return `
                <div class="shop-item" style="margin:8px 0;">
                    <h4>👥 ${npc.name}</h4>
                    <p>💰 ${npc.costPerDay} Ryo/día</p>
                    <p style="font-size:0.9em;">${this.describeNpcPerk(npc)}</p>
                    <button class="${btnClass}" onclick="${onclick}" ${disabled}>${btnLabel}</button>
                </div>
            `;
        });

        el.innerHTML = `
            <div style="color:#ff8c00; font-weight:bold; margin-bottom:8px;">Equipo (máx. 2 compañeros)</div>
            ${rows.join('')}
        `;
    },

    describeNpcPerk(npc) {
        const pct = v => `${Math.round(v * 100)}%`;
        switch (npc.perk) {
            case 'mission_ryo':   return `+${pct(npc.perkValue)} Ryo en misiones`;
            case 'mission_exp':   return `+${pct(npc.perkValue)} EXP en misiones`;
            case 'combat_damage': return `+${npc.perkValue} daño físico (auto)`;
            case 'team_evasion':  return `+${pct(npc.perkValue)} evasión del equipo`;
            case 'between_heal':  return `Cura entre combates (+${pct(npc.perkValue)} HP)`;
            default:              return 'Apoyo';
        }
    },

    recruitTeammate(npcId) {
        if (!this.player) return;
        const npc = this.recruitableNPCs[npcId];
        if (!npc) return;
        this.player.team = Array.isArray(this.player.team) ? this.player.team : [];
        if (this.player.team.includes(npcId)) return;
        if (this.player.team.length >= 2) { alert('Tu equipo ya está completo (máx. 2 compañeros).'); return; }
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

    getTeamBonuses() {
        const bonuses = {
            missionRyoMult:      1,
            missionExpMult:      1,
            travelDayDelta:      0,
            combatDamageBonus:   0,
            teamEvasionBonus:    0,
            betweenCombatHealPct: 0,
        };
        const team = Array.isArray(this.player.team) ? this.player.team : [];
        if (team.length > 0) bonuses.travelDayDelta = -1;
        for (const npcId of team) {
            const npc = this.recruitableNPCs[npcId];
            if (!npc) continue;
            if (npc.perk === 'mission_ryo')   bonuses.missionRyoMult       *= (1 + npc.perkValue);
            if (npc.perk === 'mission_exp')   bonuses.missionExpMult       *= (1 + npc.perkValue);
            if (npc.perk === 'combat_damage') bonuses.combatDamageBonus    += npc.perkValue;
            if (npc.perk === 'team_evasion')  bonuses.teamEvasionBonus     += npc.perkValue;
            if (npc.perk === 'between_heal')  bonuses.betweenCombatHealPct += npc.perkValue;
        }
        return bonuses;
    },

};
