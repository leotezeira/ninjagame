// Datos y configuración estática del juego
// Editá este archivo para agregar clanes, jutsus, misiones, enemigos, etc.

export const BASE_GAME = {

        player: null,
        currentEnemy: null,
        currentMission: null,
        enemyQueue: [],
        currentWave: 0,
        totalWaves: 0,
        combatTurn: 'player',
        kawairimiUsed: false,
        defendActive: false,

        // Calendario ninja
        weekdayNames: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        monthNames: [
            'Mes 1', 'Mes 2', 'Mes 3', 'Mes 4', 'Mes 5', 'Mes 6',
            'Mes 7', 'Mes 8', 'Mes 9', 'Mes 10', 'Mes 11', 'Mes 12'
        ],
        timeOfDayNames: ['MAÑANA', 'TARDE', 'NOCHE', 'MADRUGADA'],
        turnsPerDay: 4,
        daysPerMonth: 30,
        monthsPerYear: 12,

        // Mundo / mapa
        locations: {
            konoha: { name: 'Konoha', icon: '🏘️', base: true },
            bosque: { name: 'Bosque de la Muerte', icon: '🌲', daysFromKonoha: 2 },
            olas: { name: 'País de las Olas', icon: '🌊', daysFromKonoha: 3 },
            suna: { name: 'Sunagakure', icon: '🏜️', daysFromKonoha: 5 },
            kiri: { name: 'Kirigakure', icon: '🌫️', daysFromKonoha: 7 },
            iwa: { name: 'Iwagakure', icon: '⛰️', daysFromKonoha: 6 },
            kumo: { name: 'Kumogakure', icon: '☁️', daysFromKonoha: 8 },
            ame: { name: 'Amegakure', icon: '💧', daysFromKonoha: 4 },
            valle: { name: 'Valle del Fin', icon: '🌳', daysFromKonoha: 4 },
            nieve: { name: 'País de la Nieve', icon: '🏔️', daysFromKonoha: 10 }
        },

        // Reclutamiento (equipo de 3: tú + 2 NPC)
        recruitableNPCs: {
            naruto: { id: 'naruto', name: 'Naruto', costPerDay: 500, perk: 'mission_ryo', perkValue: 0.10 },
            sakura: { id: 'sakura', name: 'Sakura', costPerDay: 400, perk: 'between_heal', perkValue: 0.10 },
            lee: { id: 'lee', name: 'Rock Lee', costPerDay: 450, perk: 'combat_damage', perkValue: 15 },
            shikamaru: { id: 'shikamaru', name: 'Shikamaru', costPerDay: 600, perk: 'mission_exp', perkValue: 0.20 },
            hinata: { id: 'hinata', name: 'Hinata', costPerDay: 550, perk: 'team_evasion', perkValue: 0.15 }
        },

        // Clima
        weatherOptionsBySeason: {
            primavera: ['soleado', 'soleado', 'nublado', 'lluvia'],
            verano: ['soleado', 'soleado', 'soleado', 'nublado', 'tormenta'],
            otono: ['nublado', 'lluvia', 'lluvia', 'soleado'],
            invierno: ['nublado', 'nieve', 'nieve', 'tormenta']
        },

        // Eventos recurrentes
        recurringEvents: [
            { id: 'festival_konoha', name: 'Festival de Konoha', when: (p) => p.location === 'konoha' && p.month === 5 && p.day === 15 },
            { id: 'examen_chunin_enero', name: 'Examen Chunin', when: (p) => p.location === 'konoha' && p.month === 1 && p.day === 1 },
            { id: 'examen_chunin_julio', name: 'Examen Chunin', when: (p) => p.location === 'konoha' && p.month === 7 && p.day === 1 },
            { id: 'luna_llena', name: 'Luna Llena', when: (p) => p.day === 15 },
            { id: 'torneo_aldea', name: 'Torneo de la Aldea', when: (p) => p.location === 'konoha' && p.day === 30 }
        ],
        
        clans: {
            uchiha: {
                name: 'Uchiha',
                icon: '🔥',
                description: 'Clan del fuego',
                hp: 100, chakra: 120, taijutsu: 12, ninjutsu: 18, genjutsu: 15,
                element: 'fire'
            },
            uzumaki: {
                name: 'Uzumaki',
                icon: '🌀',
                description: 'Vitalidad extrema',
                hp: 140, chakra: 150, taijutsu: 15, ninjutsu: 14, genjutsu: 8,
                element: 'wind'
            },
            hyuga: {
                name: 'Hyuga',
                icon: '👁️',
                description: 'Visión perfecta',
                hp: 110, chakra: 100, taijutsu: 20, ninjutsu: 10, genjutsu: 12,
                element: 'water'
            },
            nara: {
                name: 'Nara',
                icon: '🦌',
                description: 'Estrategas',
                hp: 90, chakra: 110, taijutsu: 10, ninjutsu: 15, genjutsu: 18,
                element: 'earth'
            },
            akimichi: {
                name: 'Akimichi',
                icon: '🍖',
                description: 'Fuerza colosal',
                hp: 150, chakra: 90, taijutsu: 18, ninjutsu: 12, genjutsu: 8,
                element: 'earth'
            },
            aburame: {
                name: 'Aburame',
                icon: '🐛',
                description: 'Control de insectos',
                hp: 95, chakra: 115, taijutsu: 11, ninjutsu: 16, genjutsu: 14,
                element: 'earth'
            },
            inuzuka: {
                name: 'Inuzuka',
                icon: '🐺',
                description: 'Vínculo bestial',
                hp: 115, chakra: 95, taijutsu: 17, ninjutsu: 11, genjutsu: 10,
                element: 'earth'
            },
            yamanaka: {
                name: 'Yamanaka',
                icon: '🌸',
                description: 'Control mental',
                hp: 85, chakra: 125, taijutsu: 9, ninjutsu: 13, genjutsu: 20,
                element: 'water'
            },
            hatake: {
                name: 'Hatake',
                icon: '⚡',
                description: 'Copistas',
                hp: 105, chakra: 130, taijutsu: 14, ninjutsu: 17, genjutsu: 13,
                element: 'lightning'
            },
            senju: {
                name: 'Senju',
                icon: '🌳',
                description: 'Equilibrio perfecto',
                hp: 120, chakra: 120, taijutsu: 15, ninjutsu: 15, genjutsu: 15,
                element: 'earth'
            },
            sarutobi: {
                name: 'Sarutobi',
                icon: '🔮',
                description: 'Maestros elementales',
                hp: 100, chakra: 140, taijutsu: 12, ninjutsu: 19, genjutsu: 11,
                element: 'fire'
            },
            rock_lee: {
                name: 'Sin Clan (Lee)',
                icon: '👊',
                description: 'Puro Taijutsu',
                hp: 130, chakra: 50, taijutsu: 25, ninjutsu: 5, genjutsu: 5,
                element: null
            }
        },

        kekkeiGenkaiList: [
            { 
                name: 'Sharingan', 
                chance: 3, 
                levels: [
                    { level: 1, name: '1 Aspa', exp: 0, bonus: { genjutsu: 3, critChance: 5 } },
                    { level: 2, name: '2 Aspas', exp: 100, bonus: { genjutsu: 5, critChance: 10 } },
                    { level: 3, name: '3 Aspas', exp: 300, bonus: { genjutsu: 8, critChance: 15 } },
                    { level: 4, name: 'Mangekyō', exp: 600, bonus: { genjutsu: 12, critChance: 20, ninjutsu: 5 } }
                ]
            },
            { 
                name: 'Byakugan', 
                chance: 3, 
                levels: [
                    { level: 1, name: 'Básico', exp: 0, bonus: { taijutsu: 3, critChance: 8 } },
                    { level: 2, name: 'Intermedio', exp: 100, bonus: { taijutsu: 6, critChance: 15 } },
                    { level: 3, name: 'Avanzado', exp: 300, bonus: { taijutsu: 10, critChance: 22 } },
                    { level: 4, name: 'Tenseigan', exp: 700, bonus: { taijutsu: 15, critChance: 30, chakraRegen: 10 } }
                ]
            },
            { 
                name: 'Rinnegan', 
                chance: 0.5, 
                levels: [
                    { level: 1, name: '6 Caminos', exp: 0, bonus: { all: 10, critChance: 25 } },
                    { level: 2, name: 'Rinne-Sharingan', exp: 500, bonus: { all: 20, critChance: 40 } }
                ]
            },
            { 
                name: 'Modo Sabio', 
                chance: 2, 
                levels: [
                    { level: 1, name: 'Básico', exp: 0, bonus: { ninjutsu: 5, chakraRegen: 3 } },
                    { level: 2, name: 'Avanzado', exp: 150, bonus: { ninjutsu: 10, chakraRegen: 7 } },
                    { level: 3, name: 'Perfecto', exp: 400, bonus: { ninjutsu: 15, chakraRegen: 12, maxChakra: 50 } }
                ]
            },
            { 
                name: 'Mokuton', 
                chance: 1.5, 
                levels: [
                    { level: 1, name: 'Básico', exp: 0, bonus: { ninjutsu: 4, maxHp: 15 } },
                    { level: 2, name: 'Hashirama', exp: 200, bonus: { ninjutsu: 8, maxHp: 40 } }
                ]
            }
        ],

        elements: {
            fire: { name: 'Fuego (Katon)', icon: '🔥', bonus: 'Daño quemadura' },
            water: { name: 'Agua (Suiton)', icon: '💧', bonus: '+Defensa' },
            wind: { name: 'Viento (Futon)', icon: '💨', bonus: '+Velocidad' },
            earth: { name: 'Tierra (Doton)', icon: '🪨', bonus: '+HP' },
            lightning: { name: 'Rayo (Raiton)', icon: '⚡', bonus: '+Crítico' }
        },

        academyJutsus: {
            // Genin (D-C)
            genin: [
                // 🔥 Fuego
                { name: 'Katon: Gōkakyū no Jutsu', rank: 'C', price: 300, chakra: 35, damage: 35, element: 'fire', description: 'Gran Bola de Fuego: una llamarada icónica que arrasa el frente.' },
                { name: 'Katon: Hōsenka no Jutsu', rank: 'C', price: 280, chakra: 30, damage: 30, element: 'fire', description: 'Flores Fénix: múltiples proyectiles de fuego que persiguen al objetivo.' },
                { name: 'Katon: Hinotama', rank: 'D', price: 120, chakra: 18, damage: 18, element: 'fire', description: 'Esferas de fuego rápidas, perfectas para hostigar.' },
                { name: 'Katon: Kasumi Enbu', rank: 'D', price: 150, chakra: 20, damage: 16, element: 'fire', description: 'Danza de Niebla: humo inflamable que detona al impacto.', effect: 'burn' },
                { name: 'Katon: Enjin no Kama', rank: 'C', price: 260, chakra: 32, damage: 28, element: 'fire', description: 'Guadaña Ígnea: un arco de llamas que corta y quema.', effect: 'burn' },

                // 💧 Agua
                { name: 'Suiton: Mizurappa', rank: 'C', price: 280, chakra: 30, damage: 30, element: 'water', description: 'Ola Violenta: empuje de agua que golpea y desestabiliza.' },
                { name: 'Suiton: Teppōdama', rank: 'C', price: 260, chakra: 28, damage: 28, element: 'water', description: 'Bala de Agua: disparo comprimido que perfora.' },
                { name: 'Suiton: Mizu no Yaiba', rank: 'D', price: 150, chakra: 20, damage: 18, element: 'water', description: 'Hoja de Agua: filo líquido para cortes rápidos.' },
                { name: 'Suiton: Kirigakure no Jutsu', rank: 'C', price: 300, chakra: 35, damage: 15, element: 'water', description: 'Niebla Oculta: reduce visibilidad y confunde.', effect: 'stun' },
                { name: 'Suiton: Suiryūdan (Mini)', rank: 'C', price: 290, chakra: 34, damage: 33, element: 'water', description: 'Mini Dragón de Agua: impacto contundente con control.' },

                // 💨 Viento
                { name: 'Fūton: Kaze no Yaiba', rank: 'D', price: 120, chakra: 18, damage: 18, element: 'wind', description: 'Hoja de Viento: corte invisible a corta distancia.' },
                { name: 'Fūton: Reppūshō', rank: 'C', price: 250, chakra: 30, damage: 28, element: 'wind', description: 'Palma Huracanada: empuje que rompe postura.' },
                { name: 'Fūton: Shinkūgyoku', rank: 'C', price: 280, chakra: 34, damage: 33, element: 'wind', description: 'Esfera de Vacío: proyectiles compactos de aire.' },
                { name: 'Fūton: Kamaitachi (Básico)', rank: 'C', price: 300, chakra: 38, damage: 35, element: 'wind', description: 'Hoz de Viento: ráfaga cortante que hiere en línea.' },
                { name: 'Fūton: Kaze Shibari', rank: 'D', price: 160, chakra: 22, damage: 15, element: 'wind', description: 'Atadura de Viento: traba el movimiento con presión.', effect: 'stun' },

                // 🪨 Tierra
                { name: 'Doton: Doryūheki (Básico)', rank: 'C', price: 300, chakra: 35, damage: 20, element: 'earth', description: 'Muro de Tierra: defensa rápida que bloquea el avance.', effect: 'defense' },
                { name: 'Doton: Moguragakure', rank: 'C', price: 260, chakra: 30, damage: 28, element: 'earth', description: 'Escondite Subterráneo: golpe sorpresa desde abajo.' },
                { name: 'Doton: Iwa Tsubute', rank: 'D', price: 120, chakra: 18, damage: 18, element: 'earth', description: 'Piedras Lanzadas: proyectiles de roca a corta distancia.' },
                { name: 'Doton: Tsuchi Shibari', rank: 'D', price: 150, chakra: 22, damage: 15, element: 'earth', description: 'Atadura de Tierra: el suelo atrapa los pies.', effect: 'stun' },
                { name: 'Doton: Kōgan no Kama', rank: 'C', price: 280, chakra: 34, damage: 33, element: 'earth', description: 'Guadaña Rocosa: filo pesado que rompe guardias.' },

                // ⚡ Rayo
                { name: 'Raiton: Chispa', rank: 'D', price: 120, chakra: 18, damage: 18, element: 'lightning', description: 'Descarga rápida para aturdir y abrir guardias.', effect: 'stun' },
                { name: 'Raiton: Denki Tama', rank: 'C', price: 260, chakra: 30, damage: 30, element: 'lightning', description: 'Esfera Eléctrica: golpe directo con zumbido paralizante.', effect: 'stun' },
                { name: 'Raiton: Raikyū', rank: 'C', price: 280, chakra: 34, damage: 33, element: 'lightning', description: 'Orbe de Rayo: daño sostenido y presión constante.' },
                { name: 'Raiton: Ikazuchi no Yaiba', rank: 'C', price: 300, chakra: 38, damage: 35, element: 'lightning', description: 'Hoja de Trueno: filo eléctrico para cortes letales.' },
                { name: 'Raiton: Kōden', rank: 'D', price: 150, chakra: 22, damage: 15, element: 'lightning', description: 'Conducto: chispa que “engancha” el objetivo.', effect: 'stun' },

                // Neutrales (para todos)
                { name: 'Kawarimi no Jutsu', rank: 'D', price: 100, chakra: 15, damage: 0, element: null, description: 'Sustitución para evitar un golpe crítico.', effect: 'defense' },
                { name: 'Oiroke no Jutsu (Distracción)', rank: 'D', price: 120, chakra: 15, damage: 15, element: null, description: 'Distracción absurda pero efectiva para romper el ritmo.', effect: 'stun' },
                { name: 'Iryō Ninjutsu: Shōsen', rank: 'C', price: 280, chakra: 35, damage: 0, element: null, description: 'Técnica médica para cerrar heridas rápidamente.', effect: 'heal' },
                { name: 'Shunshin no Jutsu', rank: 'C', price: 250, chakra: 30, damage: 0, element: null, description: 'Desplazamiento instantáneo que aumenta velocidad.', effect: 'speed' },
                { name: 'Kage Bunshin no Jutsu', rank: 'C', price: 300, chakra: 40, damage: 0, element: null, description: 'Clones sólidos que confunden y multiplican presión.', effect: 'clone' }
            ],

            // Chunin (B)
            chunin: [
                // 🔥
                { name: 'Katon: Ryūka no Jutsu', rank: 'B', price: 800, chakra: 55, damage: 65, element: 'fire', description: 'Dragón de Fuego: un chorro concentrado que atraviesa defensas.', effect: 'burn' },
                { name: 'Katon: Gōryūka no Jutsu', rank: 'B', price: 900, chakra: 60, damage: 75, element: 'fire', description: 'Gran Dragón de Fuego: calor abrumador y daño sostenido.', effect: 'burn' },
                { name: 'Katon: Haisekishō', rank: 'B', price: 700, chakra: 50, damage: 55, element: 'fire', description: 'Ceniza Ardiente: nube que explota al inhalarla.', effect: 'stun' },
                { name: 'Katon: Enkōdan', rank: 'B', price: 650, chakra: 48, damage: 50, element: 'fire', description: 'Bala de Llama: disparo compacto, veloz y preciso.' },
                { name: 'Katon: Karyū Endan', rank: 'B', price: 1100, chakra: 70, damage: 80, element: 'fire', description: 'Llamarada Continua: un río de fuego que no da respiro.', effect: 'burn' },
                { name: 'Katon: Shakunetsu Kekkai', rank: 'B', price: 1000, chakra: 65, damage: 60, element: 'fire', description: 'Barrera Abrasadora: el calor frena al enemigo y lo desgasta.', effect: 'defense' },

                // 💧
                { name: 'Suiton: Suiryūdan no Jutsu', rank: 'B', price: 900, chakra: 65, damage: 80, element: 'water', description: 'Dragón de Agua: un coloso acuático que arrasa.' },
                { name: 'Suiton: Suijinheki', rank: 'B', price: 700, chakra: 50, damage: 40, element: 'water', description: 'Muro de Agua: bloquea ataques y contraataca con presión.', effect: 'defense' },
                { name: 'Suiton: Daibakufu', rank: 'B', price: 1000, chakra: 70, damage: 75, element: 'water', description: 'Gran Cascada: ola masiva que barre el terreno.' },
                { name: 'Suiton: Hōmatsu Rappa', rank: 'B', price: 650, chakra: 48, damage: 55, element: 'water', description: 'Espuma Violenta: espuma densa que ralentiza y golpea.', effect: 'stun' },
                { name: 'Suiton: Mizukiri no Yaiba', rank: 'B', price: 800, chakra: 55, damage: 65, element: 'water', description: 'Cuchillas de Agua: múltiples filos cortantes.' },
                { name: 'Suiton: Suiro no Jutsu', rank: 'B', price: 600, chakra: 45, damage: 42, element: 'water', description: 'Prisión de Agua (impacto): inmoviliza y castiga.', effect: 'stun' },

                // 💨
                { name: 'Fūton: Shinkūha', rank: 'B', price: 700, chakra: 50, damage: 55, element: 'wind', description: 'Onda de Vacío: cuchilla larga de aire que atraviesa.' },
                { name: 'Fūton: Shinkū Renpa', rank: 'B', price: 850, chakra: 60, damage: 70, element: 'wind', description: 'Ráfaga en Cadena: varias ondas que saturan la defensa.' },
                { name: 'Fūton: Kazekiri', rank: 'B', price: 650, chakra: 45, damage: 45, element: 'wind', description: 'Corte de Viento: filo rápido y mortal.' },
                { name: 'Fūton: Daitoppa', rank: 'B', price: 900, chakra: 65, damage: 80, element: 'wind', description: 'Gran Avance: tormenta frontal que arrasa formación.' },
                { name: 'Fūton: Kaze no Tate', rank: 'B', price: 600, chakra: 50, damage: 40, element: 'wind', description: 'Escudo de Viento: desvía ataques y reduce impacto.', effect: 'defense' },
                { name: 'Fūton: Shinkūsen', rank: 'B', price: 1100, chakra: 70, damage: 75, element: 'wind', description: 'Cuchilla Circular: anillo de aire que golpea alrededor.' },

                // 🪨
                { name: 'Doton: Doryūsō', rank: 'B', price: 650, chakra: 45, damage: 50, element: 'earth', description: 'Lanza de Tierra: estaca que emerge y perfora.' },
                { name: 'Doton: Yomi Numa', rank: 'B', price: 900, chakra: 65, damage: 60, element: 'earth', description: 'Pantano del Inframundo: hunde al enemigo y lo inmoviliza.', effect: 'stun' },
                { name: 'Doton: Iwagakure no Jutsu', rank: 'B', price: 700, chakra: 50, damage: 45, element: 'earth', description: 'Camuflaje de Roca: embiste desde cobertura sólida.' },
                { name: 'Doton: Ganban Kyū', rank: 'B', price: 800, chakra: 55, damage: 65, element: 'earth', description: 'Ataúd de Roca: aprisiona y aplasta con fuerza.' },
                { name: 'Doton: Iwa Gōlem (Impacto)', rank: 'B', price: 1200, chakra: 70, damage: 80, element: 'earth', description: 'Gólem de Roca: golpe masivo que sacude el suelo.' },
                { name: 'Doton: Doryūtaiga', rank: 'B', price: 1000, chakra: 65, damage: 75, element: 'earth', description: 'Río de Tierra: ola de lodo que derriba formaciones.', effect: 'stun' },

                // ⚡
                { name: 'Raiton: Raikiri (Práctica)', rank: 'B', price: 1200, chakra: 70, damage: 80, element: 'lightning', description: 'Corte de Rayo entrenado: velocidad y precisión.' },
                { name: 'Raiton: Chidori', rank: 'B', price: 1100, chakra: 65, damage: 75, element: 'lightning', description: 'Chidori: estocada relámpago que atraviesa armaduras.' },
                { name: 'Raiton: Gian', rank: 'B', price: 900, chakra: 60, damage: 70, element: 'lightning', description: 'Falsa Oscuridad: rayo lineal de alta potencia.' },
                { name: 'Raiton: Jibashi', rank: 'B', price: 650, chakra: 45, damage: 45, element: 'lightning', description: 'Torre de Choque: electricidad que inmoviliza al tocar.', effect: 'stun' },
                { name: 'Raiton: Raijū Tsuiga', rank: 'B', price: 800, chakra: 55, damage: 65, element: 'lightning', description: 'Bestia de Rayo: forma animal que muerde y paraliza.', effect: 'stun' },
                { name: 'Raiton: Hiraishin Pulse', rank: 'B', price: 1000, chakra: 68, damage: 60, element: 'lightning', description: 'Pulso Relámpago: descarga de área que corta el ritmo enemigo.', effect: 'stun' },

                // Neutrales B
                { name: 'Tajū Kage Bunshin', rank: 'B', price: 1200, chakra: 70, damage: 40, element: null, description: 'Muchos clones para abrumar al enemigo.', effect: 'clone' },
                { name: 'Fūinjutsu: Sello de Contención', rank: 'B', price: 900, chakra: 60, damage: 50, element: null, description: 'Sello que inmoviliza y debilita al objetivo.', effect: 'stun' },
                { name: 'Kuchiyose: Invocación (Aliado)', rank: 'B', price: 900, chakra: 55, damage: 60, element: null, description: 'Invoca un aliado temporal que golpea fuerte.', effect: 'summon' }
            ],

            // Jonin (A)
            jonin: [
                // 🔥
                { name: 'Katon: Gōka Mekkyaku', rank: 'A', price: 2500, chakra: 90, damage: 130, element: 'fire', description: 'Extinción Majestuosa: un mar de fuego que consume el campo.', effect: 'burn' },
                { name: 'Katon: Gōka Messhitsu', rank: 'A', price: 2800, chakra: 100, damage: 150, element: 'fire', description: 'Extinción Suprema: presión térmica que rompe líneas defensivas.', effect: 'burn' },
                { name: 'Katon: Bakuenjin', rank: 'A', price: 2200, chakra: 85, damage: 110, element: 'fire', description: 'Anillo Explosivo: círculo ígneo que atrapa y castiga.', effect: 'stun' },

                // 💧
                { name: 'Suiton: Suikōdan', rank: 'A', price: 2200, chakra: 85, damage: 110, element: 'water', description: 'Tiburón de Agua: mordida giratoria que destroza.' },
                { name: 'Suiton: Dai Suiryūdan', rank: 'A', price: 2600, chakra: 95, damage: 140, element: 'water', description: 'Dragón de Agua Supremo: presión brutal, difícil de esquivar.' },
                { name: 'Suiton: Suijinheki Kai', rank: 'A', price: 2000, chakra: 80, damage: 90, element: 'water', description: 'Muro de Agua Mejorado: defensa y contraataque en un solo flujo.', effect: 'defense' },

                // 💨
                { name: 'Fūton: Kazekiri Ranbu', rank: 'A', price: 2400, chakra: 90, damage: 120, element: 'wind', description: 'Danza de Cortes: combo de ráfagas que despedaza.' },
                { name: 'Fūton: Shinkū Taigyoku', rank: 'A', price: 2800, chakra: 100, damage: 150, element: 'wind', description: 'Gran Esfera de Vacío: explosión de presión al impacto.' },
                { name: 'Fūton: Kamaitachi Guren', rank: 'A', price: 2200, chakra: 80, damage: 100, element: 'wind', description: 'Hoz Carmesí: tajos amplios que persiguen al objetivo.' },

                // 🪨
                { name: 'Doton: Ganchūrō', rank: 'A', price: 2400, chakra: 90, damage: 120, element: 'earth', description: 'Prisión de Roca: encierra y presiona hasta quebrar.', effect: 'stun' },
                { name: 'Doton: Chidōkaku', rank: 'A', price: 2600, chakra: 95, damage: 140, element: 'earth', description: 'Terremoto Angular: el suelo se parte bajo el enemigo.' },
                { name: 'Doton: Kōka no Tate', rank: 'A', price: 2000, chakra: 80, damage: 90, element: 'earth', description: 'Escudo Endurecido: defensa extrema que devuelve impacto.', effect: 'defense' },

                // ⚡
                { name: 'Raiton: Raikiri', rank: 'A', price: 2800, chakra: 95, damage: 140, element: 'lightning', description: 'Raikiri: corte letal, más rápido que el sonido.' },
                { name: 'Raiton: Chidori Nagashi', rank: 'A', price: 2500, chakra: 90, damage: 120, element: 'lightning', description: 'Corriente Chidori: descarga alrededor del usuario.', effect: 'stun' },
                { name: 'Raiton: Rairyū no Yoroi', rank: 'A', price: 2200, chakra: 85, damage: 90, element: 'lightning', description: 'Armadura de Rayo: mejora defensa y castiga al contacto.', effect: 'defense' },

                // Neutrales A
                { name: 'Rasengan', rank: 'A', price: 3000, chakra: 90, damage: 130, element: null, description: 'Esfera de chakra puro: impacto devastador a corta distancia.' },
                { name: 'Sensō no Kōdō (Disciplina)', rank: 'A', price: 2500, chakra: 80, damage: 90, element: null, description: 'Entra en “modo combate”: mente fría, golpes más certeros.', effect: 'speed' }
            ],

            // Master (S)
            master: [
                // 🔥
                { name: 'Katon: Amaterasu (Llama Negra)', rank: 'S', price: 6000, chakra: 140, damage: 170, element: 'fire', description: 'Llamas negras que no se apagan. Dolor que persiste.', effect: 'burn_permanent' },
                { name: 'Katon: Tenro no Kiba', rank: 'S', price: 5200, chakra: 150, damage: 180, element: 'fire', description: 'Colmillos del Horno: columnas de fuego que persiguen al objetivo.', effect: 'burn' },

                // 💧
                { name: 'Suiton: Bakusui Shōha', rank: 'S', price: 5200, chakra: 130, damage: 160, element: 'water', description: 'Ola Explosiva: inunda y aplasta el campo de batalla.' },
                { name: 'Suiton: Guren no Nagare', rank: 'S', price: 6000, chakra: 150, damage: 180, element: 'water', description: 'Corriente Carmesí: remolino que tritura y arrastra.', effect: 'stun' },

                // 💨
                { name: 'Fūton: Rasenshuriken', rank: 'S', price: 6000, chakra: 150, damage: 180, element: 'wind', description: 'Rasen-Shuriken: millones de cortes microscópicos.', effect: 'stun' },
                { name: 'Fūton: Kaze Gokui', rank: 'S', price: 5200, chakra: 140, damage: 170, element: 'wind', description: 'Esencia del Viento: huracán concentrado que no deja respirar.' },

                // 🪨
                { name: 'Doton: Dai Ganban Kyū', rank: 'S', price: 5200, chakra: 130, damage: 160, element: 'earth', description: 'Gran Ataúd de Roca: aplastamiento total sin escape.' },
                { name: 'Doton: Jigoku no Saji', rank: 'S', price: 6000, chakra: 150, damage: 180, element: 'earth', description: 'Cuchara del Infierno: columna de roca que pulveriza el área.' },

                // ⚡
                { name: 'Raiton: Kirin', rank: 'S', price: 6000, chakra: 150, damage: 180, element: 'lightning', description: 'Kirin: rayo natural guiado. Una sentencia desde el cielo.' },
                { name: 'Raiton: Shiden', rank: 'S', price: 5200, chakra: 130, damage: 160, element: 'lightning', description: 'Relámpago Púrpura: rayo controlado de alto voltaje.' },

                // Neutrales S (ya existentes)
                { name: 'Edo Tensei', rank: 'S', price: 10000, chakra: 150, damage: 0, element: null, effect: 'revive', description: 'Maestro: Resurrección prohibida' },
                { name: 'Kamui', rank: 'S', price: 8000, chakra: 100, damage: 80, element: null, effect: 'teleport', description: 'Maestro: Espacio-tiempo' },
                { name: 'Tsukuyomi', rank: 'S', price: 7000, chakra: 90, damage: 0, element: null, effect: 'mega_genjutsu', description: 'Maestro: Genjutsu supremo' },
                { name: 'Shinra Tensei', rank: 'S', price: 5000, chakra: 120, damage: 150, element: null, description: 'Rechaza todo' }
            ]
        },

        shopItems: {
            consumables: [
                { name: '🍜 Ramen Ichiraku', price: 50, effect: { hp: 30 }, description: 'Recupera 30 HP' },
                { name: '🍙 Bento', price: 80, effect: { hp: 50 }, description: 'Recupera 50 HP' },
                { name: '💊 Píldora de Chakra', price: 100, effect: { chakra: 50 }, description: 'Recupera 50 Chakra' },
                { name: '💊 Píldora Militar', price: 150, effect: { hp: 80, chakra: 30 }, description: 'Recupera HP y Chakra' },
                { name: '💊 Píldora 3 Colores', price: 300, effect: { buff: true }, description: '+5 stats por 3 turnos' }
            ],
            weapons: [
                { name: '🗡️ Kunai Básico', price: 100, effect: { taijutsu: 2 }, description: '+2 Taijutsu' },
                { name: '🗡️ Kunai Explosivo', price: 250, effect: { taijutsu: 4 }, description: '+4 Taijutsu' },
                { name: '⚔️ Espada Ninja', price: 500, effect: { taijutsu: 6 }, description: '+6 Taijutsu' },
                { name: '⚔️ Katana Chakra', price: 1000, effect: { taijutsu: 8, chakraCost: -10 }, description: '+8 Tai, -10% costo chakra' },
                { name: '🔱 Kubikiribōchō', price: 3000, effect: { taijutsu: 15, lifesteal: true }, description: '+15 Tai, drena HP' }
            ],
            armor: [
                { name: '🛡️ Chaleco Genin', price: 200, effect: { maxHp: 10 }, description: '+10 HP máx' },
                { name: '🛡️ Chaleco Chunin', price: 500, effect: { maxHp: 20, defense: 5 }, description: '+20 HP, +5% defensa' },
                { name: '🛡️ Armadura ANBU', price: 1200, effect: { maxHp: 40, defense: 10 }, description: '+40 HP, +10% defensa' },
                { name: '🛡️ Manto Kage', price: 2500, effect: { maxHp: 60, defense: 15 }, description: '+60 HP, +15% defensa' }
            ]
        },

        training: [
            { name: '💪 Entrenamiento Taijutsu', price: 400, effect: { taijutsu: 3 }, description: '+3 Taijutsu permanente' },
            { name: '🧘 Entrenamiento Ninjutsu', price: 400, effect: { ninjutsu: 3 }, description: '+3 Ninjutsu permanente' },
            { name: '🌀 Entrenamiento Genjutsu', price: 400, effect: { genjutsu: 3 }, description: '+3 Genjutsu permanente' },
            { name: '⚡ Aumentar Chakra', price: 350, effect: { maxChakra: 20 }, description: '+20 Chakra máximo' },
            { name: '❤️ Aumentar HP', price: 350, effect: { maxHp: 15 }, description: '+15 HP máximo' }
        ],

        enemies: {
            genin: [
                { name: 'Bandido', hp: 50, chakra: 20, attack: 12, defense: 6, accuracy: 5, exp: 25, ryo: 50 },
                { name: 'Ninja Renegado Genin', hp: 80, chakra: 40, attack: 15, defense: 8, accuracy: 7, exp: 30, ryo: 75 },
                { name: 'Lobo Salvaje', hp: 60, chakra: 10, attack: 14, defense: 5, accuracy: 8, exp: 28, ryo: 60 }
            ],
            chunin: [
                { name: 'Ninja de la Niebla', hp: 140, chakra: 80, attack: 20, defense: 12, accuracy: 10, exp: 50, ryo: 150 },
                { name: 'Ninja de la Arena', hp: 130, chakra: 90, attack: 22, defense: 11, accuracy: 11, exp: 55, ryo: 160 },
                { name: 'Escuadrón Enemigo (Líder)', hp: 160, chakra: 100, attack: 24, defense: 14, accuracy: 12, exp: 60, ryo: 180 },
                { name: 'Ninja de la Roca', hp: 180, chakra: 70, attack: 26, defense: 16, accuracy: 10, exp: 65, ryo: 200 }
            ],
            jonin: [
                { name: 'Jonin Élite', hp: 220, chakra: 120, attack: 28, defense: 18, accuracy: 14, exp: 80, ryo: 300 },
                { name: 'Jinchuriki Menor', hp: 260, chakra: 150, attack: 32, defense: 20, accuracy: 15, exp: 100, ryo: 400 },
                { name: 'ANBU Renegado', hp: 240, chakra: 140, attack: 30, defense: 22, accuracy: 16, exp: 90, ryo: 350 }
            ],
            akatsuki: [
                { name: 'Hidan', hp: 350, chakra: 180, attack: 38, defense: 25, accuracy: 18, exp: 150, ryo: 800 },
                { name: 'Kakuzu', hp: 400, chakra: 170, attack: 40, defense: 28, accuracy: 19, exp: 160, ryo: 850 },
                { name: 'Sasori', hp: 320, chakra: 200, attack: 36, defense: 24, accuracy: 20, exp: 155, ryo: 820 },
                { name: 'Deidara', hp: 340, chakra: 220, attack: 42, defense: 22, accuracy: 17, exp: 165, ryo: 880 },
                { name: 'Orochimaru', hp: 450, chakra: 250, attack: 45, defense: 30, accuracy: 21, exp: 200, ryo: 1000 }
            ],
            boss: [
                { name: 'Pain (Tendō)', hp: 600, chakra: 300, attack: 50, defense: 35, accuracy: 23, exp: 300, ryo: 2000 },
                { name: 'Madara Uchiha', hp: 800, chakra: 400, attack: 60, defense: 40, accuracy: 25, exp: 500, ryo: 5000 },
                { name: 'Kaguya Ōtsutsuki', hp: 1000, chakra: 500, attack: 70, defense: 45, accuracy: 28, exp: 800, ryo: 10000 },
                { name: 'Zabuza Momochi', hp: 520, chakra: 260, attack: 48, defense: 30, accuracy: 22, exp: 420, ryo: 15000 },
                { name: 'Kisame Hoshigaki', hp: 700, chakra: 420, attack: 58, defense: 38, accuracy: 24, exp: 650, ryo: 25000 }
            ]
        },

        // Enemigos especiales (persecución)
        anbuHunters: [
            { name: 'ANBU Hunter', hp: 260, chakra: 120, attack: 30, defense: 22, accuracy: 16, exp: 120, ryo: 250 },
            { name: 'ANBU Rastreador', hp: 240, chakra: 140, attack: 28, defense: 20, accuracy: 20, exp: 130, ryo: 260 },
            { name: 'ANBU Capitán', hp: 320, chakra: 160, attack: 36, defense: 26, accuracy: 18, exp: 180, ryo: 350 }
        ],

        // Kinjutsu (solo renegados)
        kinjutsu: [
            { id: 'edo_tensei', name: 'EDO TENSEI (Resurrección Impura)', rank: 'S', price: 15000, chakra: 200, damage: 0, element: null, effect: 'revive', description: 'Revive un enemigo derrotado como aliado (1 combate).' },
            { id: 'shiki_fujin', name: 'SHIKI FUJIN (Sello de Muerte)', rank: 'S', price: 10000, chakra: 150, damage: 9999, element: null, effect: 'suicide_kill', description: 'Mata instantáneamente al enemigo, pero pierdes 50% de HP.' },
            { id: 'jashin_ritual', name: 'JASHIN RITUAL (Inmortalidad)', rank: 'S', price: 12000, chakra: 100, damage: 0, element: null, effect: 'immortal_reflect', description: 'No puedes morir por 3 turnos y reflejas parte del daño.' },
            { id: 'kotoamatsukami', name: 'KOTOAMATSUKAMI (Control mental)', rank: 'S', price: 18000, chakra: 180, damage: 0, element: null, effect: 'control', description: 'Controla al enemigo por 2 turnos (pierde acciones).' },
            { id: 'izanagi', name: 'IZANAGI (Reescribir realidad)', rank: 'S', price: 20000, chakra: 250, damage: 0, element: null, effect: 'izanagi', description: 'Si mueres, revives con 100% HP (1 uso por batalla).' },
            { id: 'tanuki_neiri', name: 'TANUKI NEIRI (Robo de Kekkei Genkai)', rank: 'S', price: 50000, chakra: 300, damage: 0, element: null, effect: 'steal_kg', description: 'Copia un Kekkei Genkai tras derrotar un objetivo.' }
        ],

        // Mercado Negro (renegados)
        blackMarketItems: [
            { id: 'pill_prohibida', name: '💊 Píldora Prohibida', price: 2000, description: '+50 todos los stats por 5 turnos. Después: -30 HP', effect: { buffAll: 50, buffTurns: 5, backlashHp: 30 } },
            { id: 'hoja_maldita', name: '🗡️ Hoja Maldita de Orochimaru', price: 5000, description: '+20 Taijutsu, drena chakra al enemigo (pasivo).', effect: { taijutsu: 20 } },
            { id: 'pergamino_kinjutsu', name: '📜 Pergamino de Jutsu Prohibido', price: 8000, description: 'Desbloquea 1 Kinjutsu aleatorio.', effect: { unlockKinjutsu: true } },
            { id: 'suero_hashirama', name: '🧪 Suero de Hashirama', price: 15000, description: 'Desbloquea Mokuton temporal (3 misiones).', effect: { mokutonMissions: 3 } },
            { id: 'sharingan_artificial', name: '👁️ Sharingan Artificial (Danzō)', price: 50000, description: '+15 Genjutsu y 1 Izanagi por día.', effect: { genjutsu: 15, dailyIzanagi: true } }
        ],
        blackMarketServices: [
            { id: 'identity', name: 'Cambiar identidad', price: 1000, description: 'Te quitan del Bingo Book por 7 días.', effect: { hideDays: 7 } },
            { id: 'chakra_surgery', name: 'Cirugía de chakra', price: 5000, description: 'Cambia tu naturaleza elemental.', effect: { changeElement: true } },
            { id: 'cell_implant', name: 'Implante de células', price: 10000, description: '+30 HP/Chakra permanente.', effect: { maxHp: 30, maxChakra: 30 } },
            { id: 'wipe_village', name: 'Borrar memoria de aldea', price: 20000, description: 'Resetea reputación con tu aldea natal.', effect: { resetReputation: true } }
        ],

        // Contratos/Misiones exclusivas renegados
        renegadeContracts: {
            low: [
                { name: '🧨 Robar Suministros', rank: 'C', description: 'Asalta un depósito aislado y desaparece sin dejar rastro.', enemies: [{ type: 'genin', index: 0, count: 2 }], ryo: 300, exp: 50, turns: 2, criminal: true },
                { name: '🛞 Sabotear Caravana', rank: 'C', description: 'Rompe la ruta de comercio. La aldea pagará el precio.', enemies: [{ type: 'genin', index: 1, count: 2 }], ryo: 500, exp: 60, turns: 2, criminal: true },
                { name: '🎭 Secuestro Express', rank: 'C', description: 'Rápido, limpio, aterrador. Cobro inmediato.', enemies: [{ type: 'genin', index: 1, count: 3 }], ryo: 800, exp: 75, turns: 2, criminal: true },
                { name: '🔫 Contrabando de Armas', rank: 'C', description: 'Escolta un cargamento ilícito por rutas secundarias.', enemies: [{ type: 'genin', index: 2, count: 2 }], ryo: 600, exp: 70, turns: 2, criminal: true }
            ],
            mid: [
                { name: '🗡️ Asesinar Comerciante', rank: 'B', description: 'Un mensaje: “deja de vender a Konoha”.', enemies: [{ type: 'chunin', index: 2, count: 2 }], ryo: 2000, exp: 180, turns: 3, criminal: true },
                { name: '📜 Robar Pergamino de Aldea', rank: 'B', description: 'Infiltra y roba un pergamino sellado sin activar alarmas.', enemies: [{ type: 'chunin', index: 1, count: 3 }], ryo: 3000, exp: 220, turns: 4, criminal: true },
                { name: '🔥 Quemar Campos de Cultivo', rank: 'B', description: 'Golpe económico. Que recuerden tu nombre.', enemies: [{ type: 'chunin', index: 0, count: 3 }], ryo: 2500, exp: 200, turns: 3, criminal: true },
                { name: '🔓 Liberar Prisioneros', rank: 'B', description: 'Rompe una caravana de prisioneros y gana aliados.', enemies: [{ type: 'chunin', index: 3, count: 3 }], ryo: 3500, exp: 250, turns: 4, criminal: true },
                { name: '🌉 Destruir Puente Estratégico', rank: 'A', description: 'Un puente cae, la guerra comienza.', enemies: [{ type: 'jonin', index: 0, count: 2 }], ryo: 4000, exp: 300, turns: 4, criminal: true }
            ],
            high: [
                { name: '☠️ Asesinar Jōnin', rank: 'S', description: 'Un objetivo de alto valor. Un golpe y fin.', enemies: [{ type: 'jonin', index: 2, count: 2 }], ryo: 8000, exp: 400, turns: 5, criminal: true },
                { name: '🏺 Robar Arma Legendaria', rank: 'S', description: 'Entra, roba y sal vivo. Eso es todo.', enemies: [{ type: 'akatsuki', index: 2, count: 1 }], ryo: 12000, exp: 600, turns: 6, criminal: true },
                { name: '👑 Secuestrar Hijo de Daimyō', rank: 'S', description: 'La política se compra con miedo.', enemies: [{ type: 'jonin', index: 0, count: 3 }], ryo: 15000, exp: 800, turns: 6, criminal: true },
                { name: '🕊️ Sabotear Cumbre de Paz', rank: 'S', description: 'Que la paz se vuelva ceniza.', enemies: [{ type: 'akatsuki', index: 0, count: 2 }], ryo: 18000, exp: 1000, turns: 7, criminal: true },
                { name: '🏯 Asesinar Kage', rank: 'S', description: 'Un acto que cambia la historia.', enemies: [{ type: 'boss', index: 1, count: 1 }], ryo: 50000, exp: 2000, turns: 8, criminal: true }
            ]
        },

        organizationMissions: {
            akatsuki: [
                { name: '🌑 Capturar Jinchūriki', rank: 'S', description: 'Caza a un portador antes de que escape.', enemies: [{ type: 'boss', index: 0, count: 1 }], ryo: 10000, exp: 500, turns: 6, criminal: true },
                { name: '🩸 Asesinar Kage', rank: 'S', description: 'Un golpe imposible. Eso es lo que buscan.', enemies: [{ type: 'boss', index: 1, count: 1 }], ryo: 15000, exp: 800, turns: 7, criminal: true },
                { name: '🕵️ Infiltrar Aldea', rank: 'S', description: 'Entra como sombra, sal como leyenda.', enemies: [{ type: 'jonin', index: 2, count: 4 }], ryo: 8000, exp: 400, turns: 6, criminal: true },
                { name: '📜 Robar Pergamino Prohibido', rank: 'S', description: 'La información mata más que un kunai.', enemies: [{ type: 'akatsuki', index: 1, count: 1 }], ryo: 12000, exp: 600, turns: 6, criminal: true },
                { name: '🗡️ Eliminar Escuadrón ANBU', rank: 'S', description: 'Cazadores cazados. No dejes testigos.', enemies: [{ type: 'jonin', index: 0, count: 5 }], ryo: 9000, exp: 450, turns: 6, criminal: true }
            ],
            sound: [
                { name: '🐍 Secuestrar para Experimentos', rank: 'S', description: 'Material vivo para Orochimaru.', enemies: [{ type: 'jonin', index: 1, count: 3 }], ryo: 12000, exp: 700, turns: 6, criminal: true },
                { name: '🧪 Probar Jutsu Experimental', rank: 'S', description: 'Riesgo extremo. Sobrevive al sello.', enemies: [{ type: 'akatsuki', index: 4, count: 1 }], ryo: 18000, exp: 1200, turns: 7, criminal: true },
                { name: '🩸 Robar Cuerpos', rank: 'S', description: 'Nada personal. Solo ciencia oscura.', enemies: [{ type: 'jonin', index: 2, count: 4 }], ryo: 7000, exp: 500, turns: 6, criminal: true }
            ],
            root: [
                { name: '👁️ Eliminar objetivo sin testigos', rank: 'S', description: 'Si alguien lo vio, fallaste.', enemies: [{ type: 'jonin', index: 0, count: 4 }], ryo: 12000, exp: 900, turns: 6, criminal: true },
                { name: '🕶️ Operación Encubierta', rank: 'S', description: 'Golpea donde nadie mira.', enemies: [{ type: 'akatsuki', index: 3, count: 1 }], ryo: 16000, exp: 1000, turns: 7, criminal: true }
            ],
            bounty: [
                { name: '💰 BINGO BOOK: Zabuza Momochi', rank: 'S', description: 'Recompensa viva o muerta. Un monstruo en la niebla.', enemies: [{ type: 'boss', index: 3, count: 1 }], ryo: 15000, exp: 800, turns: 6, bounty: true },
                { name: '💰 BINGO BOOK: Kisame Hoshigaki', rank: 'S', description: 'Recompensa altísima. El tiburón humano.', enemies: [{ type: 'boss', index: 4, count: 1 }], ryo: 25000, exp: 1200, turns: 7, bounty: true }
            ]
        },

        missions: {
            genin: [
                { name: '🐾 Huellas en el Barro', rank: 'D', description: 'Un mensajero desapareció cerca del río. Sigue el rastro antes de que anochezca.', enemies: [{ type: 'genin', index: 2, count: 1 }], ryo: 60, exp: 25, turns: 1 },
                { name: '🐈 El Gato del Daimyō (Otra Vez)', rank: 'D', description: 'El famoso gato volvió a escapar. Encuéntralo sin causar un escándalo.', enemies: [{ type: 'genin', index: 0, count: 1 }], ryo: 50, exp: 25, turns: 1 },
                { name: '🧹 Limpieza del Canal Este', rank: 'D', description: 'Bandidos ensucian los canales de Konoha. Dale orden al barrio.', enemies: [{ type: 'genin', index: 0, count: 2 }], ryo: 90, exp: 35, turns: 1 },
                { name: '📦 Paquete Sellado', rank: 'D', description: 'Entrega un paquete con sellos a la puerta norte. No preguntes qué es.', enemies: [{ type: 'genin', index: 0, count: 1 }], ryo: 70, exp: 30, turns: 1 },
                { name: '🍃 Patrulla de los Campos', rank: 'D', description: 'Reportan sombras en los campos. Mantén la calma y protege a los granjeros.', enemies: [{ type: 'genin', index: 2, count: 2 }], ryo: 120, exp: 40, turns: 2 },
                { name: '🧭 Señal Perdida', rank: 'D', description: 'Un kunai marcador se perdió en el bosque. Recupéralo antes de que lo usen.', enemies: [{ type: 'genin', index: 1, count: 1 }], ryo: 140, exp: 45, turns: 2 },
                { name: '🐗 Jabalí Desbocado', rank: 'D', description: 'Un animal salvaje arrasa cultivos. Deténlo sin matar si puedes.', enemies: [{ type: 'genin', index: 2, count: 1 }], ryo: 110, exp: 40, turns: 1 },
                { name: '🧪 Ingredientes del Hospital', rank: 'D', description: 'Recolecta hierbas raras antes de que se marchiten. El tiempo corre.', enemies: [{ type: 'genin', index: 2, count: 2 }], ryo: 150, exp: 50, turns: 2 },
                { name: '🗺️ Mapa Mojado', rank: 'C', description: 'Un mapa de rutas secretas cayó en manos equivocadas. Recupéralo.', enemies: [{ type: 'genin', index: 1, count: 2 }], ryo: 250, exp: 60, turns: 2 },
                { name: '🚶 Escolta de Comerciante', rank: 'C', description: 'Protege la caravana hasta el puesto fronterizo. Habrá emboscada.', enemies: [{ type: 'genin', index: 0, count: 2 }, { type: 'genin', index: 1, count: 1 }], ryo: 300, exp: 70, turns: 2 },
                { name: '🔥 Fuego en el Almacén', rank: 'C', description: 'Incendio provocado en depósitos. Caza a los culpables antes de que huyan.', enemies: [{ type: 'genin', index: 0, count: 3 }], ryo: 280, exp: 65, turns: 2 },
                { name: '🕳️ Trampas en el Camino', rank: 'C', description: 'Alguien está minando rutas de suministro. Desactiva trampas y enfrenta al saboteador.', enemies: [{ type: 'genin', index: 1, count: 2 }], ryo: 320, exp: 75, turns: 2 },
                { name: '📜 Pergamino de Práctica Robado', rank: 'C', description: 'Un pergamino de la Academia fue robado. No debe caer en renegados.', enemies: [{ type: 'genin', index: 1, count: 3 }], ryo: 350, exp: 80, turns: 2 },
                { name: '🌙 Ronda Nocturna (Genin)', rank: 'C', description: 'Rumores de asaltos durante la noche. Resiste el miedo y protege a la aldea.', enemies: [{ type: 'genin', index: 0, count: 3 }], ryo: 380, exp: 80, turns: 2 },
                { name: '🦊 Zorro del Bosque', rank: 'C', description: 'Una bestia astuta roba provisiones. Síguela hasta su guarida.', enemies: [{ type: 'genin', index: 2, count: 3 }], ryo: 400, exp: 80, turns: 2 }
            ],
            chunin: [
                { name: '🛡️ Defensa del Puente de Piedra', rank: 'B', description: 'Un escuadrón enemigo intenta cortar suministros. Mantén la línea.', enemies: [{ type: 'chunin', index: 0, count: 2 }], ryo: 520, exp: 85, turns: 2 },
                { name: '🕵️ Infiltración en Depósito de Armas', rank: 'B', description: 'Entra sin ser visto y marca el depósito para un asalto posterior.', enemies: [{ type: 'chunin', index: 1, count: 2 }], ryo: 650, exp: 100, turns: 3 },
                { name: '🚑 Rescate en Zona Hostil', rank: 'B', description: 'Un equipo aliado quedó atrapado. Extrae a los heridos con vida.', enemies: [{ type: 'chunin', index: 3, count: 2 }], ryo: 700, exp: 110, turns: 3 },
                { name: '🐺 Bestia de Colmillos Negros', rank: 'B', description: 'Un depredador anormal acecha caravanas. Cázalo antes de que migre.', enemies: [{ type: 'chunin', index: 3, count: 1 }], ryo: 560, exp: 90, turns: 2 },
                { name: '📡 Interceptar Mensaje Cifrado', rank: 'B', description: 'Un mensaje enemigo viaja por corredores secretos. Rómpelos y captura al mensajero.', enemies: [{ type: 'chunin', index: 2, count: 2 }], ryo: 780, exp: 120, turns: 3 },
                { name: '🏘️ Aldea Aliada Bajo Asedio', rank: 'B', description: 'Refuerza una aldea vecina. Si caen, la frontera queda abierta.', enemies: [{ type: 'chunin', index: 0, count: 1 }, { type: 'chunin', index: 1, count: 2 }], ryo: 900, exp: 135, turns: 4 },
                { name: '🧨 Desactivar Trampas de Papel Explosivo', rank: 'B', description: 'Un corredor está minado con sellos explosivos. Avanza con precisión.', enemies: [{ type: 'chunin', index: 1, count: 2 }], ryo: 620, exp: 95, turns: 3 },
                { name: '⚔️ Cazar al Desertor', rank: 'B', description: 'Un chunin desertor conoce rutas internas. Tráelo de vuelta… o deténlo.', enemies: [{ type: 'chunin', index: 2, count: 2 }], ryo: 880, exp: 140, turns: 4 },
                { name: '🌫️ Niebla en el Paso del Norte', rank: 'B', description: 'La niebla oculta movimientos enemigos. Descubre la verdad tras el velo.', enemies: [{ type: 'chunin', index: 0, count: 3 }], ryo: 740, exp: 115, turns: 3 },
                { name: '🔒 Recuperar Sellos de Seguridad', rank: 'B', description: 'Robaron sellos de barrera. Si los usan, Konoha queda expuesta.', enemies: [{ type: 'chunin', index: 1, count: 3 }], ryo: 820, exp: 125, turns: 3 },
                { name: '🧭 Escolta de Diplomático', rank: 'A', description: 'Un diplomático viaja con información crítica. La emboscada es segura.', enemies: [{ type: 'jonin', index: 0, count: 1 }], ryo: 1100, exp: 150, turns: 4 },
                { name: '🏚️ Limpieza de Refugio Renegado', rank: 'A', description: 'Un refugio clandestino oculta un pequeño ejército. Borra la amenaza.', enemies: [{ type: 'chunin', index: 0, count: 4 }], ryo: 1000, exp: 145, turns: 4 },
                { name: '🩸 Secuestro en la Ruta del Té', rank: 'A', description: 'Bandidos con apoyo ninja secuestraron a un heredero. Rescátalo sin ruido.', enemies: [{ type: 'chunin', index: 1, count: 2 }, { type: 'chunin', index: 3, count: 1 }], ryo: 1150, exp: 150, turns: 4 },
                { name: '🔥 Incursión Relámpago', rank: 'A', description: 'Golpea un puesto enemigo y retírate antes de que lleguen refuerzos.', enemies: [{ type: 'chunin', index: 2, count: 3 }], ryo: 980, exp: 140, turns: 3 },
                { name: '🕯️ El Testigo Silencioso', rank: 'A', description: 'Un testigo clave está marcado. Protégele hasta el amanecer.', enemies: [{ type: 'jonin', index: 2, count: 1 }], ryo: 1200, exp: 150, turns: 4 }
            ],
            jonin: [
                { name: '🎯 Objetivo de Alto Valor', rank: 'A', description: 'Un estratega enemigo coordina ataques. Elimina la pieza clave.', enemies: [{ type: 'jonin', index: 0, count: 2 }], ryo: 1700, exp: 170, turns: 3 },
                { name: '🗡️ Caza ANBU Renegado', rank: 'A', description: 'Un ANBU desertor dejó la aldea con secretos. No puede escapar.', enemies: [{ type: 'jonin', index: 2, count: 2 }], ryo: 2000, exp: 210, turns: 4 },
                { name: '🏯 Protección de Archivo Vivo', rank: 'A', description: 'Un anciano archivista conoce nombres prohibidos. Protege su memoria.', enemies: [{ type: 'jonin', index: 0, count: 1 }, { type: 'chunin', index: 2, count: 2 }], ryo: 1850, exp: 190, turns: 4 },
                { name: '🌪️ Guerra de Frontera (Escaramuza)', rank: 'A', description: 'Una escaramuza estalla en la frontera. Contén el conflicto antes de que crezca.', enemies: [{ type: 'jonin', index: 1, count: 2 }], ryo: 2300, exp: 240, turns: 5 },
                { name: '🧿 Romper el Genjutsu Masivo', rank: 'A', description: 'Un pueblo entero cayó en ilusión. Encuentra al conductor y corta el hilo.', enemies: [{ type: 'jonin', index: 2, count: 2 }], ryo: 2100, exp: 230, turns: 4 },
                { name: '🚨 Asalto al Laboratorio Secreto', rank: 'S', description: 'Experimentos prohibidos. Destruye el laboratorio y recupera evidencia.', enemies: [{ type: 'akatsuki', index: 4, count: 1 }, { type: 'jonin', index: 2, count: 2 }], ryo: 2800, exp: 300, turns: 5 },
                { name: '🌑 Eliminación Nocturna', rank: 'A', description: 'Un asesino jonin opera solo de noche. Cázalo en su terreno.', enemies: [{ type: 'jonin', index: 0, count: 3 }], ryo: 2400, exp: 260, turns: 5 },
                { name: '📜 Pergamino de Sangre', rank: 'A', description: 'Un pergamino maldito circula. Recupera el sello y quémalo en altar.', enemies: [{ type: 'jonin', index: 1, count: 2 }], ryo: 1950, exp: 200, turns: 4 },
                { name: '🧭 Escolta del Jinchūriki Menor', rank: 'S', description: 'Movimiento delicado. Protege a un portador inestable durante el traslado.', enemies: [{ type: 'jonin', index: 1, count: 3 }], ryo: 3000, exp: 300, turns: 5 },
                { name: '🧨 Desmantelar Red de Explosivos', rank: 'A', description: 'Un corredor está listo para volar. Cortar la red salvará cientos.', enemies: [{ type: 'jonin', index: 0, count: 2 }], ryo: 1750, exp: 180, turns: 3 },
                { name: '☁️ Asalto al Escuadrón de Nube', rank: 'S', description: 'Un escuadrón élite cruza territorio. Rompe su avance antes del amanecer.', enemies: [{ type: 'jonin', index: 0, count: 4 }], ryo: 2900, exp: 290, turns: 5 },
                { name: '🕳️ Caverna del Eco', rank: 'A', description: 'Desaparecen patrullas en una caverna. La oscuridad es una trampa viva.', enemies: [{ type: 'jonin', index: 2, count: 3 }], ryo: 2200, exp: 240, turns: 4 },
                { name: '📦 Intercepción de Contrabando de Jutsu', rank: 'A', description: 'Contrabando de pergaminos avanzados. Captura el lote y al líder.', enemies: [{ type: 'jonin', index: 0, count: 1 }, { type: 'chunin', index: 1, count: 3 }], ryo: 2500, exp: 260, turns: 4 },
                { name: '🩸 Venganza de los Renegados', rank: 'S', description: 'Un clan renegado juró venganza. Detén la masacre antes de que empiece.', enemies: [{ type: 'akatsuki', index: 2, count: 1 }], ryo: 2700, exp: 280, turns: 4 },
                { name: '🏹 Protege al Daimyō (Alto Riesgo)', rank: 'A', description: 'Asesinos de élite atacan el convoy. No hay segundas oportunidades.', enemies: [{ type: 'jonin', index: 2, count: 2 }, { type: 'jonin', index: 0, count: 1 }], ryo: 2600, exp: 270, turns: 5 }
            ],
            kage: [
                { name: '☠️ Célula Akatsuki: “El Ritual”', rank: 'S', description: 'Un miembro de Akatsuki prepara un ritual. Interrúmpelo o la aldea sangrará.', enemies: [{ type: 'akatsuki', index: 0, count: 1 }], ryo: 5000, exp: 500, turns: 5 },
                { name: '🕸️ Cosechador de Corazones', rank: 'S', description: 'Un enemigo inmortal acumula corazones. Corta su red y sobrevívelo.', enemies: [{ type: 'akatsuki', index: 1, count: 1 }], ryo: 6500, exp: 650, turns: 6 },
                { name: '🦂 Marionetas Carmesí', rank: 'S', description: 'Una ciudad cae ante veneno y marionetas. Encuentra al titiritero.', enemies: [{ type: 'akatsuki', index: 2, count: 1 }], ryo: 7000, exp: 700, turns: 6 },
                { name: '💥 Arte Explosivo en la Frontera', rank: 'S', description: 'Explosiones selladas destruyen puestos aliados. Caza al artista.', enemies: [{ type: 'akatsuki', index: 3, count: 1 }], ryo: 8000, exp: 800, turns: 6 },
                { name: '🐍 Sombras del Laboratorio', rank: 'S', description: 'Experimentos prohibidos despiertan. Cierra el laboratorio y destruye registros.', enemies: [{ type: 'akatsuki', index: 4, count: 1 }], ryo: 9000, exp: 900, turns: 7 },
                { name: '🏯 Invasión de Pain (Primer Asalto)', rank: 'S', description: 'El cielo se parte. Detén el primer cuerpo antes de que la aldea colapse.', enemies: [{ type: 'boss', index: 0, count: 1 }], ryo: 12000, exp: 1100, turns: 8 },
                { name: '🌑 Operación “Silencio ANBU”', rank: 'S', description: 'Un traidor filtra secretos. Infiltra su red y bórrala sin testigos.', enemies: [{ type: 'jonin', index: 2, count: 4 }], ryo: 6000, exp: 600, turns: 6 },
                { name: '🌩️ Tormenta sobre la Cumbre', rank: 'S', description: 'Reunión de kages bajo ataque. Evita una guerra total.', enemies: [{ type: 'akatsuki', index: 3, count: 1 }, { type: 'jonin', index: 0, count: 2 }], ryo: 10000, exp: 950, turns: 7 },
                { name: '🔥 Sellos del Kyūbi (Barrera Fracturada)', rank: 'S', description: 'La barrera se debilita. Repara los sellos mientras te cazan.', enemies: [{ type: 'akatsuki', index: 0, count: 2 }], ryo: 11000, exp: 1000, turns: 7 },
                { name: '🩸 Guerra Relámpago en Dos Frentes', rank: 'S', description: 'Dos aldeas atacan al mismo tiempo. Decide rápido o perderás todo.', enemies: [{ type: 'jonin', index: 0, count: 5 }], ryo: 9000, exp: 900, turns: 6 },
                { name: '🪐 El Ojo del Uchiha Legendario', rank: 'S', description: 'Una presencia aplasta la voluntad. Sobrevive y detén al titán.', enemies: [{ type: 'boss', index: 1, count: 1 }], ryo: 15000, exp: 1300, turns: 8 },
                { name: '🌕 Noche de Luna Roja', rank: 'S', description: 'Una técnica prohibida se activa con la luna. Rompe el ritual antes del amanecer.', enemies: [{ type: 'akatsuki', index: 1, count: 1 }, { type: 'akatsuki', index: 0, count: 1 }], ryo: 14000, exp: 1200, turns: 7 },
                { name: '🧊 País de la Nieve: Eclipse Blanco', rank: 'S', description: 'El frío es una prisión. Recupera un artefacto sellado en tormenta.', enemies: [{ type: 'jonin', index: 1, count: 4 }], ryo: 8000, exp: 850, turns: 6 },
                { name: '🗿 Valle del Fin: Ruptura de Paz', rank: 'S', description: 'Un choque histórico amenaza repetirse. Evita que el valle sea tumba otra vez.', enemies: [{ type: 'akatsuki', index: 2, count: 1 }], ryo: 9500, exp: 900, turns: 6 },
                { name: '🌌 Guerra Ninja Final (Umbral)', rank: 'S', description: 'La realidad se abre. Lucha contra lo imposible y protege el mundo.', enemies: [{ type: 'boss', index: 2, count: 1 }], ryo: 20000, exp: 1500, turns: 8 }
            ]
        },
};
