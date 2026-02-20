// ============================================================
// village/ui.js — showScreen, showSection, updateVillageUI, HUD
// ============================================================

export const uiMethods = {

    // ── Pantallas ────────────────────────────────────────────

    async showScreen(screenId) {
        if (!screenId || typeof screenId !== 'string') {
            console.warn('❌ [showScreen] ID inválido:', screenId);
            return;
        }
        this.closeSidebar();
        this.closeAllModals();

        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

        const target = document.getElementById(screenId);
        if (!target) {
            console.error('❌ [showScreen] Pantalla no encontrada:', screenId);
            await this.gameAlert(`Error: Pantalla "${screenId}" no encontrada`, '❌');
            return;
        }
        target.classList.add('active');

        const header    = document.getElementById('game-header');
        const bottomNav = document.getElementById('bottom-nav');

        if (screenId === 'combat-screen') {
            if (header)    header.style.display = 'none';
            if (bottomNav) bottomNav.style.display = 'none';
        } else {
            if (header) {
                header.style.display = '';
                if (screenId === 'village-screen') header.classList.add('visible');
                else                               header.classList.remove('visible');
            }
            if (bottomNav) bottomNav.style.display = '';
        }
        console.log('🖥️ [showScreen]', screenId);
    },

    // ── Secciones ────────────────────────────────────────────

    showSection(name) {
        if (!name || typeof name !== 'string') { console.warn('❌ [showSection] ID inválido:', name); return; }
        this.closeAllModals();

        document.querySelectorAll('.section-content').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('#sidebar .sidebar-nav-item').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('#bottom-nav .nav-btn').forEach(b => b.classList.remove('active'));

        const target = document.getElementById('section-' + name);
        if (!target) { console.error('❌ [showSection] No se encontró: section-' + name); return; }
        target.classList.add('active');

        const sidebarBtn  = document.querySelector(`#sidebar [data-section="${name}"]`);
        if (sidebarBtn)  sidebarBtn.classList.add('active');
        const bottomNavBtn = document.querySelector(`#bottom-nav [data-tab="${name}"]`);
        if (bottomNavBtn) bottomNavBtn.classList.add('active');

        this.updateHeader();
        this.updateSidebarStats();

        if      (name === 'home')      this.updateVillageUI();
        else if (name === 'world')     { this.updateWorldHUDDisplay(); this.showMissions(); }
        else if (name === 'inventory') { this.showAcademy('genin'); this.showTraining(); }
        else if (name === 'shop')      { this.showShop(); this.updateShopRyoDisplay(); }
        else if (name === 'statspage') this.showStats();

        console.log('📑 [showSection]', name);
    },

    // ── Village tabs ─────────────────────────────────────────

    showTab(tabName) { this.activateVillageTab(tabName); },

    activateVillageTab(tabName) {
        if (!tabName || typeof tabName !== 'string') { console.warn('❌ [activateVillageTab] ID inválido:', tabName); return; }
        this.closeAllModals();

        const village = document.getElementById('village-screen');
        if (!village) return;

        village.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        const activeContent = document.getElementById(tabName + '-tab');
        if (activeContent) activeContent.classList.add('active');

        village.querySelectorAll('.tabs .tab-btn').forEach(btn => {
            const oc = btn.getAttribute('onclick') || '';
            btn.classList.toggle('active', oc.includes(`showTab('${tabName}')`));
        });

        if      (tabName === 'missions') this.showMissions();
        else if (tabName === 'npcs')     this.showNPCList();
        else if (tabName === 'academy')  this.showAcademy('genin');
        else if (tabName === 'shop')     this.showShop();
        else if (tabName === 'training') this.showTraining();
        else if (tabName === 'stats')    this.showStats();

        console.log('🏷️ [activateVillageTab]', tabName);
    },

    // ── Sidebar ───────────────────────────────────────────────

    toggleSidebar() {
        const sidebar  = document.getElementById('sidebar');
        const overlay  = document.getElementById('sidebar-overlay');
        if (sidebar && overlay) { sidebar.classList.toggle('open'); overlay.classList.toggle('active'); }
    },

    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
    },

    navigateFromSidebar(section) { this.closeSidebar(); this.showSection(section); },

    updateSidebarStats() {
        if (!this.player) return;
        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        set('sidebar-rank',  this.player.rank  || 'Genin');
        set('sidebar-level', this.player.level || 1);
        set('sidebar-ryo',   this.player.ryo   || 0);
    },

    // ── Header ───────────────────────────────────────────────

    updateHeader() {
        if (!this.player) return;
        const nameEl     = document.getElementById('header-name');
        const ryoEl      = document.getElementById('header-ryo');
        const hpFill     = document.getElementById('header-hp-fill');
        const chakraFill = document.getElementById('header-chakra-fill');

        if (nameEl)     nameEl.textContent = `👤 ${this.player.name || 'Ninja'}`;
        if (ryoEl)      ryoEl.textContent  = `💰 ${this.player.ryo || 0}`;
        if (hpFill)     hpFill.style.width     = Math.min(100, Math.max(0, (this.player.hp     / this.player.maxHp)     * 100)) + '%';
        if (chakraFill) chakraFill.style.width  = Math.min(100, Math.max(0, (this.player.chakra / this.player.maxChakra) * 100)) + '%';
    },

    // ── Village UI principal ─────────────────────────────────

    updateVillageUI() {
        if (!this.player) return;

        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        set('player-name-village', this.getPlayerDisplayName());
        set('player-rank',         this.player.rank);
        set('player-level-village',this.player.level);
        set('player-ryo',          this.player.ryo);
        set('player-exp-village',  `${this.player.exp}/${this.player.expToNext}`);
        set('village-health-text', `${Math.max(0, Math.floor(this.player.hp))}/${this.player.maxHp}`);
        set('village-chakra-text', `${Math.max(0, Math.floor(this.player.chakra))}/${this.player.maxChakra}`);

        const clanDisplay = document.getElementById('player-clan-village');
        if (clanDisplay && this.player.clanKey) {
            const clan = this.clans[this.player.clanKey];
            clanDisplay.textContent = `${clan.icon} ${clan.name}`;
        }

        if (this.player.village) {
            const village   = this.villages[this.player.village];
            const villageEl = document.getElementById('village-info');
            if (village && villageEl) {
                villageEl.innerHTML = `
                    <div style="margin-top:8px; padding:12px; background:rgba(255,140,0,0.1); border-left:3px solid ${village.color}; border-radius:4px;">
                        <div style="font-size:0.9em; color:#ffd700; font-weight:bold;">${village.icon} ${village.name}</div>
                        <div style="font-size:0.8em; color:var(--muted); margin-top:4px;">Kage: ${village.kage}</div>
                    </div>
                `;
            }
        }

        this.updateBar('village-health-bar',  this.player.hp,     this.player.maxHp);
        this.updateBar('village-chakra-bar',  this.player.chakra, this.player.maxChakra);

        // Kekkei Genkai display
        const kekkeiDisplay = document.getElementById('kekkei-display');
        if (kekkeiDisplay) {
            if (this.player.kekkeiGenkai) {
                const curLevel  = this.player.kekkeiGenkai.levels[this.player.kekkeiLevel - 1];
                const nextLevel = this.player.kekkeiGenkai.levels[this.player.kekkeiLevel];
                let html = `<div class="kekkei-level"><div style="text-align:center;">
                    <span style="background:linear-gradient(135deg,#ffd700,#ff8c00); color:#000; padding:5px 15px; border-radius:8px; font-weight:bold; display:inline-block;">
                        ⚡ ${this.player.kekkeiGenkai.name} - ${curLevel.name}
                    </span></div>`;
                if (nextLevel) {
                    const progress = (this.player.kekkeiExp / nextLevel.exp) * 100;
                    html += `
                        <p style="margin-top:10px; text-align:center; font-size:0.9em;">EXP Kekkei: ${this.player.kekkeiExp} / ${nextLevel.exp}</p>
                        <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>
                        <p style="text-align:center; font-size:0.85em; color:#ffd700;">Próximo: ${nextLevel.name} (${nextLevel.exp - this.player.kekkeiExp} EXP)</p>`;
                } else {
                    html += '<p style="margin-top:10px; text-align:center; color:#ffd700;">¡NIVEL MÁXIMO!</p>';
                }
                html += '</div>';
                kekkeiDisplay.innerHTML = html;
            } else {
                kekkeiDisplay.innerHTML = '';
            }
        }

        // Elemento
        const elementDisplay = document.getElementById('element-display');
        if (elementDisplay && this.player.element) {
            const elem = this.elements[this.player.element];
            elementDisplay.innerHTML = `<span class="element-badge element-${this.player.element}">${elem.icon} ${elem.name}</span>`;
        }

        this.updateOnlinePlayers();
        this.ensureWorldHUD();
        this.updateWorldHUD();
        this.showExamCountdown();
    },

    // ── HUD de mundo ─────────────────────────────────────────

    ensureWorldHUD() {
        const village = document.getElementById('village-screen');
        if (!village || document.getElementById('world-hud')) return;

        const hud = document.createElement('div');
        hud.id        = 'world-hud';
        hud.className = 'player-info';
        hud.style.cssText = 'margin-top:15px; border-color:rgba(52,152,219,0.55);';

        const firstInfo = village.querySelector('.player-info');
        if (firstInfo?.parentNode) firstInfo.parentNode.insertBefore(hud, firstInfo.nextSibling);
        else village.insertBefore(hud, village.firstChild);

        hud.innerHTML = `
            <div style="display:flex; gap:12px; flex-wrap:wrap; align-items:center; justify-content:space-between;">
                <div>
                    <div style="color:#ff8c00; font-weight:bold;">🗓️ <span id="hud-date"></span></div>
                    <div style="margin-top:4px;">
                        <span style="background:rgba(255,140,0,0.18); border:1px solid rgba(255,140,0,0.35); padding:4px 10px; border-radius:999px; font-weight:bold; display:inline-block;">
                            <span id="hud-time"></span>
                        </span>
                        <span style="margin-left:8px; color:rgba(240,240,240,0.85);">🌿 <span id="hud-season"></span></span>
                    </div>
                </div>
                <div style="text-align:right;">
                    <div>📍 Ubicación: <b id="hud-location"></b></div>
                    <div style="margin-top:4px;">🌡️ Clima: <b id="hud-weather"></b></div>
                </div>
            </div>
            <div style="margin-top:12px; display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:10px;">
                <div class="info-item">😓 Fatiga: <b id="hud-fatigue"></b></div>
                <div class="info-item">👥 Equipo: <b id="hud-team"></b></div>
                <div class="info-item">🏅 Reputación: <b id="hud-rep"></b></div>
            </div>
            <div style="margin-top:12px;">
                <div style="color:#ff8c00; font-weight:bold;">PRÓXIMOS EVENTOS:</div>
                <div id="hud-events" style="margin-top:6px; font-size:0.95em;"></div>
            </div>
            <div style="margin-top:12px; text-align:center;">
                <button class="btn btn-small" onclick="game.toggleTravelPanel()">Viajar</button>
                <button class="btn btn-small" onclick="game.showSection('world')">Misión</button>
                <button class="btn btn-small" onclick="game.showSection('inventory')">Entrenar</button>
                <button class="btn btn-small" onclick="game.showSection('shop')">Tienda</button>
                <button class="btn btn-small" id="desert-btn" style="display:none; background:linear-gradient(135deg,#8b0000 0%,#c0392b 100%);" onclick="game.promptDesertion()">⚠️ Desertar de la Aldea</button>
            </div>
            <div id="renegade-box" style="display:none; margin-top:12px; padding-top:12px; border-top:1px solid rgba(74,85,131,0.45);">
                <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center; justify-content:space-between;">
                    <div style="color:#c0392b; font-weight:bold;">🔴 MODO RENEGADO ACTIVO</div>
                    <div style="font-size:0.9em; color:rgba(240,240,240,0.78);">⚠️ ANBU próximo: <b id="hud-anbu-next"></b> día(s)</div>
                </div>
                <div style="margin-top:10px; display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:10px;">
                    <div class="info-item">💀 Búsqueda: <b id="hud-wanted"></b></div>
                    <div class="info-item">💰 Recompensa: <b id="hud-bounty"></b></div>
                    <div class="info-item">🏴 Organización: <b id="hud-org"></b></div>
                </div>
                <div style="margin-top:10px; text-align:center;">
                    <button class="btn btn-small" onclick="game.showSection('world')">Contratos</button>
                    <button class="btn btn-small" onclick="game.toggleBlackMarketPanel()">Mercado Negro</button>
                    <button class="btn btn-small" onclick="game.toggleOrganizationPanel()">Organización</button>
                    <button class="btn btn-small btn-secondary" onclick="game.reduceWantedLevel()">Reducir búsqueda</button>
                    <button class="btn btn-small" onclick="game.toggleRedemptionPanel()">Camino de Redención</button>
                </div>
                <div id="blackmarket-panel"  style="display:none; margin-top:12px;"></div>
                <div id="organization-panel" style="display:none; margin-top:12px;"></div>
                <div id="redemption-panel"   style="display:none; margin-top:12px;"></div>
            </div>
            <div id="travel-panel" style="display:none; margin-top:12px; padding-top:12px; border-top:1px solid rgba(74,85,131,0.45);">
                <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center; justify-content:space-between;">
                    <div style="color:#ff8c00; font-weight:bold;">🧭 Viaje</div>
                    <div style="font-size:0.9em; color:rgba(240,240,240,0.78);">Cada día consume 10% Chakra y puede haber encuentros</div>
                </div>
                <div style="margin-top:10px; display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    <div>
                        <div style="margin-bottom:6px;">Destino</div>
                        <select id="travel-destination" style="width:100%; padding:10px; border-radius:8px; background:rgba(0,0,0,0.4); color:#fff; border:1px solid rgba(74,85,131,0.6);"></select>
                    </div>
                    <div>
                        <div style="margin-bottom:6px;">Opciones</div>
                        <label style="display:flex; gap:8px; align-items:center; background:rgba(0,0,0,0.25); padding:10px; border-radius:8px; border:1px solid rgba(74,85,131,0.4);">
                            <input type="checkbox" id="travel-group" /> Viajar en grupo (+1 día, más seguro)
                        </label>
                    </div>
                </div>
                <div style="margin-top:10px; text-align:center;">
                    <button class="btn btn-small" onclick="game.startTravelFromHUD()">Iniciar viaje</button>
                    <button class="btn btn-small btn-secondary" onclick="game.toggleRecruitPanel()">Reclutar equipo</button>
                </div>
                <div id="recruit-panel" style="display:none; margin-top:10px;"></div>
            </div>
        `;

        this.populateTravelDestinations();
        this.renderRecruitPanel();
    },

    updateWorldHUD() {
        const hud = document.getElementById('world-hud');
        if (!hud || !this.player) return;

        const loc      = this.locations[this.player.location] || { name: this.player.location, icon:'📍' };
        const dateText = `${this.monthNames[this.player.month - 1]}, Día ${this.player.day}, Año ${this.player.year} · ${this.weekdayNames[this.player.weekday]}`;

        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        set('hud-date',    dateText);
        set('hud-time',    this.getTimeOfDayLabel());
        set('hud-season',  this.getSeasonLabel());
        set('hud-location',`${loc.icon} ${loc.name}`);
        set('hud-weather', this.getWeatherLabel());
        set('hud-fatigue', `${this.player.fatigue}%`);

        const teamNames = (this.player.team || []).map(id => this.recruitableNPCs[id]?.name || id);
        set('hud-team', teamNames.length ? teamNames.join(', ') : 'Solo');

        const rep = (this.player.reputation?.[this.player.location]) || 0;
        set('hud-rep', `${rep} (${this.getReputationTier(this.player.location)})`);

        const eventsDiv = document.getElementById('hud-events');
        Promise.resolve(this.getUpcomingEvents(7)).then(events => {
            if (eventsDiv) eventsDiv.innerHTML = events.length ? events.map(e => `• ${e}`).join('<br>') : '• Ninguno';
        });

        const desertBtn = document.getElementById('desert-btn');
        if (desertBtn) {
            const canDesert = !this.player.isRenegade && this.player.level >= 5 && this.player.location === 'konoha';
            desertBtn.style.display = canDesert ? 'inline-flex' : 'none';
        }

        const renegadeBox = document.getElementById('renegade-box');
        if (renegadeBox) renegadeBox.style.display = this.player.isRenegade ? 'block' : 'none';

        set('hud-wanted',   `${this.player.renegadeLevel || 0}★`);
        set('hud-bounty',   `${(this.player.bounty || 0).toLocaleString('es-ES')} Ryo`);
        set('hud-org',      this.player.organization || '—');
        set('hud-anbu-next',`${Math.max(0, this.player.anbuTimerDays || 0)}`);

        this.populateTravelDestinations();
        this.renderRecruitPanel();
    },

    updateWorldHUDDisplay() {
        const display = document.getElementById('world-hud-display');
        if (!display || !this.player) return;
        const fatigue        = this.player.fatigue || 0;
        const fatiguePercent = Math.min(100, (fatigue / 100) * 100);

        let html = `
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                <div style="background:rgba(0,0,0,0.3); padding:10px; border-radius:8px;">
                    <div style="color:#ffd700; font-size:0.85em; margin-bottom:4px;">📅 Fecha</div>
                    <div>${this.player.day} ${this.getMonthName(this.player.month)}, Año ${this.player.year}</div>
                </div>
                <div style="background:rgba(0,0,0,0.3); padding:10px; border-radius:8px;">
                    <div style="color:#ffd700; font-size:0.85em; margin-bottom:4px;">🕐 Hora</div>
                    <div>${this.getTimeOfDayLabel()}</div>
                </div>
                <div style="background:rgba(0,0,0,0.3); padding:10px; border-radius:8px;">
                    <div style="color:#ffd700; font-size:0.85em; margin-bottom:4px;">🌸 Estación</div>
                    <div>${this.getSeasonLabel()}</div>
                </div>
                <div style="background:rgba(0,0,0,0.3); padding:10px; border-radius:8px;">
                    <div style="color:#ffd700; font-size:0.85em; margin-bottom:4px;">☀️ Clima</div>
                    <div>${this.getWeatherLabel()}</div>
                </div>
            </div>
        `;
        if (fatigue > 0) html += `
            <div style="margin-top:12px; background:rgba(192,57,43,0.2); padding:10px; border-radius:8px; border-left:3px solid #e74c3c;">
                <div style="color:#ff7f66; font-size:0.85em; margin-bottom:6px;">😰 Fatiga</div>
                <div style="background:rgba(0,0,0,0.4); height:8px; border-radius:4px; overflow:hidden;">
                    <div style="background:linear-gradient(90deg,#e74c3c,#c0392b); height:100%; width:${fatiguePercent}%;"></div>
                </div>
                <div style="text-align:right; font-size:0.8em; margin-top:4px;">${fatigue}/100</div>
            </div>`;
        if (this.player.travelState) {
            const toLoc = this.locations[this.player.travelState.to];
            html += `
                <div style="margin-top:12px; background:rgba(46,204,113,0.2); padding:10px; border-radius:8px; border-left:3px solid #2ecc71;">
                    <div style="color:#58d68d;">🧳 Viajando a: ${toLoc?.name || 'Destino'}</div>
                    <div style="font-size:0.85em; margin-top:4px;">Días restantes: ${this.player.travelState.remainingDays}</div>
                </div>`;
        }
        display.innerHTML = html;
    },

    updateShopRyoDisplay() {
        const el = document.getElementById('shop-ryo-display');
        if (el && this.player) el.textContent = this.player.ryo || 0;
    },

    // ── Online players ───────────────────────────────────────

    async updateOnlinePlayers(force = false) {
        if (!this.supabase || !this.player?.village) return;
        if (!force && !this.isVillageScreenActive()) return;
        const now = Date.now();
        if (!force && this._lastOnlineFetch && (now - this._lastOnlineFetch) < 15_000) return;
        this._lastOnlineFetch = now;

        const listEl  = document.getElementById('village-online-list');
        const countEl = document.getElementById('village-online-count');
        if (!listEl || !countEl) return;

        listEl.innerHTML  = '<div class="online-pill"><strong>Buscando...</strong></div>';
        countEl.textContent = '...';

        const { data, error } = await this.supabase
            .from('players')
            .select('id,username,rank,level,village')
            .eq('village', this.player.village)
            .eq('is_online', true)
            .order('level', { ascending: false })
            .limit(30);

        if (error) { listEl.innerHTML = '<div class="online-pill"><strong>Error al cargar</strong></div>'; countEl.textContent = '0'; return; }

        const players = Array.isArray(data) ? data : [];
        const visible = players.filter(p => p.id && p.id !== this.authUser?.id);
        countEl.textContent = String(visible.length);

        if (!visible.length) { listEl.innerHTML = '<div class="online-pill"><strong>Nadie en linea</strong></div>'; return; }

        listEl.innerHTML = visible.map(p => `
            <div class="online-pill">
                <strong>${p.username || 'Ninja'}</strong>
                <span>${p.rank || 'Genin'} · Lv ${Number.isFinite(p.level) ? p.level : 1}</span>
                <button class="btn-utility online-challenge" data-player-id="${p.id}" data-player-name="${p.username || 'Ninja'}">Desafiar</button>
            </div>
        `).join('');

        listEl.querySelectorAll('.online-challenge').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                this.challengePlayer(btn.getAttribute('data-player-id'), btn.getAttribute('data-player-name'));
            });
        });
    },

    async challengePlayer(playerId, playerName) {
        if (!this.supabase || !this.authUser?.id) return;
        if (!playerId || playerId === this.authUser.id) return;
        this._lastChallengeAt = this._lastChallengeAt || {};
        if (Date.now() - (this._lastChallengeAt[playerId] || 0) < 10_000) {
            this.gameAlert('Ya enviaste un desafio hace poco.', '❌'); return;
        }
        const confirmed = await this.gameConfirm(`¿Desafiar a ${playerName || 'este ninja'}?`, '❓');
        if (!confirmed) return;
        const { error } = await this.supabase.from('pvp_challenges').insert({
            challenger_id: this.authUser.id, challenged_id: playerId, status:'pending', battle_state:null,
        });
        if (error) { this.gameAlert('No se pudo enviar el desafio.', '❌'); return; }
        this._lastChallengeAt[playerId] = Date.now();
        this.gameAlert(`Desafio enviado a ${playerName || 'jugador'}.`, '✅');
    },

};
