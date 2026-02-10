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
        // Game borders
        LEFT_BORDER: 50,
        RIGHT_BORDER: 750,

        // Left bonus corridor
        LEFT_BONUS_MIN: 60,
        LEFT_BONUS_MAX: 120,
        LEFT_BARRIER: 150,

        // Large central enemy corridor (no center barrier!)
        ENEMY_MIN: 180,
        ENEMY_MAX: 620,

        // Right bonus corridor
        RIGHT_BARRIER: 650,
        RIGHT_BONUS_MIN: 680,
        RIGHT_BONUS_MAX: 740,

        // Passages
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
        MIN_X: 60,
        MAX_X: 740,
        COLOR: 0x0088ff,
        STARTING_ARMY: 1
    },
    
    // ==================== ENEMY SETTINGS ====================
    ENEMY: {
        WIDTH: 40,
        HEIGHT: 45,
        BASE_SPEED: 100,
        CHASE_SPEED: 80,
        HP: 2, // Reduced from 3 to 2 for easier early game
        HP_INCREASE_PER_WAVE: 1,  // +1 HP per wave
        SPEED_INCREASE_PER_WAVE: 2, // +2 speed per wave
        COLOR: 0xff0000,
        POINTS: 10 // Reduced from 25 to 10 for better balance
    },

    // ==================== BOSS SETTINGS ====================
    BOSS: {
        WIDTH: 80,
        HEIGHT: 90,
        BASE_SPEED: 50,
        CHASE_SPEED: 40,
        HP: 100,              // Base HP for first boss
        HP_INCREASE_PER_BOSS: 75, // +75 HP per boss (increased from 50)
        SPEED_INCREASE_PER_BOSS: 8, // +8 speed per boss (increased from 5)
        DAMAGE_INCREASE_PER_BOSS: 2, // +2 damage per boss (NEW)
        SIZE_INCREASE_PER_BOSS: 10, // +10 pixels per boss (NEW)
        COLOR: 0xff6600,
        POINTS: 500,
        POINTS_MULTIPLIER_PER_BOSS: 200, // +200 points per boss (NEW)
        DAMAGE: 5,            // Base damage for first boss
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
        BASE_DAMAGE: 2, // Increased from 1 to 2 for easier start
        // Fire rate improvement: -10ms per army point (faster shooting)
        FIRE_RATE_DECREASE_PER_ARMY: 10,
        MIN_FIRE_RATE: 50, // Minimum fire rate (max speed)
        // Damage increase: +0.3 damage per army point (reduced from 1 for better balance)
        DAMAGE_PER_ARMY: 0.3
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
            { maxWave: Infinity, value: 5, color: 0x00ffff, text: '+5' }
        ]
    },

    // ==================== POWER-UP SETTINGS ====================
    POWERUP: {
        DURATION: 15000, // 15 seconds in milliseconds

        // Progressive spawn chance (increases with waves)
        BASE_SPAWN_CHANCE: 0.05, // 5% at wave 1
        MAX_SPAWN_CHANCE: 0.20,  // 20% maximum
        SPAWN_CHANCE_INCREASE: 0.01, // +1% per wave

        // Triple Shot power-up
        TRIPLE_SHOT: {
            COLOR: 0xff00ff, // Magenta
            ANGLE_SPREAD: 15, // Degrees from center
            ICON: '3X'
        },

        // Big Bullets power-up
        BIG_BULLETS: {
            COLOR: 0x00ffff, // Cyan
            SIZE_MULTIPLIER: 2.5, // 2.5x bullet size
            DAMAGE_MULTIPLIER: 1.5, // 1.5x damage boost
            ICON: 'BIG'
        },

        // Combo bonus when both active
        COMBO: {
            COLOR: 0xffffff, // White
            ICON: 'COMBO!'
        },

        // Shield Trap power-up
        SHIELD_TRAP: {
            COLOR: 0xffaa00, // Orange
            ICON: 'SHIELD',
            SHIELD_RADIUS: 35 // Visual shield radius around player
        },

        // Clone power-up
        CLONE: {
            COLOR: 0x00ff88, // Green-cyan
            ICON: 'CLONE',
            OFFSET_X: 60, // Distance from player in pixels
            ALPHA: 0.7 // Clone transparency
        },

        // Speed Boost power-up
        SPEED_BOOST: {
            COLOR: 0xffff00, // Yellow
            ICON: 'SPEED',
            SPEED_MULTIPLIER: 1.75 // 1.75x movement speed
        },

        // Rapid Fire power-up
        RAPID_FIRE: {
            COLOR: 0xff0000, // Red
            ICON: 'RAPID',
            FIRE_RATE_MULTIPLIER: 0.5 // 2x faster shooting (50% of normal fire rate)
        }
    },
    
    // ==================== WAVE PROGRESSION ====================
    WAVES: {
        BASE_INTERVAL: 4000,  // Reduced from 5000 - faster spawns
        MIN_INTERVAL: 1500,   // Reduced from 3000 - much faster at high waves
        INTERVAL_REDUCTION: 150, // Increased from 100 - faster acceleration
        MAX_REDUCTION: 2500,  // Increased from 2000

        // Enemy count per wave range - Progressive difficulty
        ENEMIES_PER_WAVE: [
            { maxWave: 3, count: 2 },   // Early game
            { maxWave: 8, count: 3 },   // Gradual increase
            { maxWave: 15, count: 4 },  // Mid-game
            { maxWave: 25, count: 6 },  // Wave 20 now has 6 enemies instead of 10
            { maxWave: Infinity, count: 8 } // Late game (reduced from 10 to 8)
        ],

        // Bonus spawn chance progression (decreases over time for harder gameplay)
        BASE_BONUS_CHANCE: 0.80,  // 80% - high bonus rate early game
        MIN_BONUS_CHANCE: 0.15,   // 15% - minimum chance for late game
        BONUS_CHANCE_DECREASE: 0.020 // Slower decrease for more bonuses throughout the game
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
