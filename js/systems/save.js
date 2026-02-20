// Sistema de guardado/carga/migración para NinjaGame
// Extraído de game.js para modularización

const SaveSystem = {
    saveGame() {
        try {
            localStorage.setItem('ninjaRPGSave', JSON.stringify(this.player));
            console.log('Partida guardada');
            if (this.supabase && this.authUser?.id) {
                this.supabase
                    .from('players')
                    .update({
                        game_state: this.player,
                        last_seen: new Date().toISOString(),
                        is_online: true,
                        village: this.player.village || 'unknown',
                        clan: this.player.clan || null,
                        level: this.player.level,
                        rank: this.player.rank
                    })
                    .eq('id', this.authUser.id);
            }
        } catch(e) {
            console.error('Error guardando:', e);
        }
    },

    async loadGame() {
        try {
            const save = localStorage.getItem('ninjaRPGSave');
            if (!save) {
                await this.gameAlert('No hay partida guardada', '❌');
                // Redirigir a pantalla de inicio o login
                if (typeof this.showScreen === 'function') {
                    this.showScreen('start-screen'); // Ajusta el ID si tu pantalla de inicio tiene otro nombre
                }
                return;
            }
            this.player = JSON.parse(save);
            this.migratePlayerSave();
            this.startRealTimeTick();
            if (this.player?.examState?.active) {
                this.renderExamFromState();
            } else {
                this.showScreen('village-screen');
                this.showSection('home');
                this.updateVillageUI();
                this.showMissions();
            }
            if (this.player?.sleepState) {
                this.showSleepOverlay();
            }
           await this.gameAlert('¡Partida cargada!', '✅');
        } catch(e) {
            console.error('Error cargando:', e);
            await this.gameAlert('Error al cargar la partida', '❌');
        }
    },

    deleteSave() {
        localStorage.removeItem('ninjaRPGSave');
        location.reload();
    },

    migratePlayerSave() {
        if (!this.player) return;
        const defaults = {
            sleepState: null,
            name: '',
            location: 'konoha',
            village: 'konoha',
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
            urgentMission: null,
            npcRelations: {},
            npcRivals: {},
            npcDailyBattleStamp: {},
            missionsCompletedTotal: 0,
            missionsCompletedByRank: { D: 0, C: 0, B: 0, A: 0, S: 0, U: 0, F: 0 },
            missionsCompletedBPlus: 0,
            examState: null,
            examCooldowns: { chunin: 0, jonin: 0 },
            lastExamNoticeAbsDay: -1,
            lastWeekProcessedForExpenses: 0,
            isRenegade: false,
            status: 'loyal',
            renegadeLevel: 0,
            bounty: 0,
            organization: null,
            organizationRank: 0,
            karma: 0,
            anbuTimerDays: 0,
            hideoutLocation: null,
            kinjutsuLearned: [],
            daysAsRenegade: 0,
            identityHiddenDays: 0,
            anbuEliminated: 0,
            criminalMissions: 0,
            renegadesCaptured: 0,
            dailyIzanagiReady: false,
            blackMarketInventory: [],
            hasDailyIzanagi: false,
            izanagiAvailable: false,
            izanagiUsed: false,
            pendingStealKg: false,
            combatBuff: null,
            jashinTurns: 0,
            jashinReflect: 0,
            edoAllyTurns: 0
        };
        for (const [key, value] of Object.entries(defaults)) {
            if (this.player[key] === undefined || this.player[key] === null) {
                this.player[key] = (typeof structuredClone === 'function')
                    ? structuredClone(value)
                    : JSON.parse(JSON.stringify(value));
            }
        }
        this.player.fatigue = this.clamp(this.player.fatigue, 0, 100);
        this.player.weekday = this.clamp(this.player.weekday, 0, 6);
        this.player.day = this.clamp(this.player.day, 1, this.daysPerMonth);
        this.player.month = this.clamp(this.player.month, 1, this.monthsPerYear);
        this.player.year = Math.max(1, this.player.year);
        this.player.karma = this.clamp(this.player.karma, -100, 100);
        this.player.renegadeLevel = this.clamp(this.player.renegadeLevel, 0, 5);
        this.player.bounty = Math.max(0, this.player.bounty || 0);
        this.player.anbuTimerDays = Math.max(0, this.player.anbuTimerDays || 0);
        this.player.identityHiddenDays = Math.max(0, this.player.identityHiddenDays || 0);
        this.player.daysAsRenegade = Math.max(0, this.player.daysAsRenegade || 0);
        this.player.anbuEliminated = Math.max(0, this.player.anbuEliminated || 0);
        this.player.criminalMissions = Math.max(0, this.player.criminalMissions || 0);
        this.player.renegadesCaptured = Math.max(0, this.player.renegadesCaptured || 0);
        if (typeof this.player.npcRelations !== 'object' || !this.player.npcRelations) this.player.npcRelations = {};
        if (typeof this.player.npcRivals !== 'object' || !this.player.npcRivals) this.player.npcRivals = {};
        if (typeof this.player.npcDailyBattleStamp !== 'object' || !this.player.npcDailyBattleStamp) this.player.npcDailyBattleStamp = {};
        this.player.missionsCompletedTotal = Math.max(0, this.player.missionsCompletedTotal || 0);
        this.player.missionsCompletedBPlus = Math.max(0, this.player.missionsCompletedBPlus || 0);
        this.player.missionsCompletedSWhileChunin = Math.max(0, this.player.missionsCompletedSWhileChunin || 0);
        if (typeof this.player.missionsCompletedByRank !== 'object' || !this.player.missionsCompletedByRank) {
            this.player.missionsCompletedByRank = { D: 0, C: 0, B: 0, A: 0, S: 0, U: 0, F: 0 };
        }
        if (typeof this.player.examCooldowns !== 'object' || !this.player.examCooldowns) this.player.examCooldowns = { chunin: 0, jonin: 0 };
        this.player.examCooldowns.chunin = Math.max(0, this.player.examCooldowns.chunin || 0);
        this.player.examCooldowns.jonin = Math.max(0, this.player.examCooldowns.jonin || 0);
        this.player.lastExamNoticeAbsDay = Number.isFinite(this.player.lastExamNoticeAbsDay) ? this.player.lastExamNoticeAbsDay : -1;
        if (!Array.isArray(this.player.blackMarketInventory)) this.player.blackMarketInventory = [];
        if (!Array.isArray(this.player.kinjutsuLearned)) this.player.kinjutsuLearned = [];
        if (!Array.isArray(this.player.quickJutsus)) this.player.quickJutsus = [];
        if (this.player.quickJutsus.length !== 5) {
            this.player.quickJutsus = Array.from({ length: 5 }, (_, i) => this.player.quickJutsus[i] || null);
        }
        this.player.hasDailyIzanagi = !!this.player.hasDailyIzanagi;
        this.player.dailyIzanagiReady = !!this.player.dailyIzanagiReady;
        this.player.izanagiAvailable = !!this.player.izanagiAvailable;
        this.player.izanagiUsed = !!this.player.izanagiUsed;
        this.player.pendingStealKg = !!this.player.pendingStealKg;
        this.player.jashinTurns = Math.max(0, this.player.jashinTurns || 0);
        this.player.jashinReflect = Math.max(0, this.player.jashinReflect || 0);
        this.player.edoAllyTurns = Math.max(0, this.player.edoAllyTurns || 0);
        if (this.player.isRenegade && this.player.location === 'konoha') {
            this.player.location = this.player.hideoutLocation || 'bosque';
        }
        delete this.player.timeOfDay;
        this.updateSeasonAndWeather(false);
    }
};

export { SaveSystem };
