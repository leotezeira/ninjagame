// RINNEGAN - El Ojo Legendario de los Seis Caminos
// Solo para el 0.5% más poderoso del mundo ninja
// Requiere kekkei_genkai: 'rinnegan' y KG_level

export const rinneganJutsus = {
    rinnegan: [
        // ============================================
        // NIVEL 1: LOS 6 CAMINOS DEL RINNEGAN
        // ============================================
        
        // CAMINO HUMANO (Lectura mental)
        {
            name: 'Leer Combate',
            rank: 'A',
            chakra: 60,
            damage: 0,
            type: 'kekkei',
            description: '🧠 CAMINO HUMANO: Lees las intenciones del enemigo, viendo sus próximos movimientos antes de que sucedan.',
            effect: 'read_intentions',
            learnMethod: 'auto',
            requirements: {
                stats: { genjutsu: 20 },
                exp: 800,
                level: 12,
                rank: 'Jonin',
                kekkei_genkai: 'rinnegan',
                KG_level: 1
            },
            specialEffect: {
                evasionBoost: 25,
                duration: 1,
                description: 'Ver intenciones del enemigo - +25% evasión next turn'
            }
        },

        // CAMINO DEL DEMONIO (Absorción)
        {
            name: 'Absorción de Jutsu',
            rank: 'A',
            chakra: 70,
            damage: 0,
            type: 'kekkei',
            description: '🌀 CAMINO DEL DEMONIO: Absorbes el próximo jutsu enemigo, convirtiendo su chakra en el tuyo.',
            effect: 'absorb_jutsu',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 25 },
                exp: 900,
                level: 12,
                rank: 'Jonin',
                kekkei_genkai: 'rinnegan',
                KG_level: 1
            },
            specialEffect: {
                absorbNext: true,
                chakraSteal: 100,
                description: 'Cancelar y absorber el próximo jutsu enemigo'
            }
        },

        // CAMINO DEL ANIMAL (Invocaciones)
        {
            name: 'Invocación Masiva',
            rank: 'A',
            chakra: 80,
            damage: 60,
            type: 'kekkei',
            description: '🦎 CAMINO DEL ANIMAL: Invocas 3 criaturas del Rinnegan que atacan simultáneamente.',
            effect: 'summon_creatures',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 30 },
                exp: 1000,
                level: 13,
                rank: 'Kage',
                kekkei_genkai: 'rinnegan',
                KG_level: 1
            },
            specialEffect: {
                creatures: 3,
                damagePerCreature: 20,
                duration: 1,
                description: '3 invocaciones atacan por ti este turno'
            }
        },

        // CAMINO NARAKA (Restauración)
        {
            name: 'Rey del Infierno',
            rank: 'A',
            chakra: 90,
            damage: 0,
            type: 'kekkei',
            description: '👹 CAMINO NARAKA: Invocas al Rey del Infierno que restaura vida o resucita aliados caídos.',
            effect: 'heal_revive',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 32 },
                exp: 1100,
                level: 13,
                rank: 'Kage',
                kekkei_genkai: 'rinnegan',
                KG_level: 1
            },
            specialEffect: {
                healPercent: 50,
                canRevive: true,
                description: 'Cura 50% HP o revive a un aliado caído'
            }
        },

        // CAMINO DEL INFIERNO (Extracción)
        {
            name: 'Extracción de Alma',
            rank: 'S',
            chakra: 100,
            damage: 80,
            type: 'kekkei',
            description: '💀 CAMINO DEL INFIERNO: Arrancas fragmentos del alma enemiga, debilitándolo severamente.',
            effect: 'soul_extraction',
            learnMethod: 'auto',
            requirements: {
                stats: { genjutsu: 28 },
                exp: 1200,
                level: 14,
                rank: 'Kage',
                kekkei_genkai: 'rinnegan',
                KG_level: 1
            },
            specialEffect: {
                statsDebuff: 30,
                duration: 3,
                description: 'Enemigo pierde 30% de todos sus stats por 3 turnos'
            }
        },

        // CAMINO DEVA (Repulsión)
        {
            name: 'Shinra Tensei',
            rank: 'S',
            chakra: 120,
            damage: 100,
            type: 'kekkei',
            description: '⚪ CAMINO DEVA: Repeles toda la materia a tu alrededor con fuerza devastadora.',
            effect: 'repel_all',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 35 },
                exp: 1300,
                level: 14,
                rank: 'Kage',
                kekkei_genkai: 'rinnegan',
                KG_level: 1
            },
            specialEffect: {
                reflectAll: true,
                aoe: true,
                cooldown: 2,
                description: 'Repele TODOS los ataques del siguiente turno + daño AOE'
            }
        },

        // ============================================
        // NIVEL 2: TÉCNICAS SUPREMAS DEL RINNEGAN
        // ============================================

        // CAMINO DEVA (Atracción)
        {
            name: 'Banshō Tenin',
            rank: 'S',
            chakra: 100,
            damage: 90,
            type: 'kekkei',
            description: '⚫ CAMINO DEVA: Fuerza gravitacional inversa - atraes todo hacia ti con poder irresistible.',
            effect: 'attract_all',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 35 },
                exp: 1400,
                level: 14,
                rank: 'Kage',
                kekkei_genkai: 'rinnegan',
                KG_level: 2,
                prerequisiteJutsu: 'Shinra Tensei'
            },
            specialEffect: {
                pull: true,
                stunDuration: 1,
                description: 'Atrae al enemigo impidiéndole escapar + daño'
            }
        },

        // CAMINO ASURA (Armamento)
        {
            name: 'Camino Asura',
            rank: 'S',
            chakra: 110,
            damage: 110,
            type: 'kekkei',
            description: '🔧 CAMINO ASURA: Transformas tu cuerpo en un arsenal viviente con armas mecánicas.',
            effect: 'weapon_transformation',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 38, taijutsu: 25 },
                exp: 1500,
                level: 15,
                rank: 'Kage',
                kekkei_genkai: 'rinnegan',
                KG_level: 2
            },
            specialEffect: {
                weaponBoost: 50,
                missiles: 6,
                description: 'Modo armado - múltiples ataques mecanizados'
            }
        },

        // TÉCNICA DEFINITIVA
        {
            name: 'Chibaku Tensei',
            rank: 'S',
            chakra: 150,
            damage: 150,
            type: 'kekkei',
            description: '🌑 TÉCNICA DEFINITIVA: Creas una luna artificial que aprisiona todo en gravedad absoluta.',
            effect: 'gravity_prison',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 45 },
                exp: 1800,
                level: 15,
                rank: 'Kage',
                kekkei_genkai: 'rinnegan',
                KG_level: 2
            },
            specialEffect: {
                trapDuration: 3,
                releaseMultiplier: 2,
                usesPerBattle: 1,
                description: 'Prisión gravitacional 3 turnos - daño masivo al liberar'
            }
        },

        // JUTSU PROHIBIDO
        {
            name: 'Gedō Rinne Tensei',
            rank: 'S',
            chakra: 200,
            damage: 0,
            type: 'kekkei',
            description: '☠️ JUTSU PROHIBIDO: Intercambias tu vida por resucitar masivamente a los muertos. Usuario queda al 1% HP.',
            effect: 'mass_resurrection',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 50 },
                exp: 2000,
                level: 16,
                rank: 'Kage',
                kekkei_genkai: 'rinnegan',
                KG_level: 2
            },
            specialEffect: {
                reviveAll: true,
                userHpCost: 99,
                usesPerBattle: 1,
                description: 'Resurrección masiva - usuario queda al 1% HP'
            }
        }
    ]
};
