// Jutsus de Elemento Tierra (Doton) - El Estilo de la Tierra
export const dotonJutsus = {
    doton: [
        // =============== RANGO D (5) ===============
        {
            name: 'Doton: Pared de Tierra',
            rank: 'D',
            chakra: 12,
            damage: 0,
            element: 'earth',
            description: 'Levanta una pared defensiva de tierra que bloquea ataques.',
            effect: 'wall',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 6 },
                exp: 30,
                level: 1,
                rank: 'Genin',
                element: 'earth'
            }
        },
        {
            name: 'Doton: Puño de Roca',
            rank: 'D',
            chakra: 14,
            damage: 20,
            element: 'earth',
            description: 'Refuerza el puño con roca sólida. Combina taijutsu y ninjutsu.',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 8, taijutsu: 5 },
                exp: 50,
                level: 1,
                rank: 'Genin',
                element: 'earth'
            }
        },
        {
            name: 'Doton: Lanza de Piedra',
            rank: 'D',
            chakra: 13,
            damage: 16,
            element: 'earth',
            description: 'Lanza proyectiles de piedra con precisión.',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 7 },
                exp: 45,
                level: 1,
                rank: 'Genin',
                element: 'earth'
            }
        },
        {
            name: 'Doton: Escudo Terrestre',
            rank: 'D',
            chakra: 15,
            damage: 0,
            element: 'earth',
            description: 'Crea un escudo de tierra que absorbe parte del daño recibido.',
            effect: 'wall',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 9 },
                exp: 60,
                level: 2,
                rank: 'Genin',
                element: 'earth'
            }
        },
        {
            name: 'Doton: Trampa de Barro',
            rank: 'D',
            chakra: 16,
            damage: 12,
            element: 'earth',
            description: 'Barro pegajoso que ralentiza los movimientos del enemigo.',
            effect: 'slow',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 10 },
                exp: 80,
                level: 2,
                rank: 'Genin',
                element: 'earth'
            }
        },

        // =============== RANGO C (6) ===============
        {
            name: 'Doton: Doryūheki (Armadura de Roca)',
            rank: 'C',
            chakra: 32,
            damage: 0,
            element: 'earth',
            description: 'Armadura defensiva: Recubre el cuerpo con roca, +50% defensa durante 3 turnos.',
            effect: 'armor_boost',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 14 },
                exp: 170,
                level: 3,
                rank: 'Genin',
                element: 'earth'
            }
        },
        {
            name: 'Doton: Doroku Gaeshi (Prisión de Tierra)',
            rank: 'C',
            chakra: 35,
            damage: 28,
            element: 'earth',
            description: 'Entierra al enemigo parcialmente, inmovilizándolo durante 2 turnos.',
            effect: 'entomb',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 15 },
                exp: 200,
                level: 3,
                rank: 'Genin',
                element: 'earth'
            }
        },
        {
            name: 'Doton: Doryūdan (Avalancha)',
            rank: 'C',
            chakra: 38,
            damage: 40,
            element: 'earth',
            description: 'AOE: Desata una avalancha de rocas que arrasa a múltiples enemigos.',
            effect: 'aoe_slow',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 18 },
                exp: 280,
                level: 4,
                rank: 'Genin',
                element: 'earth'
            }
        },
        {
            name: 'Doton: Lanza de Roca Gigante',
            rank: 'C',
            chakra: 30,
            damage: 35,
            element: 'earth',
            description: 'Invoca una enorme lanza de piedra que empalma al enemigo.',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 12 },
                exp: 150,
                level: 3,
                rank: 'Genin',
                element: 'earth'
            }
        },
        {
            name: 'Doton: Muro Reforzado',
            rank: 'C',
            chakra: 34,
            damage: 0,
            element: 'earth',
            description: 'Muro defensivo masivo que puede detener ataques poderosos.',
            effect: 'wall',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 16 },
                exp: 220,
                level: 3,
                rank: 'Genin',
                element: 'earth'
            }
        },
        {
            name: 'Doton: Lluvia de Rocas',
            rank: 'C',
            chakra: 36,
            damage: 38,
            element: 'earth',
            description: 'Múltiples rocas caen desde el cielo aplastando al enemigo.',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 17 },
                exp: 250,
                level: 4,
                rank: 'Genin',
                element: 'earth'
            }
        },

        // =============== RANGO B (5) ===============
        {
            name: 'Doton: Estalactitas Mortales',
            rank: 'B',
            chakra: 55,
            damage: 65,
            element: 'earth',
            description: 'Múltiples estalactitas emergen del suelo perforando al enemigo repetidamente.',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 20 },
                exp: 420,
                level: 6,
                rank: 'Chunin',
                element: 'earth'
            }
        },
        {
            name: 'Doton: Doryū Jōheki (Gigante de Tierra)',
            rank: 'B',
            chakra: 58,
            damage: 55,
            element: 'earth',
            description: 'Invoca un gigante de tierra que pelea a tu lado. Puede absorber daño.',
            effect: 'summon_defender',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 22 },
                exp: 400,
                level: 6,
                rank: 'Chunin',
                element: 'earth'
            }
        },
        {
            name: 'Doton: Doryūkatsu (Terremoto)',
            rank: 'B',
            chakra: 62,
            damage: 70,
            element: 'earth',
            description: 'AOE: Desata un terremoto que daña a todos y hace fallar jutsus enemigos.',
            effect: 'aoe_tremor',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 25 },
                exp: 500,
                level: 7,
                rank: 'Chunin',
                element: 'earth'
            }
        },
        {
            name: 'Doton: Fortaleza de Piedra',
            rank: 'B',
            chakra: 50,
            damage: 0,
            element: 'earth',
            description: 'Escudo absoluto: Estructura defensiva que otorga HP temporales masivos.',
            effect: 'fortress',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 23 },
                exp: 450,
                level: 6,
                rank: 'Chunin',
                element: 'earth'
            }
        },
        {
            name: 'Doton: Fauces de Tierra',
            rank: 'B',
            chakra: 60,
            damage: 68,
            element: 'earth',
            description: 'El suelo se abre y atrapa al enemigo entre mandíbulas de roca.',
            effect: 'entomb',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 24 },
                exp: 480,
                level: 7,
                rank: 'Chunin',
                element: 'earth'
            }
        },

        // =============== RANGO A/S (4) ===============
        {
            name: 'Doton: Golem Gigante',
            rank: 'A',
            chakra: 85,
            damage: 100,
            element: 'earth',
            description: 'Invoca un golem colosal de tierra que devasta el campo de batalla.',
            effect: 'summon_golem',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 32 },
                exp: 800,
                level: 10,
                rank: 'Jonin',
                element: 'earth'
            }
        },
        {
            name: 'Doton: Montaña Viviente',
            rank: 'A',
            chakra: 90,
            damage: 120,
            element: 'earth',
            description: 'Transforma el terreno en una montaña viviente que aplasta a los enemigos.',
            effect: 'aoe_entomb',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 35 },
                exp: 1000,
                level: 11,
                rank: 'Jonin',
                element: 'earth'
            }
        },
        {
            name: 'Doton: Apocalipsis Sísmico',
            rank: 'S',
            chakra: 110,
            damage: 160,
            element: 'earth',
            description: 'Técnica maestra: Sismo devastador que destruye todo. Poder tectónico absoluto.',
            effect: 'aoe_tremor',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 40 },
                exp: 1200,
                level: 13,
                rank: 'Kage',
                element: 'earth'
            },
            masterRequired: true,
            masterNote: 'Requiere entrenamiento de Onoki el Tsuchikage o maestros de Iwagakure'
        },
        {
            name: 'Doton: Titán de la Corteza',
            rank: 'S',
            chakra: 120,
            damage: 180,
            element: 'earth',
            description: 'Técnica suprema: Invoca un titán de roca milenaria. Defensa y ataque infinitos.',
            effect: 'summon_titan',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 42 },
                exp: 1500,
                level: 15,
                rank: 'Kage',
                element: 'earth'
            },
            masterRequired: true,
            masterNote: 'Solo los maestros legendarios de la Tierra pueden dominar este poder'
        }
    ]
};
