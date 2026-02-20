// ============================================================
// character/stats.js — Stats efectivos, level up, desbloqueos
// ============================================================

export const statsMethods = {

    getEffectiveStats() {
        const penalty  = this.getFatiguePenalty();
        const buffAll  = this.player.combatBuff?.all || 0;
        const team     = this.getTeamBonuses();
        return {
            taijutsu:            Math.max(1, this.player.taijutsu - penalty + buffAll),
            ninjutsu:            Math.max(1, this.player.ninjutsu - penalty + buffAll),
            genjutsu:            Math.max(1, this.player.genjutsu - penalty + buffAll),
            combatDamageBonus:   team.combatDamageBonus,
            teamEvasionBonus:    team.teamEvasionBonus,
            missionRyoMult:      team.missionRyoMult,
            missionExpMult:      team.missionExpMult,
            travelDayDelta:      team.travelDayDelta,
            betweenCombatHealPct: team.betweenCombatHealPct,
        };
    },

    levelUp() {
        this.player.level++;
        this.player.exp       = 0;
        this.player.expToNext = Math.floor(this.player.expToNext * 1.5);

        this.player.maxHp     += 15;
        this.player.hp         = this.player.maxHp;
        this.player.maxChakra += 20;
        this.player.chakra     = this.player.maxChakra;
        this.player.taijutsu  += 2;
        this.player.ninjutsu  += 2;
        this.player.genjutsu  += 2;

        const sidebarLevel = document.getElementById('sidebar-level');
        if (sidebarLevel) {
            sidebarLevel.classList.remove('levelup-animation');
            void sidebarLevel.offsetWidth;
            sidebarLevel.classList.add('levelup-animation');
        }

        this.checkJutsuUnlocks(this.player);
        alert(`¡NIVEL ${this.player.level}! Todos tus stats han aumentado.`);
    },

    meetsJutsuRequirements(player, req) {
        if (!req) return true;
        if (req.level  && player.level     < req.level)             return false;
        if (req.exp    && (player.totalExp || 0) < req.exp)         return false;
        if (req.stats) {
            if (req.stats.ninjutsu  && player.ninjutsu  < req.stats.ninjutsu)  return false;
            if (req.stats.taijutsu  && player.taijutsu  < req.stats.taijutsu)  return false;
            if (req.stats.genjutsu  && player.genjutsu  < req.stats.genjutsu)  return false;
        }
        if (req.kekkei_genkai) {
            if (!player.kekkeiGenkai) return false;
            if (player.kekkeiGenkai.name?.toLowerCase().replace(/\s/g,'') !== req.kekkei_genkai) return false;
            if (req.KG_level && player.kekkeiLevel < req.KG_level) return false;
        }
        return true;
    },

    checkJutsuUnlocks(player) {
        // Implementar según el sistema de juego; placeholder para compatibilidad
        if (typeof this._checkJutsuUnlocks === 'function') this._checkJutsuUnlocks(player);
    },

};
