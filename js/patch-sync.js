/**
 * PATCH-SYNC.JS - Parche de sincronización
 * ==========================================
 * Corrige los problemas de navegación entre secciones
 * (Mundo, Inventario, Tienda, Stats) y los botones
 * Aceptar/Cancelar del mission briefing.
 *
 * INSTRUCCIÓN DE USO:
 * Agregar ANTES del cierre </body> en ninjagame.html:
 *   <script src="js/patch-sync.js"></script>
 * (DESPUÉS del <script type="module" src="js/main.js">)
 */

(function () {
    'use strict';

    // ─── Espera a que `game` esté disponible en window ─────────────────────
    function waitForGame(cb, retries = 50) {
        if (typeof window.game !== 'undefined' && window.game.player !== undefined) {
            cb(window.game);
        } else if (retries > 0) {
            setTimeout(() => waitForGame(cb, retries - 1), 200);
        } else {
            console.warn('[patch-sync] game no disponible tras espera máxima');
        }
    }

    // ─── 1. PARCHE NAVEGACIÓN ───────────────────────────────────────────────
    // Reemplaza safeShowSection con versión robusta que no falla silenciosamente
    window.safeShowSection = function (name) {
        if (typeof window.game === 'undefined') {
            setTimeout(() => window.safeShowSection(name), 200);
            return;
        }
        const g = window.game;

        // Cerrar cualquier modal abierto antes de navegar
        ['modal-alert', 'modal-confirm', 'modal-prompt'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });

        // Llamar showSection con fallback manual si falla
        try {
            if (typeof g.showSection === 'function') {
                g.showSection(name);
            } else {
                _manualShowSection(name, g);
            }
        } catch (e) {
            console.error('[patch-sync] showSection error:', e);
            _manualShowSection(name, g);
        }
    };

    function _manualShowSection(name, g) {
        // Ocultar todas las secciones
        document.querySelectorAll('.section-content').forEach(s => s.classList.remove('active'));

        // Activar la sección target
        const target = document.getElementById('section-' + name);
        if (!target) { console.error('[patch-sync] Sección no encontrada: section-' + name); return; }
        target.classList.add('active');

        // Actualizar bottom-nav
        document.querySelectorAll('#bottom-nav .nav-btn').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-tab') === name);
        });

        // Actualizar sidebar
        document.querySelectorAll('#sidebar .sidebar-nav-item').forEach(b => {
            b.classList.toggle('active', b.getAttribute('data-section') === name);
        });

        // Cargar contenido de la sección
        if (!g || !g.player) return;
        try {
            if (name === 'home' && g.updateVillageUI) g.updateVillageUI();
            else if (name === 'world') {
                if (g.updateWorldHUDDisplay) g.updateWorldHUDDisplay();
                if (g.showMissions) g.showMissions();
            } else if (name === 'inventory') {
                if (g.showAcademy) g.showAcademy('genin');
                if (g.showTraining) g.showTraining();
            } else if (name === 'shop') {
                if (g.showShop) g.showShop();
                if (g.updateShopRyoDisplay) g.updateShopRyoDisplay();
            } else if (name === 'statspage') {
                if (g.showStats) g.showStats();
            }
        } catch (e) {
            console.error('[patch-sync] Error cargando contenido de sección:', name, e);
        }
    }

    // ─── 2. PARCHE BOTONES BOTTOM-NAV ──────────────────────────────────────
    document.addEventListener('DOMContentLoaded', function () {

        // Re-vincular bottom-nav con safeShowSection parcheada
        document.querySelectorAll('#bottom-nav .nav-btn').forEach(btn => {
            // Clonar el botón para eliminar listeners anteriores
            const clone = btn.cloneNode(true);
            btn.parentNode.replaceChild(clone, btn);
            clone.addEventListener('click', function () {
                const tab = this.getAttribute('data-tab');
                window.safeShowSection(tab);
            });
        });

        // Re-vincular sidebar nav items
        document.querySelectorAll('#sidebar .sidebar-nav-item').forEach(btn => {
            const clone = btn.cloneNode(true);
            btn.parentNode.replaceChild(clone, btn);
            clone.addEventListener('click', function () {
                const section = this.getAttribute('data-section');
                // Cerrar sidebar
                const sidebar = document.getElementById('sidebar');
                const overlay = document.getElementById('sidebar-overlay');
                if (sidebar) sidebar.classList.remove('open');
                if (overlay) overlay.classList.remove('active');
                window.safeShowSection(section);
            });
        });

        // ─── 3. PARCHE BOTONES ACEPTAR/CANCELAR MISSION BRIEFING ────────────
        // Soporta AMBOS sets de IDs (el original y el nuevo del html/screens/)
        const ACCEPT_IDS = ['accept-mission-btn', 'mission-briefing-accept-btn'];
        const CANCEL_IDS = ['cancel-mission-btn', 'mission-briefing-cancel-btn'];

        ACCEPT_IDS.forEach(id => {
            const btn = document.getElementById(id);
            if (!btn) return;
            const clone = btn.cloneNode(true);
            btn.parentNode.replaceChild(clone, btn);
            clone.addEventListener('click', function () {
                waitForGame(g => {
                    if (g.acceptMissionFromBriefing) {
                        g.acceptMissionFromBriefing();
                    } else {
                        console.error('[patch-sync] acceptMissionFromBriefing no existe en game');
                    }
                });
            });
        });

        CANCEL_IDS.forEach(id => {
            const btn = document.getElementById(id);
            if (!btn) return;
            const clone = btn.cloneNode(true);
            btn.parentNode.replaceChild(clone, btn);
            clone.addEventListener('click', function () {
                waitForGame(g => {
                    if (g.cancelMissionBriefing) {
                        g.cancelMissionBriefing();
                    } else {
                        // Fallback manual
                        g.pendingMission = null;
                        if (g.showScreen) g.showScreen('village-screen');
                        if (g.showSection) g.showSection('world');
                    }
                });
            });
        });

        // ─── 4. PARCHE: Asegurar que showSection no rompa si closeAllModals no existe ──
        waitForGame(g => {
            const originalShowSection = g.showSection?.bind(g);
            if (originalShowSection) {
                g.showSection = function (name) {
                    // Garantizar closeAllModals existe
                    if (!this.closeAllModals) {
                        this.closeAllModals = function () {
                            ['modal-alert', 'modal-confirm', 'modal-prompt'].forEach(id => {
                                const el = document.getElementById(id);
                                if (el) el.style.display = 'none';
                            });
                        };
                    }
                    try {
                        return originalShowSection(name);
                    } catch (e) {
                        console.error('[patch-sync] showSection falló, usando fallback:', e);
                        _manualShowSection(name, g);
                    }
                };
            }

            // ─── 5. PARCHE showMissionBriefing para usar IDs correctos ─────────
            // game.showMissionBriefing usa IDs: briefing-title, briefing-narrator-text, etc.
            // Pero el HTML modular usa: mission-briefing-title, mission-narrator-text, etc.
            // Este parche hace que ambos funcionen (crea alias IDs si los nuevos existen).
            const ID_MAP = {
                'briefing-title': 'mission-briefing-title',
                'briefing-narrator-text': 'mission-narrator-text',
                'briefing-rank': 'mission-briefing-rank',
                'briefing-ryo': 'mission-briefing-ryo',
                'briefing-exp': 'mission-briefing-exp',
            };

            // Si los IDs originales no existen pero los nuevos sí, crear proxies
            Object.entries(ID_MAP).forEach(([oldId, newId]) => {
                if (!document.getElementById(oldId) && document.getElementById(newId)) {
                    // Crear elemento fantasma que redirige a getElementById
                    const ghost = document.createElement('span');
                    ghost.id = oldId;
                    ghost.style.display = 'none';
                    // Proxy para sincronizar textContent
                    const realEl = document.getElementById(newId);
                    Object.defineProperty(ghost, 'textContent', {
                        set(v) { if (realEl) realEl.textContent = v; },
                        get() { return realEl ? realEl.textContent : ''; }
                    });
                    document.body.appendChild(ghost);
                    console.log(`[patch-sync] Alias creado: ${oldId} → ${newId}`);
                }
            });

            // También asegurar que showScreen funcione con ambos formatos de ID del briefing
            const originalShowScreen = g.showScreen?.bind(g);
            if (originalShowScreen) {
                g.showScreen = function (screenId) {
                    try {
                        return originalShowScreen(screenId);
                    } catch (e) {
                        console.error('[patch-sync] showScreen falló:', e);
                        // Fallback manual
                        const fullId = screenId.endsWith('-screen') ? screenId : screenId + '-screen';
                        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
                        const target = document.getElementById(fullId);
                        if (target) {
                            target.classList.add('active');
                            // Mostrar/ocultar UI según pantalla
                            const isVillage = fullId === 'village-screen';
                            const isCombat = fullId === 'combat-screen';
                            const header = document.getElementById('game-header');
                            const bottomNav = document.getElementById('bottom-nav');
                            if (header) header.style.display = (isVillage ? '' : 'none');
                            if (bottomNav) bottomNav.style.display = (isVillage ? '' : 'none');
                        } else {
                            console.error('[patch-sync] Screen no encontrada:', fullId);
                        }
                    }
                };
            }

            console.log('[patch-sync] ✅ Todos los parches aplicados');
        });
    });

})();
