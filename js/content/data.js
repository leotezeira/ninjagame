// Datos y configuración estática del juego
// Editá este archivo para agregar clanes, jutsus, misiones, enemigos, etc.

import { taijutsuJutsus } from './taijutsu.js';
import { genjutsuJutsus } from './genjutsu.js';
import { escapeJutsus } from './escape.js';
import { katonJutsus } from './elements/katon.js';
import { suitonJutsus } from './elements/suiton.js';
import { futonJutsus } from './elements/futon.js';
import { dotonJutsus } from './elements/doton.js';
import { raitonJutsus } from './elements/raiton.js';
import { sharinganJutsus } from './kekkei/sharingan.js';
import { byakuganJutsus } from './kekkei/byakugan.js';
import { rinneganJutsus } from './kekkei/rinnegan.js';
import { bijuuJutsus } from './kekkei/bijuu.js';

export const BASE_GAME = {

        player: null,
        currentEnemy: null,
        currentMission: null,
        enemyQueue: [],
        currentWave: 0,
        totalWaves: 0,
        combatTurn: 'player',
        kawairimiUsed: false,
        defendActive: false,

        // Tiempo real (sin depender de jugador)
        REAL_DAY_MS: 20 * 60 * 1000,      // 20 minutos en ms
        REAL_TURN_MS: 5 * 60 * 1000,      // 5 minutos en ms
        _realTimeTicker: null,

        // Gastos semanales automáticos
        WEEKLY_RENT: 60,                   // Alquiler semanal
        WEEKLY_FOOD: 20,                   // Comida semanal
        WEEKLY_TOTAL: 80,                  // Total semanal (60 + 20)

        // Calendario ninja
        weekdayNames: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        monthNames: [
            'Mes 1', 'Mes 2', 'Mes 3', 'Mes 4', 'Mes 5', 'Mes 6',
            'Mes 7', 'Mes 8', 'Mes 9', 'Mes 10', 'Mes 11', 'Mes 12'
        ],
        timeOfDayNames: ['MAÑANA', 'TARDE', 'NOCHE', 'MADRUGADA'],
        turnsPerDay: 4,
        daysPerMonth: 30,
        monthsPerYear: 12,

        // Mundo / mapa
        locations: {
            konoha: { name: 'Konoha', icon: '🏘️', base: true },
            bosque: { name: 'Bosque de la Muerte', icon: '🌲', daysFromKonoha: 2 },
            olas: { name: 'País de las Olas', icon: '🌊', daysFromKonoha: 3 },
            suna: { name: 'Sunagakure', icon: '🏜️', daysFromKonoha: 5 },
            kiri: { name: 'Kirigakure', icon: '🌫️', daysFromKonoha: 7 },
            iwa: { name: 'Iwagakure', icon: '⛰️', daysFromKonoha: 6 },
            kumo: { name: 'Kumogakure', icon: '☁️', daysFromKonoha: 8 },
            ame: { name: 'Amegakure', icon: '💧', daysFromKonoha: 4 },
            valle: { name: 'Valle del Fin', icon: '🌳', daysFromKonoha: 4 },
            nieve: { name: 'País de la Nieve', icon: '🏔️', daysFromKonoha: 10 }
        },

        // Aldeas principales (seleccionables al crear personaje)
        villages: {
            konoha: {
                name: 'Konoha - Aldea de la Hoja',
                icon: '🏘️',
                description: 'La aldea más grande y poderosa. Liderada por un Hokage, es el corazón del Fuego. Energía, tradición y comunidad.',
                kage: 'Hokage',
                color: '#2ecc71',
                missionTypes: ['rescue', 'patrol', 'investigation'],
                allies: ['suna', 'iwa'],
                enemies: ['kiri'],
                rivalVillages: ['kumo']
            },
            suna: {
                name: 'Sunagakure - Aldea de la Arena',
                icon: '🏜️',
                description: 'Aldea desértica del País del Viento. Resistencia, dureza e independencia. Cada palabra cuenta.',
                kage: 'Kazekage',
                color: '#f39c12',
                missionTypes: ['sabotage', 'escort', 'hunt'],
                allies: ['konoha', 'iwa'],
                enemies: ['kumo'],
                rivalVillages: ['kiri']
            },
            kiri: {
                name: 'Kirigakure - Aldea de la Niebla',
                icon: '🌫️',
                description: 'Aldea envuelta en misterio. Tradición de asesinos y dolor. Poder en la oscuridad.',
                kage: 'Mizukage',
                color: '#3498db',
                missionTypes: ['assassination', 'espionage', 'theft'],
                allies: ['kumo'],
                enemies: ['konoha'],
                rivalVillages: ['suna']
            },
            iwa: {
                name: 'Iwagakure - Aldea de la Piedra',
                icon: '⛰️',
                description: 'Fortaleza de montaña. Solidos, confiables y concienzudos. La roca que sostiene el mundo.',
                kage: 'Tsuchikage',
                color: '#95a5a6',
                missionTypes: ['mining', 'construct', 'protect'],
                allies: ['konoha', 'suna'],
                enemies: ['kumo'],
                rivalVillages: ['ame']
            },
            kumo: {
                name: 'Kumogakure - Aldea de la Nube',
                icon: '☁️',
                description: 'Aldea flotante entre nubes. Ambición sin límites. El cielo es el límite.',
                kage: 'Raikage',
                color: '#9b59b6',
                missionTypes: ['combat', 'bounty', 'conquest'],
                allies: ['kiri'],
                enemies: ['suna', 'iwa'],
                rivalVillages: ['konoha']
            },
            ame: {
                name: 'Amegakure - Aldea de la Lluvia',
                icon: '💧',
                description: 'Aldea que nunca ha visto el sol. Misterio absoluto. Secretos en la tormenta.',
                kage: 'Hanzo',
                color: '#e74c3c',
                missionTypes: ['espionage', 'research', 'stealth'],
                allies: [],
                enemies: [],
                rivalVillages: ['iwa']
            }
        },

        // Reclutamiento (equipo de 3: tú + 2 NPC)
        recruitableNPCs: {
            naruto: { id: 'naruto', name: 'Naruto', costPerDay: 500, perk: 'mission_ryo', perkValue: 0.10 },
            sakura: { id: 'sakura', name: 'Sakura', costPerDay: 400, perk: 'between_heal', perkValue: 0.10 },
            lee: { id: 'lee', name: 'Rock Lee', costPerDay: 450, perk: 'combat_damage', perkValue: 15 },
            shikamaru: { id: 'shikamaru', name: 'Shikamaru', costPerDay: 600, perk: 'mission_exp', perkValue: 0.20 },
            hinata: { id: 'hinata', name: 'Hinata', costPerDay: 550, perk: 'team_evasion', perkValue: 0.15 }
        },

        // NPCs y relaciones (Sistema social)
        // La relación persistente se guarda en player.npcRelations.
        npcs: {
            naruto: {
                id: 'naruto',
                name: 'Naruto Uzumaki',
                icon: '🦊',
                village: 'konoha',
                rank: 'Hokage',
                level: 20,
                personality: 'energetic',
                relationship: 0,
                relationshipLevel: 'Desconocido',
                location: 'hokage_office',
                availability: 'always',
                stats: { hp: 520, chakra: 380, attack: 55, defense: 34, accuracy: 22, genjutsu: 10 },
                dialogues: {
                    first_meeting: ['¡Dattebayo! ¿Quién sos tú?'],
                    neutral: ['Sigue entrenando. El esfuerzo siempre rinde.'],
                    friendly: ['¡Vamos por un ramen! Después entrenamos.'],
                    best_friend: ['Confío en ti. Cuenta conmigo cuando lo necesites.'],
                    rival: ['¡Te voy a superar, ya verás!'],
                    enemy: ['No puedo perdonar lo que hiciste.']
                },
                interactions: ['talk', 'mission', 'training', 'gift', 'friendly_battle'],
                missions: [
                    { name: '🍜 Entregar Ramen a Iruka', rank: 'D', description: 'Naruto te pide llevar ramen a la Academia sin derramar nada.', enemies: [{ type: 'genin', index: 0, count: 1 }], ryo: 90, exp: 40, turns: 1, npcId: 'naruto', relationshipGain: 10 },
                    { name: '🌀 Practicar Rasengan', rank: 'C', description: 'Sesión intensa para mejorar control de chakra.', enemies: [{ type: 'genin', index: 1, count: 2 }], ryo: 160, exp: 70, turns: 2, npcId: 'naruto', relationshipGain: 10 }
                ],
                trainings: [
                    { name: 'Entrenamiento con Naruto', price: 250, description: '+2 Ninjutsu, +1 Taijutsu', effect: { ninjutsu: 2, taijutsu: 1 } }
                ],
                gifts: ['🍜 Ramen Ichiraku', '🍙 Bento'],
                rewards: { friendDiscount: 0.05, bestFriendDiscount: 0.10 }
            },
            sasuke: {
                id: 'sasuke',
                name: 'Sasuke Uchiha',
                icon: '⚡',
                village: 'vagabundo',
                rank: 'Viajero',
                level: 20,
                personality: 'stoic',
                relationship: 0,
                relationshipLevel: 'Desconocido',
                location: 'valle',
                availability: 'random',
                stats: { hp: 480, chakra: 360, attack: 60, defense: 32, accuracy: 24, genjutsu: 18 },
                dialogues: {
                    first_meeting: ['No me sigas.'],
                    neutral: ['La fuerza tiene un precio.'],
                    friendly: ['Si vas a entrenar, no desperdicies mi tiempo.'],
                    best_friend: ['Te debo una.'],
                    rival: ['Demuestra que mereces tu nombre.'],
                    enemy: ['No te interpondrás.']
                },
                interactions: ['talk', 'mission', 'training', 'gift', 'friendly_battle'],
                missions: [
                    { name: '📜 Recuperar pergamino perdido', rank: 'C', description: 'Sasuke dejó un pergamino en una ruta peligrosa.', enemies: [{ type: 'genin', index: 2, count: 2 }], ryo: 200, exp: 90, turns: 2, npcId: 'sasuke', relationshipGain: 10 },
                    { name: '⚔️ Duelo de precisión', rank: 'B', description: 'Combate de práctica exigente.', enemies: [{ type: 'chunin', index: 1, count: 2 }], ryo: 600, exp: 180, turns: 3, npcId: 'sasuke', relationshipGain: 10 }
                ],
                trainings: [
                    { name: 'Entrenamiento con Sasuke', price: 500, description: '+3 Taijutsu, +2 Genjutsu', effect: { taijutsu: 3, genjutsu: 2 } }
                ],
                gifts: ['💊 Píldora Militar'],
                rewards: { unlockBattle: true }
            },
            sakura: {
                id: 'sakura',
                name: 'Sakura Haruno',
                icon: '🌸',
                village: 'konoha',
                rank: 'Médica',
                level: 18,
                personality: 'supportive',
                relationship: 0,
                relationshipLevel: 'Desconocido',
                location: 'hospital',
                availability: 'always',
                stats: { hp: 420, chakra: 340, attack: 52, defense: 30, accuracy: 22, genjutsu: 16 },
                dialogues: {
                    first_meeting: ['Si vas a pelear, aprende a cuidarte.'],
                    neutral: ['La disciplina salva vidas.'],
                    friendly: ['Te puedo enseñar a dosificar tu chakra.'],
                    best_friend: ['Estoy orgullosa de tu progreso.'],
                    rival: ['No me subestimes.'],
                    enemy: ['No ayudaré a alguien así.']
                },
                interactions: ['talk', 'mission', 'training', 'gift', 'friendly_battle'],
                missions: [
                    { name: '🧪 Hierbas del hospital', rank: 'D', description: 'Recolecta hierbas para el hospital sin dañarlas.', enemies: [{ type: 'genin', index: 2, count: 1 }], ryo: 80, exp: 35, turns: 1, npcId: 'sakura', relationshipGain: 10 },
                    { name: '🩹 Guardias del suministro', rank: 'C', description: 'Protege medicinas durante un traslado.', enemies: [{ type: 'genin', index: 0, count: 2 }], ryo: 180, exp: 80, turns: 2, npcId: 'sakura', relationshipGain: 10 }
                ],
                trainings: [
                    { name: 'Entrenamiento médico', price: 350, description: '+20 HP máx y cura ligera', effect: { maxHp: 20 } }
                ],
                gifts: ['🍙 Bento', '💊 Píldora de Chakra'],
                rewards: { betweenHealBonus: 0.05 }
            },
            kakashi: {
                id: 'kakashi',
                name: 'Kakashi Hatake',
                icon: '📘',
                village: 'konoha',
                rank: 'Ex-Hokage',
                level: 19,
                personality: 'calm',
                relationship: 0,
                relationshipLevel: 'Desconocido',
                location: 'training_field',
                availability: 'always',
                stats: { hp: 450, chakra: 360, attack: 54, defense: 33, accuracy: 24, genjutsu: 15 },
                dialogues: {
                    first_meeting: ['Yo... llegué tarde.'],
                    neutral: ['La estrategia decide más que la fuerza.'],
                    friendly: ['Puedo corregir tu postura.'],
                    best_friend: ['Bien. Estás listo para liderar.'],
                    rival: ['Veamos qué tan rápido aprendes.'],
                    enemy: ['No puedo permitirlo.']
                },
                interactions: ['talk', 'mission', 'training', 'gift', 'friendly_battle'],
                missions: [
                    { name: '📕 Recuperar Icha Icha', rank: 'D', description: 'Perdió su libro. No preguntes dónde.', enemies: [{ type: 'genin', index: 1, count: 1 }], ryo: 120, exp: 40, turns: 1, npcId: 'kakashi', relationshipGain: 10 },
                    { name: '🧠 Simulación de combate', rank: 'B', description: 'Entrenamiento real contra un oponente serio.', enemies: [{ type: 'chunin', index: 2, count: 3 }], ryo: 700, exp: 220, turns: 3, npcId: 'kakashi', relationshipGain: 10 }
                ],
                trainings: [
                    { name: 'Práctica de lectura de movimientos', price: 600, description: '+2 a todos los stats', effect: { all: 2 } }
                ],
                gifts: ['💊 Píldora de Chakra'],
                rewards: { critBonus: 2 }
            },
            rocklee: {
                id: 'rocklee',
                name: 'Rock Lee',
                icon: '🥋',
                village: 'konoha',
                rank: 'Jōnin',
                level: 16,
                personality: 'energetic',
                relationship: 0,
                relationshipLevel: 'Desconocido',
                location: 'training_field',
                availability: 'always',
                stats: { hp: 460, chakra: 140, attack: 58, defense: 30, accuracy: 22, genjutsu: 6 },
                dialogues: {
                    first_meeting: ['¡La juventud arde!'],
                    neutral: ['Mil golpes hoy, mil golpes mañana.'],
                    friendly: ['¡Aumentemos tu resistencia!'],
                    best_friend: ['¡Eres mi orgullo!'],
                    rival: ['¡Quiero ver tu determinación!'],
                    enemy: ['No me obligues a pelear en serio.']
                },
                interactions: ['talk', 'mission', 'training', 'gift', 'friendly_battle'],
                missions: [
                    { name: '🏃 Carrera de resistencia', rank: 'D', description: 'Completa una ruta sin detenerte.', enemies: [{ type: 'genin', index: 2, count: 1 }], ryo: 70, exp: 35, turns: 1, npcId: 'rocklee', relationshipGain: 10 },
                    { name: '🥋 Sparring intenso', rank: 'C', description: 'Sesión de taijutsu con Lee.', enemies: [{ type: 'genin', index: 0, count: 2 }], ryo: 160, exp: 80, turns: 2, npcId: 'rocklee', relationshipGain: 10 }
                ],
                trainings: [
                    { name: 'Rutina de Taijutsu', price: 300, description: '+3 Taijutsu', effect: { taijutsu: 3 } }
                ],
                gifts: ['🍙 Bento', '💊 Píldora Militar'],
                rewards: { taijutsuBonus: 2 }
            },
            gaara: {
                id: 'gaara',
                name: 'Gaara',
                icon: '🏜️',
                village: 'suna',
                rank: 'Kazekage',
                level: 20,
                personality: 'calm',
                relationship: 0,
                relationshipLevel: 'Desconocido',
                location: 'suna',
                availability: 'random',
                stats: { hp: 540, chakra: 360, attack: 54, defense: 40, accuracy: 20, genjutsu: 12 },
                dialogues: {
                    first_meeting: ['No todos nacen con paz.'],
                    neutral: ['El control vence al caos.'],
                    friendly: ['Puedo enseñarte defensa.'],
                    best_friend: ['Tu presencia trae calma.'],
                    rival: ['Veamos tu voluntad.'],
                    enemy: ['No toleraré amenazas.']
                },
                interactions: ['talk', 'mission', 'training', 'gift', 'friendly_battle'],
                missions: [
                    { name: '📨 Proteger embajador de Suna', rank: 'C', description: 'Escolta a un visitante importante.', enemies: [{ type: 'genin', index: 1, count: 2 }], ryo: 260, exp: 90, turns: 2, npcId: 'gaara', relationshipGain: 10 },
                    { name: '🏜️ Calmar disturbios', rank: 'B', description: 'Amenazas internas ponen en riesgo al pueblo.', enemies: [{ type: 'chunin', index: 0, count: 3 }], ryo: 700, exp: 220, turns: 3, npcId: 'gaara', relationshipGain: 10 }
                ],
                trainings: [
                    { name: 'Defensa de arena', price: 700, description: '+2 Defensa (taijutsu)', effect: { taijutsu: 2 } }
                ],
                gifts: ['💊 Píldora de Chakra'],
                rewards: { defenseBonus: 2 }
            },
            killerb: {
                id: 'killerb',
                name: 'Killer B',
                icon: '🎤',
                village: 'kumo',
                rank: 'Jinchūriki',
                level: 19,
                personality: 'energetic',
                relationship: 0,
                relationshipLevel: 'Desconocido',
                location: 'kumo',
                availability: 'random',
                stats: { hp: 560, chakra: 320, attack: 60, defense: 36, accuracy: 21, genjutsu: 8 },
                dialogues: {
                    first_meeting: ['¡Yo yo! ¿Listo para el ritmo?'],
                    neutral: ['Entrena y rima, así se domina.'],
                    friendly: ['Te mostraré un combo.'],
                    best_friend: ['¡Mi hermano de batalla!'],
                    rival: ['No te quedes atrás.'],
                    enemy: ['No me fuerces a transformarme.']
                },
                interactions: ['talk', 'mission', 'training', 'gift', 'friendly_battle'],
                missions: [
                    { name: '🎶 Control de chakra (ritmo)', rank: 'C', description: 'Práctica de control y potencia.', enemies: [{ type: 'genin', index: 2, count: 2 }], ryo: 240, exp: 95, turns: 2, npcId: 'killerb', relationshipGain: 10 },
                    { name: '⚔️ Sparring con espadas', rank: 'B', description: 'Duelo serio con B.', enemies: [{ type: 'chunin', index: 2, count: 3 }], ryo: 800, exp: 240, turns: 3, npcId: 'killerb', relationshipGain: 10 }
                ],
                trainings: [
                    { name: 'Combo de 8 espadas', price: 650, description: '+3 Taijutsu', effect: { taijutsu: 3 } }
                ],
                gifts: ['🍙 Bento', '💊 Píldora Militar'],
                rewards: { taijutsuBonus: 2 }
            },
            jiraiya: {
                id: 'jiraiya',
                name: 'Jiraiya',
                icon: '🐸',
                village: 'vagabundo',
                rank: 'Sannin',
                level: 20,
                personality: 'mischievous',
                relationship: 0,
                relationshipLevel: 'Desconocido',
                location: 'olas',
                availability: 'event',
                stats: { hp: 520, chakra: 420, attack: 56, defense: 34, accuracy: 21, genjutsu: 14 },
                dialogues: {
                    first_meeting: ['Heh... ¿un aprendiz?'],
                    neutral: ['La experiencia vale más que mil golpes.'],
                    friendly: ['Te enseñaré algo, pero no es gratis.'],
                    best_friend: ['No me decepciones.'],
                    rival: ['Te falta calle.'],
                    enemy: ['Esto termina aquí.']
                },
                interactions: ['talk', 'mission', 'training', 'gift', 'friendly_battle'],
                missions: [
                    { name: '📚 Buscar información', rank: 'C', description: 'Reúne datos sobre un objetivo.', enemies: [{ type: 'genin', index: 1, count: 2 }], ryo: 260, exp: 110, turns: 2, npcId: 'jiraiya', relationshipGain: 10 },
                    { name: '🐸 Prueba de invocación', rank: 'B', description: 'Sobrevive a una prueba exigente.', enemies: [{ type: 'chunin', index: 0, count: 3 }], ryo: 900, exp: 260, turns: 3, npcId: 'jiraiya', relationshipGain: 10 }
                ],
                trainings: [
                    { name: 'Control sabio', price: 900, description: '+4 Ninjutsu, +2 Chakra regen', effect: { ninjutsu: 4 } }
                ],
                gifts: ['💊 Píldora de Chakra'],
                rewards: { chakraRegenBonus: 2 }
            },
            tsunade: {
                id: 'tsunade',
                name: 'Tsunade',
                icon: '🐌',
                village: 'konoha',
                rank: 'Sannin',
                level: 20,
                personality: 'strict',
                relationship: 0,
                relationshipLevel: 'Desconocido',
                location: 'hokage_office',
                availability: 'event',
                stats: { hp: 600, chakra: 320, attack: 62, defense: 38, accuracy: 20, genjutsu: 12 },
                dialogues: {
                    first_meeting: ['No hagas perder mi tiempo.'],
                    neutral: ['Aprende a sobrevivir.'],
                    friendly: ['Puedo reforzar tu cuerpo.'],
                    best_friend: ['Tienes madera de líder.'],
                    rival: ['¿Eso es todo?'],
                    enemy: ['Te aplastaré.']
                },
                interactions: ['talk', 'mission', 'training', 'gift', 'friendly_battle'],
                missions: [
                    { name: '🏥 Guardia del hospital', rank: 'C', description: 'Protege al personal médico.', enemies: [{ type: 'genin', index: 0, count: 3 }], ryo: 260, exp: 100, turns: 2, npcId: 'tsunade', relationshipGain: 10 },
                    { name: '💪 Romper rocas', rank: 'B', description: 'Entrenamiento brutal de fuerza.', enemies: [{ type: 'chunin', index: 2, count: 2 }], ryo: 900, exp: 260, turns: 3, npcId: 'tsunade', relationshipGain: 10 }
                ],
                trainings: [
                    { name: 'Fuerza monstruosa', price: 900, description: '+40 HP máx, +2 Taijutsu', effect: { maxHp: 40, taijutsu: 2 } }
                ],
                gifts: ['🍙 Bento', '💊 Píldora Militar'],
                rewards: { maxHpBonus: 20 }
            },
            orochimaru: {
                id: 'orochimaru',
                name: 'Orochimaru',
                icon: '🐍',
                village: 'sound',
                rank: 'Sannin',
                level: 20,
                personality: 'ambiguous',
                relationship: 0,
                relationshipLevel: 'Desconocido',
                location: 'valle',
                availability: 'event',
                stats: { hp: 520, chakra: 460, attack: 58, defense: 33, accuracy: 22, genjutsu: 18 },
                dialogues: {
                    first_meeting: ['Qué interesante...'],
                    neutral: ['El conocimiento es poder.'],
                    friendly: ['Puedo ofrecerte mejoras.'],
                    best_friend: ['No desperdicies tu potencial.'],
                    rival: ['¿Podrás superarte?'],
                    enemy: ['Tu cuerpo me servirá igual.']
                },
                interactions: ['talk', 'mission', 'training', 'gift', 'friendly_battle'],
                missions: [
                    { name: '🧪 Recuperar muestra', rank: 'B', description: 'Trae un frasco sellado. No lo abras.', enemies: [{ type: 'chunin', index: 1, count: 3 }], ryo: 1200, exp: 320, turns: 3, npcId: 'orochimaru', relationshipGain: 10 },
                    { name: '🐍 Probar técnica', rank: 'A', description: 'Prueba una técnica peligrosa y sobrevive.', enemies: [{ type: 'jonin', index: 1, count: 2 }], ryo: 2500, exp: 500, turns: 4, npcId: 'orochimaru', relationshipGain: 10 }
                ],
                trainings: [
                    { name: 'Experimento oscuro', price: 2500, description: '+60 Chakra máx', effect: { maxChakra: 60 } }
                ],
                gifts: ['💊 Píldora de Chakra'],
                rewards: { unlockDarkTraining: true }
            },
            itachi: {
                id: 'itachi',
                name: 'Itachi Uchiha',
                icon: '🌑',
                village: 'event',
                rank: 'Aparición',
                level: 20,
                personality: 'stoic',
                relationship: 0,
                relationshipLevel: 'Desconocido',
                location: 'bosque',
                availability: 'event',
                stats: { hp: 470, chakra: 420, attack: 58, defense: 34, accuracy: 23, genjutsu: 22 },
                dialogues: {
                    first_meeting: ['La verdad llega tarde.'],
                    neutral: ['Observa antes de actuar.'],
                    friendly: ['Tu mirada es firme.'],
                    best_friend: ['No pierdas tu camino.'],
                    rival: ['Entiende el dolor.'],
                    enemy: ['No hay vuelta atrás.']
                },
                interactions: ['talk', 'friendly_battle'],
                missions: [],
                trainings: [],
                gifts: [],
                rewards: {}
            },
            hinata: {
                id: 'hinata',
                name: 'Hinata Hyuga',
                icon: '💜',
                village: 'konoha',
                rank: 'Chūnin',
                level: 14,
                personality: 'shy',
                relationship: 0,
                relationshipLevel: 'Desconocido',
                location: 'konoha',
                availability: 'always',
                stats: { hp: 360, chakra: 240, attack: 45, defense: 28, accuracy: 20, genjutsu: 12 },
                dialogues: {
                    first_meeting: ['H-hola...'],
                    neutral: ['Puedo ayudarte a entrenar.'],
                    friendly: ['Estoy feliz de verte.'],
                    best_friend: ['Gracias por creer en mí.'],
                    rival: ['No perderé.'],
                    enemy: ['No puedo hablar contigo.']
                },
                interactions: ['talk', 'mission', 'training', 'gift', 'friendly_battle'],
                missions: [
                    { name: '👁️ Práctica de Byakugan', rank: 'D', description: 'Entrena percepción y precisión.', enemies: [{ type: 'genin', index: 0, count: 1 }], ryo: 90, exp: 40, turns: 1, npcId: 'hinata', relationshipGain: 10 },
                    { name: '🛡️ Patrulla silenciosa', rank: 'C', description: 'Evita un incidente en el barrio Hyuga.', enemies: [{ type: 'genin', index: 1, count: 2 }], ryo: 190, exp: 80, turns: 2, npcId: 'hinata', relationshipGain: 10 }
                ],
                trainings: [
                    { name: 'Precisión suave', price: 250, description: '+2 Taijutsu, +1 Crítico', effect: { taijutsu: 2 } }
                ],
                gifts: ['🍜 Ramen Ichiraku'],
                rewards: { evasionBonus: 0.05 }
            },
            shikamaru: {
                id: 'shikamaru',
                name: 'Shikamaru Nara',
                icon: '🧠',
                village: 'konoha',
                rank: 'Consejero',
                level: 18,
                personality: 'lazy',
                relationship: 0,
                relationshipLevel: 'Desconocido',
                location: 'konoha',
                availability: 'always',
                stats: { hp: 390, chakra: 320, attack: 46, defense: 30, accuracy: 22, genjutsu: 16 },
                dialogues: {
                    first_meeting: ['Qué problemático...'],
                    neutral: ['Piensa dos turnos por adelantado.'],
                    friendly: ['Te paso un plan rápido.'],
                    best_friend: ['Confío en tus decisiones.'],
                    rival: ['Veamos quién lee mejor el tablero.'],
                    enemy: ['No voy a dudar.']
                },
                interactions: ['talk', 'mission', 'training', 'gift', 'friendly_battle'],
                missions: [
                    { name: '🗺️ Planear patrulla', rank: 'D', description: 'Diseña un recorrido de seguridad.', enemies: [{ type: 'genin', index: 0, count: 1 }], ryo: 110, exp: 45, turns: 1, npcId: 'shikamaru', relationshipGain: 10 },
                    { name: '🕵️ Interceptar espías', rank: 'C', description: 'Evita fuga de información.', enemies: [{ type: 'genin', index: 2, count: 2 }], ryo: 220, exp: 90, turns: 2, npcId: 'shikamaru', relationshipGain: 10 }
                ],
                trainings: [
                    { name: 'Estrategia', price: 400, description: '+2 Genjutsu (mente), +1 Ninjutsu', effect: { genjutsu: 2, ninjutsu: 1 } }
                ],
                gifts: ['🍙 Bento'],
                rewards: { missionExpBonus: 0.05 }
            },
            temari: {
                id: 'temari',
                name: 'Temari',
                icon: '🌪️',
                village: 'suna',
                rank: 'Jōnin',
                level: 16,
                personality: 'strict',
                relationship: 0,
                relationshipLevel: 'Desconocido',
                location: 'suna',
                availability: 'random',
                stats: { hp: 420, chakra: 260, attack: 50, defense: 28, accuracy: 21, genjutsu: 12 },
                dialogues: {
                    first_meeting: ['No seas lento.'],
                    neutral: ['El viento corta sin avisar.'],
                    friendly: ['Te enseñaré a mantener distancia.'],
                    best_friend: ['Bien. Eres confiable.'],
                    rival: ['No me hagas repetirte.'],
                    enemy: ['Te derribaré.']
                },
                interactions: ['talk', 'mission', 'training', 'gift', 'friendly_battle'],
                missions: [
                    { name: '💨 Patrulla de frontera', rank: 'C', description: 'Vigila rutas de comercio.', enemies: [{ type: 'genin', index: 1, count: 2 }], ryo: 260, exp: 95, turns: 2, npcId: 'temari', relationshipGain: 10 },
                    { name: '🌪️ Cortar suministro', rank: 'B', description: 'Detén una banda en el desierto.', enemies: [{ type: 'chunin', index: 3, count: 2 }], ryo: 800, exp: 240, turns: 3, npcId: 'temari', relationshipGain: 10 }
                ],
                trainings: [
                    { name: 'Técnicas de distancia', price: 500, description: '+2 Ninjutsu', effect: { ninjutsu: 2 } }
                ],
                gifts: ['💊 Píldora de Chakra'],
                rewards: { ninjutsuBonus: 1 }
            },
            neji: {
                id: 'neji',
                name: 'Neji Hyuga',
                icon: '🧿',
                village: 'konoha',
                rank: 'Jōnin',
                level: 17,
                personality: 'stoic',
                relationship: 0,
                relationshipLevel: 'Desconocido',
                location: 'konoha',
                availability: 'always',
                stats: { hp: 430, chakra: 260, attack: 52, defense: 32, accuracy: 23, genjutsu: 12 },
                dialogues: {
                    first_meeting: ['El destino no es absoluto.'],
                    neutral: ['La precisión es todo.'],
                    friendly: ['Puedo corregir tu guardia.'],
                    best_friend: ['Has crecido de verdad.'],
                    rival: ['Te haré esforzarte.'],
                    enemy: ['No retrocederé.']
                },
                interactions: ['talk', 'mission', 'training', 'gift', 'friendly_battle'],
                missions: [
                    { name: '👁️ Vigilancia Hyuga', rank: 'C', description: 'Protege un evento del clan.', enemies: [{ type: 'genin', index: 2, count: 2 }], ryo: 260, exp: 95, turns: 2, npcId: 'neji', relationshipGain: 10 },
                    { name: '🧿 Técnica del vacío', rank: 'B', description: 'Sesión dura de taijutsu preciso.', enemies: [{ type: 'chunin', index: 2, count: 2 }], ryo: 900, exp: 260, turns: 3, npcId: 'neji', relationshipGain: 10 }
                ],
                trainings: [
                    { name: 'Golpes de puntos', price: 550, description: '+2 Taijutsu, +2 Crítico', effect: { taijutsu: 2 } }
                ],
                gifts: ['🍙 Bento'],
                rewards: { critBonus: 2 }
            }
        },

        // Clima
        weatherOptionsBySeason: {
            primavera: ['soleado', 'soleado', 'nublado', 'lluvia'],
            verano: ['soleado', 'soleado', 'soleado', 'nublado', 'tormenta'],
            otono: ['nublado', 'lluvia', 'lluvia', 'soleado'],
            invierno: ['nublado', 'nieve', 'nieve', 'tormenta']
        },

        // Eventos recurrentes
        recurringEvents: [
            { id: 'festival_konoha', name: 'Festival de Konoha', when: (p) => p.location === 'konoha' && p.month === 5 && p.day === 15 },
            { id: 'examen_chunin_enero', name: 'Examen Chunin', when: (p) => p.location === 'konoha' && p.month === 1 && p.day === 1 },
            { id: 'examen_chunin_julio', name: 'Examen Chunin', when: (p) => p.location === 'konoha' && p.month === 7 && p.day === 1 },
            { id: 'luna_llena', name: 'Luna Llena', when: (p) => p.day === 15 },
            { id: 'torneo_aldea', name: 'Torneo de la Aldea', when: (p) => p.location === 'konoha' && p.day === 30 }
        ],
        
        clans: {
            uchiha: { name: 'Uchiha', icon: '🔥', description: 'Clan de Konoha', hp: 100, chakra: 120, taijutsu: 12, ninjutsu: 18, genjutsu: 15, element: 'fire', village: 'konoha' },
            uzumaki: { name: 'Uzumaki', icon: '🌀', description: 'Clan de Konoha', hp: 140, chakra: 150, taijutsu: 15, ninjutsu: 14, genjutsu: 8, element: 'wind', village: 'konoha' },
            hyuga: { name: 'Hyuga', icon: '👁️', description: 'Clan de Konoha', hp: 110, chakra: 100, taijutsu: 20, ninjutsu: 10, genjutsu: 12, element: 'water', village: 'konoha' },
            nara: { name: 'Nara', icon: '🦌', description: 'Clan de Konoha', hp: 90, chakra: 110, taijutsu: 10, ninjutsu: 15, genjutsu: 18, element: 'earth', village: 'konoha' },
            akimichi: { name: 'Akimichi', icon: '🍖', description: 'Clan de Konoha', hp: 150, chakra: 90, taijutsu: 18, ninjutsu: 12, genjutsu: 8, element: 'earth', village: 'konoha' },
            aburame: { name: 'Aburame', icon: '🐛', description: 'Clan de Konoha', hp: 95, chakra: 115, taijutsu: 11, ninjutsu: 16, genjutsu: 14, element: 'earth', village: 'konoha' },
            inuzuka: { name: 'Inuzuka', icon: '🐺', description: 'Clan de Konoha', hp: 115, chakra: 95, taijutsu: 17, ninjutsu: 11, genjutsu: 10, element: 'earth', village: 'konoha' },
            yamanaka: { name: 'Yamanaka', icon: '🌸', description: 'Clan de Konoha', hp: 85, chakra: 125, taijutsu: 9, ninjutsu: 13, genjutsu: 20, element: 'water', village: 'konoha' },
            hatake: { name: 'Hatake', icon: '⚡', description: 'Clan de Konoha', hp: 105, chakra: 130, taijutsu: 14, ninjutsu: 17, genjutsu: 13, element: 'lightning', village: 'konoha' },
            senju: { name: 'Senju', icon: '🌳', description: 'Clan de Konoha', hp: 120, chakra: 120, taijutsu: 15, ninjutsu: 15, genjutsu: 15, element: 'earth', village: 'konoha' },
            sarutobi: { name: 'Sarutobi', icon: '🔮', description: 'Clan de Konoha', hp: 100, chakra: 140, taijutsu: 12, ninjutsu: 19, genjutsu: 11, element: 'fire', village: 'konoha' },
            shimura: { name: 'Shimura', icon: '🩶', description: 'Clan de Konoha', hp: 95, chakra: 105, taijutsu: 13, ninjutsu: 14, genjutsu: 16, element: 'wind', village: 'konoha' },
            namikaze: { name: 'Namikaze', icon: '💛', description: 'Clan de Konoha', hp: 105, chakra: 135, taijutsu: 16, ninjutsu: 20, genjutsu: 10, element: 'lightning', village: 'konoha' },
            rock_lee: { name: 'Sin Clan (Lee)', icon: '👊', description: 'Sin clan de Konoha', hp: 130, chakra: 50, taijutsu: 25, ninjutsu: 5, genjutsu: 5, element: null, village: 'konoha' },
            morino: { name: 'Morino', icon: '🗡️', description: 'Clan de Konoha', hp: 100, chakra: 110, taijutsu: 14, ninjutsu: 12, genjutsu: 17, element: 'wind', village: 'konoha' },
            gekko: { name: 'Gakkō', icon: '🌙', description: 'Clan de Konoha', hp: 95, chakra: 120, taijutsu: 13, ninjutsu: 15, genjutsu: 15, element: 'water', village: 'konoha' },

            sabaku: { name: 'Sabaku', icon: '🏜️', description: 'Clan de Suna', hp: 120, chakra: 130, taijutsu: 10, ninjutsu: 20, genjutsu: 12, element: 'wind', village: 'suna' },
            chiyo: { name: 'Chiyo', icon: '🧵', description: 'Clan de Suna', hp: 85, chakra: 140, taijutsu: 8, ninjutsu: 18, genjutsu: 16, element: 'wind', village: 'suna' },
            kazahana_s: { name: 'Kazahana', icon: '🌬️', description: 'Clan de Suna', hp: 100, chakra: 125, taijutsu: 12, ninjutsu: 17, genjutsu: 13, element: 'wind', village: 'suna' },
            ryuzetsu: { name: 'Ryūzetsu', icon: '🌵', description: 'Clan de Suna', hp: 110, chakra: 115, taijutsu: 14, ninjutsu: 16, genjutsu: 12, element: 'earth', village: 'suna' },
            tetsu_s: { name: 'Tetsu', icon: '⚒️', description: 'Clan de Suna', hp: 130, chakra: 90, taijutsu: 19, ninjutsu: 11, genjutsu: 8, element: 'earth', village: 'suna' },
            fuma: { name: 'Fūma', icon: '🪃', description: 'Clan de Suna', hp: 115, chakra: 100, taijutsu: 18, ninjutsu: 13, genjutsu: 9, element: 'wind', village: 'suna' },
            karura: { name: 'Karura', icon: '💨', description: 'Clan de Suna', hp: 90, chakra: 145, taijutsu: 9, ninjutsu: 19, genjutsu: 14, element: 'wind', village: 'suna' },
            pakura_c: { name: 'Pakura', icon: '🔥', description: 'Clan de Suna', hp: 95, chakra: 135, taijutsu: 10, ninjutsu: 18, genjutsu: 15, element: 'fire', village: 'suna' },
            taiko: { name: 'Taiko', icon: '🥁', description: 'Clan de Suna', hp: 125, chakra: 95, taijutsu: 17, ninjutsu: 12, genjutsu: 9, element: 'earth', village: 'suna' },
            maki_s: { name: 'Maki', icon: '🎋', description: 'Clan de Suna', hp: 100, chakra: 110, taijutsu: 15, ninjutsu: 14, genjutsu: 13, element: 'wind', village: 'suna' },
            yatai: { name: 'Yatai', icon: '🌪️', description: 'Clan de Suna', hp: 105, chakra: 120, taijutsu: 13, ninjutsu: 16, genjutsu: 13, element: 'wind', village: 'suna' },
            kankuro_c: { name: 'Kankurō', icon: '🎭', description: 'Clan de Suna', hp: 90, chakra: 130, taijutsu: 11, ninjutsu: 17, genjutsu: 14, element: 'earth', village: 'suna' },
            sunagakure_j: { name: 'Jōmae', icon: '☀️', description: 'Clan de Suna', hp: 110, chakra: 105, taijutsu: 16, ninjutsu: 13, genjutsu: 13, element: 'fire', village: 'suna' },
            ishidate: { name: 'Ishidate', icon: '💎', description: 'Clan de Suna', hp: 120, chakra: 100, taijutsu: 17, ninjutsu: 14, genjutsu: 10, element: 'earth', village: 'suna' },
            moryo: { name: 'Mōryō', icon: '👁️', description: 'Clan de Suna', hp: 85, chakra: 150, taijutsu: 8, ninjutsu: 20, genjutsu: 15, element: 'wind', village: 'suna' },
            no_clan_s: { name: 'Sin Clan (Suna)', icon: '🌾', description: 'Sin clan de Suna', hp: 110, chakra: 100, taijutsu: 16, ninjutsu: 13, genjutsu: 9, element: 'wind', village: 'suna' },

            hozuki: { name: 'Hōzuki', icon: '💧', description: 'Clan de Kiri', hp: 110, chakra: 120, taijutsu: 13, ninjutsu: 16, genjutsu: 10, element: 'water', village: 'kiri' },
            yuki: { name: 'Yuki', icon: '❄️', description: 'Clan de Kiri', hp: 95, chakra: 130, taijutsu: 10, ninjutsu: 18, genjutsu: 12, element: 'water', village: 'kiri' },
            kaguya: { name: 'Kaguya', icon: '🦴', description: 'Clan de Kiri', hp: 125, chakra: 105, taijutsu: 20, ninjutsu: 10, genjutsu: 8, element: 'earth', village: 'kiri' },
            momochi: { name: 'Momochi', icon: '🗡️', description: 'Clan de Kiri', hp: 120, chakra: 100, taijutsu: 21, ninjutsu: 11, genjutsu: 7, element: 'water', village: 'kiri' },
            terumi: { name: 'Terumi', icon: '🌋', description: 'Clan de Kiri', hp: 100, chakra: 135, taijutsu: 11, ninjutsu: 19, genjutsu: 13, element: 'fire', village: 'kiri' },
            hoshigaki: { name: 'Hoshigaki', icon: '🦈', description: 'Clan de Kiri', hp: 140, chakra: 115, taijutsu: 18, ninjutsu: 15, genjutsu: 6, element: 'water', village: 'kiri' },
            suigetsu_c: { name: 'Suigetsu', icon: '🌊', description: 'Clan de Kiri', hp: 105, chakra: 125, taijutsu: 14, ninjutsu: 17, genjutsu: 10, element: 'water', village: 'kiri' },
            ao_c: { name: 'Ao', icon: '🔵', description: 'Clan de Kiri', hp: 90, chakra: 130, taijutsu: 10, ninjutsu: 16, genjutsu: 16, element: 'water', village: 'kiri' },
            mangetsu: { name: 'Mangetsu', icon: '🌕', description: 'Clan de Kiri', hp: 115, chakra: 120, taijutsu: 17, ninjutsu: 15, genjutsu: 10, element: 'water', village: 'kiri' },
            jinin: { name: 'Jinin', icon: '💀', description: 'Clan de Kiri', hp: 125, chakra: 95, taijutsu: 20, ninjutsu: 12, genjutsu: 7, element: 'lightning', village: 'kiri' },
            kushimaru: { name: 'Kushimaru', icon: '🧵', description: 'Clan de Kiri', hp: 110, chakra: 105, taijutsu: 19, ninjutsu: 12, genjutsu: 8, element: 'water', village: 'kiri' },
            ameyuri: { name: 'Ameyuri', icon: '⚡', description: 'Clan de Kiri', hp: 100, chakra: 125, taijutsu: 15, ninjutsu: 17, genjutsu: 10, element: 'lightning', village: 'kiri' },
            jinpachi: { name: 'Jinpachi', icon: '💣', description: 'Clan de Kiri', hp: 120, chakra: 110, taijutsu: 17, ninjutsu: 15, genjutsu: 7, element: 'fire', village: 'kiri' },
            fuguki: { name: 'Fuguki', icon: '🐡', description: 'Clan de Kiri', hp: 135, chakra: 100, taijutsu: 19, ninjutsu: 13, genjutsu: 6, element: 'water', village: 'kiri' },
            utakata_c: { name: 'Utakata', icon: '🫧', description: 'Clan de Kiri', hp: 100, chakra: 140, taijutsu: 11, ninjutsu: 18, genjutsu: 13, element: 'water', village: 'kiri' },
            no_clan_k: { name: 'Sin Clan (Kiri)', icon: '🌫️', description: 'Sin clan de Kiri', hp: 120, chakra: 100, taijutsu: 18, ninjutsu: 13, genjutsu: 7, element: 'water', village: 'kiri' },

            kaguya_iwa: { name: 'Kaguya (Iwa)', icon: '🦴', description: 'Clan de Iwa', hp: 130, chakra: 95, taijutsu: 21, ninjutsu: 9, genjutsu: 7, element: 'earth', village: 'iwa' },
            tsuchikage_c: { name: 'Tsuchikage', icon: '🪨', description: 'Clan de Iwa', hp: 120, chakra: 120, taijutsu: 14, ninjutsu: 18, genjutsu: 10, element: 'earth', village: 'iwa' },
            akatsuchi: { name: 'Akatsuchi', icon: '🔴', description: 'Clan de Iwa', hp: 145, chakra: 95, taijutsu: 20, ninjutsu: 12, genjutsu: 6, element: 'earth', village: 'iwa' },
            kurotsuchi: { name: 'Kurotsuchi', icon: '🌋', description: 'Clan de Iwa', hp: 110, chakra: 120, taijutsu: 16, ninjutsu: 17, genjutsu: 10, element: 'fire', village: 'iwa' },
            deidara_c: { name: 'Deidara', icon: '💥', description: 'Clan de Iwa', hp: 95, chakra: 140, taijutsu: 10, ninjutsu: 22, genjutsu: 8, element: 'wind', village: 'iwa' },
            gari: { name: 'Gari', icon: '⚡', description: 'Clan de Iwa', hp: 115, chakra: 110, taijutsu: 17, ninjutsu: 15, genjutsu: 8, element: 'lightning', village: 'iwa' },
            roshi_c: { name: 'Rōshi', icon: '🌋', description: 'Clan de Iwa', hp: 130, chakra: 105, taijutsu: 18, ninjutsu: 14, genjutsu: 7, element: 'fire', village: 'iwa' },
            han_c: { name: 'Han', icon: '💨', description: 'Clan de Iwa', hp: 140, chakra: 100, taijutsu: 19, ninjutsu: 13, genjutsu: 6, element: 'wind', village: 'iwa' },
            ishikawa: { name: 'Ishikawa', icon: '⛏️', description: 'Clan de Iwa', hp: 125, chakra: 110, taijutsu: 17, ninjutsu: 15, genjutsu: 8, element: 'earth', village: 'iwa' },
            sekiei: { name: 'Sekiei', icon: '💎', description: 'Clan de Iwa', hp: 135, chakra: 95, taijutsu: 20, ninjutsu: 12, genjutsu: 6, element: 'earth', village: 'iwa' },
            kokuyo: { name: 'Kokuyō', icon: '🖤', description: 'Clan de Iwa', hp: 120, chakra: 105, taijutsu: 18, ninjutsu: 14, genjutsu: 8, element: 'earth', village: 'iwa' },
            tetsu_iwa: { name: 'Tetsu (Iwa)', icon: '🛡️', description: 'Clan de Iwa', hp: 150, chakra: 85, taijutsu: 22, ninjutsu: 10, genjutsu: 5, element: 'earth', village: 'iwa' },
            kamizuru: { name: 'Kamizuru', icon: '🐝', description: 'Clan de Iwa', hp: 95, chakra: 130, taijutsu: 10, ninjutsu: 18, genjutsu: 14, element: 'earth', village: 'iwa' },
            minami: { name: 'Minami', icon: '🔩', description: 'Clan de Iwa', hp: 110, chakra: 115, taijutsu: 15, ninjutsu: 16, genjutsu: 11, element: 'earth', village: 'iwa' },
            hayabusa: { name: 'Hayabusa', icon: '🌪️', description: 'Clan de Iwa', hp: 100, chakra: 120, taijutsu: 14, ninjutsu: 17, genjutsu: 11, element: 'wind', village: 'iwa' },
            no_clan_iwa: { name: 'Sin Clan (Iwa)', icon: '⛰️', description: 'Sin clan de Iwa', hp: 130, chakra: 90, taijutsu: 19, ninjutsu: 12, genjutsu: 7, element: 'earth', village: 'iwa' },

            yotsuki: { name: 'Yotsuki', icon: '⚡', description: 'Clan de Kumo', hp: 120, chakra: 125, taijutsu: 18, ninjutsu: 16, genjutsu: 8, element: 'lightning', village: 'kumo' },
            killer_c: { name: 'Killer B', icon: '🎤', description: 'Clan de Kumo', hp: 130, chakra: 120, taijutsu: 20, ninjutsu: 15, genjutsu: 7, element: 'lightning', village: 'kumo' },
            darui_c: { name: 'Darui', icon: '🌩️', description: 'Clan de Kumo', hp: 115, chakra: 130, taijutsu: 15, ninjutsu: 18, genjutsu: 10, element: 'lightning', village: 'kumo' },
            yugito_c: { name: 'Yugito', icon: '🐱', description: 'Clan de Kumo', hp: 110, chakra: 140, taijutsu: 14, ninjutsu: 18, genjutsu: 11, element: 'fire', village: 'kumo' },
            omoi_c: { name: 'Omoi', icon: '⚔️', description: 'Clan de Kumo', hp: 120, chakra: 110, taijutsu: 19, ninjutsu: 14, genjutsu: 9, element: 'lightning', village: 'kumo' },
            karui_c: { name: 'Karui', icon: '🗡️', description: 'Clan de Kumo', hp: 115, chakra: 105, taijutsu: 20, ninjutsu: 13, genjutsu: 9, element: 'lightning', village: 'kumo' },
            samui_c: { name: 'Samui', icon: '🧊', description: 'Clan de Kumo', hp: 105, chakra: 120, taijutsu: 16, ninjutsu: 16, genjutsu: 11, element: 'water', village: 'kumo' },
            dodai_c: { name: 'Dodai', icon: '🌿', description: 'Clan de Kumo', hp: 110, chakra: 125, taijutsu: 13, ninjutsu: 17, genjutsu: 13, element: 'earth', village: 'kumo' },
            atsui_c: { name: 'Atsui', icon: '🔥', description: 'Clan de Kumo', hp: 125, chakra: 100, taijutsu: 20, ninjutsu: 13, genjutsu: 8, element: 'fire', village: 'kumo' },
            toroi_c: { name: 'Toroi', icon: '🧲', description: 'Clan de Kumo', hp: 100, chakra: 135, taijutsu: 12, ninjutsu: 18, genjutsu: 13, element: 'lightning', village: 'kumo' },
            raikage_c: { name: 'Raikage', icon: '💪', description: 'Clan de Kumo', hp: 145, chakra: 105, taijutsu: 23, ninjutsu: 12, genjutsu: 6, element: 'lightning', village: 'kumo' },
            kinkaku_c: { name: 'Kinkaku', icon: '🌟', description: 'Clan de Kumo', hp: 125, chakra: 120, taijutsu: 17, ninjutsu: 16, genjutsu: 9, element: 'lightning', village: 'kumo' },
            ginkaku_c: { name: 'Ginkaku', icon: '🌙', description: 'Clan de Kumo', hp: 120, chakra: 125, taijutsu: 16, ninjutsu: 17, genjutsu: 9, element: 'wind', village: 'kumo' },
            mabui_c: { name: 'Mabui', icon: '💫', description: 'Clan de Kumo', hp: 90, chakra: 145, taijutsu: 10, ninjutsu: 19, genjutsu: 14, element: 'lightning', village: 'kumo' },
            ringo_c: { name: 'Ringo', icon: '⚡', description: 'Clan de Kumo', hp: 110, chakra: 120, taijutsu: 17, ninjutsu: 15, genjutsu: 10, element: 'lightning', village: 'kumo' },
            no_clan_kumo: { name: 'Sin Clan (Kumo)', icon: '☁️', description: 'Sin clan de Kumo', hp: 125, chakra: 100, taijutsu: 19, ninjutsu: 13, genjutsu: 7, element: 'lightning', village: 'kumo' },

            pein_c: { name: 'Pein', icon: '👁️', description: 'Clan de Ame', hp: 95, chakra: 160, taijutsu: 10, ninjutsu: 22, genjutsu: 15, element: 'water', village: 'ame' },
            konan_c: { name: 'Konan', icon: '📄', description: 'Clan de Ame', hp: 90, chakra: 155, taijutsu: 9, ninjutsu: 20, genjutsu: 16, element: 'water', village: 'ame' },
            yahiko_c: { name: 'Yahiko', icon: '🌧️', description: 'Clan de Ame', hp: 110, chakra: 130, taijutsu: 14, ninjutsu: 17, genjutsu: 12, element: 'water', village: 'ame' },
            hanzo_c: { name: 'Hanzō', icon: '☠️', description: 'Clan de Ame', hp: 125, chakra: 110, taijutsu: 18, ninjutsu: 15, genjutsu: 10, element: 'wind', village: 'ame' },
            ame_shinobi: { name: 'Ame Shinobi', icon: '💦', description: 'Clan de Ame', hp: 100, chakra: 120, taijutsu: 14, ninjutsu: 16, genjutsu: 13, element: 'water', village: 'ame' },
            kuriarare: { name: 'Kuriarare', icon: '🔩', description: 'Clan de Ame', hp: 115, chakra: 105, taijutsu: 17, ninjutsu: 14, genjutsu: 11, element: 'earth', village: 'ame' },
            nagato_c: { name: 'Nagato', icon: '🌑', description: 'Clan de Ame', hp: 90, chakra: 170, taijutsu: 8, ninjutsu: 23, genjutsu: 16, element: 'water', village: 'ame' },
            fuma_ame: { name: 'Fūma (Ame)', icon: '🪃', description: 'Clan de Ame', hp: 110, chakra: 110, taijutsu: 16, ninjutsu: 15, genjutsu: 12, element: 'wind', village: 'ame' },
            ame_mist: { name: 'Kiri no Ko', icon: '🌫️', description: 'Clan de Ame', hp: 95, chakra: 130, taijutsu: 12, ninjutsu: 17, genjutsu: 14, element: 'water', village: 'ame' },
            kaiza_c: { name: 'Kaiza', icon: '⚓', description: 'Clan de Ame', hp: 120, chakra: 100, taijutsu: 18, ninjutsu: 13, genjutsu: 11, element: 'water', village: 'ame' },
            kagari_c: { name: 'Kagari', icon: '🕸️', description: 'Clan de Ame', hp: 100, chakra: 120, taijutsu: 13, ninjutsu: 17, genjutsu: 13, element: 'wind', village: 'ame' },
            mukade_c: { name: 'Mukade', icon: '🦂', description: 'Clan de Ame', hp: 105, chakra: 125, taijutsu: 12, ninjutsu: 17, genjutsu: 14, element: 'earth', village: 'ame' },
            yura_c: { name: 'Yura', icon: '🌊', description: 'Clan de Ame', hp: 90, chakra: 140, taijutsu: 10, ninjutsu: 19, genjutsu: 14, element: 'water', village: 'ame' },
            ame_silent: { name: 'Clan Silencioso', icon: '🤫', description: 'Clan de Ame', hp: 85, chakra: 145, taijutsu: 9, ninjutsu: 18, genjutsu: 18, element: 'wind', village: 'ame' },
            ame_dark: { name: 'Clan Oscuro', icon: '🖤', description: 'Clan de Ame', hp: 100, chakra: 135, taijutsu: 11, ninjutsu: 19, genjutsu: 13, element: 'water', village: 'ame' },
            no_clan_ame: { name: 'Sin Clan (Ame)', icon: '💧', description: 'Sin clan de Ame', hp: 105, chakra: 125, taijutsu: 13, ninjutsu: 16, genjutsu: 14, element: 'water', village: 'ame' }
        },

        // Reglas de Kekkei Genkai por clan
        // type:
        // - guaranteed: 100% asignado
        // - chance: probabilidad sobre 100
        // - none: nunca obtiene
        clanKekkeiRules: {
            // Garantizados
            uchiha: { type: 'guaranteed', kekkei: 'Sharingan' },
            hyuga: { type: 'guaranteed', kekkei: 'Byakugan' },
            kaguya: { type: 'guaranteed', kekkei: 'Shikotsumyaku' },
            yuki: { type: 'guaranteed', kekkei: 'Hyoton' },
            hozuki: { type: 'guaranteed', kekkei: 'Suika no Jutsu' },

            // Posibles (baja probabilidad)
            senju: { type: 'chance', kekkei: 'Mokuton', chance: 5 },
            uzumaki: { type: 'chance', kekkei: 'Modo Sabio', chance: 3 },
            sarutobi: { type: 'chance', kekkei: 'Scorch Release', chance: 2 },
            hatake: { type: 'chance', kekkei: 'Rinnegan', chance: 0.5 },

            // Nunca (sin posibilidad)
            nara: { type: 'none' },
            akimichi: { type: 'none' },
            aburame: { type: 'none' },
            inuzuka: { type: 'none' },
            yamanaka: { type: 'none' },
            rock_lee: { type: 'none' }
        },

        kekkeiGenkaiList: [
            { 
                name: 'Sharingan', 
                chance: 3, 
                levels: [
                    { level: 1, name: '1 Aspa', exp: 0, bonus: { genjutsu: 3, critChance: 5 } },
                    { level: 2, name: '2 Aspas', exp: 100, bonus: { genjutsu: 5, critChance: 10 } },
                    { level: 3, name: '3 Aspas', exp: 300, bonus: { genjutsu: 8, critChance: 15 } },
                    { level: 4, name: 'Mangekyō', exp: 600, bonus: { genjutsu: 12, critChance: 20, ninjutsu: 5 } },
                    { level: 5, name: 'Eternal Mangekyō', exp: 1000, bonus: { genjutsu: 16, critChance: 28, ninjutsu: 10 } }
                ]
            },
            { 
                name: 'Byakugan', 
                chance: 3, 
                levels: [
                    { level: 1, name: 'Básico', exp: 0, bonus: { taijutsu: 3, critChance: 8 } },
                    { level: 2, name: 'Intermedio', exp: 100, bonus: { taijutsu: 6, critChance: 15 } },
                    { level: 3, name: 'Avanzado', exp: 300, bonus: { taijutsu: 10, critChance: 22 } },
                    { level: 4, name: 'Tenseigan', exp: 700, bonus: { taijutsu: 15, critChance: 30, chakraRegen: 10 } }
                ]
            },
            {
                name: 'Shikotsumyaku',
                chance: 0,
                levels: [
                    { level: 1, name: 'Básico', exp: 0, bonus: { taijutsu: 4, maxHp: 20 } },
                    { level: 2, name: 'Avanzado', exp: 250, bonus: { taijutsu: 8, maxHp: 45, critChance: 6 } },
                    { level: 3, name: 'Perfecto', exp: 650, bonus: { taijutsu: 12, maxHp: 80, critChance: 12 } }
                ]
            },
            {
                name: 'Hyoton',
                chance: 0,
                levels: [
                    { level: 1, name: 'Básico', exp: 0, bonus: { ninjutsu: 5, critChance: 4 } },
                    { level: 2, name: 'Avanzado', exp: 350, bonus: { ninjutsu: 10, critChance: 10, maxChakra: 30 } }
                ]
            },
            {
                name: 'Suika no Jutsu',
                chance: 0,
                levels: [
                    { level: 1, name: 'Hidratación', exp: 0, bonus: { maxHp: 15, chakraRegen: 2 } },
                    { level: 2, name: 'Licuefacción', exp: 220, bonus: { maxHp: 35, chakraRegen: 6, critChance: 5 } },
                    { level: 3, name: 'Maestría', exp: 600, bonus: { maxHp: 65, chakraRegen: 10, critChance: 10 } }
                ]
            },
            { 
                name: 'Rinnegan', 
                chance: 0.5, 
                levels: [
                    { level: 1, name: '6 Caminos', exp: 0, bonus: { all: 10, critChance: 25 } },
                    { level: 2, name: 'Rinne-Sharingan', exp: 500, bonus: { all: 20, critChance: 40 } }
                ]
            },
            { 
                name: 'Modo Sabio', 
                chance: 2, 
                levels: [
                    { level: 1, name: 'Básico', exp: 0, bonus: { ninjutsu: 5, chakraRegen: 3 } },
                    { level: 2, name: 'Avanzado', exp: 150, bonus: { ninjutsu: 10, chakraRegen: 7 } },
                    { level: 3, name: 'Perfecto', exp: 400, bonus: { ninjutsu: 15, chakraRegen: 12, maxChakra: 50 } }
                ]
            },
            {
                name: 'Scorch Release',
                chance: 2,
                levels: [
                    { level: 1, name: 'Despertar', exp: 0, bonus: { ninjutsu: 6, critChance: 6 } },
                    { level: 2, name: 'Dominio', exp: 420, bonus: { ninjutsu: 12, critChance: 14, maxChakra: 40 } }
                ]
            },
            { 
                name: 'Mokuton', 
                chance: 1.5, 
                levels: [
                    { level: 1, name: 'Básico', exp: 0, bonus: { ninjutsu: 4, maxHp: 15 } },
                    { level: 2, name: 'Hashirama', exp: 200, bonus: { ninjutsu: 8, maxHp: 40 } }
                ]
            }
        ],

        elements: {
            fire: { name: 'Fuego (Katon)', icon: '🔥', bonus: 'Daño quemadura' },
            water: { name: 'Agua (Suiton)', icon: '💧', bonus: '+Defensa' },
            wind: { name: 'Viento (Futon)', icon: '💨', bonus: '+Velocidad' },
            earth: { name: 'Tierra (Doton)', icon: '🪨', bonus: '+HP' },
            lightning: { name: 'Rayo (Raiton)', icon: '⚡', bonus: '+Crítico' }
        },

        // Sistema de desbloqueo de jutsus
        normalizeAcademyJutsus() {
            const rankRequirements = {
                'D': { level: 1, rank: 'Genin', exp: 30, ninjutsu: 3 },
                'C': { level: 2, rank: 'Genin', exp: 100, ninjutsu: 8 },
                'B': { level: 5, rank: 'Chunin', exp: 350, ninjutsu: 15 },
                'A': { level: 9, rank: 'Jonin', exp: 1200, ninjutsu: 28 },
                'S': { level: 15, rank: 'Kage', exp: 3000, ninjutsu: 45 }
            };
            
            // Normalizar Academy Jutsus (por elemento/rango)
            const allRanks = ['genin', 'chunin', 'jonin', 'master'];
            
            allRanks.forEach(rankKey => {
                if (!this.academyJutsus[rankKey]) return;
                
                this.academyJutsus[rankKey].forEach(jutsu => {
                    // Eliminar campo price
                    delete jutsu.price;
                    
                    // Asegurar que tiene learnMethod
                    if (!jutsu.learnMethod) {
                        jutsu.learnMethod = 'auto';
                    }
                    
                    // Si no tiene requirements, generarlos basados en rank
                    if (!jutsu.requirements) {
                        const baseReq = rankRequirements[jutsu.rank] || rankRequirements['D'];
                        jutsu.requirements = {
                            stats: { ninjutsu: baseReq.ninjutsu },
                            exp: baseReq.exp,
                            level: baseReq.level,
                            rank: baseReq.rank,
                            element: jutsu.element
                        };
                    }
                });
            });

            // Normalizar Taijutsu Jutsus
            if (this.taijutsuAcademy && Array.isArray(this.taijutsuAcademy)) {
                this.taijutsuAcademy.forEach(jutsu => {
                    // Eliminar campo price
                    delete jutsu.price;
                    
                    // Asegurar que tiene learnMethod
                    if (!jutsu.learnMethod) {
                        jutsu.learnMethod = 'auto';
                    }
                    
                    // Los jutsus de taijutsu ya vienen con requirements configurados
                    // pero podemos validar que sean correctos
                    if (!jutsu.requirements) {
                        const baseReq = rankRequirements[jutsu.rank] || rankRequirements['D'];
                        jutsu.requirements = {
                            stats: { taijutsu: baseReq.ninjutsu }, // Notar: usan taijutsu, no ninjutsu
                            exp: baseReq.exp,
                            level: baseReq.level,
                            rank: baseReq.rank,
                            element: null
                        };
                    }
                });
            }

            // Normalizar Genjutsu Jutsus
            if (this.genjutsuAcademy && Array.isArray(this.genjutsuAcademy)) {
                this.genjutsuAcademy.forEach(jutsu => {
                    // Eliminar campo price
                    delete jutsu.price;
                    
                    // Asegurar que tiene learnMethod
                    if (!jutsu.learnMethod) {
                        jutsu.learnMethod = 'auto';
                    }
                    
                    // Los jutsus de genjutsu ya vienen con requirements configurados
                    if (!jutsu.requirements) {
                        const baseReq = rankRequirements[jutsu.rank] || rankRequirements['D'];
                        jutsu.requirements = {
                            stats: { genjutsu: baseReq.ninjutsu }, // Notar: usan genjutsu, no ninjutsu
                            exp: baseReq.exp,
                            level: baseReq.level,
                            rank: baseReq.rank,
                            element: null
                        };
                    }
                });
            }

            // Normalizar Escape Jutsus
            if (this.escapeAcademy && Array.isArray(this.escapeAcademy)) {
                this.escapeAcademy.forEach(jutsu => {
                    // Eliminar campo price
                    delete jutsu.price;
                    
                    // Asegurar que tiene learnMethod
                    if (!jutsu.learnMethod) {
                        jutsu.learnMethod = 'auto';
                    }
                    
                    // Los jutsus de escape ya vienen con requirements configurados
                    if (!jutsu.requirements) {
                        const baseReq = rankRequirements[jutsu.rank] || rankRequirements['D'];
                        jutsu.requirements = {
                            stats: { ninjutsu: baseReq.ninjutsu },
                            exp: baseReq.exp,
                            level: baseReq.level,
                            rank: baseReq.rank,
                            element: null
                        };
                    }
                });
            }

            // Normalizar Katon Jutsus (Elemento Fuego)
            if (this.katonAcademy && Array.isArray(this.katonAcademy)) {
                this.katonAcademy.forEach(jutsu => {
                    // Eliminar campo price
                    delete jutsu.price;
                    
                    // Asegurar que tiene learnMethod
                    if (!jutsu.learnMethod) {
                        jutsu.learnMethod = 'auto';
                    }
                    
                    // Todos los katon jutsus requieren element: 'fire'
                    if (!jutsu.requirements) {
                        const baseReq = rankRequirements[jutsu.rank] || rankRequirements['D'];
                        jutsu.requirements = {
                            stats: { ninjutsu: baseReq.ninjutsu },
                            exp: baseReq.exp,
                            level: baseReq.level,
                            rank: baseReq.rank,
                            element: 'fire'
                        };
                    }
                });
            }

            // Normalizar Suiton Jutsus (Elemento Agua)
            if (this.suitonAcademy && Array.isArray(this.suitonAcademy)) {
                this.suitonAcademy.forEach(jutsu => {
                    // Eliminar campo price
                    delete jutsu.price;
                    
                    // Asegurar que tiene learnMethod
                    if (!jutsu.learnMethod) {
                        jutsu.learnMethod = 'auto';
                    }
                    
                    // Todos los suiton jutsus requieren element: 'water'
                    if (!jutsu.requirements) {
                        const baseReq = rankRequirements[jutsu.rank] || rankRequirements['D'];
                        jutsu.requirements = {
                            stats: { ninjutsu: baseReq.ninjutsu },
                            exp: baseReq.exp,
                            level: baseReq.level,
                            rank: baseReq.rank,
                            element: 'water'
                        };
                    }
                });
            }

            // Normalizar Futon Jutsus (Elemento Viento)
            if (this.futonAcademy && Array.isArray(this.futonAcademy)) {
                this.futonAcademy.forEach(jutsu => {
                    // Eliminar campo price
                    delete jutsu.price;
                    
                    // Asegurar que tiene learnMethod
                    if (!jutsu.learnMethod) {
                        jutsu.learnMethod = 'auto';
                    }
                    
                    // Todos los futon jutsus requieren element: 'wind'
                    if (!jutsu.requirements) {
                        const baseReq = rankRequirements[jutsu.rank] || rankRequirements['D'];
                        jutsu.requirements = {
                            stats: { ninjutsu: baseReq.ninjutsu },
                            exp: baseReq.exp,
                            level: baseReq.level,
                            rank: baseReq.rank,
                            element: 'wind'
                        };
                    }
                });
            }

            // Normalizar Doton Jutsus (Elemento Tierra)
            if (this.dotonAcademy && Array.isArray(this.dotonAcademy)) {
                this.dotonAcademy.forEach(jutsu => {
                    // Eliminar campo price
                    delete jutsu.price;
                    
                    // Asegurar que tiene learnMethod
                    if (!jutsu.learnMethod) {
                        jutsu.learnMethod = 'auto';
                    }
                    
                    // Todos los doton jutsus requieren element: 'earth'
                    if (!jutsu.requirements) {
                        const baseReq = rankRequirements[jutsu.rank] || rankRequirements['D'];
                        jutsu.requirements = {
                            stats: { ninjutsu: baseReq.ninjutsu },
                            exp: baseReq.exp,
                            level: baseReq.level,
                            rank: baseReq.rank,
                            element: 'earth'
                        };
                    }
                });
            }

            // Normalizar Raiton Jutsus (Elemento Rayo)
            if (this.raitonAcademy && Array.isArray(this.raitonAcademy)) {
                this.raitonAcademy.forEach(jutsu => {
                    // Eliminar campo price
                    delete jutsu.price;
                    
                    // Asegurar que tiene learnMethod
                    if (!jutsu.learnMethod) {
                        jutsu.learnMethod = 'auto';
                    }
                    
                    // Todos los raiton jutsus requieren element: 'lightning'
                    if (!jutsu.requirements) {
                        const baseReq = rankRequirements[jutsu.rank] || rankRequirements['D'];
                        jutsu.requirements = {
                            stats: { ninjutsu: baseReq.ninjutsu },
                            exp: baseReq.exp,
                            level: baseReq.level,
                            rank: baseReq.rank,
                            element: 'lightning'
                        };
                    }
                });
            }

            // Normalizar Sharingan Jutsus (Kekkei Genkai)
            if (this.sharinganAcademy && Array.isArray(this.sharinganAcademy)) {
                this.sharinganAcademy.forEach(jutsu => {
                    // Eliminar campo price
                    delete jutsu.price;
                    
                    // Asegurar que tiene learnMethod
                    if (!jutsu.learnMethod) {
                        jutsu.learnMethod = 'auto';
                    }
                    
                    // Los jutsus de Sharingan requieren kekkei_genkai: 'sharingan' y KG_level
                    // Ya vienen configurados, solo validamos estructura
                    if (!jutsu.requirements) {
                        const baseReq = rankRequirements[jutsu.rank] || rankRequirements['D'];
                        jutsu.requirements = {
                            stats: { genjutsu: baseReq.ninjutsu },
                            exp: baseReq.exp,
                            level: baseReq.level,
                            rank: baseReq.rank,
                            kekkei_genkai: 'sharingan',
                            KG_level: 1
                        };
                    }
                });
            }

            // Normalizar Byakugan Jutsus (Kekkei Genkai)
            if (this.byakuganAcademy && Array.isArray(this.byakuganAcademy)) {
                this.byakuganAcademy.forEach(jutsu => {
                    // Eliminar campo price
                    delete jutsu.price;
                    
                    // Asegurar que tiene learnMethod
                    if (!jutsu.learnMethod) {
                        jutsu.learnMethod = 'auto';
                    }
                    
                    // Los jutsus de Byakugan requieren kekkei_genkai: 'byakugan' y KG_level
                    // Ya vienen configurados, solo validamos estructura
                    if (!jutsu.requirements) {
                        const baseReq = rankRequirements[jutsu.rank] || rankRequirements['D'];
                        jutsu.requirements = {
                            stats: { taijutsu: baseReq.ninjutsu },
                            exp: baseReq.exp,
                            level: baseReq.level,
                            rank: baseReq.rank,
                            kekkei_genkai: 'byakugan',
                            KG_level: 1
                        };
                    }
                });
            }

            // Normalizar Rinnegan Jutsus (Kekkei Genkai - ULTRA RARO)
            if (this.rinneganAcademy && Array.isArray(this.rinneganAcademy)) {
                this.rinneganAcademy.forEach(jutsu => {
                    // Eliminar campo price
                    delete jutsu.price;
                    
                    // Asegurar que tiene learnMethod
                    if (!jutsu.learnMethod) {
                        jutsu.learnMethod = 'auto';
                    }
                    
                    // Los jutsus de Rinnegan requieren kekkei_genkai: 'rinnegan' y KG_level
                    // Ya vienen configurados, solo validamos estructura
                    if (!jutsu.requirements) {
                        const baseReq = rankRequirements[jutsu.rank] || rankRequirements['A'];
                        jutsu.requirements = {
                            stats: { ninjutsu: baseReq.ninjutsu },
                            exp: baseReq.exp,
                            level: baseReq.level,
                            rank: baseReq.rank,
                            kekkei_genkai: 'rinnegan',
                            KG_level: 1
                        };
                    }
                });
            }

            // Normalizar Bijuu Jutsus (Solo para Jinchurikis)
            if (this.bijuuAcademy && Array.isArray(this.bijuuAcademy)) {
                this.bijuuAcademy.forEach(jutsu => {
                    // Eliminar campo price
                    delete jutsu.price;
                    
                    // Asegurar que tiene learnMethod
                    if (!jutsu.learnMethod) {
                        jutsu.learnMethod = 'auto';
                    }
                    
                    // Los jutsus de Bijuu requieren kekkei_genkai: 'bijuu' y bijuu_relation (0-100)
                    // Ya vienen configurados, solo validamos estructura
                    if (!jutsu.requirements) {
                        const baseReq = rankRequirements[jutsu.rank] || rankRequirements['B'];
                        jutsu.requirements = {
                            stats: { ninjutsu: baseReq.ninjutsu },
                            exp: baseReq.exp,
                            level: baseReq.level,
                            rank: baseReq.rank,
                            kekkei_genkai: 'bijuu',
                            bijuu_relation: 10
                        };
                    }
                });
            }
        },

        checkJutsuUnlocks(player) {
            let allJutsus = [...(this.academyJutsus.genin || []), ...(this.academyJutsus.chunin || []), 
                        ...(this.academyJutsus.jonin || []), ...(this.academyJutsus.master || []),
                        ...(this.taijutsuAcademy || []), ...(this.genjutsuAcademy || []),
                        ...(this.escapeAcademy || []), ...(this.katonAcademy || []),
                        ...(this.suitonAcademy || []), ...(this.futonAcademy || []),
                        ...(this.dotonAcademy || []), ...(this.raitonAcademy || []),
                        ...(this.sharinganAcademy || []), ...(this.byakuganAcademy || []),
                        ...(this.rinneganAcademy || []), ...(this.bijuuAcademy || [])];
            if (!player.unlockedJutsus) player.unlockedJutsus = [];
            
            allJutsus.forEach(jutsu => {
                const alreadyLearned = player.learnedJutsus.some(j => j.name === jutsu.name);
                const alreadyUnlocked = player.unlockedJutsus.some(j => j.name === jutsu.name);
                if (alreadyLearned || alreadyUnlocked) return;
                
                if (this.meetsJutsuRequirements(player, jutsu.requirements)) {
                    // Solo desbloquea el jutsu, no lo aprende automáticamente
                    player.unlockedJutsus.push(jutsu);
                }
            });
        },

        meetsJutsuRequirements(player, req) {
            if (!req) return false;

            // Verificar stats
            if (req.stats) {
                for (const [stat, value] of Object.entries(req.stats)) {
                    if (!player[stat] || player[stat] < value) return false;
                }
            }

            // Verificar EXP total acumulada
            if (req.exp && (player.totalExp || 0) < req.exp) return false;

            // Verificar nivel
            if (req.level && player.level < req.level) return false;

            // Verificar rango (insensible a mayúsculas)
            if (req.rank) {
                const rankOrder = { genin: 0, chunin: 1, jonin: 2, kage: 3, master: 4 };
                const playerRank = (player.rank || '').toLowerCase();
                const reqRank = (req.rank || '').toLowerCase();
                if (!(playerRank in rankOrder) || rankOrder[playerRank] < rankOrder[reqRank]) return false;
            }

            // Verificar elemento (insensible a mayúsculas)
            if (req.element && (player.element || '').toLowerCase() !== (req.element || '').toLowerCase()) return false;

            // Verificar Kekkei Genkai (acepta player.kekkeiGenkai o player.kekkei_genkai)
            if (req.kekkei_genkai) {
                const playerKG = player.kekkeiGenkai || player.kekkei_genkai || null;
                if (!playerKG || playerKG !== req.kekkei_genkai) return false;
            }

            // Verificar nivel de Kekkei Genkai (ej: nivel de Sharingan)
            if (req.KG_level) {
                if (!player.KG_level || player.KG_level < req.KG_level) return false;
            }

            // Verificar relación con Bijuu (solo para Jinchurikis)
            if (req.bijuu_relation !== undefined) {
                if (player.bijuu_relation === undefined || player.bijuu_relation < req.bijuu_relation) return false;
            }

            // Verificar jutsu prerequisito
            if (req.prerequisiteJutsu) {
                const hasPrereq = player.learnedJutsus.some(j => j.name === req.prerequisiteJutsu);
                if (!hasPrereq) return false;
            }

            return true;
        },

        academyJutsus: {
            // Genin (D-C)
            genin: [
                // 🔥 Fuego
                { name: 'Katon: Gōkakyū no Jutsu', rank: 'C', chakra: 35, damage: 35, element: 'fire', description: 'Gran Bola de Fuego: una llamarada icónica que arrasa el frente.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 11 }, exp: 140, level: 2, rank: 'Genin', element: 'fire' } },
                { name: 'Katon: Hōsenka no Jutsu', rank: 'C', chakra: 30, damage: 30, element: 'fire', description: 'Flores Fénix: múltiples proyectiles de fuego que persiguen al objetivo.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 10 }, exp: 130, level: 2, rank: 'Genin', element: 'fire' } },
                { name: 'Katon: Hinotama', rank: 'D', chakra: 18, damage: 18, element: 'fire', description: 'Esferas de fuego rápidas, perfectas para hostigar.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 4 }, exp: 50, level: 1, rank: 'Genin', element: 'fire' } },
                { name: 'Katon: Kasumi Enbu', rank: 'D', chakra: 20, damage: 16, element: 'fire', description: 'Danza de Niebla: humo inflamable que detona al impacto.', effect: 'burn', learnMethod: 'auto', requirements: { stats: { ninjutsu: 5 }, exp: 60, level: 1, rank: 'Genin', element: 'fire' } },
                { name: 'Katon: Enjin no Kama', rank: 'C', chakra: 32, damage: 28, element: 'fire', description: 'Guadaña Ígnea: un arco de llamas que corta y quema.', effect: 'burn', learnMethod: 'auto', requirements: { stats: { ninjutsu: 11 }, exp: 135, level: 2, rank: 'Genin', element: 'fire' } },

                // 💧 Agua
                { name: 'Suiton: Mizurappa', rank: 'C', chakra: 30, damage: 30, element: 'water', description: 'Ola Violenta: empuje de agua que golpea y desestabiliza.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 10 }, exp: 130, level: 2, rank: 'Genin', element: 'water' } },
                { name: 'Suiton: Teppōdama', rank: 'C', chakra: 28, damage: 28, element: 'water', description: 'Bala de Agua: disparo comprimido que perfora.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 11 }, exp: 135, level: 2, rank: 'Genin', element: 'water' } },
                { name: 'Suiton: Mizu no Yaiba', rank: 'D', chakra: 20, damage: 18, element: 'water', description: 'Hoja de Agua: filo líquido para cortes rápidos.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 5 }, exp: 60, level: 1, rank: 'Genin', element: 'water' } },
                { name: 'Suiton: Kirigakure no Jutsu', rank: 'C', chakra: 35, damage: 15, element: 'water', description: 'Niebla Oculta: reduce visibilidad y confunde.', effect: 'stun', learnMethod: 'auto', requirements: { stats: { ninjutsu: 12 }, exp: 150, level: 2, rank: 'Genin', element: 'water' } },
                { name: 'Suiton: Suiryūdan (Mini)', rank: 'C', chakra: 34, damage: 33, element: 'water', description: 'Mini Dragón de Agua: impacto contundente con control.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 11 }, exp: 145, level: 2, rank: 'Genin', element: 'water' } },

                // 💨 Viento
                { name: 'Fūton: Kaze no Yaiba', rank: 'D', chakra: 18, damage: 18, element: 'wind', description: 'Hoja de Viento: corte invisible a corta distancia.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 4 }, exp: 50, level: 1, rank: 'Genin', element: 'wind' } },
                { name: 'Fūton: Reppūshō', rank: 'C', chakra: 30, damage: 28, element: 'wind', description: 'Palma Huracanada: empuje que rompe postura.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 10 }, exp: 125, level: 2, rank: 'Genin', element: 'wind' } },
                { name: 'Fūton: Shinkūgyoku', rank: 'C', chakra: 34, damage: 33, element: 'wind', description: 'Esfera de Vacío: proyectiles compactos de aire.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 10 }, exp: 130, level: 2, rank: 'Genin', element: 'wind' } },
                { name: 'Fūton: Kamaitachi (Básico)', rank: 'C', chakra: 38, damage: 35, element: 'wind', description: 'Hoz de Viento: ráfaga cortante que hiere en línea.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 12 }, exp: 150, level: 2, rank: 'Genin', element: 'wind' } },
                { name: 'Fūton: Kaze Shibari', rank: 'D', chakra: 22, damage: 15, element: 'wind', description: 'Atadura de Viento: traba el movimiento con presión.', effect: 'stun', learnMethod: 'auto', requirements: { stats: { ninjutsu: 5 }, exp: 65, level: 1, rank: 'Genin', element: 'wind' } },

                // 🪨 Tierra
                { name: 'Doton: Doryūheki (Básico)', rank: 'C', chakra: 35, damage: 20, element: 'earth', description: 'Muro de Tierra: defensa rápida que bloquea el avance.', effect: 'defense', learnMethod: 'auto', requirements: { stats: { ninjutsu: 12 }, exp: 150, level: 2, rank: 'Genin', element: 'earth' } },
                { name: 'Doton: Moguragakure', rank: 'C', chakra: 30, damage: 28, element: 'earth', description: 'Escondite Subterráneo: golpe sorpresa desde abajo.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 11 }, exp: 135, level: 2, rank: 'Genin', element: 'earth' } },
                { name: 'Doton: Iwa Tsubute', rank: 'D', chakra: 18, damage: 18, element: 'earth', description: 'Piedras Lanzadas: proyectiles de roca a corta distancia.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 4 }, exp: 50, level: 1, rank: 'Genin', element: 'earth' } },
                { name: 'Doton: Tsuchi Shibari', rank: 'D', chakra: 22, damage: 15, element: 'earth', description: 'Atadura de Tierra: el suelo atrapa los pies.', effect: 'stun', learnMethod: 'auto', requirements: { stats: { ninjutsu: 5 }, exp: 60, level: 1, rank: 'Genin', element: 'earth' } },
                { name: 'Doton: Kōgan no Kama', rank: 'C', chakra: 34, damage: 33, element: 'earth', description: 'Guadaña Rocosa: filo pesado que rompe guardias.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 10 }, exp: 130, level: 2, rank: 'Genin', element: 'earth' } },

                // ⚡ Rayo
                { name: 'Raiton: Chispa', rank: 'D', chakra: 18, damage: 18, element: 'lightning', description: 'Descarga rápida para aturdir y abrir guardias.', effect: 'stun', learnMethod: 'auto', requirements: { stats: { ninjutsu: 4 }, exp: 50, level: 1, rank: 'Genin', element: 'lightning' } },
                { name: 'Raiton: Denki Tama', rank: 'C', chakra: 30, damage: 30, element: 'lightning', description: 'Esfera Eléctrica: golpe directo con zumbido paralizante.', effect: 'stun', learnMethod: 'auto', requirements: { stats: { ninjutsu: 11 }, exp: 135, level: 2, rank: 'Genin', element: 'lightning' } },
                { name: 'Raiton: Raikyū', rank: 'C', chakra: 34, damage: 33, element: 'lightning', description: 'Orbe de Rayo: daño sostenido y presión constante.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 10 }, exp: 130, level: 2, rank: 'Genin', element: 'lightning' } },
                { name: 'Raiton: Ikazuchi no Yaiba', rank: 'C', chakra: 38, damage: 35, element: 'lightning', description: 'Hoja de Trueno: filo eléctrico para cortes letales.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 12 }, exp: 150, level: 2, rank: 'Genin', element: 'lightning' } },
                { name: 'Raiton: Kōden', rank: 'D', price: 150, chakra: 22, damage: 15, element: 'lightning', description: 'Conducto: chispa que “engancha” el objetivo.', effect: 'stun' },

                // Neutrales (para todos)
                { name: 'Kawarimi no Jutsu', rank: 'D', chakra: 15, damage: 0, element: null, description: 'Sustitución para evitar un golpe crítico.', effect: 'defense', learnMethod: 'auto', requirements: { stats: { ninjutsu: 3 }, exp: 30, level: 1, rank: 'Genin', element: null } },
                { name: 'Oiroke no Jutsu (Distracción)', rank: 'D', chakra: 15, damage: 15, element: null, description: 'Distracción absurda pero efectiva para romper el ritmo.', effect: 'stun', learnMethod: 'auto', requirements: { stats: { ninjutsu: 4 }, exp: 50, level: 1, rank: 'Genin', element: null } },
                { name: 'Iryō Ninjutsu: Shōsen', rank: 'C', chakra: 35, damage: 0, element: null, description: 'Técnica médica para cerrar heridas rápidamente.', effect: 'heal', learnMethod: 'auto', requirements: { stats: { ninjutsu: 10 }, exp: 130, level: 2, rank: 'Genin', element: null } },
                { name: 'Shunshin no Jutsu', rank: 'C', chakra: 30, damage: 0, element: null, description: 'Desplazamiento instantáneo que aumenta velocidad.', effect: 'speed', learnMethod: 'auto', requirements: { stats: { ninjutsu: 10 }, exp: 125, level: 2, rank: 'Genin', element: null } },
                { name: 'Kage Bunshin no Jutsu', rank: 'C', chakra: 40, damage: 0, element: null, description: 'Clones sólidos que confunden y multiplican presión.', effect: 'clone', learnMethod: 'auto', requirements: { stats: { ninjutsu: 12 }, exp: 150, level: 2, rank: 'Genin', element: null } }
            ],

            // Chunin (B)
            chunin: [
                // 🔥
                { name: 'Katon: Ryūka no Jutsu', rank: 'B', chakra: 55, damage: 65, element: 'fire', description: 'Dragón de Fuego: un chorro concentrado que atraviesa defensas.', effect: 'burn', learnMethod: 'auto', requirements: { stats: { ninjutsu: 19 }, exp: 450, level: 5, rank: 'Chunin', element: 'fire' } },
                { name: 'Katon: Gōryūka no Jutsu', rank: 'B', chakra: 60, damage: 75, element: 'fire', description: 'Gran Dragón de Fuego: calor abrumador y daño sostenido.', effect: 'burn', learnMethod: 'auto', requirements: { stats: { ninjutsu: 20 }, exp: 500, level: 5, rank: 'Chunin', element: 'fire' } },
                { name: 'Katon: Haisekishō', rank: 'B', chakra: 50, damage: 55, element: 'fire', description: 'Ceniza Ardiente: nube que explota al inhalarla.', effect: 'stun', learnMethod: 'auto', requirements: { stats: { ninjutsu: 17 }, exp: 400, level: 5, rank: 'Chunin', element: 'fire' } },
                { name: 'Katon: Enkōdan', rank: 'B', chakra: 48, damage: 50, element: 'fire', description: 'Bala de Llama: disparo compacto, veloz y preciso.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 16 }, exp: 360, level: 5, rank: 'Chunin', element: 'fire' } },
                { name: 'Katon: Karyū Endan', rank: 'B', chakra: 70, damage: 80, element: 'fire', description: 'Llamarada Continua: un río de fuego que no da respiro.', effect: 'burn', learnMethod: 'auto', requirements: { stats: { ninjutsu: 22 }, exp: 600, level: 6, rank: 'Chunin', element: 'fire' } },
                { name: 'Katon: Shakunetsu Kekkai', rank: 'B', chakra: 65, damage: 60, element: 'fire', description: 'Barrera Abrasadora: el calor frena al enemigo y lo desgasta.', effect: 'defense', learnMethod: 'auto', requirements: { stats: { ninjutsu: 20 }, exp: 480, level: 5, rank: 'Chunin', element: 'fire' } },

                // 💧
                { name: 'Suiton: Suiryūdan no Jutsu', rank: 'B', chakra: 65, damage: 80, element: 'water', description: 'Dragón de Agua: un coloso acuático que arrasa.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 20 }, exp: 500, level: 5, rank: 'Chunin', element: 'water' } },
                { name: 'Suiton: Suijinheki', rank: 'B', chakra: 50, damage: 40, element: 'water', description: 'Muro de Agua: bloquea ataques y contraataca con presión.', effect: 'defense', learnMethod: 'auto', requirements: { stats: { ninjutsu: 17 }, exp: 400, level: 5, rank: 'Chunin', element: 'water' } },
                { name: 'Suiton: Daibakufu', rank: 'B', chakra: 70, damage: 75, element: 'water', description: 'Gran Cascada: ola masiva que barre el terreno.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 20 }, exp: 480, level: 5, rank: 'Chunin', element: 'water' } },
                { name: 'Suiton: Hōmatsu Rappa', rank: 'B', chakra: 48, damage: 55, element: 'water', description: 'Espuma Violenta: espuma densa que ralentiza y golpea.', effect: 'stun', learnMethod: 'auto', requirements: { stats: { ninjutsu: 16 }, exp: 360, level: 5, rank: 'Chunin', element: 'water' } },
                { name: 'Suiton: Mizukiri no Yaiba', rank: 'B', chakra: 55, damage: 65, element: 'water', description: 'Cuchillas de Agua: múltiples filos cortantes.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 19 }, exp: 450, level: 5, rank: 'Chunin', element: 'water' } },
                { name: 'Suiton: Suiro no Jutsu', rank: 'B', chakra: 45, damage: 42, element: 'water', description: 'Prisión de Agua (impacto): inmoviliza y castiga.', effect: 'stun', learnMethod: 'auto', requirements: { stats: { ninjutsu: 15 }, exp: 320, level: 5, rank: 'Chunin', element: 'water' } },

                // 💨
                { name: 'Fūton: Shinkūha', rank: 'B', chakra: 50, damage: 55, element: 'wind', description: 'Onda de Vacío: cuchilla larga de aire que atraviesa.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 17 }, exp: 400, level: 5, rank: 'Chunin', element: 'wind' } },
                { name: 'Fūton: Shinkū Renpa', rank: 'B', chakra: 60, damage: 70, element: 'wind', description: 'Ráfaga en Cadena: varias ondas que saturan la defensa.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 19 }, exp: 475, level: 5, rank: 'Chunin', element: 'wind' } },
                { name: 'Fūton: Kazekiri', rank: 'B', chakra: 45, damage: 45, element: 'wind', description: 'Corte de Viento: filo rápido y mortal.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 16 }, exp: 360, level: 5, rank: 'Chunin', element: 'wind' } },
                { name: 'Fūton: Daitoppa', rank: 'B', chakra: 65, damage: 80, element: 'wind', description: 'Gran Avance: tormenta frontal que arrasa formación.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 20 }, exp: 500, level: 5, rank: 'Chunin', element: 'wind' } },
                { name: 'Fūton: Kaze no Tate', rank: 'B', chakra: 50, damage: 40, element: 'wind', description: 'Escudo de Viento: desvía ataques y reduce impacto.', effect: 'defense', learnMethod: 'auto', requirements: { stats: { ninjutsu: 15 }, exp: 320, level: 5, rank: 'Chunin', element: 'wind' } },
                { name: 'Fūton: Shinkūsen', rank: 'B', chakra: 70, damage: 75, element: 'wind', description: 'Cuchilla Circular: anillo de aire que golpea alrededor.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 22 }, exp: 600, level: 6, rank: 'Chunin', element: 'wind' } },

                // 🪨
                { name: 'Doton: Doryūsō', rank: 'B', chakra: 45, damage: 50, element: 'earth', description: 'Lanza de Tierra: estaca que emerge y perfora.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 16 }, exp: 360, level: 5, rank: 'Chunin', element: 'earth' } },
                { name: 'Doton: Yomi Numa', rank: 'B', chakra: 65, damage: 60, element: 'earth', description: 'Pantano del Inframundo: hunde al enemigo y lo inmoviliza.', effect: 'stun', learnMethod: 'auto', requirements: { stats: { ninjutsu: 20 }, exp: 500, level: 5, rank: 'Chunin', element: 'earth' } },
                { name: 'Doton: Iwagakure no Jutsu', rank: 'B', chakra: 50, damage: 45, element: 'earth', description: 'Camuflaje de Roca: embiste desde cobertura sólida.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 17 }, exp: 400, level: 5, rank: 'Chunin', element: 'earth' } },
                { name: 'Doton: Ganban Kyū', rank: 'B', chakra: 55, damage: 65, element: 'earth', description: 'Ataúd de Roca: aprisiona y aplasta con fuerza.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 19 }, exp: 450, level: 5, rank: 'Chunin', element: 'earth' } },
                { name: 'Doton: Iwa Gōlem (Impacto)', rank: 'B', chakra: 70, damage: 80, element: 'earth', description: 'Gólem de Roca: golpe masivo que sacude el suelo.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 22 }, exp: 600, level: 6, rank: 'Chunin', element: 'earth' } },
                { name: 'Doton: Doryūtaiga', rank: 'B', chakra: 65, damage: 75, element: 'earth', description: 'Río de Tierra: ola de lodo que derriba formaciones.', effect: 'stun', learnMethod: 'auto', requirements: { stats: { ninjutsu: 20 }, exp: 480, level: 5, rank: 'Chunin', element: 'earth' } },

                // ⚡
                { name: 'Raiton: Raikiri (Práctica)', rank: 'B', chakra: 70, damage: 80, element: 'lightning', description: 'Corte de Rayo entrenado: velocidad y precisión.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 22 }, exp: 600, level: 6, rank: 'Chunin', element: 'lightning' } },
                { name: 'Raiton: Chidori', rank: 'B', chakra: 65, damage: 75, element: 'lightning', description: 'Chidori: estocada relámpago que atraviesa armaduras.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 21 }, exp: 550, level: 6, rank: 'Chunin', element: 'lightning' } },
                { name: 'Raiton: Gian', rank: 'B', chakra: 60, damage: 70, element: 'lightning', description: 'Falsa Oscuridad: rayo lineal de alta potencia.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 20 }, exp: 500, level: 5, rank: 'Chunin', element: 'lightning' } },
                { name: 'Raiton: Jibashi', rank: 'B', chakra: 45, damage: 45, element: 'lightning', description: 'Torre de Choque: electricidad que inmoviliza al tocar.', effect: 'stun', learnMethod: 'auto', requirements: { stats: { ninjutsu: 16 }, exp: 360, level: 5, rank: 'Chunin', element: 'lightning' } },
                { name: 'Raiton: Raijū Tsuiga', rank: 'B', chakra: 55, damage: 65, element: 'lightning', description: 'Bestia de Rayo: forma animal que muerde y paraliza.', effect: 'stun', learnMethod: 'auto', requirements: { stats: { ninjutsu: 19 }, exp: 450, level: 5, rank: 'Chunin', element: 'lightning' } },
                { name: 'Raiton: Hiraishin Pulse', rank: 'B', chakra: 68, damage: 60, element: 'lightning', description: 'Pulso Relámpago: descarga de área que corta el ritmo enemigo.', effect: 'stun', learnMethod: 'auto', requirements: { stats: { ninjutsu: 20 }, exp: 480, level: 5, rank: 'Chunin', element: 'lightning' } },

                // Neutrales B
                { name: 'Tajū Kage Bunshin', rank: 'B', chakra: 70, damage: 40, element: null, description: 'Muchos clones para abrumar al enemigo.', effect: 'clone', learnMethod: 'auto', requirements: { stats: { ninjutsu: 22 }, exp: 600, level: 6, rank: 'Chunin', element: null } },
                { name: 'Fūinjutsu: Sello de Contención', rank: 'B', chakra: 60, damage: 50, element: null, description: 'Sello que inmoviliza y debilita al objetivo.', effect: 'stun', learnMethod: 'auto', requirements: { stats: { ninjutsu: 20 }, exp: 500, level: 5, rank: 'Chunin', element: null } },
                { name: 'Kuchiyose: Invocación (Aliado)', rank: 'B', chakra: 55, damage: 60, element: null, description: 'Invoca un aliado temporal que golpea fuerte.', effect: 'summon', learnMethod: 'auto', requirements: { stats: { ninjutsu: 20 }, exp: 500, level: 5, rank: 'Chunin', element: null } }
            ],

            // Jonin (A)
            jonin: [
                // 🔥
                { name: 'Katon: Gōka Mekkyaku', rank: 'A', chakra: 90, damage: 130, element: 'fire', description: 'Extinción Majestuosa: un mar de fuego que consume el campo.', effect: 'burn', learnMethod: 'auto', requirements: { stats: { ninjutsu: 31 }, exp: 1400, level: 9, rank: 'Jonin', element: 'fire' } },
                { name: 'Katon: Gōka Messhitsu', rank: 'A', chakra: 100, damage: 150, element: 'fire', description: 'Extinción Suprema: presión térmica que rompe líneas defensivas.', effect: 'burn', learnMethod: 'auto', requirements: { stats: { ninjutsu: 33 }, exp: 1600, level: 10, rank: 'Jonin', element: 'fire' } },
                { name: 'Katon: Bakuenjin', rank: 'A', chakra: 85, damage: 110, element: 'fire', description: 'Anillo Explosivo: círculo ígneo que atrapa y castiga.', effect: 'stun', learnMethod: 'auto', requirements: { stats: { ninjutsu: 29 }, exp: 1200, level: 9, rank: 'Jonin', element: 'fire' } },

                // 💧
                { name: 'Suiton: Suikōdan', rank: 'A', chakra: 85, damage: 110, element: 'water', description: 'Tiburón de Agua: mordida giratoria que destroza.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 29 }, exp: 1200, level: 9, rank: 'Jonin', element: 'water' } },
                { name: 'Suiton: Dai Suiryūdan', rank: 'A', chakra: 95, damage: 140, element: 'water', description: 'Dragón de Agua Supremo: presión brutal, difícil de esquivar.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 32 }, exp: 1500, level: 10, rank: 'Jonin', element: 'water' } },
                { name: 'Suiton: Suijinheki Kai', rank: 'A', chakra: 80, damage: 90, element: 'water', description: 'Muro de Agua Mejorado: defensa y contraataque en un solo flujo.', effect: 'defense', learnMethod: 'auto', requirements: { stats: { ninjutsu: 28 }, exp: 1100, level: 9, rank: 'Jonin', element: 'water' } },

                // 💨
                { name: 'Fūton: Kazekiri Ranbu', rank: 'A', chakra: 90, damage: 120, element: 'wind', description: 'Danza de Cortes: combo de ráfagas que despedaza.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 31 }, exp: 1350, level: 9, rank: 'Jonin', element: 'wind' } },
                { name: 'Fūton: Shinkū Taigyoku', rank: 'A', chakra: 100, damage: 150, element: 'wind', description: 'Gran Esfera de Vacío: explosión de presión al impacto.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 33 }, exp: 1600, level: 10, rank: 'Jonin', element: 'wind' } },
                { name: 'Fūton: Kamaitachi Guren', rank: 'A', chakra: 80, damage: 100, element: 'wind', description: 'Hoz Carmesí: tajos amplios que persiguen al objetivo.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 29 }, exp: 1200, level: 9, rank: 'Jonin', element: 'wind' } },

                // 🪨
                { name: 'Doton: Ganchūrō', rank: 'A', chakra: 90, damage: 120, element: 'earth', description: 'Prisión de Roca: encierra y presiona hasta quebrar.', effect: 'stun', learnMethod: 'auto', requirements: { stats: { ninjutsu: 31 }, exp: 1350, level: 9, rank: 'Jonin', element: 'earth' } },
                { name: 'Doton: Chidōkaku', rank: 'A', chakra: 95, damage: 140, element: 'earth', description: 'Terremoto Angular: el suelo se parte bajo el enemigo.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 32 }, exp: 1500, level: 10, rank: 'Jonin', element: 'earth' } },
                { name: 'Doton: Kōka no Tate', rank: 'A', chakra: 80, damage: 90, element: 'earth', description: 'Escudo Endurecido: defensa extrema que devuelve impacto.', effect: 'defense', learnMethod: 'auto', requirements: { stats: { ninjutsu: 28 }, exp: 1100, level: 9, rank: 'Jonin', element: 'earth' } },

                // ⚡
                { name: 'Raiton: Raikiri', rank: 'A', chakra: 95, damage: 140, element: 'lightning', description: 'Raikiri: corte letal, más rápido que el sonido.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 33 }, exp: 1600, level: 10, rank: 'Jonin', element: 'lightning' } },
                { name: 'Raiton: Chidori Nagashi', rank: 'A', chakra: 90, damage: 120, element: 'lightning', description: 'Corriente Chidori: descarga alrededor del usuario.', effect: 'stun', learnMethod: 'auto', requirements: { stats: { ninjutsu: 31 }, exp: 1400, level: 9, rank: 'Jonin', element: 'lightning' } },
                { name: 'Raiton: Rairyū no Yoroi', rank: 'A', chakra: 85, damage: 90, element: 'lightning', description: 'Armadura de Rayo: mejora defensa y castiga al contacto.', effect: 'defense', learnMethod: 'auto', requirements: { stats: { ninjutsu: 29 }, exp: 1200, level: 9, rank: 'Jonin', element: 'lightning' } },

                // Neutrales A
                { name: 'Rasengan', rank: 'A', chakra: 90, damage: 130, element: null, description: 'Esfera de chakra puro: impacto devastador a corta distancia.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 35 }, exp: 1800, level: 10, rank: 'Jonin', element: null } },
                { name: 'Sensō no Kōdō (Disciplina)', rank: 'A', price: 2500, chakra: 80, damage: 90, element: null, description: 'Entra en “modo combate”: mente fría, golpes más certeros.', effect: 'speed' }
            ],

            // Master (S)
            master: [
                // 🔥
                { name: 'Katon: Amaterasu (Llama Negra)', rank: 'S', chakra: 140, damage: 170, element: 'fire', description: 'Llamas negras que no se apagan. Dolor que persiste.', effect: 'burn_permanent', learnMethod: 'auto', requirements: { stats: { ninjutsu: 43 }, exp: 3200, level: 16, rank: 'Master', element: 'fire' } },
                { name: 'Katon: Tenro no Kiba', rank: 'S', chakra: 150, damage: 180, element: 'fire', description: 'Colmillos del Horno: columnas de fuego que persiguen al objetivo.', effect: 'burn', learnMethod: 'auto', requirements: { stats: { ninjutsu: 42 }, exp: 3000, level: 16, rank: 'Master', element: 'fire' } },

                // 💧
                { name: 'Suiton: Bakusui Shōha', rank: 'S', chakra: 130, damage: 160, element: 'water', description: 'Ola Explosiva: inunda y aplasta el campo de batalla.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 42 }, exp: 3000, level: 16, rank: 'Master', element: 'water' } },
                { name: 'Suiton: Guren no Nagare', rank: 'S', chakra: 150, damage: 180, element: 'water', description: 'Corriente Carmesí: remolino que tritura y arrastra.', effect: 'stun', learnMethod: 'auto', requirements: { stats: { ninjutsu: 43 }, exp: 3200, level: 16, rank: 'Master', element: 'water' } },

                // 💨
                { name: 'Fūton: Rasenshuriken', rank: 'S', chakra: 150, damage: 180, element: 'wind', description: 'Rasen-Shuriken: millones de cortes microscópicos.', effect: 'stun', learnMethod: 'auto', requirements: { stats: { ninjutsu: 43 }, exp: 3200, level: 16, rank: 'Master', element: 'wind' } },
                { name: 'Fūton: Kaze Gokui', rank: 'S', chakra: 140, damage: 170, element: 'wind', description: 'Esencia del Viento: huracán concentrado que no deja respirar.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 42 }, exp: 3000, level: 16, rank: 'Master', element: 'wind' } },

                // 🪨
                { name: 'Doton: Dai Ganban Kyū', rank: 'S', chakra: 130, damage: 160, element: 'earth', description: 'Gran Ataúd de Roca: aplastamiento total sin escape.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 42 }, exp: 3000, level: 16, rank: 'Master', element: 'earth' } },
                { name: 'Doton: Jigoku no Saji', rank: 'S', chakra: 150, damage: 180, element: 'earth', description: 'Cuchara del Infierno: columna de roca que pulveriza el área.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 43 }, exp: 3200, level: 16, rank: 'Master', element: 'earth' } },

                // ⚡
                { name: 'Raiton: Kirin', rank: 'S', chakra: 150, damage: 180, element: 'lightning', description: 'Kirin: rayo natural guiado. Una sentencia desde el cielo.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 43 }, exp: 3200, level: 16, rank: 'Master', element: 'lightning' } },
                { name: 'Raiton: Shiden', rank: 'S', chakra: 130, damage: 160, element: 'lightning', description: 'Relámpago Púrpura: rayo controlado de alto voltaje.', learnMethod: 'auto', requirements: { stats: { ninjutsu: 42 }, exp: 3000, level: 16, rank: 'Master', element: 'lightning' } },

                // Neutrales S (ya existentes)
                { name: 'Edo Tensei', rank: 'S', chakra: 150, damage: 0, element: null, effect: 'revive', description: 'Maestro: Resurrección prohibida', learnMethod: 'auto', requirements: { stats: { ninjutsu: 50 }, exp: 5000, level: 20, rank: 'Master', element: null } },
                { name: 'Kamui', rank: 'S', chakra: 100, damage: 80, element: null, effect: 'teleport', description: 'Maestro: Espacio-tiempo', learnMethod: 'auto', requirements: { stats: { ninjutsu: 47 }, exp: 4500, level: 19, rank: 'Master', element: null } },
                { name: 'Tsukuyomi', rank: 'S', chakra: 90, damage: 0, element: null, effect: 'mega_genjutsu', description: 'Maestro: Genjutsu supremo', learnMethod: 'auto', requirements: { stats: { ninjutsu: 45 }, exp: 4000, level: 18, rank: 'Master', element: null } },
                { name: 'Shinra Tensei', rank: 'S', chakra: 120, damage: 150, element: null, description: 'Rechaza todo', learnMethod: 'auto', requirements: { stats: { ninjutsu: 40 }, exp: 2500, level: 15, rank: 'Master', element: null } }
            ]
        },

        // ========== JUTSUS DE TAIJUTSU (Artes Marciales) ==========
        taijutsuAcademy: taijutsuJutsus.taijutsu,

        // ========== JUTSUS DE GENJUTSU (Ilusiones) ==========
        genjutsuAcademy: genjutsuJutsus.genjutsu,

        // ========== JUTSUS DE ESCAPE (Técnicas de Huida) ==========
        escapeAcademy: escapeJutsus.escape,

        // ========== JUTSUS DE ELEMENTO FUEGO (Katon) ==========
        katonAcademy: katonJutsus.katon,

        // ========== JUTSUS DE ELEMENTO AGUA (Suiton) ==========
        suitonAcademy: suitonJutsus.suiton,

        // ========== JUTSUS DE ELEMENTO VIENTO (Futon) ==========
        futonAcademy: futonJutsus.futon,

        // ========== JUTSUS DE ELEMENTO TIERRA (Doton) ==========
        dotonAcademy: dotonJutsus.doton,

        // ========== JUTSUS DE ELEMENTO RAYO (Raiton) ==========
        raitonAcademy: raitonJutsus.raiton,

        // ========== JUTSUS DE KEKKEI GENKAI: SHARINGAN ==========
        sharinganAcademy: sharinganJutsus.sharingan,

        // ========== JUTSUS DE KEKKEI GENKAI: BYAKUGAN ==========
        byakuganAcademy: byakuganJutsus.byakugan,

        // ========== JUTSUS DE KEKKEI GENKAI: RINNEGAN ==========
        rinneganAcademy: rinneganJutsus.rinnegan,

        // ========== JUTSUS DE BIJUU (JINCHURIKIS) ==========
        bijuuAcademy: bijuuJutsus.bijuu,

        // ========== BESTIAS CON COLA (BIJUUS) ==========
        bijuus: {
            shukaku: {
                name: 'Shukaku',
                tails: 1,
                icon: '🦝',
                element: 'wind',
                color: '#D4A574',
                jinchuriki: 'Gaara',
                village: 'sunagakure',
                location: 'desert_temple',
                
                stats: {
                    hp: 1500,
                    chakra: 2000,
                    attack: 45,
                    defense: 40,
                    accuracy: 20
                },
                
                abilities: [
                    {
                        name: 'Tormenta de Arena',
                        chakra: 150,
                        damage: 120,
                        effect: 'blind', // Enemigo pierde 1 turno
                        description: 'Arena envuelve al enemigo'
                    },
                    {
                        name: 'Práctica de Sellos',
                        chakra: 100,
                        damage: 80,
                        effect: 'seal_jutsu',
                        description: 'Sella jutsus del enemigo'
                    },
                    {
                        name: 'Esfera Bijuu',
                        chakra: 200,
                        damage: 200,
                        effect: 'pierce',
                        description: 'Ignora defensa'
                    }
                ],
                
                dropRewards: {
                    ryo: 30000,
                    exp: 2000,
                    item: 'Arena de Shukaku', // Item legendario
                    specialUnlock: 'Jutsu: Cueva de Arena'
                },
                
                captureRequirements: {
                    level: 12,
                    hp: 300, // HP mínimo para capturar
                    specialItem: 'Sello de Sellado',
                    difficulty: 'hard'
                }
            },
            
            matatabi: {
                name: 'Matatabi',
                tails: 2,
                icon: '😺',
                element: 'fire',
                color: '#4A90E2',
                jinchuriki: 'Yugito Nii',
                village: 'kumogakure',
                location: 'mountain_shrine',
                
                stats: {
                    hp: 1800,
                    chakra: 2200,
                    attack: 50,
                    defense: 42,
                    accuracy: 22
                },
                
                abilities: [
                    {
                        name: 'Bola de Fuego Azul',
                        chakra: 160,
                        damage: 130,
                        effect: 'burn',
                        description: 'Fuego azul que quema 3 turnos'
                    },
                    {
                        name: 'Zarpazo del Gato',
                        chakra: 120,
                        damage: 100,
                        effect: 'bleed',
                        description: 'Causa sangrado continuo'
                    },
                    {
                        name: 'Esfera Bijuu',
                        chakra: 220,
                        damage: 220,
                        effect: 'pierce',
                        description: 'Esfera de chakra concentrado'
                    }
                ],
                
                dropRewards: {
                    ryo: 35000,
                    exp: 2200,
                    item: 'Llama Azul de Matatabi',
                    specialUnlock: 'Jutsu: Fuego Azul Místico'
                },
                
                captureRequirements: {
                    level: 13,
                    hp: 350,
                    specialItem: 'Sello de Sellado',
                    difficulty: 'hard'
                }
            },
            
            isobu: {
                name: 'Isobu',
                tails: 3,
                icon: '🐢',
                element: 'water',
                color: '#7FB3D5',
                jinchuriki: 'Yagura',
                village: 'kirigakure',
                location: 'underwater_cavern',
                
                stats: {
                    hp: 2200,
                    chakra: 2400,
                    attack: 48,
                    defense: 55,
                    accuracy: 18
                },
                
                abilities: [
                    {
                        name: 'Tsunami',
                        chakra: 180,
                        damage: 140,
                        effect: 'knockback',
                        description: 'Ola gigante que empuja'
                    },
                    {
                        name: 'Caparazón Giratorio',
                        chakra: 140,
                        damage: 110,
                        effect: 'defense_up',
                        description: 'Gira y aumenta defensa'
                    },
                    {
                        name: 'Esfera Bijuu',
                        chakra: 240,
                        damage: 240,
                        effect: 'pierce',
                        description: 'Esfera acuática'
                    }
                ],
                
                dropRewards: {
                    ryo: 40000,
                    exp: 2400,
                    item: 'Caparazón de Isobu',
                    specialUnlock: 'Jutsu: Armadura de Agua'
                },
                
                captureRequirements: {
                    level: 14,
                    hp: 400,
                    specialItem: 'Sello de Sellado',
                    difficulty: 'very_hard'
                }
            },
            
            son_goku: {
                name: 'Son Gokū',
                tails: 4,
                icon: '🦍',
                element: 'fire',
                color: '#E74C3C',
                jinchuriki: 'Roshi',
                village: 'iwagakure',
                location: 'volcano_peak',
                
                stats: {
                    hp: 2400,
                    chakra: 2600,
                    attack: 58,
                    defense: 50,
                    accuracy: 24
                },
                
                abilities: [
                    {
                        name: 'Lava Cortex',
                        chakra: 200,
                        damage: 160,
                        effect: 'burn_heavy',
                        description: 'Lava fundida extrema'
                    },
                    {
                        name: 'Puño de Gorila',
                        chakra: 150,
                        damage: 140,
                        effect: 'stun',
                        description: 'Golpe devastador'
                    },
                    {
                        name: 'Esfera Bijuu',
                        chakra: 260,
                        damage: 260,
                        effect: 'pierce',
                        description: 'Esfera de lava'
                    }
                ],
                
                dropRewards: {
                    ryo: 45000,
                    exp: 2600,
                    item: 'Núcleo de Lava',
                    specialUnlock: 'Jutsu: Estilo Lava'
                },
                
                captureRequirements: {
                    level: 15,
                    hp: 450,
                    specialItem: 'Sello de Sellado',
                    difficulty: 'very_hard'
                }
            },
            
            kokuo: {
                name: 'Kokuō',
                tails: 5,
                icon: '🐴',
                element: 'water',
                color: '#F8B88B',
                jinchuriki: 'Han',
                village: 'iwagakure',
                location: 'steam_springs',
                
                stats: {
                    hp: 2600,
                    chakra: 2800,
                    attack: 55,
                    defense: 48,
                    accuracy: 26
                },
                
                abilities: [
                    {
                        name: 'Estallido de Vapor',
                        chakra: 210,
                        damage: 170,
                        effect: 'speed_down',
                        description: 'Vapor hirviente'
                    },
                    {
                        name: 'Carga del Caballo',
                        chakra: 160,
                        damage: 150,
                        effect: 'ram',
                        description: 'Embestida veloz'
                    },
                    {
                        name: 'Esfera Bijuu',
                        chakra: 280,
                        damage: 280,
                        effect: 'pierce',
                        description: 'Esfera de vapor'
                    }
                ],
                
                dropRewards: {
                    ryo: 50000,
                    exp: 2800,
                    item: 'Cuerno de Kokuō',
                    specialUnlock: 'Jutsu: Boil Release'
                },
                
                captureRequirements: {
                    level: 16,
                    hp: 500,
                    specialItem: 'Sello de Sellado Reforzado',
                    difficulty: 'extreme'
                }
            },
            
            saiken: {
                name: 'Saiken',
                tails: 6,
                icon: '🐌',
                element: 'water',
                color: '#A8D08D',
                jinchuriki: 'Utakata',
                village: 'kirigakure',
                location: 'acidic_lake',
                
                stats: {
                    hp: 2800,
                    chakra: 3000,
                    attack: 52,
                    defense: 52,
                    accuracy: 23
                },
                
                abilities: [
                    {
                        name: 'Ácido Corrosivo',
                        chakra: 220,
                        damage: 180,
                        effect: 'corrode',
                        description: 'Derrite armadura y defensa'
                    },
                    {
                        name: 'Burbuja Explosiva',
                        chakra: 170,
                        damage: 160,
                        effect: 'poison',
                        description: 'Burbujas venenosas'
                    },
                    {
                        name: 'Esfera Bijuu',
                        chakra: 300,
                        damage: 300,
                        effect: 'pierce',
                        description: 'Esfera ácida'
                    }
                ],
                
                dropRewards: {
                    ryo: 55000,
                    exp: 3000,
                    item: 'Baba de Saiken',
                    specialUnlock: 'Jutsu: Técnica Ácida'
                },
                
                captureRequirements: {
                    level: 17,
                    hp: 550,
                    specialItem: 'Sello de Sellado Reforzado',
                    difficulty: 'extreme'
                }
            },
            
            chomei: {
                name: 'Chōmei',
                tails: 7,
                icon: '🦋',
                element: 'wind',
                color: '#76D7C4',
                jinchuriki: 'Fu',
                village: 'takigakure',
                location: 'waterfall_canopy',
                
                stats: {
                    hp: 3000,
                    chakra: 3200,
                    attack: 60,
                    defense: 45,
                    accuracy: 30
                },
                
                abilities: [
                    {
                        name: 'Tormenta de Escamas',
                        chakra: 230,
                        damage: 190,
                        effect: 'blind_heavy',
                        description: 'Escamas cegadoras'
                    },
                    {
                        name: 'Ráfaga de Alas',
                        chakra: 180,
                        damage: 170,
                        effect: 'speed_boost',
                        description: 'Viento cortante veloz'
                    },
                    {
                        name: 'Esfera Bijuu',
                        chakra: 320,
                        damage: 320,
                        effect: 'pierce',
                        description: 'Esfera de viento'
                    }
                ],
                
                dropRewards: {
                    ryo: 60000,
                    exp: 3200,
                    item: 'Ala de Chōmei',
                    specialUnlock: 'Jutsu: Vuelo de Insecto'
                },
                
                captureRequirements: {
                    level: 18,
                    hp: 600,
                    specialItem: 'Sello de Sellado Reforzado',
                    difficulty: 'nightmare'
                }
            },
            
            gyuki: {
                name: 'Gyūki',
                tails: 8,
                icon: '🐙',
                element: 'water',
                color: '#8B4513',
                jinchuriki: 'Killer B',
                village: 'kumogakure',
                location: 'thunder_bay',
                
                stats: {
                    hp: 3500,
                    chakra: 3500,
                    attack: 65,
                    defense: 58,
                    accuracy: 28
                },
                
                abilities: [
                    {
                        name: 'Tinta Cegadora',
                        chakra: 240,
                        damage: 200,
                        effect: 'blind_total',
                        description: 'Tinta que ciega completamente'
                    },
                    {
                        name: 'Látigo de Tentáculos',
                        chakra: 190,
                        damage: 180,
                        effect: 'multi_hit',
                        description: 'Golpea 3 veces'
                    },
                    {
                        name: 'Esfera Bijuu',
                        chakra: 350,
                        damage: 350,
                        effect: 'pierce',
                        description: 'Esfera de pulpo'
                    },
                    {
                        name: 'Estilo Rap de B',
                        chakra: 220,
                        damage: 170,
                        effect: 'confuse',
                        description: 'Rap confunde al enemigo'
                    }
                ],
                
                dropRewards: {
                    ryo: 70000,
                    exp: 3500,
                    item: 'Tentáculo de Gyūki',
                    specialUnlock: 'Jutsu: Estilo Pulpo'
                },
                
                captureRequirements: {
                    level: 19,
                    hp: 700,
                    specialItem: 'Sello Avanzado de Jinchuriki',
                    difficulty: 'nightmare'
                }
            },
            
            kurama: {
                name: 'Kurama',
                tails: 9,
                icon: '🦊',
                element: 'fire',
                color: '#FF6B35',
                jinchuriki: 'Naruto Uzumaki',
                village: 'konoha',
                location: 'sealed_cave',
                
                stats: {
                    hp: 5000,
                    chakra: 5000,
                    attack: 80,
                    defense: 65,
                    accuracy: 35
                },
                
                abilities: [
                    {
                        name: 'Esfera Bijuu Masiva',
                        chakra: 400,
                        damage: 500,
                        effect: 'devastate',
                        description: 'Destrucción absoluta'
                    },
                    {
                        name: 'Rugido del Zorro',
                        chakra: 300,
                        damage: 300,
                        effect: 'fear',
                        description: 'Aterroriza al enemigo'
                    },
                    {
                        name: 'Zarpazo de las Nueve Colas',
                        chakra: 250,
                        damage: 280,
                        effect: 'bleed_heavy',
                        description: 'Garras devastadoras'
                    },
                    {
                        name: 'Modo Kurama (Transformación)',
                        chakra: 500,
                        damage: 0,
                        effect: 'transform',
                        description: '+100 todos stats por 5 turnos'
                    },
                    {
                        name: 'Rasen-Shuriken Bijuu',
                        chakra: 450,
                        damage: 600,
                        effect: 'ultimate',
                        description: 'Ataque definitivo'
                    }
                ],
                
                dropRewards: {
                    ryo: 100000,
                    exp: 5000,
                    item: 'Chakra de Kurama',
                    specialUnlock: 'Modo Kurama (transformación permanente)'
                },
                
                captureRequirements: {
                    level: 20,
                    hp: 1000,
                    specialItem: 'Sello Maestro de Jinchuriki',
                    difficulty: 'LEGENDARY'
                }
            }
        },

        // ========== SISTEMA DE JINCHURIKIS EN ALDEAS ==========
        jinchurikis: {
            gaara: {
                name: 'Gaara',
                village: 'sunagakure',
                bijuu: 'shukaku',
                rank: 'Kazekage',
                level: 18,
                
                stats: {
                    hp: 800,
                    chakra: 1200,
                    attack: 45,
                    defense: 60,
                    accuracy: 25
                },
                
                location: 'kazekage_office',
                availability: 'always', // Siempre en su oficina
                
                abilities: [
                    'Defensa Absoluta de Arena',
                    'Féretro de Arena',
                    'Tsunami de Arena',
                    'Transformación Parcial de Shukaku'
                ],
                
                encounter: {
                    peaceful: true, // No te ataca automáticamente
                    dialogue: [
                        "Soy Gaara, el Kazekage de Sunagakure.",
                        "El poder de Shukaku ya no me controla.",
                        "¿En qué puedo ayudarte, ninja viajero?"
                    ],
                    
                    interactions: [
                        {
                            option: '💬 Hablar sobre Shukaku',
                            response: 'Es una carga pesada, pero también un gran poder.',
                            unlocks: 'lore_shukaku'
                        },
                        {
                            option: '⚔️ Desafiar a duelo',
                            response: 'Acepto. Veamos tu fuerza.',
                            triggers: 'boss_fight',
                            requirements: { level: 15, reputation: 50 }
                        },
                        {
                            option: '🎁 Ofrecer alianza',
                            response: 'Konoha y Suna siempre serán aliados.',
                            gives: 'alliance_seal'
                        },
                        {
                            option: '🔥 Intentar extraer Bijuu (RENEGADO)',
                            response: '¡No permitiré que toques a Shukaku!',
                            triggers: 'extraction_battle',
                            requirements: { isRenegade: true, level: 18 }
                        }
                    ]
                },
                
                dropIfDefeated: {
                    ryo: 10000,
                    exp: 1000,
                    item: 'Arena del Kazekage',
                    reputation: -100 // en Suna
                }
            },
            
            yugito: {
                name: 'Yugito Nii',
                village: 'kumogakure',
                bijuu: 'matatabi',
                rank: 'Jonin',
                level: 16,
                
                stats: {
                    hp: 700,
                    chakra: 1000,
                    attack: 50,
                    defense: 45,
                    accuracy: 28
                },
                
                location: 'kumo_barracks',
                availability: 'random', // 50% de estar allí
                
                abilities: [
                    'Llama Azul del Gato',
                    'Transformación de Matatabi',
                    'Zarpazo Místico'
                ],
                
                encounter: {
                    peaceful: true,
                    dialogue: [
                        "Soy Yugito, portadora de las Dos Colas.",
                        "Matatabi y yo somos uno."
                    ],
                    
                    interactions: [
                        {
                            option: '💬 Preguntar sobre Matatabi',
                            response: 'Es como tener un espíritu felino dentro.',
                            unlocks: 'lore_matatabi'
                        },
                        {
                            option: '⚔️ Solicitar entrenamiento',
                            response: 'Te enseñaré el estilo de las llamas azules.',
                            gives: 'training_blue_flames',
                            cost: 5000
                        },
                        {
                            option: '🔥 Atacar para extraer Bijuu',
                            response: '¡Error fatal!',
                            triggers: 'extraction_battle'
                        }
                    ]
                }
            },
            
            yagura: {
                name: 'Yagura',
                village: 'kirigakure',
                bijuu: 'isobu',
                rank: 'Ex-Mizukage (Controlado)',
                level: 17,
                
                stats: {
                    hp: 900,
                    chakra: 1100,
                    attack: 48,
                    defense: 65,
                    accuracy: 22
                },
                
                location: 'mist_ruins',
                availability: 'rare', // Difícil de encontrar
                
                note: 'Está bajo control de Obito - será hostil',
                
                encounter: {
                    peaceful: false, // SIEMPRE ataca
                    autoAttack: true,
                    dialogue: [
                        "......", // Está siendo controlado
                        "*Ojos rojos de Sharingan brillan*"
                    ],
                    
                    specialMechanic: 'genjutsu_control',
                    mustBreakControl: true // Debes romper el genjutsu primero
                }
            },
            
            roshi: {
                name: 'Rōshi',
                village: 'iwagakure',
                bijuu: 'son_goku',
                rank: 'Jinchuriki Errante',
                level: 17,
                
                stats: {
                    hp: 850,
                    chakra: 1150,
                    attack: 58,
                    defense: 50,
                    accuracy: 24
                },
                
                location: 'volcano_wanderer', // Se mueve
                availability: 'event', // Aparece en eventos
                
                note: 'Abandonó Iwa, viaja el mundo',
                
                encounter: {
                    peaceful: true,
                    dialogue: [
                        "Dejé mi aldea hace años.",
                        "Son Gokū y yo buscamos iluminación."
                    ],
                    
                    interactions: [
                        {
                            option: '💬 Preguntar por qué dejó Iwa',
                            response: 'No era libre allí. Ahora lo soy.',
                            unlocks: 'lore_roshi'
                        },
                        {
                            option: '🔥 Entrenar Estilo Lava',
                            response: 'Te enseñaré los secretos de la lava.',
                            gives: 'lava_release_training',
                            cost: 10000
                        },
                        {
                            option: '⚔️ Batalla amistosa',
                            response: 'Veamos tu espíritu de lucha.',
                            triggers: 'friendly_spar'
                        }
                    ]
                }
            },
            
            han: {
                name: 'Han',
                village: 'iwagakure',
                bijuu: 'kokuo',
                rank: 'Jonin',
                level: 16,
                
                stats: {
                    hp: 800,
                    chakra: 1050,
                    attack: 55,
                    defense: 48,
                    accuracy: 26
                },
                
                location: 'iwa_steam_plant',
                availability: 'always',
                
                encounter: {
                    peaceful: true,
                    dialogue: [
                        "Soy Han, el Jinchuriki de las Cinco Colas.",
                        "Mi armadura de vapor es impenetrable."
                    ],
                    
                    interactions: [
                        {
                            option: '💬 Hablar de Kokuō',
                            response: 'Es poderoso y sabio.',
                            unlocks: 'lore_kokuo'
                        },
                        {
                            option: '⚔️ Probar armadura de vapor',
                            response: 'Adelante, intenta atravesarla.',
                            triggers: 'defense_test_battle',
                            reward: 'boil_release_scroll'
                        }
                    ]
                }
            },
            
            utakata: {
                name: 'Utakata',
                village: 'kirigakure',
                bijuu: 'saiken',
                rank: 'Desertor',
                level: 16,
                
                stats: {
                    hp: 750,
                    chakra: 1100,
                    attack: 52,
                    defense: 52,
                    accuracy: 23
                },
                
                location: 'hidden_grove', // Escondido
                availability: 'rare',
                
                note: 'Desertó de Kiri, se esconde',
                
                encounter: {
                    peaceful: true,
                    cautious: true, // Desconfía
                    dialogue: [
                        "¿Quién eres? ¿Kirigakure te envió?",
                        "No volveré a esa aldea."
                    ],
                    
                    interactions: [
                        {
                            option: '💬 Asegurar que no eres enemigo',
                            response: 'Está bien... pero mantén distancia.',
                            unlocks: 'friendship_utakata'
                        },
                        {
                            option: '🎁 Ofrecer ayuda',
                            response: 'Gracias... necesito suministros.',
                            gives: 'quest_help_utakata',
                            reward: 'acid_jutsu_training'
                        },
                        {
                            option: '⚔️ Capturar para Kiri',
                            response: '¡Sabía que no podía confiar!',
                            triggers: 'desperate_battle'
                        }
                    ]
                }
            },
            
            fu: {
                name: 'Fū',
                village: 'takigakure',
                bijuu: 'chomei',
                rank: 'Genin',
                level: 14,
                
                stats: {
                    hp: 650,
                    chakra: 950,
                    attack: 45,
                    defense: 40,
                    accuracy: 30
                },
                
                location: 'taki_village_square',
                availability: 'always',
                
                personality: 'cheerful', // Muy amigable
                
                encounter: {
                    peaceful: true,
                    friendly: true,
                    dialogue: [
                        "¡Hola! ¡Soy Fū!",
                        "¡Chōmei y yo somos mejores amigas!",
                        "¿Quieres ser mi amigo?"
                    ],
                    
                    interactions: [
                        {
                            option: '💬 Ser su amigo',
                            response: '¡Genial! ¡Seremos grandes amigos!',
                            unlocks: 'friendship_fu',
                            gives: 'fu_companion_unlock'
                        },
                        {
                            option: '⚔️ Entrenar juntos',
                            response: '¡Sí! ¡Te enseñaré a volar!',
                            gives: 'wind_flight_training',
                            cost: 3000
                        },
                        {
                            option: '🎁 Dar regalo',
                            response: '¡Para mí! ¡Gracias!',
                            increases: 'friendship_level',
                            accepts: ['flowers', 'food', 'accessories']
                        },
                        {
                            option: '🔥 Atacar (RENEGADO)',
                            response: '¿Por... por qué? Pensé que éramos amigos...',
                            triggers: 'betrayal_battle',
                            consequence: 'karma_-50'
                        }
                    ]
                }
            },
            
            killer_b: {
                name: 'Killer B',
                village: 'kumogakure',
                bijuu: 'gyuki',
                rank: 'Jonin / Rapper',
                level: 19,
                
                stats: {
                    hp: 1000,
                    chakra: 1300,
                    attack: 65,
                    defense: 58,
                    accuracy: 28
                },
                
                location: 'kumo_training_island',
                availability: 'always',
                
                personality: 'rapper', // Habla en rap
                
                encounter: {
                    peaceful: true,
                    speaks_in_rhymes: true,
                    dialogue: [
                        "Yo, soy el Killer B, ¡el mejor MC!",
                        "Con Gyūki a mi lado, nadie puede vencerme, ¡yeah!",
                        "¿Quieres rapear conmigo o pelear? ¡Tú decides, baby!"
                    ],
                    
                    interactions: [
                        {
                            option: '🎤 Batalla de Rap',
                            response: '¡Yeeeah! ¡Vamos a rapear!',
                            triggers: 'rap_battle_minigame',
                            reward: 'killer_b_respect',
                            unlocks: 'rap_jutsu'
                        },
                        {
                            option: '⚔️ Combate amistoso',
                            response: 'Okaaay, te mostraré mi poder, ¡yeah!',
                            triggers: 'friendly_battle',
                            reward: 'lightning_blade_training'
                        },
                        {
                            option: '💬 Aprender control de Bijuu',
                            response: 'La amistad es la clave, bro!',
                            gives: 'perfect_jinchuriki_training',
                            cost: 15000,
                            requirements: { hasJinchuriki: true }
                        },
                        {
                            option: '🔥 Intentar capturar Gyūki',
                            response: '¡Bakayaro! ¡Konoyaro! ¡Te aplastaré!',
                            triggers: 'killer_b_serious_mode',
                            difficulty: 'extreme'
                        }
                    ]
                }
            },
            
            naruto: {
                name: 'Naruto Uzumaki',
                village: 'konoha',
                bijuu: 'kurama',
                rank: 'Hokage',
                level: 20,
                
                stats: {
                    hp: 1500,
                    chakra: 2000,
                    attack: 80,
                    defense: 65,
                    accuracy: 35
                },
                
                location: 'hokage_office',
                availability: 'always',
                
                isMC: true, // Personaje principal del canon
                
                encounter: {
                    peaceful: true,
                    inspirational: true,
                    dialogue: [
                        "¡Dattebayo! Soy Naruto Uzumaki, el Séptimo Hokage!",
                        "Kurama y yo somos compañeros, ¡no solo Jinchuriki y Bijuu!",
                        "¡Nunca te rindas! ¡Ese es mi camino ninja!"
                    ],
                    
                    interactions: [
                        {
                            option: '💬 Hablar sobre el camino ninja',
                            response: '¡Nunca te rindas! ¡Protege a tus nakama!',
                            unlocks: 'naruto_philosophy',
                            gives: 'willpower_boost'
                        },
                        {
                            option: '⚔️ Pedir entrenamiento',
                            response: '¡Claro! ¡Te enseñaré el Rasengan!',
                            gives: 'rasengan_training',
                            cost: 20000,
                            unlocks: 'rasengan_jutsu'
                        },
                        {
                            option: '🦊 Preguntar sobre Kurama',
                            response: 'Fue difícil al principio, pero ahora somos amigos.',
                            unlocks: 'kurama_lore',
                            gives: 'friendship_seal_technique'
                        },
                        {
                            option: '🎁 Ofrecer Ramen',
                            response: '¡¡¡RAMEN!!! ¡¡¡MI FAVORITO!!!',
                            increases: 'friendship_massively',
                            gives: 'naruto_best_friend_status'
                        },
                        {
                            option: '⚔️ Desafío del Hokage',
                            response: 'Acepto. Te mostraré el poder de un Hokage.',
                            triggers: 'hokage_challenge',
                            requirements: { level: 20, reputation: 100 },
                            reward: 'hokage_blessing'
                        },
                        {
                            option: '🔥 Atacar (RENEGADO EXTREMO)',
                            response: '¿Por qué haces esto? ¡No te dejaré!',
                            triggers: 'naruto_full_power',
                            difficulty: 'IMPOSSIBLE',
                            consequence: 'all_villages_hunt_you'
                        }
                    ]
                },
                
                specialEvents: [
                    {
                        name: 'Cumpleaños de Naruto',
                        date: { day: 10, month: 10 },
                        effect: 'village_celebration',
                        reward: 'special_ramen_ticket'
                    },
                    {
                        name: 'Aniversario Hokage',
                        triggers: 'ceremony',
                        reward: 'hokage_scroll'
                    }
                ]
            }
        },

        // ========== SISTEMA DE EXTRACCIÓN DE BIJUU ==========
        bijuuExtraction: {
            
            requirements: {
                general: {
                    isRenegade: true,
                    level: 15,
                    specialItem: 'Estatua Gedo',
                    organization: 'akatsuki' // O ser independiente muy fuerte
                },
                
                perBijuu: {
                    shukaku: { level: 15, membersNeeded: 2 },
                    matatabi: { level: 16, membersNeeded: 2 },
                    isobu: { level: 16, membersNeeded: 3 },
                    son_goku: { level: 17, membersNeeded: 3 },
                    kokuo: { level: 17, membersNeeded: 3 },
                    saiken: { level: 18, membersNeeded: 4 },
                    chomei: { level: 18, membersNeeded: 4 },
                    gyuki: { level: 19, membersNeeded: 5 },
                    kurama: { level: 20, membersNeeded: 7 } // El más difícil
                }
            },
            
            process: {
                phase1: {
                    name: 'Localizar Jinchuriki',
                    description: 'Usa inteligencia para encontrar al portador',
                    mechanics: 'investigation_quest',
                    cost: 5000 // Ryo para información
                },
                
                phase2: {
                    name: 'Capturar Jinchuriki',
                    description: 'Derrota al Jinchuriki en combate',
                    mechanics: 'boss_battle',
                    difficulty: 'extreme',
                    mustCapture: true // No matar, capturar vivo
                },
                
                phase3: {
                    name: 'Ritual de Extracción',
                    description: 'Extrae el Bijuu del Jinchuriki',
                    mechanics: 'timed_ritual',
                    duration: '3 días de juego',
                    vulnerable: true, // Pueden interrumpirte
                    
                    interruptions: [
                        {
                            event: 'Rescate de la Aldea',
                            chance: 70,
                            enemies: 'rescue_squad'
                        },
                        {
                            event: 'Ataque de Hunter-Nin',
                            chance: 50,
                            enemies: 'anbu_squad'
                        },
                        {
                            event: 'Intervención de otro Jinchuriki',
                            chance: 30,
                            enemies: 'friendly_jinchuriki'
                        }
                    ]
                },
                
                phase4: {
                    name: 'Sellado en Estatua',
                    description: 'Sella el Bijuu en la Estatua Gedo',
                    mechanics: 'sealing_minigame',
                    membersRequired: true, // Necesitas equipo Akatsuki
                    
                    onSuccess: {
                        bijuuSealed: true,
                        jinchurikiDies: true, // El Jinchuriki muere
                        allVillagesAlerted: true,
                        bountyIncreases: 50000,
                        karmaLoss: -50,
                        organizationRankUp: true
                    },
                    
                    onFailure: {
                        bijuuEscapes: true,
                        jinchurikiRevives: true,
                        teamInjured: true,
                        mustRetry: true
                    }
                }
            },
            
            consequences: {
                immediate: [
                    'Jinchuriki muere (evento trágico)',
                    'Aldea del Jinchuriki te declara enemigo #1',
                    'Todas las aldeas te cazan',
                    'Nivel de búsqueda = 5 estrellas',
                    'ANBU atacan cada día'
                ],
                
                longTerm: [
                    'Desbloqueas poder del Bijuu',
                    'Puedes usar chakra del Bijuu',
                    'Organización te valora más',
                    'Misiones más peligrosas disponibles',
                    'Eventos de "caza al renegado" aumentan'
                ]
            }
        },

        // ========== SISTEMA PARA CONVERTIRSE EN JINCHURIKI ==========
        becomeJinchuriki: {
            
            methods: [
                {
                    method: 'Captura y Sellado Personal',
                    description: 'Captura un Bijuu salvaje y séllalo en ti',
                    
                    requirements: {
                        level: 18,
                        hasItem: 'Pergamino de Sellado Maestro',
                        maxHp: 800,
                        maxChakra: 1000,
                        knownJutsus: 15,
                        specificJutsu: 'Técnica de Sellado de 4 Símbolos'
                    },
                    
                    process: [
                        '1. Localizar Bijuu salvaje',
                        '2. Derrotar al Bijuu en combate (HP < 20%)',
                        '3. Ritual de sellado (3 horas de juego)',
                        '4. Sobrevivir la fusión (prueba de voluntad)'
                    ],
                    
                    risks: [
                        '60% de morir durante el sellado',
                        'Bijuu puede rebelarse',
                        'Chakra inestable por 7 días',
                        'Puede volverse loco si falla'
                    ],
                    
                    onSuccess: {
                        becomesJinchuriki: true,
                        bijuuHostile: true, // Al principio te odia
                        newAbilities: 'bijuu_cloak_level_1',
                        statBoosts: {
                            maxHp: '+500',
                            maxChakra: '+800',
                            attack: '+20',
                            defense: '+15'
                        }
                    }
                },
                
                {
                    method: 'Extracción de Akatsuki (Renegado)',
                    description: 'Akatsuki extrae un Bijuu y te lo sella',
                    
                    requirements: {
                        isRenegade: true,
                        organization: 'akatsuki',
                        organizationRank: 3,
                        contribution: 100000 // Puntos de contribución
                    },
                    
                    process: [
                        '1. Solicitar Bijuu a líder',
                        '2. Completar misión de captura',
                        '3. Ritual de Akatsuki',
                        '4. Sellado con Estatua Gedo'
                    ],
                    
                    benefit: 'Menos riesgoso, 80% de éxito'
                },
                
                {
                    method: 'Robo de Jinchuriki',
                    description: 'Mata a un Jinchuriki y extrae su Bijuu',
                    
                    requirements: {
                        level: 20,
                        hasItem: 'Sello de Transferencia',
                        kinjutsu: 'Técnica de Extracción'
                    },
                    
                    process: [
                        '1. Derrotar Jinchuriki',
                        '2. Extraer Bijuu (mata al Jinchuriki)',
                        '3. Sellado inmediato en ti',
                        '4. Luchar contra perseguidores'
                    ],
                    
                    consequences: [
                        'Jinchuriki objetivo muere',
                        'Aldea te persigue eternamente',
                        'Karma: -100',
                        'Todos los Jinchurikis te odian',
                        'Evento único: "Venganza de los Jinchuriki"'
                    ]
                }
            ],
            
            // Relación con tu Bijuu
            bijuuRelationship: {
                states: [
                    {
                        level: 'Hostile',
                        range: '0-20',
                        description: 'El Bijuu te odia y se resiste',
                        effects: {
                            chakraLeaks: true,
                            randomRampage: 10, // % de chance por día
                            canUse: ['bijuu_cloak_0']
                        }
                    },
                    {
                        level: 'Wary',
                        range: '21-40',
                        description: 'El Bijuu tolera tu presencia',
                        effects: {
                            chakraStable: true,
                            randomRampage: 3,
                            canUse: ['bijuu_cloak_1', 'partial_transformation']
                        }
                    },
                    {
                        level: 'Neutral',
                        range: '41-60',
                        description: 'Coexisten sin conflicto',
                        effects: {
                            noRampage: true,
                            canUse: ['bijuu_cloak_2', 'bijuu_arms']
                        }
                    },
                    {
                        level: 'Friendly',
                        range: '61-80',
                        description: 'Comienzan a cooperar',
                        effects: {
                            chakraBoost: 20,
                            canUse: ['bijuu_mode', 'shared_vision']
                        }
                    },
                    {
                        level: 'Partners',
                        range: '81-100',
                        description: 'Perfecta armonía, como Naruto y Kurama',
                        effects: {
                            fullPower: true,
                            canUse: ['bijuu_mode_perfect', 'bijuu_sage_mode', 'bijuu_rasengan'],
                            specialAbility: 'bijuu_ultimate_form'
                        }
                    }
                ],
                
                improveRelationship: [
                    'Hablar con el Bijuu (meditar)',
                    'Usar su poder responsablemente',
                    'No abusar de su chakra',
                    'Alimentar al Bijuu (consumir chakra ajeno)',
                    'Completar misiones del Bijuu',
                    'Tiempo juntos (pasa automáticamente)'
                ]
            }
        },

        shopItems: {
            consumables: [
                { name: '🍜 Ramen Ichiraku', price: 50, effect: { hp: 30 }, description: 'Recupera 30 HP' },
                { name: '🍙 Bento', price: 80, effect: { hp: 50 }, description: 'Recupera 50 HP' },
                { name: '🍡 Dango', price: 40, effect: { hp: 20, chakra: 10 }, description: 'Recupera 20 HP y 10 Chakra' },
                { name: '🍵 Té Medicinal', price: 60, effect: { hp: 25, fatigue: -5 }, description: 'Recupera 25 HP y reduce fatiga' },
                { name: '💊 Píldora de Chakra', price: 100, effect: { chakra: 50 }, description: 'Recupera 50 Chakra' },
                { name: '💊 Píldora de Chakra MAX', price: 200, effect: { chakra: 100 }, description: 'Recupera 100 Chakra' },
                { name: '💊 Píldora Militar', price: 150, effect: { hp: 80, chakra: 30 }, description: 'Recupera HP y Chakra' },
                { name: '💊 Píldora 3 Colores', price: 300, effect: { buff: true }, description: '+5 stats por 3 turnos' },
                { name: '🩹 Kit Médico', price: 250, effect: { hp: 100 }, description: 'Recupera 100 HP' },
                { name: '🧪 Elixir de Vitalidad', price: 400, effect: { hp: 150, chakra: 75 }, description: 'Recupera 150 HP y 75 Chakra' },
                { name: '💉 Antídoto Universal', price: 120, effect: { curePoison: true }, description: 'Cura cualquier veneno' },
                { name: '🌿 Hierba Revitalizante', price: 180, effect: { fatigue: -20 }, description: 'Reduce 20 de fatiga' }
            ],
            weapons: [
                { name: '🗡️ Kunai Básico', price: 100, effect: { taijutsu: 2 }, description: '+2 Taijutsu' },
                { name: '🗡️ Kunai Explosivo', price: 250, effect: { taijutsu: 4 }, description: '+4 Taijutsu' },
                { name: '🗡️ Shuriken de Acero', price: 180, effect: { taijutsu: 3, accuracy: 1 }, description: '+3 Taijutsu, +1 Precisión' },
                { name: '⚔️ Espada Ninja', price: 500, effect: { taijutsu: 6 }, description: '+6 Taijutsu' },
                { name: '⚔️ Tantō ANBU', price: 750, effect: { taijutsu: 8, speed: 2 }, description: '+8 Taijutsu, +2 Velocidad' },
                { name: '⚔️ Katana Chakra', price: 1000, effect: { taijutsu: 8, chakraCost: -10 }, description: '+8 Tai, -10% costo chakra' },
                { name: '🔱 Kusarigama', price: 1500, effect: { taijutsu: 10, range: true }, description: '+10 Taijutsu, ataque a distancia' },
                { name: '🗡️ Espada de 7 Púas', price: 2000, effect: { taijutsu: 12, bleed: true }, description: '+12 Tai, causa sangrado' },
                { name: '🔱 Kubikiribōchō', price: 3000, effect: { taijutsu: 15, lifesteal: true }, description: '+15 Tai, drena HP' },
                { name: '⚡ Cuchillas Chakra', price: 2500, effect: { taijutsu: 11, ninjutsu: 5 }, description: '+11 Tai, +5 Ninjutsu' }
            ],
            armor: [
                { name: '🛡️ Chaleco Genin', price: 200, effect: { maxHp: 10 }, description: '+10 HP máx' },
                { name: '🛡️ Protectores de Brazo', price: 150, effect: { defense: 3 }, description: '+3% defensa' },
                { name: '🛡️ Chaleco Chunin', price: 500, effect: { maxHp: 20, defense: 5 }, description: '+20 HP, +5% defensa' },
                { name: '🛡️ Chaleco Reforzado', price: 800, effect: { maxHp: 30, defense: 8 }, description: '+30 HP, +8% defensa' },
                { name: '🛡️ Armadura ANBU', price: 1200, effect: { maxHp: 40, defense: 10 }, description: '+40 HP, +10% defensa' },
                { name: '🛡️ Armadura de Malla', price: 1600, effect: { maxHp: 50, kunaiResist: true }, description: '+50 HP, resiste proyectiles' },
                { name: '🛡️ Manto Kage', price: 2500, effect: { maxHp: 60, defense: 15, chakra: 20 }, description: '+60 HP, +15% def, +20 Chakra' },
                { name: '🛡️ Capa del Rayo', price: 3500, effect: { maxHp: 80, speed: 5, evasion: 5 }, description: '+80 HP, +5 velocidad, +5% evasión' }
            ],
            accessories: [
                { name: '💎 Anillo de Chakra', price: 400, effect: { maxChakra: 25 }, description: '+25 Chakra máx' },
                { name: '📿 Collar Protector', price: 350, effect: { maxHp: 15, resistance: 2 }, description: '+15 HP, +2% resistencia' },
                { name: '🎭 Máscara ANBU', price: 600, effect: { stealth: 10 }, description: '+10 Sigilo' },
                { name: '🔔 Cascabel de Entrenamiento', price: 250, effect: { expBonus: 5 }, description: '+5% EXP en combate' },
                { name: '📖 Pergamino de Sellado', price: 500, effect: { inventorySlots: 5 }, description: '+5 slots de inventario' },
                { name: '🎒 Bolsa Ninja Mejorada', price: 300, effect: { inventorySlots: 3 }, description: '+3 slots de inventario' },
                { name: '👁️ Lentes de Chakra', price: 800, effect: { accuracy: 5 }, description: '+5 Precisión' },
                { name: '⏱️ Sello de Velocidad', price: 700, effect: { speed: 5 }, description: '+5 Velocidad' },
                { name: '🔮 Cristal de Meditación', price: 900, effect: { chakraRegen: 5 }, description: '+5 regeneración de chakra/turno' },
                { name: '💀 Amuleto de Jashin', price: 1500, effect: { lifesteal: 5 }, description: '+5% robo de vida' }
            ],
            scrolls: [
                { name: '📜 Pergamino de Invocación: Sapos', price: 2000, effect: { summon: 'toad' }, description: 'Invoca un sapo aliado en combate' },
                { name: '📜 Pergamino de Invocación: Serpientes', price: 2000, effect: { summon: 'snake' }, description: 'Invoca una serpiente aliada' },
                { name: '📜 Pergamino de Invocación: Perros', price: 1800, effect: { summon: 'dog' }, description: 'Invoca perros ninja rastreadores' },
                { name: '📜 Pergamino de Teletransporte', price: 3000, effect: { teleport: true }, description: 'Escapa del combate al instante' },
                { name: '📜 Pergamino de Barrera', price: 1500, effect: { barrier: 50 }, description: 'Absorbe 50 daño' },
                { name: '📜 Pergamino Explosivo x10', price: 500, effect: { damage: 30, aoe: true }, description: '30 daño a todos los enemigos' },
                { name: '📜 Pergamino de Curación', price: 800, effect: { healAll: 50 }, description: 'Cura 50 HP a todo el equipo' },
                { name: '📜 Pergamino de Sellado: Arma', price: 1200, effect: { sealWeapon: true }, description: 'Sella el arma del enemigo 2 turnos' }
            ]
        },

        training: [
            { name: '💪 Entrenamiento Taijutsu', price: 400, effect: { taijutsu: 3 }, description: '+3 Taijutsu permanente' },
            { name: '🧘 Entrenamiento Ninjutsu', price: 400, effect: { ninjutsu: 3 }, description: '+3 Ninjutsu permanente' },
            { name: '🌀 Entrenamiento Genjutsu', price: 400, effect: { genjutsu: 3 }, description: '+3 Genjutsu permanente' },
            { name: '⚡ Aumentar Chakra', price: 350, effect: { maxChakra: 20 }, description: '+20 Chakra máximo' },
            { name: '❤️ Aumentar HP', price: 350, effect: { maxHp: 15 }, description: '+15 HP máximo' }
        ],

        enemies: {
            genin: [
                { name: 'Bandido', hp: 50, chakra: 20, attack: 12, defense: 6, accuracy: 5, exp: 25, ryo: 50 },
                { name: 'Ninja Renegado Genin', hp: 80, chakra: 40, attack: 15, defense: 8, accuracy: 7, exp: 30, ryo: 75 },
                { name: 'Lobo Salvaje', hp: 60, chakra: 10, attack: 14, defense: 5, accuracy: 8, exp: 28, ryo: 60 }
            ],
            chunin: [
                { name: 'Ninja de la Niebla', hp: 140, chakra: 80, attack: 20, defense: 12, accuracy: 10, exp: 50, ryo: 150 },
                { name: 'Ninja de la Arena', hp: 130, chakra: 90, attack: 22, defense: 11, accuracy: 11, exp: 55, ryo: 160 },
                { name: 'Escuadrón Enemigo (Líder)', hp: 160, chakra: 100, attack: 24, defense: 14, accuracy: 12, exp: 60, ryo: 180 },
                { name: 'Ninja de la Roca', hp: 180, chakra: 70, attack: 26, defense: 16, accuracy: 10, exp: 65, ryo: 200 }
            ],
            jonin: [
                { name: 'Jonin Élite', hp: 220, chakra: 120, attack: 28, defense: 18, accuracy: 14, exp: 80, ryo: 300 },
                { name: 'Jinchuriki Menor', hp: 260, chakra: 150, attack: 32, defense: 20, accuracy: 15, exp: 100, ryo: 400 },
                { name: 'ANBU Renegado', hp: 240, chakra: 140, attack: 30, defense: 22, accuracy: 16, exp: 90, ryo: 350 }
            ],
            akatsuki: [
                { name: 'Hidan', hp: 350, chakra: 180, attack: 38, defense: 25, accuracy: 18, exp: 150, ryo: 800 },
                { name: 'Kakuzu', hp: 400, chakra: 170, attack: 40, defense: 28, accuracy: 19, exp: 160, ryo: 850 },
                { name: 'Sasori', hp: 320, chakra: 200, attack: 36, defense: 24, accuracy: 20, exp: 155, ryo: 820 },
                { name: 'Deidara', hp: 340, chakra: 220, attack: 42, defense: 22, accuracy: 17, exp: 165, ryo: 880 },
                { name: 'Orochimaru', hp: 450, chakra: 250, attack: 45, defense: 30, accuracy: 21, exp: 200, ryo: 1000 }
            ],
            boss: [
                { name: 'Pain (Tendō)', hp: 600, chakra: 300, attack: 50, defense: 35, accuracy: 23, exp: 300, ryo: 2000 },
                { name: 'Madara Uchiha', hp: 800, chakra: 400, attack: 60, defense: 40, accuracy: 25, exp: 500, ryo: 5000 },
                { name: 'Kaguya Ōtsutsuki', hp: 1000, chakra: 500, attack: 70, defense: 45, accuracy: 28, exp: 800, ryo: 10000 },
                { name: 'Zabuza Momochi', hp: 520, chakra: 260, attack: 48, defense: 30, accuracy: 22, exp: 420, ryo: 15000 },
                { name: 'Kisame Hoshigaki', hp: 700, chakra: 420, attack: 58, defense: 38, accuracy: 24, exp: 650, ryo: 25000 }
            ]
        },

        // Enemigos especiales (persecución)
        anbuHunters: [
            { name: 'ANBU Hunter', hp: 260, chakra: 120, attack: 30, defense: 22, accuracy: 16, exp: 120, ryo: 250 },
            { name: 'ANBU Rastreador', hp: 240, chakra: 140, attack: 28, defense: 20, accuracy: 20, exp: 130, ryo: 260 },
            { name: 'ANBU Capitán', hp: 320, chakra: 160, attack: 36, defense: 26, accuracy: 18, exp: 180, ryo: 350 }
        ],

        // Kinjutsu (solo renegados)
        kinjutsu: [
            { id: 'edo_tensei', name: 'EDO TENSEI (Resurrección Impura)', rank: 'S', price: 15000, chakra: 200, damage: 0, element: null, effect: 'revive', description: 'Revive un enemigo derrotado como aliado (1 combate).' },
            { id: 'shiki_fujin', name: 'SHIKI FUJIN (Sello de Muerte)', rank: 'S', price: 10000, chakra: 150, damage: 9999, element: null, effect: 'suicide_kill', description: 'Mata instantáneamente al enemigo, pero pierdes 50% de HP.' },
            { id: 'jashin_ritual', name: 'JASHIN RITUAL (Inmortalidad)', rank: 'S', price: 12000, chakra: 100, damage: 0, element: null, effect: 'immortal_reflect', description: 'No puedes morir por 3 turnos y reflejas parte del daño.' },
            { id: 'kotoamatsukami', name: 'KOTOAMATSUKAMI (Control mental)', rank: 'S', price: 18000, chakra: 180, damage: 0, element: null, effect: 'control', description: 'Controla al enemigo por 2 turnos (pierde acciones).' },
            { id: 'izanagi', name: 'IZANAGI (Reescribir realidad)', rank: 'S', price: 20000, chakra: 250, damage: 0, element: null, effect: 'izanagi', description: 'Si mueres, revives con 100% HP (1 uso por batalla).' },
            { id: 'tanuki_neiri', name: 'TANUKI NEIRI (Robo de Kekkei Genkai)', rank: 'S', price: 50000, chakra: 300, damage: 0, element: null, effect: 'steal_kg', description: 'Copia un Kekkei Genkai tras derrotar un objetivo.' }
        ],

        // Mercado Negro (renegados)
        blackMarketItems: [
            { id: 'pill_prohibida', name: '💊 Píldora Prohibida', price: 2000, description: '+50 todos los stats por 5 turnos. Después: -30 HP', effect: { buffAll: 50, buffTurns: 5, backlashHp: 30 } },
            { id: 'hoja_maldita', name: '🗡️ Hoja Maldita de Orochimaru', price: 5000, description: '+20 Taijutsu, drena chakra al enemigo (pasivo).', effect: { taijutsu: 20 } },
            { id: 'pergamino_kinjutsu', name: '📜 Pergamino de Jutsu Prohibido', price: 8000, description: 'Desbloquea 1 Kinjutsu aleatorio.', effect: { unlockKinjutsu: true } },
            { id: 'suero_hashirama', name: '🧪 Suero de Hashirama', price: 15000, description: 'Desbloquea Mokuton temporal (3 misiones).', effect: { mokutonMissions: 3 } },
            { id: 'sharingan_artificial', name: '👁️ Sharingan Artificial (Danzō)', price: 50000, description: '+15 Genjutsu y 1 Izanagi por día.', effect: { genjutsu: 15, dailyIzanagi: true } }
        ],
        blackMarketServices: [
            { id: 'identity', name: 'Cambiar identidad', price: 1000, description: 'Te quitan del Bingo Book por 7 días.', effect: { hideDays: 7 } },
            { id: 'chakra_surgery', name: 'Cirugía de chakra', price: 5000, description: 'Cambia tu naturaleza elemental.', effect: { changeElement: true } },
            { id: 'cell_implant', name: 'Implante de células', price: 10000, description: '+30 HP/Chakra permanente.', effect: { maxHp: 30, maxChakra: 30 } },
            { id: 'wipe_village', name: 'Borrar memoria de aldea', price: 20000, description: 'Resetea reputación con tu aldea natal.', effect: { resetReputation: true } }
        ],

        // Contratos/Misiones exclusivas renegados
        renegadeContracts: {
            low: [
                { name: '🧨 Robar Suministros', rank: 'C', description: 'Asalta un depósito aislado y desaparece sin dejar rastro.', enemies: [{ type: 'genin', index: 0, count: 2 }], ryo: 300, exp: 50, turns: 2, criminal: true },
                { name: '🛞 Sabotear Caravana', rank: 'C', description: 'Rompe la ruta de comercio. La aldea pagará el precio.', enemies: [{ type: 'genin', index: 1, count: 2 }], ryo: 500, exp: 60, turns: 2, criminal: true },
                { name: '🎭 Secuestro Express', rank: 'C', description: 'Rápido, limpio, aterrador. Cobro inmediato.', enemies: [{ type: 'genin', index: 1, count: 3 }], ryo: 800, exp: 75, turns: 2, criminal: true },
                { name: '🔫 Contrabando de Armas', rank: 'C', description: 'Escolta un cargamento ilícito por rutas secundarias.', enemies: [{ type: 'genin', index: 2, count: 2 }], ryo: 600, exp: 70, turns: 2, criminal: true }
            ],
            mid: [
                { name: '🗡️ Asesinar Comerciante', rank: 'B', description: 'Un mensaje: “deja de vender a Konoha”.', enemies: [{ type: 'chunin', index: 2, count: 2 }], ryo: 2000, exp: 180, turns: 3, criminal: true },
                { name: '📜 Robar Pergamino de Aldea', rank: 'B', description: 'Infiltra y roba un pergamino sellado sin activar alarmas.', enemies: [{ type: 'chunin', index: 1, count: 3 }], ryo: 3000, exp: 220, turns: 4, criminal: true },
                { name: '🔥 Quemar Campos de Cultivo', rank: 'B', description: 'Golpe económico. Que recuerden tu nombre.', enemies: [{ type: 'chunin', index: 0, count: 3 }], ryo: 2500, exp: 200, turns: 3, criminal: true },
                { name: '🔓 Liberar Prisioneros', rank: 'B', description: 'Rompe una caravana de prisioneros y gana aliados.', enemies: [{ type: 'chunin', index: 3, count: 3 }], ryo: 3500, exp: 250, turns: 4, criminal: true },
                { name: '🌉 Destruir Puente Estratégico', rank: 'A', description: 'Un puente cae, la guerra comienza.', enemies: [{ type: 'jonin', index: 0, count: 2 }], ryo: 4000, exp: 300, turns: 4, criminal: true }
            ],
            high: [
                { name: '☠️ Asesinar Jōnin', rank: 'S', description: 'Un objetivo de alto valor. Un golpe y fin.', enemies: [{ type: 'jonin', index: 2, count: 2 }], ryo: 8000, exp: 400, turns: 5, criminal: true },
                { name: '🏺 Robar Arma Legendaria', rank: 'S', description: 'Entra, roba y sal vivo. Eso es todo.', enemies: [{ type: 'akatsuki', index: 2, count: 1 }], ryo: 12000, exp: 600, turns: 6, criminal: true },
                { name: '👑 Secuestrar Hijo de Daimyō', rank: 'S', description: 'La política se compra con miedo.', enemies: [{ type: 'jonin', index: 0, count: 3 }], ryo: 15000, exp: 800, turns: 6, criminal: true },
                { name: '🕊️ Sabotear Cumbre de Paz', rank: 'S', description: 'Que la paz se vuelva ceniza.', enemies: [{ type: 'akatsuki', index: 0, count: 2 }], ryo: 18000, exp: 1000, turns: 7, criminal: true },
                { name: '🏯 Asesinar Kage', rank: 'S', description: 'Un acto que cambia la historia.', enemies: [{ type: 'boss', index: 1, count: 1 }], ryo: 50000, exp: 2000, turns: 8, criminal: true }
            ]
        },

        organizationMissions: {
            akatsuki: [
                { name: '🌑 Capturar Jinchūriki', rank: 'S', description: 'Caza a un portador antes de que escape.', enemies: [{ type: 'boss', index: 0, count: 1 }], ryo: 10000, exp: 500, turns: 6, criminal: true },
                { name: '🩸 Asesinar Kage', rank: 'S', description: 'Un golpe imposible. Eso es lo que buscan.', enemies: [{ type: 'boss', index: 1, count: 1 }], ryo: 15000, exp: 800, turns: 7, criminal: true },
                { name: '🕵️ Infiltrar Aldea', rank: 'S', description: 'Entra como sombra, sal como leyenda.', enemies: [{ type: 'jonin', index: 2, count: 4 }], ryo: 8000, exp: 400, turns: 6, criminal: true },
                { name: '📜 Robar Pergamino Prohibido', rank: 'S', description: 'La información mata más que un kunai.', enemies: [{ type: 'akatsuki', index: 1, count: 1 }], ryo: 12000, exp: 600, turns: 6, criminal: true },
                { name: '🗡️ Eliminar Escuadrón ANBU', rank: 'S', description: 'Cazadores cazados. No dejes testigos.', enemies: [{ type: 'jonin', index: 0, count: 5 }], ryo: 9000, exp: 450, turns: 6, criminal: true }
            ],
            sound: [
                { name: '🐍 Secuestrar para Experimentos', rank: 'S', description: 'Material vivo para Orochimaru.', enemies: [{ type: 'jonin', index: 1, count: 3 }], ryo: 12000, exp: 700, turns: 6, criminal: true },
                { name: '🧪 Probar Jutsu Experimental', rank: 'S', description: 'Riesgo extremo. Sobrevive al sello.', enemies: [{ type: 'akatsuki', index: 4, count: 1 }], ryo: 18000, exp: 1200, turns: 7, criminal: true },
                { name: '🩸 Robar Cuerpos', rank: 'S', description: 'Nada personal. Solo ciencia oscura.', enemies: [{ type: 'jonin', index: 2, count: 4 }], ryo: 7000, exp: 500, turns: 6, criminal: true }
            ],
            root: [
                { name: '👁️ Eliminar objetivo sin testigos', rank: 'S', description: 'Si alguien lo vio, fallaste.', enemies: [{ type: 'jonin', index: 0, count: 4 }], ryo: 12000, exp: 900, turns: 6, criminal: true },
                { name: '🕶️ Operación Encubierta', rank: 'S', description: 'Golpea donde nadie mira.', enemies: [{ type: 'akatsuki', index: 3, count: 1 }], ryo: 16000, exp: 1000, turns: 7, criminal: true }
            ],
            bounty: [
                { name: '💰 BINGO BOOK: Zabuza Momochi', rank: 'S', description: 'Recompensa viva o muerta. Un monstruo en la niebla.', enemies: [{ type: 'boss', index: 3, count: 1 }], ryo: 15000, exp: 800, turns: 6, bounty: true },
                { name: '💰 BINGO BOOK: Kisame Hoshigaki', rank: 'S', description: 'Recompensa altísima. El tiburón humano.', enemies: [{ type: 'boss', index: 4, count: 1 }], ryo: 25000, exp: 1200, turns: 7, bounty: true }
            ]
        },

        missions: {
            genin: [
                { name: '🐾 Huellas en el Barro', rank: 'D', description: 'Un mensajero desapareció cerca del río. Sigue el rastro antes de que anochezca.', narrator: 'Un mensajero envía un informe crítico fue visto por última vez cerca del río. Los guardias de la aldea no pueden apartarse de sus puestos. Sigue las huellas en el barro antes de que llueva y borrar toda evidencia. Mientras investigas en el bosque, te rodean criaturas hostiles...', enemies: [{ type: 'genin', index: 2, count: 1 }], ryo: 60, exp: 25, turns: 1 },
                { name: '🐈 El Gato del Daimyō (Otra Vez)', rank: 'D', description: 'El famoso gato volvió a escapar. Encuéntralo sin causar un escándalo.', narrator: 'El gato mascota del Daimyō amigo de Konoha escapó nuevamente. Este animal es más problemático de lo que parece, y esta vez sus captores no te permitirán el lujo de una búsqueda silenciosa. Ya te están esperando en su escondite...', enemies: [{ type: 'genin', index: 0, count: 1 }], ryo: 50, exp: 25, turns: 1 },
                { name: '🧹 Limpieza del Canal Este', rank: 'D', description: 'Bandidos ensucian los canales de Konoha. Dale orden al barrio.', narrator: 'Los canales al este de la aldea fueron invadidos por bandidos vagabundos. Necesitamos restablecer el orden. El Hokage confía en ti para limpiar el área. Los intrusos no se irán sin luchar...', enemies: [{ type: 'genin', index: 0, count: 2 }], ryo: 90, exp: 35, turns: 1 },
                { name: '📦 Paquete Sellado', rank: 'D', description: 'Entrega un paquete con sellos a la puerta norte. No preguntes qué es.', narrator: 'Te entregan un paquete misterioso con instrucciones de sellado chakra. Tu trabajo es simplemente transportarlo a la puerta norte. Pero alguien lo quiere. Mientras avanzas, son atacados por contrabandistas...', enemies: [{ type: 'genin', index: 0, count: 1 }], ryo: 70, exp: 30, turns: 1 },
                { name: '🍃 Patrulla de los Campos', rank: 'D', description: 'Reportan sombras en los campos. Mantén la calma y protege a los granjeros.', narrator: 'Los granjeros reportan movimientos extraños en los campos de cultivo. Podría ser nada... o podría ser bestias depredadoras. Te envían a patrullar mientras los agricultores trabajan. Cuando llegas, las sombras se hacen reales...', enemies: [{ type: 'genin', index: 2, count: 2 }], ryo: 120, exp: 40, turns: 2 },
                { name: '🧭 Señal Perdida', rank: 'D', description: 'Un kunai marcador se perdió en el bosque. Recupéralo antes de que lo usen.', narrator: 'Uno de nuestros kunai de respuesta rápida fue perdido en el bosque. Si la aldea enemiga lo encuentra, sabrán nuestras tácticas. Entras al bosque profundo. Las cosas se mueven entre los árboles...', enemies: [{ type: 'genin', index: 1, count: 1 }], ryo: 140, exp: 45, turns: 2 },
                { name: '🐗 Jabalí Desbocado', rank: 'D', description: 'Un animal salvaje arrasa cultivos. Deténlo sin matar si puedes.', narrator: 'Un jabalí monstruosamente grande ha estado destruyendo los campos de arroz. Los granjeros están desesperados. Idealmente debes capturarlo vivo, pero si es necesario... defiéndete. Cuando te acercas, el animal se vuelve completamente salvaje...', enemies: [{ type: 'genin', index: 2, count: 1 }], ryo: 110, exp: 40, turns: 1 },
                { name: '🧪 Ingredientes del Hospital', rank: 'D', description: 'Recolecta hierbas raras antes de que se marchiten. El tiempo corre.', narrator: 'El hospital necesita componentes medicinales urgentemente. Las hierbas raras florecen solo en la noche, y cuando amanezca se marchitarán durante meses. Entras en el claro de cosecha. Otros también han venido por las mismas plantas...', enemies: [{ type: 'genin', index: 2, count: 2 }], ryo: 150, exp: 50, turns: 2 },
                { name: '🗺️ Mapa Mojado', rank: 'C', description: 'Un mapa de rutas secretas cayó en manos equivocadas. Recupéralo.', narrator: 'Un cartógrafo de confianza perdió un mapa detallando nuestras rutas de suministro secretas en una taberna. Si el enemigo lo lee, nuestras líneas logísticas están comprometidas. Rastreo del portador te lleva a un almacén escondido donde guerreros entrenados lo guardan...', enemies: [{ type: 'genin', index: 1, count: 2 }], ryo: 250, exp: 60, turns: 2 },
                { name: '🚶 Escolta de Comerciante', rank: 'C', description: 'Protege la caravana hasta el puesto fronterizo. Habrá emboscada.', narrator: 'Un comerciante importante se dirige al puesto fronterizo. Su ruta siempre es vigilada. Inteligencia confirma que hay una emboscada planeada. Aceptas protegerlo. Antes de llegar a mitad de camino, los atacantes revelan su posición...', enemies: [{ type: 'genin', index: 0, count: 2 }, { type: 'genin', index: 1, count: 1 }], ryo: 300, exp: 70, turns: 2 },
                { name: '🔥 Fuego en el Almacén', rank: 'C', description: 'Incendio provocado en depósitos. Caza a los culpables antes de que huyan.', narrator: 'Alguien incendió deliberadamente el almacén de suministros de la aldea. Esta es sabotaje. Te envían a rastrear a los culpables antes de que escapen a territorios enemigos. El sendero te lleva a un escondite donde los pirómanos se defienden...', enemies: [{ type: 'genin', index: 0, count: 3 }], ryo: 280, exp: 65, turns: 2 },
                { name: '🕳️ Trampas en el Camino', rank: 'C', description: 'Alguien está minando rutas de suministro. Desactiva trampas y enfrenta al saboteador.', narrator: 'Las rutas de caravana están siendo minadas con trampas de kunai. Es un patrón sistemático intentando cortar nuestras líneas logísticas. Te envían a desactivar las trampas y encontrar al saboteador. Cuando llegas al depósito de trampas, sus creadores te están esperando...', enemies: [{ type: 'genin', index: 1, count: 2 }], ryo: 320, exp: 75, turns: 2 },
                { name: '📜 Pergamino de Práctica Robado', rank: 'C', description: 'Un pergamino de la Academia fue robado. No debe caer en renegados.', narrator: 'El pergamino técnico de la Academia Ninja fue robado. Contiene secretos que podrían fortalecer significativamente a nuestros enemigos. Los rastreadores lo ubicaron en territorio hostil, custodiado por múltiples defensores entrenados...', enemies: [{ type: 'genin', index: 1, count: 3 }], ryo: 350, exp: 80, turns: 2 },
                { name: '🌙 Ronda Nocturna (Genin)', rank: 'C', description: 'Rumores de asaltos durante la noche. Resiste el miedo y protege a la aldea.', narrator: 'Ha habido ataques nocturnos coordinados contra civiles en los barrios bajos. El pánico se propaga. Te asignan una ronda nocturna para detener los asaltantes. Cuando cae la noche, las sombras cobran vida con intención criminal...', enemies: [{ type: 'genin', index: 0, count: 3 }], ryo: 380, exp: 80, turns: 2 },
                { name: '🦊 Zorro del Bosque', rank: 'C', description: 'Una bestia astuta roba provisiones. Síguela hasta su guarida.', narrator: 'Un zorro de inteligencia anormal ha estado saqueando nuestros depósitos de comida. Los aldeanos lo consideran un presagio. Sigues sus pistas profundamente en el bosque. Cuando llegas a su guarida, descubres que no está solo...', enemies: [{ type: 'genin', index: 2, count: 3 }], ryo: 400, exp: 80, turns: 2 }
            ],
            chunin: [
                { name: '🛡️ Defensa del Puente de Piedra', rank: 'B', description: 'Un escuadrón enemigo intenta cortar suministros. Mantén la línea.', narrator: 'El Puente de Piedra es la arteria principal de suministro para Konoha. Inteligencia reporta un escuadrón enemigo coordinado aproximándose para destruirlo. Te posicionan como línea de defensa. Cuando suena la alerta, ves polvo de movimiento rápido acercándose...', enemies: [{ type: 'chunin', index: 0, count: 2 }], ryo: 520, exp: 85, turns: 2 },
                { name: '🕵️ Infiltración en Depósito de Armas', rank: 'B', description: 'Entra sin ser visto y marca el depósito para un asalto posterior.', narrator: 'Un depósito de armas enemigo fue ubicado. Tu misión es infiltrarte sin alarma, marcar los objetivos con sellos de revelación, y salir. Pero la instalación está más vigilada de lo esperado. Cuando colocas el primer sello, descubren tu presencia...', enemies: [{ type: 'chunin', index: 1, count: 2 }], ryo: 650, exp: 100, turns: 3 },
                { name: '🚑 Rescate en Zona Hostil', rank: 'B', description: 'Un equipo aliado quedó atrapado. Extrae a los heridos con vida.', narrator: 'Un escuadrón de reconocimiento nunca regresó. Localizamos su última posición en territorio fuertemente controlado. Tus órdenes son simple: entra, saca a los supervivientes, y sal. Pero cuando llegas, fuerzas enemigas ya convirtieron el lugar en un fortín...', enemies: [{ type: 'chunin', index: 3, count: 2 }], ryo: 700, exp: 110, turns: 3 },
                { name: '🐺 Bestia de Colmillos Negros', rank: 'B', description: 'Un depredador anormal acecha caravanas. Cázalo antes de que migre.', narrator: 'Una criatura anormal ha estado cazando nuestras caravanas comerciales. Los supervivientes hablan de garras negras como la medianoche y una inteligencia casi humana. Los rastreadores localizaron su guarida. Cuando entras, los ojos depredadores te esperan en la oscuridad...', enemies: [{ type: 'chunin', index: 3, count: 1 }], ryo: 560, exp: 90, turns: 2 },
                { name: '📡 Interceptar Mensaje Cifrado', rank: 'B', description: 'Un mensaje enemigo viaja por corredores secretos. Rómpelos y captura al mensajero.', narrator: 'Nuestros criptoanalistas interceptaron comunicaciones enemiga. Un mensajero crítico viaja noche esta llevando información que podría cambiar la guerra. Te colocan en una intersección forzada del camino. Cuando aparece el mensajero, trae protección entrenada...', enemies: [{ type: 'chunin', index: 2, count: 2 }], ryo: 780, exp: 120, turns: 3 },
                { name: '🏘️ Aldea Aliada Bajo Asedio', rank: 'B', description: 'Refuerza una aldea vecina. Si caen, la frontera queda abierta.', narrator: 'Una aldea aliada es arrinconada por un ataque coordinado. Su milicia está diezmada. Mand as refuerzos, pero necesitas romper la encerclante enemiga para permitir que lleguen. Llegarás antes, solo con refuerzos pequeños. Cuando irrumpes en la línea de asedio, ambos lados convergen...', enemies: [{ type: 'chunin', index: 0, count: 1 }, { type: 'chunin', index: 1, count: 2 }], ryo: 900, exp: 135, turns: 4 },
                { name: '🧨 Desactivar Trampas de Papel Explosivo', rank: 'B', description: 'Un corredor está minado con sellos explosivos. Avanza con precisión.', narrator: 'La Ruta de las Sombras entre nuestro territorio y un aliado fue minada con sellos explosivos. Cada paso podría detonar. Envían especialistas de desactivación para que avancen con cuidado. Pero los creadores de las trampas ponen guardias vivos entre los explosivos...', enemies: [{ type: 'chunin', index: 1, count: 2 }], ryo: 620, exp: 95, turns: 3 },
                { name: '⚔️ Cazar al Desertor', rank: 'B', description: 'Un chunin desertor conoce rutas internas. Tráelo de vuelta… o deténlo.', narrator: 'Un chunin de Konoha desertó con información sensible. Sus antiguos compañeros reportan que se dirige a un campamento donde venderá todo lo que sabe. Tu órdenes son traerlo de vuelta. Si resiste... entonces tu misión es asegurar que nunca hable. El desertor tiene aliados ahora...', enemies: [{ type: 'chunin', index: 2, count: 2 }], ryo: 880, exp: 140, turns: 4 },
                { name: '🌫️ Niebla en el Paso del Norte', rank: 'B', description: 'La niebla oculta movimientos enemigos. Descubre la verdad tras el velo.', narrator: 'El Paso del Norte está envuelto en niebla anormalmente densa. Reportes contradictorios llegan de comerciantes que cruzaron. EL Hokage sospecha que es un genjutsu de cobertura para movimiento de tropas. Te envían al paso para descubrir la verdad. Dentro de la niebla, las sombras toman forma...', enemies: [{ type: 'chunin', index: 0, count: 3 }], ryo: 740, exp: 115, turns: 3 },
                { name: '🔒 Recuperar Sellos de Seguridad', rank: 'B', description: 'Robaron sellos de barrera. Si los usan, Konoha queda expuesta.', narrator: 'Los Sellos Maestros de Barrera de Konoha fueron robados del Laboratorio Central. Sin ellos, las defensas de la aldea se desmoronan dentro de horas. Los rastreadores ubicaron a los ladrones en un almacén escondido. Cuando irrumpes, son contrabandistas entrenados listos para defender su carga...', enemies: [{ type: 'chunin', index: 1, count: 3 }], ryo: 820, exp: 125, turns: 3 },
                { name: '🧭 Escolta de Diplomático', rank: 'A', description: 'Un diplomático viaja con información crítica. La emboscada es segura.', narrator: 'Un diplomático de alto nivel viaja a negociaciones que podrían salvarnos de la guerra. Su muerte sería desastrosa. Inteligencia confirma emboscadas en tres ruta posibles. La tomaremos la más peligrosa para mantenerlas adivinando. Cuando entras en el desfiladero, ves a los emboscadores esperando...', enemies: [{ type: 'jonin', index: 0, count: 1 }], ryo: 1100, exp: 150, turns: 4 },
                { name: '🏚️ Limpieza de Refugio Renegado', rank: 'A', description: 'Un refugio clandestino oculta un pequeño ejército. Borra la amenaza.', narrator: 'Descubrimos un campamento renegado albergando criminales que planean un ataque coordinado contra la aldea. El Hokage quiere que se limpie completamente. Nada permanece. Cuando te acercas al refugio, todos los defensores ya te han visto venir...', enemies: [{ type: 'chunin', index: 0, count: 4 }], ryo: 1000, exp: 145, turns: 4 },
                { name: '🩸 Secuestro en la Ruta del Té', rank: 'A', description: 'Bandidos con apoyo ninja secuestraron a un heredero. Rescátalo sin ruido.', narrator: 'El heredero de una familia mercante influyente fue secuestrado en la Ruta del Té. Los secuestradores demandan una suma imposible de tributo. Pero el tiempo se agota. Rastreamos al heredero a un campamento fortificado donde custodios profesionales lo mantienen prisionero...', enemies: [{ type: 'chunin', index: 1, count: 2 }, { type: 'chunin', index: 3, count: 1 }], ryo: 1150, exp: 150, turns: 4 },
                { name: '🔥 Incursión Relámpago', rank: 'A', description: 'Golpea un puesto enemigo y retírate antes de que lleguen refuerzos.', narrator: 'Un puesto de avanzada enemiga coordina ataques contra nuestra región. Debe caer. Tu misión es rápida: irrumpe, destruye sus comunicaciones y suministros, y sal antes de que lleguen refuerzos. Cuando atacas, la guarnición monta una defensa fiera...', enemies: [{ type: 'chunin', index: 2, count: 3 }], ryo: 980, exp: 140, turns: 3 },
                { name: '🕯️ El Testigo Silencioso', rank: 'A', description: 'Un testigo clave está marcado. Protégele hasta el amanecer.', narrator: 'Una persona conoce los nombres de los asesinos que trabajan para nuestros enemigos. Acordó testificar. Pero asesinaron ya a otros testigos. Tus órdenes: proteger a esta persona toda la noche contra los asesinos que vienen. La noche es larga, y los asesinos despiadados traen refuerzos...', enemies: [{ type: 'jonin', index: 2, count: 1 }], ryo: 1200, exp: 150, turns: 4 }
            ],
            jonin: [
                { name: '🎯 Objetivo de Alto Valor', rank: 'A', description: 'Un estratega enemigo coordina ataques. Elimina la pieza clave.', narrator: 'Este estratega ha causado la muerte de cientos con sus planes. Está coordinando el próximo ataque masivo. Nuestro Hokage no puede permitir que continúe. Te dan su última ubicación conocida. Cuando llegas, sus guardaespaldas ya tienen sus armas dibujadas...', enemies: [{ type: 'jonin', index: 0, count: 2 }], ryo: 1700, exp: 170, turns: 3 },
                { name: '🗡️ Caza ANBU Renegado', rank: 'A', description: 'Un ANBU desertor dejó la aldea con secretos. No puede escapar.', narrator: 'Un soldado de élite de nuestro ANBU se fue. Conoce todos nuestros protocolos de defensa. Conoce los rostros de los agentes secretos. Conoce dónde está el Hokage cada noche. Si llega a territorio enemigo vivo, Konoha cae. Tu persecución termina hoy. El renegado está dispuesto a morir antes de ser capturado...', enemies: [{ type: 'jonin', index: 2, count: 2 }], ryo: 2000, exp: 210, turns: 4 },
                { name: '🏯 Protección de Archivo Vivo', rank: 'A', description: 'Un anciano archivista conoce nombres prohibidos. Protege su memoria.', narrator: 'Un archivista que tenía 50 años de acceso a nivel de Hokage fue intentado asesinar. Él es el único que recuerda las ubicaciones de los depósitos de armamento antiguo. Ahora los enemigos vienen por él en fuerza. Debes mantenerlo vivo a través de la noche mientras son atacados...', enemies: [{ type: 'jonin', index: 0, count: 1 }, { type: 'chunin', index: 2, count: 2 }], ryo: 1850, exp: 190, turns: 4 },
                { name: '🌪️ Guerra de Frontera (Escaramuza)', rank: 'A', description: 'Una escaramuza estalla en la frontera. Contén el conflicto antes de que crezca.', narrator: 'Una escaramuza se convierte rápidamente en enfrentamiento total. Si no detienes la escalada inmediatamente, tendremos una guerra completa. Te envían como fuerza de contención rápida. Cuando llegas a la frontera, ambas fuerzas enemigas avanzan con intención de conquistar...', enemies: [{ type: 'jonin', index: 1, count: 2 }], ryo: 2300, exp: 240, turns: 5 },
                { name: '🧿 Romper el Genjutsu Masivo', rank: 'A', description: 'Un pueblo entero cayó en ilusión. Encuentra al conductor y corta el hilo.', narrator: 'Un pueblo completo está atrapado en un genjutsu que los mantiene dormidos. Si cae durante los próximos seis horas, morirán. El maestro del genjutsu está oculto en algún lugar del pueblo. Tu tarea: encontrar al conductor y romper el hechizo. Dentro de la neblina onírica, aún luchan fuerzas defensoras...', enemies: [{ type: 'jonin', index: 2, count: 2 }], ryo: 2100, exp: 230, turns: 4 },
                { name: '🚨 Asalto al Laboratorio Secreto', rank: 'S', description: 'Experimentos prohibidos. Destruye el laboratorio y recupera evidencia.', narrator: 'Los enemigos están realizando experimentos prohibidos en humanos. Horrores que desafían todo lo que sabemos. El Hokage quiere que destruyas el laboratorio y recuperes cualquier evidencia de sus crímenes. Cuando irrumpes en las instalaciones, descubres que los resultados de los experimentos están vivos...', enemies: [{ type: 'akatsuki', index: 4, count: 1 }, { type: 'jonin', index: 2, count: 2 }], ryo: 2800, exp: 300, turns: 5 },
                { name: '🌑 Eliminación Nocturna', rank: 'A', description: 'Un asesino jonin opera solo de noche. Cázalo en su terreno.', narrator: 'Un asesino profesional ha tomado vidas de civiles inocentes durante meses. Solo sale de noche. Está en algún lugar de la aldea. Tienes una noche para encontrarlo antes de que le liquide a su próximo objetivo. La noche cae, y con ella, los instintos asesinos despiertan...', enemies: [{ type: 'jonin', index: 0, count: 3 }], ryo: 2400, exp: 260, turns: 5 },
                { name: '📜 Pergamino de Sangre', rank: 'A', description: 'Un pergamino maldito circula. Recupera el sello y quémalo en altar.', narrator: 'Un pergamino antiguo y maldito circula entre coleccionistas. Contiene un hechizo de maldición que puede acabar con líneas de sangre completas. Ha matado a tres familias ya. Rastreamos el pergamino a un colector negro que lo protege con mercenarios entrenados. Necesitamos ese pergamino destruido...', enemies: [{ type: 'jonin', index: 1, count: 2 }], ryo: 1950, exp: 200, turns: 4 },
                { name: '🧭 Escolta del Jinchūriki Menor', rank: 'S', description: 'Movimiento delicado. Protege a un portador inestable durante el traslado.', narrator: 'Un Jinchūriki inmaduro debe ser trasladado a un nuevo sitio de retención. El viaje es peligroso. Las organizaciones enemigas pagarían un precio enorme por capturarlo. Su inestabilidad mental lo hace impredecible. Tu misión: llevarlo desde el Punto A al Punto B vivo. Cuando sales de la aldea, enemigos que fueron alertados cierren sobre ti...', enemies: [{ type: 'jonin', index: 1, count: 3 }], ryo: 3000, exp: 300, turns: 5 },
                { name: '🧨 Desmantelar Red de Explosivos', rank: 'A', description: 'Un corredor está listo para volar. Cortar la red salvará cientos.', narrator: 'Un terrorista colocó una red de explosivos a lo largo de la arterial comercial central. Está programado para detonar en horas. La Ruta de Suministro podría estar comprometida. Los detonantes están cuidados por sus cómplices. Debes desactivar la red. Cuando llegas, el terrorista nota tu presencia...', enemies: [{ type: 'jonin', index: 0, count: 2 }], ryo: 1750, exp: 180, turns: 3 },
                { name: '☁️ Asalto al Escuadrón de Nube', rank: 'S', description: 'Un escuadrón élite cruza territorio. Rompe su avance antes del amanecer.', narrator: 'Un escuadrón de élite de Kumo fue detectado cruzando territorio neutral. Están coordinando algo. Nuestras líneas de defensa están rastrillas en ese sector. Tu trabajo: romper su avance antes de que logren sus objetivos. Cuando interceptas al escuadrón, sus ninjas elite dibujan sus armas...', enemies: [{ type: 'jonin', index: 0, count: 4 }], ryo: 2900, exp: 290, turns: 5 },
                { name: '🕳️ Caverna del Eco', rank: 'A', description: 'Desaparecen patrullas en una caverna. La oscuridad es una trampa viva.', narrator: 'Tres patrullas desaparecieron en la Caverna del Eco. Sus equipos fueron encontrados abandonados. La oscuridad allí es sobrenatural. La caverna podría estar habitada por criaturas antiguas. Entras a rescatar a los sobrevivientes. Cuando tus ojos se ajustan, ves que no estás solo...', enemies: [{ type: 'jonin', index: 2, count: 3 }], ryo: 2200, exp: 240, turns: 4 },
                { name: '📦 Intercepción de Contrabando de Jutsu', rank: 'A', description: 'Contrabando de pergaminos avanzados. Captura el lote y al líder.', narrator: 'Un caravan de contrabando trae técnicas jutsu prohibidas y peligrosas. El líder es un ninja renegado con conexiones peligrosas. El Hokage quiere los pergaminos interceptados y al líder capturado. Cuando tiendes tu emboscada, el líder demuestra por qué es renegado...', enemies: [{ type: 'jonin', index: 0, count: 1 }, { type: 'chunin', index: 1, count: 3 }], ryo: 2500, exp: 260, turns: 4 },
                { name: '🩸 Venganza de los Renegados', rank: 'S', description: 'Un clan renegado juró venganza. Detén la masacre antes de que empiece.', narrator: 'Un clan que fue expulsado de Konoha hace cinco años juró venganza. Hemos visto reuniones coordinadas de antiguos miembros. Planean un ataque masivo durante el festival. Tu misión: encontrar a su líder y evitar la carnicería. Cuando los ubicas, el clan entero se levanta contra ti...', enemies: [{ type: 'akatsuki', index: 2, count: 1 }], ryo: 2700, exp: 280, turns: 4 },
                { name: '🏹 Protege al Daimyō (Alto Riesgo)', rank: 'A', description: 'Asesinos de élite atacan el convoy. No hay segundas oportunidades.', narrator: 'El Daimyō amigo de Konoha es objetivo de asesinos profesionales. Hicieron un intento hace una semana que falló. Esta vez envían sus mejores. Tu misión: man mantenerlo con vida. Sus líneas de defensa normales ya están comprometidas. Cuando los asesinos atacan, no hay donde esconderse excepto contigo...', enemies: [{ type: 'jonin', index: 2, count: 2 }, { type: 'jonin', index: 0, count: 1 }], ryo: 2600, exp: 270, turns: 5 }
            ],
            kage: [
                { name: '☠️ Célula Akatsuki: “El Ritual”', rank: 'S', description: 'Un miembro de Akatsuki prepara un ritual. Interrúmpelo o la aldea sangrará.', enemies: [{ type: 'akatsuki', index: 0, count: 1 }], ryo: 5000, exp: 500, turns: 5 },
                { name: '🕸️ Cosechador de Corazones', rank: 'S', description: 'Un enemigo inmortal acumula corazones. Corta su red y sobrevívelo.', narrator: 'Un ser que no muere acumula corazones de ninjas poderosos. Cada corazón lo hace más fuerte. Ha acumulado cientos. El Hokage cree que si le quitas suficientes corazones, finalmente caerá. Su guarida es un laberinto sangriento. Cuando entras, el Cosechador ya te estaba esperando...', enemies: [{ type: 'akatsuki', index: 1, count: 1 }], ryo: 6500, exp: 650, turns: 6 },
                { name: '🦂 Marionetas Carmesí', rank: 'S', description: 'Una ciudad cae ante veneno y marionetas. Encuentra al titiritero.', narrator: 'Una ciudad aliada está siendo aniquilada por tóxinas y marionetas de guerra. El titiritero permanece oculto, controlando todo desde las sombras. Si no lo encuentras en las próximas horas, todos en la ciudad habrán muerto. Entras a la ciudad sofocante de miasma. Las marionetas se mueven en todas partes...', enemies: [{ type: 'akatsuki', index: 2, count: 1 }], ryo: 7000, exp: 700, turns: 6 },
                { name: '💥 Arte Explosivo en la Frontera', rank: 'S', description: 'Explosiones selladas destruyen puestos aliados. Caza al artista.', narrator: 'Un maestro explosivo está destruyendo nuestros puestos fronterizos uno por uno. Cientos han muerto. Su próximo objetivo será la frontera principal. El Hokage quiere que lo busques y lo detengas. Su dominio del arte explosivo es legendario. Cuando lo encuentras, toda la zona se convierte en un campo de batalla ardiente...', enemies: [{ type: 'akatsuki', index: 3, count: 1 }], ryo: 8000, exp: 800, turns: 6 },
                { name: '🐍 Sombras del Laboratorio', rank: 'S', description: 'Experimentos prohibidos despiertan. Cierra el laboratorio y destruye registros.', narrator: 'Un laboratorio subterráneo clandestino fue descubierto. Contiene horror sin nombre. Cosas que fueron creadas hace décadas están despertando. Debes sellar el laboratorio y destruir toda evidencia antes de que algo escape al exterior. Cuando bajas, descubres que no estás solo en la oscuridad...', enemies: [{ type: 'akatsuki', index: 4, count: 1 }], ryo: 9000, exp: 900, turns: 7 },
                { name: '🏯 Invasión de Pain (Primer Asalto)', rank: 'S', description: 'El cielo se parte. Detén el primer cuerpo antes de que la aldea colapse.', narrator: 'El cielo se partió literalmente. Un poder que el Hokage nunca ha visto desciende sobre Konoha. Es Pain. El Hokage te lo envía como último recurso. Quizá puedas detener un cuerpo de su resurrección antes de que realice su verdadero poder. Cuando te enfrentas a él, sientes que tu poder es insignificante...', enemies: [{ type: 'boss', index: 0, count: 1 }], ryo: 12000, exp: 1100, turns: 8 },
                { name: '🌑 Operación “Silencio ANBU”', rank: 'S', description: 'Un traidor filtra secretos. Infiltra su red y bórrala sin testigos.', enemies: [{ type: 'jonin', index: 2, count: 4 }], ryo: 6000, exp: 600, turns: 6 },
                { name: '🌩️ Tormenta sobre la Cumbre', rank: 'S', description: 'Reunión de kages bajo ataque. Evita una guerra total.', narrator: 'Los cinco Kages se reunieron en la Cumbre para paz. Fue una trampa. El enemigo ataca coordinadamente. Una guerra total está a segundos de estallar. Debes romper el círculo de asesinos antes de que maten al Hokage. Si falla, todos saldrá corriendo. Cuando irrumpes en la cámara de cumbre, la batalla ya está en caos...', enemies: [{ type: 'akatsuki', index: 3, count: 1 }, { type: 'jonin', index: 0, count: 2 }], ryo: 10000, exp: 950, turns: 7 },
                { name: '🔥 Sellos del Kyūbi (Barrera Fracturada)', rank: 'S', description: 'La barrera se debilita. Repara los sellos mientras te cazan.', narrator: 'La barrera que sella al Kyūbi está fallando. Si se rompe, el Kyūbi será liberado y Konoha arderá. El enemigo sabe esto y está atacando los Sellos Maestros directamente. Tu misión: repara los sellos por cuenta propia mientras eres atacado. El tiempo es crítico. Los asesinos cierran sobre tu posición...', enemies: [{ type: 'akatsuki', index: 0, count: 2 }], ryo: 11000, exp: 1000, turns: 7 },
                { name: '🩸 Guerra Relámpago en Dos Frentes', rank: 'S', description: 'Dos aldeas atacan al mismo tiempo. Decide rápido o perderás todo.', narrator: 'Dos aldeas enemigas coordinaron un ataque simultáneo contra Konoha. Las líneas defensivas están sobrecargadas. El Hokage no puede estar en ambos lugares a la vez. Eres enviado a un frente. Rompe su avance aquí antes de que penetren el perímetro interno. Cuando llegas, ves oleadas de enemigos...', enemies: [{ type: 'jonin', index: 0, count: 5 }], ryo: 9000, exp: 900, turns: 6 },
                { name: '🪐 El Ojo del Uchiha Legendario', rank: 'S', description: 'Una presencia aplasta la voluntad. Sobrevive y detén al titán.', narrator: 'Un usuario legendario del Sharingan ha despertado. Su poder es tan grande que soldados normales se rallan desmayados por miedo. El Hokage te envía porque eres el único que podría tener una oportunidad. Cuando lo ves aparecer, comprendes que podrías estar peleando contra lo imposible...', enemies: [{ type: 'boss', index: 1, count: 1 }], ryo: 15000, exp: 1300, turns: 8 },
                { name: '🌕 Noche de Luna Roja', rank: 'S', description: 'Una técnica prohibida se activa con la luna. Rompe el ritual antes del amanecer.', narrator: 'Una técnica prohibida que no ha sido vista en siglos se activa bajo la luna roja. El Hokage cree que es para invocar algo antiguo. Tienes hasta el amanecer para encontrar a los rituales y romper el círculo. Cuando suena el gong ceremonial, cientos de enemigos emergen de la oscuridad...', enemies: [{ type: 'akatsuki', index: 1, count: 1 }, { type: 'akatsuki', index: 0, count: 1 }], ryo: 14000, exp: 1200, turns: 7 },
                { name: '🧊 País de la Nieve: Eclipse Blanco', rank: 'S', description: 'El frío es una prisión. Recupera un artefacto sellado en tormenta.', narrator: 'Un artefacto antiguo fue sellado en el País de la Nieve siglos atrás porque era demasiado peligroso. La tormenta de nieve es una barrera natural. El enemigo está intentando romper el sello. Entras a la tormenta blanca donde el frío quema y los enemigos se sienten en casa. Cuando cavas a través de la nieve, ves movimiento coordinado...', enemies: [{ type: 'jonin', index: 1, count: 4 }], ryo: 8000, exp: 850, turns: 6 },
                { name: '🗿 Valle del Fin: Ruptura de Paz', rank: 'S', description: 'Un choque histórico amenaza repetirse. Evita que el valle sea tumba otra vez.', narrator: 'Hace años dos titanes se enfrentaron en el Valle del Fin. Murieron juntos. Ahora sus sucedores se reúnen en el mismo lugar para repetir la historia. Si se pelean, el Valle será una masacre de nuevo. El Hokage te envía para evitar que se enfrenten. Cuando llegas, puedes sentir la tensión titánica entre ellos...', enemies: [{ type: 'akatsuki', index: 2, count: 1 }], ryo: 9500, exp: 900, turns: 6 },
                { name: '🌌 Guerra Ninja Final (Umbral)', rank: 'S', description: 'La realidad se abre. Lucha contra lo imposible y protege el mundo.', narrator: 'Las barreras entre dimensiones se están colapsando. Enemigos de reinos olvidados están entrando en nuestro mundo. El Hokage no tiene respuestas. Solo te envía a ti al epicentro del colapso dimensional. Tu misión es simple: detén lo imposible. Cuando cruzas el umbral, comprendes que el mundo que conoces es mucho más pequeño de lo que pensabas...', enemies: [{ type: 'boss', index: 2, count: 1 }], ryo: 20000, exp: 1500, turns: 8 }
            ]
        },
};

