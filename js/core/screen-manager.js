/**
 * SCREEN MANAGER - Sistema Unificado de Navegación
 * ================================================
 * 
 * RESPONSABILIDAD:
 * - Gestión centralizada de todas las pantallas y secciones
 * - Sistema único de IDs y navegación (elimina dualidad showSection vs activateTab)
 * - Manejo de UI (header, bottom-nav, sidebar)
 * 
 * DEPENDENCIAS:
 * - Ninguna (módulo base)
 * 
 * IDS HTML REQUERIDOS:
 * Pantallas: auth-screen, name-screen, clan-screen, village-screen, combat-screen,
 *            mission-victory-screen, defeat-screen, exam-screen
 * Navegación: game-header, bottom-nav, sidebar, sidebar-overlay
 * Secciones aldea: section-home, section-world, section-inventory, section-shop, 
 *                  section-statspage
 * Tabs: Village tabs system
 */

export class ScreenManager {
    constructor() {
        this.currentScreen = null;
        this.currentSection = null;
        this.currentTab = null;
        
        // Cache DOM elements
        this.elements = {
            header: null,
            bottomNav: null,
            sidebar: null,
            sidebarOverlay: null
        };
        
        this.init();
    }

    init() {
        // Cache critical DOM elements
        this.elements.header = document.getElementById('game-header');
        this.elements.bottomNav = document.getElementById('bottom-nav');
        this.elements.sidebar = document.getElementById('sidebar');
        this.elements.sidebarOverlay = document.getElementById('sidebar-overlay');
        
        console.log('📺 ScreenManager initialized');
    }

    /**
     * Muestra una pantalla principal (screen)
     * @param {string} screenId - ID de la pantalla (sin sufijo -screen)
     * @param {Object} options - Opciones de visualización
     */
    showScreen(screenId, options = {}) {
        const fullScreenId = screenId.endsWith('-screen') ? screenId : `${screenId}-screen`;
        
        console.log('📺 showScreen:', fullScreenId);
        
        // Remover active de todas las pantallas
        const allScreens = document.querySelectorAll('.screen');
        allScreens.forEach(screen => screen.classList.remove('active'));
        
        // Activar pantalla target
        const targetScreen = document.getElementById(fullScreenId);
        if (!targetScreen) {
            console.error('❌ Screen not found:', fullScreenId);
            return false;
        }
        
        targetScreen.classList.add('active');
        this.currentScreen = fullScreenId;
        
        // Gestionar UI según el tipo de pantalla
        this._manageUIVisibility(fullScreenId, options);
        
        // Cerrar sidebar si está abierto
        this.closeSidebar();
        
        console.log('✅ Screen active:', fullScreenId);
        return true;
    }

    /**
     * Muestra una sección dentro de la pantalla village
     * @param {string} sectionId - ID de la sección (sin prefijo section-)
     */
    showSection(sectionId) {
        const fullSectionId = sectionId.startsWith('section-') ? sectionId : `section-${sectionId}`;
        
        console.log('🔀 showSection:', fullSectionId);
        
        // Asegurar que estamos en village-screen
        if (this.currentScreen !== 'village-screen') {
            this.showScreen('village');
        }
        
        // Remover active de todas las secciones
        const allSections = document.querySelectorAll('.section-content');
        allSections.forEach(section => section.classList.remove('active'));
        
        // Activar sección target
        const targetSection = document.getElementById(fullSectionId);
        if (!targetSection) {
            console.error('❌ Section not found:', fullSectionId);
            return false;
        }
        
        targetSection.classList.add('active');
        this.currentSection = fullSectionId;
        
        // Actualizar bottom nav
        this._updateBottomNav(sectionId.replace('section-', ''));
        
        console.log('✅ Section active:', fullSectionId);
        return true;
    }

    /**
     * Muestra un tab dentro de una sección (ej: missions/npcs en world)
     * @param {string} tabId - ID del tab
     */
    showTab(tabId) {
        console.log('📑 showTab:', tabId);
        
        // Determinar el contenedor de tabs según el contexto actual
        let tabContainer = null;
        let contentContainer = null;
        
        // Tabs de world section (missions/npcs)
        if (this.currentSection === 'section-world') {
            tabContainer = document.querySelector('#section-world .tabs');
            
            // Activar tab
            if (tabContainer) {
                const tabButtons = tabContainer.querySelectorAll('.tab-btn');
                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.getAttribute('onclick')?.includes(tabId)) {
                        btn.classList.add('active');
                    }
                });
            }
            
            // Mostrar contenido
            if (tabId === 'missions') {
                const missionsContent = document.getElementById('missions-content');
                const npcsContent = document.getElementById('npcs-content');
                if (missionsContent) missionsContent.style.display = 'block';
                if (npcsContent) npcsContent.style.display = 'none';
            } else if (tabId === 'npcs') {
                const missionsContent = document.getElementById('missions-content');
                const npcsContent = document.getElementById('npcs-content');
                if (missionsContent) missionsContent.style.display = 'none';
                if (npcsContent) npcsContent.style.display = 'block';
            }
        }
        
        // Tabs de academy (jutsus por rango/tipo)
        const academyTabs = document.querySelector('.academy-tabs');
        if (academyTabs) {
            const allTabButtons = academyTabs.querySelectorAll('.tab-btn');
            allTabButtons.forEach(btn => {
                btn.classList.remove('active');
                const btnOnclick = btn.getAttribute('onclick');
                if (btnOnclick && btnOnclick.includes(`'${tabId}'`)) {
                    btn.classList.add('active');
                }
            });
        }
        
        this.currentTab = tabId;
        console.log('✅ Tab active:', tabId);
        return true;
    }

    /**
     * Navega desde el sidebar
     * @param {string} target - Puede ser 'home', 'world', 'inventory', 'shop', 'statspage'
     */
    navigateFromSidebar(target) {
        console.log('🏠 Navigate from sidebar to:', target);
        
        // Cerrar sidebar
        this.closeSidebar();
        
        // Si es una sección de village
        const villageSections = ['home', 'world', 'inventory', 'shop', 'statspage'];
        if (villageSections.includes(target)) {
            this.showSection(target);
            return true;
        }
        
        // Si es otra pantalla
        this.showScreen(target);
        return true;
    }

    /**
     * Toggle sidebar
     */
    toggleSidebar() {
        if (!this.elements.sidebar) return;
        this.elements.sidebar.classList.toggle('open');
        console.log('🔄 Sidebar toggled');
    }

    /**
     * Cierra sidebar
     */
    closeSidebar() {
        if (!this.elements.sidebar) return;
        this.elements.sidebar.classList.remove('open');
    }

    /**
     * Gestiona la visibilidad de header, bottom-nav según la pantalla
     * @private
     */
    _manageUIVisibility(screenId, options) {
        const { header, bottomNav } = this.elements;
        
        // Pantallas que NO muestran UI
        const noUIScreens = ['combat-screen', 'auth-screen', 'name-screen', 
                             'clan-screen', 'kekkei-screen'];
        
        // Combat screen oculta TODO
        if (screenId === 'combat-screen') {
            if (header) header.style.display = 'none';
            if (bottomNav) bottomNav.style.display = 'none';
            console.log('🥷 Combat mode: UI hidden');
            return;
        }
        
        // Village screen muestra TODO
        if (screenId === 'village-screen') {
            if (header) {
                header.classList.add('visible');
                header.style.display = '';
            }
            if (bottomNav) {
                bottomNav.style.display = '';
            }
            console.log('🏠 Village mode: UI visible');
            return;
        }
        
        // Otras pantallas: ocultar header si está en la lista
        if (noUIScreens.includes(screenId)) {
            if (header) {
                header.classList.remove('visible');
                header.style.display = 'none';
            }
            if (bottomNav) bottomNav.style.display = 'none';
        } else {
            // Restaurar UI por defecto
            if (header) {
                header.classList.add('visible');
                header.style.display = '';
            }
            if (bottomNav) bottomNav.style.display = '';
        }
    }

    /**
     * Actualiza el estado activo del bottom nav
     * @private
     */
    _updateBottomNav(sectionName) {
        if (!this.elements.bottomNav) return;
        
        const navButtons = this.elements.bottomNav.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.classList.remove('active');
            const btnTab = btn.getAttribute('data-tab');
            if (btnTab === sectionName) {
                btn.classList.add('active');
            }
        });
    }

    /**
     * Actualiza elementos del sidebar (stats del jugador)
     */
    updateSidebarStats(player) {
        if (!player) return;
        
        const updates = {
            'sidebar-rank': player.rank || 'Genin',
            'sidebar-level': player.level || 1,
            'sidebar-ryo': player.ryo || 0
        };
        
        Object.entries(updates).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        });
    }

    /**
     * Verifica si un elemento existe en el DOM
     * @param {string} elementId 
     * @returns {boolean}
     */
    elementExists(elementId) {
        return document.getElementById(elementId) !== null;
    }

    /**
     * Guard clause para verificar elemento antes de usarlo
     * @param {string} elementId 
     * @param {string} context - Contexto para logging
     * @returns {HTMLElement|null}
     */
    getElement(elementId, context = '') {
        const element = document.getElementById(elementId);
        if (!element) {
            console.warn(`⚠️ Element not found: ${elementId}${context ? ` (${context})` : ''}`);
        }
        return element;
    }
}

// Export singleton instance
export const screenManager = new ScreenManager();
