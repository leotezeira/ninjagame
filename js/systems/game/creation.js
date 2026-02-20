// ============================================================
// character/creation.js — Nombre, aldea, clan, Kekkei Genkai
// ============================================================

export const creationMethods = {

    getPlayerDisplayName() {
        if (!this.player) return 'Ninja';
        return this.player.name ? this.player.name : `${this.player.clan} Ninja`;
    },

    // ── Pantalla de nombre ───────────────────────────────────

    showNameScreen() {
        this.pendingName = '';
        this.showScreen('name-screen');
        setTimeout(() => {
            const input = document.getElementById('player-name-input');
            const hint  = document.getElementById('name-screen-hint');
            if (input) {
                input.removeAttribute('readonly');
                input.value = '';
                input.focus();
                if (hint) hint.textContent = 'Elige el nombre que sera recordado en el mundo ninja.';
            }
            const err = document.getElementById('name-error');
            if (err) { err.style.display = 'none'; err.textContent = ''; }
        }, 50);
    },

    validateAndSaveName() {
        const input = document.getElementById('player-name-input');
        const err   = document.getElementById('name-error');
        const raw   = (this.authProfile?.username || input?.value || '').trim();
        const valid = raw.length > 0 && raw.length <= 20 && /^[A-Za-z0-9ÁÉÍÓÚÜÑáéíóúüñ ]+$/.test(raw);
        if (!valid) {
            if (err) {
                err.style.display = 'block';
                err.textContent   = 'Nombre inválido. Usa solo letras y espacios (máx 20), sin dejarlo vacío.';
            }
            return;
        }
        this.pendingName = raw.replace(/\s+/g, ' ');
        this.showVillageSelect();
    },

    // ── Selección de aldea ───────────────────────────────────

    showVillageSelect() {
        const container = document.getElementById('village-select');
        container.innerHTML = '';
        Object.keys(this.villages).forEach(villageKey => {
            const village = this.villages[villageKey];
            const card    = document.createElement('div');
            card.className = 'clan-card';
            card.onclick   = () => this.selectVillage(villageKey);
            card.innerHTML = `
                <div class="clan-card-header" style="background: linear-gradient(135deg, ${village.color}AA, ${village.color}88)">
                    <h3 style="margin:0; color:#000;">${village.icon} ${village.name}</h3>
                    <p style="margin:8px 0 0 0; font-size:0.85em; font-style:italic; color:#000;">${village.kage}</p>
                </div>
                <div class="clan-card-body">
                    <p style="margin:12px 0; font-size:0.95em; color:var(--muted);">${village.description}</p>
                    <div style="margin-top:12px; border-top:1px solid rgba(255,255,255,0.1); padding-top:12px;">
                        <div style="font-size:0.85em; color:#ffd700;">📋 Tipos de misión:</div>
                        <div style="font-size:0.9em; margin-top:4px;">${village.missionTypes.join(', ')}</div>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
        this.showScreen('village-select-screen');
    },

    selectVillage(villageKey) {
        this.pendingVillage = villageKey;
        this.showClanSelect();
    },

    // ── Selección de clan ────────────────────────────────────

    showClanSelect() {
        const container  = document.getElementById('clan-select');
        container.innerHTML = '';
        const villageKey = this.pendingVillage || this.player?.village || 'konoha';
        const clanKeys   = Object.keys(this.clans).filter(k => {
            const c = this.clans[k];
            return !c.village || c.village === villageKey;
        });
        const maxStats   = { hp:150, chakra:170, taijutsu:25, ninjutsu:23, genjutsu:20 };

        if (!clanKeys.length) {
            container.innerHTML = '<div class="story-text">No hay clanes disponibles para esta aldea.</div>';
            this.showScreen('clan-screen');
            return;
        }

        clanKeys.forEach(clanKey => {
            const clan    = this.clans[clanKey];
            const topStat = Math.max(clan.taijutsu, clan.ninjutsu, clan.genjutsu);
            const topName = clan.taijutsu === topStat ? '👊 Taijutsu' : (clan.ninjutsu === topStat ? '🌀 Ninjutsu' : '👁️ Genjutsu');
            const card    = document.createElement('div');
            card.className = 'clan-card';
            card.onclick   = () => this.selectClan(clanKey);

            const statBar = (label, val, max) => `
                <div class="stat">
                    <span>${label}</span>
                    <div class="stat-bar"><div class="stat-fill" style="width:${(val/max)*100}%;"></div></div>
                    <span>${val}</span>
                </div>`;

            card.innerHTML = `
                <div class="clan-card-header" style="background:linear-gradient(135deg,${this.getClanColor(clanKey,true)},${this.getClanColor(clanKey,false)})">
                    <h3 style="margin:0; color:#000;">${clan.icon} ${clan.name}</h3>
                    <div class="clan-stat-pill" style="color:#000;">❤️ ${clan.hp}</div>
                    <div class="clan-stat-pill" style="color:#000;">💙 ${clan.chakra}</div>
                    <div class="clan-stat-pill" style="color:#000;">${topName.split(' ')[0]} ${topStat}</div>
                </div>
                <div class="clan-card-body">
                    <div class="clan-stats">
                        ${statBar('❤️ HP',         clan.hp,       maxStats.hp)}
                        ${statBar('💙 Chakra',     clan.chakra,   maxStats.chakra)}
                        ${statBar('👊 Taijutsu',   clan.taijutsu, maxStats.taijutsu)}
                        ${statBar('🌀 Ninjutsu',   clan.ninjutsu, maxStats.ninjutsu)}
                        ${statBar('👁️ Genjutsu',  clan.genjutsu, maxStats.genjutsu)}
                        <p style="margin-top:12px; color:var(--muted); font-size:0.9em; font-style:italic;">${clan.description}</p>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
        this.showScreen('clan-screen');
    },

    getClanColor(clanKey, light = true) {
        const colors = {
            uchiha:   { light:'rgba(231,76,60,0.65)',   dark:'rgba(192,57,43,0.55)' },
            hyuga:    { light:'rgba(52,152,219,0.65)',   dark:'rgba(41,128,185,0.55)' },
            nara:     { light:'rgba(46,204,113,0.65)',   dark:'rgba(39,174,96,0.55)' },
            yamanaka: { light:'rgba(155,89,182,0.65)',   dark:'rgba(142,68,173,0.55)' },
            akimichi: { light:'rgba(230,126,34,0.65)',   dark:'rgba(211,84,0,0.55)' },
        };
        const color = colors[clanKey] || { light:'rgba(74,85,131,0.65)', dark:'rgba(45,53,97,0.55)' };
        return light ? color.light : color.dark;
    },

    selectClan(clanKey) {
        const clan      = this.clans[clanKey];
        const villageKey = this.pendingVillage || 'konoha';
        const village   = this.villages[villageKey];

        this.player = {
            name:       (this.pendingName || '').trim(),
            clan:       clan.name,
            clanKey,
            maxHp:      clan.hp,
            hp:         clan.hp,
            maxChakra:  clan.chakra,
            chakra:     clan.chakra,
            taijutsu:   clan.taijutsu,
            ninjutsu:   clan.ninjutsu,
            genjutsu:   clan.genjutsu,
            level:      1,
            exp:        0,
            expToNext:  100,
            ryo:        500,
            rank:       'Genin',
            element:    clan.element,
            inventory:  [],
            learnedJutsus: [],
            quickJutsus:   Array(5).fill(null),
            kekkeiGenkai:  null,
            kekkeiLevel:   0,
            kekkeiExp:     0,
            totalExp:      0,
            permanentBonuses: {},
            combatsWon:    0,
            unlockedJutsus: [],

            // Mundo / calendario
            location: villageKey,
            village:  villageKey,
            day: 1, month: 1, year: 1024,
            timeOfDay: 0, weekday: 0,
            weather: 'soleado', season: 'primavera',

            // Sistemas
            fatigue:    0,
            team:       [],
            friendship: {},
            reputation: {
                konoha:0, suna:0, kiri:0, iwa:0, kumo:0,
                ame:0, bosque:0, olas:0, valle:0, nieve:0,
            },

            urgentMission: null,
            npcRelations: {}, npcRivals: {}, npcDailyBattleStamp: {},

            missionsCompletedTotal:   0,
            missionsCompletedByRank:  { D:0, C:0, B:0, A:0, S:0, U:0, F:0 },
            missionsCompletedBPlus:   0,
            missionsCompletedSWhileChunin: 0,

            examState:    null,
            examCooldowns: { chunin:0, jonin:0 },
            lastExamNoticeAbsDay: -1,

            lastWeekProcessedForExpenses: 0,
        };

        // Reputación inicial por aldea
        if (village) {
            this.player.reputation[villageKey] = 70;
            (village.allies   || []).forEach(a => { this.player.reputation[a] = 40; });
            (village.enemies  || []).forEach(e => { this.player.reputation[e] = -30; });
            (village.rivalVillages || []).forEach(r => { this.player.reputation[r] = 10; });
        }

        this.pendingVillage = null;

        const outcome = this.rollKekkeiGenkai(this.player.clanKey);
        if (outcome.mode === 'skip') { this.finishCharacterCreation(); return; }
        this.doKekkeiGenkaiRoll(outcome);
    },

    finishCharacterCreation() {
        this.showScreen('village-screen');
        this.showSection('home');
        this.updateVillageUI();
        this.showMissions();
        this.saveGame();
        this.startRealTimeTick();
    },

};
