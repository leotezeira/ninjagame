// ============================================================
// village/shop.js — Shop, Academy, Training, Stats
// ============================================================

export const shopMethods = {

    // ── Tienda ───────────────────────────────────────────────

    showShop() {
        const shopList = document.getElementById('shop-list');
        if (!shopList) return;
        shopList.innerHTML = '';
        if (!this.player) return;

        if (this.player.isRenegade) {
            shopList.innerHTML = '<div class="shop-empty">🚫 Como Renegado, la Tienda de la Aldea no te atenderá.</div>';
            return;
        }
        if (!this.shopItems?.consumables) {
            shopList.innerHTML = '<div class="shop-empty">Error: datos de tienda no encontrados.</div>';
            return;
        }

        const festivalNote = this.isFestivalActive() ? ' (🎉 Festival: -50%)' : '';
        const sections     = [
            ['consumables', `Consumibles${festivalNote}`],
            ['weapons',     'Armas'],
            ['armor',       'Armaduras'],
            ['accessories', 'Accesorios'],
            ['scrolls',     'Pergaminos'],
        ];

        sections.forEach(([key, label]) => {
            const items = this.shopItems[key];
            if (!items?.length) return;
            const h = document.createElement('h4');
            h.className   = 'shop-section-header';
            h.textContent = label;
            shopList.appendChild(h);
            items.forEach(item => shopList.appendChild(this.createShopCard(item)));
        });
    },

    createShopCard(item) {
        const card       = document.createElement('div');
        card.className   = 'shop-item';
        const finalPrice = this.applyPriceDiscount(item.price);
        const priceHtml  = finalPrice < item.price
            ? `💰 ${finalPrice} Ryo <span style="opacity:0.75; text-decoration:line-through; margin-left:6px;">${item.price}</span>`
            : `💰 ${item.price} Ryo`;
        card.innerHTML = `
            <h4>${item.name}</h4>
            <p>${item.description}</p>
            <p class="price">${priceHtml}</p>
            <button class="btn btn-small" onclick='game.buyItem(${JSON.stringify(item).replace(/'/g, "\\'")})'>Comprar</button>
        `;
        return card;
    },

    buyItem(item) {
        if (this.player.isRenegade)          { alert('🚫 Como Renegado, no puedes comprar aquí.'); return; }
        if (this.player.location !== 'konoha'){ alert('La tienda solo está disponible en Konoha.'); return; }
        if (this.getTimeOfDay() === 3)        { alert('Es madrugada. La tienda está cerrada.'); return; }

        const finalPrice = this.applyPriceDiscount(item.price);
        if (this.player.ryo < finalPrice)    { alert('¡No tienes suficiente Ryo!'); return; }

        this.player.ryo -= finalPrice;
        if (item.effect.hp || item.effect.chakra || item.effect.buff) {
            this.player.inventory.push({ name: item.name, effect: item.effect });
            alert(`¡Compraste ${item.name}! Ahora está en tu inventario.`);
        } else {
            if (item.effect.taijutsu) this.player.taijutsu += item.effect.taijutsu;
            if (item.effect.maxHp)    { this.player.maxHp += item.effect.maxHp; this.player.hp += item.effect.maxHp; }
            alert(`¡Compraste ${item.name}! Tus stats han mejorado.`);
        }
        this.updateVillageUI();
        this.saveGame();
    },

    async useInventoryItem(index) {
        if (!Array.isArray(this.player.inventory) || index < 0 || index >= this.player.inventory.length) return;
        const item = this.player.inventory[index];
        let used   = false;
        if (item.effect?.hp)         { this.player.hp     = Math.min(this.player.maxHp,     this.player.hp     + item.effect.hp);     used = true; }
        if (item.effect?.chakra)     { this.player.chakra = Math.min(this.player.maxChakra, this.player.chakra + item.effect.chakra); used = true; }
        if (item.effect?.fatigue)    { this.player.fatigue = Math.max(0, this.player.fatigue + item.effect.fatigue); used = true; }
        if (item.effect?.curePoison) { this.player.isPoisoned = false; used = true; }
        if (used) {
            this.player.inventory.splice(index, 1);
            this.saveGame();
            this.updateVillageUI();
            await this.gameAlert('Item consumido.', '✅');
        } else {
            await this.gameAlert('Este item no es consumible.', '❌');
        }
    },

    // ── Entrenamiento ────────────────────────────────────────

    showTraining() {
        const trainingList = document.getElementById('training-list');
        if (!trainingList) return;

        if (this.player.isRenegade)            { trainingList.innerHTML = '<div class="story-text">🚫 Como Renegado, no puedes entrenar en Konoha.</div>'; return; }
        if (this.player.location !== 'konoha') { trainingList.innerHTML = '<div class="story-text">📍 El Centro de Entrenamiento solo está disponible en Konoha.</div>'; return; }
        if (this.getTimeOfDay() === 3)         { trainingList.innerHTML = '<div class="story-text">🌙 Es madrugada. El centro de entrenamiento está cerrado.</div>'; return; }

        trainingList.innerHTML = '';
        this.training.forEach(item => {
            const card       = document.createElement('div');
            card.className   = 'shop-item';
            const finalPrice = this.applyPriceDiscount(item.price);
            const priceHtml  = finalPrice < item.price
                ? `💰 ${finalPrice} Ryo <span style="opacity:0.75; text-decoration:line-through; margin-left:6px;">${item.price}</span>`
                : `💰 ${item.price} Ryo`;
            card.innerHTML = `
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <p class="price">${priceHtml}</p>
                <button class="btn btn-small" onclick='game.doTraining(${JSON.stringify(item).replace(/'/g, "\\'")})'>Entrenar</button>
            `;
            trainingList.appendChild(card);
        });
    },

    doTraining(item) {
        if (this.player.isRenegade)            { alert('🚫 Como Renegado, no puedes entrenar en Konoha.'); return; }
        if (this.player.location !== 'konoha') { alert('El entrenamiento solo está disponible en Konoha.'); return; }
        if (this.getTimeOfDay() === 3)         { alert('Es madrugada. El centro de entrenamiento está cerrado.'); return; }

        const finalPrice = this.applyPriceDiscount(item.price);
        if (this.player.ryo < finalPrice) { alert('¡No tienes suficiente Ryo!'); return; }

        this.addFatigue(8);
        this.player.ryo -= finalPrice;

        const eff = this.player.season === 'primavera' ? 1.1 : (this.player.season === 'invierno' ? 0.9 : 1);
        const gain = k => Math.max(1, Math.floor((item.effect[k] || 0) * eff));

        if (item.effect.taijutsu) this.player.taijutsu   += gain('taijutsu');
        if (item.effect.ninjutsu) this.player.ninjutsu   += gain('ninjutsu');
        if (item.effect.genjutsu) this.player.genjutsu   += gain('genjutsu');
        if (item.effect.maxChakra) { const g = gain('maxChakra'); this.player.maxChakra += g; this.player.chakra += g; }
        if (item.effect.maxHp)     { const g = gain('maxHp');     this.player.maxHp     += g; this.player.hp     += g; }

        this.checkJutsuUnlocks(this.player);
        alert(`¡Entrenamiento completado! ${item.name}`);
        this.updateVillageUI();
        this.saveGame();
    },

    // ── Academia ─────────────────────────────────────────────

    showAcademy(rank) {
        const jutsuList = document.getElementById('academy-jutsu-list');
        if (!jutsuList) return;

        if (this.player.isRenegade)            { jutsuList.innerHTML = '<div class="story-text">🚫 Como Renegado, la Academia de Konoha está cerrada para ti.</div>'; return; }
        if (this.player.location !== 'konoha') { jutsuList.innerHTML = '<div class="story-text">📍 La Academia Ninja solo está disponible en Konoha.</div>'; return; }
        if (this.getTimeOfDay() === 3)         { jutsuList.innerHTML = '<div class="story-text">🌙 Es madrugada. La Academia está cerrada.</div>'; return; }

        jutsuList.innerHTML = '';

        // Listas especiales por tipo
        const specialRanks = ['taijutsu','genjutsu','escape','katon','suiton','futon','doton','raiton','sharingan','byakugan','rinnegan','bijuu'];
        const jutsusAll    = specialRanks.includes(rank)
            ? (this[rank + 'Academy'] || [])
            : (this.academyJutsus[rank] || []);

        const playerElement = this.player.element;
        const jutsus        = specialRanks.includes(rank)
            ? jutsusAll
            : jutsusAll.filter(j => j.element == null || (playerElement && j.element === playerElement));

        jutsus.forEach(jutsu => {
            const isLearned  = this.player.learnedJutsus.some(j => j.name === jutsu.name);
            const isUnlocked = this.player.unlockedJutsus?.some(j => j.name === jutsu.name);
            const meetsReq   = this.meetsJutsuRequirements(this.player, jutsu.requirements);
            const card       = document.createElement('div');

            let statusText  = '✅ APRENDIDO';
            let statusBadge = 'learned';
            let isClickable = false;

            if (!isLearned) {
                if (isUnlocked || meetsReq) { statusText = '📖 DISPONIBLE'; statusBadge = 'unlocked'; isClickable = true; }
                else                         { statusText = '🔒 BLOQUEADO';  statusBadge = 'locked'; }
            }

            card.className = `jutsu-card ${statusBadge}`;
            if (isClickable) card.onclick = () => this.learnJutsu(jutsu);

            let reqInfo = '';
            if (!isLearned && !isUnlocked && !meetsReq && jutsu.requirements) {
                const r      = jutsu.requirements;
                const missing = [];
                if (r.level && this.player.level < r.level)                        missing.push(`Nivel: ${this.player.level}/${r.level}`);
                if (r.stats?.ninjutsu && this.player.ninjutsu < r.stats.ninjutsu)  missing.push(`Ninjutsu: ${this.player.ninjutsu}/${r.stats.ninjutsu}`);
                if (r.stats?.taijutsu && this.player.taijutsu < r.stats.taijutsu)  missing.push(`Taijutsu: ${this.player.taijutsu}/${r.stats.taijutsu}`);
                if (r.exp && (this.player.totalExp || 0) < r.exp)                  missing.push(`Exp: ${this.player.totalExp || 0}/${r.exp}`);
                if (missing.length) reqInfo = `<div style="font-size:12px; color:#95a5a6; margin-top:8px;">Requisitos: ${missing.join(' • ')}</div>`;
            }

            card.innerHTML = `
                <div>
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px;">
                        <div style="flex:1;">
                            <h4>${jutsu.name}</h4>
                            <div style="margin-bottom:8px;">
                                <span class="jutsu-type-badge type-${(jutsu.rank || 'genin').toLowerCase()}">${(jutsu.rank || 'RANGO').toUpperCase()}</span>
                            </div>
                            <p style="font-size:0.9em; margin-bottom:8px;">${jutsu.description}</p>
                            <p style="font-size:0.85em; margin-bottom:8px;">💙 ${jutsu.chakra} Chakra | ${jutsu.damage > 0 ? `⚔️ ${jutsu.damage} daño` : '🌀 Efecto especial'}</p>
                        </div>
                        <span class="jutsu-card-status status-${statusBadge}">${statusText}</span>
                    </div>
                    ${reqInfo}
                </div>
                ${isClickable ? '<button class="btn btn-small" style="margin-top:10px;">Aprender</button>' : ''}
            `;
            jutsuList.appendChild(card);
        });

        // Mercado negro
        if (this.player.blackMarketToday) {
            const offer = this.getBlackMarketOffer();
            const card  = document.createElement('div');
            card.className = 'mission-card';
            card.style.borderLeftColor = '#95a5a6';
            card.onclick = () => this.buyBlackMarketJutsu();
            card.innerHTML = `
                <h4>🕶️ Mercado Negro: ${offer.name} [${offer.rank}]</h4>
                <p>Oferta del día (jutsu raro). Precio especial.</p>
                <p style="color:#ffd700; margin-top:8px;">💰 ${offer.price} Ryo</p>
            `;
            jutsuList.appendChild(card);
        }
    },

    showJutsuRank(rank) {
        const academyTab = document.getElementById('academy-tab');
        if (academyTab) {
            academyTab.querySelectorAll('.tabs .tab-btn').forEach(btn => {
                btn.classList.toggle('active', (btn.getAttribute('onclick') || '').includes(`showJutsuRank('${rank}')`));
            });
        }
        this.showAcademy(rank);
    },

    learnJutsu(jutsu) {
        if (this.player.isRenegade)            { alert('🚫 No puedes aprender en la Academia de Konoha.'); return; }
        if (this.player.location !== 'konoha') { alert('La Academia solo está disponible en Konoha.'); return; }
        if (this.getTimeOfDay() === 3)         { alert('Es madrugada. La Academia está cerrada.'); return; }
        if (this.player.learnedJutsus.some(j => j.name === jutsu.name)) { alert('¡Ya aprendiste este jutsu!'); return; }
        if (jutsu.requirements && !this.meetsJutsuRequirements(this.player, jutsu.requirements)) {
            alert(`❌ No cumples los requisitos para aprender ${jutsu.name}.`); return;
        }
        this.player.learnedJutsus.push(jutsu);
        this.player.unlockedJutsus = (this.player.unlockedJutsus || []).filter(j => j.name !== jutsu.name);
        alert(`✅ ¡Has aprendido ${jutsu.name}!`);
        this.updateVillageUI();

        const activeBtn   = document.querySelector('#academy-tab .tabs .tab-btn.active');
        const label       = (activeBtn?.textContent || 'Genin').toLowerCase().trim();
        const rankMap     = { genin:'genin', chunin:'chunin', jonin:'jonin', maestros:'master' };
        this.showAcademy(rankMap[label] || 'genin');
        this.saveGame();
    },

    // ── Stats ────────────────────────────────────────────────

    showStats() {
        const statsDisplay = document.getElementById('stats-display');
        if (!statsDisplay || !this.player) return;
        statsDisplay.innerHTML = `
            <div class="player-info">
                <h3 style="color:var(--accent-primary);">${this.getPlayerDisplayName()}</h3>
                <div class="info-grid">
                    <div class="info-item">❤️ HP: ${Math.floor(this.player.hp)}/${this.player.maxHp}</div>
                    <div class="info-item">💙 Chakra: ${Math.floor(this.player.chakra)}/${this.player.maxChakra}</div>
                    <div class="info-item">👊 Taijutsu: ${this.player.taijutsu}</div>
                    <div class="info-item">🌀 Ninjutsu: ${this.player.ninjutsu}</div>
                    <div class="info-item">👁️ Genjutsu: ${this.player.genjutsu}</div>
                    <div class="info-item">⭐ Nivel: ${this.player.level}</div>
                    <div class="info-item">🥷 Rango: ${this.player.rank}</div>
                    <div class="info-item">💰 Ryo: ${this.player.ryo}</div>
                    <div class="info-item">🏆 Combates: ${this.player.combatsWon}</div>
                </div>
                <div style="margin-top:20px;">
                    <h4 style="color:var(--accent-primary);">📚 Jutsus Aprendidos (${this.player.learnedJutsus.length})</h4>
                    ${!this.player.learnedJutsus.length ? '<p>Ninguno - Ve a la Academia</p>'
                        : this.player.learnedJutsus.map(j => `<div class="stat">${j.name} [${j.rank}]</div>`).join('')}
                </div>
                <div style="margin-top:20px;">
                    <h4 style="color:var(--accent-primary);">🎒 Inventario (${this.player.inventory.length})</h4>
                    ${!this.player.inventory.length ? '<p>Vacío</p>'
                        : this.player.inventory.map((item, idx) => `
                            <div class="stat" style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
                                <span>${item.name}</span>
                                <button class="btn btn-small btn-secondary" onclick="game.useInventoryItem(${idx})">Usar</button>
                            </div>`).join('')}
                </div>
            </div>
        `;
    },

};
