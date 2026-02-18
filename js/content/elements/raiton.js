// Jutsus de Elemento Rayo (Raiton) - El Estilo del Rayo
export const raitonJutsus = {
    raiton: [
        // =============== RANGO D (5) ===============
        {
            name: 'Raiton: Descarga Estática',
            rank: 'D',
            chakra: 12,
            damage: 16,
            element: 'lightning',
            description: 'Pequeña descarga eléctrica que puede paralizar brevemente.',
            effect: 'paralyze',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 6 },
                exp: 30,
                level: 1,
                rank: 'Genin',
                element: 'lightning'
            }
        },
        {
            name: 'Raiton: Chispa',
            rank: 'D',
            chakra: 14,
            damage: 20,
            element: 'lightning',
            description: 'Chispa eléctrica concentrada que impacta con velocidad.',
            effect: 'speed_boost',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 8 },
                exp: 50,
                level: 1,
                rank: 'Genin',
                element: 'lightning'
            }
        },
        {
            name: 'Raiton: Corriente Menor',
            rank: 'D',
            chakra: 13,
            damage: 18,
            element: 'lightning',
            description: 'Corriente eléctrica que recorre el cuerpo del enemigo.',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 7 },
                exp: 45,
                level: 1,
                rank: 'Genin',
                element: 'lightning'
            }
        },
        {
            name: 'Raiton: Impulso Eléctrico',
            rank: 'D',
            chakra: 15,
            damage: 14,
            element: 'lightning',
            description: 'Aumenta la velocidad mediante estimulación eléctrica muscular.',
            effect: 'speed_boost',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 9 },
                exp: 60,
                level: 2,
                rank: 'Genin',
                element: 'lightning'
            }
        },
        {
            name: 'Raiton: Dardo Eléctrico',
            rank: 'D',
            chakra: 16,
            damage: 22,
            element: 'lightning',
            description: 'Proyectil de rayo puro. Velocidad y precisión absoluta.',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 10 },
                exp: 80,
                level: 2,
                rank: 'Genin',
                element: 'lightning'
            }
        },

        // =============== RANGO C (6) ===============
        {
            name: 'Raiton: Tajo de Rayo',
            rank: 'C',
            chakra: 35,
            damage: 44,
            element: 'lightning',
            description: 'Corte eléctrico que ignora defensas. Velocidad supersónica.',
            effect: 'pierce',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 15 },
                exp: 200,
                level: 3,
                rank: 'Genin',
                element: 'lightning'
            }
        },
        {
            name: 'Raiton: Chidori',
            rank: 'C',
            chakra: 40,
            damage: 60,
            element: 'lightning',
            description: '¡LA ESPADA RELÁMPAGO! Mil pájaros cantando. Poder devastador. Solo 2 usos por combate.',
            effect: 'pierce',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 18 },
                exp: 300,
                level: 4,
                rank: 'Genin',
                element: 'lightning'
            },
            masterRequired: true,
            masterNote: 'Requiere entrenamiento de Kakashi Hatake (Costo: 5000 Ryo)',
            specialEffect: {
                usesPerBattle: 2,
                reason: 'Daña la vista del usuario debido a la velocidad extrema'
            }
        },
        {
            name: 'Raiton: Tormenta Eléctrica',
            rank: 'C',
            chakra: 38,
            damage: 46,
            element: 'lightning',
            description: 'Rayos que saltan entre enemigos. Efecto en cadena devastador.',
            effect: 'chain_lightning',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 20 },
                exp: 280,
                level: 4,
                rank: 'Genin',
                element: 'lightning'
            }
        },
        {
            name: 'Raiton: Látigo de Rayo',
            rank: 'C',
            chakra: 32,
            damage: 40,
            element: 'lightning',
            description: 'Látigo eléctrico que aturde al enemigo con cada golpe.',
            effect: 'paralyze',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 14 },
                exp: 170,
                level: 3,
                rank: 'Genin',
                element: 'lightning'
            }
        },
        {
            name: 'Raiton: Pulso Electromagnético',
            rank: 'C',
            chakra: 34,
            damage: 38,
            element: 'lightning',
            description: 'Pulso de energía que sobrecarga los sistemas del enemigo.',
            effect: 'overclock',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 16 },
                exp: 220,
                level: 3,
                rank: 'Genin',
                element: 'lightning'
            }
        },
        {
            name: 'Raiton: Esfera del Trueno',
            rank: 'C',
            chakra: 36,
            damage: 42,
            element: 'lightning',
            description: 'Esfera eléctrica que electrocuta todo lo que toca.',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 17 },
                exp: 250,
                level: 4,
                rank: 'Genin',
                element: 'lightning'
            }
        },

        // =============== RANGO B (5) ===============
        {
            name: 'Raiton: Chidori Aguja',
            rank: 'B',
            chakra: 55,
            damage: 72,
            element: 'lightning',
            description: 'Evolución del Chidori: Múltiples agujas eléctricas de largo alcance.',
            effect: 'pierce',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 22 },
                exp: 400,
                level: 6,
                rank: 'Chunin',
                element: 'lightning',
                prerequisiteJutsu: 'Raiton: Chidori'
            }
        },
        {
            name: 'Raiton: Lanza del Cielo',
            rank: 'B',
            chakra: 60,
            damage: 78,
            element: 'lightning',
            description: 'Invoca un rayo desde el cielo que atraviesa al enemigo.',
            effect: 'pierce',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 25 },
                exp: 500,
                level: 7,
                rank: 'Chunin',
                element: 'lightning'
            }
        },
        {
            name: 'Raiton: Campo Electromagnético',
            rank: 'B',
            chakra: 65,
            damage: 70,
            element: 'lightning',
            description: 'AOE: Campo eléctrico que paraliza a todos los enemigos cercanos.',
            effect: 'aoe_paralyze',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 28 },
                exp: 600,
                level: 8,
                rank: 'Chunin',
                element: 'lightning'
            }
        },
        {
            name: 'Raiton: Cascada Eléctrica',
            rank: 'B',
            chakra: 58,
            damage: 75,
            element: 'lightning',
            description: 'Torrente de rayos que electrocuta todo a su paso.',
            effect: 'chain_lightning',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 24 },
                exp: 480,
                level: 7,
                rank: 'Chunin',
                element: 'lightning'
            }
        },
        {
            name: 'Raiton: Sobrecarga Total',
            rank: 'B',
            chakra: 62,
            damage: 76,
            element: 'lightning',
            description: 'Sobrecarga eléctrica: +50% velocidad y daño por 3 turnos.',
            effect: 'overclock',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 26 },
                exp: 550,
                level: 7,
                rank: 'Chunin',
                element: 'lightning'
            }
        },

        // =============== RANGO A/S (4) ===============
        {
            name: 'Raiton: Kirin',
            rank: 'A',
            chakra: 100,
            damage: 150,
            element: 'lightning',
            description: 'BESTIA DEL TRUENO: Invoca un dragón de rayo natural. Requiere tormenta. 1 uso por batalla.',
            effect: 'pierce',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 35 },
                exp: 1000,
                level: 11,
                rank: 'Jonin',
                element: 'lightning'
            },
            specialEffect: {
                requiresWeather: 'storm',
                usesPerBattle: 1,
                reason: 'Necesita condiciones climáticas específicas para invocar el rayo natural'
            }
        },
        {
            name: 'Raiton: Pantera Negra',
            rank: 'A',
            chakra: 90,
            damage: 130,
            element: 'lightning',
            description: 'Bestia de rayo que persigue y destruye al enemigo con velocidad imparable.',
            effect: 'chain_lightning',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 32 },
                exp: 800,
                level: 10,
                rank: 'Jonin',
                element: 'lightning'
            }
        },
        {
            name: 'Raiton: Jinraisen (Dios del Trueno)',
            rank: 'S',
            chakra: 110,
            damage: 170,
            element: 'lightning',
            description: 'Técnica maestra: Encarnación del dios del trueno. Poder divino eléctrico.',
            effect: 'overclock',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 42 },
                exp: 1200,
                level: 13,
                rank: 'Kage',
                element: 'lightning'
            },
            masterRequired: true,
            masterNote: 'Solo Killer B puede enseñar esta técnica del Raikage (Costo: 8000 Ryo)'
        },
        {
            name: 'Raiton: Apocalipsis del Rayo',
            rank: 'S',
            chakra: 120,
            damage: 190,
            element: 'lightning',
            description: 'Técnica suprema: Tormenta eléctrica absoluta. El daño más devastador del rayo.',
            effect: 'aoe_chain_lightning',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 45 },
                exp: 1500,
                level: 15,
                rank: 'Kage',
                element: 'lightning'
            },
            masterRequired: true,
            masterNote: 'Solo los maestros legendarios del Rayo pueden dominar esta técnica'
        }
    ]
};
