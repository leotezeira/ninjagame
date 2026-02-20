// ============================================================
// combat/actions.js — basicAttack, jutsu, genjutsu, defend...
// ============================================================

export const actionsMethods = {

    basicAttack() {
        if (this.combatTurn !== 'player') return;
        if (this.checkFatigueFaint()) return;

        this.disableCombatButtons();
        document.getElementById('jutsu-selection').style.display  = 'none';
        document.getElementById('combat-inventory').style.display = 'none';

        const playerSprite = document.getElementById('combat-player-sprite');
        if (playerSprite) {
            playerSprite.classList.remove('attack-animation');
            void playerSprite.offsetWidth;
            playerSprite.classList.add('attack-animation');
        }

        const stats       = this.getEffectiveStats();
        const attackRoll  = this.rollDice(20);
        const isCrit      = attackRoll === 20 || (this.rollDice(100) <= (this.player.critChance || 0));
        const totalAttack = attackRoll + stats.taijutsu;
        const enemyDef    = 10 + this.currentEnemy.defense;

        this.addCombatLog(
            `Atacas con Taijutsu: <span class="dice-roll">${attackRoll}</span> + ${stats.taijutsu} = ${totalAttack}`,
            'log-attack'
        );

        if (totalAttack >= enemyDef || isCrit) {
            const dmgRoll  = this.rollDice(8);
            let damage     = Math.max(1, dmgRoll + Math.floor(stats.taijutsu / 2) + (stats.combatDamageBonus || 0));
            if (isCrit) { damage *= 2; this.addCombatLog('¡CRÍTICO! Daño duplicado', 'log-special'); }

            this.currentEnemy.hp -= damage;

            const enemySprite = document.getElementById('enemy-sprite');
            if (enemySprite) {
                enemySprite.classList.remove('damage-animation');
                void enemySprite.offsetWidth;
                enemySprite.classList.add('damage-animation');
            }
            this.addCombatLog(`¡Impacto! Infliges ${damage} de daño.`, 'log-damage');
            this.updateBar('enemy-health-bar', this.currentEnemy.hp, this.currentEnemy.maxHp, 'HP');

            if (this.currentEnemy.hp <= 0) {
                if (this.currentMission?.friendlyBattle) {
                    this.currentEnemy.hp = 1;
                    this.updateBar('enemy-health-bar', 1, this.currentEnemy.maxHp, 'HP');
                    this.finishFriendlyBattle(true);
                    return;
                }
                this.winCombat();
                return;
            }
        } else {
            this.addCombatLog('¡Fallaste el ataque!', 'log-miss');
        }
        setTimeout(() => this.enemyTurn(), 1500);
    },

    toggleJutsuMenu() {
        const menu      = document.getElementById('jutsu-selection');
        const inventory = document.getElementById('combat-inventory');
        if (inventory) inventory.style.display = 'none';
        if (!menu) return;
        if (menu.style.display === 'none') { menu.style.display = 'block'; this.loadJutsuList(); }
        else                                menu.style.display = 'none';
    },

    loadJutsuList() {
        const jutsuList = document.getElementById('jutsu-list');
        const slotsEl   = document.getElementById('quick-jutsu-slots');
        const hintEl    = document.getElementById('quick-jutsu-hint');
        if (!jutsuList) return;
        jutsuList.innerHTML = '';
        if (slotsEl) slotsEl.innerHTML = '';

        if (this.player.learnedJutsus.length === 0) {
            jutsuList.innerHTML = '<p>No has aprendido jutsus. Ve a la Academia.</p>';
            return;
        }

        if (!Array.isArray(this.player.quickJutsus) || this.player.quickJutsus.length !== 5) {
            this.player.quickJutsus = Array.from({ length:5 }, (_, i) => this.player.quickJutsus?.[i] || null);
        }
        this.selectedJutsuSlot = Number.isInteger(this.selectedJutsuSlot) ? this.selectedJutsuSlot : null;
        if (hintEl) hintEl.textContent = this.selectedJutsuSlot === null
            ? 'Selecciona un slot y asigna abajo' : `Slot ${this.selectedJutsuSlot + 1} seleccionado`;

        // Slots rápidos
        if (slotsEl) {
            this.player.quickJutsus.forEach((name, index) => {
                const jutsu = this.player.learnedJutsus.find(j => j.name === name);
                const slot  = document.createElement('button');
                slot.className = `jutsu-quick-slot${this.selectedJutsuSlot === index ? ' selected' : ''}`;
                slot.type = 'button';
                slot.innerHTML = jutsu
                    ? `<strong>${jutsu.name}</strong><span>💙 ${jutsu.chakra}</span><span class="slot-clear" data-slot="${index}">✖</span>`
                    : `<strong>Slot ${index + 1}</strong><span>Vacío</span>`;
                slot.addEventListener('click', () => {
                    if (jutsu) { this.useJutsu(jutsu); return; }
                    this.selectedJutsuSlot = index;
                    this.loadJutsuList();
                });
                slotsEl.appendChild(slot);
            });

            slotsEl.querySelectorAll('.slot-clear').forEach(btn => {
                btn.addEventListener('click', e => {
                    e.stopPropagation();
                    const idx = Number(btn.getAttribute('data-slot'));
                    if (!Number.isInteger(idx)) return;
                    this.player.quickJutsus[idx] = null;
                    this.saveGame();
                    this.loadJutsuList();
                });
            });
        }

        // Lista completa
        this.player.learnedJutsus.forEach(jutsu => {
            const entry  = document.createElement('div');
            entry.className = 'jutsu-entry';

            const btn = document.createElement('button');
            btn.className = 'jutsu-btn';
            btn.disabled  = this.player.chakra < jutsu.chakra;
            btn.onclick   = () => this.useJutsu(jutsu);
            btn.innerHTML = `
                <h4>${jutsu.name}</h4>
                <p style="font-size:0.85em;">${jutsu.description}</p>
                <p style="color:#3498db; margin-top:5px;">💙 ${jutsu.chakra} Chakra</p>
                ${jutsu.damage > 0 ? `<p style="color:#e74c3c;">⚔️ ${jutsu.damage} daño</p>` : ''}
            `;

            const assignBtn = document.createElement('button');
            assignBtn.className = 'btn-utility jutsu-assign-btn';
            assignBtn.textContent = 'Asignar a slot';
            assignBtn.addEventListener('click', e => {
                e.stopPropagation();
                let target = Number.isInteger(this.selectedJutsuSlot) ? this.selectedJutsuSlot : -1;
                if (target === -1) target = this.player.quickJutsus.findIndex(s => !s);
                if (target === -1) { alert('Selecciona un slot para reemplazar.'); return; }
                this.player.quickJutsus[target] = jutsu.name;
                this.selectedJutsuSlot = target;
                this.saveGame();
                this.loadJutsuList();
            });

            entry.appendChild(btn);
            entry.appendChild(assignBtn);
            jutsuList.appendChild(entry);
        });
    },

    useJutsu(jutsu) {
        if (this.combatTurn !== 'player') return;
        if (this.checkFatigueFaint()) return;
        if (this.player.chakra < jutsu.chakra) return;

        const playerSprite = document.getElementById('combat-player-sprite');
        if (playerSprite) {
            playerSprite.classList.remove('jutsu-animation');
            void playerSprite.offsetWidth;
            playerSprite.classList.add('jutsu-animation');
        }

        const stats = this.getEffectiveStats();
        this.player.chakra -= jutsu.chakra;
        this.updateBar('combat-player-chakra-bar', this.player.chakra, this.player.maxChakra, 'Chakra');
        this.disableCombatButtons();
        document.getElementById('jutsu-selection').style.display = 'none';
        this.addCombatLog(`Usas ${jutsu.name}!`, 'log-special');

        // Kinjutsu
        if (jutsu.isKinjutsu && jutsu.effect) {
            this.increaseWantedLevel(1);
            this._applyKinjutsuEffect(jutsu.effect);
        }

        if (jutsu.damage > 0) {
            const damage = jutsu.damage + Math.floor(stats.ninjutsu / 2);
            this.currentEnemy.hp -= damage;
            this.addCombatLog(`¡Infliges ${damage} de daño!`, 'log-damage');
            this.updateBar('enemy-health-bar', this.currentEnemy.hp, this.currentEnemy.maxHp, 'HP');

            if (this.currentEnemy.hp <= 0) {
                if (this.currentMission?.friendlyBattle) {
                    this.currentEnemy.hp = 1;
                    this.updateBar('enemy-health-bar', 1, this.currentEnemy.maxHp, 'HP');
                    this.finishFriendlyBattle(true);
                    return;
                }
                this.winCombat();
                return;
            }
        }
        setTimeout(() => this.enemyTurn(), 1500);
    },

    _applyKinjutsuEffect(effect) {
        if (effect === 'suicide_kill') {
            this.currentEnemy.hp = 0;
            this.player.hp = Math.max(1, Math.floor(this.player.hp * 0.5));
            this.updateBar('combat-player-health-bar', this.player.hp, this.player.maxHp, 'HP');
            this.updateBar('enemy-health-bar', 0, this.currentEnemy.maxHp, 'HP');
            this.addCombatLog('☠️ Sacrificio activado. El enemigo cae.', 'log-special');
            this.winCombat();
            return;
        }
        if (effect === 'immortal_reflect') {
            this.player.jashinTurns   = 3;
            this.player.jashinReflect = 0.35;
            this.addCombatLog('🩸 Ritual de Jashin: inmortalidad temporal y reflejo de daño.', 'log-special');
        }
        if (effect === 'control') {
            this.currentEnemy.controlledTurns = 2;
            this.addCombatLog('👁️ El enemigo queda controlado (pierde acciones).', 'log-special');
        }
        if (effect === 'izanagi') {
            if (this.player.hasDailyIzanagi && !this.player.dailyIzanagiReady) {
                this.addCombatLog('👁️ No tienes Izanagi diario disponible hoy.', 'log-miss');
            } else {
                this.player.izanagiAvailable = true;
                this.player.izanagiUsed      = false;
                if (this.player.hasDailyIzanagi) {
                    this.player.dailyIzanagiReady = false;
                    this.addCombatLog('👁️ Izanagi diario activado (se consume por hoy).', 'log-special');
                }
            }
        }
        if (effect === 'steal_kg') {
            this.player.pendingStealKg = true;
            this.addCombatLog('📌 Marca colocada: intentarás robar un Kekkei Genkai al finalizar.', 'log-special');
        }
        if (effect === 'revive') {
            this.player.edoAllyTurns = 1;
            this.addCombatLog('🧟 Edo Tensei: un aliado temporal te asistirá.', 'log-special');
        }
    },

    useGenjutsu() {
        if (this.combatTurn !== 'player') return;
        if (this.checkFatigueFaint()) return;
        if (this.player.chakra < 30) { alert('No tienes suficiente chakra!'); return; }

        this.player.chakra -= 30;
        this.updateBar('combat-player-chakra-bar', this.player.chakra, this.player.maxChakra, 'Chakra');
        this.disableCombatButtons();
        document.getElementById('jutsu-selection').style.display  = 'none';
        document.getElementById('combat-inventory').style.display = 'none';

        const stats        = this.getEffectiveStats();
        const genjutsuRoll = this.rollDice(20) + stats.genjutsu;
        const enemyResist  = this.rollDice(20) + (this.currentEnemy.genjutsu || 5);

        this.addCombatLog(`Lanzas Genjutsu: <span class="dice-roll">${genjutsuRoll}</span> vs ${enemyResist}`, 'log-special');

        if (genjutsuRoll > enemyResist) {
            this.addCombatLog('¡El enemigo está aturdido! Pierde su turno.', 'log-special');
            setTimeout(() => { this.combatTurn = 'player'; this.enableCombatButtons(); }, 1500);
        } else {
            this.addCombatLog('¡El enemigo resistió el Genjutsu!', 'log-miss');
            setTimeout(() => this.enemyTurn(), 1500);
        }
    },

    defend() {
        if (this.combatTurn !== 'player') return;
        if (this.checkFatigueFaint()) return;

        this.disableCombatButtons();
        document.getElementById('jutsu-selection').style.display  = 'none';
        document.getElementById('combat-inventory').style.display = 'none';

        this.defendActive  = true;
        const chakraRegen  = 20 + (this.player.chakraRegen || 0);
        this.player.chakra = Math.min(this.player.chakra + chakraRegen, this.player.maxChakra);
        this.addCombatLog(`Te defiendes y recuperas ${chakraRegen} chakra.`, 'log-heal');
        this.updateBar('combat-player-chakra-bar', this.player.chakra, this.player.maxChakra, 'Chakra');
        setTimeout(() => this.enemyTurn(), 1500);
    },

    useKawarimi() {
        if (this.kawairimiUsed) { alert('Ya usaste Kawarimi en este combate!'); return; }
        this.kawairimiUsed = true;
        this.addCombatLog('¡Preparas Kawarimi! Evitarás el próximo ataque.', 'log-special');
        document.getElementById('kawarimi-btn').disabled = true;
    },

    showInventoryInCombat() {
        const menu     = document.getElementById('combat-inventory');
        const jutsuMenu = document.getElementById('jutsu-selection');
        if (jutsuMenu) jutsuMenu.style.display = 'none';
        if (!menu) return;
        if (menu.style.display === 'none') { menu.style.display = 'block'; this.loadCombatInventory(); }
        else                               menu.style.display = 'none';
    },

    loadCombatInventory() {
        const itemsList = document.getElementById('combat-items-list');
        if (!itemsList) return;
        itemsList.innerHTML = '';
        if (this.player.inventory.length === 0) { itemsList.innerHTML = '<p>No tienes items.</p>'; return; }
        this.player.inventory.forEach((item, index) => {
            const btn = document.createElement('button');
            btn.className  = 'btn btn-small';
            btn.style.cssText = 'width:100%; margin-bottom:5px;';
            btn.onclick    = () => this.useItemInCombat(index);
            btn.textContent = item.name;
            itemsList.appendChild(btn);
        });
    },

    useItemInCombat(index) {
        const item = this.player.inventory[index];
        if (!item) return;

        if (item.effect?.hp) {
            this.player.hp = Math.min(this.player.hp + item.effect.hp, this.player.maxHp);
            this.addCombatLog(`Usas ${item.name} y recuperas ${item.effect.hp} HP.`, 'log-heal');
            this.updateBar('combat-player-health-bar', this.player.hp, this.player.maxHp, 'HP');
        }
        if (item.effect?.chakra) {
            this.player.chakra = Math.min(this.player.chakra + item.effect.chakra, this.player.maxChakra);
            this.addCombatLog(`Recuperas ${item.effect.chakra} Chakra.`, 'log-heal');
            this.updateBar('combat-player-chakra-bar', this.player.chakra, this.player.maxChakra, 'Chakra');
        }
        if ((item.name || '').toLowerCase().includes('ramen')) {
            this.reduceFatigue(10);
            this.addCombatLog('🍜 Te sientes mejor: -10% fatiga.', 'log-heal');
        }
        if (item.effect?.buffAll) {
            const turns = Math.max(1, item.effect.buffTurns || 3);
            this.player.combatBuff = { all: item.effect.buffAll, turns, backlashHp: item.effect.backlashHp || 0 };
            this.addCombatLog(`💊 Potenciación ilegal: +${item.effect.buffAll} a todos los stats por ${turns} turnos.`, 'log-special');
        }

        this.player.inventory.splice(index, 1);
        document.getElementById('combat-inventory').style.display = 'none';
        this.disableCombatButtons();
        setTimeout(() => this.enemyTurn(), 1500);
    },

};
