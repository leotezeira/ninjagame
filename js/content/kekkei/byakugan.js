// Jutsus Exclusivos del Byakugan - Kekkei Genkai del Clan Hyuga
export const byakuganJutsus = {
    byakugan: [
        // =============== BYAKUGAN NIVEL 1 (Básico) ===============
        {
            name: 'Jyuken: Golpe Gentil',
            rank: 'C',
            chakra: 25,
            damage: 35,
            type: 'kekkei',
            description: 'Golpe de palma del Jyuken que daña los puntos de chakra del enemigo.',
            effect: 'chakra_drain',
            learnMethod: 'auto',
            requirements: {
                stats: { taijutsu: 10 },
                exp: 150,
                level: 3,
                rank: 'Genin',
                kekkei_genkai: 'byakugan',
                KG_level: 1
            },
            specialEffect: {
                chakraDrain: 20,
                description: 'Roba 20 chakra del enemigo al impactar'
            }
        },
        {
            name: 'Hakke Rokujūyon Shō - Mini',
            rank: 'C',
            chakra: 30,
            damage: 45,
            type: 'kekkei',
            description: '8 golpes rápidos de Jyuken. Versión inicial de la técnica Hyuga.',
            effect: '8_palms',
            learnMethod: 'auto',
            requirements: {
                stats: { taijutsu: 15 },
                exp: 200,
                level: 4,
                rank: 'Genin',
                kekkei_genkai: 'byakugan',
                KG_level: 1
            },
            specialEffect: {
                hits: 8,
                damagePerHit: 6,
                description: '8 golpes consecutivos'
            }
        },
        {
            name: 'Byakugan: Visión Total',
            rank: 'C',
            chakra: 0,
            damage: 0,
            type: 'kekkei',
            description: 'PASIVO: Visión de 360° del Byakugan. No puede ser sorprendido. +15% evasión.',
            effect: 'vision_360_passive',
            learnMethod: 'auto',
            requirements: {
                stats: { taijutsu: 12 },
                exp: 180,
                level: 3,
                rank: 'Genin',
                kekkei_genkai: 'byakugan',
                KG_level: 1
            },
            specialEffect: {
                passive: true,
                evasionBoost: 15,
                description: 'Visión omnidireccional permanente'
            }
        },
        {
            name: 'Byakugan: Lectura de Chakra',
            rank: 'C',
            chakra: 20,
            damage: 0,
            type: 'kekkei',
            description: 'El Byakugan ve el sistema de chakra enemigo. Revela puntos débiles.',
            effect: 'chakra_vision',
            learnMethod: 'auto',
            requirements: {
                stats: { taijutsu: 13 },
                exp: 170,
                level: 3,
                rank: 'Genin',
                kekkei_genkai: 'byakugan',
                KG_level: 1
            },
            specialEffect: {
                duration: 3,
                critBoost: 20,
                description: 'Aumenta probabilidad de crítico al ver puntos vitales'
            }
        },

        // =============== BYAKUGAN NIVEL 2 (Intermedio) ===============
        {
            name: 'Jyuken: Palma Vacía',
            rank: 'B',
            chakra: 40,
            damage: 55,
            type: 'kekkei',
            description: 'Golpe Jyuken que sella temporalmente un punto de chakra del enemigo.',
            effect: 'tenketsu_seal',
            learnMethod: 'auto',
            requirements: {
                stats: { taijutsu: 20 },
                exp: 400,
                level: 6,
                rank: 'Chunin',
                kekkei_genkai: 'byakugan',
                KG_level: 2
            },
            specialEffect: {
                duration: 2,
                description: 'Sella puntos de chakra por 2 turnos, reduciendo chakra máximo temporalmente'
            }
        },
        {
            name: 'Hakke Rokujūyon Shō (64 Palmas)',
            rank: 'B',
            chakra: 55,
            damage: 80,
            type: 'kekkei',
            description: '¡LA TÉCNICA ICÓNICA HYUGA! 64 golpes que sellan 64 puntos de chakra.',
            effect: '64_palms',
            learnMethod: 'auto',
            requirements: {
                stats: { taijutsu: 22 },
                exp: 450,
                level: 7,
                rank: 'Chunin',
                kekkei_genkai: 'byakugan',
                KG_level: 2
            },
            specialEffect: {
                hits: 64,
                damagePerHit: 1.25,
                chakraDrain: 40,
                description: '64 golpes consecutivos que sellan puntos de chakra'
            }
        },
        {
            name: 'Hakke Kūshō (Palma de Vacío)',
            rank: 'B',
            chakra: 45,
            damage: 60,
            type: 'kekkei',
            description: 'Onda de chakra invisible lanzada desde la palma. Ataque a distancia del Jyuken.',
            effect: 'ranged_palm',
            learnMethod: 'auto',
            requirements: {
                stats: { taijutsu: 18 },
                exp: 350,
                level: 6,
                rank: 'Chunin',
                kekkei_genkai: 'byakugan',
                KG_level: 2
            },
            specialEffect: {
                range: 'medium',
                description: 'Ataque Jyuken de medio alcance'
            }
        },
        {
            name: 'Byakugan: Punto Ciego Sellado',
            rank: 'B',
            chakra: 50,
            damage: 0,
            type: 'kekkei',
            description: 'Entrena para eliminar el punto ciego del Byakugan. Evasión perfecta por 2 turnos.',
            effect: 'perfect_vision',
            learnMethod: 'auto',
            requirements: {
                stats: { taijutsu: 24 },
                exp: 500,
                level: 7,
                rank: 'Chunin',
                kekkei_genkai: 'byakugan',
                KG_level: 2
            },
            specialEffect: {
                duration: 2,
                evasionBoost: 100,
                description: 'Elimina el punto ciego temporal'
            }
        },

        // =============== BYAKUGAN NIVEL 3 (Avanzado) ===============
        {
            name: 'Hakke Hyakunijūhachi Shō (128 Palmas)',
            rank: 'A',
            chakra: 70,
            damage: 120,
            type: 'kekkei',
            description: 'Evolución suprema: 128 golpes devastadores. Paraliza al enemigo tras el combo.',
            effect: '128_palms',
            learnMethod: 'auto',
            requirements: {
                stats: { taijutsu: 28 },
                exp: 700,
                level: 9,
                rank: 'Jonin',
                kekkei_genkai: 'byakugan',
                KG_level: 3
            },
            specialEffect: {
                hits: 128,
                damagePerHit: 0.95,
                chakraDrain: 60,
                stunDuration: 1,
                description: '128 golpes que sellan casi todos los puntos de chakra'
            }
        },
        {
            name: 'Jyuken: Hakkeshō Kaiten (Rotación de los 8 Trigramas)',
            rank: 'A',
            chakra: 60,
            damage: 70,
            type: 'kekkei',
            description: 'Defensa absoluta: Rotación que repele todos los ataques físicos y proyectiles.',
            effect: 'kaiten_defense',
            learnMethod: 'auto',
            requirements: {
                stats: { taijutsu: 26 },
                exp: 650,
                level: 8,
                rank: 'Jonin',
                kekkei_genkai: 'byakugan',
                KG_level: 3
            },
            specialEffect: {
                duration: 3,
                reflection: 50,
                description: 'Refleja 50% del daño recibido mientras rota'
            }
        },

        // =============== TENSEIGAN (Evolución Máxima) ===============
        {
            name: 'Tenseigan Chakra Mode',
            rank: 'S',
            chakra: 150,
            damage: 0,
            type: 'kekkei',
            description: 'MODO DEL DIOS LUNAR: Envuelto en chakra celestial. +80 a todos los stats por 5 turnos.',
            effect: 'tenseigan_mode',
            learnMethod: 'auto',
            requirements: {
                stats: { taijutsu: 35 },
                exp: 1200,
                level: 13,
                rank: 'Kage',
                kekkei_genkai: 'byakugan',
                KG_level: 4
            },
            specialEffect: {
                duration: 5,
                allStatsBoost: 80,
                description: 'Modo supremo del Tenseigan - poder del dios lunar'
            }
        },
        {
            name: 'Ginrin Tensei Bakuhatsu (Fuerza del Dios Lunar)',
            rank: 'S',
            chakra: 120,
            damage: 180,
            type: 'kekkei',
            description: 'TÉCNICA SUPREMA: Energía celestial concentrada. Daño masivo. Solo usable en Tenseigan Mode.',
            effect: 'tenseigan_strike',
            learnMethod: 'auto',
            requirements: {
                stats: { taijutsu: 40 },
                exp: 1500,
                level: 15,
                rank: 'Kage',
                kekkei_genkai: 'byakugan',
                KG_level: 4
            },
            specialEffect: {
                requiresMode: 'tenseigan_mode',
                extraDamage: 100,
                description: 'Solo puede usarse mientras Tenseigan Chakra Mode está activo'
            }
        }
    ]
};
