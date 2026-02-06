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
        CENTER: 500,  // Moved from 400 to 500 (1/4 to the right)
        LEFT_SPAWN_MIN: 170,
        LEFT_SPAWN_MAX: 490,  // Adjusted for new center
        RIGHT_SPAWN_MIN: 510, // Adjusted for new center
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
        HP_INCREASE_PER_WAVE: 1,  // +1 HP per wave
        SPEED_INCREASE_PER_WAVE: 2, // +2 speed per wave
        COLOR: 0xff0000,
        POINTS: 25
    },

    // ==================== BOSS SETTINGS ====================
    BOSS: {
        WIDTH: 80,
        HEIGHT: 90,
        BASE_SPEED: 50,
        CHASE_SPEED: 40,
        HP: 100,              // Increased from 50 - much tougher
        HP_INCREASE_PER_BOSS: 50, // +50 HP per boss encounter
        SPEED_INCREASE_PER_BOSS: 5, // +5 speed per boss
        COLOR: 0xff6600,
        POINTS: 500,
        DAMAGE: 5,            // Increased from 3 - more dangerous
        SPAWN_INTERVAL: 10,   // Boss every 10 waves
        // Death explosion AOE
        EXPLOSION_RADIUS: 150, // Radius of damage zone
        EXPLOSION_DAMAGE: 10   // Damage dealt to nearby enemies
    },
    
    // ==================== BULLET SETTINGS ====================
    BULLET: {
        WIDTH: 6,
        HEIGHT: 20,
        SPEED: -400, // Negative = upward
        COLOR: 0xffff00,
        BASE_FIRE_RATE: 250, // Base fire rate in milliseconds
        BASE_DAMAGE: 1, // Base damage per bullet
        // Fire rate improvement: -10ms per army point (faster shooting)
        FIRE_RATE_DECREASE_PER_ARMY: 10,
        MIN_FIRE_RATE: 50, // Minimum fire rate (max speed)
        // Damage increase: +1 damage per army point
        DAMAGE_PER_ARMY: 1
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
        BASE_INTERVAL: 4000,  // Reduced from 5000 - faster spawns
        MIN_INTERVAL: 1500,   // Reduced from 3000 - much faster at high waves
        INTERVAL_REDUCTION: 150, // Increased from 100 - faster acceleration
        MAX_REDUCTION: 2500,  // Increased from 2000

        // Enemy count per wave range - MORE ENEMIES
        ENEMIES_PER_WAVE: [
            { maxWave: 2, count: 3 },   // Increased from 2
            { maxWave: 5, count: 4 },   // Increased from 3
            { maxWave: 8, count: 6 },   // Increased from 4
            { maxWave: 12, count: 8 },  // Increased from 5
            { maxWave: Infinity, count: 10 } // Increased from 6
        ],

        // Bonus spawn chance progression
        BASE_BONUS_CHANCE: 0.25,  // 25% - slightly increased
        MAX_BONUS_CHANCE: 0.35,   // 35% - max chance
        BONUS_CHANCE_INCREASE: 0.015 // Per wave
    },
    
    // ==================== SPAWN TIMINGS ====================
    SPAWN: {
        ENEMY_SPACING: 400,  // Reduced from 700 - enemies spawn faster in groups
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
