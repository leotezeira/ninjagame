// ============================================================
// character/kekkei.js — Kekkei Genkai: roll, bonuses, levelup
// ============================================================

export const kekkeiMethods = {

    findKekkeiByName(name) {
        return (this.kekkeiGenkaiList || []).find(k => k.name === name) || null;
    },

    rollKekkeiGenkai(clanKey) {
        const rule = this.clanKekkeiRules?.[clanKey];
        if (!rule || rule.type === 'none') return { mode:'skip', kind:'none' };

        if (rule.type === 'guaranteed') {
            return { mode:'screen', kind:'guaranteed', kg: this.findKekkeiByName(rule.kekkei) };
        }

        if (rule.type === 'chance') {
            const chance = Number(rule.chance ?? 0);
            if (Math.random() * 100 <= chance) {
                return { mode:'screen', kind:'rolled_win', kg: this.findKekkeiByName(rule.kekkei), chance };
            }
            return { mode:'screen', kind:'rolled_lose', kg: null, chance };
        }

        return { mode:'skip', kind:'none' };
    },

    doKekkeiGenkaiRoll(outcome) {
        this.showScreen('kekkei-screen');
        const resultDiv   = document.getElementById('kekkei-result');
        const continueBtn = document.getElementById('kekkei-continue-btn');

        if (resultDiv) {
            resultDiv.className = 'kekkei-genkai-notification';
            resultDiv.innerHTML = '<h2>🌟 Realizando Sorteo de Kekkei Genkai... 🌟</h2>';
        }
        if (continueBtn) {
            continueBtn.disabled = true;
            continueBtn.style.opacity  = '0.4';
            continueBtn.style.cursor   = 'not-allowed';
        }

        setTimeout(() => {
            const out         = outcome || { kind:'rolled_lose' };
            const kg          = out.kg || null;
            const chanceText  = (typeof out.chance === 'number') ? `${out.chance}%` : '';

            if ((out.kind === 'guaranteed' || out.kind === 'rolled_win') && kg) {
                this.player.kekkeiGenkai = kg;
                this.player.kekkeiLevel  = 1;
                this.player.kekkeiExp    = 0;
                this.applyKekkeiGenkaiBonuses();

                const title = out.kind === 'guaranteed' ? '🌟 ¡KEKKEI GENKAI ANCESTRAL! 🌟' : '🌟 ¡KEKKEI GENKAI DESBLOQUEADO! 🌟';
                const sub   = out.kind === 'guaranteed' ? '¡Tu clan posee este poder ancestral!' : `¡Fuiste bendecido!${chanceText ? ` (${chanceText} chance)` : ''}`;
                if (resultDiv) {
                    resultDiv.className = 'kekkei-genkai-notification granted';
                    resultDiv.innerHTML = `
                        <h2>${title}</h2>
                        <div style="font-size:2.8em; margin:20px 0; font-weight:900; letter-spacing:1px;">${kg.name}</div>
                        <p style="font-size:1.3em; font-weight:600;">${kg.levels?.[0]?.name || ''}</p>
                        <p style="margin-top:16px;">${sub}</p>
                    `;
                }
            } else {
                if (resultDiv) {
                    resultDiv.className = 'kekkei-genkai-notification';
                    resultDiv.style.background = 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)';
                    resultDiv.innerHTML = `
                        <h2>🍂 Sorteo de Kekkei Genkai 🍂</h2>
                        <p style="font-size:1.3em; margin:20px 0; font-weight:600;">No obtuviste Kekkei Genkai.</p>
                        <p style="margin-bottom:12px;">Los Kekkei Genkai son extremadamente raros.</p>
                        <p>Tu determinación y trabajo duro te harán fuerte.</p>
                        ${chanceText ? `<p style="margin-top:16px; opacity:0.85;">Probabilidad: ${chanceText}</p>` : ''}
                    `;
                }
            }

            if (continueBtn) {
                continueBtn.disabled      = false;
                continueBtn.style.opacity = '1';
                continueBtn.style.cursor  = 'pointer';
            }
        }, 1500);
    },

    applyKekkeiGenkaiBonuses() {
        if (!this.player.kekkeiGenkai) return;
        const currentLevel = this.player.kekkeiGenkai.levels[this.player.kekkeiLevel - 1];
        const bonus        = currentLevel.bonus;

        if (bonus.all)      { this.player.taijutsu += bonus.all; this.player.ninjutsu += bonus.all; this.player.genjutsu += bonus.all; }
        if (bonus.taijutsu) this.player.taijutsu += bonus.taijutsu;
        if (bonus.ninjutsu) this.player.ninjutsu += bonus.ninjutsu;
        if (bonus.genjutsu) this.player.genjutsu += bonus.genjutsu;
        if (bonus.maxHp)    { this.player.maxHp += bonus.maxHp;     this.player.hp    = this.player.maxHp; }
        if (bonus.maxChakra){ this.player.maxChakra += bonus.maxChakra; this.player.chakra = this.player.maxChakra; }

        this.player.critChance  = bonus.critChance  || 0;
        this.player.chakraRegen = bonus.chakraRegen || 0;
    },

    levelUpKekkei() {
        const nextLevel = this.player.kekkeiGenkai.levels[this.player.kekkeiLevel];
        if (!nextLevel) return;

        const prevLevelData = this.player.kekkeiGenkai.levels[this.player.kekkeiLevel - 1];
        this.player.kekkeiLevel++;
        const newLevelData  = this.player.kekkeiGenkai.levels[this.player.kekkeiLevel - 1];

        const diff = (key, fallback = 0) =>
            (newLevelData.bonus[key] || 0) - (prevLevelData?.bonus[key] || fallback);

        if (newLevelData.bonus.all) {
            const d = diff('all');
            this.player.taijutsu += d; this.player.ninjutsu += d; this.player.genjutsu += d;
        }
        if (newLevelData.bonus.taijutsu) this.player.taijutsu += diff('taijutsu');
        if (newLevelData.bonus.ninjutsu) this.player.ninjutsu += diff('ninjutsu');
        if (newLevelData.bonus.genjutsu) this.player.genjutsu += diff('genjutsu');

        this.player.critChance  = newLevelData.bonus.critChance  || 0;
        this.player.chakraRegen = newLevelData.bonus.chakraRegen || 0;

        alert(`🌟 ¡${this.player.kekkeiGenkai.name} ha evolucionado!\n\nNuevo nivel: ${newLevelData.name}\n\n¡Tus poderes han aumentado!`);
    },

};
