// ============================================================
// core/createGame.js — Punto de entrada del juego
//
// CÓMO FUNCIONA:
//   Cada módulo exporta un objeto de métodos.
//   Se mezclan todos en el objeto `game` con Object.assign.
//   El HTML sigue usando onclick="game.xxx()" sin cambios.
// ============================================================

import { utilsMethods    } from './utils.js';
import { saveLoadMethods } from './saveLoad.js';
import { calendarMethods } from './calendar.js';
import { travelMethods   } from './travel.js';
import { creationMethods } from './creation.js';
import { kekkeiMethods   } from './kekkei.js';
import { statsMethods    } from './stats.js';
import { combatMethods   } from './combat.js';
import { actionsMethods  } from './actions.js';
import { examsMethods    } from './exams.js';
import { missionsMethods } from '../village/missions.js';
import { uiMethods       } from '../village/ui.js';
import { shopMethods     } from '../village/shop.js';
import { npcsMethods     } from '../village/npcs.js';
import { renegadeMethods } from '../renegade/renegade.js';

// ── Constantes del mundo ─────────────────────────────────────
const WORLD_CONSTANTS = {
    REAL_TURN_MS:  6 * 60 * 60 * 1000,   // 6 horas reales = 1 turno
    REAL_DAY_MS:   24 * 60 * 60 * 1000,  // 24 horas = 1 día de juego
    turnsPerDay:   4,
    daysPerMonth:  30,
    monthsPerYear: 12,
    WEEKLY_RENT:   300,
    WEEKLY_FOOD:   200,
    get WEEKLY_TOTAL() { return this.WEEKLY_RENT + this.WEEKLY_FOOD; },

    timeOfDayNames: ['MAÑANA', 'TARDE', 'NOCHE', 'MADRUGADA'],
    monthNames: [
        'Enero','Febrero','Marzo','Abril','Mayo','Junio',
        'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
    ],
    weekdayNames: ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'],

    weatherOptionsBySeason: {
        primavera: ['soleado','soleado','soleado','nublado','lluvia'],
        verano:    ['soleado','soleado','soleado','nublado','tormenta'],
        otono:     ['soleado','nublado','nublado','lluvia','tormenta'],
        invierno:  ['nublado','nublado','lluvia','nieve','nieve'],
    },

    recurringEvents: [],
};

// ── Factory ──────────────────────────────────────────────────
export function createGame(gameData = {}) {
    /**
     * gameData debe incluir:
     *   - clans, villages, locations, enemies, npcs, missions,
     *     shopItems, training, academyJutsus, kekkeiGenkaiList,
     *     clanKekkeiRules, elements, recruitableNPCs,
     *     examQuestions, examEnemies, anbuHunters,
     *     blackMarketItems, blackMarketServices, kinjutsu,
     *     renegadeContracts, organizationMissions, etc.
     *
     * gameData también puede incluir referencias a supabase/authUser.
     */

    const game = Object.assign(
        Object.create(null),        // sin herencia de Object.prototype

        // ── Constantes y datos estáticos ──────────────────────
        WORLD_CONSTANTS,
        gameData,                   // todos los datos del juego (enemigos, jutsus, etc.)

        // ── Estado dinámico (mutable) ─────────────────────────
        {
            player:          null,
            currentMission:  null,
            currentEnemy:    null,
            enemyQueue:      [],
            totalWaves:      0,
            currentWave:     0,
            combatLog:       [],
            combatTurn:      'player',
            kawairimiUsed:   false,
            defendActive:    false,
            pendingName:     '',
            pendingVillage:  null,
            selectedJutsuSlot: null,
            supabase:        gameData.supabase   || null,
            authUser:        gameData.authUser   || null,
            authProfile:     gameData.authProfile || null,
            _realTimeTicker: null,
            _lastOnlineFetch: 0,
            _lastChallengeAt: {},
        },

        // ── Módulos ───────────────────────────────────────────
        utilsMethods,
        saveLoadMethods,
        calendarMethods,
        travelMethods,
        creationMethods,
        kekkeiMethods,
        statsMethods,
        combatMethods,
        actionsMethods,
        examsMethods,
        missionsMethods,
        uiMethods,
        shopMethods,
        npcsMethods,
        renegadeMethods,
    );

    return game;
}
