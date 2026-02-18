// Sistema de guardado/carga/migración para NinjaGame
// Extraído de game.js para modularización

const SaveSystem = {
    async saveGame() {
        if (!this.player) return;
        const json = JSON.stringify(this.player);
        try { localStorage.setItem('ninjaRPGSave', json); } catch(e) {}
        const user = AuthSystem.getUser && AuthSystem.getUser();
        if (!user) return;
        try {
            await supabase.from('player_saves').upsert({
                user_id: user.id,
                data: this.player,
                updated_at: new Date().toISOString()
            });
            await supabase.from('profiles').update({
                clan: this.player.clan,
                rank: this.player.rank,
                level: this.player.level,
                kekkei_genkai: this.player.kekkeiGenkai?.name || null,
                village: this.player.location,
                last_seen: new Date().toISOString()
            }).eq('user_id', user.id);
        } catch(e) {
            console.warn('Supabase save failed, usando localStorage:', e);
        }
    },

    async loadGame() {
        const user = AuthSystem.getUser && AuthSystem.getUser();
        if (user) {
            try {
                const { data } = await supabase
                    .from('player_saves')
                    .select('data')
                    .eq('user_id', user.id)
                    .single();
                if (data?.data) {
                    this.player = data.data;
                    localStorage.setItem('ninjaRPGSave', JSON.stringify(this.player));
                    this.updateVillageUI && this.updateVillageUI();
                    return;
                }
            } catch(e) {
                console.warn('Supabase load failed, intentando localStorage:', e);
            }
        }
        const local = localStorage.getItem('ninjaRPGSave');
        if (local) {
            try {
                this.player = JSON.parse(local);
                if (user && this.saveGame) await this.saveGame();
                this.updateVillageUI && this.updateVillageUI();
            } catch(e) {
                console.error('Save corrupto:', e);
                this.player = null;
            }
        }
    },

    deleteSave() {
        localStorage.removeItem('ninjaRPGSave');
        location.reload();
    },

    migratePlayerSave() {
        if (!this.player) return;
        const defaults = {
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
