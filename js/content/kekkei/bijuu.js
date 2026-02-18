// BIJUU - Poder de las Bestias con Cola
// Solo para Jinchurikis que tienen un Bijuu sellado
// Requiere kekkei_genkai: 'bijuu' y bijuu_relation (0-100)

export const bijuuJutsus = {
    bijuu: [
        // ============================================
        // FASE 1: RELACIÓN HOSTIL (0-25)
        // ============================================
        
        {
            name: 'Manto de Chakra V1',
            rank: 'B',
            chakra: 60,
            damage: 40,
            type: 'kekkei',
            description: '🔴 FASE HOSTIL: Envuelves tu cuerpo en el chakra salvaje del Bijuu. Poder increíble pero peligroso.',
            effect: 'bijuu_cloak_v1',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 15 },
                exp: 500,
                level: 10,
                rank: 'Chunin',
                kekkei_genkai: 'bijuu',
                bijuu_relation: 10
            },
            specialEffect: {
                allStatsBoost: 30,
                duration: 5,
                loseControlChance: 10,
                description: '+30% stats 5 turnos - Riesgo 10%: atacas a todos'
            }
        },

        // ============================================
        // FASE 2: RELACIÓN TOLERADA (26-50)
        // ============================================
        
        {
            name: 'Manto de Chakra V2',
            rank: 'A',
            chakra: 80,
            damage: 60,
            type: 'kekkei',
            description: '🔴🔴 FASE TOLERADA: El chakra del Bijuu te envuelve completamente, formando un manto de poder sin precedentes.',
            effect: 'bijuu_cloak_v2',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 25 },
                exp: 800,
                level: 12,
                rank: 'Jonin',
                kekkei_genkai: 'bijuu',
                bijuu_relation: 30,
                prerequisiteJutsu: 'Manto de Chakra V1'
            },
            specialEffect: {
                allStatsBoost: 50,
                duration: 7,
                description: '+50% todos stats por 7 turnos'
            }
        },

        {
            name: 'Esfera Bijuu Pequeña',
            rank: 'A',
            chakra: 100,
            damage: 120,
            type: 'kekkei',
            description: '⚫ MINI BIJUUDAMA: Condensas el chakra del Bijuu en una esfera destructiva. Poder devastador.',
            effect: 'mini_tailed_beast_bomb',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 30 },
                exp: 1000,
                level: 13,
                rank: 'Jonin',
                kekkei_genkai: 'bijuu',
                bijuu_relation: 40
            },
            specialEffect: {
                explosiveRadius: 'medium',
                usesPerBattle: 1,
                description: 'Esfera de chakra comprimido - 1 carga/batalla'
            }
        },

        // ============================================
        // FASE 3: RELACIÓN NEUTRAL (51-75)
        // ============================================
        
        {
            name: 'Brazos de Chakra',
            rank: 'A',
            chakra: 90,
            damage: 80,
            type: 'kekkei',
            description: '💪 FASE NEUTRAL: Manifiestas brazos de chakra del Bijuu que atacan independientemente.',
            effect: 'chakra_arms',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 32, taijutsu: 20 },
                exp: 1200,
                level: 14,
                rank: 'Kage',
                kekkei_genkai: 'bijuu',
                bijuu_relation: 55
            },
            specialEffect: {
                doubleAttack: true,
                duration: 3,
                description: 'Ataca 2 veces por turno durante 3 turnos'
            }
        },

        {
            name: 'Modo Bijuu Parcial',
            rank: 'S',
            chakra: 120,
            damage: 100,
            type: 'kekkei',
            description: '🦊 TRANSFORMACIÓN PARCIAL: Adoptas parcialmente la forma del Bijuu. Poder y forma bestial.',
            effect: 'partial_transformation',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 35 },
                exp: 1400,
                level: 14,
                rank: 'Kage',
                kekkei_genkai: 'bijuu',
                bijuu_relation: 65
            },
            specialEffect: {
                allStatsBoost: 70,
                duration: 8,
                visualChange: true,
                description: '+70% stats 8 turnos - Forma semi-bestia'
            }
        },

        // ============================================
        // FASE 4: RELACIÓN EN ARMONÍA (76-100)
        // ============================================
        
        {
            name: 'Modo Bijuu Completo',
            rank: 'S',
            chakra: 150,
            damage: 130,
            type: 'kekkei',
            description: '🔥 TRANSFORMACIÓN COMPLETA: Te transformas en el Bijuu completo. Poder absoluto de la Bestia con Cola.',
            effect: 'full_transformation',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 40 },
                exp: 1600,
                level: 15,
                rank: 'Kage',
                kekkei_genkai: 'bijuu',
                bijuu_relation: 80
            },
            specialEffect: {
                allStatsBoost: 100,
                duration: 10,
                visualChange: true,
                newForm: true,
                description: '+100% stats 10 turnos - Forma Bijuu completa'
            }
        },

        {
            name: 'Esfera Bijuu Masiva',
            rank: 'S',
            chakra: 180,
            damage: 250,
            type: 'kekkei',
            description: '⚫💥 BIJUUDAMA COMPLETO: La técnica definitiva del Bijuu. Esfera de chakra que arrasa todo.',
            effect: 'massive_tailed_beast_bomb',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 45 },
                exp: 1800,
                level: 15,
                rank: 'Kage',
                kekkei_genkai: 'bijuu',
                bijuu_relation: 85,
                prerequisiteJutsu: 'Esfera Bijuu Pequeña'
            },
            specialEffect: {
                massiveDamage: 500,
                explosiveRadius: 'huge',
                usesPerBattle: 1,
                description: 'El ataque más poderoso - 1 uso/batalla'
            }
        },

        {
            name: 'Modo Bijuu Perfecto',
            rank: 'S',
            chakra: 200,
            damage: 150,
            type: 'kekkei',
            description: '✨ ARMONÍA PERFECTA: Tú y el Bijuu son uno. Poder sin límites, regeneración, forma dorada brillante.',
            effect: 'perfect_mode',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 50 },
                exp: 2000,
                level: 16,
                rank: 'Kage',
                kekkei_genkai: 'bijuu',
                bijuu_relation: 100
            },
            specialEffect: {
                allStatsBoost: 150,
                duration: 15,
                hpRegen: 10,
                unlockAllBijuuJutsus: true,
                goldenForm: true,
                description: '+150% stats 15 turnos - Regenera 10% HP/turno - Estado supremo'
            }
        }
    ]
};
