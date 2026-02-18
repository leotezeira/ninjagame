// Jutsus de Genjutsu - Ilusiones y Control Mental
export const genjutsuJutsus = {
    genjutsu: [
        // =============== RANGO D (6) ===============
        {
            name: 'Genjutsu Básico',
            rank: 'D',
            chakra: 12,
            damage: 0,
            element: null,
            description: 'Ilusión simple que desconcierta al enemigo por un turno.',
            effect: 'stun',
            learnMethod: 'auto',
            requirements: {
                stats: { genjutsu: 5 },
                exp: 30,
                level: 1,
                rank: 'Genin',
                element: null
            }
        },
        {
            name: 'Ilusión de Kunai',
            rank: 'D',
            chakra: 14,
            damage: 0,
            element: null,
            description: 'El enemigo cree que recibe un ataque y se defiende del enemigo equivocado.',
            effect: 'confuse',
            learnMethod: 'auto',
            requirements: {
                stats: { genjutsu: 8 },
                exp: 50,
                level: 1,
                rank: 'Genin',
                element: null
            }
        },
        {
            name: 'Espejo Falso',
            rank: 'D',
            chakra: 11,
            damage: 0,
            element: null,
            description: 'Crea una imagen especular confusa que desorienta.',
            effect: 'stun',
            learnMethod: 'auto',
            requirements: {
                stats: { genjutsu: 6 },
                exp: 40,
                level: 1,
                rank: 'Genin',
                element: null
            }
        },
        {
            name: 'Ilusión de Sombra',
            rank: 'D',
            chakra: 13,
            damage: 0,
            element: null,
            description: 'Las sombras se mueven de forma amenazante, asustando al objetivo.',
            effect: 'fear',
            learnMethod: 'auto',
            requirements: {
                stats: { genjutsu: 7 },
                exp: 45,
                level: 1,
                rank: 'Genin',
                element: null
            }
        },
        {
            name: 'Relámpago Ilusorio',
            rank: 'D',
            chakra: 15,
            damage: 0,
            element: null,
            description: 'El enemigo cree ver relámpagos que lo paralizan momentáneamente.',
            effect: 'stun',
            learnMethod: 'auto',
            requirements: {
                stats: { genjutsu: 9 },
                exp: 55,
                level: 1,
                rank: 'Genin',
                element: null
            }
        },
        {
            name: 'Trampa de Ilusión',
            rank: 'D',
            chakra: 16,
            damage: 0,
            element: null,
            description: 'Crea un entorno ilusorio que atrapa la mente del enemigo.',
            effect: 'confuse',
            learnMethod: 'auto',
            requirements: {
                stats: { genjutsu: 9 },
                exp: 60,
                level: 2,
                rank: 'Genin',
                element: null
            }
        },

        // =============== RANGO C (6) ===============
        {
            name: 'Nehan Shouja no Jutsu',
            rank: 'C',
            chakra: 40,
            damage: 0,
            element: null,
            description: 'Genjutsu masivo que hace dormir múltiples enemigos simultáneamente.',
            effect: 'sleep_mass',
            learnMethod: 'auto',
            requirements: {
                stats: { genjutsu: 12 },
                exp: 120,
                level: 3,
                rank: 'Genin',
                element: null
            }
        },
        {
            name: 'Magen: Narakumi no Jutsu',
            rank: 'C',
            chakra: 35,
            damage: 0,
            element: null,
            description: 'Ilusión infernal: el enemigo siente miedo abrumador y no puede usar jutsus poderosos.',
            effect: 'fear',
            learnMethod: 'auto',
            requirements: {
                stats: { genjutsu: 15 },
                exp: 150,
                level: 4,
                rank: 'Genin',
                element: null
            }
        },
        {
            name: 'Ilusión de Lluvia Ácida',
            rank: 'C',
            chakra: 32,
            damage: 0,
            element: null,
            description: 'El enemigo cree estar lloviendo ácido, reduciendo su precisión drásticamente.',
            effect: 'blind',
            learnMethod: 'auto',
            requirements: {
                stats: { genjutsu: 13 },
                exp: 130,
                level: 3,
                rank: 'Genin',
                element: null
            }
        },
        {
            name: 'Magen: Espejo de Pesadillas',
            rank: 'C',
            chakra: 38,
            damage: 0,
            element: null,
            description: 'El enemigo ve sus peores miedos reflejados, confundiéndolo completamente.',
            effect: 'confuse',
            learnMethod: 'auto',
            requirements: {
                stats: { genjutsu: 14 },
                exp: 140,
                level: 3,
                rank: 'Genin',
                element: null
            }
        },
        {
            name: 'Ilusión: Debilitamiento Mental',
            rank: 'C',
            chakra: 36,
            damage: 0,
            element: null,
            description: 'Disminuye temporalmente la fuerza y defensa del enemigo mediante ilusión.',
            effect: 'stat_down',
            learnMethod: 'auto',
            requirements: {
                stats: { genjutsu: 11 },
                exp: 110,
                level: 3,
                rank: 'Genin',
                element: null
            }
        },

        // =============== RANGO B (5) ===============
        {
            name: 'Genjutsu de la Niebla Roja',
            rank: 'B',
            chakra: 55,
            damage: 0,
            element: null,
            description: 'Una densa niebla roja que ciega completamente la visión del enemigo.',
            effect: 'blind',
            learnMethod: 'auto',
            requirements: {
                stats: { genjutsu: 20 },
                exp: 450,
                level: 7,
                rank: 'Chunin',
                element: null
            }
        },
        {
            name: 'Genjutsu: Lluvia de Shuriken',
            rank: 'B',
            chakra: 52,
            damage: 0,
            element: null,
            description: 'Lluvia de shuriken ilusorios que hacen creer al enemigo que recibe daño constante.',
            effect: 'illusion_damage',
            learnMethod: 'auto',
            requirements: {
                stats: { genjutsu: 22 },
                exp: 500,
                level: 7,
                rank: 'Chunin',
                element: null
            }
        },
        {
            name: 'Magen: Kyoka Suigetsu',
            rank: 'B',
            chakra: 50,
            damage: 0,
            element: null,
            description: 'Ilusión de agua: hace desaparecer al usuario en un espejo de agua, confundiendo al enemigo.',
            effect: 'confuse',
            learnMethod: 'auto',
            requirements: {
                stats: { genjutsu: 18 },
                exp: 400,
                level: 6,
                rank: 'Chunin',
                element: null
            }
        },
        {
            name: 'Sueño Temporal',
            rank: 'B',
            chakra: 48,
            damage: 0,
            element: null,
            description: 'Hunde al enemigo en un sueño profundo del cual le cuesta despertar.',
            effect: 'sleep',
            learnMethod: 'auto',
            requirements: {
                stats: { genjutsu: 19 },
                exp: 420,
                level: 6,
                rank: 'Chunin',
                element: null
            }
        },
        {
            name: 'Magen: Demonio de las Mil Caras',
            rank: 'B',
            chakra: 58,
            damage: 0,
            element: null,
            description: 'Innumerables ilusiones del enemigo debilitan su mente y fuerza.',
            effect: 'stat_down',
            learnMethod: 'auto',
            requirements: {
                stats: { genjutsu: 21 },
                exp: 480,
                level: 7,
                rank: 'Chunin',
                element: null
            }
        },

        // =============== RANGO A/S (2) ===============
        {
            name: 'Tsukuyomi Menor (Ilusión Temporal)',
            rank: 'A',
            chakra: 85,
            damage: 0,
            element: null,
            description: 'Ilusión de tiempo: el enemigo siente que han pasado horas aunque es solo un instante. Paralizante.',
            effect: 'stun_extended',
            learnMethod: 'auto',
            requirements: {
                stats: { genjutsu: 30 },
                exp: 1400,
                level: 10,
                rank: 'Jonin',
                element: null
            },
            specialEffect: {
                stunDuration: 3,
                description: 'Parálisis por 3 turnos mediante ilusión temporal'
            }
        },
        {
            name: 'Kokuangyou no Jutsu',
            rank: 'A',
            chakra: 95,
            damage: 0,
            element: null,
            description: 'Ilusión total: ceguera completa combinada con miedo absoluto. El enemigo no puede ver ni moverse.',
            effect: 'blind_fear_combo',
            learnMethod: 'auto',
            requirements: {
                stats: { genjutsu: 28 },
                exp: 1300,
                level: 9,
                rank: 'Jonin',
                element: null
            },
            specialEffect: {
                blind: true,
                fear: true,
                duration: 3,
                description: 'Ceguera total combinada con miedo al enemigo'
            }
        }
    ]
};
