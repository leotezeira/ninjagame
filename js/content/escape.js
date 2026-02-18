// Jutsus de Escape - Técnicas para huir del combate
export const escapeJutsus = {
    escape: [
        // =============== ESCAPE BÁSICO ===============
        {
            id: 'kawarimi_basic',
            name: 'Kawarimi no Jutsu',
            rank: 'D',
            chakra: 20,
            damage: 0,
            element: null,
            description: 'Técnica fundamental de escape: sustitución por un objeto. El más básico que existe.',
            type: 'escape',
            escapeChance: 70,
            reputationLoss: 15,
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 5 },
                exp: 30,
                level: 1,
                rank: 'Genin',
                element: null
            },
            onEscapeSuccess: '💨 Desapareces dejando un tronco en tu lugar.',
            onEscapeFail: '❌ El enemigo detecta el sustituto. Pierdes el turno.'
        },

        // =============== ESCAPE INTERMEDIO ===============
        {
            id: 'shunshin',
            name: 'Shunshin no Jutsu (Cuerpo Parpadeante)',
            rank: 'C',
            chakra: 30,
            damage: 0,
            element: null,
            description: 'Desplazamiento a velocidad extrema: desapareces de la vista del enemigo.',
            type: 'escape',
            escapeChance: 85,
            reputationLoss: 20,
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 10 },
                exp: 120,
                level: 3,
                rank: 'Genin',
                element: null
            },
            onEscapeSuccess: '⚡ Te mueves tan rápido que desapareces del campo de batalla.',
            onEscapeFail: '❌ El enemigo nota tu movimiento. Paralizas por un turno.'
        },

        {
            id: 'kirigakure',
            name: 'Kirigakure no Jutsu (Niebla Oculta)',
            rank: 'C',
            chakra: 28,
            damage: 0,
            element: 'water',
            description: 'Creas una densa niebla que te oculta mientras huyes.',
            type: 'escape',
            escapeChance: 80,
            reputationLoss: 12,
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 12 },
                exp: 140,
                level: 4,
                rank: 'Genin',
                element: 'water'
            },
            onEscapeSuccess: '🌫️ La niebla densa te rodea y desapareces en ella.',
            onEscapeFail: '❌ La niebla se disipa. El enemigo te ve claramente.'
        },

        {
            id: 'moguragakure',
            name: 'Doton: Moguragakure (Escondite Topo)',
            rank: 'C',
            chakra: 25,
            damage: 0,
            element: 'earth',
            description: 'Te hundes bajo tierra y escapas subterráneamente. Efectivo pero lento.',
            type: 'escape',
            escapeChance: 75,
            reputationLoss: 10,
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 10 },
                exp: 130,
                level: 3,
                rank: 'Genin',
                element: 'earth'
            },
            onEscapeSuccess: '🕳️ Te hundes bajo tierra. El enemigo te pierde de vista.',
            onEscapeFail: '❌ No profundizas lo suficiente. El enemigo te atrapa.'
        },

        {
            id: 'katon_cortina',
            name: 'Katon: Cortina de Humo',
            rank: 'C',
            chakra: 27,
            damage: 0,
            element: 'fire',
            description: 'Creas una densa cortina de fuego y humo para huir camuflado.',
            type: 'escape',
            escapeChance: 78,
            reputationLoss: 12,
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 12 },
                exp: 135,
                level: 3,
                rank: 'Genin',
                element: 'fire'
            },
            onEscapeSuccess: '🔥 La cortina de fuego te rodea permitiéndote escapar.',
            onEscapeFail: '❌ El humo no es suficiente. El enemigo te ve a través.'
        },

        {
            id: 'raiton_distraccion',
            name: 'Raiton: Descarga de Distracción',
            rank: 'B',
            chakra: 32,
            damage: 0,
            element: 'lightning',
            description: 'Lanzas una descarga eléctrica explosiva como distracción para huir.',
            type: 'escape',
            escapeChance: 82,
            reputationLoss: 8,
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 15 },
                exp: 200,
                level: 5,
                rank: 'Chunin',
                element: 'lightning'
            },
            onEscapeSuccess: '⚡ La explosión eléctrica ciega al enemigo. ¡Escapas!',
            onEscapeFail: '❌ El enemigo resiste la descarga y te bloquea.'
        },

        // =============== ESCAPE AVANZADO ===============
        {
            id: 'tajuu_kage_bunshin_mass',
            name: 'Tajuu Kage Bunshin (Masa de Clones)',
            rank: 'B',
            chakra: 35,
            damage: 0,
            element: null,
            description: 'Creas MUCHOS clones de sombra para confundir. Solo funciona contra enemigos normales.',
            type: 'escape',
            escapeChance: 90,
            reputationLoss: 25,
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 20 },
                exp: 450,
                level: 7,
                rank: 'Chunin',
                element: null
            },
            onEscapeSuccess: '👥 Creas docenas de clones. ¡El enemigo no sabe cuál es el real!',
            onEscapeFail: '❌ El enemigo destruye todos tus clones. Gastas chakra sin escapar.',
            specialCondition: 'no_boss' // No funciona contra bosses
        },

        {
            id: 'hiraishin_partial',
            name: 'Hiraishin Parcial (Teleportación)',
            rank: 'A',
            chakra: 50,
            damage: 0,
            element: null,
            description: 'Teleportación parcial: te teletransportas a distancia. Muy difícil de dominar.',
            type: 'escape',
            escapeChance: 95,
            reputationLoss: 5,
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 35 },
                exp: 1200,
                level: 11,
                rank: 'Jonin',
                element: null
            },
            onEscapeSuccess: '✨ Te teletransportas a distancia. ¡Escapas sin dejar rastro!',
            onEscapeFail: '❌ La teleportación falla. Quedas desorientado un turno.',
            masterRequired: true // Requiere ser entrenado por maestro
        },

        {
            id: 'memory_manipulation',
            name: 'Manipulación de Memoria (Genjutsu)',
            rank: 'A',
            chakra: 40,
            damage: 0,
            element: null,
            description: 'Genjutsu que hace que el enemigo olvide que te vio. No funciona vs Kekkei Genkai visual.',
            type: 'escape',
            escapeChance: 88,
            reputationLoss: 5,
            learnMethod: 'auto',
            requirements: {
                stats: { genjutsu: 25 },
                exp: 1100,
                level: 10,
                rank: 'Jonin',
                element: null
            },
            onEscapeSuccess: '🎭 El enemigo parpadea. ¿Acaso había alguien aquí?',
            onEscapeFail: '❌ Tu genjutsu no funciona. El enemigo está alerta.',
            specialCondition: 'not_kekkei_visual' // No funciona contra usuarios de Kekkei Genkai visual
        },

        {
            id: 'fuga_sin_rastro',
            name: 'Fuga Sin Rastro (Técnica ANBU)',
            rank: 'S',
            chakra: 55,
            damage: 0,
            element: null,
            description: 'Técnica ANBU: escape casi imposible de detectar. Requiere ser del ANBU o Raíz.',
            type: 'escape',
            escapeChance: 98,
            reputationLoss: 2,
            learnMethod: 'auto',
            requirements: {
                stats: { ninjutsu: 30, taijutsu: 25 },
                exp: 2500,
                level: 12,
                rank: 'Jonin',
                element: null
            },
            onEscapeSuccess: '👻 Desapareces sin dejar ni un rastro. Obra maestra de escape.',
            onEscapeFail: '❌ Incluso los ANBU pueden fallar. Pierdes el turno.',
            specialCondition: 'anbu_only', // Solo si eres ANBU o Raíz
            masterRequired: true
        }
    ]
};
