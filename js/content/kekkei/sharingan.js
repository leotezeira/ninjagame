// Jutsus Exclusivos del Sharingan - Kekkei Genkai del Clan Uchiha
export const sharinganJutsus = {
    sharingan: [
        // =============== SHARINGAN NIVEL 1 (1 Aspa) ===============
        {
            name: 'Sharingan: Copia de Jutsu',
            rank: 'C',
            chakra: 0,
            damage: 0,
            type: 'kekkei',
            description: 'PASIVO: Habilidad automática del Sharingan. Puede copiar jutsus del enemigo durante el combate.',
            effect: 'copy_jutsu_passive',
            learnMethod: 'auto',
            requirements: {
                stats: { genjutsu: 10 },
                exp: 100,
                level: 3,
                rank: 'Genin',
                kekkei_genkai: 'sharingan',
                KG_level: 1
            },
            specialEffect: {
                passive: true,
                description: 'Posibilidad de copiar jutsus enemigos al verlos en combate'
            }
        },
        {
            name: 'Sharingan: Predicción',
            rank: 'C',
            chakra: 25,
            damage: 0,
            type: 'kekkei',
            description: 'Lee los movimientos del enemigo con el Sharingan. +20% evasión por 3 turnos.',
            effect: 'evasion_boost',
            learnMethod: 'auto',
            requirements: {
                stats: { genjutsu: 10 },
                exp: 150,
                level: 3,
                rank: 'Genin',
                kekkei_genkai: 'sharingan',
                KG_level: 1
            },
            specialEffect: {
                duration: 3,
                evasionBoost: 20
            }
        },
        {
            name: 'Sharingan: Reflejo Visual',
            rank: 'C',
            chakra: 20,
            damage: 30,
            type: 'kekkei',
            description: 'Copia el movimiento del enemigo y lo refleja instantáneamente.',
            effect: 'mirror_attack',
            learnMethod: 'auto',
            requirements: {
                stats: { genjutsu: 12 },
                exp: 180,
                level: 4,
                rank: 'Genin',
                kekkei_genkai: 'sharingan',
                KG_level: 1
            }
        },

        // =============== SHARINGAN NIVEL 2 (2 Aspas) ===============
        {
            name: 'Sharingan: Hipnosis',
            rank: 'B',
            chakra: 40,
            damage: 25,
            type: 'kekkei',
            description: 'Genjutsu automático del Sharingan. Inmoviliza al enemigo durante 2 turnos.',
            effect: 'stun',
            learnMethod: 'auto',
            requirements: {
                stats: { genjutsu: 15 },
                exp: 300,
                level: 5,
                rank: 'Chunin',
                kekkei_genkai: 'sharingan',
                KG_level: 2
            },
            specialEffect: {
                duration: 2,
                description: 'Contacto visual con el Sharingan paraliza la mente'
            }
        },
        {
            name: 'Sharingan: Análisis de Combate',
            rank: 'B',
            chakra: 0,
            damage: 0,
            type: 'kekkei',
            description: 'PASIVO: El Sharingan analiza patrones de lucha. +10% daño contra enemigos enfrentados previamente.',
            effect: 'combat_analysis_passive',
            learnMethod: 'auto',
            requirements: {
                stats: { genjutsu: 16 },
                exp: 350,
                level: 6,
                rank: 'Chunin',
                kekkei_genkai: 'sharingan',
                KG_level: 2
            },
            specialEffect: {
                passive: true,
                damageBoost: 10,
                description: 'Aumenta daño contra enemigos conocidos'
            }
        },
        {
            name: 'Sharingan: Lectura de Movimientos',
            rank: 'B',
            chakra: 35,
            damage: 0,
            type: 'kekkei',
            description: 'Predice los próximos 3 movimientos del enemigo. Evasión perfecta por 2 turnos.',
            effect: 'perfect_evasion',
            learnMethod: 'auto',
            requirements: {
                stats: { genjutsu: 18 },
                exp: 400,
                level: 6,
                rank: 'Chunin',
                kekkei_genkai: 'sharingan',
                KG_level: 2
            },
            specialEffect: {
                duration: 2,
                evasionBoost: 100
            }
        },
        {
            name: 'Sharingan: Control Mental',
            rank: 'B',
            chakra: 45,
            damage: 35,
            type: 'kekkei',
            description: 'Controla brevemente la mente del enemigo, haciéndolo atacar aire.',
            effect: 'confuse',
            learnMethod: 'auto',
            requirements: {
                stats: { genjutsu: 20 },
                exp: 450,
                level: 7,
                rank: 'Chunin',
                kekkei_genkai: 'sharingan',
                KG_level: 2
            }
        },

        // =============== SHARINGAN NIVEL 3 (3 Aspas) ===============
        {
            name: 'Sharingan: Gran Ilusión',
            rank: 'A',
            chakra: 60,
            damage: 40,
            type: 'kekkei',
            description: 'Genjutsu poderoso que sumerge al enemigo en un sueño profundo durante 3 turnos.',
            effect: 'sleep',
            learnMethod: 'auto',
            requirements: {
                stats: { genjutsu: 20 },
                exp: 600,
                level: 8,
                rank: 'Jonin',
                kekkei_genkai: 'sharingan',
                KG_level: 3
            },
            specialEffect: {
                duration: 3,
                description: 'Sueño profundo inducido por Sharingan'
            }
        },
        {
            name: 'Sharingan: Clonación de Estilo',
            rank: 'A',
            chakra: 55,
            damage: 50,
            type: 'kekkei',
            description: 'Copia el estilo de lucha completo del enemigo y lo usa contra él.',
            effect: 'style_copy',
            learnMethod: 'auto',
            requirements: {
                stats: { genjutsu: 22, ninjutsu: 20 },
                exp: 650,
                level: 9,
                rank: 'Jonin',
                kekkei_genkai: 'sharingan',
                KG_level: 3
            }
        },
        {
            name: 'Amaterasu Menor',
            rank: 'A',
            chakra: 70,
            damage: 65,
            type: 'kekkei',
            description: 'Versión inicial de las llamas negras. Queman sin parar hasta ser curadas. 1 uso por batalla.',
            effect: 'burn_permanent',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 25 },
                exp: 700,
                level: 9,
                rank: 'Jonin',
                kekkei_genkai: 'sharingan',
                KG_level: 3
            },
            specialEffect: {
                usesPerBattle: 1,
                burnDamage: 20,
                description: 'Llamas negras que no se apagan con métodos normales'
            }
        },

        // =============== MANGEKYŌ SHARINGAN (Nivel 4+) ===============
        {
            name: 'Amaterasu',
            rank: 'S',
            chakra: 100,
            damage: 90,
            type: 'kekkei',
            description: 'LLAMAS ETERNAS: Fuego negro que arde por 7 días. No se apaga con agua. Quema todo.',
            effect: 'burn_permanent',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 35 },
                exp: 1000,
                level: 11,
                rank: 'Jonin',
                kekkei_genkai: 'sharingan',
                KG_level: 4
            },
            specialEffect: {
                burnDamage: 30,
                cantExtinguish: true,
                description: 'Llamas del infierno que no se apagan nunca'
            }
        },
        {
            name: 'Tsukuyomi',
            rank: 'S',
            chakra: 110,
            damage: 50,
            type: 'kekkei',
            description: 'GENJUTSU SUPREMO: Atrapa al enemigo en ilusión absoluta. Stun total por 5 turnos. 1 uso por batalla.',
            effect: 'stun_total',
            learnMethod: 'auto',
            requirements: {
                stats: { genjutsu: 38 },
                exp: 1200,
                level: 12,
                rank: 'Jonin',
                kekkei_genkai: 'sharingan',
                KG_level: 4
            },
            specialEffect: {
                duration: 5,
                usesPerBattle: 1,
                description: 'En el mundo del Tsukuyomi, el tiempo y espacio pertenecen al usuario'
            }
        },
        {
            name: 'Susano\'o',
            rank: 'S',
            chakra: 150,
            damage: 80,
            type: 'kekkei',
            description: 'GUERRERO DE CHAKRA: Armadura gigante de energía. +100% defensa + contraataque automático por 5 turnos.',
            effect: 'susanoo_armor',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 40, taijutsu: 30 },
                exp: 1500,
                level: 13,
                rank: 'Kage',
                kekkei_genkai: 'sharingan',
                KG_level: 4
            },
            specialEffect: {
                duration: 5,
                defenseBoost: 100,
                counterAttack: true,
                description: 'Manifestación del poder del Mangekyō'
            }
        },
        {
            name: 'Kamui',
            rank: 'S',
            chakra: 120,
            damage: 0,
            type: 'kekkei',
            description: 'DIMENSIÓN KAMUI: Absorbe ataques o escapa con teletransportación. 100% éxito, 0 pérdida de reputación.',
            effect: 'kamui_warp',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 42 },
                exp: 1400,
                level: 13,
                rank: 'Kage',
                kekkei_genkai: 'sharingan',
                KG_level: 4
            },
            specialEffect: {
                absorbAttack: true,
                escapeChance: 100,
                reputationLoss: 0,
                description: 'Manipulación del espacio-tiempo'
            }
        },
        {
            name: 'Kagutsuchi',
            rank: 'S',
            chakra: 90,
            damage: 100,
            type: 'kekkei',
            description: 'Control de Amaterasu: Moldea las llamas negras en formas ofensivas. AOE devastador.',
            effect: 'aoe_burn_permanent',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 38 },
                exp: 1300,
                level: 12,
                rank: 'Kage',
                kekkei_genkai: 'sharingan',
                KG_level: 4,
                prerequisiteJutsu: 'Amaterasu'
            },
            specialEffect: {
                burnDamage: 35,
                aoe: true,
                description: 'Control absoluto sobre las llamas de Amaterasu'
            }
        }
    ]
};
