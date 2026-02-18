/**
 * SAVE MANAGER - Sistema de Guardado y Carga
 * ==========================================
 * 
 * RESPONSABILIDAD:
 * - saveGame() / loadGame() - Persistencia en localStorage
 * - migratePlayerSave() - Garantizar que NO hay propiedades undefined
 * - Validación y sanitización de datos
 * 
 * DEPENDENCIAS:
 * - Ninguna (módulo base)
 * 
 * NOTA: Este módulo se integra con el game object central
 */

export class SaveManager {
    constructor(gameObject) {
        this.game = gameObject;
        this.STORAGE_KEY = 'ninjaRPGSave';
    }

    /**
     * Guarda el estado completo del juego
     * @returns {boolean} - true si se guardó correctamente
     */
    saveGame() {
        try {
            // Preparar save data
            const saveData = {
                timestamp: new Date().toISOString(),
                player: this.game.player || {},
                currentMission: this.game.currentMission || null,
                enemyQueue: Array.isArray(this.game.enemyQueue) ? this.game.enemyQueue : [],
                currentEnemy: this.game.currentEnemy || null,
                totalWaves: typeof this.game.totalWaves === 'number' ? this.game.totalWaves : 0,
                currentWave: typeof this.game.currentWave === 'number' ? this.game.currentWave : 0,
                settings: this.game.settings || {}
            };

            // Serializar a JSON
            const jsonString = JSON.stringify(saveData);
            
            // Guardar en localStorage
            localStorage.setItem(this.STORAGE_KEY, jsonString);
            
            console.log('💾 Game saved successfully');
            return true;
        } catch (e) {
            console.error('❌ Save error:', e);
            return false;
        }
    }

    /**
     * Carga el estado del juego desde localStorage
     * @returns {Object|null} - Datos del juego o null si no hay save
     */
    loadGame() {
        try {
            const jsonString = localStorage.getItem(this.STORAGE_KEY);
            if (!jsonString) {
                console.log('ℹ️ No save found');
                return null;
            }

            const saveData = JSON.parse(jsonString);

            // Aplicar migraciones
            this.migratePlayerSave(saveData.player);

            // Restaurar estado de combate si hay misión activa y datos válidos
            if (saveData.currentMission) {
                const hasCombatState = Array.isArray(saveData.enemyQueue) && saveData.currentEnemy && typeof saveData.totalWaves === 'number' && typeof saveData.currentWave === 'number';
                if (hasCombatState) {
                    this.game.currentMission = saveData.currentMission;
                    this.game.enemyQueue = saveData.enemyQueue;
                    this.game.currentEnemy = saveData.currentEnemy;
                    this.game.totalWaves = saveData.totalWaves;
                    this.game.currentWave = saveData.currentWave;
                } else {
                    // Si falta algo, limpiar misión para evitar corrupción
                    this.game.currentMission = null;
                    this.game.enemyQueue = [];
                    this.game.currentEnemy = null;
                    this.game.totalWaves = 0;
                    this.game.currentWave = 0;
                }
            } else {
                this.game.currentMission = null;
                this.game.enemyQueue = [];
                this.game.currentEnemy = null;
                this.game.totalWaves = 0;
                this.game.currentWave = 0;
            }

            console.log('📂 Game loaded successfully');
            return saveData;
        } catch (e) {
            console.error('❌ Load error:', e);
            return null;
        }
    }

    /**
     * Borra el save actual
     * @returns {boolean}
     */
    deleteSave() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            console.log('🗑️ Save deleted');
            return true;
        } catch (e) {
            console.error('❌ Delete error:', e);
            return false;
        }
    }

    /**
     * MIGRACIÓN ROBUSTA: Asegura que todas las propiedades existan
     * con valores sensatos por defecto
     * @param {Object} player - Objeto del jugador a migrar
     */
    migratePlayerSave(player) {
        if (!player) return {};

        // Propiedades básicas con defaults
        const defaults = {
            // Identidad
            name: player.name || 'Ninja',
            clanKey: player.clanKey || 'uchiha',
            village: player.village || 'konoha',
            rank: player.rank || 'Genin',
            
            // Stats numéricos
            level: player.level ?? 1,
            exp: player.exp ?? 0,
            expToNext: player.expToNext ?? 100,
            
            hp: player.hp ?? 100,
            maxHp: player.maxHp ?? 100,
            chakra: player.chakra ?? 100,
            maxChakra: player.maxChakra ?? 100,
            
            taijutsu: player.taijutsu ?? 5,
            ninjutsu: player.ninjutsu ?? 5,
            genjutsu: player.genjutsu ?? 5,
            
            // Economía
            ryo: player.ryo ?? 0,
            
            // Kekkei Genkai
            kekkeiGenkai: player.kekkeiGenkai || null,
            kekkeiLevel: player.kekkeiLevel ?? 1,
            kekkeiExp: player.kekkeiExp ?? 0,
            
            // Jutsus
            learnedJutsus: player.learnedJutsus || [],
            equippedJutsus: player.equippedJutsus || [],
            
            // Inventario
            items: player.items || [],
            equippedWeapon: player.equippedWeapon || null,
            
            // Estado de misiones
            completedMissions: player.completedMissions || [],
            failedMissions: player.failedMissions || [],
            missionsCompletedByRank: player.missionsCompletedByRank || { D: 0, C: 0, B: 0, A: 0, S: 0, U: 0, F: 0 },
            missionsCompletedTotal: player.missionsCompletedTotal ?? 0,
            missionsCompletedBPlus: player.missionsCompletedBPlus ?? 0,
            missionsCompletedSWhileChunin: player.missionsCompletedSWhileChunin ?? 0,
            
            // Relaciones
            relationships: player.relationships || {},
            reputation: player.reputation || { konoha: 0, hidden_mist: 0, hidden_cloud: 0, hidden_sand: 0, hidden_stone: 0 },
            
            // Modo renegado
            isRenegade: player.isRenegade ?? false,
            karma: player.karma ?? 0,
            wantedLevel: player.wantedLevel ?? 0,
            criminalMissions: player.criminalMissions ?? 0,
            
            // Estado especial
            day: player.day ?? 1,
            // Prioriza player.location, luego player.village, luego 'konoha'
            location: player.location || player.village || 'konoha',
            isSleeping: player.isSleeping ?? false,
            sleepEnd: player.sleepEnd ?? null,
            
            // Exámenes
            examsAvailable: player.examsAvailable || [],
            examsCompleted: player.examsCompleted || [],
            
            // Pendientes
            pendingStealKg: player.pendingStealKg ?? false,
            urgentMission: player.urgentMission || null,
            authProfile: player.authProfile || null,
        };

        // Aplicar defaults al objeto
        Object.assign(player, defaults);
        // Ya no muta this.game.player aquí
        console.log('✅ Player save migrated');
        return player;
    }

    /**
     * Exporta el save como JSON (para debug/backup)
     * @returns {string}
     */
    exportSave() {
        try {
            const saveData = localStorage.getItem(this.STORAGE_KEY);
            if (!saveData) return null;
            
            // Format bonito para copiar
            return JSON.stringify(JSON.parse(saveData), null, 2);
        } catch (e) {
            console.error('❌ Export error:', e);
            return null;
        }
    }

    /**
     * Importa un save desde JSON
     * @param {string} jsonString - El JSON del save
     * @returns {boolean}
     */
    importSave(jsonString) {
        try {
            const saveData = JSON.parse(jsonString);
            
            // Validar estructura mínima
            if (!saveData.player || !saveData.player.name) {
                throw new Error('Invalid save format');
            }
            
            // Migrar antes de guardar
            this.migratePlayerSave(saveData.player);
            
            // Guardar
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(saveData));
            
            console.log('✅ Save imported');
            return true;
        } catch (e) {
            console.error('❌ Import error:', e);
            return false;
        }
    }

    /**
     * Verifica si existe un save
     * @returns {boolean}
     */
    hasSave() {
        return localStorage.getItem(this.STORAGE_KEY) !== null;
    }

    /**
     * Obtiene info del save sin cargarlo completamente
     * @returns {Object|null} - { name, timestamp, village, rank }
     */
    getSaveInfo() {
        try {
            const jsonString = localStorage.getItem(this.STORAGE_KEY);
            if (!jsonString) return null;
            
            const saveData = JSON.parse(jsonString);
            const player = saveData.player;
            
            return {
                name: player.name,
                timestamp: saveData.timestamp,
                village: player.village,
                rank: player.rank,
                level: player.level,
                ryo: player.ryo
            };
        } catch (e) {
            console.error('❌ Error getting save info:', e);
            return null;
        }
    }

    /**
     * Limpia referencias en el game object después de cargar
     */
    clearSaveReferences() {
        this.game.currentMission = null;
        this.game.currentEnemy = null;
        this.game.enemyQueue = [];
    }
}
