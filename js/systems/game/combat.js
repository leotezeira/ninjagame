// ============================================================
// combat/combat.js — startCombat, enemyTurn, winCombat, defeat
// ============================================================

export const combatMethods = {

    startCombat() {
        console.log('⚔️ startCombat called — enemy:', this.currentEnemy?.name);
        this.showScreen('combat-screen');

        this.combatLog   = [];
        this.kawairimiUsed  = false;
        this.defendActive   = false;

        const combatLogEl = document.getElementById('combat-log');
        if (combatLogEl) combatLogEl.innerHTML = '';

        const playerNameEl = document.getElementById('combat-player-name');
        const enemyNameEl  = document.getElementById('enemy-name');
        const enemyStatsEl = document.getElementById('enemy-stats');

        if (playerNameEl) playerNameEl.textContent = this.getPlayerDisplayName();
        if (enemyNameEl)  enemyNameEl.textContent  = this.currentEnemy.name +
            (this.totalWaves > 1 ? ` (${this.currentWave}/${this.totalWaves})` : '');
        if (enemyStatsEl) enemyStatsEl.textContent =
            `⚔️ Ataque: ${this.currentEnemy.attack} | 🛡️ Defensa: ${this.currentEnemy.defense} | 🎯 Precisión: +${this.currentEnemy.accuracy}`;

        this.updateBar('combat-player-health-bar', this.player.hp,     this.player.maxHp,     'HP');
        this.updateBar('combat-player-chakra-bar', this.player.chakra, this.player.maxChakra, 'Chakra');
        this.updateBar('enemy-health-bar',         this.currentEnemy.hp, this.currentEnemy.maxHp, 'HP');

        if (this.currentWave === 1) {
            this.addCombatLog(
                this.currentMission?.isTravelEncounter
                    ? '⚠️ Encuentro durante el viaje.'
                    : `¡Misión iniciada! ${this.totalWaves > 1 ? this.totalWaves + ' enemigos detectados!' : 'Un enemigo aparece!'}`,
                'log-special'
            );
        }
        this.addCombatLog(`¡${this.currentEnemy.name} aparece!`, 'log-attack');

        this.combatTurn = 'player';
        this.enableCombatButtons();
    },

    addCombatLog(message, className = '') {
        const log   = document.getElementById('combat-log');
        if (!log) return;
        const entry = document.createElement('div');
        entry.className = `log-entry ${className}`;
        entry.innerHTML = message;
        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;
    },

    enableCombatButtons() {
        ['attack-btn','jutsu-menu-btn','genjutsu-btn','defend-btn','item-btn'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.disabled = false;
        });
        const kw = document.getElementById('kawarimi-btn');
        if (kw) kw.disabled = this.kawairimiUsed;
    },

    disableCombatButtons() {
        ['attack-btn','jutsu-menu-btn','genjutsu-btn','defend-btn','kawarimi-btn','item-btn'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.disabled = true;
        });
    },

    // ── Turno del enemigo ────────────────────────────────────

    enemyTurn() {
        this.combatTurn = 'enemy';

        const enemySprite = document.getElementById('enemy-sprite');
        if (enemySprite) {
            enemySprite.classList.remove('attack-animation');
            void enemySprite.offsetWidth;
            enemySprite.classList.add('attack-animation');
        }

        if (this.currentEnemy?.controlledTurns > 0) {
            this.currentEnemy.controlledTurns--;
            this.addCombatLog('🧠 El enemigo está controlado y pierde su turno.', 'log-special');
            this.combatTurn = 'player';
            this.enableCombatButtons();
            return;
        }

        // Aliado edo
        if (this.player.edoAllyTurns > 0) {
            const allyDmg = 80 + Math.floor((this.player.ninjutsu || 0) / 2);
            this.currentEnemy.hp -= allyDmg;
            this.addCombatLog(`🧟 Tu aliado invocado ataca y causa ${allyDmg} daño.`, 'log-damage');
            this.updateBar('enemy-health-bar', this.currentEnemy.hp, this.currentEnemy.maxHp, 'HP');
            this.player.edoAllyTurns--;
            if (this.currentEnemy.hp <= 0) { this.winCombat(); return; }
        }

        const attacks = Array.isArray(this.currentEnemy?.doubleAttack?.attacks)
            ? this.currentEnemy.doubleAttack.attacks : [null];

        this.addCombatLog(
            attacks.length > 1 ? `${this.currentEnemy.name} ataca... (x${attacks.length})` : `${this.currentEnemy.name} ataca...`,
            'log-attack'
        );

        const stats = this.getEffectiveStats();
        let playerDefense = 10 + Math.floor(stats.taijutsu / 2);
        if (stats.teamEvasionBonus > 0) playerDefense += Math.floor(playerDefense * stats.teamEvasionBonus);
        if (this.defendActive) { playerDefense += 5; this.defendActive = false; }

        setTimeout(() => {
            // Kawarimi
            if (this.kawairimiUsed && !this.player.kawairimiActivated) {
                this.addCombatLog('¡Usas Kawarimi! Te sustituyes y evitas el ataque.', 'log-special');
                this.player.kawairimiActivated = true;
                this.combatTurn = 'player';
                this.enableCombatButtons();
                return;
            }

            const examMeta = this.currentMission?.examMeta;

            for (const part of attacks) {
                const partAttack = Number.isFinite(part?.attack)   ? part.attack   : this.currentEnemy.attack;
                const partAcc    = Number.isFinite(part?.accuracy) ? part.accuracy : (this.currentEnemy.accuracy || 0);

                const attackRoll  = this.rollDice(20);
                const totalAttack = attackRoll + partAttack + partAcc;
                this.addCombatLog(
                    `Enemigo tira: <span class="dice-roll">${attackRoll}</span> + ${partAttack} + ${partAcc} = ${totalAttack} vs Defensa ${playerDefense}`,
                    'log-attack'
                );

                if (totalAttack < playerDefense) { this.addCombatLog('¡Esquivas el ataque!', 'log-miss'); continue; }

                const baseDamage = this.rollDice(8) + this.rollDice(6);
                const damage     = Math.max(1, baseDamage + Math.floor(partAttack / 1.5));

                // Proteger aliados (Jonin test 3)
                if (examMeta?.protectAllies && this.player?.examState?.active && this.player.examState.type === 'jonin') {
                    const allies = this.player.examState.data?.allies;
                    if (Array.isArray(allies) && allies.length > 0 && Math.random() < 0.25) {
                        const ally = allies[Math.floor(Math.random() * allies.length)];
                        ally.hp = Math.max(0, (ally.hp || 0) - Math.max(1, Math.floor(damage * 0.9)));
                        this.addCombatLog(`⚠️ ${this.currentEnemy.name} golpea a ${ally.name}: -${damage} HP.`, 'log-damage');
                        this.saveGame();
                        if (ally.hp <= 0) { this.addCombatLog(`❌ ${ally.name} cae.`, 'log-damage'); this.handleExamFightDefeat(); return; }
                        continue;
                    }
                }

                this.player.hp -= damage;

                // Jashin reflect
                if (this.player.jashinTurns > 0) {
                    const reflect = Math.max(1, Math.floor(damage * (this.player.jashinReflect || 0.3)));
                    this.currentEnemy.hp -= reflect;
                    this.addCombatLog(`🩸 Reflejas ${reflect} de daño al enemigo.`, 'log-special');
                    this.updateBar('enemy-health-bar', this.currentEnemy.hp, this.currentEnemy.maxHp, 'HP');
                    if (this.currentEnemy.hp <= 0) { this.winCombat(); return; }
                }

                this.addCombatLog(`¡Te golpean! Recibes ${damage} de daño.`, 'log-damage');
                this.updateBar('combat-player-health-bar', this.player.hp, this.player.maxHp, 'HP');

                // Izanagi
                if (this.player.hp <= 0 && this.player.izanagiAvailable && !this.player.izanagiUsed) {
                    this.player.izanagiUsed = true;
                    this.player.izanagiAvailable = false;
                    this.player.hp     = this.player.maxHp;
                    this.player.chakra = Math.min(this.player.maxChakra, this.player.chakra + 50);
                    this.addCombatLog('👁️ IZANAGI: reescribes la realidad y vuelves con vida.', 'log-special');
                    this.updateBar('combat-player-health-bar', this.player.hp, this.player.maxHp, 'HP');
                    this.updateBar('combat-player-chakra-bar', this.player.chakra, this.player.maxChakra, 'Chakra');
                }

                // Jashin inmortalidad
                if (this.player.hp <= 0 && this.player.jashinTurns > 0) {
                    this.player.hp = 1;
                    this.addCombatLog('🩸 Ritual activo: no puedes morir todavía.', 'log-special');
                    this.updateBar('combat-player-health-bar', this.player.hp, this.player.maxHp, 'HP');
                }

                if (this.player.hp <= 0 && this.currentMission?.friendlyBattle) {
                    this.player.hp = 1;
                    this.updateBar('combat-player-health-bar', this.player.hp, this.player.maxHp, 'HP');
                    this.addCombatLog('🤝 Combate amistoso: caes, pero no mueres. (HP=1)', 'log-special');
                    this.finishFriendlyBattle(false);
                    return;
                }

                if (this.player.hp <= 0 && this.currentMission?.isExamFight) { this.handleExamFightDefeat(); return; }
                if (this.player.hp <= 0) { this.defeat(); return; }
            }

            // Buff de combate tick
            if (this.player.combatBuff?.turns) {
                this.player.combatBuff.turns--;
                if (this.player.combatBuff.turns <= 0) {
                    if (this.player.combatBuff.backlashHp) {
                        this.player.hp = Math.max(1, this.player.hp - this.player.combatBuff.backlashHp);
                        this.addCombatLog(`⚠️ Efecto secundario: -${this.player.combatBuff.backlashHp} HP.`, 'log-damage');
                        this.updateBar('combat-player-health-bar', this.player.hp, this.player.maxHp, 'HP');
                    }
                    this.player.combatBuff = null;
                }
            }
            if (this.player.jashinTurns > 0) this.player.jashinTurns--;

            this.combatTurn = 'player';
            this.enableCombatButtons();
        }, 1000);
    },

    // ── Victoria ─────────────────────────────────────────────

    winCombat() {
        this.addCombatLog(`¡${this.currentEnemy.name} ha sido derrotado!`, 'log-heal');
        this.addFatigue(10);

        const combatScreen = document.getElementById('combat-screen');
        if (combatScreen) {
            combatScreen.classList.remove('victory-animation');
            void combatScreen.offsetWidth;
            combatScreen.classList.add('victory-animation');
        }

        const expPerEnemy = Math.floor(this.currentMission.exp / this.totalWaves);
        const ryoPerEnemy = Math.floor(this.currentMission.ryo / this.totalWaves);

        this.player.exp      += expPerEnemy;
        this.player.totalExp  = (this.player.totalExp || 0) + expPerEnemy;
        this.player.ryo      += ryoPerEnemy;
        this.player.combatsWon++;

        // Cura entre combates
        const stats = this.getEffectiveStats();
        if (stats.betweenCombatHealPct > 0 && !this.currentMission?.examMeta?.noBetweenHeal) {
            const heal = Math.max(1, Math.floor(this.player.maxHp * stats.betweenCombatHealPct));
            this.player.hp = Math.min(this.player.maxHp, this.player.hp + heal);
            this.addCombatLog(`💗 Tu equipo te cura ${heal} HP.`, 'log-heal');
            this.updateBar('combat-player-health-bar', this.player.hp, this.player.maxHp, 'HP');
        }

        this.addCombatLog(`+${expPerEnemy} EXP | +${ryoPerEnemy} Ryo`, 'log-special');

        // Siguiente oleada
        if (this.enemyQueue.length > 0) {
            this.addCombatLog('¡El siguiente enemigo se acerca!', 'log-special');
            setTimeout(() => {
                this.currentWave++;
                this.currentEnemy = this.enemyQueue.shift();
                this.kawairimiUsed = false;
                this.player.kawairimiActivated = false;
                this.startCombat();
            }, 2000);
            return;
        }

        // Encuentro de viaje
        if (this.currentMission?.isTravelEncounter) {
            this.currentMission = null;
            this.currentEnemy   = null;
            this.saveGame();
            setTimeout(() => {
                this.showScreen('village-screen');
                this.showSection('home');
                this.updateVillageUI();
                if (this.player?.travelState) this.processNextTravelDay();
            }, 900);
            return;
        }

        // Examen
        if (this.currentMission?.isExamFight) {
            this.saveGame();
            setTimeout(() => {
                this.currentMission = null;
                this.currentEnemy   = null;
                this.enemyQueue     = [];
                this.handleExamFightVictory();
            }, 900);
            return;
        }

        // ── Fin de misión normal ─────────────────────────────

        let kekkeiExpGain = 0;
        if (this.player.kekkeiGenkai) {
            const fullMoonMult = (this.player.day === 15) ? 1.10 : 1;
            kekkeiExpGain = Math.floor((this.currentMission.exp / 2) * fullMoonMult);
            this.player.kekkeiExp += kekkeiExpGain;
            const nextLevel = this.player.kekkeiGenkai.levels[this.player.kekkeiLevel];
            if (nextLevel && this.player.kekkeiExp >= nextLevel.exp) this.levelUpKekkei();
        }

        if (this.player.exp >= this.player.expToNext) this.levelUp();

        // Robo de Kekkei Genkai
        if (this.player.pendingStealKg && !this.player.kekkeiGenkai) {
            const pool = Array.isArray(this.kekkeiGenkaiList) ? this.kekkeiGenkaiList : [];
            if (pool.length > 0) {
                const pick = pool[Math.floor(Math.random() * pool.length)];
                this.player.kekkeiGenkai = pick;
                this.player.kekkeiLevel  = 1;
                this.player.kekkeiExp    = 0;
                this.applyKekkeiGenkaiBonuses();
                alert(`🌑 Kinjutsu: robaste un Kekkei Genkai: ${pick.name}`);
            }
            this.player.pendingStealKg = false;
        }

        // Reputación y conteos
        this._applyMissionOutcomeRewards();

        this.checkJutsuUnlocks(this.player);
        this.saveGame();

        // Mostrar modal de victoria
        setTimeout(() => {
            const missionName     = this.currentMission?.name || '??';
            const missionExp      = this.currentMission?.exp  || 0;
            const missionRyo      = this.currentMission?.ryo  || 0;
            const victoryModal    = document.getElementById('combat-victory-modal');
            const victoryTextEl   = document.getElementById('combat-victory-text');
            const victoryRewardsEl= document.getElementById('combat-victory-rewards');
            const kekkeiExpDiv    = document.getElementById('combat-kekkei-exp-gain');

            if (victoryTextEl)    victoryTextEl.innerHTML  = `¡Misión "${missionName}" completada!<br>Has derrotado a ${this.totalWaves} enemigo(s).`;
            if (victoryRewardsEl) victoryRewardsEl.innerHTML = `<div style="color:#00ff88; font-size:1.1em;"><p>✨ +${missionExp} EXP</p><p>💰 +${missionRyo} Ryo</p></div>`;
            if (kekkeiExpDiv)     kekkeiExpDiv.innerHTML    = (this.player.kekkeiGenkai && kekkeiExpGain > 0)
                ? `<p style="color:#ffd700;">⚡ +${kekkeiExpGain} EXP de Kekkei Genkai</p>` : '';
            if (victoryModal)     victoryModal.style.display = 'flex';
        }, 2000);
    },

    _applyMissionOutcomeRewards() {
        const mission = this.currentMission;
        if (!mission) return;

        if (mission.isAnbuHunt) {
            this.player.anbuEliminated = (this.player.anbuEliminated || 0) + this.totalWaves;
            this.increaseWantedLevel(1);
            this.player.karma = this.clamp((this.player.karma || 0) - 5, -100, 100);
        } else if (mission.criminal) {
            this.applyReputationDelta('konoha', -12);
            this.applyReputationDelta(this.player.location, -6);
            this.increaseWantedLevel(1);
            this.player.criminalMissions = (this.player.criminalMissions || 0) + 1;
            this.player.karma = this.clamp((this.player.karma || 0) - 8, -100, 100);
        } else if (mission.isUrgent) {
            this.applyReputationDelta(this.player.location, 12);
            this.player.urgentMission = null;
        } else {
            this.applyReputationDelta(this.player.location, 5);
        }

        if (mission.npcId && mission.relationshipGain) {
            this.updateRelationship(mission.npcId, Number(mission.relationshipGain) || 0);
        }

        if (!mission.friendlyBattle) {
            const mr = (mission.rank || '').toUpperCase();
            if (!this.player.missionsCompletedByRank || typeof this.player.missionsCompletedByRank !== 'object') {
                this.player.missionsCompletedByRank = { D:0, C:0, B:0, A:0, S:0, U:0, F:0 };
            }
            if (mr) {
                this.player.missionsCompletedByRank[mr] = (this.player.missionsCompletedByRank[mr] || 0) + 1;
                this.player.missionsCompletedTotal = (this.player.missionsCompletedTotal || 0) + 1;
                if (['B','A','S'].includes(mr)) this.player.missionsCompletedBPlus = (this.player.missionsCompletedBPlus || 0) + 1;
                if (mr === 'S' && this.player.rank === 'Chunin') {
                    this.player.missionsCompletedSWhileChunin = (this.player.missionsCompletedSWhileChunin || 0) + 1;
                }
            }
        }
    },

    // ── Derrota ──────────────────────────────────────────────

    defeat() {
        const combatScreen = document.getElementById('combat-screen');
        if (combatScreen) {
            combatScreen.classList.remove('defeat-animation');
            void combatScreen.offsetWidth;
            combatScreen.classList.add('defeat-animation');
        }

        if (this.currentMission?.isExamFight) { this.handleExamFightDefeat(); return; }

        if (this.currentMission?.isAnbuHunt && this.player?.isRenegade) {
            alert('⛓️ Has sido capturado por ANBU. Fin de tu camino renegado.');
            try { localStorage.removeItem('ninjaRPGSave'); } catch (e) {}
        }

        const missionName = this.currentMission ? this.currentMission.name : 'Desconocida';
        const defeatModal  = document.getElementById('combat-defeat-modal');
        const defeatTextEl = document.getElementById('combat-defeat-text');

        if (defeatTextEl) defeatTextEl.innerHTML =
            `Has caído en batalla durante la misión "${missionName}".<br><br>El camino del ninja es difícil...`;
        if (defeatModal) defeatModal.style.display = 'flex';
    },

    // ── Retorno a aldea ──────────────────────────────────────

    returnToVillageFromCombat() {
        // Ocultar modales de combate
        ['combat-victory-modal','combat-defeat-modal'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });

        this.currentMission = null;
        this.currentEnemy   = null;
        this.enemyQueue     = [];
        this.combatLog      = [];
        this.totalWaves     = 0;
        this.currentWave    = 0;

        const header    = document.getElementById('game-header');
        const bottomNav = document.getElementById('bottom-nav');
        if (header)    { header.style.display = ''; header.classList.add('visible'); }
        if (bottomNav)   bottomNav.style.display = '';

        const combatScreen = document.getElementById('combat-screen');
        if (combatScreen) combatScreen.classList.remove('victory-animation','defeat-animation');

        ['combat-player-sprite','enemy-sprite'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('attack-animation','jutsu-animation','damage-animation');
        });

        this.showScreen('village-screen');
        this.showSection('home');
        this.updateVillageUI();
        this.showMissions();
    },

    // Alias para compatibilidad
    returnToVillage() { this.returnToVillageFromCombat(); },

};
