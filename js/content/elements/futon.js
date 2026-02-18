// Jutsus de Elemento Viento (Futon) - El Estilo del Viento
export const futonJutsus = {
    futon: [
        // =============== RANGO D (5) ===============
        {
            name: 'Futon: Ráfaga',
            rank: 'D',
            chakra: 14,
            damage: 20,
            element: 'wind',
            description: 'Una ráfaga de viento concentrado que empuja al enemigo.',
            effect: 'knockback',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 8 },
                exp: 50,
                level: 1,
                rank: 'Genin',
                element: 'wind'
            }
        },
        {
            name: 'Futon: Cuchilla de Viento',
            rank: 'D',
            chakra: 16,
            damage: 22,
            element: 'wind',
            description: 'Una hoja de viento afilado que corta como una espada.',
            effect: 'blade_wind',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 10 },
                exp: 80,
                level: 2,
                rank: 'Genin',
                element: 'wind'
            }
        },
        {
            name: 'Futon: Corriente Veloz',
            rank: 'D',
            chakra: 12,
            damage: 16,
            element: 'wind',
            description: 'Impulso de viento que aumenta la velocidad de movimiento.',
            effect: 'speed_boost',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 6 },
                exp: 30,
                level: 1,
                rank: 'Genin',
                element: 'wind'
            }
        },
        {
            name: 'Futon: Presión del Aire',
            rank: 'D',
            chakra: 15,
            damage: 18,
            element: 'wind',
            description: 'Comprime el aire y lo dispara como proyectil invisible.',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 9 },
                exp: 60,
                level: 2,
                rank: 'Genin',
                element: 'wind'
            }
        },
        {
            name: 'Futon: Vórtice Menor',
            rank: 'D',
            chakra: 13,
            damage: 17,
            element: 'wind',
            description: 'Pequeño remolino de viento que desorienta al enemigo.',
            effect: 'knockback',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 7 },
                exp: 45,
                level: 1,
                rank: 'Genin',
                element: 'wind'
            }
        },

        // =============== RANGO C (6) ===============
        {
            name: 'Futon: Gran Torbellino',
            rank: 'C',
            chakra: 35,
            damage: 45,
            element: 'wind',
            description: 'Crea un poderoso torbellino que arrastra y daña al enemigo.',
            effect: 'knockback',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 15 },
                exp: 200,
                level: 3,
                rank: 'Genin',
                element: 'wind'
            }
        },
        {
            name: 'Futon: Rasengan',
            rank: 'C',
            chakra: 40,
            damage: 55,
            element: 'wind',
            description: '¡EL JUTSU MÁS ICÓNICO! Esfera giratoria de chakra concentrado. Poder devastador.',
            effect: 'pierce',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 18 },
                exp: 300,
                level: 4,
                rank: 'Genin',
                element: 'wind'
            },
            masterRequired: true,
            masterNote: 'Requiere entrenamiento de Jiraiya o Naruto (Costo: 5000 Ryo)'
        },
        {
            name: 'Futon: Danza de la Luna',
            rank: 'C',
            chakra: 38,
            damage: 48,
            element: 'wind',
            description: 'Movimientos circulares que crean cuchillas de viento que ignoran defensa.',
            effect: 'pierce',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 20 },
                exp: 280,
                level: 4,
                rank: 'Genin',
                element: 'wind'
            }
        },
        {
            name: 'Futon: Daitoppa (Gran Brecha)',
            rank: 'C',
            chakra: 32,
            damage: 42,
            element: 'wind',
            description: 'Poderosa ráfaga de viento expulsada desde la boca.',
            effect: 'knockback',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 14 },
                exp: 170,
                level: 3,
                rank: 'Genin',
                element: 'wind'
            }
        },
        {
            name: 'Futon: Espada Invisible',
            rank: 'C',
            chakra: 36,
            damage: 46,
            element: 'wind',
            description: 'Chakra de viento moldea una espada invisible que corta todo.',
            effect: 'blade_wind',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 17 },
                exp: 250,
                level: 4,
                rank: 'Genin',
                element: 'wind'
            }
        },
        {
            name: 'Futon: Corriente Cortante',
            rank: 'C',
            chakra: 34,
            damage: 44,
            element: 'wind',
            description: 'Corriente de aire afilada que corta múltiples veces.',
            effect: 'blade_wind',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 16 },
                exp: 220,
                level: 3,
                rank: 'Genin',
                element: 'wind'
            }
        },

        // =============== RANGO B (5) ===============
        {
            name: 'Futon: Cuchillas Gemelas',
            rank: 'B',
            chakra: 55,
            damage: 72,
            element: 'wind',
            description: 'Dos enormes cuchillas de viento que atacan simultáneamente.',
            effect: 'blade_wind',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 22 },
                exp: 400,
                level: 6,
                rank: 'Chunin',
                element: 'wind'
            }
        },
        {
            name: 'Futon: Ōdama Rasengan (Rasengan Grande)',
            rank: 'B',
            chakra: 60,
            damage: 80,
            element: 'wind',
            description: 'Versión gigante del Rasengan con poder multiplicado.',
            effect: 'pierce',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 25 },
                exp: 500,
                level: 7,
                rank: 'Chunin',
                element: 'wind',
                prerequisiteJutsu: 'Futon: Rasengan'
            }
        },
        {
            name: 'Futon: Tornado',
            rank: 'B',
            chakra: 65,
            damage: 78,
            element: 'wind',
            description: 'AOE: Invoca un tornado masivo que arrasa el campo de batalla completo.',
            effect: 'aoe_knockback',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 28 },
                exp: 600,
                level: 8,
                rank: 'Chunin',
                element: 'wind'
            }
        },
        {
            name: 'Futon: Kamaitachi (Hoz de Viento)',
            rank: 'B',
            chakra: 58,
            damage: 75,
            element: 'wind',
            description: 'Viento concentrado en forma de guadaña invisible que causa heridas profundas.',
            effect: 'blade_wind',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 24 },
                exp: 480,
                level: 7,
                rank: 'Chunin',
                element: 'wind'
            }
        },
        {
            name: 'Futon: Remolino Cortante',
            rank: 'B',
            chakra: 62,
            damage: 76,
            element: 'wind',
            description: 'Múltiples corrientes de viento giratorias que cortan desde todos los ángulos.',
            effect: 'pierce',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 26 },
                exp: 550,
                level: 7,
                rank: 'Chunin',
                element: 'wind'
            }
        },

        // =============== RANGO A/S (4) ===============
        {
            name: 'Futon: Rasen-Shuriken',
            rank: 'A',
            chakra: 100,
            damage: 150,
            element: 'wind',
            description: '¡EL JUTSU MÁS PODEROSO DEL VIENTO! Rasengan con naturaleza de viento. Destrucción celular absoluta.',
            effect: 'pierce',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 35 },
                exp: 1000,
                level: 12,
                rank: 'Jonin',
                element: 'wind',
                prerequisiteJutsu: 'Futon: Ōdama Rasengan (Rasengan Grande)'
            },
            masterRequired: true,
            masterNote: 'Solo Naruto Uzumaki puede enseñar esta técnica (Costo: 10000 Ryo - el más caro del juego)'
        },
        {
            name: 'Futon: Tormenta Perfecta',
            rank: 'S',
            chakra: 110,
            damage: 170,
            element: 'wind',
            description: 'Técnica maestra: Desata una tormenta de viento que destruye todo a su paso.',
            effect: 'aoe_pierce',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 42 },
                exp: 1200,
                level: 13,
                rank: 'Kage',
                element: 'wind'
            },
            masterRequired: true,
            masterNote: 'Requiere dominio absoluto del viento y entrenamiento de maestros del Viento'
        },
        {
            name: 'Futon: Vacío Cortante',
            rank: 'A',
            chakra: 90,
            damage: 130,
            element: 'wind',
            description: 'Crea un vacío temporal que corta el espacio mismo. Ignora toda defensa.',
            effect: 'pierce',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 32 },
                exp: 800,
                level: 10,
                rank: 'Jonin',
                element: 'wind'
            }
        },
        {
            name: 'Futon: Huracán Devastador',
            rank: 'S',
            chakra: 120,
            damage: 190,
            element: 'wind',
            description: 'Técnica suprema: Un huracán de poder absoluto. El daño más alto del elemento viento.',
            effect: 'aoe_pierce',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 45 },
                exp: 1500,
                level: 15,
                rank: 'Kage',
                element: 'wind'
            },
            masterRequired: true,
            masterNote: 'Solo los maestros legendarios del Viento pueden dominar esta técnica'
        }
    ]
};
