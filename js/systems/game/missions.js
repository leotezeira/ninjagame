// ============================================================
// village/missions.js — showMissions, startMission, _executeMission
// ============================================================

export const missionsMethods = {

    showMissions() {
        const missionList = document.getElementById('mission-list')
            || document.querySelector('#section-world .mission-list');
        if (!missionList) { console.error('❌ mission-list no encontrado'); return; }
        missionList.innerHTML = '';

        // Misión urgente
        if (this.player.urgentMission) {
            const daysLeft  = Math.ceil(this.player.urgentMission.turnsLeft / this.turnsPerDay);
            const card      = document.createElement('div');
            card.className  = 'mission-card';
            card.style.cssText = 'border-left-color:#c0392b; background:rgba(192,57,43,0.18); cursor:pointer;';
            card.onclick    = e => { e.preventDefault(); e.stopPropagation(); game.startUrgentMission(); };
            card.innerHTML  = `
                <h4>🚨 ${this.player.urgentMission.name} [URGENTE]</h4>
                <p>Tiempo límite: ${daysLeft} día(s) · Recompensa x${this.player.urgentMission.ryoMultiplier || 2}</p>
                <p style="color:#ffd700; margin-top:8px;">Si fallas: -Reputación</p>
            `;
            missionList.appendChild(card);
        }

        // Renegado: contratos
        if (this.player.isRenegade) {
            this._renderRenegadeMissions(missionList);
            return;
        }

        if (!this.missions) { missionList.innerHTML = '<div class="story-text">Error: No se encontraron datos de misiones.</div>'; return; }

        const allMissions = [
            ...(this.missions.genin  || []),
            ...(this.missions.chunin || []),
            ...(this.missions.jonin  || []),
            ...(this.missions.kage   || []),
        ];

        if (allMissions.length === 0) { missionList.innerHTML = '<div class="story-text">No hay misiones configuradas.</div>'; return; }

        const byRank   = this.groupMissionsByRank(allMissions);
        const rankOrder = ['D','C','B','A','S','U','F'];

        rankOrder.forEach(rank => {
            const list = byRank[rank] || [];
            if (!list.length) return;

            const available = list.filter(m => !this.isMissionLocked(m)?.locked).length;
            const locked    = list.length - available;

            const accordion  = document.createElement('div');
            accordion.className = 'mission-rank-accordion';

            const header     = document.createElement('button');
            const countLabel = available > 0
                ? `(${available} disponible${available !== 1 ? 's' : ''}${locked > 0 ? `, ${locked} 🔒` : ''})`
                : `(${locked} 🔒 bloqueada${locked !== 1 ? 's' : ''})`;
            header.innerHTML = `<span>${this.getRankEmoji(rank)} Rango ${rank} ${countLabel}</span><span class="accordion-arrow" style="transition:transform 0.3s;">▼</span>`;

            const content    = document.createElement('div');
            content.className = 'mission-rank-content';
            content.style.display = 'none';

            const grid = document.createElement('div');
            grid.className = 'mission-grid';

            list.forEach(mission => {
                const card = this._buildMissionCard(mission);
                grid.appendChild(card);
            });

            content.appendChild(grid);
            header.onclick = e => {
                e.stopPropagation();
                const expanded = content.style.display !== 'none';
                content.style.display = expanded ? 'none' : 'block';
                const arrow = header.querySelector('.accordion-arrow');
                if (arrow) arrow.style.transform = expanded ? 'rotate(0deg)' : 'rotate(-180deg)';
            };

            accordion.appendChild(header);
            accordion.appendChild(content);
            missionList.appendChild(accordion);
        });
    },

    _buildMissionCard(mission) {
        const card       = document.createElement('div');
        card.className   = 'mission-card';
        const lockStatus = this.isMissionLocked(mission);
        const rank       = (mission.rank || '').toUpperCase();
        const turnCost   = mission.turns ?? ({ D:1, C:2, B:3, A:4, S:4, U:5, F:6 }[rank] ?? 2);
        const team       = this.getTeamBonuses();
        const nightMult  = this.getTimeOfDay() === 2 ? 1.2 : 1;
        const estRyo     = Math.floor(mission.ryo * (team.missionRyoMult || 1) * nightMult);
        const estExp     = Math.floor(mission.exp * (team.missionExpMult || 1));

        if (lockStatus?.locked) {
            card.classList.add('mission-locked');
            card.style.cssText = 'opacity:0.6; cursor:not-allowed; border-color:rgba(255,100,100,0.3);';
            card.innerHTML = `
                <h4 style="color:#888;">🔒 ${mission.name}</h4>
                <p style="color:#666;">${mission.description}</p>
                <p style="color:#ff6b6b; margin-top:8px; font-weight:bold;">⛔ BLOQUEADO - ${lockStatus.reason}</p>
                <p style="opacity:0.5; margin-top:6px;">⏱️ Tiempo: ${turnCost} turno(s)</p>
            `;
            card.onclick = e => { e.stopPropagation(); alert(`🔒 Misión bloqueada: ${lockStatus.reason}`); };
        } else {
            card.style.cursor = 'pointer';
            const m = mission;
            card.onclick = function(e) {
                e.preventDefault(); e.stopPropagation();
                if (typeof game !== 'undefined' && game.startMission) game.startMission(m);
            };
            card.innerHTML = `
                <h4>📜 ${mission.name}</h4>
                <p>${mission.description}</p>
                <p style="color:#ffd700; margin-top:8px;">Recompensa: ${estRyo} Ryo | ${estExp} EXP</p>
                <p style="opacity:0.85; margin-top:6px;">⏱️ Tiempo: ${turnCost} turno(s)</p>
            `;
        }
        return card;
    },

    _renderRenegadeMissions(missionList) {
        const tier = (this.player.level >= 12 || (this.player.renegadeLevel || 0) >= 4)
            ? 'high' : (this.player.level >= 8 ? 'mid' : 'low');
        const contracts   = this.renegadeContracts?.[tier] || [];
        const org         = this.player.organization;
        const orgMissions = (org && this.organizationMissions?.[org]) ? this.organizationMissions[org] : [];

        const addHeading = text => {
            const h = document.createElement('div');
            h.style.gridColumn = '1/-1';
            h.innerHTML = `<h4 style="color:#c0392b;">${text}</h4>`;
            missionList.appendChild(h);
        };

        addHeading(`🩸 Contratos (${tier.toUpperCase()})`);
        contracts.forEach(m => this.renderMissionCard(missionList, m, { renegade:true }));
        if (org) {
            addHeading(`🏴 Misiones de organización: ${org}`);
            orgMissions.forEach(m => this.renderMissionCard(missionList, m, { renegade:true }));
        }
        if (!contracts.length && !orgMissions.length && !this.player.urgentMission) {
            missionList.innerHTML += '<div class="story-text">No hay contratos disponibles por ahora.</div>';
        }
    },

    renderMissionCard(container, mission, opts = {}) {
        const card     = document.createElement('div');
        card.className = 'mission-card';
        card.style.cursor = 'pointer';
        if (opts.renegade) card.style.cssText += 'border-left-color:#c0392b; background:rgba(192,57,43,0.10);';
        const m = mission;
        card.onclick = function(e) {
            e.preventDefault(); e.stopPropagation();
            if (typeof game !== 'undefined' && game.startMission) game.startMission(m);
        };
        const rank    = (mission.rank || '').toUpperCase();
        const turns   = mission.turns ?? ({ D:1, C:2, B:3, A:4, S:4 }[rank] ?? 2);
        const team    = this.getTeamBonuses();
        const estRyo  = Math.floor(mission.ryo * (team.missionRyoMult || 1) * (this.getTimeOfDay() === 2 ? 1.2 : 1));
        const estExp  = Math.floor(mission.exp * (team.missionExpMult || 1));
        card.innerHTML = `
            <h4>📜 ${mission.name} [Rango ${mission.rank}]</h4>
            <p>${mission.description}</p>
            <p style="color:#ffd700; margin-top:8px;">Recompensa: ${estRyo} Ryo | ${estExp} EXP</p>
            <p style="opacity:0.85; margin-top:6px;">⏱️ Tiempo: ${turns} turno(s)</p>
        `;
        container.appendChild(card);
    },

    groupMissionsByRank(missions) {
        return missions.reduce((acc, m) => {
            const r = (m.rank || 'D').toUpperCase();
            (acc[r] = acc[r] || []).push(m);
            return acc;
        }, {});
    },

    isMissionLocked(mission) {
        if (!this.player) return true;
        const req = {
            D:{ minLevel:1,  allowedRanks:['Genin','Chunin','Jonin','ANBU','Kage'] },
            C:{ minLevel:2,  allowedRanks:['Genin','Chunin','Jonin','ANBU','Kage'] },
            B:{ minLevel:5,  allowedRanks:['Chunin','Jonin','ANBU','Kage'] },
            A:{ minLevel:8,  allowedRanks:['Chunin','Jonin','ANBU','Kage'] },
            S:{ minLevel:12, allowedRanks:['Jonin','ANBU','Kage'] },
            U:{ minLevel:18, allowedRanks:['ANBU','Kage'] },
            F:{ minLevel:25, allowedRanks:['Kage'] },
        };
        const r = (mission.rank || 'D').toUpperCase();
        const r2 = req[r];
        if (!r2) return false;
        if (this.player.level < r2.minLevel)              return { locked:true, reason:`Nivel ${r2.minLevel} requerido` };
        if (!r2.allowedRanks.includes(this.player.rank))  return { locked:true, reason:`Rango ${r2.allowedRanks[0]} requerido` };
        return false;
    },

    async startMission(mission) {
        if (!mission) { console.error('❌ No mission provided'); return; }
        const team      = this.getTeamBonuses();
        const nightMult = this.getTimeOfDay() === 2 ? 1.2 : 1;
        const estRyo    = Math.floor(mission.ryo * (team.missionRyoMult || 1) * nightMult);
        const estExp    = Math.floor(mission.exp * (team.missionExpMult || 1));
        const message   = `📜 ${mission.name}\n\n${mission.description || 'Una misión te espera.'}\n\n🎖️ Rango: ${mission.rank || 'D'}\n💰 Recompensa: ${estRyo} Ryo\n✨ Experiencia: ${estExp} EXP\n\n¿Aceptar esta misión?`;
        const accepted  = await this.gameConfirm(message, '📜');
        if (accepted) this._executeMission(mission);
    },

    _executeMission(mission) {
        if (!this.player) { console.error('❌ No player'); return; }
        if (!mission?.enemies?.length) { alert('Error: Esta misión no tiene enemigos configurados.'); return; }

        this.addFatigue(15);

        const cloned = { ...mission, enemies: mission.enemies.map(g => ({ ...g })) };
        const rank   = (cloned.rank || '').toUpperCase();
        const team   = this.getTeamBonuses();
        cloned.ryo   = Math.floor(cloned.ryo * (team.missionRyoMult || 1) * (this.getTimeOfDay() === 2 ? 1.2 : 1));
        cloned.exp   = Math.floor(cloned.exp * (team.missionExpMult || 1));

        this.currentMission = cloned;
        this.enemyQueue     = [];

        for (const grp of cloned.enemies) {
            for (let i = 0; i < grp.count; i++) {
                const tpl = this.enemies?.[grp.type]?.[grp.index];
                if (!tpl) { console.error(`❌ Enemy ${grp.type}[${grp.index}] not found`); continue; }
                this.enemyQueue.push({ ...tpl, maxHp: tpl.hp, maxChakra: tpl.chakra });
            }
        }

        if (!this.enemyQueue.length) { alert('Error: No se pudieron cargar los enemigos.'); return; }

        this.totalWaves  = this.enemyQueue.length;
        this.currentWave = 1;
        this.currentEnemy = this.enemyQueue.shift();
        this.startCombat();
    },

    startUrgentMission() {
        if (!this.player?.urgentMission) { alert('No tienes misiones urgentes activas.'); return; }
        const urgent  = this.player.urgentMission;
        const mission = this.buildUrgentMissionTemplate();
        mission.ryo   = Math.floor(mission.ryo * (urgent.ryoMultiplier || 2));
        mission.exp   = Math.floor(mission.exp * (urgent.expMultiplier || 1.2));
        this.startMission(mission);
    },

    buildUrgentMissionTemplate() {
        const rank = this.player.rank || 'Genin';
        const map  = {
            Genin:  { type:'genin',   count:2, ryo:400,  exp:120 },
            Chunin: { type:'chunin',  count:2, ryo:700,  exp:180 },
            Jonin:  { type:'jonin',   count:2, ryo:1200, exp:260 },
            ANBU:   { type:'akatsuki',count:1, ryo:1800, exp:320 },
            Kage:   { type:'akatsuki',count:1, ryo:1800, exp:320 },
        };
        const cfg = map[rank] || map.Genin;
        return {
            name:        this.player.urgentMission?.name || 'Misión urgente',
            rank:        'U',
            description: 'Requiere atención inmediata. Recompensa mejorada.',
            enemies:     [{ type:cfg.type, index:0, count:cfg.count }],
            ryo:         cfg.ryo,
            exp:         cfg.exp,
            isUrgent:    true,
            turns:       2,
        };
    },

};
