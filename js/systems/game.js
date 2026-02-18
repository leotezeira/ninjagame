import { BASE_GAME } from '../content/data.js';
import { SaveSystem } from './save.js';

export function createGame() {
    const game = {
        ...BASE_GAME,
        // Funciones puente para login, registro y chat
        async doLogin() {
            const username = document.getElementById('login-username').value.trim();
            const password = document.getElementById('login-password').value;
            document.getElementById('login-loading').style.display = '';
            document.getElementById('login-error').style.display = 'none';
            try {
                await AuthSystem.login(username, password);
            } catch(e) {
                document.getElementById('login-error').textContent = e;
                document.getElementById('login-error').style.display = '';
            } finally {
                document.getElementById('login-loading').style.display = 'none';
            }
        },
        async doRegister() {
            const username = document.getElementById('reg-username').value.trim();
            const password = document.getElementById('reg-password').value;
            const password2 = document.getElementById('reg-password2').value;
            document.getElementById('register-error').style.display = 'none';
            if (password !== password2) {
                document.getElementById('register-error').textContent = 'Las contraseñas no coinciden';
                document.getElementById('register-error').style.display = '';
                return;
            }
            try {
                await AuthSystem.register(username, password);
            } catch(e) {
                document.getElementById('register-error').textContent = e;
                document.getElementById('register-error').style.display = '';
            }
        },
        showLoginTab(tab) {
            document.getElementById('signin-panel').style.display = (tab === 'signin') ? '' : 'none';
            document.getElementById('register-panel').style.display = (tab === 'register') ? '' : 'none';
        },
        previewUsername(value) {
            const preview = document.getElementById('username-preview');
            const error = AuthSystem.validateUsername(value);
            if (error) {
                preview.textContent = error;
                preview.style.color = 'red';
            } else {
                preview.textContent = value;
                preview.style.color = 'green';
            }
        },
        async loadMyProfile() {
            const profile = await AuthSystem.getProfile();
            renderProfile(profile, true);
        },
        async loadProfile(userId) {
            const { data } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
            renderProfile(data, false);
        },
        sendMessage() {
            ChatSystem.sendMessage(document.getElementById('chat-input').value);
        },
        handleChatInput(event) {
            ChatSystem.handleChatInput(event);
        },
        unsubscribeChat() {
            ChatSystem.unsubscribeChat();
        },
        // ...existing code...

        rollDice(sides = 20) {
            return Math.floor(Math.random() * sides) + 1;
        },

        useInventoryItem(index) {
            if (!Array.isArray(this.player.inventory) || index < 0 || index >= this.player.inventory.length) return;
            const item = this.player.inventory[index];
            let used = false;
            if (item.effect?.hp) {
                this.player.hp = Math.min(this.player.maxHp, this.player.hp + item.effect.hp);
                used = true;
            }
            if (item.effect?.chakra) {
                this.player.chakra = Math.min(this.player.maxChakra, this.player.chakra + item.effect.chakra);
                used = true;
            }
            if (item.effect?.fatigue) {
                this.player.fatigue = Math.max(0, this.player.fatigue + item.effect.fatigue);
                used = true;
            }
            if (item.effect?.curePoison) {
                this.player.isPoisoned = false;
                used = true;
            }
            // Puedes agregar más efectos aquí según el diseño de items
            if (used) {
                this.player.inventory.splice(index, 1);
                this.saveGame();
                this.updateVillageUI();
                alert('Item consumido.');
            } else {
                alert('Este item no es consumible.');
            }
        },

        showScreen(screenId) {
            console.log('📺 showScreen called with:', screenId);
            
            // Remover clase active de todas las pantallas
            const allScreens = document.querySelectorAll('.screen');
            console.log('🔍 Found', allScreens.length, 'screens total');
            allScreens.forEach(s => s.classList.remove('active'));
            
            // Obtener pantalla target
            const targetScreen = document.getElementById(screenId);
            if (!targetScreen) {
                console.error('❌ Screen not found:', screenId);
                alert(`Error: Pantalla "${screenId}" no encontrada`);
                return;
            }
            
            console.log('✅ Target screen found:', screenId);
            targetScreen.classList.add('active');
            console.log('✅ Active class added to:', screenId);
            
            // Controlar visibilidad del header
            const header = document.getElementById('game-header');
            const bottomNav = document.getElementById('bottom-nav');
            
            if (screenId === 'combat-screen') {
                // OCULTAR TODO durante combate
                if (header) header.style.display = 'none';
                if (bottomNav) bottomNav.style.display = 'none';
                console.log('🥷 Combat mode: UI hidden');
            } else {
                // Restaurar UI normal
                if (header) {
                    if (screenId === 'village-screen') {
                        header.classList.add('visible');
                        header.style.display = '';
                    } else {
                        header.classList.remove('visible');
                    }
                }
                if (bottomNav) bottomNav.style.display = '';
                console.log('🏠 Normal mode: UI visible');
            }
            
            // Cerrar sidebar si está abierto
            this.closeSidebar();
        },

        showNameScreen() {
            // Nueva partida: pedir nombre antes del clan
            this.pendingName = '';
            this.showScreen('name-screen');
            setTimeout(() => {
                const input = document.getElementById('player-name-input');
                const hint = document.getElementById('name-screen-hint');
                if (input) {
                    input.removeAttribute('readonly');
                    input.value = '';
                    input.focus();
                    if (hint) {
                        hint.textContent = 'Elige el nombre que sera recordado en el mundo ninja.';
                    }
                }
                const err = document.getElementById('name-error');
                if (err) {
                    err.style.display = 'none';
                    err.textContent = '';
                }
            }, 50);
        },

        validateAndSaveName() {
            const input = document.getElementById('player-name-input');
            const err = document.getElementById('name-error');
            const raw = (this.authProfile?.username || input?.value || '').trim();

            const valid = raw.length > 0 && raw.length <= 20 && /^[A-Za-z0-9ÁÉÍÓÚÜÑáéíóúüñ ]+$/.test(raw);
            if (!valid) {
                if (err) {
                    err.style.display = 'block';
                    err.textContent = 'Nombre inválido. Usa solo letras y espacios (máx 20), sin dejarlo vacío.';
                }
                return;
            }

            this.pendingName = raw.replace(/\s+/g, ' ');
            this.showVillageSelect();
        },

        getPlayerDisplayName() {
            if (!this.player) return 'Ninja';
            return this.player.name ? this.player.name : `${this.player.clan} Ninja`;
        },

        showClanSelect() {
            const container = document.getElementById('clan-select');
            container.innerHTML = '';

            const villageKey = this.pendingVillage || this.player?.village || 'konoha';
            const clanKeys = Object.keys(this.clans).filter(key => {
                const clan = this.clans[key];
                return !clan.village || clan.village === villageKey;
            });
            
            const maxStats = {hp: 150, chakra: 170, taijutsu: 25, ninjutsu: 23, genjutsu: 20};

            if (!clanKeys.length) {
                container.innerHTML = '<div class="story-text">No hay clanes disponibles para esta aldea.</div>';
                this.showScreen('clan-screen');
                return;
            }

            clanKeys.forEach(clanKey => {
                const clan = this.clans[clanKey];
                const card = document.createElement('div');
                card.className = 'clan-card';
                card.onclick = () => this.selectClan(clanKey);
                
                // Calcular stats previsualizados
                const topStat = Math.max(clan.taijutsu, clan.ninjutsu, clan.genjutsu);
                const topStatName = clan.taijutsu === topStat ? '👊 Taijutsu' : (clan.ninjutsu === topStat ? '🌀 Ninjutsu' : '👁️ Genjutsu');
                
                card.innerHTML = `
                    <div class="clan-card-header" style="background: linear-gradient(135deg, ${this.getClanColor(clanKey, true)}, ${this.getClanColor(clanKey, false)})">
                        <h3 style="margin: 0; color: #000;">${clan.icon} ${clan.name}</h3>
                        <div class="clan-stat-pill" style="color: #000;">❤️ ${clan.hp}</div>
                        <div class="clan-stat-pill" style="color: #000;">💙 ${clan.chakra}</div>
                        <div class="clan-stat-pill" style="color: #000;">${topStatName.split(' ')[0]} ${topStat}</div>
                    </div>
                    <div class="clan-card-body">
                        <div class="clan-stats">
                            <div class="stat">
                                <span>❤️ HP</span>
                                <div class="stat-bar">
                                    <div class="stat-fill" style="width: ${(clan.hp / maxStats.hp) * 100}%;"></div>
                                </div>
                                <span>${clan.hp}</span>
                            </div>
                            <div class="stat">
                                <span>💙 Chakra</span>
                                <div class="stat-bar">
                                    <div class="stat-fill" style="width: ${(clan.chakra / maxStats.chakra) * 100}%;"></div>
                                </div>
                                <span>${clan.chakra}</span>
                            </div>
                            <div class="stat">
                                <span>👊 Taijutsu</span>
                                <div class="stat-bar">
                                    <div class="stat-fill" style="width: ${(clan.taijutsu / maxStats.taijutsu) * 100}%;"></div>
                                </div>
                                <span>${clan.taijutsu}</span>
                            </div>
                            <div class="stat">
                                <span>🌀 Ninjutsu</span>
                                <div class="stat-bar">
                                    <div class="stat-fill" style="width: ${(clan.ninjutsu / maxStats.ninjutsu) * 100}%;"></div>
                                </div>
                                <span>${clan.ninjutsu}</span>
                            </div>
                            <div class="stat">
                                <span>👁️ Genjutsu</span>
                                <div class="stat-bar">
                                    <div class="stat-fill" style="width: ${(clan.genjutsu / maxStats.genjutsu) * 100}%;"></div>
                                </div>
                                <span>${clan.genjutsu}</span>
                            </div>
                            <p style="margin-top: 12px; color: var(--muted); font-size: 0.9em; font-style: italic;">${clan.description}</p>
                        </div>
                    </div>
                `;
                
                container.appendChild(card);
            });
            
            this.showScreen('clan-screen');
        },

        getClanColor(clanKey, light = true) {
            const colors = {
                'uchiha': { light: 'rgba(231, 76, 60, 0.65)', dark: 'rgba(192, 57, 43, 0.55)' },
                'hyuga': { light: 'rgba(52, 152, 219, 0.65)', dark: 'rgba(41, 128, 185, 0.55)' },
                'nara': { light: 'rgba(46, 204, 113, 0.65)', dark: 'rgba(39, 174, 96, 0.55)' },
                'yamanaka': { light: 'rgba(155, 89, 182, 0.65)', dark: 'rgba(142, 68, 173, 0.55)' },
                'akimichi': { light: 'rgba(230, 126, 34, 0.65)', dark: 'rgba(211, 84, 0, 0.55)' },
            };
            const color = colors[clanKey] || { light: 'rgba(74, 85, 131, 0.65)', dark: 'rgba(45, 53, 97, 0.55)' };
            return light ? color.light : color.dark;
        },

        showVillageSelect() {
            const container = document.getElementById('village-select');
            container.innerHTML = '';
            
            Object.keys(this.villages).forEach(villageKey => {
                const village = this.villages[villageKey];
                const card = document.createElement('div');
                card.className = 'clan-card';
                card.onclick = () => this.selectVillage(villageKey);
                
                card.innerHTML = `
                    <div class="clan-card-header" style="background: linear-gradient(135deg, ${village.color}AA, ${village.color}88)">
                        <h3 style="margin: 0; color: #000;">${village.icon} ${village.name}</h3>
                        <p style="margin: 8px 0 0 0; font-size: 0.85em; font-style: italic; color: #000;">${village.kage}</p>
                    </div>
                    <div class="clan-card-body">
                        <p style="margin: 12px 0; font-size: 0.95em; color: var(--muted);">${village.description}</p>
                        <div style="margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px;">
                            <div style="font-size: 0.85em; color: #ffd700;">📋 Tipos de misión:</div>
                            <div style="font-size: 0.9em; margin-top: 4px;">${village.missionTypes.join(', ')}</div>
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

        selectClan(clanKey) {
            const clan = this.clans[clanKey];
            const villageKey = this.pendingVillage || 'konoha';
            const village = this.villages[villageKey];
            this.player = {
                name: (this.pendingName || '').trim(),
                clan: clan.name,
                clanKey: clanKey,
                maxHp: clan.hp,
                hp: clan.hp,
                maxChakra: clan.chakra,
                chakra: clan.chakra,
                taijutsu: clan.taijutsu,
                ninjutsu: clan.ninjutsu,
                genjutsu: clan.genjutsu,
                level: 1,
                exp: 0,
                expToNext: 100,
                ryo: 500,
                rank: 'Genin',
                element: clan.element,
                inventory: [],
                learnedJutsus: [],
                quickJutsus: Array(5).fill(null),
                kekkeiGenkai: null,
                kekkeiLevel: 0,
                kekkeiExp: 0,
                totalExp: 0,
                permanentBonuses: {},
                combatsWon: 0,
                unlockedJutsus: [],

                // Mundo / calendario
                location: villageKey,
                village: villageKey,
                day: 1,
                month: 1,
                year: 1024,
                timeOfDay: 0, // 0=mañana, 1=tarde, 2=noche, 3=madrugada
                weekday: 0, // 0..6
                weather: 'soleado',
                season: 'primavera',

                // Sistemas
                fatigue: 0, // 0..100
                team: [], // hasta 2 NPCs
                friendship: {}, // npcId -> 0..100
                reputation: {
                    konoha: 0,
                    suna: 0,
                    kiri: 0,
                    iwa: 0,
                    kumo: 0,
                    ame: 0,
                    bosque: 0,
                    olas: 0,
                    valle: 0,
                    nieve: 0
                },

                // Misiones con tiempo
                urgentMission: null,

                // NPCs / relaciones
                npcRelations: {}, // npcId -> -100..100
                npcRivals: {}, // npcId -> true
                npcDailyBattleStamp: {}, // npcId -> 'YYYY-M-D'

                // Progreso para requisitos (exámenes)
                missionsCompletedTotal: 0,
                missionsCompletedByRank: { D: 0, C: 0, B: 0, A: 0, S: 0, U: 0, F: 0 },
                missionsCompletedBPlus: 0,
                missionsCompletedSWhileChunin: 0,

                // Exámenes
                examState: null,
                examCooldowns: { chunin: 0, jonin: 0 },
                lastExamNoticeAbsDay: -1,

                // Gastos y finanzas
                lastWeekProcessedForExpenses: 0
            };

            if (village) {
                this.player.reputation[villageKey] = 70;
                if (village.allies && Array.isArray(village.allies)) {
                    village.allies.forEach(ally => {
                        this.player.reputation[ally] = 40;
                    });
                }
                if (village.enemies && Array.isArray(village.enemies)) {
                    village.enemies.forEach(enemy => {
                        this.player.reputation[enemy] = -30;
                    });
                }
                if (village.rivalVillages && Array.isArray(village.rivalVillages)) {
                    village.rivalVillages.forEach(rival => {
                        this.player.reputation[rival] = 10;
                    });
                }
            }

            this.pendingVillage = null;

            const outcome = this.rollKekkeiGenkai(this.player.clanKey);
            if (outcome.mode === 'skip') {
                this.finishCharacterCreation();
                return;
            }

            this.doKekkeiGenkaiRoll(outcome);
        },

        findKekkeiByName(name) {
            return (this.kekkeiGenkaiList || []).find(k => k.name === name) || null;
        },

        rollKekkeiGenkai(clanKey) {
            const rule = this.clanKekkeiRules ? this.clanKekkeiRules[clanKey] : null;

            // Si no hay regla: por defecto NO tiene posibilidad y se salta la pantalla.
            if (!rule || rule.type === 'none') {
                return { mode: 'skip', kind: 'none' };
            }

            if (rule.type === 'guaranteed') {
                const kg = this.findKekkeiByName(rule.kekkei);
                return { mode: 'screen', kind: 'guaranteed', kg };
            }

            if (rule.type === 'chance') {
                const chance = Number(rule.chance ?? 0);
                const roll = Math.random() * 100;
                if (roll <= chance) {
                    const kg = this.findKekkeiByName(rule.kekkei);
                    return { mode: 'screen', kind: 'rolled_win', kg, chance };
                }
                return { mode: 'screen', kind: 'rolled_lose', kg: null, chance };
            }

            return { mode: 'skip', kind: 'none' };
        },

        doKekkeiGenkaiRoll(outcome) {
            this.showScreen('kekkei-screen');

            const resultDiv = document.getElementById('kekkei-result');
            const continueBtn = document.getElementById('kekkei-continue-btn');
            
            if (resultDiv) {
                resultDiv.className = 'kekkei-genkai-notification';
                resultDiv.innerHTML = `<h2>🌟 Realizando Sorteo de Kekkei Genkai... 🌟</h2>`;
            }
            
            if (continueBtn) {
                continueBtn.disabled = true;
                continueBtn.style.opacity = '0.4';
                continueBtn.style.cursor = 'not-allowed';
            }

            // Delay dramático de 1.5 segundos para que se lea el mensaje
            setTimeout(() => {
                const out = outcome || { kind: 'rolled_lose' };
                const kg = out.kg || null;
                const chanceText = (typeof out.chance === 'number') ? `${out.chance}%` : '';

                if (out.kind === 'guaranteed' && kg) {
                    this.player.kekkeiGenkai = kg;
                    this.player.kekkeiLevel = 1;
                    this.player.kekkeiExp = 0;
                    this.applyKekkeiGenkaiBonuses();

                    if (resultDiv) {
                        resultDiv.className = 'kekkei-genkai-notification granted';
                        resultDiv.innerHTML = `
                            <h2>🌟 ¡KEKKEI GENKAI ANCESTRAL! 🌟</h2>
                            <div style="font-size: 2.8em; margin: 20px 0; font-weight: 900; letter-spacing: 1px;">${kg.name}</div>
                            <p style="font-size: 1.3em; font-weight: 600;">${kg.levels?.[0]?.name || ''}</p>
                            <p style="margin-top: 16px;">¡Tu clan posee este poder ancestral!</p>
                        `;
                    }
                } else if (out.kind === 'rolled_win' && kg) {
                    this.player.kekkeiGenkai = kg;
                    this.player.kekkeiLevel = 1;
                    this.player.kekkeiExp = 0;
                    this.applyKekkeiGenkaiBonuses();

                    if (resultDiv) {
                        resultDiv.className = 'kekkei-genkai-notification granted';
                        resultDiv.innerHTML = `
                            <h2>🌟 ¡KEKKEI GENKAI DESBLOQUEADO! 🌟</h2>
                            <div style="font-size: 2.8em; margin: 20px 0; font-weight: 900; letter-spacing: 1px;">${kg.name}</div>
                            <p style="font-size: 1.3em; font-weight: 600;">${kg.levels?.[0]?.name || ''}</p>
                            <p style="margin-top: 16px;">¡Fuiste bendecido! ${chanceText ? `(${chanceText} chance)` : ''}</p>
                        `;
                    }
                } else {
                    // Lose - no kekkei
                    if (resultDiv) {
                        resultDiv.className = 'kekkei-genkai-notification';
                        resultDiv.style.background = 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)';
                        resultDiv.innerHTML = `
                            <h2>🍂 Sorteo de Kekkei Genkai 🍂</h2>
                            <p style="font-size: 1.3em; margin: 20px 0; font-weight: 600;">No obtuviste Kekkei Genkai.</p>
                            <p style="margin-bottom: 12px;">Los Kekkei Genkai son extremadamente raros.</p>
                            <p>Tu determinación y trabajo duro te harán fuerte.</p>
                            ${chanceText ? `<p style="margin-top: 16px; opacity: 0.85;">Probabilidad: ${chanceText}</p>` : ''}
                        `;
                    }
                }
                
                // Habilitar botón después de la animación
                if (continueBtn) {
                    continueBtn.disabled = false;
                    continueBtn.style.opacity = '1';
                    continueBtn.style.cursor = 'pointer';
                }
            }, 1500);
        },

        applyKekkeiGenkaiBonuses() {
            if (!this.player.kekkeiGenkai) return;
            
            const currentLevel = this.player.kekkeiGenkai.levels[this.player.kekkeiLevel - 1];
            const bonus = currentLevel.bonus;
            
            if (bonus.all) {
                this.player.taijutsu += bonus.all;
                this.player.ninjutsu += bonus.all;
                this.player.genjutsu += bonus.all;
            }
            if (bonus.taijutsu) this.player.taijutsu += bonus.taijutsu;
            if (bonus.ninjutsu) this.player.ninjutsu += bonus.ninjutsu;
            if (bonus.genjutsu) this.player.genjutsu += bonus.genjutsu;
            if (bonus.maxHp) {
                this.player.maxHp += bonus.maxHp;
                this.player.hp = this.player.maxHp;
            }
            if (bonus.maxChakra) {
                this.player.maxChakra += bonus.maxChakra;
                this.player.chakra = this.player.maxChakra;
            }
            
            this.player.critChance = bonus.critChance || 0;
            this.player.chakraRegen = bonus.chakraRegen || 0;
        },

        finishCharacterCreation() {
            this.showScreen('village-screen');
            this.showSection('home');
            this.updateVillageUI();
            this.showMissions();
            this.saveGame();
            this.startRealTimeTick();
        },

        updateVillageUI() {
            document.getElementById('player-name-village').textContent = `${this.getPlayerDisplayName()}`;
            
            const clanDisplay = document.getElementById('player-clan-village');
            if (clanDisplay && this.player.clanKey) {
                const clan = this.clans[this.player.clanKey];
                clanDisplay.textContent = `${clan.icon} ${clan.name}`;
            }
            
            // Mostrar información de la aldea
            if (this.player.village) {
                const village = this.villages[this.player.village];
                if (village) {
                    const villageInfo = document.getElementById('village-info');
                    if (villageInfo) {
                        villageInfo.innerHTML = `
                            <div style="margin-top: 8px; padding: 12px; background: rgba(255,140,0,0.1); border-left: 3px solid ${village.color}; border-radius: 4px;">
                                <div style="font-size: 0.9em; color: #ffd700; font-weight: bold;">${village.icon} ${village.name}</div>
                                <div style="font-size: 0.8em; color: var(--muted); margin-top: 4px;">Kage: ${village.kage}</div>
                            </div>
                        `;
                    }
                }
            }
            
            document.getElementById('player-rank').textContent = this.player.rank;
            document.getElementById('player-level-village').textContent = this.player.level;
            document.getElementById('player-ryo').textContent = this.player.ryo;
            document.getElementById('player-exp-village').textContent = `${this.player.exp}/${this.player.expToNext}`;
            
            document.getElementById('village-health-text').textContent = `${Math.max(0, Math.floor(this.player.hp))}/${this.player.maxHp}`;
            document.getElementById('village-chakra-text').textContent = `${Math.max(0, Math.floor(this.player.chakra))}/${this.player.maxChakra}`;
            
            this.updateBar('village-health-bar', this.player.hp, this.player.maxHp);
            this.updateBar('village-chakra-bar', this.player.chakra, this.player.maxChakra);
            
            const kekkeiDisplay = document.getElementById('kekkei-display');
            if (this.player.kekkeiGenkai) {
                const currentLevel = this.player.kekkeiGenkai.levels[this.player.kekkeiLevel - 1];
                const nextLevel = this.player.kekkeiGenkai.levels[this.player.kekkeiLevel];
                
                let html = `<div class="kekkei-level">
                    <div style="text-align: center;">
                        <span style="background: linear-gradient(135deg, #ffd700, #ff8c00); color: #000; padding: 5px 15px; border-radius: 8px; font-weight: bold;">
                            ⚡ ${this.player.kekkeiGenkai.name} - ${currentLevel.name}
                        </span>
                    </div>`;
                
                if (nextLevel) {
                    const expNeeded = nextLevel.exp - this.player.kekkeiExp;
                    const progress = (this.player.kekkeiExp / nextLevel.exp) * 100;
                    html += `
                        <p style="margin-top: 10px; text-align: center; font-size: 0.9em;">
                            EXP Kekkei: ${this.player.kekkeiExp} / ${nextLevel.exp}
                        </p>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <p style="text-align: center; font-size: 0.85em; color: #ffd700;">
                            Próximo: ${nextLevel.name} (${expNeeded} EXP)
                        </p>`;
                } else {
                    html += `<p style="margin-top: 10px; text-align: center; color: #ffd700;">¡NIVEL MÁXIMO!</p>`;
                }
                
                html += `</div>`;
                kekkeiDisplay.innerHTML = html;
            } else {
                kekkeiDisplay.innerHTML = '';
            }
            
            const elementDisplay = document.getElementById('element-display');
            if (this.player.element) {
                const elem = this.elements[this.player.element];
                elementDisplay.innerHTML = `<span class="element-badge element-${this.player.element}">${elem.icon} ${elem.name}</span>`;
            }

            this.updateOnlinePlayers();

            this.ensureWorldHUD();
            this.updateWorldHUD();
            this.showExamCountdown();
        },

        async updateOnlinePlayers(force = false) {
            if (!this.supabase || !this.player?.village) return;
            if (!force && !this.isVillageScreenActive()) return;

            const now = Date.now();
            if (!force && this._lastOnlineFetch && (now - this._lastOnlineFetch) < 15000) return;
            this._lastOnlineFetch = now;

            const listEl = document.getElementById('village-online-list');
            const countEl = document.getElementById('village-online-count');
            if (!listEl || !countEl) return;

            listEl.innerHTML = '<div class="online-pill"><strong>Buscando...</strong></div>';
            countEl.textContent = '...';

            const { data, error } = await this.supabase
                .from('players')
                .select('id,username,rank,level,village')
                .eq('village', this.player.village)
                .eq('is_online', true)
                .order('level', { ascending: false })
                .limit(30);

            if (error) {
                listEl.innerHTML = '<div class="online-pill"><strong>Error al cargar</strong></div>';
                countEl.textContent = '0';
                return;
            }

            const players = Array.isArray(data) ? data : [];
            const visiblePlayers = players.filter(p => p.id && p.id !== this.authUser?.id);
            countEl.textContent = String(visiblePlayers.length);
            if (!visiblePlayers.length) {
                listEl.innerHTML = '<div class="online-pill"><strong>Nadie en linea</strong></div>';
                return;
            }

            listEl.innerHTML = visiblePlayers.map(p => {
                const safeName = (p.username || 'Ninja');
                const rank = p.rank || 'Genin';
                const level = Number.isFinite(p.level) ? p.level : 1;
                return `
                    <div class="online-pill">
                        <strong>${safeName}</strong>
                        <span>${rank} · Lv ${level}</span>
                        <button class="btn-utility online-challenge" data-player-id="${p.id}" data-player-name="${safeName}">Desafiar</button>
                    </div>
                `;
            }).join('');

            listEl.querySelectorAll('.online-challenge').forEach(button => {
                button.addEventListener('click', (event) => {
                    event.stopPropagation();
                    const playerId = button.getAttribute('data-player-id');
                    const playerName = button.getAttribute('data-player-name');
                    this.challengePlayer(playerId, playerName);
                });
            });
        },

        async challengePlayer(playerId, playerName) {
            if (!this.supabase || !this.authUser?.id) return;
            if (!playerId || playerId === this.authUser.id) return;

            this._lastChallengeAt = this._lastChallengeAt || {};
            const lastSent = this._lastChallengeAt[playerId] || 0;
            if (Date.now() - lastSent < 10000) {
                alert('Ya enviaste un desafio hace poco.');
                return;
            }

            const confirmed = confirm(`¿Desafiar a ${playerName || 'este ninja'}?`);
            if (!confirmed) return;

            const { error } = await this.supabase
                .from('pvp_challenges')
                .insert({
                    challenger_id: this.authUser.id,
                    challenged_id: playerId,
                    status: 'pending',
                    battle_state: null
                });

            if (error) {
                alert('No se pudo enviar el desafio.');
                return;
            }

            this._lastChallengeAt[playerId] = Date.now();

            alert(`Desafio enviado a ${playerName || 'jugador'}.`);
        },

        updateBar(elementId, current, max, label) {
            const bar = document.getElementById(elementId);
            const percentage = (current / max) * 100;
            bar.style.width = Math.max(0, Math.min(100, percentage)) + '%';
            
            // Actualizar texto si existe
            if (label) {
                const textId = elementId.replace('-bar', '-text');
                const textElement = document.getElementById(textId);
                if (textElement) {
                    textElement.textContent = `${label}: ${Math.max(0, Math.floor(current))}/${Math.floor(max)}`;
                }
            }
        },

        // -----------------------------
        // Mundo / calendario (núcleo)
        // -----------------------------
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
                urgentMission: null
                ,

                // NPCs / relaciones
                npcRelations: {}, // npcId -> -100..100
                npcRivals: {}, // npcId -> true
                npcDailyBattleStamp: {}, // npcId -> 'YYYY-M-D'

                // Progreso para requisitos (exámenes)
                missionsCompletedTotal: 0,
                missionsCompletedByRank: { D: 0, C: 0, B: 0, A: 0, S: 0, U: 0, F: 0 },
                missionsCompletedBPlus: 0,

                // Exámenes
                examState: null, // { active, type, phase, data }
                examCooldowns: { chunin: 0, jonin: 0 }, // absolute day until can retry
                lastExamNoticeAbsDay: -1,

                // Gastos y finanzas
                lastWeekProcessedForExpenses: 0,

                // Renegado / deserción
                isRenegade: false,
                status: 'loyal', // 'loyal' | 'renegade'
                renegadeLevel: 0, // estrellas (0..5)
                bounty: 0,
                organization: null, // 'akatsuki' | 'sound' | 'root' | 'bounty'
                organizationRank: 0,
                karma: 0, // -100..100
                anbuTimerDays: 0,
                hideoutLocation: null,
                kinjutsuLearned: [],
                daysAsRenegade: 0,
                identityHiddenDays: 0,
                anbuEliminated: 0,
                criminalMissions: 0,
                renegadesCaptured: 0,
                dailyIzanagiReady: false,

                // Mercado negro / kinjutsu
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

            // Normalizar
            this.player.fatigue = this.clamp(this.player.fatigue, 0, 100);
            // timeOfDay se calcula en tiempo real, no se normaliza desde save
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

            // Sistema de tiempo real: limpiar timeOfDay guardado (se calcula en tiempo real)
            delete this.player.timeOfDay;

            this.updateSeasonAndWeather(false);
        },

        clamp(value, min, max) {
            return Math.min(max, Math.max(min, value));
        },

        getSeasonFromMonth(month) {
            if (month >= 1 && month <= 3) return 'primavera';
            if (month >= 4 && month <= 6) return 'verano';
            if (month >= 7 && month <= 9) return 'otono';
            return 'invierno';
        },

        rollWeatherForSeason(season) {
            const options = this.weatherOptionsBySeason[season] || ['soleado'];
            const idx = Math.floor(Math.random() * options.length);
            return options[idx];
        },

        updateSeasonAndWeather(rollWeather = true) {
            this.player.season = this.getSeasonFromMonth(this.player.month);
            if (rollWeather) {
                this.player.weather = this.rollWeatherForSeason(this.player.season);
            }
        },

        getRealTimeState() {
            const now = Date.now();
            // Turno global absoluto desde epoch
            const absoluteTurn = Math.floor(now / this.REAL_TURN_MS);
            // Turno del día (0-3)
            const turnOfDay = absoluteTurn % this.turnsPerDay;
            // Día absoluto
            const absoluteDay = Math.floor(now / this.REAL_DAY_MS);

            return { now, absoluteTurn, turnOfDay, absoluteDay };
        },

        getTimeOfDay() {
            return this.getRealTimeState().turnOfDay;
        },

        getTimeOfDayLabel() {
            return this.timeOfDayNames[this.getTimeOfDay()] || 'MAÑANA';
        },

        getSeasonLabel() {
            const map = { primavera: 'Primavera', verano: 'Verano', otono: 'Otoño', invierno: 'Invierno' };
            return map[this.player.season] || 'Primavera';
        },

        getWeatherLabel() {
            const map = { soleado: 'Soleado', nublado: 'Nublado', lluvia: 'Lluvia', tormenta: 'Tormenta', nieve: 'Nieve' };
            return map[this.player.weather] || 'Soleado';
        },

        addFatigue(amount) {
            this.player.fatigue = this.clamp(this.player.fatigue + amount, 0, 100);
        },

        reduceFatigue(amount) {
            this.player.fatigue = this.clamp(this.player.fatigue - amount, 0, 100);
        },

        getFatiguePenalty() {
            const f = this.player.fatigue;
            if (f <= 25) return 0;
            if (f <= 50) return 5;
            if (f <= 75) return 10;
            return 20;
        },

        checkFatigueFaint() {
            // 76-100%: riesgo de desmayo
            if (!this.player) return false;
            if (this.player.fatigue < 76) return false;

            const chance = 0.15;
            if (Math.random() >= chance) return false;

            this.disableCombatButtons();
            this.addCombatLog('😵 Te desmayas por la fatiga y pierdes tu turno.', 'log-miss');
            setTimeout(() => this.enemyTurn(), 1200);
            return true;
        },

        getEffectiveStats() {
            const penalty = this.getFatiguePenalty();
            const base = {
                taijutsu: this.player.taijutsu,
                ninjutsu: this.player.ninjutsu,
                genjutsu: this.player.genjutsu
            };

            const buffAll = (this.player.combatBuff && this.player.combatBuff.all) ? this.player.combatBuff.all : 0;

            const team = this.getTeamBonuses();
            return {
                taijutsu: Math.max(1, base.taijutsu - penalty + buffAll),
                ninjutsu: Math.max(1, base.ninjutsu - penalty + buffAll),
                genjutsu: Math.max(1, base.genjutsu - penalty + buffAll),
                combatDamageBonus: team.combatDamageBonus,
                teamEvasionBonus: team.teamEvasionBonus,
                missionRyoMult: team.missionRyoMult,
                missionExpMult: team.missionExpMult,
                travelDayDelta: team.travelDayDelta,
                betweenCombatHealPct: team.betweenCombatHealPct
            };
        },

        getTeamBonuses() {
            const bonuses = {
                missionRyoMult: 1,
                missionExpMult: 1,
                travelDayDelta: 0,
                combatDamageBonus: 0,
                teamEvasionBonus: 0,
                betweenCombatHealPct: 0
            };

            const team = Array.isArray(this.player.team) ? this.player.team : [];
            if (team.length > 0) {
                // Viajar más rápido y seguro
                bonuses.travelDayDelta = -1;
            }

            for (const npcId of team) {
                const npc = this.recruitableNPCs[npcId];
                if (!npc) continue;
                if (npc.perk === 'mission_ryo') bonuses.missionRyoMult *= (1 + npc.perkValue);
                if (npc.perk === 'mission_exp') bonuses.missionExpMult *= (1 + npc.perkValue);
                if (npc.perk === 'combat_damage') bonuses.combatDamageBonus += npc.perkValue;
                if (npc.perk === 'team_evasion') bonuses.teamEvasionBonus += npc.perkValue;
                if (npc.perk === 'between_heal') bonuses.betweenCombatHealPct += npc.perkValue;
            }
            return bonuses;
        },

        advanceTurns(turns, reason = '') {
            if (!this.player) return;

            // Misiones urgentes: el tiempo corre con cualquier acción
            this.tickUrgentMission(turns);

            for (let i = 0; i < turns; i++) {
                // ⚠️ NO MODIFICAR timeOfDay aquí - se calcula en tiempo real via getRealTimeState()
                // const currentTimeOfDay = this.getTimeOfDay();

                // Regeneración pasiva muy leve por turno (afectada por tarde)
                const baseRegen = Math.max(1, Math.floor(this.player.maxChakra * 0.02));
                // Usar tiempo real para determinar si es tarde (timeOfDay === 1)
                const isAfternoon = this.getTimeOfDay() === 1;
                const regenMultiplier = isAfternoon ? 0.9 : 1;
                const regen = Math.floor(baseRegen * regenMultiplier);
                this.player.chakra = Math.min(this.player.maxChakra, this.player.chakra + regen);

                // Cambio de día
                if (this.getTimeOfDay() === 0) {
                    this.player.day += 1;
                    this.player.weekday = (this.player.weekday + 1) % 7;

                    if (this.player.day > this.daysPerMonth) {
                        this.player.day = 1;
                        this.player.month += 1;
                        if (this.player.month > this.monthsPerYear) {
                            this.player.month = 1;
                            this.player.year += 1;
                        }
                    }

                    this.updateSeasonAndWeather(true);
                    this.applyDailyUpkeep();
                    this.checkRandomDailyEvents();
                    this.renegadeDailyTick();
                    this.checkExamDay();
                }
            }

            this.checkRecurringEvents();
            this.saveGame();

            if (this.isVillageScreenActive()) {
                this.updateVillageUI();
            }
        },

        isVillageScreenActive() {
            const el = document.getElementById('village-screen');
            return el && el.classList.contains('active');
        },

        startRealTimeTick() {
            if (this._realTimeTicker) clearInterval(this._realTimeTicker);
            this._realTimeTicker = setInterval(() => {
                this.onRealTimeTick();
            }, 10000); // cada 10 segundos
        },

        onRealTimeTick() {
            if (!this.player) return;

            const { absoluteDay } = this.getRealTimeState();

            // Detectar cambio de día
            if (!this.player.lastProcessedDay) {
                this.player.lastProcessedDay = absoluteDay;
            }

            if (this.player.lastProcessedDay !== absoluteDay) {
                // Nuevo día - procesar eventos diarios
                this.player.lastProcessedDay = absoluteDay;
                this.player.day += 1;
                this.player.weekday = (this.player.weekday + 1) % 7;

                if (this.player.day > this.daysPerMonth) {
                    this.player.day = 1;
                    this.player.month += 1;
                    if (this.player.month > this.monthsPerYear) {
                        this.player.month = 1;
                        this.player.year += 1;
                    }
                }

                this.updateSeasonAndWeather(true);
                this.applyDailyUpkeep();
                this.checkRandomDailyEvents();
                this.renegadeDailyTick();
                this.checkExamDay();

                // Procesar día de viaje si está viajando
                if (this.player.travelState) {
                    this.processNextTravelDay();
                }

                this.saveGame();
            }

            // Actualizar HUD de tiempo
            this.updateWorldHUD();

            // Procesar gastos semanales automáticos
            this.processWeeklyExpenses();

            // Procesar recuperación pasiva de HP y Chakra
            this.processPassiveRecovery();

            if (this.isVillageScreenActive()) {
                this.updateOnlinePlayers();
            }
        },

        updateWorldHUD() {
            // Actualizar display de tiempo en el HUD
            const timeEl = document.getElementById('hud-time');
            if (timeEl) {
                timeEl.textContent = this.getTimeOfDayLabel();
            }
        },

        processPassiveRecovery() {
            if (!this.player) return;

            // Inicializar timestamp de última recuperación
            if (!this.player.lastRecoveryTime) {
                this.player.lastRecoveryTime = Date.now();
                return;
            }

            const elapsed = Date.now() - this.player.lastRecoveryTime;
            const elapsedMinutes = elapsed / 60000; // Convertir a minutos

            // Recuperar 10% por minuto y reducir fatiga 10 por minuto
            if (elapsedMinutes >= 1) {
                const minutes = Math.floor(elapsedMinutes);
                const recoveryPct = 0.10 * minutes;

                this.player.hp = Math.min(
                    this.player.maxHp,
                    this.player.hp + Math.floor(this.player.maxHp * recoveryPct)
                );

                this.player.chakra = Math.min(
                    this.player.maxChakra,
                    this.player.chakra + Math.floor(this.player.maxChakra * recoveryPct)
                );

                // Reducir fatiga 10 por minuto
                this.reduceFatigue(10 * minutes);

                // Actualizar timestamp
                this.player.lastRecoveryTime = Date.now();
                this.saveGame();
            }
        },

        processWeeklyExpenses() {
            if (!this.player) return;

            // Calcular la semana actual (basada en días reales)
            const { absoluteDay } = this.getRealTimeState();
            const currentWeek = Math.floor(absoluteDay / 7);

            // Inicializar si no existe
            if (typeof this.player.lastWeekProcessedForExpenses !== 'number') {
                this.player.lastWeekProcessedForExpenses = currentWeek;
            }

            // Si no cambió de semana, no procesar
            if (currentWeek === this.player.lastWeekProcessedForExpenses) {
                return;
            }

            // Cambió de semana, procesar gastos
            this.player.lastWeekProcessedForExpenses = currentWeek;

            const weeklyExpense = this.WEEKLY_TOTAL; // 80 ryos
            const weeklyRent = this.WEEKLY_RENT;    // 60 ryos
            const weeklyFood = this.WEEKLY_FOOD;    // 20 ryos

            if (this.player.ryo >= weeklyExpense) {
                // Hay dinero suficiente, descontar normalmente
                this.player.ryo -= weeklyExpense;
                
                // Mostrar notificación al jugador (opcional)
                if (this.isVillageScreenActive()) {
                    alert(`💰 Gastos semanales: -${weeklyRent} ryos (alquiler) -${weeklyFood} ryos (comida) = -${weeklyExpense} ryos total`);
                }
            } else {
                // No hay dinero suficiente
                const deficit = weeklyExpense - this.player.ryo;
                this.player.ryo = 0;
                
                // Aumentar fatiga por no poder pagar
                const fatigaIncrease = Math.min(20, Math.floor(deficit / 5)); // 1 fatiga por cada 5 ryos de déficit, máx 20
                this.addFatigue(fatigaIncrease);
                
                // Mostrar alerta crítica
                if (this.isVillageScreenActive()) {
                    alert(`⚠️ ¡No hay suficientes fondos! Te faltan ${deficit} ryos. Tu fatiga aumentó ${fatigaIncrease} puntos.`);
                }
            }

            this.saveGame();
        },

        applyDailyUpkeep() {
            if (!Array.isArray(this.player.team) || this.player.team.length === 0) return;
            let totalCost = 0;
            for (const npcId of this.player.team) {
                const npc = this.recruitableNPCs[npcId];
                if (npc) totalCost += npc.costPerDay;
            }

            if (totalCost <= 0) return;
            if (this.player.ryo >= totalCost) {
                this.player.ryo -= totalCost;
                return;
            }

            // Si no pagás, se van
            alert('💸 No tienes Ryo para pagar al equipo. Los compañeros se han ido.');
            this.player.team = [];
        },

        checkRecurringEvents() {
            if (!this.player) return;
            // Solo mostramos popups en el inicio de cada mañana para no spamear
            if (this.getTimeOfDay() !== 0) return;

            const todayEvents = this.recurringEvents.filter(e => {
                try { return e.when(this.player); } catch { return false; }
            });

            if (todayEvents.length > 0) {
                const names = todayEvents.map(e => `• ${e.name}`).join('\n');
                alert(`🗓️ Eventos de hoy:\n${names}`);
            }
        },

        checkRandomDailyEvents() {
            // Renegados: acceso constante al Mercado Negro (según ubicación de escondites)
            if (this.player.isRenegade) {
                const hideouts = new Set(['bosque', 'olas', 'ame', 'valle']);
                this.player.blackMarketToday = hideouts.has(this.player.location);
                if (!this.player.blackMarketToday) {
                    this.player.blackMarketOffer = null;
                }
                // No maestro visitante ni eventos “positivos” de aldea
                this.player.visitingMasterToday = false;
                return;
            }

            // Mercado negro (aleatorio)
            const chance = 0.07; // 7% al día
            const isActive = Math.random() < chance;
            this.player.blackMarketToday = isActive;
            if (!isActive) {
                this.player.blackMarketOffer = null;
            }

            // Inicio de mes: invasión 10%
            if (this.player.day === 1 && this.getTimeOfDay() === 0) {
                if (Math.random() < 0.10 && this.player.location === 'konoha') {
                    this.spawnUrgentMission('🏯 Invasión de la aldea', 3);
                }
            }

            // Maestro visitante (aleatorio)
            if (Math.random() < 0.04 && this.player.location === 'konoha') {
                this.player.visitingMasterToday = true;
            } else {
                this.player.visitingMasterToday = false;
            }
        },

        renegadeDailyTick() {
            if (!this.player.isRenegade) {
                return;
            }

            this.player.daysAsRenegade += 1;

            // Identidad escondida
            if (this.player.identityHiddenDays > 0) {
                this.player.identityHiddenDays -= 1;
            }

            // Recompensa base
            const base = (this.player.level || 1) * 1000;
            const starMult = 1 + (this.player.renegadeLevel * 0.35);
            this.player.bounty = Math.floor(base * starMult);

            // Timer ANBU
            if (this.player.identityHiddenDays > 0) {
                // “fuera del bingo”: baja presión
                this.player.anbuTimerDays = Math.max(this.player.anbuTimerDays, 7);
                this.player.anbuTimerDays -= 1;
            } else {
                this.player.anbuTimerDays = Math.max(0, (this.player.anbuTimerDays || 0) - 1);
            }

            if (this.player.anbuTimerDays === 0 && this.player.identityHiddenDays === 0) {
                this.anbuHunterAttack();
                this.player.anbuTimerDays = this.rollNextAnbuIntervalDays();
            }

            // Izanagi diario (Sharingan artificial)
            if (this.player.dailyIzanagiReady === false && this.player.hasDailyIzanagi) {
                this.player.dailyIzanagiReady = true;
            }
        },

        rollNextAnbuIntervalDays() {
            const s = this.player.renegadeLevel || 1;
            if (s >= 5) return 1;
            if (s === 4) return 2;
            if (s === 3) return 3;
            if (s === 2) return 4;
            // 1 o 0
            return 5;
        },

        // -----------------------------
        // Renegado / deserción
        // -----------------------------
        promptDesertion() {
            if (!this.player || this.player.isRenegade) return;
            if (this.player.level < 5) {
                alert('Necesitas ser nivel 5+ para desertar.');
                return;
            }
            if (this.player.location !== 'konoha') {
                alert('Solo puedes desertar desde Konoha.');
                return;
            }

            const ok = confirm(
                '⚠️ DESERCIÓN\n\n' +
                '- Serás marcado como Renegado (0–5★)\n' +
                '- ANBU te perseguirá periódicamente\n' +
                '- No podrás entrar a Konoha ni usar Tienda/Academia\n' +
                '- Accedes al Mercado Negro, contratos y Kinjutsu\n\n' +
                '¿Confirmas que desertarás?'
            );
            if (!ok) return;
            this.becomeRenegade();
        },

        becomeRenegade() {
            this.player.isRenegade = true;
            this.player.status = 'renegade';
            this.player.renegadeLevel = Math.max(1, this.player.renegadeLevel || 0);
            this.player.karma = this.clamp((this.player.karma || 0) - 10, -100, 100);
            this.player.anbuTimerDays = this.rollNextAnbuIntervalDays();

            if (this.player.reputation?.konoha !== undefined) {
                this.player.reputation.konoha = -100;
            }

            // Escapás a un escondite
            this.player.location = 'bosque';
            this.player.hideoutLocation = 'bosque';

            // Recompensa base
            const base = (this.player.level || 1) * 1000;
            const starMult = 1 + (this.player.renegadeLevel * 0.35);
            this.player.bounty = Math.floor(base * starMult);

            this.hideRenegadePanels();
            this.updateVillageUI();
            this.saveGame();
            alert('Has desertado. Ahora eres un Ninja Renegado.');
        },

        hideRenegadePanels() {
            const bm = document.getElementById('blackmarket-panel');
            const org = document.getElementById('organization-panel');
            const red = document.getElementById('redemption-panel');
            if (bm) bm.style.display = 'none';
            if (org) org.style.display = 'none';
            if (red) red.style.display = 'none';
        },

        increaseWantedLevel(amount) {
            if (!this.player?.isRenegade) return;
            this.player.renegadeLevel = this.clamp((this.player.renegadeLevel || 0) + amount, 0, 5);
            this.updateWorldHUD();
        },

        reduceWantedLevel() {
            if (!this.player?.isRenegade) return;
            const current = this.player.renegadeLevel || 0;
            if (current <= 0) {
                alert('No tienes búsqueda activa.');
                return;
            }
            const cost = 8000 + current * 5000;
            const ok = confirm(`Reducir búsqueda cuesta ${cost.toLocaleString('es-ES')} Ryo y consume 1 día (4 turnos). ¿Proceder?`);
            if (!ok) return;
            if (this.player.ryo < cost) {
                alert('No tienes suficiente Ryo.');
                return;
            }
            this.player.ryo -= cost;
            this.increaseWantedLevel(-1);
            this.player.karma = this.clamp((this.player.karma || 0) + 5, -100, 100);
            // El tiempo avanza naturalmente en el sistema basado en tiempo real
            this.updateVillageUI();
            this.saveGame();
        },

        toggleBlackMarketPanel() {
            if (!this.player?.isRenegade) return;
            if (!this.player.blackMarketToday) {
                alert('🕶️ El Mercado Negro no está disponible aquí/hoy. Busca un escondite.');
                return;
            }
            this.hideRenegadePanels();
            const panel = document.getElementById('blackmarket-panel');
            if (!panel) return;
            panel.style.display = (panel.style.display === 'none' || !panel.style.display) ? 'block' : 'none';
            if (panel.style.display === 'block') this.renderBlackMarketPanel(panel);
        },

        getBlackMarketPriceMultiplier() {
            let mult = 1.0;
            if (this.player.organization === 'akatsuki') mult *= 0.85;
            if (this.player.organization === 'sound') mult *= 0.9;
            if (this.player.organization === 'root') mult *= 0.9;
            return mult;
        },

        renderBlackMarketPanel(panelEl) {
            const items = this.blackMarketItems || [];
            const services = this.blackMarketServices || [];
            const kinjutsu = this.kinjutsu || [];
            const mult = this.getBlackMarketPriceMultiplier();

            panelEl.innerHTML = `
                <div class="panel">
                    <h3>🕳️ Mercado Negro</h3>
                    <p style="margin-top:-6px; color: rgba(240,240,240,0.75)">Técnicas prohibidas, ítems ilegales y servicios ocultos.</p>
                    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:12px;">
                        <div class="card">
                            <h4>🧪 Ítems</h4>
                            ${items.map(it => {
                                const price = Math.ceil((it.price || 0) * mult);
                                return `
                                    <div class="info-item" style="margin-bottom:8px;">
                                        <div><b>${it.name}</b><br><span style="color: rgba(240,240,240,0.75)">${it.description || ''}</span></div>
                                        <button class="btn btn-small" onclick="game.buyBlackMarketItem('${it.id}')">Comprar (${price.toLocaleString('es-ES')} Ryo)</button>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        <div class="card">
                            <h4>🧾 Servicios</h4>
                            ${services.map(sv => {
                                const price = Math.ceil((sv.price || 0) * mult);
                                return `
                                    <div class="info-item" style="margin-bottom:8px;">
                                        <div><b>${sv.name}</b><br><span style="color: rgba(240,240,240,0.75)">${sv.description || ''}</span></div>
                                        <button class="btn btn-small" onclick="game.buyBlackMarketService('${sv.id}')">Pagar (${price.toLocaleString('es-ES')} Ryo)</button>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        <div class="card">
                            <h4>📜 Kinjutsu</h4>
                            ${kinjutsu.map(kj => {
                                const learned = (this.player.kinjutsuLearned || []).includes(kj.id);
                                const price = Math.ceil((kj.price || 0) * mult);
                                const disabled = learned ? 'disabled' : '';
                                return `
                                    <div class="info-item" style="margin-bottom:8px;">
                                        <div><b>${kj.name}</b><br><span style="color: rgba(240,240,240,0.75)">${kj.description || ''}</span></div>
                                        <button class="btn btn-small" ${disabled} onclick="game.buyKinjutsu('${kj.id}')">${learned ? 'Aprendido' : `Aprender (${price.toLocaleString('es-ES')} Ryo)`}</button>
                                    </div>
                                `;
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
            if (this.player.ryo < price) {
                alert('No tienes suficiente Ryo.');
                return;
            }

            this.player.ryo -= price;
            this.player.blackMarketInventory.push({ id: item.id, name: item.name, effect: item.effect || null });

            // Consumible de combate
            if (item.effect && (item.effect.buffAll || item.effect.backlashHp || item.effect.buffTurns)) {
                this.player.inventory.push({ name: item.name, effect: { buffAll: item.effect.buffAll, buffTurns: item.effect.buffTurns, backlashHp: item.effect.backlashHp } });
            }

            if (item.id === 'sharingan_artificial' && item.effect?.dailyIzanagi) {
                this.player.hasDailyIzanagi = true;
                this.player.dailyIzanagiReady = true;
                this.player.genjutsu += (item.effect.genjutsu || 0);
            }

            if (item.id === 'pergamino_kinjutsu' && item.effect?.unlockKinjutsu) {
                this.unlockRandomKinjutsu();
            }

            this.increaseWantedLevel(1);
            this.updateVillageUI();
            this.saveGame();
            const panel = document.getElementById('blackmarket-panel');
            if (panel && panel.style.display === 'block') this.renderBlackMarketPanel(panel);
            alert(`Compra realizada: ${item.name}`);
        },

        buyBlackMarketService(serviceId) {
            if (!this.player?.isRenegade) return;
            const svc = (this.blackMarketServices || []).find(s => s.id === serviceId);
            if (!svc) return;
            const price = Math.ceil((svc.price || 0) * this.getBlackMarketPriceMultiplier());
            if (this.player.ryo < price) {
                alert('No tienes suficiente Ryo.');
                return;
            }
            if (!confirm(`${svc.name} por ${price.toLocaleString('es-ES')} Ryo. ¿Confirmar?`)) return;

            this.player.ryo -= price;
            const effect = svc.effect || {};
            if (effect.hideDays) {
                this.player.identityHiddenDays = Math.max(this.player.identityHiddenDays || 0, effect.hideDays);
            }
            if (effect.changeElement) {
                const options = Object.entries(this.elements || {}).map(([k, v]) => ({ k, name: v.name }));
                const pick = prompt(`Elige tu nuevo elemento (${options.map(o => o.name).join(', ')})`);
                if (pick) {
                    const found = options.find(o => o.name.toLowerCase() === pick.toLowerCase());
                    if (found) this.player.element = found.k;
                }
            }
            if (effect.maxHp) {
                this.player.maxHp += effect.maxHp;
                this.player.hp = Math.min(this.player.maxHp, this.player.hp + effect.maxHp);
            }
            if (effect.maxChakra) {
                this.player.maxChakra += effect.maxChakra;
                this.player.chakra = Math.min(this.player.maxChakra, this.player.chakra + effect.maxChakra);
            }
            if (effect.resetReputation && this.player.reputation?.konoha !== undefined) {
                this.player.reputation.konoha = Math.min(0, this.player.reputation.konoha || 0);
                this.player.karma = this.clamp((this.player.karma || 0) + 10, -100, 100);
            }

            this.increaseWantedLevel(1);
            this.updateVillageUI();
            this.saveGame();
            const panel = document.getElementById('blackmarket-panel');
            if (panel && panel.style.display === 'block') this.renderBlackMarketPanel(panel);
            alert('Servicio completado.');
        },

        unlockRandomKinjutsu() {
            const list = (this.kinjutsu || []).filter(k => !(this.player.kinjutsuLearned || []).includes(k.id));
            if (list.length === 0) return;
            const pick = list[Math.floor(Math.random() * list.length)];
            this.player.kinjutsuLearned.push(pick.id);
            this.player.learnedJutsus.push({
                name: pick.name,
                rank: pick.rank,
                chakra: pick.chakra,
                damage: pick.damage,
                description: pick.description,
                isKinjutsu: true,
                effect: pick.effect
            });
        },

        buyKinjutsu(kinjutsuId) {
            if (!this.player?.isRenegade) return;
            const kin = (this.kinjutsu || []).find(k => k.id === kinjutsuId);
            if (!kin) return;
            if ((this.player.kinjutsuLearned || []).includes(kin.id)) return;
            const price = Math.ceil((kin.price || 0) * this.getBlackMarketPriceMultiplier());
            if (this.player.ryo < price) {
                alert('No tienes suficiente Ryo.');
                return;
            }
            if (!confirm(`Aprender ${kin.name} por ${price.toLocaleString('es-ES')} Ryo. ¿Confirmar?`)) return;

            this.player.ryo -= price;
            this.player.kinjutsuLearned.push(kin.id);
            this.player.learnedJutsus.push({
                name: kin.name,
                rank: kin.rank,
                chakra: kin.chakra,
                damage: kin.damage,
                description: kin.description,
                isKinjutsu: true,
                effect: kin.effect
            });
            this.increaseWantedLevel(1);
            this.updateVillageUI();
            this.saveGame();
            const panel = document.getElementById('blackmarket-panel');
            if (panel && panel.style.display === 'block') this.renderBlackMarketPanel(panel);
            alert(`Has aprendido: ${kin.name}`);
        },

        toggleOrganizationPanel() {
            if (!this.player?.isRenegade) return;
            this.hideRenegadePanels();
            const panel = document.getElementById('organization-panel');
            if (!panel) return;
            panel.style.display = (panel.style.display === 'none' || !panel.style.display) ? 'block' : 'none';
            if (panel.style.display === 'block') this.renderOrganizationPanel(panel);
        },

        renderOrganizationPanel(panelEl) {
            const org = this.player.organization;
            const canJoin = !org;
            panelEl.innerHTML = `
                <div class="panel">
                    <h3>🏴 Organización</h3>
                    <p style="margin-top:-6px; color: rgba(240,240,240,0.75)">${org ? `Actualmente: <b>${org}</b> (rango ${this.player.organizationRank || 1})` : 'No perteneces a ninguna.'}</p>
                    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:12px;">
                        <div class="card">
                            <h4>Akatsuki</h4>
                            <p style="color: rgba(240,240,240,0.75)">Tributo alto, acceso premium y descuentos.</p>
                            <button class="btn btn-small" ${canJoin ? '' : 'disabled'} onclick="game.joinOrganization('akatsuki')">Unirse</button>
                        </div>
                        <div class="card">
                            <h4>Sonido</h4>
                            <p style="color: rgba(240,240,240,0.75)">Mejoras físicas y chakra a costo moderado.</p>
                            <button class="btn btn-small" ${canJoin ? '' : 'disabled'} onclick="game.joinOrganization('sound')">Unirse</button>
                        </div>
                        <div class="card">
                            <h4>ROOT</h4>
                            <p style="color: rgba(240,240,240,0.75)">Operaciones encubiertas y ocultamiento.</p>
                            <button class="btn btn-small" ${canJoin ? '' : 'disabled'} onclick="game.joinOrganization('root')">Unirse</button>
                        </div>
                        <div class="card">
                            <h4>Cazarrecompensas</h4>
                            <p style="color: rgba(240,240,240,0.75)">Bingo Book y contratos de captura.</p>
                            <button class="btn btn-small" ${canJoin ? '' : 'disabled'} onclick="game.joinOrganization('bounty')">Unirse</button>
                        </div>
                    </div>
                    <div style="margin-top:10px; display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
                        <button class="btn btn-small btn-secondary" ${org ? '' : 'disabled'} onclick="game.leaveOrganization()">Salir</button>
                        <button class="btn btn-small" onclick="game.showSection('world')">Ver misiones/contratos</button>
                    </div>
                </div>
            `;
        },

        joinOrganization(orgId) {
            if (!this.player?.isRenegade) {
                alert('Solo renegados pueden unirse desde aquí.');
                return;
            }
            if (this.player.organization) return;
            const requirements = {
                akatsuki: { level: 10, fee: 20000 },
                sound: { level: 8, fee: 12000 },
                root: { level: 12, fee: 18000 },
                bounty: { level: 6, fee: 6000 }
            };
            const req = requirements[orgId];
            if (!req) return;
            if (this.player.level < req.level) {
                alert(`Requiere nivel ${req.level}+.`);
                return;
            }
            if (this.player.ryo < req.fee) {
                alert('No tienes suficiente Ryo para el tributo.');
                return;
            }
            if (!confirm(`Unirte a ${orgId} cuesta ${req.fee.toLocaleString('es-ES')} Ryo. ¿Confirmar?`)) return;
            this.player.ryo -= req.fee;
            this.player.organization = orgId;
            this.player.organizationRank = 1;

            if (orgId === 'akatsuki') {
                this.player.maxChakra += 50;
                this.player.ninjutsu += 10;
            } else if (orgId === 'sound') {
                this.player.maxHp += 60;
                this.player.taijutsu += 10;
            } else if (orgId === 'root') {
                this.player.identityHiddenDays = Math.max(this.player.identityHiddenDays || 0, 7);
                this.player.genjutsu += 8;
            } else if (orgId === 'bounty') {
                this.player.critChance = (this.player.critChance || 0) + 2;
            }

            this.updateVillageUI();
            this.saveGame();
            const panel = document.getElementById('organization-panel');
            if (panel && panel.style.display === 'block') this.renderOrganizationPanel(panel);
            alert(`Te has unido a ${orgId}.`);
        },

        leaveOrganization() {
            if (!this.player?.organization) return;
            if (!confirm('¿Salir de la organización?')) return;
            this.player.organization = null;
            this.player.organizationRank = 0;
            this.updateVillageUI();
            this.saveGame();
            const panel = document.getElementById('organization-panel');
            if (panel && panel.style.display === 'block') this.renderOrganizationPanel(panel);
        },

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
            const need = Math.max(0, 30 - karma);
            panelEl.innerHTML = `
                <div class="panel">
                    <h3>🕊️ Camino de Redención</h3>
                    <p style="color: rgba(240,240,240,0.75)">Necesitas karma alto y búsqueda baja para limpiar tu nombre.</p>
                    <div class="info-item">Karma: <b>${karma}</b> • Faltan: <b>${need}</b> • Búsqueda: <b>${this.player.renegadeLevel || 0}★</b></div>
                    <div style="margin-top:10px; text-align:center;">
                        <button class="btn btn-small" onclick="game.attemptRedemption()">Intentar Redención</button>
                    </div>
                </div>
            `;
        },

        attemptRedemption() {
            if (!this.player?.isRenegade) return;
            if ((this.player.karma || 0) < 30) {
                alert('Aún no has hecho suficientes acciones de redención.');
                return;
            }
            if ((this.player.renegadeLevel || 0) > 1) {
                alert('Primero reduce tu nivel de búsqueda a 1★ o menos.');
                return;
            }
            if (!confirm('¿Dejar la vida renegada y volver a Konoha?')) return;

            this.player.isRenegade = false;
            this.player.status = 'loyal';
            this.player.renegadeLevel = 0;
            this.player.bounty = 0;
            this.player.organization = null;
            this.player.organizationRank = 0;
            if (this.player.reputation?.konoha !== undefined) {
                this.player.reputation.konoha = Math.max(0, this.player.reputation.konoha || 0);
            }
            this.player.location = 'konoha';
            this.player.hideoutLocation = null;
            this.hideRenegadePanels();
            this.updateVillageUI();
            this.saveGame();
            alert('Has sido readmitido.');
        },

        anbuHunterAttack() {
            if (!this.player?.isRenegade) return;
            if (document.getElementById('combat-screen')?.classList.contains('active')) return;
            if (this.player.travelState) return;

            const templates = this.anbuHunters || [];
            if (templates.length === 0) return;

            const stars = this.clamp(this.player.renegadeLevel || 1, 1, 5);
            const squadSize = this.clamp(1 + stars, 2, 6);

            this.currentMission = {
                name: '⚔️ Persecución ANBU',
                rank: 'X',
                description: 'Los cazadores te encontraron. No hay escapatoria.',
                enemies: [],
                ryo: 1000 + stars * 500,
                exp: 200 + stars * 120,
                turns: 0,
                isAnbuHunt: true
            };

            this.enemyQueue = [];
            for (let i = 0; i < squadSize; i++) {
                const base = templates[Math.floor(Math.random() * templates.length)];
                const isCaptain = i === 0 && stars >= 3;
                const scaled = {
                    ...base,
                    name: isCaptain ? 'ANBU Capitán' : base.name,
                    hp: Math.floor(base.hp * (1 + stars * 0.15) + (this.player.level * 8)),
                    chakra: Math.floor(base.chakra * (1 + stars * 0.10)),
                    attack: Math.floor(base.attack * (1 + stars * 0.12) + (this.player.level * 0.8)),
                    defense: Math.floor(base.defense * (1 + stars * 0.10)),
                    accuracy: Math.floor(base.accuracy * (1 + stars * 0.05)),
                    controlledTurns: 0
                };
                this.enemyQueue.push({ ...scaled, maxHp: scaled.hp, maxChakra: scaled.chakra });
            }

            this.totalWaves = this.enemyQueue.length;
            this.currentWave = 1;
            this.currentEnemy = this.enemyQueue.shift();

            alert(`⚠️ ANBU te ha encontrado (${stars}★). ¡Prepárate!`);
            this.startCombat();
        },

        getBlackMarketOffer() {
            if (!this.player.blackMarketToday) return null;
            const stamp = `${this.player.year}-${this.player.month}-${this.player.day}`;
            if (this.player.blackMarketOffer && this.player.blackMarketOffer.stamp === stamp) {
                return this.player.blackMarketOffer;
            }

            // Elegir un jutsu raro (prioriza master, luego jonin)
            const rarePool = [...(this.academyJutsus.master || []), ...(this.academyJutsus.jonin || [])];
            const available = rarePool.filter(j => !this.player.learnedJutsus?.some(l => l.name === j.name));
            const chosen = (available.length ? available : rarePool)[Math.floor(Math.random() * rarePool.length)];

            const base = Math.floor((chosen.price || 2000) * 1.5);
            const price = this.applyPriceDiscount(base);

            this.player.blackMarketOffer = {
                stamp,
                jutsu: chosen,
                name: chosen.name,
                rank: chosen.rank,
                price
            };

            return this.player.blackMarketOffer;
        },

        buyBlackMarketJutsu() {
            if (!this.player.blackMarketToday) {
                alert('El Mercado Negro no está disponible ahora.');
                return;
            }
            if (this.player.location !== 'konoha') {
                alert('Este contacto del Mercado Negro solo está en Konoha.');
                return;
            }
            if (this.getTimeOfDay() === 3) {
                alert('Es madrugada. No es seguro comerciar ahora.');
                return;
            }

            const offer = this.getBlackMarketOffer();
            if (!offer) return;

            const already = this.player.learnedJutsus?.some(l => l.name === offer.jutsu.name);
            if (already) {
                alert('Ya aprendiste ese jutsu.');
                return;
            }
            if (this.player.ryo < offer.price) {
                alert('No tienes suficiente Ryo para el Mercado Negro.');
                return;
            }

            this.player.ryo -= offer.price;
            this.player.learnedJutsus.push(offer.jutsu);
            this.player.blackMarketToday = false;
            this.player.blackMarketOffer = null;
            alert(`🕶️ Compraste y aprendiste: ${offer.jutsu.name}`);
            this.updateVillageUI();
            this.showAcademy('master');
            this.saveGame();
        },

        spawnUrgentMission(title, daysLimit) {
            const turnsLimit = daysLimit * this.turnsPerDay;
            this.player.urgentMission = {
                name: title,
                createdAt: { day: this.player.day, month: this.player.month, year: this.player.year },
                turnsLeft: turnsLimit,
                ryoMultiplier: 2,
                expMultiplier: 1.2
            };
            alert(`🚨 MISIÓN URGENTE: ${title}\nTiempo límite: ${daysLimit} días`);
        },

        buildUrgentMissionTemplate() {
            // Plantilla simple (puede evolucionar a varias urgentes distintas)
            // Ajuste por rango del jugador
            const rank = (this.player.rank || 'Genin');
            let enemyType = 'genin';
            let count = 2;
            let baseRyo = 400;
            let baseExp = 120;
            if (rank === 'Chunin') { enemyType = 'chunin'; count = 2; baseRyo = 700; baseExp = 180; }
            else if (rank === 'Jonin') { enemyType = 'jonin'; count = 2; baseRyo = 1200; baseExp = 260; }
            else if (rank === 'ANBU' || rank === 'Kage') { enemyType = 'akatsuki'; count = 1; baseRyo = 1800; baseExp = 320; }

            return {
                name: this.player.urgentMission?.name || 'Misión urgente',
                rank: 'U',
                description: 'Requiere atención inmediata. Recompensa mejorada.',
                enemies: [{ type: enemyType, index: 0, count }],
                ryo: baseRyo,
                exp: baseExp,
                isUrgent: true,
                turns: 2
            };
        },

        startUrgentMission() {
            if (!this.player?.urgentMission) {
                alert('No tienes misiones urgentes activas.');
                return;
            }
            const urgent = this.player.urgentMission;
            const mission = this.buildUrgentMissionTemplate();
            mission.ryo = Math.floor(mission.ryo * (urgent.ryoMultiplier || 2));
            mission.exp = Math.floor(mission.exp * (urgent.expMultiplier || 1.2));
            this.startMission(mission);
        },

        tickUrgentMission(turnsPassed) {
            if (!this.player.urgentMission) return;
            this.player.urgentMission.turnsLeft -= turnsPassed;
            if (this.player.urgentMission.turnsLeft <= 0) {
                alert('⏳ Fallaste una misión urgente. Pierdes reputación.');
                this.applyReputationDelta(this.player.location, -10);
                this.player.urgentMission = null;
            }
        },

        applyReputationDelta(locationId, delta) {
            if (!this.player.reputation) this.player.reputation = {};
            const current = this.player.reputation[locationId] || 0;
            // Reputación ampliada: permite hostilidad (hasta -100)
            this.player.reputation[locationId] = this.clamp(current + delta, -100, 100);
        },

        getReputationTier(locationId) {
            const rep = (this.player.reputation && this.player.reputation[locationId]) || 0;
            if (rep < 0) return 'Enemigo';
            if (rep <= 20) return 'Desconocido';
            if (rep <= 50) return 'Conocido';
            if (rep <= 80) return 'Respetado';
            return 'Héroe';
        },

        getReputationDiscount(locationId) {
            const rep = (this.player.reputation && this.player.reputation[locationId]) || 0;
            if (rep < 0) return 0;
            if (rep <= 20) return 0;
            if (rep <= 50) return 0.05;
            if (rep <= 80) return 0.10;
            return 0.15;
        },

        isFestivalActive() {
            return this.player.location === 'konoha' && this.player.month === 5 && this.player.day === 15;
        },

        applyPriceDiscount(basePrice) {
            let price = basePrice;
            const repDiscount = this.getReputationDiscount(this.player.location);
            if (this.isFestivalActive()) {
                price = Math.floor(price * 0.5);
            }
            price = Math.floor(price * (1 - repDiscount));
            return Math.max(1, price);
        },

        // -----------------------------
        // HUD Calendario (inyectada)
        // -----------------------------
        ensureWorldHUD() {
            const village = document.getElementById('village-screen');
            if (!village) return;

            let hud = document.getElementById('world-hud');
            if (hud) return;

            hud = document.createElement('div');
            hud.id = 'world-hud';
            hud.className = 'player-info';
            hud.style.marginTop = '15px';
            hud.style.borderColor = 'rgba(52, 152, 219, 0.55)';

            // Insertar luego del primer .player-info (info del jugador)
            const firstInfo = village.querySelector('.player-info');
            if (firstInfo && firstInfo.parentNode) {
                firstInfo.parentNode.insertBefore(hud, firstInfo.nextSibling);
            } else {
                village.insertBefore(hud, village.firstChild);
            }

            hud.innerHTML = `
                <div style="display:flex; gap:12px; flex-wrap:wrap; align-items:center; justify-content:space-between;">
                    <div>
                        <div style="color:#ff8c00; font-weight:bold;">🗓️ <span id="hud-date"></span></div>
                        <div style="margin-top:4px;">
                            <span style="background: rgba(255,140,0,0.18); border:1px solid rgba(255,140,0,0.35); padding:4px 10px; border-radius:999px; font-weight:bold; display:inline-block;">
                                <span id="hud-time"></span>
                            </span>
                            <span style="margin-left:8px; color: rgba(240,240,240,0.85);">🌿 <span id="hud-season"></span></span>
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <div>📍 Ubicación: <b id="hud-location"></b></div>
                        <div style="margin-top:4px;">🌡️ Clima: <b id="hud-weather"></b></div>
                    </div>
                </div>
                <div style="margin-top:12px; display:grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap:10px;">
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
                    <button class="btn btn-small" id="desert-btn" style="display:none; background: linear-gradient(135deg, #8b0000 0%, #c0392b 100%);" onclick="game.promptDesertion()">⚠️ Desertar de la Aldea</button>
                </div>

                <div id="renegade-box" style="display:none; margin-top:12px; padding-top:12px; border-top:1px solid rgba(74,85,131,0.45);">
                    <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center; justify-content:space-between;">
                        <div style="color:#c0392b; font-weight:bold;">🔴 MODO RENEGADO ACTIVO</div>
                        <div style="font-size:0.9em; color: rgba(240,240,240,0.78);">⚠️ ANBU próximo: <b id="hud-anbu-next"></b> día(s)</div>
                    </div>
                    <div style="margin-top:10px; display:grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap:10px;">
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
                    <div id="blackmarket-panel" style="display:none; margin-top:12px;"></div>
                    <div id="organization-panel" style="display:none; margin-top:12px;"></div>
                    <div id="redemption-panel" style="display:none; margin-top:12px;"></div>
                </div>

                <div id="travel-panel" style="display:none; margin-top:12px; padding-top:12px; border-top:1px solid rgba(74,85,131,0.45);">
                    <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center; justify-content:space-between;">
                        <div style="color:#ff8c00; font-weight:bold;">🧭 Viaje</div>
                        <div style="font-size:0.9em; color: rgba(240,240,240,0.78);">Cada día consume 10% Chakra y puede haber encuentros</div>
                    </div>
                    <div style="margin-top:10px; display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <div>
                            <div style="margin-bottom:6px;">Destino</div>
                            <select id="travel-destination" style="width:100%; padding:10px; border-radius:8px; background: rgba(0,0,0,0.4); color:#fff; border:1px solid rgba(74,85,131,0.6);"></select>
                        </div>
                        <div>
                            <div style="margin-bottom:6px;">Opciones</div>
                            <label style="display:flex; gap:8px; align-items:center; background: rgba(0,0,0,0.25); padding:10px; border-radius:8px; border:1px solid rgba(74,85,131,0.4);">
                                <input type="checkbox" id="travel-group" />
                                Viajar en grupo (+1 día, más seguro)
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

            const loc = this.locations[this.player.location] || { name: this.player.location, icon: '📍' };
            const dateText = `${this.monthNames[this.player.month - 1]}, Día ${this.player.day}, Año ${this.player.year} · ${this.weekdayNames[this.player.weekday]}`;
            document.getElementById('hud-date').textContent = dateText;
            document.getElementById('hud-time').textContent = `${this.getTimeOfDayLabel()}`;
            document.getElementById('hud-season').textContent = this.getSeasonLabel();
            document.getElementById('hud-location').textContent = `${loc.icon} ${loc.name}`;
            document.getElementById('hud-weather').textContent = this.getWeatherLabel();
            document.getElementById('hud-fatigue').textContent = `${this.player.fatigue}%`;

            const teamNames = (this.player.team || []).map(id => this.recruitableNPCs[id]?.name || id);
            document.getElementById('hud-team').textContent = teamNames.length ? teamNames.join(', ') : 'Solo';

            const rep = (this.player.reputation && this.player.reputation[this.player.location]) || 0;
            document.getElementById('hud-rep').textContent = `${rep} (${this.getReputationTier(this.player.location)})`;

            const events = this.getUpcomingEvents(7);
            const eventsDiv = document.getElementById('hud-events');
            if (events.length === 0) {
                eventsDiv.textContent = '• Ninguno';
            } else {
                eventsDiv.innerHTML = events.map(e => `• ${e}`).join('<br>');
            }

            const desertBtn = document.getElementById('desert-btn');
            if (desertBtn) {
                const canDesert = !this.player.isRenegade && this.player.level >= 5 && this.player.location === 'konoha';
                desertBtn.style.display = canDesert ? 'inline-flex' : 'none';
            }

            const renegadeBox = document.getElementById('renegade-box');
            if (renegadeBox) {
                renegadeBox.style.display = this.player.isRenegade ? 'block' : 'none';
            }
            const wantedEl = document.getElementById('hud-wanted');
            if (wantedEl) wantedEl.textContent = `${this.player.renegadeLevel || 0}★`;
            const bountyEl = document.getElementById('hud-bounty');
            if (bountyEl) bountyEl.textContent = `${(this.player.bounty || 0).toLocaleString('es-ES')} Ryo`;
            const orgEl = document.getElementById('hud-org');
            if (orgEl) orgEl.textContent = this.player.organization ? this.player.organization : '—';
            const anbuNextEl = document.getElementById('hud-anbu-next');
            if (anbuNextEl) anbuNextEl.textContent = `${Math.max(0, this.player.anbuTimerDays || 0)}`;

            this.populateTravelDestinations();
            this.renderRecruitPanel();
        },

        getUpcomingEvents(daysAhead) {
            const events = [];

            // Copia ligera del calendario
            let d = this.player.day;
            let m = this.player.month;
            let y = this.player.year;
            let loc = this.player.location;

            for (let i = 0; i <= daysAhead; i++) {
                const temp = { ...this.player, day: d, month: m, year: y, location: loc };

                // Festival
                if (temp.location === 'konoha' && temp.month === 5 && temp.day === 15) {
                    const inDays = i;
                    events.push(`Festival de Konoha (${inDays} día${inDays === 1 ? '' : 's'})`);
                }

                // Luna llena
                if (temp.day === 15) {
                    const inDays = i;
                    events.push(`Luna Llena (${inDays} día${inDays === 1 ? '' : 's'})`);
                }

                // Examen
                if (temp.location === 'konoha' && temp.day === 1 && (temp.month === 1 || temp.month === 7)) {
                    const inDays = i;
                    events.push(`Examen Chunin (${inDays} día${inDays === 1 ? '' : 's'})`);
                }

                // Torneo
                if (temp.location === 'konoha' && temp.day === 30) {
                    const inDays = i;
                    events.push(`Torneo de la Aldea (${inDays} día${inDays === 1 ? '' : 's'})`);
                }

                // avanzar 1 día
                d += 1;
                if (d > this.daysPerMonth) {
                    d = 1;
                    m += 1;
                    if (m > this.monthsPerYear) {
                        m = 1;
                        y += 1;
                    }
                }
            }

            // Urgente
            if (this.player.urgentMission) {
                const turnsLeft = this.player.urgentMission.turnsLeft;
                const daysLeft = Math.ceil(turnsLeft / this.turnsPerDay);
                events.unshift(`🚨 Urgente: ${this.player.urgentMission.name} (${daysLeft} días)`);
            }

            // Mercado negro
            if (this.player.blackMarketToday) {
                events.unshift('🕶️ Mercado Negro (hoy)');
            }

            // Maestro visitante
            if (this.player.visitingMasterToday) {
                events.unshift('👤 Maestro visitante (hoy: 1 jutsu gratis)');
            }

            return events.slice(0, 4);
        },

        // -----------------------------
        // Exámenes (Chunin / Jonin)
        // -----------------------------
        getAbsoluteDay(p = this.player) {
            // 30 días por mes, 12 meses por año
            return (p.year * this.monthsPerYear * this.daysPerMonth)
                + ((p.month - 1) * this.daysPerMonth)
                + (p.day - 1);
        },

        getAbsoluteDayForDate(year, month, day) {
            return (year * this.monthsPerYear * this.daysPerMonth)
                + ((month - 1) * this.daysPerMonth)
                + (day - 1);
        },

        getNextExamAbsoluteDay(currentAbs) {
            const y = this.player.year;
            const a = this.getAbsoluteDayForDate(y, 1, 1);
            const b = this.getAbsoluteDayForDate(y, 7, 1);
            if (currentAbs <= a) return a;
            if (currentAbs <= b) return b;
            // próximo año
            return this.getAbsoluteDayForDate(y + 1, 1, 1);
        },

        getExamTypeForRank(rank) {
            if (rank === 'Genin') return 'chunin';
            if (rank === 'Chunin') return 'jonin';
            return null;
        },

        isExamDay() {
            return this.player.location === 'konoha' && this.player.day === 1 && (this.player.month === 1 || this.player.month === 7);
        },

        getExamTitle(type) {
            return type === 'jonin' ? 'Examen Jonin' : 'Examen Chunin';
        },

        showExamCountdown() {
            const el = document.getElementById('exam-widget');
            if (!el || !this.player) return;

            const type = this.getExamTypeForRank(this.player.rank);
            if (!type) {
                el.innerHTML = '<div style="opacity:0.8;">📅 PRÓXIMO EXAMEN: <b>—</b> (ya eres Jonin o superior)</div>';
                return;
            }

            const nowAbs = this.getAbsoluteDay();
            const nextAbs = this.getNextExamAbsoluteDay(nowAbs);
            const daysLeft = Math.max(0, nextAbs - nowAbs);

            const cooldownUntil = this.player.examCooldowns?.[type] || 0;
            const cooldownLeft = Math.max(0, cooldownUntil - nowAbs);

            const title = this.getExamTitle(type);
            const today = this.isExamDay();
            const canAttemptToday = today && cooldownLeft === 0;

            const timeText = cooldownLeft > 0
                ? `Próximo intento en ${cooldownLeft} día(s)`
                : (daysLeft === 0 ? 'HOY' : `En ${daysLeft} día(s)`);

            el.innerHTML = `
                <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px; flex-wrap:wrap;">
                    <div>
                        <div style="color: var(--gold); font-weight:bold;">📅 PRÓXIMO EXAMEN</div>
                        <div style="margin-top:4px;"><b>${title}</b></div>
                        <div style="margin-top:4px; opacity:0.9;">⏰ ${timeText}</div>
                    </div>
                    <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center;">
                        <button class="btn btn-small btn-secondary" onclick="game.showExamRequirements()">Ver Requisitos</button>
                        <button class="btn btn-small" ${canAttemptToday ? '' : 'disabled'} onclick="game.enrollInExam()">Inscribirse</button>
                    </div>
                </div>
            `;
        },

        showExamRequirements() {
            if (!this.player) return;
            const type = this.getExamTypeForRank(this.player.rank);
            if (!type) {
                alert('No tienes exámenes pendientes.');
                return;
            }

            if (type === 'chunin') {
                alert(
                    '📜 Requisitos Examen Chunin\n\n' +
                    '- Rango: Genin\n' +
                    '- 2 misiones rango A completadas\n' +
                    '- 2 misiones rango B completadas\n' +
                    '- 2000 Ryo (inscripción)\n' +
                    '- No haber fallado en los últimos 180 días\n'
                );
            } else {
                alert(
                    '📜 Requisitos Examen Jonin\n\n' +
                    '- Rango: Chunin\n' +
                    '- 5 misiones rango S completadas (siendo Chunin)\n' +
                    '- 8000 Ryo (inscripción)\n' +
                    '- No haber fallado en los últimos 180 días\n'
                );
            }
        },

        checkExamDay() {
            if (!this.player) return;
            const type = this.getExamTypeForRank(this.player.rank);
            if (!type) return;

            const nowAbs = this.getAbsoluteDay();
            const nextAbs = this.getNextExamAbsoluteDay(nowAbs);
            const daysLeft = Math.max(0, nextAbs - nowAbs);

            // Notificaciones: 30/14/7/3/1 y HOY
            const notifyDays = new Set([30, 14, 7, 3, 1, 0]);
            if (notifyDays.has(daysLeft) && this.player.lastExamNoticeAbsDay !== nowAbs) {
                this.player.lastExamNoticeAbsDay = nowAbs;
                const title = this.getExamTitle(type);
                if (daysLeft === 0) alert(`🎯 ¡HOY es el ${title}! Ve a la Aldea y presiona “Inscribirse”.`);
                else alert(`📅 ${title}: faltan ${daysLeft} día(s).`);
                this.saveGame();
            }
        },

        enrollInExam() {
            if (!this.player) return;
            const type = this.getExamTypeForRank(this.player.rank);
            if (!type) {
                alert('No tienes exámenes pendientes.');
                return;
            }
            if (!this.isExamDay()) {
                alert('Hoy no es día de examen.');
                return;
            }

            const nowAbs = this.getAbsoluteDay();
            const cooldownUntil = this.player.examCooldowns?.[type] || 0;
            if (cooldownUntil > nowAbs) {
                alert(`Aún no puedes intentarlo. Próximo intento en ${cooldownUntil - nowAbs} día(s).`);
                return;
            }

            const ok = this.checkExamRequirements(type, true);
            if (!ok) return;

            this.player.examState = { active: true, type, phase: 'intro', data: {} };
            this.saveGame();
            if (type === 'chunin') this.startChuninExam();
            else this.startJoninExam();
        },

        checkExamRequirements(type, chargeFee = false) {
            const byRank = this.player.missionsCompletedByRank || { D: 0, C: 0, B: 0, A: 0, S: 0 };

            if (type === 'chunin') {
                if (this.player.rank !== 'Genin') return alert('Solo Genin puede intentar el examen Chunin.'), false;
                if ((byRank.A || 0) < 2) return alert('Requiere 2 misiones rango A completadas.'), false;
                if ((byRank.B || 0) < 2) return alert('Requiere 2 misiones rango B completadas.'), false;
                if (this.player.ryo < 2000) return alert('Requiere 2000 Ryo para inscribirse.'), false;
                if (chargeFee) this.player.ryo -= 2000;
                return true;
            }

            if (this.player.rank !== 'Chunin') return alert('Solo Chunin puede intentar el examen Jonin.'), false;
            if ((this.player.missionsCompletedSWhileChunin || 0) < 5) return alert('Requiere 5 misiones rango S completadas.'), false;
            if (this.player.ryo < 8000) return alert('Requiere 8000 Ryo para inscribirse.'), false;
            if (chargeFee) this.player.ryo -= 8000;
            return true;
        },

        renderExamScreen(html) {
            this.showScreen('exam-screen');
            const el = document.getElementById('exam-content');
            if (el) el.innerHTML = html;
        },

        abandonExam() {
            if (!this.player?.examState?.active) {
                this.showScreen('village-screen');
                this.showSection('home');
                this.updateVillageUI();
                return;
            }
            const ok = confirm('¿Abandonar el examen? Perderás el intento (cooldown 180 días).');
            if (!ok) return;
            this.examFail('abandon');
        },

        startChuninExam() {
            if (!this.player?.examState) this.player.examState = { active: true, type: 'chunin', phase: 'intro', data: {} };
            this.player.examState.active = true;
            this.player.examState.type = 'chunin';
            if (!this.player.examState.phase) this.player.examState.phase = 'intro';
            this.renderExamFromState();
        },

        startJoninExam() {
            if (!this.player?.examState) this.player.examState = { active: true, type: 'jonin', phase: 'intro', data: {} };
            this.player.examState.active = true;
            this.player.examState.type = 'jonin';
            if (!this.player.examState.phase) this.player.examState.phase = 'intro';
            this.renderExamFromState();
        },

        renderExamFromState() {
            const st = this.player?.examState;
            if (!st?.active) return;

            if (st.type === 'chunin') {
                this.renderChuninExam();
            } else {
                this.renderJoninExam();
            }
        },

        getExamQuestionBank() {
            if (this.examQuestionBank) return this.examQuestionBank;
            this.examQuestionBank = [
                { q: 'Un equipo enemigo está en terreno alto y tú en terreno bajo. ¿Qué haces?', options: ['Atacar directamente', 'Retirarte y buscar ventaja', 'Usar Genjutsu', 'Rendirte'], correct: 1 },
                { q: 'Tu compañero está herido en misión. ¿Prioridad?', options: ['Completar la misión', 'Evacuar al compañero', 'Ambos por igual', 'Pedir refuerzos'], correct: 3 },
                { q: 'El enemigo usa clones para confundir. ¿Respuesta más segura?', options: ['Gastar todo el chakra', 'Buscar patrones y mantener distancia', 'Cerrar los ojos', 'Correr en línea recta'], correct: 1 },
                { q: 'Tu chakra se agota. ¿Qué decisión es mejor?', options: ['Seguir atacando', 'Defender y recuperar control', 'Ignorar dolor', 'Provocar al enemigo'], correct: 1 },
                { q: 'Una emboscada en un puente estrecho. ¿Qué haces primero?', options: ['Cargar', 'Explorar rutas alternas', 'Gritar', 'Separarte del equipo'], correct: 1 },
                { q: '¿Qué es más importante para un líder de escuadrón?', options: ['Ganar siempre', 'Comunicación y coordinación', 'Ser el más fuerte', 'Nunca retirarse'], correct: 1 },
                { q: 'El enemigo usa un elemento superior al tuyo. ¿Qué conviene?', options: ['Forzar choque frontal', 'Cambiar táctica y explotar debilidades', 'Gastar tus items ya', 'Aceptar derrota'], correct: 1 },
                { q: 'Te piden elegir entre dos objetivos. ¿Cuál regla general aplica?', options: ['Elegir el más fácil', 'Elegir el de mayor impacto', 'Elegir al azar', 'Elegir el más popular'], correct: 1 },
                { q: 'En combate largo, ¿qué recurso es clave administrar?', options: ['Ryo', 'Chakra', 'Peinados', 'Rumores'], correct: 1 },
                { q: '¿Cuál es la mejor manera de evitar una trampa simple?', options: ['Ignorar señales', 'Observar y avanzar con cautela', 'Correr', 'Saltar sin mirar'], correct: 1 },
                // Pregunta trampa
                { q: 'Pregunta trampa: un examinador te mira fijo. ¿Qué haces?', options: ['Presiono y sigo', 'Me paralizo', 'Abandono el examen', 'Insulto al examinador'], trapPass: 2 }
            ];
            return this.examQuestionBank;
        },

        renderChuninExam() {
            const st = this.player.examState;
            const phase = st.phase;

            if (phase === 'intro') {
                this.renderExamScreen(`
                    <div class="story-text">
                        <p>Has llegado al Centro de Misiones. Los examinadores te reciben en silencio.</p>
                        <p style="margin-top:10px;">El Examen Chunin consta de 3 fases: escrito, Bosque de la Muerte y torneo final.</p>
                    </div>
                    <div style="text-align:center; margin-top: 14px;">
                        <button class="btn" onclick="game.examWrittenTestStart()">Iniciar Fase 1 (Escrito)</button>
                    </div>
                `);
                return;
            }

            if (phase === 'written') {
                this.renderExamWrittenQuestion();
                return;
            }

            if (phase === 'forest_intro') {
                this.renderExamScreen(`
                    <div class="story-text">
                        <p><b>FASE 2: Bosque de la Muerte</b></p>
                        <p>3 combates seguidos. Tu HP y Chakra no se recuperan entre combates.</p>
                        <p style="margin-top:8px;">Después de cada combate podrás usar 1 item del inventario.</p>
                    </div>
                    <div style="text-align:center; margin-top: 14px;">
                        <button class="btn" onclick="game.examForestStartFight()">Iniciar Combate 1</button>
                    </div>
                `);
                return;
            }

            if (phase === 'forest_between') {
                const idx = st.data?.forestIndex ?? 0;
                this.renderExamScreen(`
                    <div class="story-text">
                        <p><b>Intermedio</b> — Puedes usar 1 item antes del siguiente combate.</p>
                    </div>
                    <div style="margin-top:12px;">
                        <button class="btn btn-small" onclick="game.examUseItemPrompt()">Usar item</button>
                        <button class="btn" style="margin-left:8px;" onclick="game.examForestStartFight()">Continuar (Combate ${idx + 1})</button>
                    </div>
                `);
                return;
            }

            if (phase === 'tournament_intro') {
                this.renderExamScreen(`
                    <div class="story-text">
                        <p><b>FASE 3: Torneo Final</b></p>
                        <p>1 vs 1 contra un rival aleatorio. Si pierdes, el Comité puede promoverte igualmente.</p>
                    </div>
                    <div style="text-align:center; margin-top: 14px;">
                        <button class="btn" onclick="game.examTournamentStart()">Entrar al Torneo</button>
                    </div>
                `);
                return;
            }

            if (phase === 'tournament') {
                // En combate ahora.
                this.renderExamScreen('<div class="story-text">Preparando el combate del torneo...</div>');
                return;
            }
        },

        examWrittenTestStart() {
            const bank = this.getExamQuestionBank();
            const indices = [...bank.keys()];
            // Mezclar
            for (let i = indices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [indices[i], indices[j]] = [indices[j], indices[i]];
            }
            // Tomar 4 normales + 1 trampa (si hay)
            const trapIdx = bank.findIndex(q => typeof q.trapPass === 'number');
            const chosen = indices.filter(i => i !== trapIdx).slice(0, 4);
            if (trapIdx >= 0) chosen.splice(Math.floor(Math.random() * (chosen.length + 1)), 0, trapIdx);

            this.player.examState.phase = 'written';
            this.player.examState.data = { order: chosen, pos: 0, correct: 0 };
            this.saveGame();
            this.renderExamWrittenQuestion();
        },

        renderExamWrittenQuestion() {
            const st = this.player.examState;
            const bank = this.getExamQuestionBank();
            const order = st.data?.order || [];
            const pos = st.data?.pos || 0;
            const correct = st.data?.correct || 0;
            const qObj = bank[order[pos]];

            if (!qObj) {
                this.examFail('written');
                return;
            }

            const renderOptions = (qObj.options || []).map((opt, idx) => {
                return `<button class="btn btn-small" style="width:100%; margin:6px 0;" onclick="game.examWrittenAnswer(${idx})">${String.fromCharCode(65 + idx)}) ${opt}</button>`;
            }).join('');

            this.renderExamScreen(`
                <div class="story-text">
                    <p><b>FASE 1: Examen Escrito</b></p>
                    <p>Pregunta ${pos + 1}/5 • Correctas: ${correct}</p>
                </div>
                <div style="margin-top:12px;">
                    <div style="font-weight:bold; margin-bottom:10px;">${qObj.q}</div>
                    <div class="progress-bar" style="height:14px;"><div id="exam-timer-fill" class="progress-fill" style="width:100%"></div></div>
                    <div style="margin-top:10px;">${renderOptions}</div>
                </div>
            `);

            this.startExamTimer(10, () => this.examWrittenAnswer(null));
        },

        startExamTimer(seconds, onExpire) {
            if (this.examTimerId) {
                clearInterval(this.examTimerId);
                this.examTimerId = null;
            }

            const start = Date.now();
            const totalMs = seconds * 1000;
            const fill = document.getElementById('exam-timer-fill');

            this.examTimerId = setInterval(() => {
                const elapsed = Date.now() - start;
                const pct = Math.max(0, 1 - (elapsed / totalMs));
                if (fill) fill.style.width = `${Math.floor(pct * 100)}%`;
                if (elapsed >= totalMs) {
                    clearInterval(this.examTimerId);
                    this.examTimerId = null;
                    onExpire();
                }
            }, 100);
        },

        examWrittenAnswer(choiceIndex) {
            const st = this.player.examState;
            if (!st || st.phase !== 'written') return;

            if (this.examTimerId) {
                clearInterval(this.examTimerId);
                this.examTimerId = null;
            }

            const bank = this.getExamQuestionBank();
            const order = st.data?.order || [];
            const pos = st.data?.pos || 0;
            const qObj = bank[order[pos]];
            if (!qObj) return;

            // Trampa: si abandonas, pasas.
            if (typeof qObj.trapPass === 'number' && choiceIndex === qObj.trapPass) {
                st.phase = 'forest_intro';
                st.data = { forestIndex: 0 };
                this.saveGame();
                alert('🎭 Pregunta trampa: tu decisión fue evaluada. Avanzas a la siguiente fase.');
                this.renderExamFromState();
                return;
            }

            const correctIdx = qObj.correct;
            if (typeof choiceIndex === 'number' && choiceIndex === correctIdx) {
                st.data.correct = (st.data.correct || 0) + 1;
            }

            st.data.pos = (st.data.pos || 0) + 1;

            if (st.data.pos >= 5) {
                if ((st.data.correct || 0) >= 3) {
                    st.phase = 'forest_intro';
                    st.data = { forestIndex: 0 };
                    this.saveGame();
                    this.renderExamFromState();
                } else {
                    this.examFail('written');
                }
                return;
            }

            this.saveGame();
            this.renderExamWrittenQuestion();
        },

        getChuninForestFights() {
            return [
                // Combate 1: 2x Genin fuerte
                [
                    { name: 'Genin Fuerte', hp: 100, chakra: 60, attack: 18, defense: 12, accuracy: 14, genjutsu: 8, exp: 0, ryo: 0 },
                    { name: 'Genin Fuerte', hp: 100, chakra: 60, attack: 18, defense: 12, accuracy: 14, genjutsu: 8, exp: 0, ryo: 0 }
                ],
                // Combate 2: 1x Chunin
                [
                    { name: 'Ninja Chunin', hp: 180, chakra: 120, attack: 25, defense: 18, accuracy: 16, genjutsu: 10, exp: 0, ryo: 0 }
                ],
                // Combate 3: 1x Jonin examinador
                [
                    { name: 'Jōnin Examinador', hp: 250, chakra: 160, attack: 32, defense: 22, accuracy: 18, genjutsu: 14, exp: 0, ryo: 0 }
                ]
            ];
        },

        examForestStartFight() {
            const st = this.player.examState;
            const fights = this.getChuninForestFights();
            const idx = st.data?.forestIndex ?? 0;
            const enemies = fights[idx];
            if (!enemies) {
                st.phase = 'tournament_intro';
                st.data = {};
                this.saveGame();
                this.renderExamFromState();
                return;
            }

            st.phase = 'forest_fight';
            this.saveGame();
            this.startExamFight(enemies, { examType: 'chunin', examPhase: 'forest', noBetweenHeal: true });
        },

        examUseItemPrompt() {
            if (!Array.isArray(this.player.inventory) || this.player.inventory.length === 0) {
                alert('No tienes items.');
                return;
            }
            const options = this.player.inventory.map((it, idx) => `${idx + 1}) ${it.name}`).join('\n');
            const pick = prompt(`Elige un item para usar (número):\n${options}`);
            const idx = Number(pick) - 1;
            if (!Number.isFinite(idx) || idx < 0 || idx >= this.player.inventory.length) return;
            const item = this.player.inventory[idx];
            // aplicar
            if (item.effect?.hp) this.player.hp = Math.min(this.player.maxHp, this.player.hp + item.effect.hp);
            if (item.effect?.chakra) this.player.chakra = Math.min(this.player.maxChakra, this.player.chakra + item.effect.chakra);
            this.player.inventory.splice(idx, 1);
            this.saveGame();
            alert('Item usado.');
            this.renderExamFromState();
        },

        getExamRivals() {
            // 10 rivales base
            return [
                { name: 'Hayato', clan: 'Inuzuka', level: 5, stats: { hp: 210, chakra: 120, attack: 26, defense: 16, accuracy: 16, genjutsu: 8 } },
                { name: 'Reika', clan: 'Nara', level: 5, stats: { hp: 190, chakra: 150, attack: 22, defense: 16, accuracy: 17, genjutsu: 14 } },
                { name: 'Torune', clan: 'Aburame', level: 6, stats: { hp: 220, chakra: 140, attack: 24, defense: 18, accuracy: 16, genjutsu: 12 } },
                { name: 'Satsuki', clan: 'Yamanaka', level: 5, stats: { hp: 190, chakra: 160, attack: 21, defense: 15, accuracy: 18, genjutsu: 15 } },
                { name: 'Gengo', clan: 'Akimichi', level: 6, stats: { hp: 240, chakra: 120, attack: 28, defense: 18, accuracy: 15, genjutsu: 8 } },
                { name: 'Mika', clan: 'Sarutobi', level: 6, stats: { hp: 210, chakra: 160, attack: 25, defense: 17, accuracy: 17, genjutsu: 10 } },
                { name: 'Ren', clan: 'Hatake', level: 6, stats: { hp: 210, chakra: 170, attack: 26, defense: 18, accuracy: 18, genjutsu: 10 } },
                { name: 'Kaede', clan: 'Hyuga', level: 5, stats: { hp: 200, chakra: 140, attack: 25, defense: 18, accuracy: 17, genjutsu: 10 } },
                { name: 'Shiro', clan: 'Inuzuka', level: 6, stats: { hp: 230, chakra: 120, attack: 27, defense: 17, accuracy: 16, genjutsu: 8 } },
                { name: 'Aoi', clan: 'Uchiha', level: 6, stats: { hp: 210, chakra: 170, attack: 25, defense: 17, accuracy: 18, genjutsu: 14 } }
            ];
        },

        examTournamentStart() {
            const st = this.player.examState;
            const pool = this.getExamRivals();
            const pick = pool[Math.floor(Math.random() * pool.length)];
            st.phase = 'tournament';
            st.data = { rival: pick };
            this.saveGame();

            const s = pick.stats;
            const enemy = { name: `${pick.name} (${pick.clan})`, hp: s.hp, chakra: s.chakra, attack: s.attack, defense: s.defense, accuracy: s.accuracy, genjutsu: s.genjutsu, exp: 0, ryo: 0 };
            this.startExamFight([enemy], { examType: 'chunin', examPhase: 'tournament' });
        },

        renderJoninExam() {
            const st = this.player.examState;
            const phase = st.phase;

            if (phase === 'intro') {
                this.renderExamScreen(`
                    <div class="story-text">
                        <p>Los examinadores te observan. La vara para Jonin es cruel.</p>
                        <p style="margin-top:10px;">Pruebas: misión en campo, combate de élite y liderazgo.</p>
                    </div>
                    <div style="text-align:center; margin-top: 14px;">
                        <button class="btn" onclick="game.joninTest1Start()">Iniciar Prueba 1</button>
                    </div>
                `);
                return;
            }

            if (phase === 'between') {
                this.renderExamScreen(`
                    <div class="story-text"><p>Puedes usar 1 item antes de la siguiente prueba.</p></div>
                    <div style="margin-top:12px;">
                        <button class="btn btn-small" onclick="game.examUseItemPrompt()">Usar item</button>
                        <button class="btn" style="margin-left:8px;" onclick="game.joninNextTest()">Continuar</button>
                    </div>
                `);
                return;
            }

            this.renderExamScreen('<div class="story-text">Preparando prueba...</div>');
        },

        joninTest1Start() {
            const st = this.player.examState;
            st.phase = 'jonin_test1';
            st.data = { step: 0 };
            this.saveGame();

            const enemies = [
                { name: 'Jōnin de Campo', hp: 260, chakra: 170, attack: 34, defense: 22, accuracy: 18, genjutsu: 14, exp: 0, ryo: 0 },
                { name: 'Jōnin de Campo', hp: 260, chakra: 170, attack: 34, defense: 22, accuracy: 18, genjutsu: 14, exp: 0, ryo: 0 },
                { name: 'Jōnin Veterano', hp: 320, chakra: 220, attack: 38, defense: 26, accuracy: 18, genjutsu: 16, exp: 0, ryo: 0 }
            ];

            this.startExamFight(enemies, { examType: 'jonin', examPhase: 'test1', noBetweenHeal: true });
        },

        joninNextTest() {
            const st = this.player.examState;
            if (st.phase === 'between' && st.data?.next === 'test2') {
                this.joninTest2Start();
                return;
            }
            if (st.phase === 'between' && st.data?.next === 'test3') {
                this.joninTest3Start();
                return;
            }
        },

        joninTest2Start() {
            const st = this.player.examState;
            st.phase = 'jonin_test2';
            st.data = {};
            this.saveGame();

            // Simulación de 2 vs 1: enemigo con doble ataque.
            const enemy = {
                name: 'Dúo Jōnin (2 vs 1)',
                hp: 520,
                chakra: 300,
                attack: 28,
                defense: 24,
                accuracy: 18,
                genjutsu: 14,
                exp: 0,
                ryo: 0,
                doubleAttack: {
                    attacks: [
                        { attack: 34, accuracy: 18 },
                        { attack: 34, accuracy: 18 }
                    ]
                }
            };
            this.startExamFight([enemy], { examType: 'jonin', examPhase: 'test2' });
        },

        joninTest3Start() {
            const st = this.player.examState;
            st.phase = 'jonin_test3';
            st.data = { allies: [
                { name: 'Genin A', hp: 120, maxHp: 120 },
                { name: 'Genin B', hp: 120, maxHp: 120 }
            ] };
            this.saveGame();

            const enemies = [
                { name: 'Bandido Élite', hp: 240, chakra: 120, attack: 30, defense: 20, accuracy: 16, genjutsu: 10, exp: 0, ryo: 0 },
                { name: 'Bandido Élite', hp: 240, chakra: 120, attack: 30, defense: 20, accuracy: 16, genjutsu: 10, exp: 0, ryo: 0 },
                { name: 'Jōnin Hostil', hp: 320, chakra: 180, attack: 36, defense: 24, accuracy: 18, genjutsu: 12, exp: 0, ryo: 0 }
            ];
            this.startExamFight(enemies, { examType: 'jonin', examPhase: 'test3', protectAllies: true, noBetweenHeal: true });
        },

        startExamFight(enemies, opts = {}) {
            // Prepara un combate que NO termina en pantalla de victoria/derrota normal
            const list = Array.isArray(enemies) ? enemies : [];
            if (list.length === 0) {
                this.examFail('combat');
                return;
            }

            this.currentMission = {
                name: '🎯 Examen Ninja',
                rank: 'EX',
                description: 'Combate de examen.',
                enemies: [],
                ryo: 0,
                exp: 0,
                turns: 0,
                isExamFight: true,
                examMeta: {
                    examType: opts.examType || this.player.examState?.type,
                    examPhase: opts.examPhase || this.player.examState?.phase,
                    noBetweenHeal: !!opts.noBetweenHeal,
                    protectAllies: !!opts.protectAllies
                }
            };

            this.enemyQueue = list.slice(1).map(e => ({ ...e, maxHp: e.hp, maxChakra: e.chakra, controlledTurns: 0 }));
            const first = list[0];
            this.totalWaves = list.length;
            this.currentWave = 1;
            this.currentEnemy = { ...first, maxHp: first.hp, maxChakra: first.chakra, controlledTurns: 0 };

            this.showScreen('combat-screen');
            this.startCombat();
        },

        handleExamFightVictory() {
            // limpiar estado de combate
            this.currentEnemy = null;
            this.enemyQueue = [];
            this.totalWaves = 0;
            this.currentWave = 0;

            const st = this.player.examState;
            if (!st?.active) {
                this.currentMission = null;
                this.showScreen('village-screen');
                this.showSection('home');
                this.updateVillageUI();
                return;
            }

            if (st.type === 'chunin') {
                if (st.phase === 'forest_fight') {
                    st.data.forestIndex = (st.data.forestIndex ?? 0) + 1;
                    if (st.data.forestIndex >= this.getChuninForestFights().length) {
                        st.phase = 'tournament_intro';
                        st.data = {};
                    } else {
                        st.phase = 'forest_between';
                    }
                    this.saveGame();
                    this.renderExamFromState();
                    return;
                }

                if (st.phase === 'tournament') {
                    this.examPass('chunin');
                    return;
                }
            }

            if (st.type === 'jonin') {
                if (st.phase === 'jonin_test1') {
                    st.phase = 'between';
                    st.data = { next: 'test2' };
                    this.saveGame();
                    this.renderExamFromState();
                    return;
                }
                if (st.phase === 'jonin_test2') {
                    st.phase = 'between';
                    st.data = { next: 'test3' };
                    this.saveGame();
                    this.renderExamFromState();
                    return;
                }
                if (st.phase === 'jonin_test3') {
                    this.examPass('jonin');
                    return;
                }
            }

            // fallback
            this.examFail('unknown');
        },

        handleExamFightDefeat() {
            // limpiar estado de combate
            this.currentEnemy = null;
            this.enemyQueue = [];
            this.totalWaves = 0;
            this.currentWave = 0;

            const st = this.player.examState;
            if (!st?.active) {
                this.currentMission = null;
                this.showScreen('village-screen');
                this.showSection('home');
                this.updateVillageUI();
                return;
            }

            if (st.type === 'chunin' && st.phase === 'tournament') {
                const roll = this.rollDice(20);
                if (roll >= 12) {
                    alert(`📜 Comité: tirada D20=${roll}. Deciden promoverte igualmente.`);
                    this.examPass('chunin');
                    return;
                }
                alert(`📜 Comité: tirada D20=${roll}. No hay promoción.`);
                this.examFail('tournament');
                return;
            }

            this.examFail('combat');
        },

        examPass(type) {
            if (!this.player) return;
            this.currentMission = null;
            this.player.hp = this.player.maxHp;
            this.player.chakra = this.player.maxChakra;
            if (type === 'chunin') {
                this.player.rank = 'Chunin';
                alert('🎉 ¡Aprobaste el Examen Chunin!');
            } else {
                this.player.rank = 'Jonin';
                alert('🎉 ¡Aprobaste el Examen Jonin!');
            }
            this.player.examState = null;
            this.saveGame();
            this.showScreen('village-screen');
            this.showSection('home');
            this.updateVillageUI();
            this.showMissions();
        },

        examFail(reason) {
            if (!this.player) return;
            this.currentMission = null;
            this.player.hp = this.player.maxHp;
            this.player.chakra = this.player.maxChakra;
            const type = this.player.examState?.type || this.getExamTypeForRank(this.player.rank) || 'chunin';
            const nowAbs = this.getAbsoluteDay();
            this.player.examCooldowns = this.player.examCooldowns || { chunin: 0, jonin: 0 };
            this.player.examCooldowns[type] = nowAbs + 180;
            this.player.examState = null;
            this.saveGame();
            alert('Has fallado el examen. Entrena más y vuelve a intentarlo (180 días).');
            this.showScreen('village-screen');
            this.showSection('home');
            this.updateVillageUI();
            this.showMissions();
        },

        activateVillageTab(tabName) {
            // Tabs principales del village (misiones/academia/tienda/entrenamiento/stats)
            const village = document.getElementById('village-screen');
            if (!village) return;

            // Activar contenido
            village.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            const activeContent = document.getElementById(tabName + '-tab');
            if (activeContent) activeContent.classList.add('active');

            // Activar botón por onclick
            village.querySelectorAll('.tabs .tab-btn').forEach(btn => {
                const oc = btn.getAttribute('onclick') || '';
                if (oc.includes(`showTab('${tabName}')`)) btn.classList.add('active');
                else if (oc.includes("showTab('")) btn.classList.remove('active');
            });

            if (tabName === 'missions') this.showMissions();
            else if (tabName === 'npcs') this.showNPCList();
            else if (tabName === 'academy') this.showAcademy('genin');
            else if (tabName === 'shop') this.showShop();
            else if (tabName === 'training') this.showTraining();
            else if (tabName === 'stats') this.showStats();
        },

        showSection(name) {
            console.log('showSection called with:', name);
            
            // Quitar clase active de todas las secciones
            document.querySelectorAll('.section-content').forEach(s => {
                s.classList.remove('active');
            });
            
            // Quitar clase active de botones de sidebar
            document.querySelectorAll('#sidebar .sidebar-nav-item').forEach(b => b.classList.remove('active'));
            
            // Quitar clase active de botones de bottom-nav
            document.querySelectorAll('#bottom-nav .nav-btn').forEach(b => b.classList.remove('active'));
            
            // Activar la sección target
            const target = document.getElementById('section-' + name);
            console.log('Target element:', target);
            
            if (target) {
                target.classList.add('active');
                console.log('Section activated:', name, target.classList);
            } else {
                console.error('Section not found: section-' + name);
                return;
            }
            
            // Activar botón del sidebar
            const sidebarBtn = document.querySelector(`#sidebar [data-section="${name}"]`);
            if (sidebarBtn) sidebarBtn.classList.add('active');
            
            // Activar botón del bottom-nav
            const bottomNavBtn = document.querySelector(`#bottom-nav [data-tab="${name}"]`);
            if (bottomNavBtn) bottomNavBtn.classList.add('active');

            // Actualizar header y sidebar
            this.updateHeader();
            this.updateSidebarStats();

            // Acciones específicas por sección
            if (name === 'home') {
                this.updateVillageUI();
            } else if (name === 'world') {
                this.updateWorldHUDDisplay();
                this.showMissions();
            } else if (name === 'inventory') {
                this.showAcademy('genin');
                this.showTraining();
            } else if (name === 'shop') {
                console.log('Calling showShop');
                this.showShop();
                this.updateShopRyoDisplay();
            } else if (name === 'statspage') {
                console.log('Calling showStats');
                this.showStats();
            }
        },

        // ============================================
        // SIDEBAR NAVIGATION
        // ============================================
        toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebar-overlay');
            if (sidebar && overlay) {
                sidebar.classList.toggle('open');
                overlay.classList.toggle('active');
            }
        },

        closeSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebar-overlay');
            if (sidebar) sidebar.classList.remove('open');
            if (overlay) overlay.classList.remove('active');
        },

        navigateFromSidebar(section) {
            this.closeSidebar();
            this.showSection(section);
        },

        updateSidebarStats() {
            if (!this.player) return;
            const rankEl = document.getElementById('sidebar-rank');
            const levelEl = document.getElementById('sidebar-level');
            const ryoEl = document.getElementById('sidebar-ryo');
            
            if (rankEl) rankEl.textContent = this.player.rank || 'Genin';
            if (levelEl) levelEl.textContent = this.player.level || 1;
            if (ryoEl) ryoEl.textContent = this.player.ryo || 0;
        },

        updateHeader() {
            if (!this.player) return;
            
            const nameEl = document.getElementById('header-name');
            const ryoEl = document.getElementById('header-ryo');
            const hpFill = document.getElementById('header-hp-fill');
            const chakraFill = document.getElementById('header-chakra-fill');
            
            if (nameEl) nameEl.textContent = `👤 ${this.player.name || 'Ninja'}`;
            if (ryoEl) ryoEl.textContent = `💰 ${this.player.ryo || 0}`;
            
            if (hpFill) {
                const hpPct = Math.min(100, Math.max(0, (this.player.hp / this.player.maxHp) * 100));
                hpFill.style.width = hpPct + '%';
            }
            
            if (chakraFill) {
                const chakraPct = Math.min(100, Math.max(0, (this.player.chakra / this.player.maxChakra) * 100));
                chakraFill.style.width = chakraPct + '%';
            }
        },

        updateWorldHUDDisplay() {
            const display = document.getElementById('world-hud-display');
            if (!display || !this.player) return;

            const timeOfDay = this.getTimeOfDayLabel();
            const season = this.player.season || 'primavera';
            const weather = this.player.weather || 'soleado';
            const fatigue = this.player.fatigue || 0;
            const fatiguePercent = Math.min(100, (fatigue / 100) * 100);

            let html = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px;">
                        <div style="color: #ffd700; font-size: 0.85em; margin-bottom: 4px;">📅 Fecha</div>
                        <div>${this.player.day} ${this.getMonthName(this.player.month)}, Año ${this.player.year}</div>
                    </div>
                    <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px;">
                        <div style="color: #ffd700; font-size: 0.85em; margin-bottom: 4px;">🕐 Hora</div>
                        <div>${timeOfDay}</div>
                    </div>
                    <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px;">
                        <div style="color: #ffd700; font-size: 0.85em; margin-bottom: 4px;">🌸 Estación</div>
                        <div>${season.charAt(0).toUpperCase() + season.slice(1)}</div>
                    </div>
                    <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px;">
                        <div style="color: #ffd700; font-size: 0.85em; margin-bottom: 4px;">☀️ Clima</div>
                        <div>${weather.charAt(0).toUpperCase() + weather.slice(1)}</div>
                    </div>
                </div>
            `;

            if (fatigue > 0) {
                html += `
                    <div style="margin-top: 12px; background: rgba(192, 57, 43, 0.2); padding: 10px; border-radius: 8px; border-left: 3px solid #e74c3c;">
                        <div style="color: #ff7f66; font-size: 0.85em; margin-bottom: 6px;">😰 Fatiga</div>
                        <div style="background: rgba(0,0,0,0.4); height: 8px; border-radius: 4px; overflow: hidden;">
                            <div style="background: linear-gradient(90deg, #e74c3c, #c0392b); height: 100%; width: ${fatiguePercent}%;"></div>
                        </div>
                        <div style="text-align: right; font-size: 0.8em; margin-top: 4px;">${fatigue}/100</div>
                    </div>
                `;
            }

            if (this.player.sleepState) {
                html += `
                    <div style="margin-top: 12px; background: rgba(52, 152, 219, 0.2); padding: 10px; border-radius: 8px; border-left: 3px solid #3498db;">
                        <div style="color: #5dade2;">💤 Descansando...</div>
                    </div>
                `;
            }

            if (this.player.travelState) {
                const toLoc = this.locations[this.player.travelState.to];
                html += `
                    <div style="margin-top: 12px; background: rgba(46, 204, 113, 0.2); padding: 10px; border-radius: 8px; border-left: 3px solid #2ecc71;">
                        <div style="color: #58d68d;">🧳 Viajando a: ${toLoc?.name || 'Destino'}</div>
                        <div style="font-size: 0.85em; margin-top: 4px;">Días restantes: ${this.player.travelState.remainingDays}</div>
                    </div>
                `;
            }

            display.innerHTML = html;
        },

        getMonthName(month) {
            const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                           'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            return months[month - 1] || 'Mes';
        },

        updateShopRyoDisplay() {
            const ryoDisplay = document.getElementById('shop-ryo-display');
            if (ryoDisplay && this.player) {
                ryoDisplay.textContent = this.player.ryo || 0;
            }
        },

        // -----------------------------
        // NPCs / relaciones
        // -----------------------------
        getNpcRelationship(npcId) {
            if (!this.player?.npcRelations) this.player.npcRelations = {};
            return this.player.npcRelations[npcId] ?? 0;
        },

        getNpcRelationshipLevel(rel, npcId) {
            if (this.player?.npcRivals && this.player.npcRivals[npcId]) return 'Rival';
            if (rel <= -50) return 'Enemigo';
            if (rel >= 76) return 'Compañero';
            if (rel >= 51) return 'Mejor Amigo';
            if (rel >= 26) return 'Amigo';
            if (rel >= 1) return 'Conocido';
            return 'Desconocido';
        },

        updateRelationship(npcId, amount) {
            if (!this.player) return;
            const current = this.getNpcRelationship(npcId);
            const next = this.clamp(current + amount, -100, 100);
            this.player.npcRelations[npcId] = next;
            this.saveGame();
        },

        pickNpcDialogue(npc, relLevel) {
            const d = npc.dialogues || {};
            const pick = (arr) => Array.isArray(arr) && arr.length ? arr[Math.floor(Math.random() * arr.length)] : '';
            if (relLevel === 'Desconocido') return pick(d.first_meeting) || '...';
            if (relLevel === 'Enemigo') return pick(d.enemy) || pick(d.neutral) || '...';
            if (relLevel === 'Rival') return pick(d.rival) || pick(d.neutral) || '...';
            if (relLevel === 'Compañero' || relLevel === 'Mejor Amigo') return pick(d.best_friend) || pick(d.friendly) || pick(d.neutral) || '...';
            if (relLevel === 'Amigo') return pick(d.friendly) || pick(d.neutral) || '...';
            return pick(d.neutral) || '...';
        },

        showNPCList() {
            const listEl = document.getElementById('npc-list');
            const modal = document.getElementById('npc-modal');
            if (!listEl) return;
            if (modal) {
                modal.style.display = 'none';
                modal.innerHTML = '';
            }

            const npcs = this.npcs || {};
            const rows = Object.values(npcs).map(npc => {
                const rel = this.getNpcRelationship(npc.id);
                const level = this.getNpcRelationshipLevel(rel, npc.id);
                return `
                    <div class="npc-card" onclick="game.showNPCInteraction('${npc.id}')">
                        <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
                            <div style="font-weight:bold; color: var(--accent);">${npc.icon} ${npc.name}</div>
                            <div style="opacity:0.85;">${level}</div>
                        </div>
                        <div style="margin-top:8px; display:flex; align-items:center; justify-content:space-between; gap:10px;">
                            <div style="color: rgba(240,240,240,0.75);">Relación</div>
                            <div><b>${rel}</b></div>
                        </div>
                        <div style="margin-top:6px; color: rgba(240,240,240,0.75); font-size:0.9em;">${npc.village} • ${npc.rank}</div>
                    </div>
                `;
            });

            listEl.innerHTML = rows.join('');
        },

        showNPCInteraction(npcId) {
            const npc = (this.npcs || {})[npcId];
            const modal = document.getElementById('npc-modal');
            if (!npc || !modal) return;

            const rel = this.getNpcRelationship(npcId);
            const relLevel = this.getNpcRelationshipLevel(rel, npcId);
            const dialogue = this.pickNpcDialogue(npc, relLevel);

            modal.style.display = 'block';
            modal.innerHTML = `
                <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap;">
                    <div style="font-size:1.15em; font-weight:bold; color: var(--gold);">${npc.icon} ${npc.name}</div>
                    <div style="opacity:0.9;">${relLevel} • Relación: <b>${rel}</b></div>
                </div>
                <div style="margin-top:10px; color: rgba(240,240,240,0.85);">“${dialogue}”</div>
                <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap; justify-content:center;">
                    <button class="btn btn-small" onclick="game.talkToNPC('${npcId}')">Hablar</button>
                    <button class="btn btn-small" onclick="game.showNpcMissions('${npcId}')">Misión</button>
                    <button class="btn btn-small" onclick="game.showNpcTrainings('${npcId}')">Entrenar</button>
                    <button class="btn btn-small" onclick="game.giftNPC('${npcId}')">Regalo</button>
                    <button class="btn btn-small btn-secondary" onclick="game.friendlyBattle('${npcId}')">Combate amistoso</button>
                </div>
                <div id="npc-extra" style="margin-top:12px;"></div>
            `;
        },

        talkToNPC(npcId) {
            const npc = (this.npcs || {})[npcId];
            if (!npc) return;
            // Si estaba “desconocido”, el primer saludo lo mueve a conocido.
            if (this.getNpcRelationship(npcId) === 0) this.updateRelationship(npcId, 1);
            this.updateRelationship(npcId, 2);
            this.showNPCInteraction(npcId);
        },

        giftNPC(npcId) {
            const npc = (this.npcs || {})[npcId];
            if (!npc || !this.player) return;

            if (!Array.isArray(this.player.inventory) || this.player.inventory.length === 0) {
                alert('No tienes items para regalar.');
                return;
            }

            const options = this.player.inventory.map((it, idx) => `${idx + 1}) ${it.name}`).join('\n');
            const pick = prompt(`Elige un item para regalar (número):\n${options}`);
            const idx = Number(pick) - 1;
            if (!Number.isFinite(idx) || idx < 0 || idx >= this.player.inventory.length) return;

            const item = this.player.inventory[idx];
            const liked = (npc.gifts || []).includes(item.name);
            const delta = liked ? (8 + Math.floor(Math.random() * 8)) : 2;
            this.updateRelationship(npcId, delta);
            this.player.inventory.splice(idx, 1);
            this.saveGame();

            alert(`${npc.name} ${liked ? 'aprecia' : 'acepta'} tu regalo. Relación +${delta}.`);
            this.showNPCInteraction(npcId);
        },

        showNpcMissions(npcId) {
            const npc = (this.npcs || {})[npcId];
            const extra = document.getElementById('npc-extra');
            if (!npc || !extra) return;
            const rel = this.getNpcRelationship(npcId);
            const relLevel = this.getNpcRelationshipLevel(rel, npcId);

            const missions = this.getNPCMissions(npcId, relLevel);
            if (missions.length === 0) {
                extra.innerHTML = '<div class="story-text">No hay misiones disponibles con este NPC (sube la relación).</div>';
                return;
            }

            extra.innerHTML = `
                <div style="color: var(--accent); font-weight:bold;">Misiones de ${npc.name}</div>
                ${missions.map(m => {
                    return `
                        <div class="mission-card" style="margin-top:10px;" onclick='game.startNpcMission(${JSON.stringify(m).replace(/'/g, "\\'")})'>
                            <h4>📌 ${m.name} [${m.rank}]</h4>
                            <p>${m.description}</p>
                            <p style="color:#ffd700; margin-top:8px;">${m.ryo} Ryo | ${m.exp} EXP</p>
                        </div>
                    `;
                }).join('')}
            `;
        },

        getNPCMissions(npcId, relLevel) {
            const npc = (this.npcs || {})[npcId];
            if (!npc) return [];
            const list = Array.isArray(npc.missions) ? npc.missions : [];

            if (relLevel === 'Amigo' || relLevel === 'Mejor Amigo' || relLevel === 'Compañero') return list;
            if (relLevel === 'Conocido') return list.slice(0, 1);
            return [];
        },

        startNpcMission(mission) {
            if (!mission) return;
            const cloned = { ...mission, npcMission: true };
            this.startMission(cloned);
        },

        showNpcTrainings(npcId) {
            const npc = (this.npcs || {})[npcId];
            const extra = document.getElementById('npc-extra');
            if (!npc || !extra) return;

            const rel = this.getNpcRelationship(npcId);
            const relLevel = this.getNpcRelationshipLevel(rel, npcId);

            if (!(relLevel === 'Mejor Amigo' || relLevel === 'Compañero')) {
                extra.innerHTML = '<div class="story-text">Necesitas ser Mejor Amigo para entrenamientos especiales.</div>';
                return;
            }

            const trainings = Array.isArray(npc.trainings) ? npc.trainings : [];
            if (trainings.length === 0) {
                extra.innerHTML = '<div class="story-text">Este NPC no tiene entrenamientos disponibles.</div>';
                return;
            }

            extra.innerHTML = `
                <div style="color: var(--accent); font-weight:bold;">Entrenamientos de ${npc.name}</div>
                ${trainings.map(t => {
                    return `
                        <div class="shop-item" style="margin-top:10px;">
                            <h4>💪 ${t.name}</h4>
                            <p>${t.description}</p>
                            <p class="price">💰 ${t.price} Ryo</p>
                            <button class="btn btn-small" onclick='game.doNpcTraining("${npcId}", ${JSON.stringify(t).replace(/'/g, "\\'")})'>Entrenar</button>
                        </div>
                    `;
                }).join('')}
            `;
        },

        doNpcTraining(npcId, training) {
            const npc = (this.npcs || {})[npcId];
            if (!npc || !training || !this.player) return;
            if (this.player.ryo < training.price) {
                alert('No tienes suficiente Ryo.');
                return;
            }

            this.player.ryo -= training.price;
            const eff = training.effect || {};
            if (eff.all) {
                this.player.taijutsu += eff.all;
                this.player.ninjutsu += eff.all;
                this.player.genjutsu += eff.all;
            }
            if (eff.taijutsu) this.player.taijutsu += eff.taijutsu;
            if (eff.ninjutsu) this.player.ninjutsu += eff.ninjutsu;
            if (eff.genjutsu) this.player.genjutsu += eff.genjutsu;
            if (eff.maxHp) {
                this.player.maxHp += eff.maxHp;
                this.player.hp = this.player.maxHp;
            }
            if (eff.maxChakra) {
                this.player.maxChakra += eff.maxChakra;
                this.player.chakra = this.player.maxChakra;
            }

            this.updateRelationship(npcId, 1);
            this.updateVillageUI();
            this.saveGame();
            alert(`Entrenamiento completado con ${npc.name}.`);
            this.showNPCInteraction(npcId);
        },

        getNpcBattleStamp() {
            return `${this.player.year}-${this.player.month}-${this.player.day}`;
        },

        friendlyBattle(npcId) {
            const npc = (this.npcs || {})[npcId];
            if (!npc || !this.player) return;

            const stamp = this.getNpcBattleStamp();
            const last = this.player.npcDailyBattleStamp?.[npcId];
            if (last === stamp) {
                alert('Ya hiciste un combate amistoso con este NPC hoy.');
                return;
            }

            const rankOrder = { Genin: 1, Chunin: 2, 'Chūnin': 2, Jonin: 3, 'Jōnin': 3, ANBU: 4, Kage: 5, Hokage: 5, Sannin: 4, Viajero: 3, Médica: 3, Consejero: 3, 'Ex-Hokage': 5, Jinchūriki: 4 };
            const npcRank = rankOrder[npc.rank] ?? 3;
            const playerRank = rankOrder[this.player.rank] ?? 1;
            if (npcRank < playerRank) {
                alert('Este NPC solo ofrece combate amistoso si su rango es igual o mayor al tuyo.');
                return;
            }

            this.currentMission = {
                name: `🤝 Combate amistoso: ${npc.name}`,
                rank: 'F',
                description: 'Sin muerte. El combate termina al llegar a 1 HP.',
                enemies: [],
                ryo: 0,
                exp: 120,
                turns: 0,
                friendlyBattle: true,
                npcId
            };

            const s = npc.stats || {};
            const enemy = {
                name: npc.name,
                hp: s.hp || 220,
                chakra: s.chakra || 120,
                attack: s.attack || 25,
                defense: s.defense || 18,
                accuracy: s.accuracy || 14,
                genjutsu: s.genjutsu || 10,
                exp: 0,
                ryo: 0
            };

            this.enemyQueue = [];
            this.totalWaves = 1;
            this.currentWave = 1;
            this.currentEnemy = { ...enemy, maxHp: enemy.hp, maxChakra: enemy.chakra, controlledTurns: 0 };
            this.startCombat();
        },

        finishFriendlyBattle(didWin) {
            const npcId = this.currentMission?.npcId;
            const npc = npcId ? (this.npcs || {})[npcId] : null;
            const stamp = npcId ? this.getNpcBattleStamp() : null;

            if (npcId && stamp) {
                this.player.npcDailyBattleStamp = this.player.npcDailyBattleStamp || {};
                this.player.npcDailyBattleStamp[npcId] = stamp;
            }

            const relGain = didWin ? 5 : 3;
            if (npcId) {
                this.updateRelationship(npcId, relGain);
                if (!didWin) {
                    this.player.npcRivals = this.player.npcRivals || {};
                    this.player.npcRivals[npcId] = true;
                }
            }

            const expGain = didWin ? 80 : 40;
            this.player.exp += expGain;
            this.player.totalExp = (this.player.totalExp || 0) + expGain;
            this.checkJutsuUnlocks(this.player);
            if (this.player.exp >= this.player.expToNext) {
                this.levelUp();
            }

            this.currentEnemy = null;
            this.currentMission = null;
            this.enemyQueue = [];
            this.totalWaves = 0;
            this.currentWave = 0;
            this.saveGame();

            setTimeout(() => {
                this.showScreen('village-screen');
                this.showSection('world');
                this.updateVillageUI();
                this.activateVillageTab('npcs');
                if (npc) {
                    alert(`${didWin ? '🏆' : '🤝'} Combate amistoso vs ${npc.name}: ${didWin ? 'GANASTE' : 'PERDISTE'}\n+${expGain} EXP | +${relGain} Relación`);
                    this.showNPCInteraction(npc.id);
                }
            }, 300);
        },

        toggleTravelPanel() {
            const el = document.getElementById('travel-panel');
            if (!el) return;
            el.style.display = el.style.display === 'none' ? 'block' : 'none';
        },

        populateTravelDestinations() {
            const sel = document.getElementById('travel-destination');
            if (!sel) return;
            const current = this.player?.location;
            const opts = Object.entries(this.locations)
                .filter(([id, info]) => id !== current)
                .filter(([id]) => !(this.player?.isRenegade && id === 'konoha'))
                .map(([id, info]) => ({ id, label: `${info.icon} ${info.name}` }));

            const previous = sel.value;
            sel.innerHTML = opts.map(o => `<option value="${o.id}">${o.label}</option>`).join('');
            if (previous && opts.some(o => o.id === previous)) sel.value = previous;
        },

        toggleRecruitPanel() {
            const el = document.getElementById('recruit-panel');
            if (!el) return;
            el.style.display = el.style.display === 'none' ? 'block' : 'none';
        },

        renderRecruitPanel() {
            const el = document.getElementById('recruit-panel');
            if (!el || !this.player) return;

            const team = new Set(this.player.team || []);
            const canAdd = team.size < 2;

            const rows = Object.values(this.recruitableNPCs).map(npc => {
                const inTeam = team.has(npc.id);
                const disabled = (!inTeam && !canAdd);
                const btnLabel = inTeam ? 'Quitar' : 'Reclutar';
                const btnClass = inTeam ? 'btn btn-small btn-secondary' : 'btn btn-small';
                const onclick = inTeam
                    ? `game.dismissTeammate('${npc.id}')`
                    : `game.recruitTeammate('${npc.id}')`;
                const safe = disabled ? 'disabled' : '';

                return `
                    <div class="shop-item" style="margin:8px 0;">
                        <h4>👥 ${npc.name}</h4>
                        <p>💰 ${npc.costPerDay} Ryo/día</p>
                        <p style="font-size:0.9em;">${this.describeNpcPerk(npc)}</p>
                        <button class="${btnClass}" onclick="${onclick}" ${safe}>${btnLabel}</button>
                    </div>
                `;
            });

            el.innerHTML = `
                <div style="color:#ff8c00; font-weight:bold; margin-bottom:8px;">Equipo (máx. 2 compañeros)</div>
                ${rows.join('')}
            `;
        },

        describeNpcPerk(npc) {
            switch (npc.perk) {
                case 'mission_ryo': return `+${Math.round(npc.perkValue * 100)}% Ryo en misiones`;
                case 'mission_exp': return `+${Math.round(npc.perkValue * 100)}% EXP en misiones`;
                case 'combat_damage': return `+${npc.perkValue} daño físico (auto)`;
                case 'team_evasion': return `+${Math.round(npc.perkValue * 100)}% evasión del equipo`;
                case 'between_heal': return `Cura entre combates (+${Math.round(npc.perkValue * 100)}% HP)`;
                default: return 'Apoyo';
            }
        },

        recruitTeammate(npcId) {
            if (!this.player) return;
            const npc = this.recruitableNPCs[npcId];
            if (!npc) return;
            this.player.team = Array.isArray(this.player.team) ? this.player.team : [];
            if (this.player.team.includes(npcId)) return;
            if (this.player.team.length >= 2) {
                alert('Tu equipo ya está completo (máx. 2 compañeros).');
                return;
            }
            this.player.team.push(npcId);
            this.player.friendship[npcId] = this.player.friendship[npcId] ?? 0;
            alert(`👥 ${npc.name} se unió a tu equipo.`);
            this.updateVillageUI();
            this.saveGame();
        },

        dismissTeammate(npcId) {
            if (!this.player || !Array.isArray(this.player.team)) return;
            this.player.team = this.player.team.filter(id => id !== npcId);
            alert('Compañero removido del equipo.');
            this.updateVillageUI();
            this.saveGame();
        },

        startTravelFromHUD() {
            const sel = document.getElementById('travel-destination');
            if (!sel) return;
            const destination = sel.value;
            const groupTravel = document.getElementById('travel-group')?.checked || false;
            this.travel(destination, { groupTravel });
        },

        travel(destination, opts = {}) {
            if (!this.player) return;
            if (!destination || !this.locations[destination]) {
                alert('Destino inválido.');
                return;
            }
            if (this.player.isRenegade && destination === 'konoha') {
                alert('🚫 Un renegado no puede entrar a Konoha.');
                return;
            }
            if (destination === this.player.location) {
                alert('Ya estás en ese lugar.');
                return;
            }

            // No viajar si estás en combate
            if (document.getElementById('combat-screen')?.classList.contains('active')) {
                alert('No puedes viajar en medio de un combate.');
                return;
            }

            const groupTravel = !!opts.groupTravel;
            const travelDays = this.getTravelDays(this.player.location, destination, { groupTravel });

            this.player.travelState = {
                from: this.player.location,
                to: destination,
                remainingDays: travelDays,
                groupTravel,
                startedAt: { day: this.player.day, month: this.player.month, year: this.player.year }
            };

            const fromLoc = this.locations[this.player.location];
            const toLoc = this.locations[destination];
            alert(`🧭 Viaje iniciado: ${fromLoc.icon} ${fromLoc.name} → ${toLoc.icon} ${toLoc.name}\nDuración estimada: ${travelDays} día(s)`);

            this.processNextTravelDay();
        },

        getTravelDays(fromId, toId, opts = {}) {
            const groupTravel = !!opts.groupTravel;

            const getKonohaDistance = (id) => {
                if (id === 'konoha') return 0;
                return this.locations[id]?.daysFromKonoha ?? 4;
            };

            let baseDays = 0;
            if (fromId === 'konoha' || toId === 'konoha') {
                const other = fromId === 'konoha' ? toId : fromId;
                baseDays = Math.max(1, getKonohaDistance(other));
            } else {
                // simplificación: via Konoha (hub)
                baseDays = Math.max(2, getKonohaDistance(fromId) + getKonohaDistance(toId));
            }

            // Estación y clima
            if (this.player.season === 'invierno') baseDays += 1;
            if (this.player.weather === 'lluvia') baseDays += 1;
            if (this.player.weather === 'tormenta') baseDays += 2;
            if (this.player.weather === 'nieve') baseDays += 1;

            // Viajar en grupo (más seguro, pero más lento)
            if (groupTravel) baseDays += 1;

            // Equipo acelera (-1 día)
            const team = Array.isArray(this.player.team) ? this.player.team : [];
            if (team.length > 0) baseDays = Math.max(1, baseDays - 1);

            return baseDays;
        },

        getTravelEncounterChance(groupTravel) {
            let chance = 0.25;
            if (this.player.weather === 'tormenta' || this.player.weather === 'nieve') chance += 0.10;
            if (this.player.weather === 'lluvia') chance += 0.05;

            const team = Array.isArray(this.player.team) ? this.player.team : [];
            if (team.length > 0) chance -= 0.05;
            if (groupTravel) chance -= 0.08;

            return this.clamp(chance, 0.05, 0.60);
        },

        processNextTravelDay() {
            if (!this.player?.travelState) return;

            const state = this.player.travelState;
            if (state.remainingDays <= 0) {
                this.finishTravelArrival();
                return;
            }

            state.remainingDays -= 1;

            // Costos del día
            const chakraCost = Math.max(1, Math.floor(this.player.maxChakra * 0.10));
            this.player.chakra = Math.max(0, this.player.chakra - chakraCost);
            this.addFatigue(5);
            // El tiempo avanza naturalmente en el sistema basado en tiempo real
            // No llamamos a advanceTurns() porque el tiempo es controlado por getRealTimeState()

            // Encuentro aleatorio
            const encounterChance = this.getTravelEncounterChance(state.groupTravel);
            const hasEncounter = Math.random() < encounterChance;

            if (hasEncounter) {
                const enemy = this.generateTravelEncounterEnemy(state.to);
                this.startTravelEncounter(enemy);
                return;
            }

            // Continuar viaje
            if (state.remainingDays <= 0) {
                this.finishTravelArrival();
                return;
            }

            // Feedback mínimo
            this.updateVillageUI();
            setTimeout(() => this.processNextTravelDay(), 300);
        },

        generateTravelEncounterEnemy(destinationId) {
            const dist = this.locations[destinationId]?.daysFromKonoha ?? 4;
            let poolKey = 'genin';
            if (dist <= 3) poolKey = 'genin';
            else if (dist <= 5) poolKey = 'chunin';
            else if (dist <= 7) poolKey = 'jonin';
            else poolKey = 'akatsuki';

            const pool = this.enemies[poolKey] || this.enemies.genin;
            const tpl = pool[Math.floor(Math.random() * pool.length)];
            const enemy = { ...tpl, maxHp: tpl.hp, maxChakra: tpl.chakra };

            // Escala suave por distancia
            const scale = 1 + Math.min(0.35, dist * 0.03);
            enemy.hp = Math.floor(enemy.hp * scale);
            enemy.maxHp = enemy.hp;
            enemy.attack = Math.floor(enemy.attack * scale);
            enemy.defense = Math.floor(enemy.defense * scale);
            return enemy;
        },

        startTravelEncounter(enemy) {
            this.currentMission = {
                name: 'Encuentro en el camino',
                rank: 'E',
                description: 'Un enemigo intercepta tu ruta.',
                enemies: [],
                ryo: 60,
                exp: 30,
                isTravelEncounter: true
            };
            this.currentEnemy = enemy;
            this.enemyQueue = [];
            this.totalWaves = 1;
            this.currentWave = 1;
            this.startCombat();
        },

        finishTravelArrival() {
            const state = this.player.travelState;
            const toId = state.to;
            const toLoc = this.locations[toId];
            this.player.location = toId;
            this.player.travelState = null;
            alert(`📍 Has llegado a ${toLoc.icon} ${toLoc.name}.`);
            this.updateVillageUI();
            this.saveGame();
        },

        showTab(tabName) {
            // Wrapper para onclick inline sin depender de `event`
            this.activateVillageTab(tabName);
        },

        showMissions() {
            const missionList = document.getElementById('mission-list') 
                || document.querySelector('#section-world .mission-list');
            
            if (!missionList) {
                console.error('❌ mission-list element not found in DOM');
                return;
            }
            
            console.log('✅ showMissions: missionList found', missionList);
            console.log('🎮 Player:', this.player ? this.player.name : 'NO PLAYER');
            missionList.innerHTML = '';

            if (this.player.urgentMission) {
                const turnsLeft = this.player.urgentMission.turnsLeft;
                const daysLeft = Math.ceil(turnsLeft / this.turnsPerDay);
                const urgentCard = document.createElement('div');
                urgentCard.className = 'mission-card';
                urgentCard.style.borderLeftColor = '#c0392b';
                urgentCard.style.background = 'rgba(192, 57, 43, 0.18)';
                urgentCard.style.cursor = 'pointer';
                urgentCard.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🚨 Urgent mission clicked');
                    if (typeof game !== 'undefined' && game.startUrgentMission) {
                        game.startUrgentMission();
                    }
                };
                urgentCard.innerHTML = `
                    <h4>🚨 ${this.player.urgentMission.name} [URGENTE]</h4>
                    <p>Tiempo límite: ${daysLeft} día(s) · Recompensa x${this.player.urgentMission.ryoMultiplier || 2}</p>
                    <p style="color:#ffd700; margin-top:8px;">Si fallas: -Reputación</p>
                `;
                missionList.appendChild(urgentCard);
            }
            
            // Renegado: contratos + misiones de organización
            if (this.player.isRenegade) {
                const tier = (this.player.level >= 12 || (this.player.renegadeLevel || 0) >= 4)
                    ? 'high'
                    : (this.player.level >= 8 ? 'mid' : 'low');

                const contracts = (this.renegadeContracts && this.renegadeContracts[tier]) ? this.renegadeContracts[tier] : [];
                const org = this.player.organization;
                const orgMissions = (org && this.organizationMissions && this.organizationMissions[org]) ? this.organizationMissions[org] : [];

                const addHeading = (text) => {
                    const h = document.createElement('div');
                    h.style.gridColumn = '1/-1';
                    h.innerHTML = `<h4 style="color:#c0392b;">${text}</h4>`;
                    missionList.appendChild(h);
                };

                addHeading(`🩸 Contratos (${tier.toUpperCase()})`);
                contracts.forEach(m => this.renderMissionCard(missionList, m, { renegade: true }));

                if (org) {
                    addHeading(`🏴 Misiones de organización: ${org}`);
                    orgMissions.forEach(m => this.renderMissionCard(missionList, m, { renegade: true }));
                }

                if (contracts.length === 0 && orgMissions.length === 0 && !this.player.urgentMission) {
                    missionList.innerHTML = '<div class="story-text">No hay contratos disponibles por ahora.</div>';
                }
                return;
            }

            // Recopilar TODAS las misiones de todos los grupos
            if (!this.missions) {
                missionList.innerHTML = '<div class="story-text">Error: No se encontraron datos de misiones.</div>';
                return;
            }
            
            const allMissions = [
                ...(this.missions.genin || []),
                ...(this.missions.chunin || []),
                ...(this.missions.jonin || []),
                ...(this.missions.kage || [])
            ];
            
            if (allMissions.length === 0) {
                missionList.innerHTML = '<div class="story-text">No hay misiones configuradas.</div>';
                return;
            }

            // Agrupar misiones por rango
            const missionsByRank = this.groupMissionsByRank(allMissions);

            // Definir orden de rangos
            const rankOrder = ['D', 'C', 'B', 'A', 'S', 'U', 'F'];
            
            // Renderizar acordeones para cada rango disponible
            rankOrder.forEach(rank => {
                const missionsInRank = missionsByRank[rank] || [];
                if (missionsInRank.length === 0) return; // saltar rangos sin misiones

                // Contenedor del acordeón
                const rankContainer = document.createElement('div');
                rankContainer.className = 'mission-rank-accordion';

                // Contar misiones disponibles vs bloqueadas
                const availableCount = missionsInRank.filter(m => !this.isMissionLocked(m) || !this.isMissionLocked(m).locked).length;
                const lockedCount = missionsInRank.length - availableCount;

                // Botón de acordeón (header)
                const header = document.createElement('button');
                
                // Ícono de rango y cantidad
                const rankLabel = `${this.getRankEmoji(rank)} Rango ${rank}`;
                const countLabel = availableCount > 0 
                    ? `(${availableCount} disponible${availableCount !== 1 ? 's' : ''}${lockedCount > 0 ? `, ${lockedCount} 🔒` : ''})`
                    : `(${lockedCount} 🔒 bloqueada${lockedCount !== 1 ? 's' : ''})`;
                
                header.innerHTML = `
                    <span>${rankLabel} ${countLabel}</span>
                    <span class="accordion-arrow" style="transition: transform 0.3s;">▼</span>
                `;

                // Contenedor de contenido
                const content = document.createElement('div');
                content.className = 'mission-rank-content';
                content.style.display = 'none';

                // Agregar misiones dentro del contenido
                const missionGrid = document.createElement('div');
                missionGrid.className = 'mission-grid';

                missionsInRank.forEach(mission => {
                    const card = document.createElement('div');
                    card.className = 'mission-card';

                    const rankMission = (mission.rank || '').toUpperCase();
                    const turnCostByRank = { D: 1, C: 2, B: 3, A: 4, S: 4, U: 5, F: 6 };
                    const turns = mission.turns ?? (turnCostByRank[rankMission] ?? 2);

                    const team = this.getTeamBonuses();
                    const nightRyoMult = this.getTimeOfDay() === 2 ? 1.2 : 1;
                    const estRyo = Math.floor(mission.ryo * (team.missionRyoMult || 1) * nightRyoMult);
                    const estExp = Math.floor(mission.exp * (team.missionExpMult || 1));
                    
                    // Verificar si la misión está bloqueada
                    const lockStatus = this.isMissionLocked(mission);
                    
                    if (lockStatus && lockStatus.locked) {
                        // Misión bloqueada
                        card.classList.add('mission-locked');
                        card.style.opacity = '0.6';
                        card.style.cursor = 'not-allowed';
                        card.style.borderColor = 'rgba(255, 100, 100, 0.3)';
                        card.style.position = 'relative';
                        card.style.zIndex = '5';
                        card.innerHTML = `
                            <h4 style="color: #888;">🔒 ${mission.name}</h4>
                            <p style="color: #666;">${mission.description}</p>
                            <p style="color: #ff6b6b; margin-top: 8px; font-weight: bold;">⛔ BLOQUEADO - ${lockStatus.reason}</p>
                            <p style="opacity: 0.5; margin-top: 6px;">⏱️ Tiempo: ${turns} turno(s)</p>
                        `;
                        card.onclick = (e) => {
                            e.stopPropagation();
                            alert(`🔒 Misión bloqueada: ${lockStatus.reason}`);
                        };
                    } else {
                        // Misión disponible
                        card.style.cursor = 'pointer';
                        card.style.position = 'relative';
                        card.style.zIndex = '5';
                        
                        // Asignar onclick con función flecha que captura el valor de mission
                        const missionData = mission; // Capturar referencia
                        card.onclick = function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('🎯 Mission card clicked:', missionData.name);
                            console.log('🎮 Game object:', typeof game !== 'undefined' ? 'available' : 'NOT FOUND');
                            if (typeof game !== 'undefined' && game.startMission) {
                                game.startMission(missionData);
                            } else {
                                console.error('❌ game.startMission not found!');
                                alert('Error: El juego no está listo. Recarga la página.');
                            }
                        };
                        
                        card.innerHTML = `
                            <h4>📜 ${mission.name}</h4>
                            <p>${mission.description}</p>
                            <p style="color: #ffd700; margin-top: 8px;">Recompensa: ${estRyo} Ryo | ${estExp} EXP</p>
                            <p style="opacity: 0.85; margin-top: 6px;">⏱️ Tiempo: ${turns} turno(s)</p>
                        `;
                    }
                    missionGrid.appendChild(card);
                });

                content.appendChild(missionGrid);

                // Toggle del acordeón
                header.onclick = (e) => {
                    e.stopPropagation(); // Evitar que el click se propague
                    const isExpanded = content.style.display !== 'none';
                    content.style.display = isExpanded ? 'none' : 'block';
                    
                    const arrow = header.querySelector('.accordion-arrow');
                    if (arrow) {
                        arrow.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(-180deg)';
                    }
                };

                rankContainer.appendChild(header);
                rankContainer.appendChild(content);
                missionList.appendChild(rankContainer);
            });

            if (Object.keys(missionsByRank).every(rank => (missionsByRank[rank] || []).length === 0)) {
                missionList.innerHTML = '<div class="story-text">No hay misiones disponibles para tu nivel.</div>';
            }
        },

        groupMissionsByRank(missions) {
            const grouped = {};
            missions.forEach(mission => {
                const rank = (mission.rank || 'D').toUpperCase();
                if (!grouped[rank]) {
                    grouped[rank] = [];
                }
                grouped[rank].push(mission);
            });
            return grouped;
        },

        // Verificar si una misión está bloqueada por nivel o rango
        isMissionLocked(mission) {
            if (!this.player) return true;
            
            const missionRank = (mission.rank || 'D').toUpperCase();
            const playerRank = this.player.rank || 'Genin';
            const playerLevel = this.player.level || 1;
            
            // Definir requisitos mínimos de nivel por rango de misión
            const rankRequirements = {
                'D': { minLevel: 1, allowedRanks: ['Genin', 'Chunin', 'Jonin', 'ANBU', 'Kage'] },
                'C': { minLevel: 2, allowedRanks: ['Genin', 'Chunin', 'Jonin', 'ANBU', 'Kage'] },
                'B': { minLevel: 5, allowedRanks: ['Chunin', 'Jonin', 'ANBU', 'Kage'] },
                'A': { minLevel: 8, allowedRanks: ['Chunin', 'Jonin', 'ANBU', 'Kage'] },
                'S': { minLevel: 12, allowedRanks: ['Jonin', 'ANBU', 'Kage'] },
                'U': { minLevel: 18, allowedRanks: ['ANBU', 'Kage'] },
                'F': { minLevel: 25, allowedRanks: ['Kage'] }
            };
            
            const req = rankRequirements[missionRank];
            if (!req) return false;
            
            // Verificar nivel
            if (playerLevel < req.minLevel) {
                return { locked: true, reason: `Nivel ${req.minLevel} requerido` };
            }
            
            // Verificar rango
            if (!req.allowedRanks.includes(playerRank)) {
                return { locked: true, reason: `Rango ${req.allowedRanks[0]} requerido` };
            }
            
            return false;
        },

        getRankEmoji(rank) {
            const emojis = {
                'D': '🟦',
                'C': '🟩',
                'B': '🟧',
                'A': '🟥',
                'S': '⭐',
                'U': '💛',
                'F': '💀'
            };
            return emojis[rank] || '📋';
        },

        renderMissionCard(container, mission, opts = {}) {
            const card = document.createElement('div');
            card.className = 'mission-card';
            card.style.cursor = 'pointer';
            
            const missionData = mission; // Capturar referencia
            card.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🎯 Renegade mission clicked:', missionData.name);
                if (typeof game !== 'undefined' && game.startMission) {
                    game.startMission(missionData);
                } else {
                    console.error('❌ game.startMission not found!');
                }
            };

            const rank = (mission.rank || '').toUpperCase();
            const turnCostByRank = { D: 1, C: 2, B: 3, A: 4, S: 4 };
            const turns = mission.turns ?? (turnCostByRank[rank] ?? 2);

            const team = this.getTeamBonuses();
            const nightRyoMult = this.getTimeOfDay() === 2 ? 1.2 : 1;
            const estRyo = Math.floor(mission.ryo * (team.missionRyoMult || 1) * nightRyoMult);
            const estExp = Math.floor(mission.exp * (team.missionExpMult || 1));

            if (opts.renegade) {
                card.style.borderLeftColor = '#c0392b';
                card.style.background = 'rgba(192, 57, 43, 0.10)';
            }

            card.innerHTML = `
                <h4>📜 ${mission.name} [Rango ${mission.rank}]</h4>
                <p>${mission.description}</p>
                <p style="color: #ffd700; margin-top: 8px;">Recompensa: ${estRyo} Ryo | ${estExp} EXP</p>
                <p style="opacity: 0.85; margin-top: 6px;">⏱️ Tiempo: ${turns} turno(s)</p>
            `;

            container.appendChild(card);
        },

        showAcademy(rank) {
            const jutsuList = document.getElementById('academy-jutsu-list');
            jutsuList.innerHTML = '';

            if (this.player.isRenegade) {
                jutsuList.innerHTML = '<div class="story-text">🚫 Como Renegado, la Academia de Konoha está cerrada para ti.</div>';
                return;
            }

            if (this.player.location !== 'konoha') {
                jutsuList.innerHTML = '<div class="story-text">📍 La Academia Ninja solo está disponible en Konoha.</div>';
                return;
            }
            if (this.getTimeOfDay() === 3) {
                jutsuList.innerHTML = '<div class="story-text">🌙 Es madrugada. La Academia está cerrada.</div>';
                return;
            }
            
            let jutsusAll;
            
            // Especial para Taijutsu: usar taijutsuAcademy en lugar de academyJutsus
            if (rank === 'taijutsu') {
                jutsusAll = this.taijutsuAcademy || [];
            } else if (rank === 'genjutsu') {
                // Especial para Genjutsu: usar genjutsuAcademy
                jutsusAll = this.genjutsuAcademy || [];
            } else if (rank === 'escape') {
                // Especial para Escape: usar escapeAcademy
                jutsusAll = this.escapeAcademy || [];
            } else if (rank === 'katon') {
                // Especial para Katon: usar katonAcademy
                jutsusAll = this.katonAcademy || [];
            } else if (rank === 'suiton') {
                // Especial para Suiton: usar suitonAcademy
                jutsusAll = this.suitonAcademy || [];
            } else if (rank === 'futon') {
                // Especial para Futon: usar futonAcademy
                jutsusAll = this.futonAcademy || [];
            } else if (rank === 'doton') {
                // Especial para Doton: usar dotonAcademy
                jutsusAll = this.dotonAcademy || [];
            } else if (rank === 'raiton') {
                // Especial para Raiton: usar raitonAcademy
                jutsusAll = this.raitonAcademy || [];
            } else if (rank === 'sharingan') {
                // Especial para Sharingan: usar sharinganAcademy
                jutsusAll = this.sharinganAcademy || [];
            } else if (rank === 'byakugan') {
                // Especial para Byakugan: usar byakuganAcademy
                jutsusAll = this.byakuganAcademy || [];
            } else if (rank === 'rinnegan') {
                // Especial para Rinnegan: usar rinneganAcademy
                jutsusAll = this.rinneganAcademy || [];
            } else if (rank === 'bijuu') {
                // Especial para Bijuu: usar bijuuAcademy
                jutsusAll = this.bijuuAcademy || [];
            } else {
                jutsusAll = this.academyJutsus[rank] || [];
            }
            
            // Para academy jutsus: filtrar por elemento del jugador
            const playerElement = this.player.element;
            let jutsus;
            
            if (rank === 'taijutsu' || rank === 'genjutsu' || rank === 'escape' || rank === 'katon' || rank === 'suiton' || rank === 'futon' || rank === 'doton' || rank === 'raiton' || rank === 'sharingan' || rank === 'byakugan' || rank === 'rinnegan' || rank === 'bijuu') {
                // Taijutsu, Genjutsu, Escape, elementos y Kekkei Genkai no se filtran por elemento, mostrar todos
                // (Los elementos se filtran por tener element requerido en los requirements)
                // (Sharingan/Byakugan/Rinnegan/Bijuu se filtran por tener kekkei_genkai y niveles requeridos en los requirements)
                jutsus = jutsusAll;
            } else {
                // Academy jutsus: filtrar por elemento (nulos + del jugador)
                jutsus = jutsusAll.filter(j => (j.element == null) || (playerElement && j.element === playerElement));
            }
            
            jutsus.forEach(jutsu => {
                const isLearned = this.player.learnedJutsus.some(j => j.name === jutsu.name);
                const isUnlocked = this.player.unlockedJutsus.some(j => j.name === jutsu.name);
                const meetsReq = this.meetsJutsuRequirements(this.player, jutsu.requirements);
                
                const card = document.createElement('div');
                
                let statusText = '✅ APRENDIDO';
                let statusColor = '#2ecc71';
                let statusIcon = '✅';
                let statusBadge = 'learned';
                let isClickable = false;
                
                if (!isLearned) {
                    if (isUnlocked || meetsReq) {
                        // Mostrar como disponible para aprender
                        card.className = 'jutsu-card unlocked';
                        statusText = '📖 DISPONIBLE';
                        statusColor = '#3498db';
                        statusIcon = '📖';
                        statusBadge = 'unlocked';
                        isClickable = true;
                    } else {
                        // Mostrar como bloqueado
                        card.className = 'jutsu-card locked';
                        statusText = '🔒 BLOQUEADO';
                        statusColor = '#e74c3c';
                        statusIcon = '🔒';
                        statusBadge = 'locked';
                        isClickable = false;
                    }
                } else {
                    card.className = 'jutsu-card learned';
                }
                
                if (isClickable) {
                    card.onclick = () => this.learnJutsu(jutsu);
                }
                
                let reqInfo = '';
                if (!isLearned && !isUnlocked && !meetsReq && jutsu.requirements) {
                    const req = jutsu.requirements;
                    const missingReqs = [];
                    
                    if (req.level && this.player.level < req.level) {
                        missingReqs.push(`Nivel: ${this.player.level}/${req.level}`);
                    }
                    if (req.stats?.ninjutsu && this.player.ninjutsu < req.stats.ninjutsu) {
                        missingReqs.push(`Ninjutsu: ${this.player.ninjutsu}/${req.stats.ninjutsu}`);
                    }
                    if (req.stats?.taijutsu && this.player.taijutsu < req.stats.taijutsu) {
                        missingReqs.push(`Taijutsu: ${this.player.taijutsu}/${req.stats.taijutsu}`);
                    }
                    if (req.exp && (this.player.totalExp || 0) < req.exp) {
                        missingReqs.push(`Exp: ${(this.player.totalExp || 0)}/${req.exp}`);
                    }
                    
                    if (missingReqs.length > 0) {
                        reqInfo = `<div style="font-size: 12px; color: #95a5a6; margin-top: 8px;">Requisitos: ${missingReqs.join(' • ')}</div>`;
                    }
                }
                
                // Info especial para jutsus de escape
                let specialInfo = '';
                if (jutsu.type === 'escape') {
                    specialInfo = `<div style="font-size: 11px; color: #f39c12; margin-top: 8px;">
                        📊 Éxito: ${jutsu.escapeChance}% | 💔 Rep: -${jutsu.reputationLoss}
                    </div>`;
                }
                
                // Info especial para jutsus de Sharingan (Kekkei Genkai)
                if (jutsu.type === 'kekkei' && jutsu.requirements && jutsu.requirements.kekkei_genkai === 'sharingan') {
                    const kgLevel = jutsu.requirements.KG_level || 1;
                    let levelName = '';
                    if (kgLevel === 1) levelName = '1 Aspa';
                    else if (kgLevel === 2) levelName = '2 Aspas';
                    else if (kgLevel === 3) levelName = '3 Aspas';
                    else if (kgLevel >= 4) levelName = 'Mangekyō';
                    
                    let extraInfo = '';
                    if (jutsu.specialEffect) {
                        if (jutsu.specialEffect.passive) extraInfo = ' | 🔄 Pasivo';
                        else if (jutsu.specialEffect.usesPerBattle) extraInfo = ` | 🎯 ${jutsu.specialEffect.usesPerBattle} usos/batalla`;
                    }
                    
                    specialInfo = `<div style="font-size: 11px; color: #e74c3c; margin-top: 8px;">
                        👁️ Requiere: ${levelName}${extraInfo}
                    </div>`;
                }
                
                // Info especial para jutsus de Byakugan (Kekkei Genkai)
                if (jutsu.type === 'kekkei' && jutsu.requirements && jutsu.requirements.kekkei_genkai === 'byakugan') {
                    const kgLevel = jutsu.requirements.KG_level || 1;
                    let levelName = '';
                    if (kgLevel === 1) levelName = 'Básico';
                    else if (kgLevel === 2) levelName = 'Intermedio';
                    else if (kgLevel === 3) levelName = 'Avanzado';
                    else if (kgLevel >= 4) levelName = 'Tenseigan';
                    
                    let extraInfo = '';
                    if (jutsu.specialEffect) {
                        if (jutsu.specialEffect.passive) extraInfo = ' | 🔄 Pasivo';
                        else if (jutsu.specialEffect.hits) extraInfo = ` | 👊 ${jutsu.specialEffect.hits} golpes`;
                        else if (jutsu.specialEffect.chakraDrain) extraInfo = ` | 💙 -${jutsu.specialEffect.chakraDrain} chakra`;
                    }
                    
                    specialInfo = `<div style="font-size: 11px; color: #9b59b6; margin-top: 8px;">
                        🔮 Requiere: Byakugan ${levelName}${extraInfo}
                    </div>`;
                }
                
                // Info especial para jutsus de Rinnegan (Kekkei Genkai - ULTRA RARO)
                if (jutsu.type === 'kekkei' && jutsu.requirements && jutsu.requirements.kekkei_genkai === 'rinnegan') {
                    const kgLevel = jutsu.requirements.KG_level || 1;
                    let levelName = '';
                    if (kgLevel === 1) levelName = 'Seis Caminos';
                    else if (kgLevel >= 2) levelName = 'Completo';
                    
                    let extraInfo = '';
                    if (jutsu.specialEffect) {
                        if (jutsu.specialEffect.usesPerBattle) extraInfo = ` | 🎯 ${jutsu.specialEffect.usesPerBattle} uso/batalla`;
                        else if (jutsu.specialEffect.absorbNext) extraInfo = ' | 🌀 Absorbe jutsu';
                        else if (jutsu.specialEffect.canRevive) extraInfo = ' | ❤️ Revivir';
                        else if (jutsu.specialEffect.reviveAll) extraInfo = ' | ☠️ PROHIBIDO';
                    }
                    
                    specialInfo = `<div style="font-size: 11px; color: #8e44ad; margin-top: 8px;">
                        🌀 Requiere: Rinnegan ${levelName}${extraInfo}
                    </div>`;
                }
                
                // Info especial para jutsus de Bijuu (Jinchurikis)
                if (jutsu.type === 'kekkei' && jutsu.requirements && jutsu.requirements.kekkei_genkai === 'bijuu') {
                    const relation = jutsu.requirements.bijuu_relation || 0;
                    let phaseName = '';
                    let phaseColor = '';
                    
                    if (relation <= 25) {
                        phaseName = 'Hostil';
                        phaseColor = '#e74c3c';
                    } else if (relation <= 50) {
                        phaseName = 'Tolerado';
                        phaseColor = '#e67e22';
                    } else if (relation <= 75) {
                        phaseName = 'Neutral';
                        phaseColor = '#f39c12';
                    } else {
                        phaseName = 'Armonía';
                        phaseColor = '#f1c40f';
                    }
                    
                    let extraInfo = '';
                    if (jutsu.specialEffect) {
                        if (jutsu.specialEffect.loseControlChance) extraInfo = ` | ⚠️ ${jutsu.specialEffect.loseControlChance}% riesgo`;
                        else if (jutsu.specialEffect.usesPerBattle) extraInfo = ` | 🎯 ${jutsu.specialEffect.usesPerBattle} uso/batalla`;
                        else if (jutsu.specialEffect.hpRegen) extraInfo = ` | 💚 Regenera ${jutsu.specialEffect.hpRegen}% HP/turno`;
                        else if (jutsu.specialEffect.doubleAttack) extraInfo = ' | ⚔️⚔️ Ataque doble';
                    }
                    
                    specialInfo = `<div style="font-size: 11px; color: ${phaseColor}; margin-top: 8px;">
                        🦊 Relación: ${relation}% (${phaseName})${extraInfo}
                    </div>`;
                }
                
                card.innerHTML = `
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
                            <div style="flex: 1;">
                                <h4>${statusIcon} ${jutsu.name}</h4>
                                <div style="margin-bottom: 8px;">
                                    <span class="jutsu-type-badge type-${jutsu.rank === 'master' ? 'master' : (jutsu.rank || 'genin').toLowerCase()}">${jutsu.rank?.toUpperCase() || 'RANGO'}</span>
                                </div>
                                <p style="font-size: 0.9em; margin-bottom: 8px;">${jutsu.description}</p>
                                <p style="font-size: 0.85em; margin-bottom: 8px;">💙 ${jutsu.chakra} Chakra | ${jutsu.damage > 0 ? `⚔️ ${jutsu.damage} daño` : '🌀 Efecto especial'}</p>
                                ${specialInfo}
                            </div>
                            <span class="jutsu-card-status status-${statusBadge}">${statusText}</span>
                        </div>
                        ${reqInfo}
                    </div>
                    ${isClickable ? `<button class="btn btn-small" style="margin-top: 10px;">Aprender</button>` : ''}
                `;
                
                if (isClickable) {
                    card.onclick = () => this.learnJutsu(jutsu);
                }

                jutsuList.appendChild(card);
            });

            if (this.player.blackMarketToday) {
                const offer = this.getBlackMarketOffer();
                const card = document.createElement('div');
                card.className = 'mission-card';
                card.style.borderLeftColor = '#95a5a6';
                card.onclick = () => this.buyBlackMarketJutsu();
                card.innerHTML = `
                    <h4>🕶️ Mercado Negro: ${offer.name} [${offer.rank}]</h4>
                    <p>Oferta del día (jutsu raro). Precio especial.</p>
                    <p style="color:#ffd700; margin-top: 8px;">💰 ${offer.price} Ryo</p>
                `;
                jutsuList.appendChild(card);
            }
        },

        showJutsuRank(rank) {
            const academyTab = document.getElementById('academy-tab');
            if (academyTab) {
                // Solo los botones de rango dentro del panel de Academia
                const rankButtons = academyTab.querySelectorAll('.tabs .tab-btn');
                rankButtons.forEach(btn => btn.classList.remove('active'));
                rankButtons.forEach(btn => {
                    const oc = btn.getAttribute('onclick') || '';
                    if (oc.includes(`showJutsuRank('${rank}')`)) btn.classList.add('active');
                });
            }

            this.showAcademy(rank);
        },

        learnJutsu(jutsu) {
            if (this.player.isRenegade) {
                alert('🚫 Como Renegado, no puedes aprender en la Academia de Konoha.');
                return;
            }
            if (this.player.location !== 'konoha') {
                alert('La Academia solo está disponible en Konoha.');
                return;
            }
            if (this.getTimeOfDay() === 3) {
                alert('Es madrugada. La Academia está cerrada.');
                return;
            }
            
            const alreadyLearned = this.player.learnedJutsus.some(j => j.name === jutsu.name);
            if (alreadyLearned) {
                alert('Ya aprendiste este jutsu!');
                return;
            }

            // NUEVO SISTEMA: Verificar requisitos en lugar de Ryo
            if (jutsu.requirements) {
                const meetsRequirements = this.meetsJutsuRequirements(this.player, jutsu.requirements);
                if (!meetsRequirements) {
                    alert(`❌ No cumples los requisitos para aprender ${jutsu.name}.\nRequisitos: Niv ${jutsu.requirements.level}, Exp mínima ${jutsu.requirements.exp}, Stats: ${JSON.stringify(jutsu.requirements.stats)}`);
                    return;
                }
            }
            
            // Aprender jutsu sin costo
            this.player.learnedJutsus.push(jutsu);
            
            // Remover de desbloqueados si estaba allí
            this.player.unlockedJutsus = this.player.unlockedJutsus.filter(j => j.name !== jutsu.name);
            
            alert(`✅ ¡Has aprendido ${jutsu.name}!`);
            this.updateVillageUI();

            // Refrescar la academia en el rango activo
            const activeRankBtn = document.querySelector('#academy-tab .tabs .tab-btn.active');
            const label = (activeRankBtn?.textContent || 'Genin').toLowerCase().trim();
            const map = { genin: 'genin', chunin: 'chunin', jonin: 'jonin', maestros: 'master' };
            this.showAcademy(map[label] || 'genin');
            this.saveGame();
        },

        showShop() {
            const shopList = document.getElementById('shop-list');
            if (!shopList) {
                console.error('shop-list element not found');
                return;
            }
            
            shopList.innerHTML = '';
            
            // Verificar que el jugador exista
            if (!this.player) {
                shopList.innerHTML = '<div class="shop-empty">Error: No hay jugador activo.</div>';
                return;
            }
            
            if (this.player.isRenegade) {
                shopList.innerHTML = '<div class="shop-empty">🚫 Como Renegado, la Tienda de la Aldea no te atenderá.</div>';
                return;
            }

            // Verificar que shopItems exista
            if (!this.shopItems || !this.shopItems.consumables) {
                shopList.innerHTML = '<div class="shop-empty">Error: No se encontraron datos de la tienda.</div>';
                console.error('shopItems not found', this.shopItems);
                return;
            }

            const festivalNote = this.isFestivalActive() ? ' (🎉 Festival: -50%)' : '';
            
            // Consumables header
            const consumablesHeader = document.createElement('h4');
            consumablesHeader.className = 'shop-section-header';
            consumablesHeader.textContent = `Consumibles${festivalNote}`;
            shopList.appendChild(consumablesHeader);
            
            this.shopItems.consumables.forEach(item => {
                const card = this.createShopCard(item);
                shopList.appendChild(card);
            });
            
            // Weapons header
            const weaponsHeader = document.createElement('h4');
            weaponsHeader.className = 'shop-section-header';
            weaponsHeader.textContent = 'Armas';
            shopList.appendChild(weaponsHeader);
            
            this.shopItems.weapons.forEach(item => {
                const card = this.createShopCard(item);
                shopList.appendChild(card);
            });
            
            // Armor header
            const armorHeader = document.createElement('h4');
            armorHeader.className = 'shop-section-header';
            armorHeader.textContent = 'Armaduras';
            shopList.appendChild(armorHeader);
            
            this.shopItems.armor.forEach(item => {
                const card = this.createShopCard(item);
                shopList.appendChild(card);
            });

            // Accessories header (nuevo)
            if (this.shopItems.accessories && this.shopItems.accessories.length > 0) {
                const accHeader = document.createElement('h4');
                accHeader.className = 'shop-section-header';
                accHeader.textContent = 'Accesorios';
                shopList.appendChild(accHeader);
                
                this.shopItems.accessories.forEach(item => {
                    const card = this.createShopCard(item);
                    shopList.appendChild(card);
                });
            }

            // Scrolls header (nuevo)
            if (this.shopItems.scrolls && this.shopItems.scrolls.length > 0) {
                const scrollsHeader = document.createElement('h4');
                scrollsHeader.className = 'shop-section-header';
                scrollsHeader.textContent = 'Pergaminos';
                shopList.appendChild(scrollsHeader);
                
                this.shopItems.scrolls.forEach(item => {
                    const card = this.createShopCard(item);
                    shopList.appendChild(card);
                });
            }
        },

        createShopCard(item) {
            const card = document.createElement('div');
            card.className = 'shop-item';

            const finalPrice = this.applyPriceDiscount(item.price);
            const priceHtml = finalPrice < item.price
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
            if (this.player.isRenegade) {
                alert('🚫 Como Renegado, no puedes comprar en la Tienda de la Aldea.');
                return;
            }
            if (this.player.location !== 'konoha') {
                alert('La tienda solo está disponible en Konoha.');
                return;
            }
            if (this.getTimeOfDay() === 3) {
                alert('Es madrugada. La tienda está cerrada.');
                return;
            }

            const finalPrice = this.applyPriceDiscount(item.price);
            if (this.player.ryo < finalPrice) {
                alert('¡No tienes suficiente Ryo!');
                return;
            }
            
            this.player.ryo -= finalPrice;
            
            if (item.effect.hp || item.effect.chakra || item.effect.buff) {
                this.player.inventory.push({ name: item.name, effect: item.effect });
                alert(`¡Compraste ${item.name}! Ahora está en tu inventario.`);
            } else {
                if (item.effect.taijutsu) this.player.taijutsu += item.effect.taijutsu;
                if (item.effect.maxHp) {
                    this.player.maxHp += item.effect.maxHp;
                    this.player.hp += item.effect.maxHp;
                }
                alert(`¡Compraste ${item.name}! Tus stats han mejorado.`);
            }
            
            this.updateVillageUI();
            this.saveGame();
        },

        showTraining() {
            const trainingList = document.getElementById('training-list');
            if (this.player.isRenegade) {
                trainingList.innerHTML = '<div class="story-text">🚫 Como Renegado, no puedes entrenar en el centro de Konoha.</div>';
                return;
            }
            if (this.player.location !== 'konoha') {
                trainingList.innerHTML = '<div class="story-text">📍 El Centro de Entrenamiento solo está disponible en Konoha.</div>';
                return;
            }
            if (this.getTimeOfDay() === 3) {
                trainingList.innerHTML = '<div class="story-text">🌙 Es madrugada. El centro de entrenamiento está cerrado.</div>';
                return;
            }

            trainingList.innerHTML = '';
            
            this.training.forEach(item => {
                const card = document.createElement('div');
                card.className = 'shop-item';

                const finalPrice = this.applyPriceDiscount(item.price);
                const priceHtml = finalPrice < item.price
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
            if (this.player.isRenegade) {
                alert('🚫 Como Renegado, no puedes entrenar en Konoha.');
                return;
            }
            if (this.player.location !== 'konoha') {
                alert('El entrenamiento solo está disponible en Konoha.');
                return;
            }
            if (this.getTimeOfDay() === 3) {
                alert('Es madrugada. El centro de entrenamiento está cerrado.');
                return;
            }

            const finalPrice = this.applyPriceDiscount(item.price);
            if (this.player.ryo < finalPrice) {
                alert('¡No tienes suficiente Ryo!');
                return;
            }
            
            // Fatiga por entrenamiento
            this.addFatigue(8);
            // El tiempo avanza naturalmente en el sistema basado en tiempo real

            this.player.ryo -= finalPrice;

            // Efectividad por estación
            let eff = 1;
            if (this.player.season === 'primavera') eff = 1.1;
            if (this.player.season === 'invierno') eff = 0.9;
            
            if (item.effect.taijutsu) this.player.taijutsu += Math.max(1, Math.floor(item.effect.taijutsu * eff));
            if (item.effect.ninjutsu) this.player.ninjutsu += Math.max(1, Math.floor(item.effect.ninjutsu * eff));
            if (item.effect.genjutsu) this.player.genjutsu += Math.max(1, Math.floor(item.effect.genjutsu * eff));
            if (item.effect.maxChakra) {
                const gain = Math.max(1, Math.floor(item.effect.maxChakra * eff));
                this.player.maxChakra += gain;
                this.player.chakra += gain;
            }
            if (item.effect.maxHp) {
                const gain = Math.max(1, Math.floor(item.effect.maxHp * eff));
                this.player.maxHp += gain;
                this.player.hp += gain;
            }
            
            // Verificar desbloqueos de jutsus cuando subes stats
            this.checkJutsuUnlocks(this.player);
            
            alert(`¡Entrenamiento completado! ${item.name}`);
            this.updateVillageUI();
            this.saveGame();
        },

        showStats() {
            console.log('showStats called');
            const statsDisplay = document.getElementById('stats-display');
            if (!statsDisplay) {
                console.error('stats-display element not found');
                return;
            }
            if (!this.player) {
                statsDisplay.innerHTML = '<div class="shop-empty">Error: No hay jugador activo.</div>';
                return;
            }
            console.log('Rendering stats for:', this.player.name);
            statsDisplay.innerHTML = `
                <div class="player-info">
                    <h3 style="color: var(--accent-primary);">${this.getPlayerDisplayName()}</h3>
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
                    <div style="margin-top: 20px;">
                        <h4 style="color: var(--accent-primary);">📚 Jutsus Aprendidos (${this.player.learnedJutsus.length})</h4>
                        ${this.player.learnedJutsus.length === 0 ? '<p>Ninguno - Ve a la Academia</p>' : 
                            this.player.learnedJutsus.map(jutsu => `<div class="stat">${jutsu.name} [${jutsu.rank}]</div>`).join('')}
                    </div>
                    <div style="margin-top: 20px;">
                        <h4 style="color: var(--accent-primary);">🎒 Inventario (${this.player.inventory.length})</h4>
                        ${this.player.inventory.length === 0 ? '<p>Vacío</p>' : 
                            this.player.inventory.map((item, idx) => `
                                <div class="stat" style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
                                    <span>${item.name}</span>
                                    <button class="btn btn-small btn-secondary" onclick="game.useInventoryItem(${idx})">Usar</button>
                                </div>
                            `).join('')}
                    </div>
                </div>
            `;
        },

        saveGame: SaveSystem.saveGame,
        loadGame: SaveSystem.loadGame,
        deleteSave: SaveSystem.deleteSave,
        migratePlayerSave: SaveSystem.migratePlayerSave,
        startMission(mission) {
            console.log('🔔 startMission called with:', mission);
            
            if (!mission) {
                console.error('❌ No mission provided');
                alert('Error: Misión no encontrada');
                return;
            }
            
            console.log('✅ Mission data valid');
            
            // Calcular recompensas estimadas
            const team = this.getTeamBonuses();
            const nightRyoMult = this.getTimeOfDay() === 2 ? 1.2 : 1;
            const estRyo = Math.floor(mission.ryo * (team.missionRyoMult || 1) * nightRyoMult);
            const estExp = Math.floor(mission.exp * (team.missionExpMult || 1));
            
            // Construir mensaje de confirmación
            const message = `📜 ${mission.name}\n\n${mission.description || mission.narrator || 'Una misión te espera.'}\n\n🎖️ Rango: ${mission.rank || 'D'}\n💰 Recompensa: ${estRyo} Ryo\n✨ Experiencia: ${estExp} EXP\n\n¿Aceptar esta misión?`;
            
            console.log('💬 Showing confirmation dialog');
            
            // Usar confirm nativo del navegador (siempre funciona)
            const accepted = confirm(message);
            console.log('🗳️ User choice:', accepted ? 'ACCEPTED' : 'REJECTED');
            
            if (accepted) {
                console.log('✅ Mission accepted, calling _executeMission');
                this._executeMission(mission);
            } else {
                console.log('❌ Mission rejected by user');
            }
        },

        showMissionBriefing(mission) {
            console.log('showMissionBriefing called with:', mission);
            const briefingScreen = document.getElementById('mission-briefing-screen');
            const titleEl = document.getElementById('briefing-title');
            const narratorEl = document.getElementById('briefing-narrator-text');
            const rankEl = document.getElementById('briefing-rank');
            const ryoEl = document.getElementById('briefing-ryo');
            const expEl = document.getElementById('briefing-exp');

            if (!briefingScreen) {
                console.error('mission-briefing-screen not found');
                return;
            }

            titleEl.textContent = mission.name;
            narratorEl.textContent = mission.narrator || 'Se requiere completar esta misión. Prepárate para el combate.';
            rankEl.textContent = mission.rank;
            ryoEl.textContent = mission.ryo;
            expEl.textContent = mission.exp;

            console.log('Calling showScreen for mission-briefing-screen');
            this.showScreen('mission-briefing-screen');
        },

        acceptMissionFromBriefing() {
            console.log('acceptMissionFromBriefing called');
            if (!this.pendingMission) {
                console.warn('No pending mission to accept');
                return;
            }
            const mission = this.pendingMission;
            this.pendingMission = null;
            console.log('Executing mission:', mission.name);
            this._executeMission(mission);
        },

        cancelMissionBriefing() {
            console.log('cancelMissionBriefing called');
            this.pendingMission = null;
            this.showScreen('village-screen');
            this.showSection('home');
        },

        _executeMission(mission) {
            console.log('🚀 _executeMission called with:', mission);
            
            if (!this.player) {
                console.error('❌ No player found!');
                return;
            }
            
            console.log('✅ Player found:', this.player.name);

            // Fatiga por misión
            this.addFatigue(15);

            // Clonar misión para no mutar el catálogo
            const clonedMission = {
                ...mission,
                enemies: Array.isArray(mission.enemies) ? mission.enemies.map(g => ({ ...g })) : []
            };
            
            console.log('📋 Cloned mission:', clonedMission);
            console.log('👹 Mission enemies:', clonedMission.enemies);

            // Costo de tiempo (turnos) por complejidad - solo para cálculo de dificultad
            const rank = (clonedMission.rank || '').toUpperCase();
            const turnCostByRank = { D: 1, C: 2, B: 3, A: 4, S: 4 };
            const turnCost = clonedMission.turns ?? (turnCostByRank[rank] ?? 2);
            // El tiempo avanza naturalmente en el sistema basado en tiempo real
            // No llamamos a advanceTurns() - el tiempo pasa solo

            // Bonus por misión nocturna
            const isNight = this.getTimeOfDay() === 2;
            const nightRyoMult = isNight ? 1.2 : 1;

            // Bonus por equipo
            const team = this.getTeamBonuses();
            const ryoMult = (team.missionRyoMult || 1) * nightRyoMult;
            const expMult = (team.missionExpMult || 1);

            clonedMission.ryo = Math.floor(clonedMission.ryo * ryoMult);
            clonedMission.exp = Math.floor(clonedMission.exp * expMult);

            this.currentMission = clonedMission;
            this.enemyQueue = [];
            
            console.log('🏪 Available enemies catalog:', this.enemies ? 'Available' : 'NOT FOUND');
            
            // Crear cola de enemigos basado en la misión
            if (!clonedMission.enemies || clonedMission.enemies.length === 0) {
                console.error('❌ Mission has no enemies defined!');
                alert('Error: Esta misión no tiene enemigos configurados.');
                return;
            }
            
            clonedMission.enemies.forEach(enemyGroup => {
                console.log('Processing enemy group:', enemyGroup);
                for (let i = 0; i < enemyGroup.count; i++) {
                    if (!this.enemies || !this.enemies[enemyGroup.type] || !this.enemies[enemyGroup.type][enemyGroup.index]) {
                        console.error(`❌ Enemy not found: ${enemyGroup.type}[${enemyGroup.index}]`);
                        continue;
                    }
                    const enemyTemplate = this.enemies[enemyGroup.type][enemyGroup.index];
                    this.enemyQueue.push({ ...enemyTemplate, maxHp: enemyTemplate.hp, maxChakra: enemyTemplate.chakra });
                }
            });
            
            console.log('👥 Enemy queue created:', this.enemyQueue.length, 'enemies');
            
            if (this.enemyQueue.length === 0) {
                console.error('❌ Enemy queue is empty!');
                alert('Error: No se pudieron cargar los enemigos.');
                return;
            }
            
            this.totalWaves = this.enemyQueue.length;
            this.currentWave = 1;
            
            // Iniciar con el primer enemigo
            this.currentEnemy = this.enemyQueue.shift();
            console.log('⚔️ Starting combat with:', this.currentEnemy.name);
            this.startCombat();
        },

        startCombat() {
            console.log('⚔️ startCombat called');
            console.log('🎮 Current enemy:', this.currentEnemy);
            console.log('📺 Calling showScreen(combat-screen)');
            
            this.showScreen('combat-screen');
            
            console.log('🔍 Combat screen should be visible now');
            
            this.combatLog = [];
            const combatLogEl = document.getElementById('combat-log');
            if (combatLogEl) {
                combatLogEl.innerHTML = '';
            } else {
                console.error('❌ combat-log element not found!');
            }
            
            this.kawairimiUsed = false;
            this.defendActive = false;
            
            const playerNameEl = document.getElementById('combat-player-name');
            const enemyNameEl = document.getElementById('enemy-name');
            const enemyStatsEl = document.getElementById('enemy-stats');
            
            if (!playerNameEl || !enemyNameEl || !enemyStatsEl) {
                console.error('❌ Combat UI elements not found!', {
                    playerName: !!playerNameEl,
                    enemyName: !!enemyNameEl,
                    enemyStats: !!enemyStatsEl
                });
            }
            
            if (playerNameEl) playerNameEl.textContent = this.getPlayerDisplayName();
            if (enemyNameEl) {
                enemyNameEl.textContent = this.currentEnemy.name + 
                    (this.totalWaves > 1 ? ` (${this.currentWave}/${this.totalWaves})` : '');
            }
            if (enemyStatsEl) {
                enemyStatsEl.textContent = `⚔️ Ataque: ${this.currentEnemy.attack} | 🛡️ Defensa: ${this.currentEnemy.defense} | 🎯 Precisión: +${this.currentEnemy.accuracy}`;
            }
            
            this.updateBar('combat-player-health-bar', this.player.hp, this.player.maxHp, 'HP');
            this.updateBar('combat-player-chakra-bar', this.player.chakra, this.player.maxChakra, 'Chakra');
            this.updateBar('enemy-health-bar', this.currentEnemy.hp, this.currentEnemy.maxHp, 'HP');
            
            if (this.currentWave === 1) {
                if (this.currentMission && this.currentMission.isTravelEncounter) {
                    this.addCombatLog('⚠️ Encuentro durante el viaje.', 'log-special');
                } else {
                    this.addCombatLog(`¡Misión iniciada! ${this.totalWaves > 1 ? this.totalWaves + ' enemigos detectados!' : 'Un enemigo aparece!'}`, 'log-special');
                }
            }
            this.addCombatLog(`¡${this.currentEnemy.name} aparece!`, 'log-attack');
            
            this.combatTurn = 'player';
            this.enableCombatButtons();
            
            console.log('✅ startCombat completed');
        },

        addCombatLog(message, className = '') {
            const log = document.getElementById('combat-log');
            const entry = document.createElement('div');
            entry.className = `log-entry ${className}`;
            entry.innerHTML = message;
            log.appendChild(entry);
            log.scrollTop = log.scrollHeight;
        },

        enableCombatButtons() {
            document.getElementById('attack-btn').disabled = false;
            document.getElementById('jutsu-menu-btn').disabled = false;
            document.getElementById('genjutsu-btn').disabled = false;
            document.getElementById('defend-btn').disabled = false;
            document.getElementById('kawarimi-btn').disabled = this.kawairimiUsed;
            document.getElementById('item-btn').disabled = false;
        },

        disableCombatButtons() {
            document.getElementById('attack-btn').disabled = true;
            document.getElementById('jutsu-menu-btn').disabled = true;
            document.getElementById('genjutsu-btn').disabled = true;
            document.getElementById('defend-btn').disabled = true;
            document.getElementById('kawarimi-btn').disabled = true;
            document.getElementById('item-btn').disabled = true;
        },

        basicAttack() {
            if (this.combatTurn !== 'player') return;

            if (this.checkFatigueFaint()) return;
            
            this.disableCombatButtons();
            document.getElementById('jutsu-selection').style.display = 'none';
            document.getElementById('combat-inventory').style.display = 'none';

            // Animación de ataque del jugador
            const playerSprite = document.getElementById('combat-player-sprite');
            if (playerSprite) {
                playerSprite.classList.remove('attack-animation');
                void playerSprite.offsetWidth;
                playerSprite.classList.add('attack-animation');
            }

            const stats = this.getEffectiveStats();

            const attackRoll = this.rollDice(20);
            const isCrit = attackRoll === 20 || (this.rollDice(100) <= (this.player.critChance || 0));
            const totalAttack = attackRoll + stats.taijutsu;
            const enemyDefense = 10 + this.currentEnemy.defense;

            this.addCombatLog(`Atacas con Taijutsu: <span class=\"dice-roll\">${attackRoll}</span> + ${stats.taijutsu} = ${totalAttack}`, 'log-attack');

            if (totalAttack >= enemyDefense || isCrit) {
                const damageRoll = this.rollDice(8);
                let damage = Math.max(1, damageRoll + Math.floor(stats.taijutsu / 2) + (stats.combatDamageBonus || 0));
                
                if (isCrit) {
                    damage *= 2;
                    this.addCombatLog('¡CRÍTICO! Daño duplicado', 'log-special');
                }
                
                this.currentEnemy.hp -= damage;
                // Animación de daño al enemigo
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
                        this.updateBar('enemy-health-bar', this.currentEnemy.hp, this.currentEnemy.maxHp, 'HP');
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
            const menu = document.getElementById('jutsu-selection');
            const inventory = document.getElementById('combat-inventory');
            inventory.style.display = 'none';
            
            if (menu.style.display === 'none') {
                menu.style.display = 'block';
                this.loadJutsuList();
            } else {
                menu.style.display = 'none';
            }
        },

        loadJutsuList() {
            const jutsuList = document.getElementById('jutsu-list');
            const slotsEl = document.getElementById('quick-jutsu-slots');
            const hintEl = document.getElementById('quick-jutsu-hint');
            jutsuList.innerHTML = '';
            if (slotsEl) slotsEl.innerHTML = '';
            
            if (this.player.learnedJutsus.length === 0) {
                jutsuList.innerHTML = '<p>No has aprendido jutsus. Ve a la Academia.</p>';
                return;
            }

            if (!Array.isArray(this.player.quickJutsus)) {
                this.player.quickJutsus = Array(5).fill(null);
            }
            if (this.player.quickJutsus.length !== 5) {
                this.player.quickJutsus = Array.from({ length: 5 }, (_, i) => this.player.quickJutsus[i] || null);
            }

            this.selectedJutsuSlot = Number.isInteger(this.selectedJutsuSlot) ? this.selectedJutsuSlot : null;
            if (hintEl) {
                hintEl.textContent = this.selectedJutsuSlot === null
                    ? 'Selecciona un slot y asigna abajo'
                    : `Slot ${this.selectedJutsuSlot + 1} seleccionado`;
            }

            if (slotsEl) {
                this.player.quickJutsus.forEach((name, index) => {
                    const jutsu = this.player.learnedJutsus.find(j => j.name === name);
                    const slot = document.createElement('button');
                    slot.className = `jutsu-quick-slot${this.selectedJutsuSlot === index ? ' selected' : ''}`;
                    slot.type = 'button';
                    slot.innerHTML = jutsu
                        ? `<strong>${jutsu.name}</strong><span>💙 ${jutsu.chakra}</span><span class="slot-clear" data-slot="${index}">✖</span>`
                        : `<strong>Slot ${index + 1}</strong><span>Vacío</span>`;

                    slot.addEventListener('click', () => {
                        if (jutsu) {
                            this.useJutsu(jutsu);
                            return;
                        }
                        this.selectedJutsuSlot = index;
                        this.loadJutsuList();
                    });

                    slotsEl.appendChild(slot);
                });

                slotsEl.querySelectorAll('.slot-clear').forEach(clearBtn => {
                    clearBtn.addEventListener('click', (event) => {
                        event.stopPropagation();
                        const slotIndex = Number(clearBtn.getAttribute('data-slot'));
                        if (!Number.isInteger(slotIndex)) return;
                        this.player.quickJutsus[slotIndex] = null;
                        this.saveGame();
                        this.loadJutsuList();
                    });
                });
            }
            
            this.player.learnedJutsus.forEach(jutsu => {
                const entry = document.createElement('div');
                entry.className = 'jutsu-entry';

                const btn = document.createElement('button');
                btn.className = 'jutsu-btn';
                btn.disabled = this.player.chakra < jutsu.chakra;
                btn.onclick = () => this.useJutsu(jutsu);
                
                btn.innerHTML = `
                    <h4>${jutsu.name}</h4>
                    <p style="font-size: 0.85em;">${jutsu.description}</p>
                    <p style="color: #3498db; margin-top: 5px;">💙 ${jutsu.chakra} Chakra</p>
                    ${jutsu.damage > 0 ? `<p style="color: #e74c3c;">⚔️ ${jutsu.damage} daño</p>` : ''}
                `;

                const assignBtn = document.createElement('button');
                assignBtn.className = 'btn-utility jutsu-assign-btn';
                assignBtn.textContent = 'Asignar a slot';
                assignBtn.addEventListener('click', (event) => {
                    event.stopPropagation();
                    let targetIndex = Number.isInteger(this.selectedJutsuSlot) ? this.selectedJutsuSlot : -1;
                    if (targetIndex === -1) {
                        targetIndex = this.player.quickJutsus.findIndex(slot => !slot);
                    }
                    if (targetIndex === -1) {
                        alert('Selecciona un slot para reemplazar.');
                        return;
                    }
                    this.player.quickJutsus[targetIndex] = jutsu.name;
                    this.selectedJutsuSlot = targetIndex;
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

            // Animación de jutsu del jugador
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

            if (jutsu.isKinjutsu && jutsu.effect) {
                this.increaseWantedLevel(1);

                if (jutsu.effect === 'suicide_kill') {
                    this.currentEnemy.hp = 0;
                    this.player.hp = Math.max(1, Math.floor(this.player.hp * 0.5));
                    this.updateBar('combat-player-health-bar', this.player.hp, this.player.maxHp, 'HP');
                    this.updateBar('enemy-health-bar', this.currentEnemy.hp, this.currentEnemy.maxHp, 'HP');
                    this.addCombatLog('☠️ Sacrificio activado. El enemigo cae.', 'log-special');
                    this.winCombat();
                    return;
                }

                if (jutsu.effect === 'immortal_reflect') {
                    this.player.jashinTurns = 3;
                    this.player.jashinReflect = 0.35;
                    this.addCombatLog('🩸 Ritual de Jashin: inmortalidad temporal y reflejo de daño.', 'log-special');
                }

                if (jutsu.effect === 'control') {
                    this.currentEnemy.controlledTurns = 2;
                    this.addCombatLog('👁️ El enemigo queda controlado (pierde acciones).', 'log-special');
                }

                if (jutsu.effect === 'izanagi') {
                    // Si es Izanagi diario, requiere estar listo.
                    if (this.player.hasDailyIzanagi && !this.player.dailyIzanagiReady) {
                        this.addCombatLog('👁️ No tienes Izanagi diario disponible hoy.', 'log-miss');
                    } else {
                        this.player.izanagiAvailable = true;
                        this.player.izanagiUsed = false;
                        if (this.player.hasDailyIzanagi) {
                            this.player.dailyIzanagiReady = false;
                            this.addCombatLog('👁️ Izanagi diario activado (se consume por hoy).', 'log-special');
                        }
                    }
                }

                if (jutsu.effect === 'steal_kg') {
                    this.player.pendingStealKg = true;
                    this.addCombatLog('📌 Marca colocada: intentarás robar un Kekkei Genkai al finalizar.', 'log-special');
                }

                if (jutsu.effect === 'revive') {
                    this.player.edoAllyTurns = 1;
                    this.addCombatLog('🧟 Edo Tensei: un aliado temporal te asistirá.', 'log-special');
                }
            }
            
            if (jutsu.damage > 0) {
                const damage = jutsu.damage + Math.floor(stats.ninjutsu / 2);
                this.currentEnemy.hp -= damage;
                this.addCombatLog(`¡Infliges ${damage} de daño!`, 'log-damage');
                this.updateBar('enemy-health-bar', this.currentEnemy.hp, this.currentEnemy.maxHp, 'HP');
                
                if (this.currentEnemy.hp <= 0) {
                    if (this.currentMission?.friendlyBattle) {
                        this.currentEnemy.hp = 1;
                        this.updateBar('enemy-health-bar', this.currentEnemy.hp, this.currentEnemy.maxHp, 'HP');
                        this.finishFriendlyBattle(true);
                        return;
                    }
                    this.winCombat();
                    return;
                }
            }
            
            setTimeout(() => this.enemyTurn(), 1500);
        },

        useGenjutsu() {
            if (this.combatTurn !== 'player') return;

            if (this.checkFatigueFaint()) return;
            
            if (this.player.chakra < 30) {
                alert('No tienes suficiente chakra!');
                return;
            }
            
            this.player.chakra -= 30;
            this.updateBar('combat-player-chakra-bar', this.player.chakra, this.player.maxChakra, 'Chakra');
            
            this.disableCombatButtons();
            document.getElementById('jutsu-selection').style.display = 'none';
            document.getElementById('combat-inventory').style.display = 'none';

            const stats = this.getEffectiveStats();

            const genjutsuRoll = this.rollDice(20) + stats.genjutsu;
            const enemyResist = this.rollDice(20) + (this.currentEnemy.genjutsu || 5);
            
            this.addCombatLog(`Lanzas Genjutsu: <span class="dice-roll">${genjutsuRoll}</span> vs ${enemyResist}`, 'log-special');
            
            if (genjutsuRoll > enemyResist) {
                this.addCombatLog('¡El enemigo está aturdido! Pierde su turno.', 'log-special');
                setTimeout(() => {
                    this.combatTurn = 'player';
                    this.enableCombatButtons();
                }, 1500);
            } else {
                this.addCombatLog('¡El enemigo resistió el Genjutsu!', 'log-miss');
                setTimeout(() => this.enemyTurn(), 1500);
            }
        },

        defend() {
            if (this.combatTurn !== 'player') return;

            if (this.checkFatigueFaint()) return;
            
            this.disableCombatButtons();
            document.getElementById('jutsu-selection').style.display = 'none';
            document.getElementById('combat-inventory').style.display = 'none';
            
            this.defendActive = true;
            const chakraRegen = 20 + (this.player.chakraRegen || 0);
            this.player.chakra = Math.min(this.player.chakra + chakraRegen, this.player.maxChakra);
            
            this.addCombatLog(`Te defiendes y recuperas ${chakraRegen} chakra.`, 'log-heal');
            this.updateBar('combat-player-chakra-bar', this.player.chakra, this.player.maxChakra, 'Chakra');
            
            setTimeout(() => this.enemyTurn(), 1500);
        },

        useKawarimi() {
            if (this.kawairimiUsed) {
                alert('Ya usaste Kawarimi en este combate!');
                return;
            }
            
            this.kawairimiUsed = true;
            this.addCombatLog('¡Preparas Kawarimi! Evitarás el próximo ataque.', 'log-special');
            document.getElementById('kawarimi-btn').disabled = true;
        },

        showInventoryInCombat() {
            const menu = document.getElementById('combat-inventory');
            const jutsuMenu = document.getElementById('jutsu-selection');
            jutsuMenu.style.display = 'none';
            
            if (menu.style.display === 'none') {
                menu.style.display = 'block';
                this.loadCombatInventory();
            } else {
                menu.style.display = 'none';
            }
        },

        loadCombatInventory() {
            const itemsList = document.getElementById('combat-items-list');
            itemsList.innerHTML = '';
            
            if (this.player.inventory.length === 0) {
                itemsList.innerHTML = '<p>No tienes items.</p>';
                return;
            }
            
            this.player.inventory.forEach((item, index) => {
                const btn = document.createElement('button');
                btn.className = 'btn btn-small';
                btn.style.width = '100%';
                btn.style.marginBottom = '5px';
                btn.onclick = () => this.useItemInCombat(index);
                btn.textContent = item.name;
                itemsList.appendChild(btn);
            });
        },

        useItemInCombat(index) {
            const item = this.player.inventory[index];
            
            if (item.effect.hp) {
                this.player.hp = Math.min(this.player.hp + item.effect.hp, this.player.maxHp);
                this.addCombatLog(`Usas ${item.name} y recuperas ${item.effect.hp} HP.`, 'log-heal');
                this.updateBar('combat-player-health-bar', this.player.hp, this.player.maxHp, 'HP');
            }
            
            if (item.effect.chakra) {
                this.player.chakra = Math.min(this.player.chakra + item.effect.chakra, this.player.maxChakra);
                this.addCombatLog(`Recuperas ${item.effect.chakra} Chakra.`, 'log-heal');
                this.updateBar('combat-player-chakra-bar', this.player.chakra, this.player.maxChakra, 'Chakra');
            }

            // Fatiga (algunos consumibles)
            if ((item.name || '').toLowerCase().includes('ramen')) {
                this.reduceFatigue(10);
                this.addCombatLog('🍜 Te sientes mejor: -10% fatiga.', 'log-heal');
            }

            if (item.effect.buffAll) {
                const turns = Math.max(1, item.effect.buffTurns || 3);
                this.player.combatBuff = { all: item.effect.buffAll, turns, backlashHp: item.effect.backlashHp || 0 };
                this.addCombatLog(`💊 Potenciación ilegal: +${item.effect.buffAll} a todos los stats por ${turns} turnos.`, 'log-special');
            }
            
            this.player.inventory.splice(index, 1);
            document.getElementById('combat-inventory').style.display = 'none';
            
            this.disableCombatButtons();
            setTimeout(() => this.enemyTurn(), 1500);
        },

        enemyTurn() {
            this.combatTurn = 'enemy';

            // Animación de ataque del enemigo
            const enemySprite = document.getElementById('enemy-sprite');
            if (enemySprite) {
                enemySprite.classList.remove('attack-animation');
                void enemySprite.offsetWidth;
                enemySprite.classList.add('attack-animation');
            }

            if (this.currentEnemy && this.currentEnemy.controlledTurns > 0) {
                this.currentEnemy.controlledTurns -= 1;
                this.addCombatLog('🧠 El enemigo está controlado y pierde su turno.', 'log-special');
                this.combatTurn = 'player';
                this.enableCombatButtons();
                return;
            }

            if (this.player.edoAllyTurns > 0) {
                const allyDmg = 80 + Math.floor((this.player.ninjutsu || 0) / 2);
                this.currentEnemy.hp -= allyDmg;
                this.addCombatLog(`🧟 Tu aliado invocado ataca y causa ${allyDmg} daño.`, 'log-damage');
                this.updateBar('enemy-health-bar', this.currentEnemy.hp, this.currentEnemy.maxHp, 'HP');
                this.player.edoAllyTurns -= 1;
                if (this.currentEnemy.hp <= 0) {
                    this.winCombat();
                    return;
                }
            }

            const attacks = Array.isArray(this.currentEnemy?.doubleAttack?.attacks)
                ? this.currentEnemy.doubleAttack.attacks
                : [null];

            this.addCombatLog(
                attacks.length > 1
                    ? `${this.currentEnemy.name} ataca... (x${attacks.length})`
                    : `${this.currentEnemy.name} ataca...`,
                'log-attack'
            );

            const stats = this.getEffectiveStats();
            let playerDefense = 10 + Math.floor(stats.taijutsu / 2);
            if (stats.teamEvasionBonus > 0) {
                playerDefense += Math.floor(playerDefense * stats.teamEvasionBonus);
            }
            
            if (this.defendActive) {
                playerDefense += 5;
                this.defendActive = false;
            }

            setTimeout(() => {
                if (this.kawairimiUsed && !this.player.kawairimiActivated) {
                    this.addCombatLog('¡Usas Kawarimi! Te sustituyes y evitas el ataque.', 'log-special');
                    this.player.kawairimiActivated = true;
                    
                    this.combatTurn = 'player';
                    this.enableCombatButtons();
                    return;
                }
                
                const examMeta = this.currentMission?.examMeta;

                for (let i = 0; i < attacks.length; i++) {
                    const part = attacks[i] || {};
                    const partAttack = Number.isFinite(part.attack) ? part.attack : this.currentEnemy.attack;
                    const partAcc = Number.isFinite(part.accuracy) ? part.accuracy : (this.currentEnemy.accuracy || 0);

                    const attackRoll = this.rollDice(20);
                    const totalAttack = attackRoll + partAttack + partAcc;
                    this.addCombatLog(`Enemigo tira: <span class="dice-roll">${attackRoll}</span> + ${partAttack} + ${partAcc} = ${totalAttack} vs Defensa ${playerDefense}`, 'log-attack');

                    if (totalAttack >= playerDefense) {
                        const baseDamage = this.rollDice(8) + this.rollDice(6);
                        const damage = Math.max(1, baseDamage + Math.floor(partAttack / 1.5));

                        // Jonin Test 3: proteger aliados (25% de probabilidad de que golpeen a un aliado)
                        if (examMeta?.protectAllies && this.player?.examState?.active && this.player.examState.type === 'jonin') {
                            const allies = this.player.examState.data?.allies;
                            if (Array.isArray(allies) && allies.length > 0 && Math.random() < 0.25) {
                                const ally = allies[Math.floor(Math.random() * allies.length)];
                                const allyDamage = Math.max(1, Math.floor(damage * 0.9));
                                ally.hp = Math.max(0, (ally.hp || 0) - allyDamage);
                                this.addCombatLog(`⚠️ ${this.currentEnemy.name} golpea a ${ally.name}: -${allyDamage} HP.`, 'log-damage');
                                this.saveGame();
                                if (ally.hp <= 0) {
                                    this.addCombatLog(`❌ ${ally.name} cae.`, 'log-damage');
                                    this.handleExamFightDefeat();
                                    return;
                                }
                                continue;
                            }
                        }

                        this.player.hp -= damage;

                        if (this.player.jashinTurns > 0) {
                            const reflect = Math.max(1, Math.floor(damage * (this.player.jashinReflect || 0.3)));
                            this.currentEnemy.hp -= reflect;
                            this.addCombatLog(`🩸 Reflejas ${reflect} de daño al enemigo.`, 'log-special');
                            this.updateBar('enemy-health-bar', this.currentEnemy.hp, this.currentEnemy.maxHp, 'HP');
                            if (this.currentEnemy.hp <= 0) {
                                this.winCombat();
                                return;
                            }
                        }

                        this.addCombatLog(`¡Te golpean duramente! Recibes ${damage} de daño.`, 'log-damage');
                        this.updateBar('combat-player-health-bar', this.player.hp, this.player.maxHp, 'HP');

                        if (this.player.hp <= 0 && this.player.izanagiAvailable && !this.player.izanagiUsed) {
                            this.player.izanagiUsed = true;
                            this.player.izanagiAvailable = false;
                            this.player.hp = this.player.maxHp;
                            this.player.chakra = Math.min(this.player.maxChakra, this.player.chakra + 50);
                            this.addCombatLog('👁️ IZANAGI: reescribes la realidad y vuelves con vida.', 'log-special');
                            this.updateBar('combat-player-health-bar', this.player.hp, this.player.maxHp, 'HP');
                            this.updateBar('combat-player-chakra-bar', this.player.chakra, this.player.maxChakra, 'Chakra');
                        }

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

                        if (this.player.hp <= 0 && this.currentMission?.isExamFight) {
                            this.handleExamFightDefeat();
                            return;
                        }

                        if (this.player.hp <= 0) {
                            this.defeat();
                            return;
                        }
                    } else {
                        this.addCombatLog('¡Esquivas el ataque!', 'log-miss');
                    }
                }

                if (this.player.combatBuff && this.player.combatBuff.turns) {
                    this.player.combatBuff.turns -= 1;
                    if (this.player.combatBuff.turns <= 0) {
                        if (this.player.combatBuff.backlashHp) {
                            this.player.hp = Math.max(1, this.player.hp - this.player.combatBuff.backlashHp);
                            this.addCombatLog(`⚠️ Efecto secundario: -${this.player.combatBuff.backlashHp} HP.`, 'log-damage');
                            this.updateBar('combat-player-health-bar', this.player.hp, this.player.maxHp, 'HP');
                        }
                        this.player.combatBuff = null;
                    }
                }
                if (this.player.jashinTurns > 0) this.player.jashinTurns -= 1;

                this.combatTurn = 'player';
                this.enableCombatButtons();
            }, 1000);
        },

        winCombat() {
            this.addCombatLog(`¡${this.currentEnemy.name} ha sido derrotado!`, 'log-heal');
            // Animación de victoria
            const combatScreen = document.getElementById('combat-screen');
            if (combatScreen) {
                combatScreen.classList.remove('victory-animation');
                void combatScreen.offsetWidth;
                combatScreen.classList.add('victory-animation');
            }

            // Fatiga por combate
            this.addFatigue(10);
            
            // Ganar recompensas parciales por cada enemigo
            const expPerEnemy = Math.floor(this.currentMission.exp / this.totalWaves);
            const ryoPerEnemy = Math.floor(this.currentMission.ryo / this.totalWaves);
            
            this.player.exp += expPerEnemy;
            this.player.totalExp = (this.player.totalExp || 0) + expPerEnemy;
            this.player.ryo += ryoPerEnemy;
            this.player.combatsWon++;

            // Cura entre combates (Sakura)
            const stats = this.getEffectiveStats();
            if (stats.betweenCombatHealPct > 0 && !this.currentMission?.examMeta?.noBetweenHeal) {
                const heal = Math.max(1, Math.floor(this.player.maxHp * stats.betweenCombatHealPct));
                this.player.hp = Math.min(this.player.maxHp, this.player.hp + heal);
                this.addCombatLog(`💗 Tu equipo te asiste y recuperas ${heal} HP.`, 'log-heal');
                this.updateBar('combat-player-health-bar', this.player.hp, this.player.maxHp, 'HP');
            }
            
            this.addCombatLog(`+${expPerEnemy} EXP | +${ryoPerEnemy} Ryo`, 'log-special');
            
            // Verificar si hay más enemigos
            if (this.enemyQueue.length > 0) {
                this.addCombatLog('¡El siguiente enemigo se acerca!', 'log-special');
                
                setTimeout(() => {
                    this.currentWave++;
                    this.currentEnemy = this.enemyQueue.shift();
                    this.kawairimiUsed = false; // Reiniciar Kawarimi para nuevo enemigo
                    this.player.kawairimiActivated = false;
                    this.startCombat();
                }, 2000);
                return;
            }

            // Combate durante viaje: reanudar viaje sin pantalla de victoria
            if (this.currentMission && this.currentMission.isTravelEncounter) {
                this.currentMission = null;
                this.currentEnemy = null;
                this.saveGame();

                setTimeout(() => {
                    this.showScreen('village-screen');
                    this.showSection('home');
                    this.updateVillageUI();
                    if (this.player?.travelState) {
                        this.processNextTravelDay();
                    }
                }, 900);
                return;
            }

            // Examen: volver al flujo del examen sin recompensas/fin de misión normal
            if (this.currentMission && this.currentMission.isExamFight) {
                this.saveGame();
                setTimeout(() => {
                    this.currentMission = null;
                    this.currentEnemy = null;
                    this.enemyQueue = [];
                    this.handleExamFightVictory();
                }, 900);
                return;
            }
            
            // Todos los enemigos derrotados - misión completa
            let kekkeiExpGain = 0;
            if (this.player.kekkeiGenkai) {
                const fullMoonMult = (this.player.day === 15) ? 1.10 : 1;
                kekkeiExpGain = Math.floor((this.currentMission.exp / 2) * fullMoonMult);
                this.player.kekkeiExp += kekkeiExpGain;
                
                const nextLevel = this.player.kekkeiGenkai.levels[this.player.kekkeiLevel];
                if (nextLevel && this.player.kekkeiExp >= nextLevel.exp) {
                    this.levelUpKekkei();
                }
            }
            
            if (this.player.exp >= this.player.expToNext) {
                this.levelUp();
            }

            // Robo de Kekkei Genkai (kinjutsu)
            if (this.player.pendingStealKg && !this.player.kekkeiGenkai) {
                const pool = Array.isArray(this.kekkeiGenkaiList) ? this.kekkeiGenkaiList : [];
                if (pool.length > 0) {
                    const pick = pool[Math.floor(Math.random() * pool.length)];
                    this.player.kekkeiGenkai = pick;
                    this.player.kekkeiLevel = 1;
                    this.player.kekkeiExp = 0;
                    this.applyKekkeiGenkaiBonuses();
                    alert(`🌑 Kinjutsu: robaste un Kekkei Genkai: ${pick.name}`);
                }
                this.player.pendingStealKg = false;
            }

            // Reputación
            if (this.currentMission && this.currentMission.isAnbuHunt) {
                this.player.anbuEliminated += this.totalWaves;
                this.increaseWantedLevel(1);
                this.player.karma = this.clamp((this.player.karma || 0) - 5, -100, 100);
            } else if (this.currentMission && this.currentMission.criminal) {
                this.applyReputationDelta('konoha', -12);
                this.applyReputationDelta(this.player.location, -6);
                this.increaseWantedLevel(1);
                this.player.criminalMissions += 1;
                this.player.karma = this.clamp((this.player.karma || 0) - 8, -100, 100);
            } else if (this.currentMission && this.currentMission.isUrgent) {
                this.applyReputationDelta(this.player.location, 12);
                this.player.urgentMission = null;
            } else {
                this.applyReputationDelta(this.player.location, 5);
            }

            // Relación con NPC (misiones especiales)
            if (this.currentMission && this.currentMission.npcId && this.currentMission.relationshipGain) {
                this.updateRelationship(this.currentMission.npcId, Number(this.currentMission.relationshipGain) || 0);
            }

            // Conteo de misiones por rango (para requisitos de exámenes)
            if (this.currentMission && !this.currentMission.friendlyBattle) {
                const mr = (this.currentMission.rank || '').toUpperCase();
                if (!this.player.missionsCompletedByRank || typeof this.player.missionsCompletedByRank !== 'object') {
                    this.player.missionsCompletedByRank = { D: 0, C: 0, B: 0, A: 0, S: 0, U: 0, F: 0 };
                }
                if (mr) {
                    this.player.missionsCompletedByRank[mr] = (this.player.missionsCompletedByRank[mr] || 0) + 1;
                    this.player.missionsCompletedTotal = (this.player.missionsCompletedTotal || 0) + 1;
                    if (['B', 'A', 'S'].includes(mr)) {
                        this.player.missionsCompletedBPlus = (this.player.missionsCompletedBPlus || 0) + 1;
                    }
                    if (mr === 'S' && this.player.rank === 'Chunin') {
                        this.player.missionsCompletedSWhileChunin = (this.player.missionsCompletedSWhileChunin || 0) + 1;
                    }
                }
            }
            
            // Guardar valores antes del setTimeout para evitar problemas de timing
            const missionName = this.currentMission.name;
            const totalWaves = this.totalWaves;
            const missionExp = this.currentMission.exp;
            const missionRyo = this.currentMission.ryo;
            const hasKekkei = this.player.kekkeiGenkai;

            // Verificar desbloqueos de jutsus después de combate
            this.checkJutsuUnlocks(this.player);
            
            this.saveGame();
            
            console.log('🎉 Victory - mostrando modal en 2 segundos...');
            
            setTimeout(() => {
                console.log('⏰ setTimeout ejecutado, mostrando modal de victoria');
                
                // Mostrar modal de victoria
                const victoryModal = document.getElementById('combat-victory-modal');
                const victoryTextEl = document.getElementById('combat-victory-text');
                const victoryRewardsEl = document.getElementById('combat-victory-rewards');
                const kekkeiExpDiv = document.getElementById('combat-kekkei-exp-gain');
                
                console.log('🔍 Elementos encontrados:', {
                    victoryModal: !!victoryModal,
                    victoryTextEl: !!victoryTextEl,
                    victoryRewardsEl: !!victoryRewardsEl,
                    kekkeiExpDiv: !!kekkeiExpDiv
                });
                
                if (victoryTextEl) {
                    victoryTextEl.innerHTML = `¡Misión "${missionName}" completada!<br>
                        Has derrotado a ${totalWaves} enemigo(s).`;
                }
                
                if (victoryRewardsEl) {
                    victoryRewardsEl.innerHTML = `
                        <div style="color: #00ff88; font-size: 1.1em;">
                            <p>✨ +${missionExp} EXP</p>
                            <p>💰 +${missionRyo} Ryo</p>
                        </div>
                    `;
                }
                
                if (kekkeiExpDiv) {
                    if (hasKekkei && kekkeiExpGain > 0) {
                        kekkeiExpDiv.innerHTML = `<p style="color: #ffd700;">⚡ +${kekkeiExpGain} EXP de Kekkei Genkai</p>`;
                    } else {
                        kekkeiExpDiv.innerHTML = '';
                    }
                }
                
                if (victoryModal) {
                    console.log('✅ Mostrando modal de victoria');
                    victoryModal.style.display = 'flex';
                } else {
                    console.error('❌ Modal de victoria no encontrado');
                }
            }, 2000);
        },

        levelUp() {
            this.player.level++;
            this.player.exp = 0;
            this.player.expToNext = Math.floor(this.player.expToNext * 1.5);
            
            this.player.maxHp += 15;
            this.player.hp = this.player.maxHp;
            this.player.maxChakra += 20;
            this.player.chakra = this.player.maxChakra;
            this.player.taijutsu += 2;
            this.player.ninjutsu += 2;
            this.player.genjutsu += 2;
            
            // Animación de subir de nivel
            const sidebarLevel = document.getElementById('sidebar-level');
            if (sidebarLevel) {
                sidebarLevel.classList.remove('levelup-animation');
                void sidebarLevel.offsetWidth;
                sidebarLevel.classList.add('levelup-animation');
            }
            // Verificar desbloqueos de jutsus cuando subes de nivel
            this.checkJutsuUnlocks(this.player);
            
            alert(`¡NIVEL ${this.player.level}! Todos tus stats han aumentado.`);
        },

        levelUpKekkei() {
            const nextLevel = this.player.kekkeiGenkai.levels[this.player.kekkeiLevel];
            
            if (!nextLevel) return;
            
            this.player.kekkeiLevel++;
            
            // Aplicar bonuses del nuevo nivel
            const newLevelData = this.player.kekkeiGenkai.levels[this.player.kekkeiLevel - 1];
            const prevLevelData = this.player.kekkeiGenkai.levels[this.player.kekkeiLevel - 2];
            
            // Calcular diferencia de bonuses
            if (newLevelData.bonus.all) {
                const diff = newLevelData.bonus.all - (prevLevelData?.bonus.all || 0);
                this.player.taijutsu += diff;
                this.player.ninjutsu += diff;
                this.player.genjutsu += diff;
            }
            
            if (newLevelData.bonus.taijutsu) {
                const diff = newLevelData.bonus.taijutsu - (prevLevelData?.bonus.taijutsu || 0);
                this.player.taijutsu += diff;
            }
            if (newLevelData.bonus.ninjutsu) {
                const diff = newLevelData.bonus.ninjutsu - (prevLevelData?.bonus.ninjutsu || 0);
                this.player.ninjutsu += diff;
            }
            if (newLevelData.bonus.genjutsu) {
                const diff = newLevelData.bonus.genjutsu - (prevLevelData?.bonus.genjutsu || 0);
                this.player.genjutsu += diff;
            }
            
            this.player.critChance = newLevelData.bonus.critChance || 0;
            this.player.chakraRegen = newLevelData.bonus.chakraRegen || 0;
            
            alert(`🌟 ¡${this.player.kekkeiGenkai.name} ha evolucionado!\n\nNuevo nivel: ${newLevelData.name}\n\n¡Tus poderes han aumentado!`);
        },

        returnToVillage() {
            // Limpiar variables de combate/misión
            this.currentMission = null;
            this.currentEnemy = null;
            this.enemyQueue = [];
            this.combatLog = [];
            this.totalWaves = 0;
            this.currentWave = 0;
            
            this.showScreen('village-screen');
            this.showSection('home');
            this.updateVillageUI();
            this.showMissions();
        },

        returnToVillageFromCombat() {
            console.log('🏠 Regresando a la aldea desde combate...');
            // Ocultar todos los modales de combate
            [
                'combat-victory-modal',
                'combat-defeat-modal',
                'combat-victory-text',
                'combat-victory-rewards',
                'combat-kekkei-exp-gain',
                'combat-defeat-text'
            ].forEach(id => {
                const el = document.getElementById(id);
                if (el && el.classList.contains('modal-overlay')) {
                    el.style.display = 'none';
                } else if (el) {
                    el.innerHTML = '';
                }
            });

            // Limpiar variables de combate/misión
            this.currentMission = null;
            this.currentEnemy = null;
            this.enemyQueue = [];
            this.combatLog = [];
            this.totalWaves = 0;
            this.currentWave = 0;

            // Restaurar UI completa
            const header = document.getElementById('game-header');
            const bottomNav = document.getElementById('bottom-nav');
            if (header) {
                header.style.display = '';
                header.classList.add('visible');
            }
            if (bottomNav) {
                bottomNav.style.display = '';
            }

            // Quitar animaciones de combate
            const combatScreen = document.getElementById('combat-screen');
            if (combatScreen) {
                combatScreen.classList.remove('victory-animation', 'defeat-animation');
            }
            const playerSprite = document.getElementById('combat-player-sprite');
            if (playerSprite) {
                playerSprite.classList.remove('attack-animation', 'jutsu-animation');
            }
            const enemySprite = document.getElementById('enemy-sprite');
            if (enemySprite) {
                enemySprite.classList.remove('attack-animation', 'damage-animation');
            }

            console.log('✅ UI restaurada, mostrando village screen');

            // Volver a la aldea
            this.showScreen('village-screen');
            this.showSection('home');
            this.updateVillageUI();
            this.showMissions();
        },

        defeat() {
            console.log('💀 Defeat called');
            // Animación de derrota
            const combatScreen = document.getElementById('combat-screen');
            if (combatScreen) {
                combatScreen.classList.remove('defeat-animation');
                void combatScreen.offsetWidth;
                combatScreen.classList.add('defeat-animation');
            }
            if (this.currentMission?.isExamFight) {
                this.handleExamFightDefeat();
                return;
            }
            if (this.currentMission && this.currentMission.isAnbuHunt && this.player?.isRenegade) {
                alert('⛓️ Has sido capturado por ANBU. Fin de tu camino renegado.');
                try { localStorage.removeItem('ninjaRPGSave'); } catch (e) { /* ignore */ }
            }
            // Guardar nombre de misión antes de acceder en el modal
            const missionName = this.currentMission ? this.currentMission.name : 'Desconocida';
            console.log('🔍 Buscando modal de derrota...');
            // Mostrar modal de derrota
            const defeatModal = document.getElementById('combat-defeat-modal');
            const defeatTextEl = document.getElementById('combat-defeat-text');
            console.log('🔍 Elementos encontrados:', {
                defeatModal: !!defeatModal,
                defeatTextEl: !!defeatTextEl
            });
            if (defeatTextEl) {
                defeatTextEl.innerHTML = `Has caído en batalla durante la misión "${missionName}".<br><br>El camino del ninja es difícil...`;
            }
            if (defeatModal) {
                console.log('✅ Mostrando modal de derrota');
                defeatModal.style.display = 'flex';
            } else {
                console.error('❌ Modal de derrota no encontrado');
            }
        },
    };

    // Check if there's a saved game on load
    window.onload = function() {
        const hasSave = localStorage.getItem('ninjaRPGSave');
        if (!hasSave) {
            document.getElementById('load-btn').style.display = 'none';
        }
    };

    // Transformar jutsus al cargar el juego
    game.normalizeAcademyJutsus();
    };

    // Renderizado de perfil (puente)
    function renderProfile(profile, isOwn) {
        const cont = document.getElementById('profile-content');
        if (!cont || !profile) {
            cont.innerHTML = '<div class="login-error">Perfil no encontrado.</div>';
            return;
        }
        cont.innerHTML = `
            <div class="profile-avatar">${getAvatar(profile)}</div>
            <h2 style="color:${ChatSystem.getMessageColor(profile.kekkei_genkai)}">${profile.display_name}</h2>
            <div>${ChatSystem.getRankBadge(profile.rank)} ${profile.village ? '<span>' + emojiVillage(profile.village) + '</span>' : ''}</div>
            <div>Nivel: ${profile.level || 1}</div>
            <div>Clan: ${profile.clan || '-'}</div>
            <div>Kekkei Genkai: ${profile.kekkei_genkai || '-'}</div>
            <div>Misiones: ${profile.missionsCompletedTotal || 0}</div>
            <div>Combates ganados: ${profile.combatsWon || 0}</div>
            <div>Días jugados: ${profile.daysPlayed || 0}</div>
            <div style="margin:10px 0;">Jutsus: ${(profile.learnedJutsus||[]).map(j=>`<span class='jutsu-pill'>${j.name||j}</span>`).join(' ') || '-'}</div>
            ${isOwn ? '<button class="btn" onclick="game.logout()">Cerrar sesión</button>' : `<button class="btn" onclick="Router.navigate('/chat/${profile.user_id}')">💬 Enviar mensaje</button>`}
        `;
    }
    function getAvatar(profile) {
        // Emoji según clan/kekkei
        if (profile.kekkei_genkai === 'Sharingan') return '👁️';
        if (profile.kekkei_genkai === 'Byakugan') return '👁️‍🦳';
        if (profile.kekkei_genkai === 'Rinnegan') return '🌀';
        if (profile.clan === 'Uchiha') return '🔥';
        if (profile.clan === 'Hyuga') return '🌙';
        if (profile.clan === 'Nara') return '🌑';
        if (profile.clan === 'Yamanaka') return '🌸';
        if (profile.clan === 'Akimichi') return '🍡';
        return '🥷';
    }
    function emojiVillage(v) {
        return {
            konoha: '🌳', suna: '🏜️', kiri: '💧', iwa: '⛰️', kumo: '⚡', ame: '🌧️', bosque: '🌲', olas: '🌊', valle: '🏞️', nieve: '❄️'
        }[v] || '🏘️';
    }


    return game;
