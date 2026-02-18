// Jutsus de Elemento Agua (Suiton) - El Estilo del Agua
export const suitonJutsus = {
    suiton: [
        // =============== RANGO D (5) ===============
        {
            name: 'Suiton: Látigo de Agua',
            rank: 'D',
            chakra: 12,
            damage: 14,
            element: 'water',
            description: 'Un látigo de agua que golpea al enemigo con precisión.',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 6 },
                exp: 30,
                level: 1,
                rank: 'Genin',
                element: 'water'
            }
        },
        {
            name: 'Suiton: Bala de Agua',
            rank: 'D',
            chakra: 14,
            damage: 18,
            element: 'water',
            description: 'Dispara un proyectil de agua comprimida de alta velocidad.',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 8 },
                exp: 50,
                level: 1,
                rank: 'Genin',
                element: 'water'
            }
        },
        {
            name: 'Suiton: Neblina',
            rank: 'D',
            chakra: 16,
            damage: 12,
            element: 'water',
            description: 'Crea una neblina que reduce la visibilidad del enemigo.',
            effect: 'blind',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 10 },
                exp: 80,
                level: 2,
                rank: 'Genin',
                element: 'water'
            }
        },
        {
            name: 'Suiton: Escudo Líquido',
            rank: 'D',
            chakra: 15,
            damage: 8,
            element: 'water',
            description: 'Una capa delgada de agua que reduce el daño recibido.',
            effect: 'shield_water',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 7 },
                exp: 45,
                level: 1,
                rank: 'Genin',
                element: 'water'
            }
        },
        {
            name: 'Suiton: Corriente Menor',
            rank: 'D',
            chakra: 13,
            damage: 16,
            element: 'water',
            description: 'Una corriente de agua que empuja y desestabiliza al enemigo.',
            effect: 'slow',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 9 },
                exp: 60,
                level: 2,
                rank: 'Genin',
                element: 'water'
            }
        },

        // =============== RANGO C (6) ===============
        {
            name: 'Suiton: Suiryūdan no Jutsu (Dragón de Agua)',
            rank: 'C',
            chakra: 35,
            damage: 42,
            element: 'water',
            description: 'Invoca un dragón de agua que ataca con poder devastador.',
            effect: 'slow',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 15 },
                exp: 200,
                level: 3,
                rank: 'Genin',
                element: 'water'
            }
        },
        {
            name: 'Suiton: Ola Gigante',
            rank: 'C',
            chakra: 36,
            damage: 38,
            element: 'water',
            description: 'AOE: Una ola masiva que barre a todos los enemigos en el campo.',
            effect: 'aoe_slow',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 16 },
                exp: 220,
                level: 3,
                rank: 'Genin',
                element: 'water'
            }
        },
        {
            name: 'Suiton: Suirō no Jutsu (Prisión de Agua)',
            rank: 'C',
            chakra: 38,
            damage: 30,
            element: 'water',
            description: 'Atrapa al enemigo en una esfera de agua, dejándolo inmovilizado 1 turno.',
            effect: 'stun',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 18 },
                exp: 280,
                level: 4,
                rank: 'Genin',
                element: 'water'
            }
        },
        {
            name: 'Suiton: Torbellino Acuático',
            rank: 'C',
            chakra: 32,
            damage: 35,
            element: 'water',
            description: 'Crea un vórtice de agua que arrastra al enemigo.',
            effect: 'slow',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 14 },
                exp: 170,
                level: 3,
                rank: 'Genin',
                element: 'water'
            }
        },
        {
            name: 'Suiton: Muro de Agua',
            rank: 'C',
            chakra: 30,
            damage: 0,
            element: 'water',
            description: 'Levanta un muro de agua que bloquea ataques enemigos.',
            effect: 'shield_water',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 12 },
                exp: 150,
                level: 3,
                rank: 'Genin',
                element: 'water'
            }
        },
        {
            name: 'Suiton: Lágrimas de Lluvia',
            rank: 'C',
            chakra: 34,
            damage: 40,
            element: 'water',
            description: 'Múltiples gotas de agua caen como agujas perforantes.',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 17 },
                exp: 250,
                level: 4,
                rank: 'Genin',
                element: 'water'
            }
        },

        // =============== RANGO B (5) ===============
        {
            name: 'Suiton: Armadura Acuática',
            rank: 'B',
            chakra: 50,
            damage: 0,
            element: 'water',
            description: 'Escudo defensivo: Recubre el cuerpo con agua que absorbe daño físico y ninjutsu.',
            effect: 'shield_water',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 20 },
                exp: 420,
                level: 6,
                rank: 'Chunin',
                element: 'water'
            }
        },
        {
            name: 'Suiton: Gran Cascada',
            rank: 'B',
            chakra: 55,
            damage: 65,
            element: 'water',
            description: 'Lanza una poderosa cascada que arrasa todo a su paso.',
            effect: 'drown',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 22 },
                exp: 400,
                level: 6,
                rank: 'Chunin',
                element: 'water'
            }
        },
        {
            name: 'Suiton: Samehadā (Tiburón Explosivo)',
            rank: 'B',
            chakra: 60,
            damage: 70,
            element: 'water',
            description: 'Crea un tiburón de agua que muerde y explota al impactar.',
            effect: 'drown',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 25 },
                exp: 500,
                level: 7,
                rank: 'Chunin',
                element: 'water'
            }
        },
        {
            name: 'Suiton: Prisión de Mil Agujas',
            rank: 'B',
            chakra: 58,
            damage: 68,
            element: 'water',
            description: 'Agujas de agua congelada que perforan al enemigo desde todas direcciones.',
            effect: 'slow',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 24 },
                exp: 480,
                level: 7,
                rank: 'Chunin',
                element: 'water'
            }
        },
        {
            name: 'Suiton: Reflejo Espejo',
            rank: 'B',
            chakra: 52,
            damage: 0,
            element: 'water',
            description: 'Superficie acuática reflectante que devuelve parte del daño ninjutsu al atacante.',
            effect: 'reflect',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 23 },
                exp: 450,
                level: 6,
                rank: 'Chunin',
                element: 'water'
            }
        },

        // =============== RANGO A/S (4) ===============
        {
            name: 'Suiton: Tsunami',
            rank: 'A',
            chakra: 80,
            damage: 110,
            element: 'water',
            description: 'AOE masivo: Invoca un tsunami devastador que arrasa formaciones enemigas completas.',
            effect: 'aoe_drown',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 32 },
                exp: 800,
                level: 10,
                rank: 'Jonin',
                element: 'water'
            }
        },
        {
            name: 'Suiton: Gran Torbellino del Abismo',
            rank: 'A',
            chakra: 85,
            damage: 120,
            element: 'water',
            description: 'Vórtice masivo que succiona y tritura enemigos con presión extrema.',
            effect: 'drown',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 35 },
                exp: 1000,
                level: 11,
                rank: 'Jonin',
                element: 'water'
            }
        },
        {
            name: 'Suiton: Océano Furioso',
            rank: 'S',
            chakra: 110,
            damage: 160,
            element: 'water',
            description: 'Técnica maestra: Convoca un océano entero que devora todo. Poder absoluto.',
            effect: 'aoe_drown',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 40 },
                exp: 1200,
                level: 13,
                rank: 'Kage',
                element: 'water'
            },
            masterRequired: true,
            masterNote: 'Requiere entrenamiento de Kisame Hoshigaki o un maestro de Kirigakure'
        },
        {
            name: 'Suiton: Leviatán Primordial',
            rank: 'S',
            chakra: 120,
            damage: 180,
            element: 'water',
            description: 'Técnica suprema: Invoca al antiguo dragón marino. Destrucción total.',
            effect: 'aoe_drown',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 42 },
                exp: 1500,
                level: 15,
                rank: 'Kage',
                element: 'water'
            },
            masterRequired: true,
            masterNote: 'Solo dominado por los maestros supremos del agua de las Siete Espadas de la Niebla'
        }
    ]
};
