// ============================================================
// renegade/renegade.js — Deserción, renegado, ANBU, redención
// ============================================================

export const renegadeMethods = {

    // ── Deserción ────────────────────────────────────────────

    promptDesertion() {
        if (!this.player || this.player.isRenegade) return;
        if (this.player.level < 5)             { alert('Necesitas ser nivel 5+ para desertar.'); return; }
        if (this.player.location !== 'konoha') { alert('Solo puedes desertar desde Konoha.'); return; }

        const ok = confirm(
            '⚠️ DESERCIÓN\n\n' +
            '- Serás marcado como Renegado (0–5★)\n' +
            '- ANBU te perseguirá periódicamente\n' +
            '- No podrás entrar a Konoha ni usar Tienda/Academia\n' +
            '- Accedes al Mercado Negro, contratos y Kinjutsu\n\n' +
            '¿Confirmas que desertarás?'
        );
        if (ok) this.becomeRenegade();
    },

    becomeRenegade() {
        this.player.isRenegade    = true;
        this.player.status        = 'renegade';
        this.player.renegadeLevel = Math.max(1, this.player.renegadeLevel || 0);
        this.player.karma         = this.clamp((this.player.karma || 0) - 10, -100, 100);
        this.player.anbuTimerDays = this.rollNextAnbuIntervalDays();
        if (this.player.reputation?.konoha !== undefined) this.player.reputation.konoha = -100;

        this.player.location      = 'bosque';
        this.player.hideoutLocation = 'bosque';

        const base = (this.player.level || 1) * 1000;
        this.player.bounty = Math.floor(base * (1 + (this.player.renegadeLevel * 0.35)));

        this.hideRenegadePanels();
        this.updateVillageUI();
        this.saveGame();
        this.gameAlert('Has desertado. Ahora eres un Ninja Renegado.', '⚠️');
    },

    renegadeDailyTick() {
        if (!this.player.isRenegade) return;
        this.player.daysAsRenegade += 1;
        if (this.player.identityHiddenDays > 0) this.player.identityHiddenDays--;

        const base = (this.player.level || 1) * 1000;
        this.player.bounty = Math.floor(base * (1 + (this.player.renegadeLevel * 0.35)));

        if (this.player.identityHiddenDays > 0) {
            this.player.anbuTimerDays = Math.max(this.player.anbuTimerDays, 7);
            this.player.anbuTimerDays--;
        } else {
            this.player.anbuTimerDays = Math.max(0, (this.player.anbuTimerDays || 0) - 1);
        }

        if (this.player.anbuTimerDays === 0 && this.player.identityHiddenDays === 0) {
            this.anbuHunterAttack();
            this.player.anbuTimerDays = this.rollNextAnbuIntervalDays();
        }

        if (this.player.hasDailyIzanagi && this.player.dailyIzanagiReady === false) {
            this.player.dailyIzanagiReady = true;
        }
    },

    rollNextAnbuIntervalDays() {
        const s = this.player.renegadeLevel || 1;
        if (s >= 5) return 1;
        if (s === 4) return 2;
        if (s === 3) return 3;
        if (s === 2) return 4;
        return 5;
    },

    // ── Wanted level ─────────────────────────────────────────

    increaseWantedLevel(amount) {
        if (!this.player?.isRenegade) return;
        this.player.renegadeLevel = this.clamp((this.player.renegadeLevel || 0) + amount, 0, 5);
        this.updateWorldHUD();
    },

    reduceWantedLevel() {
        if (!this.player?.isRenegade) return;
        const current = this.player.renegadeLevel || 0;
        if (current <= 0) { this.gameAlert('No tienes búsqueda activa.', '❌'); return; }
        const cost = 8000 + current * 5000;
        (async () => {
            const ok = await this.gameConfirm(`Reducir búsqueda cuesta ${cost.toLocaleString('es-ES')} Ryo y consume 1 día. ¿Proceder?`, '❓');
            if (!ok) return;
            if (this.player.ryo < cost) { this.gameAlert('No tienes suficiente Ryo.', '❌'); return; }
            this.player.ryo -= cost;
            this.increaseWantedLevel(-1);
            this.player.karma = this.clamp((this.player.karma || 0) + 5, -100, 100);
            this.updateVillageUI();
            this.saveGame();
        })();
    },

    hideRenegadePanels() {
        ['blackmarket-panel','organization-panel','redemption-panel'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
    },

    // ── ANBU ─────────────────────────────────────────────────

    anbuHunterAttack() {
        if (!this.player?.isRenegade) return;
        if (document.getElementById('combat-screen')?.classList.contains('active')) return;
        if (this.player.travelState) return;

        const templates = this.anbuHunters || [];
        if (!templates.length) return;

        const stars     = this.clamp(this.player.renegadeLevel || 1, 1, 5);
        const squadSize = this.clamp(1 + stars, 2, 6);

        this.currentMission = {
            name: '⚔️ Persecución ANBU', rank:'X',
            description: 'Los cazadores te encontraron. No hay escapatoria.',
            enemies: [], ryo: 1000 + stars * 500, exp: 200 + stars * 120, turns:0, isAnbuHunt:true,
        };

        this.enemyQueue = [];
        for (let i = 0; i < squadSize; i++) {
            const base     = templates[Math.floor(Math.random() * templates.length)];
            const isCaptain = i === 0 && stars >= 3;
            const scaled   = {
                ...base,
                name:     isCaptain ? 'ANBU Capitán' : base.name,
                hp:       Math.floor(base.hp     * (1 + stars * 0.15) + (this.player.level * 8)),
                chakra:   Math.floor(base.chakra  * (1 + stars * 0.10)),
                attack:   Math.floor(base.attack  * (1 + stars * 0.12) + (this.player.level * 0.8)),
                defense:  Math.floor(base.defense * (1 + stars * 0.10)),
                accuracy: Math.floor(base.accuracy * (1 + stars * 0.05)),
                controlledTurns: 0,
            };
            this.enemyQueue.push({ ...scaled, maxHp: scaled.hp, maxChakra: scaled.chakra });
        }

        this.totalWaves  = this.enemyQueue.length;
        this.currentWave = 1;
        this.currentEnemy = this.enemyQueue.shift();
        this.gameAlert(`⚠️ ANBU te ha encontrado (${stars}★). ¡Prepárate!`, '❌');
        this.startCombat();
    },

    // ── Mercado Negro ─────────────────────────────────────────

    toggleBlackMarketPanel() {
        if (!this.player?.isRenegade) return;
        if (!this.player.blackMarketToday) { this.gameAlert('🕶️ El Mercado Negro no está disponible aquí/hoy. Busca un escondite.', '❌'); return; }
        this.hideRenegadePanels();
        const panel = document.getElementById('blackmarket-panel');
        if (!panel) return;
        panel.style.display = (panel.style.display === 'none' || !panel.style.display) ? 'block' : 'none';
        if (panel.style.display === 'block') this.renderBlackMarketPanel(panel);
    },

    getBlackMarketPriceMultiplier() {
        let mult = 1.0;
        if (this.player.organization === 'akatsuki') mult *= 0.85;
        if (this.player.organization === 'sound')    mult *= 0.9;
        if (this.player.organization === 'root')     mult *= 0.9;
        return mult;
    },

    renderBlackMarketPanel(panelEl) {
        const items    = this.blackMarketItems    || [];
        const services = this.blackMarketServices || [];
        const kinjutsu = this.kinjutsu            || [];
        const mult     = this.getBlackMarketPriceMultiplier();

        panelEl.innerHTML = `
            <div class="panel">
                <h3>🕳️ Mercado Negro</h3>
                <p style="margin-top:-6px; color:rgba(240,240,240,0.75)">Técnicas prohibidas, ítems ilegales y servicios ocultos.</p>
                <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:12px;">
                    <div class="card">
                        <h4>🧪 Ítems</h4>
                        ${items.map(it => {
                            const price = Math.ceil((it.price || 0) * mult);
                            return `<div class="info-item" style="margin-bottom:8px;">
                                <div><b>${it.name}</b><br><span style="color:rgba(240,240,240,0.75)">${it.description || ''}</span></div>
                                <button class="btn btn-small" onclick="game.buyBlackMarketItem('${it.id}')">Comprar (${price.toLocaleString('es-ES')} Ryo)</button>
                            </div>`;
                        }).join('')}
                    </div>
                    <div class="card">
                        <h4>🧾 Servicios</h4>
                        ${services.map(sv => {
                            const price = Math.ceil((sv.price || 0) * mult);
                            return `<div class="info-item" style="margin-bottom:8px;">
                                <div><b>${sv.name}</b><br><span style="color:rgba(240,240,240,0.75)">${sv.description || ''}</span></div>
                                <button class="btn btn-small" onclick="game.buyBlackMarketService('${sv.id}')">Pagar (${price.toLocaleString('es-ES')} Ryo)</button>
                            </div>`;
                        }).join('')}
                    </div>
                    <div class="card">
                        <h4>📜 Kinjutsu</h4>
                        ${kinjutsu.map(kj => {
                            const learned  = (this.player.kinjutsuLearned || []).includes(kj.id);
                            const price    = Math.ceil((kj.price || 0) * mult);
                            return `<div class="info-item" style="margin-bottom:8px;">
                                <div><b>${kj.name}</b><br><span style="color:rgba(240,240,240,0.75)">${kj.description || ''}</span></div>
                                <button class="btn btn-small" ${learned ? 'disabled' : ''} onclick="game.buyKinjutsu('${kj.id}')">
                                    ${learned ? 'Aprendido' : `Aprender (${price.toLocaleString('es-ES')} Ryo)`}
                                </button>
                            </div>`;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    buyBlackMarketItem(itemId) {
        if (!this.player?.isRenegade) return;
        const item = (this.blackMarketItems || []).find(i => i.id === itemId);
        if (!item) return;
        const price = Math.ceil((item.price || 0) * this.getBlackMarketPriceMultiplier());
        if (this.player.ryo < price) { this.gameAlert('No tienes suficiente Ryo.', '❌'); return; }

        this.player.ryo -= price;
        this.player.blackMarketInventory.push({ id:item.id, name:item.name, effect:item.effect || null });

        if (item.effect?.buffAll) {
            this.player.inventory.push({ name:item.name, effect:{ buffAll:item.effect.buffAll, buffTurns:item.effect.buffTurns, backlashHp:item.effect.backlashHp } });
        }
        if (item.id === 'sharingan_artificial' && item.effect?.dailyIzanagi) {
            this.player.hasDailyIzanagi   = true;
            this.player.dailyIzanagiReady = true;
            this.player.genjutsu         += (item.effect.genjutsu || 0);
        }
        if (item.id === 'pergamino_kinjutsu' && item.effect?.unlockKinjutsu) this.unlockRandomKinjutsu();

        this.increaseWantedLevel(1);
        this.updateVillageUI();
        this.saveGame();
        this._refreshBlackMarket();
        this.gameAlert(`Compra realizada: ${item.name}`, '✅');
    },

    buyBlackMarketService(serviceId) {
        if (!this.player?.isRenegade) return;
        const svc = (this.blackMarketServices || []).find(s => s.id === serviceId);
        if (!svc) return;
        const price = Math.ceil((svc.price || 0) * this.getBlackMarketPriceMultiplier());
        if (this.player.ryo < price) { this.gameAlert('No tienes suficiente Ryo.', '❌'); return; }
        if (!confirm(`${svc.name} por ${price.toLocaleString('es-ES')} Ryo. ¿Confirmar?`)) return;

        this.player.ryo -= price;
        const eff = svc.effect || {};
        if (eff.hideDays)       this.player.identityHiddenDays = Math.max(this.player.identityHiddenDays || 0, eff.hideDays);
        if (eff.changeElement) {
            const options = Object.entries(this.elements || {}).map(([k,v]) => ({ k, name:v.name }));
            const pick    = prompt(`Elige tu nuevo elemento (${options.map(o => o.name).join(', ')})`);
            if (pick) { const found = options.find(o => o.name.toLowerCase() === pick.toLowerCase()); if (found) this.player.element = found.k; }
        }
        if (eff.maxHp)    { this.player.maxHp    += eff.maxHp;    this.player.hp    = Math.min(this.player.maxHp,    this.player.hp    + eff.maxHp);    }
        if (eff.maxChakra){ this.player.maxChakra += eff.maxChakra; this.player.chakra = Math.min(this.player.maxChakra, this.player.chakra + eff.maxChakra); }
        if (eff.resetReputation && this.player.reputation?.konoha !== undefined) {
            this.player.reputation.konoha = Math.min(0, this.player.reputation.konoha || 0);
            this.player.karma = this.clamp((this.player.karma || 0) + 10, -100, 100);
        }

        this.increaseWantedLevel(1);
        this.updateVillageUI();
        this.saveGame();
        this._refreshBlackMarket();
        this.gameAlert('Servicio completado.', '✅');
    },

    buyKinjutsu(kinjutsuId) {
        if (!this.player?.isRenegade) return;
        const kin = (this.kinjutsu || []).find(k => k.id === kinjutsuId);
        if (!kin || (this.player.kinjutsuLearned || []).includes(kin.id)) return;
        const price = Math.ceil((kin.price || 0) * this.getBlackMarketPriceMultiplier());
        if (this.player.ryo < price) { this.gameAlert('No tienes suficiente Ryo.', '❌'); return; }
        if (!confirm(`Aprender ${kin.name} por ${price.toLocaleString('es-ES')} Ryo. ¿Confirmar?`)) return;

        this.player.ryo -= price;
        this.player.kinjutsuLearned.push(kin.id);
        this.player.learnedJutsus.push({ name:kin.name, rank:kin.rank, chakra:kin.chakra, damage:kin.damage, description:kin.description, isKinjutsu:true, effect:kin.effect });
        this.increaseWantedLevel(1);
        this.updateVillageUI();
        this.saveGame();
        this._refreshBlackMarket();
        this.gameAlert(`Has aprendido: ${kin.name}`, '✅');
    },

    unlockRandomKinjutsu() {
        const list = (this.kinjutsu || []).filter(k => !(this.player.kinjutsuLearned || []).includes(k.id));
        if (!list.length) return;
        const pick = list[Math.floor(Math.random() * list.length)];
        this.player.kinjutsuLearned.push(pick.id);
        this.player.learnedJutsus.push({ name:pick.name, rank:pick.rank, chakra:pick.chakra, damage:pick.damage, description:pick.description, isKinjutsu:true, effect:pick.effect });
    },

    getBlackMarketOffer() {
        if (!this.player.blackMarketToday) return null;
        const stamp = `${this.player.year}-${this.player.month}-${this.player.day}`;
        if (this.player.blackMarketOffer?.stamp === stamp) return this.player.blackMarketOffer;

        const rarePool = [...(this.academyJutsus.master || []), ...(this.academyJutsus.jonin || [])];
        const available = rarePool.filter(j => !this.player.learnedJutsus?.some(l => l.name === j.name));
        const chosen    = (available.length ? available : rarePool)[Math.floor(Math.random() * rarePool.length)];
        const price     = this.applyPriceDiscount(Math.floor((chosen.price || 2000) * 1.5));

        this.player.blackMarketOffer = { stamp, jutsu:chosen, name:chosen.name, rank:chosen.rank, price };
        return this.player.blackMarketOffer;
    },

    buyBlackMarketJutsu() {
        if (!this.player.blackMarketToday) { this.gameAlert('El Mercado Negro no está disponible ahora.', '❌'); return; }
        if (this.player.location !== 'konoha') { this.gameAlert('Este contacto solo está en Konoha.', '❌'); return; }
        if (this.getTimeOfDay() === 3) { this.gameAlert('Es madrugada. No es seguro comerciar ahora.', '❌'); return; }

        const offer = this.getBlackMarketOffer();
        if (!offer) return;
        if (this.player.learnedJutsus?.some(l => l.name === offer.jutsu.name)) { this.gameAlert('Ya aprendiste ese jutsu.', '❌'); return; }
        if (this.player.ryo < offer.price) { this.gameAlert('No tienes suficiente Ryo para el Mercado Negro.', '❌'); return; }

        this.player.ryo -= offer.price;
        this.player.learnedJutsus.push(offer.jutsu);
        this.player.blackMarketToday = false;
        this.player.blackMarketOffer = null;
        this.gameAlert(`🕶️ Compraste y aprendiste: ${offer.jutsu.name}`, '✅');
        this.updateVillageUI();
        this.showAcademy('master');
        this.saveGame();
    },

    _refreshBlackMarket() {
        const panel = document.getElementById('blackmarket-panel');
        if (panel?.style.display === 'block') this.renderBlackMarketPanel(panel);
    },

    // ── Organización ─────────────────────────────────────────

    toggleOrganizationPanel() {
        if (!this.player?.isRenegade) return;
        this.hideRenegadePanels();
        const panel = document.getElementById('organization-panel');
        if (!panel) return;
        panel.style.display = (panel.style.display === 'none' || !panel.style.display) ? 'block' : 'none';
        if (panel.style.display === 'block') this.renderOrganizationPanel(panel);
    },

    renderOrganizationPanel(panelEl) {
        const org    = this.player.organization;
        const canJoin = !org;
        panelEl.innerHTML = `
            <div class="panel">
                <h3>🏴 Organización</h3>
                <p style="margin-top:-6px; color:rgba(240,240,240,0.75)">${org ? `Actualmente: <b>${org}</b> (rango ${this.player.organizationRank || 1})` : 'No perteneces a ninguna.'}</p>
                <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:12px;">
                    ${[['akatsuki','Akatsuki','Tributo alto, acceso premium y descuentos.'],
                       ['sound','Sonido','Mejoras físicas y chakra a costo moderado.'],
                       ['root','ROOT','Operaciones encubiertas y ocultamiento.'],
                       ['bounty','Cazarrecompensas','Bingo Book y contratos de captura.']].map(([id, label, desc]) => `
                        <div class="card">
                            <h4>${label}</h4>
                            <p style="color:rgba(240,240,240,0.75)">${desc}</p>
                            <button class="btn btn-small" ${canJoin ? '' : 'disabled'} onclick="game.joinOrganization('${id}')">Unirse</button>
                        </div>
                    `).join('')}
                </div>
                <div style="margin-top:10px; display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
                    <button class="btn btn-small btn-secondary" ${org ? '' : 'disabled'} onclick="game.leaveOrganization()">Salir</button>
                    <button class="btn btn-small" onclick="game.showSection('world')">Ver misiones/contratos</button>
                </div>
            </div>
        `;
    },

    joinOrganization(orgId) {
        if (!this.player?.isRenegade) { this.gameAlert('Solo renegados pueden unirse desde aquí.', '❌'); return; }
        if (this.player.organization) return;
        const requirements = { akatsuki:{level:10,fee:20000}, sound:{level:8,fee:12000}, root:{level:12,fee:18000}, bounty:{level:6,fee:6000} };
        const req = requirements[orgId];
        if (!req) return;
        if (this.player.level < req.level) { this.gameAlert(`Requiere nivel ${req.level}+.`, '❌'); return; }
        if (this.player.ryo   < req.fee)   { this.gameAlert('No tienes suficiente Ryo para el tributo.', '❌'); return; }
        if (!confirm(`Unirte a ${orgId} cuesta ${req.fee.toLocaleString('es-ES')} Ryo. ¿Confirmar?`)) return;

        this.player.ryo -= req.fee;
        this.player.organization     = orgId;
        this.player.organizationRank = 1;

        if (orgId === 'akatsuki') { this.player.maxChakra += 50; this.player.ninjutsu += 10; }
        if (orgId === 'sound')    { this.player.maxHp     += 60; this.player.taijutsu += 10; }
        if (orgId === 'root')     { this.player.identityHiddenDays = Math.max(this.player.identityHiddenDays || 0, 7); this.player.genjutsu += 8; }
        if (orgId === 'bounty')   { this.player.critChance = (this.player.critChance || 0) + 2; }

        this.updateVillageUI();
        this.saveGame();
        const panel = document.getElementById('organization-panel');
        if (panel?.style.display === 'block') this.renderOrganizationPanel(panel);
        this.gameAlert(`Te has unido a ${orgId}.`, '✅');
    },

    leaveOrganization() {
        if (!this.player?.organization) return;
        if (!confirm('¿Salir de la organización?')) return;
        this.player.organization     = null;
        this.player.organizationRank = 0;
        this.updateVillageUI();
        this.saveGame();
        const panel = document.getElementById('organization-panel');
        if (panel?.style.display === 'block') this.renderOrganizationPanel(panel);
    },

    // ── Redención ────────────────────────────────────────────

    toggleRedemptionPanel() {
        if (!this.player?.isRenegade) return;
        this.hideRenegadePanels();
        const panel = document.getElementById('redemption-panel');
        if (!panel) return;
        panel.style.display = (panel.style.display === 'none' || !panel.style.display) ? 'block' : 'none';
        if (panel.style.display === 'block') this.renderRedemptionPanel(panel);
    },

    renderRedemptionPanel(panelEl) {
        const karma = this.player.karma || 0;
        const need  = Math.max(0, 30 - karma);
        panelEl.innerHTML = `
            <div class="panel">
                <h3>🕊️ Camino de Redención</h3>
                <p style="color:rgba(240,240,240,0.75)">Necesitas karma alto y búsqueda baja para limpiar tu nombre.</p>
                <div class="info-item">Karma: <b>${karma}</b> • Faltan: <b>${need}</b> • Búsqueda: <b>${this.player.renegadeLevel || 0}★</b></div>
                <div style="margin-top:10px; text-align:center;">
                    <button class="btn btn-small" onclick="game.attemptRedemption()">Intentar Redención</button>
                </div>
            </div>
        `;
    },

    attemptRedemption() {
        if (!this.player?.isRenegade) return;
        if ((this.player.karma || 0) < 30)        { this.gameAlert('Aún no has hecho suficientes acciones de redención.', '❌'); return; }
        if ((this.player.renegadeLevel || 0) > 1)  { this.gameAlert('Primero reduce tu nivel de búsqueda a 1★ o menos.', '❌'); return; }
        if (!confirm('¿Dejar la vida renegada y volver a Konoha?')) return;

        this.player.isRenegade      = false;
        this.player.status          = 'loyal';
        this.player.renegadeLevel   = 0;
        this.player.bounty          = 0;
        this.player.organization    = null;
        this.player.organizationRank = 0;
        if (this.player.reputation?.konoha !== undefined) {
            this.player.reputation.konoha = Math.max(0, this.player.reputation.konoha || 0);
        }
        this.player.location        = 'konoha';
        this.player.hideoutLocation = null;
        this.hideRenegadePanels();
        this.updateVillageUI();
        this.saveGame();
        this.gameAlert('Has sido readmitido.', '✅');
    },

};
