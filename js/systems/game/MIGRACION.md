# 🗂️ Guía de Migración — Ninja RPG Modular

## Estructura de archivos

```
game/
├── core/
│   ├── createGame.js    ← Punto de entrada: ensambla todos los módulos
│   ├── utils.js         ← rollDice, clamp, updateBar, modales
│   └── saveLoad.js      ← saveGame, loadGame, deleteCharacter, migratePlayerSave
├── world/
│   ├── calendar.js      ← Tiempo real, calendario, clima, fatiga, gastos, reputación
│   └── travel.js        ← Viaje entre ubicaciones, encuentros, equipo reclutable
├── character/
│   ├── creation.js      ← Nombre, aldea, clan, inicio de partida
│   ├── kekkei.js        ← Kekkei Genkai: roll, bonuses, level up
│   └── stats.js         ← getEffectiveStats, levelUp, meetsJutsuRequirements
├── combat/
│   ├── combat.js        ← startCombat, enemyTurn, winCombat, defeat, returnToVillage
│   ├── actions.js       ← basicAttack, useJutsu, useGenjutsu, defend, kawarimi, items
│   └── exams.js         ← Examen Chunin (3 fases) y Examen Jonin (3 pruebas)
├── village/
│   ├── missions.js      ← showMissions, startMission, _executeMission, misiones urgentes
│   ├── ui.js            ← showScreen, showSection, activateVillageTab, HUD, header, online
│   ├── shop.js          ← tienda, inventario, entrenamiento, academia, stats display
│   └── npcs.js          ← lista NPCs, interacción, diálogos, regalos, combate amistoso
└── renegade/
    └── renegade.js      ← Deserción, wanted level, ANBU, mercado negro, organización, redención
```

---

## Cómo integrar en tu proyecto

### 1. Reemplazar el archivo monolítico

En tu `index.html` o punto de entrada JS, cambia:

```js
// ANTES
const game = createGame();

// DESPUÉS
import { createGame } from './game/core/createGame.js';

const game = createGame({
    // Datos estáticos del juego (los mismos que ya tenías)
    clans, villages, locations, enemies, npcs,
    missions, shopItems, training, academyJutsus,
    kekkeiGenkaiList, clanKekkeiRules, elements,
    recruitableNPCs, examQuestions, examEnemies,
    anbuHunters, blackMarketItems, blackMarketServices,
    kinjutsu, renegadeContracts, organizationMissions,
    recurringEvents, taijutsuAcademy, genjutsuAcademy,
    // etc. (todos tus datos que antes estaban en el mismo archivo)

    // Servicios externos
    supabase,
    authUser,
    authProfile,
});

window.game = game;  // necesario para los onclick="" del HTML
```

### 2. Separar los datos del juego

Los datos que antes vivían en el mismo archivo (enemigos, clanes, misiones, etc.)
ahora deberían ir en archivos separados:

```js
// data/enemies.js
export const enemies = { genin: [...], chunin: [...], ... };

// data/clans.js
export const clans = { uchiha: {...}, hyuga: {...}, ... };

// etc.
```

Y luego importarlos todos en `main.js` antes de llamar a `createGame()`.

### 3. El HTML no cambia

Todos los `onclick="game.xxx()"` del HTML siguen funcionando exactamente igual
porque el objeto `game` sigue siendo el mismo objeto global con todos los métodos.

---

## Qué se mejoró vs el archivo monolítico

| Problema original                          | Solución aplicada                                 |
|--------------------------------------------|---------------------------------------------------|
| `showScreen()` con lógica duplicada 2×     | Función única sin duplicación                     |
| `activateVillageTab()` duplicada 2×        | Función única, consolidada                        |
| Modales definidos 3 veces                  | Una sola definición en `utils.js`                 |
| `_executeMission()` con 200+ líneas mixtas | Extraído a `missions.js`, responsabilidad clara   |
| Archivos de 3800+ líneas                   | 15 módulos de 100–350 líneas cada uno             |
| Combate mezclado con UI y misiones         | `combat/`, `village/` separados                   |

---

## Notas de compatibilidad

- Todos los métodos usan `this` para acceder a `this.player`, `this.clans`, etc.
- Los módulos **no** usan clases; son objetos planos mezclados con `Object.assign`.
- No hay dependencias entre módulos (no se importan entre sí) — todo llega por `this`.
- Esto mantiene compatibilidad total con el HTML existente.

---

## Datos que debes proveer en `gameData`

Estos son todos los campos que los módulos esperan encontrar en `this`:

```js
// Datos del mundo
locations, villages, clans, elements, enemies,
npcs, recruitableNPCs,

// Misiones
missions, renegadeContracts, organizationMissions,

// Tienda y academia
shopItems, training, academyJutsus,
taijutsuAcademy, genjutsuAcademy,
// ... (cualquier otro tipo de academia que tengas)

// Exámenes
examQuestions, examEnemies, anbuHunters,

// Kekkei Genkai
kekkeiGenkaiList, clanKekkeiRules,

// Renegado
blackMarketItems, blackMarketServices,
kinjutsu, blackMarketInventory,

// Eventos
recurringEvents,

// Servicios externos
supabase, authUser, authProfile,
```

Si alguno falta, el módulo correspondiente lo manejará con `|| []` o `|| {}`.
