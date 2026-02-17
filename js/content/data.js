// Datos y configuración estática del juego
// Editá este archivo para agregar clanes, jutsus, misiones, enemigos, etc.

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

        // Reclutamiento (equipo de 3: tú + 2 NPC)
        recruitableNPCs: {
            naruto: { id: 'naruto', name: 'Naruto', costPerDay: 500, perk: 'mission_ryo', perkValue: 0.10 },
            sakura: { id: 'sakura', name: 'Sakura', costPerDay: 400, perk: 'between_heal', perkValue: 0.10 },
            lee: { id: 'lee', name: 'Rock Lee', costPerDay: 450, perk: 'combat_damage', perkValue: 15 },
            shikamaru: { id: 'shikamaru', name: 'Shikamaru', costPerDay: 600, perk: 'mission_exp', perkValue: 0.20 },
            hinata: { id: 'hinata', name: 'Hinata', costPerDay: 550, perk: 'team_evasion', perkValue: 0.15 }
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
            uchiha: {
                name: 'Uchiha',
                icon: '🔥',
                description: 'Clan del fuego',
                hp: 100, chakra: 120, taijutsu: 12, ninjutsu: 18, genjutsu: 15,
                element: 'fire'
            },
            uzumaki: {
                name: 'Uzumaki',
                icon: '🌀',
                description: 'Vitalidad extrema',
                hp: 140, chakra: 150, taijutsu: 15, ninjutsu: 14, genjutsu: 8,
                element: 'wind'
            },
            hyuga: {
                name: 'Hyuga',
                icon: '👁️',
                description: 'Visión perfecta',
                hp: 110, chakra: 100, taijutsu: 20, ninjutsu: 10, genjutsu: 12,
                element: 'water'
            },
            nara: {
                name: 'Nara',
                icon: '🦌',
                description: 'Estrategas',
                hp: 90, chakra: 110, taijutsu: 10, ninjutsu: 15, genjutsu: 18,
                element: 'earth'
            },
            akimichi: {
                name: 'Akimichi',
                icon: '🍖',
                description: 'Fuerza colosal',
                hp: 150, chakra: 90, taijutsu: 18, ninjutsu: 12, genjutsu: 8,
                element: 'earth'
            },
            aburame: {
                name: 'Aburame',
                icon: '🐛',
                description: 'Control de insectos',
                hp: 95, chakra: 115, taijutsu: 11, ninjutsu: 16, genjutsu: 14,
                element: 'earth'
            },
            inuzuka: {
                name: 'Inuzuka',
                icon: '🐺',
                description: 'Vínculo bestial',
                hp: 115, chakra: 95, taijutsu: 17, ninjutsu: 11, genjutsu: 10,
                element: 'earth'
            },
            yamanaka: {
                name: 'Yamanaka',
                icon: '🌸',
                description: 'Control mental',
                hp: 85, chakra: 125, taijutsu: 9, ninjutsu: 13, genjutsu: 20,
                element: 'water'
            },
            hatake: {
                name: 'Hatake',
                icon: '⚡',
                description: 'Copistas',
                hp: 105, chakra: 130, taijutsu: 14, ninjutsu: 17, genjutsu: 13,
                element: 'lightning'
            },
            senju: {
                name: 'Senju',
                icon: '🌳',
                description: 'Equilibrio perfecto',
                hp: 120, chakra: 120, taijutsu: 15, ninjutsu: 15, genjutsu: 15,
                element: 'earth'
            },
            sarutobi: {
                name: 'Sarutobi',
                icon: '🔮',
                description: 'Maestros elementales',
                hp: 100, chakra: 140, taijutsu: 12, ninjutsu: 19, genjutsu: 11,
                element: 'fire'
            },
            rock_lee: {
                name: 'Sin Clan (Lee)',
                icon: '👊',
                description: 'Puro Taijutsu',
                hp: 130, chakra: 50, taijutsu: 25, ninjutsu: 5, genjutsu: 5,
                element: null
            }
        },

        kekkeiGenkaiList: [
            { 
                name: 'Sharingan', 
                chance: 3, 
                levels: [
                    { level: 1, name: '1 Aspa', exp: 0, bonus: { genjutsu: 3, critChance: 5 } },
                    { level: 2, name: '2 Aspas', exp: 100, bonus: { genjutsu: 5, critChance: 10 } },
                    { level: 3, name: '3 Aspas', exp: 300, bonus: { genjutsu: 8, critChance: 15 } },
                    { level: 4, name: 'Mangekyō', exp: 600, bonus: { genjutsu: 12, critChance: 20, ninjutsu: 5 } }
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

        academyJutsus: {
            genin: [
                { name: 'Katon: Pequeña Llama', rank: 'D', price: 100, chakra: 15, damage: 20, element: 'fire', description: 'Jutsu básico de fuego' },
                { name: 'Suiton: Bala de Agua', rank: 'D', price: 100, chakra: 15, damage: 18, element: 'water', description: 'Dispara agua' },
                { name: 'Futon: Ventisca', rank: 'D', price: 100, chakra: 15, damage: 22, element: 'wind', description: 'Ráfaga de viento' },
                { name: 'Doton: Pared de Tierra', rank: 'D', price: 100, chakra: 20, damage: 0, effect: 'defense', element: 'earth', description: '+Defensa temporal' },
                { name: 'Raiton: Chispa', rank: 'D', price: 100, chakra: 15, damage: 19, element: 'lightning', description: 'Descarga eléctrica' },
                { name: 'Kage Bunshin', rank: 'C', price: 300, chakra: 40, damage: 0, effect: 'clone', description: 'Crea un clon' },
                { name: 'Shunshin', rank: 'C', price: 250, chakra: 30, damage: 0, effect: 'speed', description: 'Aumenta velocidad' }
            ],
            chunin: [
                { name: 'Katon: Gran Bola de Fuego', rank: 'C', price: 500, chakra: 35, damage: 45, element: 'fire', description: 'Bola de fuego poderosa' },
                { name: 'Suiton: Dragón de Agua', rank: 'B', price: 800, chakra: 50, damage: 60, element: 'water', description: 'Dragón de agua' },
                { name: 'Futon: Rasengan', rank: 'B', price: 1000, chakra: 60, damage: 70, element: 'wind', description: 'Esfera de chakra' },
                { name: 'Doton: Prisión de Tierra', rank: 'B', price: 700, chakra: 45, damage: 40, effect: 'stun', element: 'earth', description: 'Atrapa al enemigo' },
                { name: 'Raiton: Chidori', rank: 'B', price: 1200, chakra: 55, damage: 75, element: 'lightning', description: 'Mil pájaros' },
                { name: 'Invocación: Animal', rank: 'B', price: 900, chakra: 50, damage: 50, effect: 'summon', description: 'Invoca un aliado' }
            ],
            jonin: [
                { name: 'Katon: Majestuosa Destrucción', rank: 'A', price: 2000, chakra: 80, damage: 100, element: 'fire', description: 'Mar de llamas' },
                { name: 'Suiton: Gran Cascada', rank: 'A', price: 2200, chakra: 85, damage: 110, element: 'water', description: 'Tsunami devastador' },
                { name: 'Futon: Rasen-Shuriken', rank: 'A', price: 2500, chakra: 90, damage: 120, element: 'wind', description: 'Rasengan definitivo' },
                { name: 'Raiton: Kirin', rank: 'A', price: 2800, chakra: 95, damage: 130, element: 'lightning', description: 'Bestia de rayos' },
                { name: 'Shinra Tensei', rank: 'S', price: 5000, chakra: 120, damage: 150, description: 'Rechaza todo' }
            ],
            master: [
                { name: 'Edo Tensei', rank: 'S', price: 10000, chakra: 150, damage: 0, effect: 'revive', description: 'Maestro: Resurrección prohibida' },
                { name: 'Kamui', rank: 'S', price: 8000, chakra: 100, damage: 80, effect: 'teleport', description: 'Maestro: Espacio-tiempo' },
                { name: 'Tsukuyomi', rank: 'S', price: 7000, chakra: 90, damage: 0, effect: 'mega_genjutsu', description: 'Maestro: Genjutsu supremo' },
                { name: 'Amaterasu', rank: 'S', price: 6000, chakra: 85, damage: 90, effect: 'burn_permanent', description: 'Maestro: Llamas eternas' }
            ]
        },

        shopItems: {
            consumables: [
                { name: '🍜 Ramen Ichiraku', price: 50, effect: { hp: 30 }, description: 'Recupera 30 HP' },
                { name: '🍙 Bento', price: 80, effect: { hp: 50 }, description: 'Recupera 50 HP' },
                { name: '💊 Píldora de Chakra', price: 100, effect: { chakra: 50 }, description: 'Recupera 50 Chakra' },
                { name: '💊 Píldora Militar', price: 150, effect: { hp: 80, chakra: 30 }, description: 'Recupera HP y Chakra' },
                { name: '💊 Píldora 3 Colores', price: 300, effect: { buff: true }, description: '+5 stats por 3 turnos' }
            ],
            weapons: [
                { name: '🗡️ Kunai Básico', price: 100, effect: { taijutsu: 2 }, description: '+2 Taijutsu' },
                { name: '🗡️ Kunai Explosivo', price: 250, effect: { taijutsu: 4 }, description: '+4 Taijutsu' },
                { name: '⚔️ Espada Ninja', price: 500, effect: { taijutsu: 6 }, description: '+6 Taijutsu' },
                { name: '⚔️ Katana Chakra', price: 1000, effect: { taijutsu: 8, chakraCost: -10 }, description: '+8 Tai, -10% costo chakra' },
                { name: '🔱 Kubikiribōchō', price: 3000, effect: { taijutsu: 15, lifesteal: true }, description: '+15 Tai, drena HP' }
            ],
            armor: [
                { name: '🛡️ Chaleco Genin', price: 200, effect: { maxHp: 10 }, description: '+10 HP máx' },
                { name: '🛡️ Chaleco Chunin', price: 500, effect: { maxHp: 20, defense: 5 }, description: '+20 HP, +5% defensa' },
                { name: '🛡️ Armadura ANBU', price: 1200, effect: { maxHp: 40, defense: 10 }, description: '+40 HP, +10% defensa' },
                { name: '🛡️ Manto Kage', price: 2500, effect: { maxHp: 60, defense: 15 }, description: '+60 HP, +15% defensa' }
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
                { name: 'Kaguya Ōtsutsuki', hp: 1000, chakra: 500, attack: 70, defense: 45, accuracy: 28, exp: 800, ryo: 10000 }
            ]
        },

        missions: {
            genin: [
                { name: 'Capturar al Gato Perdido', rank: 'D', description: 'El gato del Daimyo escapó...', enemies: [{ type: 'genin', index: 0, count: 1 }], ryo: 50, exp: 25 },
                { name: 'Limpiar el Río', rank: 'D', description: 'Bandidos ensucian el río.', enemies: [{ type: 'genin', index: 0, count: 2 }], ryo: 100, exp: 40 },
                { name: 'Escoltar Comerciante', rank: 'C', description: 'Protege al comerciante. Grupo de bandidos.', enemies: [{ type: 'genin', index: 0, count: 2 }, { type: 'genin', index: 1, count: 1 }], ryo: 250, exp: 60 },
                { name: 'Recuperar Pergamino', rank: 'C', description: 'Ninja renegado y sus guardias.', enemies: [{ type: 'genin', index: 1, count: 1 }, { type: 'genin', index: 2, count: 1 }], ryo: 350, exp: 70 }
            ],
            chunin: [
                { name: 'Patrulla Fronteriza', rank: 'B', description: 'Escuadrón enemigo detectado.', enemies: [{ type: 'chunin', index: 0, count: 2 }], ryo: 500, exp: 80 },
                { name: 'Defender Aldea Aliada', rank: 'B', description: 'Múltiples ninjas atacan.', enemies: [{ type: 'chunin', index: 0, count: 1 }, { type: 'chunin', index: 1, count: 2 }], ryo: 700, exp: 120 },
                { name: 'Infiltración', rank: 'B', description: 'Base enemiga fuertemente custodiada.', enemies: [{ type: 'chunin', index: 1, count: 1 }, { type: 'chunin', index: 3, count: 1 }], ryo: 800, exp: 130 },
                { name: 'Rescate de Rehén', rank: 'A', description: 'Equipo élite guarda al prisionero.', enemies: [{ type: 'chunin', index: 2, count: 1 }, { type: 'jonin', index: 0, count: 1 }], ryo: 1000, exp: 150 }
            ],
            jonin: [
                { name: 'Escuadrón de Élite', rank: 'A', description: 'Grupo de Jonin renegados.', enemies: [{ type: 'jonin', index: 0, count: 2 }], ryo: 1500, exp: 180 },
                { name: 'Proteger al Daimyo', rank: 'A', description: 'Oleada de asesinos de élite.', enemies: [{ type: 'jonin', index: 1, count: 1 }, { type: 'jonin', index: 2, count: 1 }], ryo: 1800, exp: 210 },
                { name: 'Enfrentar Akatsuki', rank: 'A', description: 'Miembro de Akatsuki con refuerzos.', enemies: [{ type: 'akatsuki', index: 0, count: 1 }, { type: 'jonin', index: 0, count: 1 }], ryo: 2000, exp: 250 },
                { name: 'Destruir Base de Orochimaru', rank: 'S', description: 'Orochimaru y sus guardianes.', enemies: [{ type: 'akatsuki', index: 4, count: 1 }, { type: 'jonin', index: 2, count: 2 }], ryo: 2500, exp: 300 }
            ],
            kage: [
                { name: 'Detener a Akatsuki', rank: 'S', description: 'Dos miembros de Akatsuki juntos!', enemies: [{ type: 'akatsuki', index: 1, count: 1 }, { type: 'akatsuki', index: 3, count: 1 }], ryo: 4000, exp: 400 },
                { name: 'Invasión de Pain', rank: 'S', description: 'Pain y varios cuerpos!', enemies: [{ type: 'boss', index: 0, count: 1 }, { type: 'akatsuki', index: 0, count: 2 }], ryo: 6000, exp: 500 },
                { name: 'Enfrentar a Madara', rank: 'S', description: 'Madara Uchiha. Batalla suprema.', enemies: [{ type: 'boss', index: 1, count: 1 }], ryo: 8000, exp: 600 },
                { name: 'Guerra Ninja Final', rank: 'S', description: 'Kaguya Ōtsutsuki. El fin de todo.', enemies: [{ type: 'boss', index: 2, count: 1 }], ryo: 15000, exp: 1000 }
            ]
        },
};
