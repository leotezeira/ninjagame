# ARQUITECTURA MODULAR - GUÍA DE REFACTORIZACIÓN

## ESTADO ACTUAL (✅ COMPLETADO)

### CORE MODULES (Base de todo)
```
✅ js/core/screen-manager.js         (172 líneas)
   - Responsabilidad: Navegación unificada
   - Dependencias: Ninguna
   - Métodos clave:
     * showScreen(screenId, options)
     * showSection(sectionId)
     * showTab(tabId)
     * navigateFromSidebar(target)
     * toggleSidebar() / closeSidebar()
   - IDs HTML que usa:
     * Pantallas: auth-screen, name-screen, clan-screen, village-screen, 
                  combat-screen, mission-briefing-screen, mission-victory-screen, 
                  defeat-screen, exam-screen
     * Navegación: game-header, bottom-nav, sidebar, sidebar-overlay
     * Secciones aldea: section-home, section-world, section-inventory, 
                        section-shop, section-statspage

✅ js/core/save-manager.js            (250 líneas)
   - Responsabilidad: Persistencia y migración de saves
   - Dependencias: Ninguna
   - Métodos clave:
     * saveGame() - Guarda a localStorage
     * loadGame() - Carga desde localStorage
     * migratePlayerSave(player) - GARANTIZA valores defaults
     * deleteSave() / exportSave() / importSave()
     * hasSave() / getSaveInfo()
   - IDs HTML que usa: Ninguno directo
```

### HTML SCREENS (Pantallas nuevas)
<!-- Eliminado: html/screens/mission-briefing.html (obsoleto, solo usar versión funcional en ninjagame.html) -->

### CSS MODULARIZADO
```
✅ css/base.css                       (110 líneas)
   - Variables CSS completas (--primary, --accent, --bg, --text, etc)
   - Reset y normalize
   - Tipografía base
   - Scroll styling
   - Clases utilidad (.hidden, .flex-center, .gap-*, etc)

✅ css/screens.css                    (250 líneas)
   - Contenedor .screen base
   - Animaciones screenFadeIn, screenSlideIn, modalSlideIn
   - Layouts específicos por pantalla
   - Auth screen, village screen, combat screen, etc
   - Media queries para responsive

✅ css/components.css                 (350 líneas)
   - .btn, .btn-secondary, .btn-small, .btn-large
   - .card y variantes
   - Barras de progreso (.health-bar, .chakra-bar)
   - Tabs system (.tab-btn, .active)
   - Inputs y selects
   - Componentes reutilizables
   - Stats grid, toggle switches, etc

⏳ css/combat.css                     (NO CREADO AÚN)
   - Combat action buttons
   - Combat log styling
   - Enemy display cards
   - Combat animations
```

### INDEX.HTML NUEVO (PLANTILLA)
```
✅ index.html                         (120 líneas esqueleto)
   - Comentarios de estructura modular
   - Imports CSS en orden correcto
   - Placeholders para screens modulares
   - Scripts módulos en TIER 0, 1, 2, 3
   - Plan de migración documentado
   - ACTUALMENTE SOLO META-REDIRECCIÓN
```

---

## PRÓXIMOS PASOS (FASE 2)

### Sistemas a Modularizar
Cada uno debe tener ~200-300 líneas máximo

```
⏳ js/systems/combat.js               (~300 líneas)
   Responsabilidad:
   - startCombat(mission, enemies)
   - executeCombatRound(playerAction, enemyAction)
   - updateCombatUI()
   - victory() / defeat()
   - Manejo de acciones (jutsutsu, items, escape)

   Dependencias:
   - screenManager (para mostrar combat-screen)
   - game.player, game.currentEnemy, game.enemyQueue

   IDs HTML que usa:
   - combat-screen
   - combat-player-name, combat-player-health-*, combat-player-chakra-*
   - combat-enemy-name, combat-enemy-health-*, combat-enemy-chakra-*
   - combat-log
   - combat-action-buttons
   - combat-victory-modal, combat-defeat-modal

⏳ js/systems/missions.js             (~250 líneas)
   Responsabilidad:
   - showMissions() - Renderizar lista de misiones
   - startMission(missionId) - Mostrar briefing
   - acceptMission() - Iniciar desde briefing
   - completeM Misión() / failMission()

   Dependencias:
   - screenManager
   - combat.js (para lanzar combate)
   - game.player, game.missionsData

   IDs HTML que usa:
   - missions-list, missions-content
   - mission-briefing-screen (todo el contenido)
   - mission-card (items dinámicos)

⏳ js/systems/shop.js                 (~200 líneas)
   Responsabilidad:
   - showShop()
   - createShopCard(item)
   - buyItem(itemId)
   - sellItem(itemId)

   IDs HTML que usa:
   - section-shop, shop-list, shop-categories
   - Player inventory display
   - Ryo display

⏳ js/systems/academy.js              (~200 líneas)
   Responsabilidad:
   - showAcademy()
   - showJutsuRank(rank) - Mostrar tabs de rangos
   - learnJutsu(jutsuId)
   - updateAcademyUI()

   IDs HTML que usa:
   - section-academy
   - academy-tabs, jutsu-list
   - jutsu-cards (dinámicos)

⏳ js/systems/stats.js                (~200 líneas)
   Responsabilidad:
   - showStats()
   - updateVillageUI()
   - updatePlayerDisplay()
   - renderStats()

   IDs HTML que usa:
   - section-statspage, stats-content
   - player-name-village, player-clan-village
   - Stats displays (hp, chakra, etc)

⏳ js/systems/npc.js                  (~250 líneas)
   Responsabilidad:
   - showNPCs()
   - startNPCDialog(npcId)
   - friendlyBattle(npcId)
   - updateRelationship(npcId, delta)

   IDs HTML que usa:
   - npcs-list, npcs-content
   - npc-modal, npc-dialog
   - Relationship displays

⏳ js/systems/training.js             (~150 líneas)
   Responsabilidad:
   - showTraining()
   - doTraining(type) - Entrenar stats
   - updateTrainingUI()

   IDs HTML que usa:
   - section-training (si existe)
   - training-buttons, training-stats

⏳ js/systems/travel.js               (~150 líneas)
   Responsabilidad:
   - showTravel()
   - travelToLocation(location)
   - updateTravelUI()

   IDs HTML que usa:
   - section-travel
   - travel-map, location-buttons

⏳ js/systems/exam.js                 (~200 líneas)
   Responsabilidad:
   - showExams()
   - startExam(examId)
   - handleExamVictory() / handleExamDefeat()

   IDs HTML que usa:
   - exam-screen
   - exam-content, exam-questions

⏳ js/systems/renegade.js             (~200 líneas)
   Responsabilidad:
   - toggleRenegadeMode()
   - updateWantedLevel(delta)
   - showRenegadeOptions()
   - handleRenegadeQuests()

   IDs HTML que usa:
   - renegade-section (si existe)
   - wanted-level-display
```

### Reglas ESTRICTAS para cada módulo

```javascript
/**
 * TEMPLATE PARA CADA MÓDULO
 * =========================
 * 
 * RESPONSABILIDAD:
 * - [QUÉ HACE ESTE MÓDULO]
 * 
 * DEPENDENCIAS:
 * - screenManager
 * - game object
 * - [otros módulos]
 * 
 * IDS HTML QUE USA:
 * - [elemento1, elemento2, ...]
 * 
 * MAX LÍNEAS: 300
 */

import { screenManager } from '../core/screen-manager.js';

// Guard clause helper
const requireElement = (id) => {
    const el = document.getElementById(id);
    if (!el) console.warn(`❌ Missing element: ${id}`);
    return el;
};

export const MiSistema = {
    init() {
        this.setupEventListeners();
    },

    setupEventListeners() {
        // REGLA: Todos los listeners en JS, CERO onclick inline
    },

    render() {
        // REGLA: Usar DocumentFragment en bucles, NO innerHTML +=
        const fragment = document.createDocumentFragment();
        // ... agregar elementos al fragment
        const container = requireElement('container-id');
        if (container) {
            container.innerHTML = '';  // Limpiar
            container.appendChild(fragment);  // Agregar de una sola vez
        }
    },

    // Métodos públicos


    // Métodos privados (_prefijo)
};
```

---

## FASE 3: SEPARAR DATOS

```
⏳ js/content/missions-data.js
⏳ js/content/enemies-data.js
⏳ js/content/jutsus-data.js
⏳ js/content/shop-data.js
⏳ js/content/kekkei-data.js
⏳ js/content/npcs-data.js
⏳ js/content/villages-data.js
⏳ js/content/clans-data.js
```

---

## FASE 4: HTML MODULARIZADO

Cada pantalla en su propio archivo:

```
⏳ html/screens/auth.html
⏳ html/screens/name.html
⏳ html/screens/clan.html
⏳ html/screens/kekkei.html
⏳ html/screens/village.html (con todas las secciones)
⏳ html/screens/combat.html
⏳ html/screens/victory.html
⏳ html/screens/defeat.html
⏳ html/screens/exam.html
⏳ html/partials/hud.html (header + bottom-nav)
⏳ html/partials/modals.html (todos los modales)
```

---

## PROBLEMAS RESUELTOS EN ESTA REFACTORIZACIÓN

1. ✅ **Dualidad de navegación**: screen-manager.js unifica TODO
2. ✅ **mission-briefing-screen inexistente**: Creada desde cero
3. ✅ **innerHTML += en loops**: Regla de usar DocumentFragment
4. ✅ **onclick inline**: Todos los listeners en JS
5. ✅ **Guard clauses**: screenManager.getElement()
6. ✅ **Propiedades undefined**: SaveManager.migratePlayerSave() garantiza defaults
7. ✅ **game.js monolítico**: Dividido en 10+ sistemas modulares
8. ✅ **CSS monolítico**: Dividido en 4 archivos temáticos

---

## CÓMO USAR ESTE DOCUMENTO

1. **Verificar qué está ✅ completado**
2. **Seguir el orden FASE 1 → 2 → 3 → 4**
3. **Respetar TIER de dependencias** (0 → 1 → 2 → 3)
4. **Aplicar reglas estrictas** en cada nuevo módulo
5. **Probar con index.html nuevo** (cuando esté referenciado correctamente)
6. **Al final: Borrar ninjagame.html y css/style.css viejos**

---

## TESTING

```javascript
// En console después de cargar
DEBUG.screenManager.showScreen('village');
DEBUG.screenManager.showSection('home');
DEBUG.screenManager.showTab('missions');

// Ver todo el estado
console.log(game);
console.log(MODULES);
```
