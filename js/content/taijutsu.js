// Jutsus de Taijutsu - Sistema de Artes Marciales Ninja
export const taijutsuJutsus = {
    taijutsu: [
        // =============== RANGO D (6) ===============
        {
            name: 'Puño Básico Ninja',
            rank: 'D',
            chakra: 8,
            damage: 10,
            element: null,
            description: 'Fundamental del Taijutsu: un puñetazo directo y efectivo.',
            learnMethod: 'auto',
            requirements: {
                stats: { taijutsu: 5 },
                exp: 30,
                level: 1,
                rank: 'Genin',
                element: null
            }
        },
        {
            name: 'Patada Giratoria',
            rank: 'D',
            chakra: 10,
            damage: 15,
            element: null,
            description: 'Patada de 360° que golpea con fuerza centrífuga.',
            learnMethod: 'auto',
            requirements: {
                stats: { taijutsu: 8 },
                exp: 45,
                level: 1,
                rank: 'Genin',
                element: null
            }
        },
        {
            name: 'Golpe de Puño Reforzado',
            rank: 'D',
            chakra: 9,
            damage: 12,
            element: null,
            description: 'Refuerzas tu puño con chakra para mayor impacto.',
            learnMethod: 'auto',
            requirements: {
                stats: { taijutsu: 6 },
                exp: 40,
                level: 1,
                rank: 'Genin',
                element: null
            }
        },
        {
            name: 'Barrida de Piernas',
            rank: 'D',
            chakra: 10,
            damage: 14,
            element: null,
            description: 'Derriba al enemigo barriendo sus piernas.',
            effect: 'stun',
            learnMethod: 'auto',
            requirements: {
                stats: { taijutsu: 7 },
                exp: 50,
                level: 1,
                rank: 'Genin',
                element: null
            }
        },
        {
            name: 'Bloqueo Defensivo',
            rank: 'D',
            chakra: 8,
            damage: 0,
            element: null,
            description: 'Técnica defensiva para minimizar daño entrante.',
            effect: 'defense',
            learnMethod: 'auto',
            requirements: {
                stats: { taijutsu: 5 },
                exp: 35,
                level: 1,
                rank: 'Genin',
                element: null
            }
        },
        {
            name: 'Puñetazo Rápido',
            rank: 'D',
            chakra: 11,
            damage: 16,
            element: null,
            description: 'Series de puños rápidos que sorprenden al enemigo.',
            learnMethod: 'auto',
            requirements: {
                stats: { taijutsu: 9 },
                exp: 55,
                level: 2,
                rank: 'Genin',
                element: null
            }
        },

        // =============== RANGO C (6) ===============
        {
            name: 'Danza del Loto',
            rank: 'C',
            chakra: 35,
            damage: 40,
            element: null,
            description: 'Técnica legendaria de el "Genio de Konoha": giros violentos y golpes destructivos. Estilo de Rock Lee.',
            effect: 'spin',
            learnMethod: 'auto',
            requirements: {
                stats: { taijutsu: 15 },
                exp: 150,
                level: 4,
                rank: 'Genin',
                element: null
            }
        },
        {
            name: 'Karate Ninja',
            rank: 'C',
            chakra: 28,
            damage: 28,
            element: null,
            description: 'Técnica de golpes precisos con ambas manos, especialmente de Kurenai.',
            learnMethod: 'auto',
            requirements: {
                stats: { taijutsu: 12 },
                exp: 120,
                level: 3,
                rank: 'Genin',
                element: null
            }
        },
        {
            name: 'Puño de Roca',
            rank: 'C',
            chakra: 38,
            damage: 45,
            element: null,
            description: 'Potencial bruto: puño reforzado que rompe defensas como roca.',
            learnMethod: 'auto',
            requirements: {
                stats: { taijutsu: 18 },
                exp: 180,
                level: 4,
                rank: 'Genin',
                element: null
            }
        },
        {
            name: 'Jyuken - Golpe de 2 Dedos',
            rank: 'C',
            chakra: 32,
            damage: 35,
            element: null,
            description: 'Técnica de los Hyuga: puntos de presión vitales con dos dedos. Perfecta para cerrajes de chakra.',
            effect: 'seal',
            learnMethod: 'auto',
            requirements: {
                stats: { taijutsu: 15 },
                exp: 140,
                level: 3,
                rank: 'Genin',
                element: null
            }
        },
        {
            name: 'Tsuuga - Colmillo Rotatorio',
            rank: 'C',
            chakra: 34,
            damage: 38,
            element: null,
            description: 'Técnica de los Inuzuka: rotación feroz como el colmillo de una bestia.',
            effect: 'spin',
            learnMethod: 'auto',
            requirements: {
                stats: { taijutsu: 16 },
                exp: 160,
                level: 4,
                rank: 'Genin',
                element: null
            }
        },
        {
            name: 'Combo de Piernas',
            rank: 'C',
            chakra: 30,
            damage: 32,
            element: null,
            description: 'Series coordinadas de patadas que acortan la distancia.',
            learnMethod: 'auto',
            requirements: {
                stats: { taijutsu: 14 },
                exp: 130,
                level: 3,
                rank: 'Genin',
                element: null
            }
        },

        // =============== RANGO B (5) ===============
        {
            name: 'Danza del Loto: Primaria',
            rank: 'B',
            chakra: 55,
            damage: 55,
            element: null,
            description: 'Evolución de la Danza del Loto: mayor velocidad y poder devastador.',
            effect: 'spin',
            learnMethod: 'auto',
            requirements: {
                stats: { taijutsu: 22 },
                exp: 450,
                level: 7,
                rank: 'Chunin',
                element: null,
                prerequisiteJutsu: 'Danza del Loto'
            }
        },
        {
            name: 'Ocho Puertas - Nivel 1: Puerta de Apertura',
            rank: 'B',
            chakra: 50,
            damage: 60,
            element: null,
            description: 'Abre la primera puerta chakra: +30% daño por 3 turnos, -10 HP al terminar.',
            effect: 'gates_1',
            learnMethod: 'auto',
            requirements: {
                stats: { taijutsu: 25 },
                exp: 500,
                level: 8,
                rank: 'Chunin',
                element: null
            },
            specialEffect: {
                gatesLevel: 1,
                damageBoost: 0.30,
                duration: 3,
                hpCost: 10,
                description: 'Aumenta velocidad y poder de golpes'
            }
        },
        {
            name: 'Palmada Definitiva',
            rank: 'B',
            chakra: 48,
            damage: 50,
            element: null,
            description: 'Golpe de palma concentrado que proyecta chakra a distancia.',
            effect: 'projectile',
            learnMethod: 'auto',
            requirements: {
                stats: { taijutsu: 20 },
                exp: 420,
                level: 7,
                rank: 'Chunin',
                element: null
            }
        },
        {
            name: 'Patada de Tornado',
            rank: 'B',
            chakra: 52,
            damage: 52,
            element: null,
            description: 'Patada giratoria aumentada: crea onda de aire que golpea el área.',
            effect: 'aoe',
            learnMethod: 'auto',
            requirements: {
                stats: { taijutsu: 21 },
                exp: 460,
                level: 7,
                rank: 'Chunin',
                element: null
            }
        },
        {
            name: 'Rompedor de Huesos',
            rank: 'B',
            chakra: 58,
            damage: 58,
            element: null,
            description: 'Golpe especializado en fracturar y debilitar la estructura física.',
            effect: 'weaken',
            learnMethod: 'auto',
            requirements: {
                stats: { taijutsu: 23 },
                exp: 520,
                level: 8,
                rank: 'Chunin',
                element: null
            }
        },

        // =============== RANGO A/S (3) ===============
        {
            name: 'Ocho Puertas - Nivel 2: Puerta de Reparación',
            rank: 'A',
            chakra: 75,
            damage: 90,
            element: null,
            description: 'Segunda puerta: +60% daño por 5 turnos, -30 HP al terminar. Daño devastador.',
            effect: 'gates_2',
            learnMethod: 'auto',
            requirements: {
                stats: { taijutsu: 35 },
                exp: 1500,
                level: 12,
                rank: 'Jonin',
                element: null,
                prerequisiteJutsu: 'Ocho Puertas - Nivel 1: Puerta de Apertura'
            },
            specialEffect: {
                gatesLevel: 2,
                damageBoost: 0.60,
                duration: 5,
                hpCost: 30,
                description: 'Fuerza extraordinaria, movimiento acelerado'
            }
        },
        {
            name: 'Ocho Puertas - Nivel 3: Puerta de Vida',
            rank: 'S',
            chakra: 100,
            damage: 150,
            element: null,
            description: 'PELIGROSO: Tercera puerta + poder supremo. +100% daño por 7 turnos, -80 HP al terminar. ⚠️ 20% riesgo de quedar a 1 HP.',
            effect: 'gates_3',
            learnMethod: 'auto',
            requirements: {
                stats: { taijutsu: 45 },
                exp: 3000,
                level: 16,
                rank: 'Kage',
                element: null,
                prerequisiteJutsu: 'Ocho Puertas - Nivel 2: Puerta de Reparación'
            },
            specialEffect: {
                gatesLevel: 3,
                damageBoost: 1.00,
                duration: 7,
                hpCost: 80,
                riskFailure: 0.20,
                riskEffect: 'setTo1HP',
                description: 'Poder abrumador. RIESGO: vida en peligro'
            }
        },
        {
            name: 'Ataque Divino',
            rank: 'A',
            chakra: 70,
            damage: 85,
            element: null,
            description: 'Técnica de poder absoluto: fusión perfecta de velocidad y fuerza.',
            effect: 'divine',
            learnMethod: 'auto',
            requirements: {
                stats: { taijutsu: 32 },
                exp: 1200,
                level: 11,
                rank: 'Jonin',
                element: null
            }
        }
    ]
};
