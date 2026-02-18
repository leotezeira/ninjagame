// Jutsus de Elemento Fuego (Katon) - El Estilo del Fuego
export const katonJutsus = {
    katon: [
        // =============== RANGO D (5) ===============
        {
            name: 'Katon: Chispa',
            rank: 'D',
            chakra: 12,
            damage: 12,
            element: 'fire',
            description: 'Una simple chispa de fuego. El primer paso del arte del fuego.',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 6 },
                exp: 30,
                level: 1,
                rank: 'Genin',
                element: 'fire'
            }
        },
        {
            name: 'Katon: Pequeña Llama',
            rank: 'D',
            chakra: 16,
            damage: 18,
            element: 'fire',
            description: 'Una pequeña llamarada controlada. Base para técnicas mayores.',
            effect: 'burn',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 8 },
                exp: 50,
                level: 1,
                rank: 'Genin',
                element: 'fire'
            }
        },
        {
            name: 'Katon: Onda de Calor',
            rank: 'D',
            chakra: 18,
            damage: 20,
            element: 'fire',
            description: 'Proyecta una onda de calor puro que quema al impacto.',
            effect: 'burn',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 10 },
                exp: 80,
                level: 2,
                rank: 'Genin',
                element: 'fire'
            }
        },
        {
            name: 'Katon: Esfera Ardiente',
            rank: 'D',
            chakra: 14,
            damage: 16,
            element: 'fire',
            description: 'Una esfera de fuego comprimido que rueda hacia el enemigo.',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 7 },
                exp: 45,
                level: 1,
                rank: 'Genin',
                element: 'fire'
            }
        },
        {
            name: 'Katon: Lluvia de Ceniza',
            rank: 'D',
            chakra: 15,
            damage: 14,
            element: 'fire',
            description: 'Ceniza incandescente que cae como lluvia ardiente.',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 9 },
                exp: 60,
                level: 2,
                rank: 'Genin',
                element: 'fire'
            }
        },

        // =============== RANGO C (6) ===============
        {
            name: 'Katon: Gōkakyū no Jutsu (Gran Bola de Fuego)',
            rank: 'C',
            chakra: 35,
            damage: 40,
            element: 'fire',
            description: 'Icónica técnica de fuego: lanza una gigantesca bola de fuego que arrasa el frente.',
            effect: 'burn',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 15 },
                exp: 200,
                level: 3,
                rank: 'Genin',
                element: 'fire',
                prerequisiteJutsu: 'Katon: Pequeña Llama'
            }
        },
        {
            name: 'Katon: Llama Danzante',
            rank: 'C',
            chakra: 30,
            damage: 32,
            element: 'fire',
            description: 'Múltiples llamas que danzan alrededor del enemigo en patrones impredecibles.',
            effect: 'burn',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 12 },
                exp: 150,
                level: 3,
                rank: 'Genin',
                element: 'fire'
            }
        },
        {
            name: 'Katon: Ryūka no Jutsu (Dragón de Fuego)',
            rank: 'C',
            chakra: 38,
            damage: 45,
            element: 'fire',
            description: 'Canaliza chakra para lanzar un dragón de fuego que atraviesa defensas.',
            effect: 'burn_heavy',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 18 },
                exp: 280,
                level: 4,
                rank: 'Genin',
                element: 'fire'
            }
        },
        {
            name: 'Katon: Hōsenka no Jutsu (Lluvia de Fénix)',
            rank: 'C',
            chakra: 36,
            damage: 42,
            element: 'fire',
            description: 'Múltiples esferas de fuego proyectadas como flores de fénix que persiguen al objetivo.',
            effect: 'burn',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 16 },
                exp: 220,
                level: 3,
                rank: 'Genin',
                element: 'fire'
            }
        },
        {
            name: 'Katon: Haisekishō (Ceniza Ardiente)',
            rank: 'C',
            chakra: 32,
            damage: 35,
            element: 'fire',
            description: 'Nube de ceniza que explota al inhalarla, quemando desde dentro.',
            effect: 'burn',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 14 },
                exp: 170,
                level: 3,
                rank: 'Genin',
                element: 'fire'
            }
        },
        {
            name: 'Katon: Karyu Endan (Bola de Llama Sostenida)',
            rank: 'C',
            chakra: 40,
            damage: 48,
            element: 'fire',
            description: 'Mantiene un chorro continuo de fuego que no cesa. Alto consumo de chakra.',
            effect: 'burn_heavy',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 17 },
                exp: 250,
                level: 4,
                rank: 'Genin',
                element: 'fire'
            }
        },

        // =============== RANGO B (5) ===============
        {
            name: 'Katon: Devastación Llameante',
            rank: 'B',
            chakra: 55,
            damage: 65,
            element: 'fire',
            description: 'Ola de fuego destructiva que arrasa el terreno. Daño devastador.',
            effect: 'burn_heavy',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 22 },
                exp: 400,
                level: 6,
                rank: 'Chunin',
                element: 'fire'
            }
        },
        {
            name: 'Katon: Torbellino de Fuego',
            rank: 'B',
            chakra: 60,
            damage: 70,
            element: 'fire',
            description: 'Creas un vórtice de fuego que gira destructivamente. Controla el campo de batalla.',
            effect: 'burn_heavy',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 25 },
                exp: 500,
                level: 7,
                rank: 'Chunin',
                element: 'fire'
            }
        },
        {
            name: 'Katon: Volcán',
            rank: 'B',
            chakra: 65,
            damage: 75,
            element: 'fire',
            description: 'AOE: Crea una erupción volcánica que daña a TODOS los enemigos en la oleada.',
            effect: 'aoe_burn',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 28 },
                exp: 600,
                level: 8,
                rank: 'Chunin',
                element: 'fire'
            }
        },
        {
            name: 'Katon: Gōryūka no Jutsu (Gran Dragón de Fuego)',
            rank: 'B',
            chakra: 58,
            damage: 68,
            element: 'fire',
            description: 'Evolución del Dragón de Fuego: mayor tamaño y poder destructivo.',
            effect: 'burn_heavy',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 24 },
                exp: 480,
                level: 7,
                rank: 'Chunin',
                element: 'fire',
                prerequisiteJutsu: 'Katon: Ryūka no Jutsu (Dragón de Fuego)'
            }
        },
        {
            name: 'Katon: Bakuenjin (Anillo Explosivo)',
            rank: 'B',
            chakra: 52,
            damage: 60,
            element: 'fire',
            description: 'Círculo de fuego que atrapa al enemigo. Defensa y ataque combinados.',
            effect: 'burn_heavy',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 20 },
                exp: 420,
                level: 6,
                rank: 'Chunin',
                element: 'fire'
            }
        },

        // =============== RANGO A/S (4) ===============
        {
            name: 'Katon: Majestuosa Destrucción',
            rank: 'A',
            chakra: 80,
            damage: 110,
            element: 'fire',
            description: 'Técnica Jonin: Fuego que arrasa formaciones enemigas completamente.',
            effect: 'burn_heavy',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 32 },
                exp: 800,
                level: 10,
                rank: 'Jonin',
                element: 'fire'
            }
        },
        {
            name: 'Katon: Gōka Mekkyaku (Extinción Majestuosa)',
            rank: 'A',
            chakra: 90,
            damage: 130,
            element: 'fire',
            description: 'Un mar de fuego que consume todo a su paso. Poder abrumador.',
            effect: 'burn_heavy',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 35 },
                exp: 1000,
                level: 11,
                rank: 'Jonin',
                element: 'fire'
            }
        },
        {
            name: 'Katon: Inferno Total',
            rank: 'S',
            chakra: 110,
            damage: 160,
            element: 'fire',
            description: 'Técnica de maestro: Infierno desatado. Quema todo lo que toca sin piedad.',
            effect: 'burn_heavy',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 38 },
                exp: 1200,
                level: 13,
                rank: 'Kage',
                element: 'fire'
            },
            masterRequired: true,
            masterNote: 'Requiere entrenamiento de un Jonin especialista en fuego'
        },
        {
            name: 'Katon: Fuego Divino',
            rank: 'S',
            chakra: 120,
            damage: 180,
            element: 'fire',
            description: 'Técnica suprema: Fuego de dioses. Absolutamente destructivo.',
            effect: 'burn_heavy',
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 42 },
                exp: 1500,
                level: 15,
                rank: 'Kage',
                element: 'fire'
            },
            masterRequired: true,
            masterNote: 'Solo se enseña a discípulos especiales de Sarutobi o clanes Uchiha avanzados'
        }
    ]
};
