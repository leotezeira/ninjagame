// ============================================================
// village/npcs.js — NPCs, relaciones, combate amistoso
// ============================================================

export const npcsMethods = {

    // ── Relaciones ───────────────────────────────────────────

    getNpcRelationship(npcId) {
        if (!this.player?.npcRelations) this.player.npcRelations = {};
        return this.player.npcRelations[npcId] ?? 0;
    },

    getNpcRelationshipLevel(rel, npcId) {
        if (this.player?.npcRivals?.[npcId]) return 'Rival';
        if (rel <= -50) return 'Enemigo';
        if (rel >= 76)  return 'Compañero';
        if (rel >= 51)  return 'Mejor Amigo';
        if (rel >= 26)  return 'Amigo';
        if (rel >= 1)   return 'Conocido';
        return 'Desconocido';
    },

    updateRelationship(npcId, amount) {
        if (!this.player) return;
        const current = this.getNpcRelationship(npcId);
        this.player.npcRelations[npcId] = this.clamp(current + amount, -100, 100);
        this.saveGame();
    },

    pickNpcDialogue(npc, relLevel) {
        const d    = npc.dialogues || {};
        const pick = arr => Array.isArray(arr) && arr.length ? arr[Math.floor(Math.random() * arr.length)] : '';
        if (relLevel === 'Desconocido')              return pick(d.first_meeting) || '...';
        if (relLevel === 'Enemigo')                  return pick(d.enemy)       || pick(d.neutral) || '...';
        if (relLevel === 'Rival')                    return pick(d.rival)       || pick(d.neutral) || '...';
        if (['Compañero','Mejor Amigo'].includes(relLevel)) return pick(d.best_friend) || pick(d.friendly) || pick(d.neutral) || '...';
        if (relLevel === 'Amigo')                    return pick(d.friendly)    || pick(d.neutral) || '...';
        return pick(d.neutral) || '...';
    },

    // ── Lista y modal ────────────────────────────────────────

    showNPCList() {
        const listEl = document.getElementById('npc-list');
        const modal  = document.getElementById('npc-modal');
        if (!listEl) return;
        if (modal) { modal.style.display = 'none'; modal.innerHTML = ''; }

        listEl.innerHTML = Object.values(this.npcs || {}).map(npc => {
            const rel   = this.getNpcRelationship(npc.id);
            const level = this.getNpcRelationshipLevel(rel, npc.id);
            return `
                <div class="npc-card" onclick="game.showNPCInteraction('${npc.id}')">
                    <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
                        <div style="font-weight:bold; color:var(--accent);">${npc.icon} ${npc.name}</div>
                        <div style="opacity:0.85;">${level}</div>
                    </div>
                    <div style="margin-top:8px; display:flex; align-items:center; justify-content:space-between; gap:10px;">
                        <div style="color:rgba(240,240,240,0.75);">Relación</div>
                        <div><b>${rel}</b></div>
                    </div>
                    <div style="margin-top:6px; color:rgba(240,240,240,0.75); font-size:0.9em;">${npc.village} • ${npc.rank}</div>
                </div>
            `;
        }).join('');
    },

    showNPCInteraction(npcId) {
        const npc   = (this.npcs || {})[npcId];
        const modal = document.getElementById('npc-modal');
        if (!npc || !modal) return;

        const rel      = this.getNpcRelationship(npcId);
        const relLevel = this.getNpcRelationshipLevel(rel, npcId);
        const dialogue = this.pickNpcDialogue(npc, relLevel);

        modal.style.display = 'block';
        modal.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap;">
                <div style="font-size:1.15em; font-weight:bold; color:var(--gold);">${npc.icon} ${npc.name}</div>
                <div style="opacity:0.9;">${relLevel} • Relación: <b>${rel}</b></div>
            </div>
            <div style="margin-top:10px; color:rgba(240,240,240,0.85);">"${dialogue}"</div>
            <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap; justify-content:center;">
                <button class="btn btn-small" onclick="game.talkToNPC('${npcId}')">Hablar</button>
                <button class="btn btn-small" onclick="game.showNpcMissions('${npcId}')">Misión</button>
                <button class="btn btn-small" onclick="game.showNpcTrainings('${npcId}')">Entrenar</button>
                <button class="btn btn-small" onclick="game.giftNPC('${npcId}')">Regalo</button>
                <button class="btn btn-small btn-secondary" onclick="game.friendlyBattle('${npcId}')">Combate amistoso</button>
            </div>
            <div id="npc-extra" style="margin-top:12px;"></div>
        `;
    },

    talkToNPC(npcId) {
        if (this.getNpcRelationship(npcId) === 0) this.updateRelationship(npcId, 1);
        this.updateRelationship(npcId, 2);
        this.showNPCInteraction(npcId);
    },

    giftNPC(npcId) {
        const npc = (this.npcs || {})[npcId];
        if (!npc || !this.player) return;
        if (!this.player.inventory?.length) { alert('No tienes items para regalar.'); return; }

        const options = this.player.inventory.map((it, idx) => `${idx + 1}) ${it.name}`).join('\n');
        const pick    = prompt(`Elige un item para regalar (número):\n${options}`);
        const idx     = Number(pick) - 1;
        if (!Number.isFinite(idx) || idx < 0 || idx >= this.player.inventory.length) return;

        const item  = this.player.inventory[idx];
        const liked = (npc.gifts || []).includes(item.name);
        const delta = liked ? (8 + Math.floor(Math.random() * 8)) : 2;
        this.updateRelationship(npcId, delta);
        this.player.inventory.splice(idx, 1);
        this.saveGame();
        alert(`${npc.name} ${liked ? 'aprecia' : 'acepta'} tu regalo. Relación +${delta}.`);
        this.showNPCInteraction(npcId);
    },

    // ── Misiones de NPC ──────────────────────────────────────

    showNpcMissions(npcId) {
        const npc   = (this.npcs || {})[npcId];
        const extra = document.getElementById('npc-extra');
        if (!npc || !extra) return;

        const rel      = this.getNpcRelationship(npcId);
        const relLevel = this.getNpcRelationshipLevel(rel, npcId);
        const missions = this.getNPCMissions(npcId, relLevel);

        if (!missions.length) {
            extra.innerHTML = '<div class="story-text">No hay misiones disponibles con este NPC (sube la relación).</div>';
            return;
        }
        extra.innerHTML = `
            <div style="color:var(--accent); font-weight:bold;">Misiones de ${npc.name}</div>
            ${missions.map(m => `
                <div class="mission-card" style="margin-top:10px;" onclick='game.startNpcMission(${JSON.stringify(m).replace(/'/g, "\\'")})'>
                    <h4>📌 ${m.name} [${m.rank}]</h4>
                    <p>${m.description}</p>
                    <p style="color:#ffd700; margin-top:8px;">${m.ryo} Ryo | ${m.exp} EXP</p>
                </div>
            `).join('')}
        `;
    },

    getNPCMissions(npcId, relLevel) {
        const npc  = (this.npcs || {})[npcId];
        if (!npc) return [];
        const list = Array.isArray(npc.missions) ? npc.missions : [];
        if (['Amigo','Mejor Amigo','Compañero'].includes(relLevel)) return list;
        if (relLevel === 'Conocido') return list.slice(0, 1);
        return [];
    },

    startNpcMission(mission) {
        if (!mission) return;
        game.startMission({ ...mission, npcMission: true });
    },

    // ── Entrenamientos de NPC ────────────────────────────────

    showNpcTrainings(npcId) {
        const npc   = (this.npcs || {})[npcId];
        const extra = document.getElementById('npc-extra');
        if (!npc || !extra) return;

        const rel      = this.getNpcRelationship(npcId);
        const relLevel = this.getNpcRelationshipLevel(rel, npcId);

        if (!['Mejor Amigo','Compañero'].includes(relLevel)) {
            extra.innerHTML = '<div class="story-text">Necesitas ser Mejor Amigo para entrenamientos especiales.</div>';
            return;
        }
        const trainings = Array.isArray(npc.trainings) ? npc.trainings : [];
        if (!trainings.length) { extra.innerHTML = '<div class="story-text">Este NPC no tiene entrenamientos disponibles.</div>'; return; }

        extra.innerHTML = `
            <div style="color:var(--accent); font-weight:bold;">Entrenamientos de ${npc.name}</div>
            ${trainings.map(t => `
                <div class="shop-item" style="margin-top:10px;">
                    <h4>💪 ${t.name}</h4>
                    <p>${t.description}</p>
                    <p class="price">💰 ${t.price} Ryo</p>
                    <button class="btn btn-small" onclick='game.doNpcTraining("${npcId}", ${JSON.stringify(t).replace(/'/g, "\\'")})'>Entrenar</button>
                </div>
            `).join('')}
        `;
    },

    doNpcTraining(npcId, training) {
        const npc = (this.npcs || {})[npcId];
        if (!npc || !training || !this.player) return;
        if (this.player.ryo < training.price) { alert('No tienes suficiente Ryo.'); return; }

        this.player.ryo -= training.price;
        const eff = training.effect || {};
        if (eff.all)      { this.player.taijutsu += eff.all; this.player.ninjutsu += eff.all; this.player.genjutsu += eff.all; }
        if (eff.taijutsu) this.player.taijutsu  += eff.taijutsu;
        if (eff.ninjutsu) this.player.ninjutsu  += eff.ninjutsu;
        if (eff.genjutsu) this.player.genjutsu  += eff.genjutsu;
        if (eff.maxHp)    { this.player.maxHp     += eff.maxHp;     this.player.hp    = this.player.maxHp; }
        if (eff.maxChakra){ this.player.maxChakra += eff.maxChakra; this.player.chakra = this.player.maxChakra; }

        this.updateRelationship(npcId, 1);
        this.updateVillageUI();
        this.saveGame();
        alert(`Entrenamiento completado con ${npc.name}.`);
        this.showNPCInteraction(npcId);
    },

    // ── Combate amistoso ─────────────────────────────────────

    getNpcBattleStamp() {
        return `${this.player.year}-${this.player.month}-${this.player.day}`;
    },

    friendlyBattle(npcId) {
        const npc = (this.npcs || {})[npcId];
        if (!npc || !this.player) return;

        const stamp = this.getNpcBattleStamp();
        if (this.player.npcDailyBattleStamp?.[npcId] === stamp) { alert('Ya hiciste un combate amistoso con este NPC hoy.'); return; }

        const rankOrder = { Genin:1, Chunin:2, 'Chūnin':2, Jonin:3, 'Jōnin':3, ANBU:4, Kage:5, Hokage:5, Sannin:4, Viajero:3, Médica:3, Consejero:3, 'Ex-Hokage':5, 'Jinchūriki':4 };
        if ((rankOrder[npc.rank] ?? 3) < (rankOrder[this.player.rank] ?? 1)) {
            alert('Este NPC solo ofrece combate amistoso si su rango es igual o mayor al tuyo.');
            return;
        }

        this.currentMission = {
            name:          `🤝 Combate amistoso: ${npc.name}`,
            rank:          'F',
            description:   'Sin muerte. El combate termina al llegar a 1 HP.',
            enemies:       [],
            ryo:           0,
            exp:           120,
            turns:         0,
            friendlyBattle: true,
            npcId,
        };

        const s = npc.stats || {};
        const enemy = { name:npc.name, hp:s.hp||220, chakra:s.chakra||120, attack:s.attack||25, defense:s.defense||18, accuracy:s.accuracy||14, genjutsu:s.genjutsu||10, exp:0, ryo:0 };
        this.enemyQueue  = [];
        this.totalWaves  = 1;
        this.currentWave = 1;
        this.currentEnemy = { ...enemy, maxHp: enemy.hp, maxChakra: enemy.chakra, controlledTurns: 0 };
        this.startCombat();
    },

    finishFriendlyBattle(didWin) {
        const npcId = this.currentMission?.npcId;
        const npc   = npcId ? (this.npcs || {})[npcId] : null;
        const stamp = npcId ? this.getNpcBattleStamp() : null;

        if (npcId && stamp) {
            this.player.npcDailyBattleStamp = this.player.npcDailyBattleStamp || {};
            this.player.npcDailyBattleStamp[npcId] = stamp;
        }

        const relGain = didWin ? 5 : 3;
        if (npcId) {
            this.updateRelationship(npcId, relGain);
            if (!didWin) { this.player.npcRivals = this.player.npcRivals || {}; this.player.npcRivals[npcId] = true; }
        }

        const expGain = didWin ? 80 : 40;
        this.player.exp     += expGain;
        this.player.totalExp = (this.player.totalExp || 0) + expGain;
        this.checkJutsuUnlocks(this.player);
        if (this.player.exp >= this.player.expToNext) this.levelUp();

        this.currentEnemy   = null;
        this.currentMission = null;
        this.enemyQueue     = [];
        this.totalWaves     = 0;
        this.currentWave    = 0;
        this.saveGame();

        setTimeout(() => {
            this.showScreen('village-screen');
            this.showSection('world');
            this.updateVillageUI();
            this.activateVillageTab('npcs');
            if (npc) {
                alert(`${didWin ? '🏆' : '🤝'} Combate amistoso vs ${npc.name}: ${didWin ? 'GANASTE' : 'PERDISTE'}\n+${expGain} EXP | +${relGain} Relación`);
                this.showNPCInteraction(npc.id);
            }
        }, 300);
    },

};
