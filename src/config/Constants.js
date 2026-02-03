/**
 * Game Constants
 * Central location for all game configuration values
 * Following KISS principle: All magic numbers in one place
 */

const GAME_CONSTANTS = {
    // ==================== GAME DIMENSIONS ====================
    GAME_WIDTH: 800,
    GAME_HEIGHT: 600,
    
    // ==================== CORRIDOR LAYOUT ====================
    CORRIDOR: {
        LEFT_BORDER: 150,
        RIGHT_BORDER: 650,
        CENTER: 400,
        LEFT_SPAWN_MIN: 170,
        LEFT_SPAWN_MAX: 370,
        RIGHT_SPAWN_MIN: 430,
        RIGHT_SPAWN_MAX: 630,
        PASSAGE_Y: 445,
        PASSAGE_HEIGHT: 50
    },
    
    // ==================== PLAYER SETTINGS ====================
    PLAYER: {
        START_X: 250,
        START_Y: 445,
        WIDTH: 40,
        HEIGHT: 50,
        SPEED: 8,
        MIN_X: 160,
        MAX_X: 640,
        COLOR: 0x0088ff,
        STARTING_ARMY: 1
    },
    
    // ==================== ENEMY SETTINGS ====================
    ENEMY: {
        WIDTH: 40,
        HEIGHT: 45,
        BASE_SPEED: 100,
        CHASE_SPEED: 80,
        HP: 3,
        COLOR: 0xff0000,
        POINTS: 25
    },
    
    // ==================== BULLET SETTINGS ====================
    BULLET: {
        WIDTH: 6,
        HEIGHT: 20,
        SPEED: -400, // Negative = upward
        COLOR: 0xffff00,
        FIRE_RATE: 250 // milliseconds
    },
    
    // ==================== BONUS SETTINGS ====================
    BONUS: {
        RADIUS: 22,
        SPEED: 80,
        BASE_SCORE: 15,
        // Progressive values by wave
        TIERS: [
            { maxWave: 5, value: 1, color: 0x00ff00, text: '+1' },
            { maxWave: 10, value: 2, color: 0x00ff88, text: '+2' },
            { maxWave: 15, value: 3, color: 0x00ffcc, text: '+3' },
            { maxWave: 20, value: 5, color: 0x00ffff, text: '+5' },
            { maxWave: Infinity, value: 10, color: 0xffff00, text: '+10' }
        ]
    },
    
    // ==================== WAVE PROGRESSION ====================
    WAVES: {
        BASE_INTERVAL: 5000, // 5 seconds
        MIN_INTERVAL: 3000,   // 3 seconds minimum
        INTERVAL_REDUCTION: 100, // Per wave
        MAX_REDUCTION: 2000,
        
        // Enemy count per wave range
        ENEMIES_PER_WAVE: [
            { maxWave: 3, count: 2 },
            { maxWave: 6, count: 3 },
            { maxWave: 10, count: 4 },
            { maxWave: 15, count: 5 },
            { maxWave: Infinity, count: 6 }
        ],
        
        // Bonus spawn chance progression
        BASE_BONUS_CHANCE: 0.2,  // 20%
        MAX_BONUS_CHANCE: 0.4,    // 40%
        BONUS_CHANCE_INCREASE: 0.02 // Per wave
    },
    
    // ==================== SPAWN TIMINGS ====================
    SPAWN: {
        ENEMY_SPACING: 700,  // milliseconds between enemies in horde
        BONUS_DELAY: 1200,   // milliseconds after horde spawn
        INITIAL_HORDE_1: 100,
        INITIAL_HORDE_2: 3000,
        INITIAL_HORDE_3: 6000,
        INITIAL_BONUS_1: 2000,
        INITIAL_BONUS_2: 5000
    },
    
    // ==================== VISUAL EFFECTS ====================
    EFFECTS: {
        EXPLOSION_SIZE: 50,
        EXPLOSION_DURATION: 500,
        HIT_FLASH_DURATION: 50,
        BONUS_FLASH_SIZE: 40,
        STAR_COUNT: 30,
        STAR_SPEED_MIN: 30,
        STAR_SPEED_MAX: 100
    },
    
    // ==================== BARRIER SETTINGS ====================
    BARRIER: {
        TOP_Y: 200,
        TOP_HEIGHT: 350,
        BOTTOM_Y: 500,
        BOTTOM_HEIGHT: 150,
        WIDTH: 15,
        COLOR: 0xff0000
    }
};

// Freeze object to prevent accidental modifications
Object.freeze(GAME_CONSTANTS);
