import { GAME_CONSTANTS } from '../config/Constants.js';
import { GameSceneSetup } from './GameSceneSetup.js';
import { GameSceneSpawning } from './GameSceneSpawning.js';
import { GameSceneCollisions } from './GameSceneCollisions.js';
import { GameSceneEffects } from './GameSceneEffects.js';
import { GameSceneUI } from './GameSceneUI.js';

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');

        // Game state
        this.state = {
            status: 'playing', // 'playing' | 'paused' | 'over'
            playerArmy: GAME_CONSTANTS.PLAYER.STARTING_ARMY,
            score: 0,
            wave: 1,
            gameTime: 0,
            armyCap: GAME_CONSTANTS.ARMY_CAP.STARTING,
            nextCapIncreaseTime: GAME_CONSTANTS.ARMY_CAP.INTERVAL
        };

        // Entity arrays
        this.entities = {
            player: null,
            enemies: [],
            bosses: [],
            bullets: [],
            bonuses: [],
            powerUps: [],
            stars: [],
            clones: []
        };

        // Timers
        this.timers = {
            shoot: 0,
            spawn: 0
        };

        // Power-up state (data-driven)
        this.activePowerUps = {};
        GAME_CONSTANTS.POWERUP.TYPES.forEach(type => {
            this.activePowerUps[type] = { active: false, timer: 0 };
        });
        this.shieldGraphics = null;

        // === Legacy accessors for backward compatibility with modules ===
        this._setupLegacyAccessors();
    }

    _setupLegacyAccessors() {
        // These properties delegate to the new grouped structure so existing
        // module code (Collisions, Spawning, UI, Effects) keeps working.
        const stateProps = ['score', 'wave', 'gameTime', 'armyCap', 'nextCapIncreaseTime'];
        stateProps.forEach(prop => {
            Object.defineProperty(this, prop, {
                get() { return this.state[prop]; },
                set(v) { this.state[prop] = v; }
            });
        });
        Object.defineProperty(this, 'playerArmy', {
            get() { return this.state.playerArmy; },
            set(v) { this.state.playerArmy = v; }
        });
        Object.defineProperty(this, 'gameState', {
            get() { return this.state.status; },
            set(v) { this.state.status = v; }
        });

        const entityProps = ['enemies', 'bosses', 'bullets', 'bonuses', 'powerUps', 'stars', 'clones'];
        entityProps.forEach(prop => {
            Object.defineProperty(this, prop, {
                get() { return this.entities[prop]; },
                set(v) { this.entities[prop] = v; }
            });
        });
        Object.defineProperty(this, 'player', {
            get() { return this.entities.player; },
            set(v) { this.entities.player = v; }
        });

        // Power-up legacy accessors
        const powerUpMap = {
            'tripleShotActive':  { type: 'TRIPLE_SHOT', field: 'active' },
            'tripleShotTimer':   { type: 'TRIPLE_SHOT', field: 'timer' },
            'bigBulletsActive':  { type: 'BIG_BULLETS', field: 'active' },
            'bigBulletsTimer':   { type: 'BIG_BULLETS', field: 'timer' },
            'shieldTrapActive':  { type: 'SHIELD_TRAP', field: 'active' },
            'shieldTrapTimer':   { type: 'SHIELD_TRAP', field: 'timer' },
            'cloneActive':       { type: 'CLONE', field: 'active' },
            'cloneTimer':        { type: 'CLONE', field: 'timer' },
            'speedBoostActive':  { type: 'SPEED_BOOST', field: 'active' },
            'speedBoostTimer':   { type: 'SPEED_BOOST', field: 'timer' },
            'rapidFireActive':   { type: 'RAPID_FIRE', field: 'active' },
            'rapidFireTimer':    { type: 'RAPID_FIRE', field: 'timer' }
        };
        Object.entries(powerUpMap).forEach(([prop, { type, field }]) => {
            Object.defineProperty(this, prop, {
                get() { return this.activePowerUps[type][field]; },
                set(v) { this.activePowerUps[type][field] = v; }
            });
        });
    }

    create() {
        console.log("Game Scene Created");

        // Clean up any previous game over UI
        GameSceneUI.cleanupGameOver();

        // Setup scene
        GameSceneSetup.createBackground(this);
        GameSceneSetup.createBarriers(this);
        GameSceneSetup.createStars(this, this.entities.stars);

        // Create player
        this.entities.player = GameSceneSetup.createPlayer(this);

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Initial spawns
        GameSceneSpawning.spawnInitialWaves(this);

        // Update UI
        GameSceneUI.updateUI(this);
    }

    update(time, delta) {
        // Check for restart when game is over
        if (this.state.status === 'over') {
            if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
                window.location.reload();
            }
            return;
        }

        // Check for pause toggle
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            if (this.state.status === 'playing') {
                this.state.status = 'paused';
                GameSceneUI.showPause(this);
                return;
            } else if (this.state.status === 'paused') {
                this.state.status = 'playing';
                GameSceneUI.hidePause(this);
                return;
            }
        }

        if (this.state.status !== 'playing') return;

        const dt = delta / 1000;

        // Update game timer
        this.state.gameTime += delta;
        GameSceneUI.updateGameTime(this);

        // Check for army cap increase
        if (this.state.gameTime >= this.state.nextCapIncreaseTime) {
            this.state.armyCap += GAME_CONSTANTS.ARMY_CAP.INCREASE;
            this.state.nextCapIncreaseTime += GAME_CONSTANTS.ARMY_CAP.INTERVAL;
            GameSceneEffects.showArmyCapIncrease(this, this.state.armyCap);
            GameSceneUI.updateUI(this);
        }

        // Update stars
        this.updateStars(dt);

        // Player movement
        this.handlePlayerMovement();

        // Auto-shoot
        this.handleShooting(delta);

        // Update entities
        this.updateEntities(dt);

        // Collisions
        GameSceneCollisions.handleBulletEnemyCollisions(this);
        GameSceneCollisions.handlePlayerEnemyCollisions(this);
        GameSceneCollisions.handlePlayerBonusCollisions(this);
        GameSceneCollisions.handlePlayerPowerUpCollisions(this);

        // Update power-up timers
        this.updatePowerUpTimers(delta);

        // Cleanup off-screen entities
        this.cleanupOffscreenEntities();

        // Continuous wave spawning
        this.handleWaveSpawning(delta);
    }

    // ==================== UPDATE HELPERS ====================

    updateStars(dt) {
        this.entities.stars.forEach(star => {
            star.graphics.y += star.speed * dt;
            if (star.graphics.y > GAME_CONSTANTS.OFFSCREEN_Y) {
                star.graphics.y = -GAME_CONSTANTS.SPAWN_Y;
                star.graphics.x = Phaser.Math.Between(0, GAME_CONSTANTS.GAME_WIDTH);
            }
        });
    }

    handlePlayerMovement() {
        const speedMultiplier = this.activePowerUps.SPEED_BOOST.active
            ? GAME_CONSTANTS.POWERUP.SPEED_BOOST.SPEED_MULTIPLIER
            : 1;

        if (this.cursors.left.isDown) {
            this.entities.player.move(-1, speedMultiplier);
        }
        if (this.cursors.right.isDown) {
            this.entities.player.move(1, speedMultiplier);
        }
    }

    handleShooting(delta) {
        this.timers.shoot += delta;

        let currentFireRate = GameSceneSpawning.calculateFireRate(this.state.playerArmy);

        if (this.activePowerUps.RAPID_FIRE.active) {
            currentFireRate *= GAME_CONSTANTS.POWERUP.RAPID_FIRE.FIRE_RATE_MULTIPLIER;
        }

        if (this.timers.shoot > currentFireRate) {
            GameSceneSpawning.shootBullet(this);
            this.timers.shoot = 0;
        }
    }

    updateEntities(dt) {
        const playerPos = { x: this.entities.player.x, y: this.entities.player.y };
        this.entities.enemies.forEach(enemy => enemy.update(dt, playerPos));
        this.entities.bosses.forEach(boss => boss.update(dt, playerPos));
        this.entities.bullets.forEach(bullet => bullet.update(dt));
        this.entities.bonuses.forEach(bonus => bonus.update(dt));
        this.entities.powerUps.forEach(powerUp => powerUp.update(dt));

        // Update clone positions to follow player
        this.entities.clones.forEach(clone => {
            clone.x = this.entities.player.x + clone.offsetX;
            clone.y = this.entities.player.y;
            clone.x = Phaser.Math.Clamp(clone.x, GAME_CONSTANTS.PLAYER.MIN_X, GAME_CONSTANTS.PLAYER.MAX_X);
            clone.graphics.x = clone.x;
            clone.graphics.y = clone.y;
        });
    }

    cleanupOffscreenEntities() {
        const offscreenY = GAME_CONSTANTS.OFFSCREEN_Y;

        this.entities.enemies = this.entities.enemies.filter(e => {
            if (e.y > offscreenY) { e.destroy(); return false; }
            return true;
        });

        this.entities.bosses = this.entities.bosses.filter(b => {
            if (b.y > offscreenY) { b.destroy(); return false; }
            return true;
        });

        this.entities.bullets = this.entities.bullets.filter(b => {
            if (b.isOffScreen()) { b.destroy(); return false; }
            return true;
        });

        this.entities.bonuses = this.entities.bonuses.filter(b => {
            if (b.isOffScreen()) { b.destroy(); return false; }
            return true;
        });

        this.entities.powerUps = this.entities.powerUps.filter(p => {
            if (p.isOffScreen()) { p.destroy(); return false; }
            return true;
        });
    }

    handleWaveSpawning(delta) {
        this.timers.spawn += delta;
        const currentInterval = GAME_CONSTANTS.WAVES.BASE_INTERVAL - Math.min(
            this.state.wave * GAME_CONSTANTS.WAVES.INTERVAL_REDUCTION,
            GAME_CONSTANTS.WAVES.MAX_REDUCTION
        );

        if (this.timers.spawn > currentInterval) {
            GameSceneSpawning.spawnContinuousWave(this);
            this.timers.spawn = 0;
        }
    }

    /**
     * Data-driven power-up timer update
     * Replaces 6 identical copy-pasted blocks with a single loop
     */
    updatePowerUpTimers(delta) {
        let needsUIUpdate = false;

        for (const type of GAME_CONSTANTS.POWERUP.TYPES) {
            const pu = this.activePowerUps[type];
            if (!pu.active) continue;

            pu.timer -= delta;
            if (pu.timer <= 0) {
                pu.active = false;
                pu.timer = 0;
                needsUIUpdate = true;

                // Type-specific cleanup on expiry
                if (type === 'SHIELD_TRAP' && this.shieldGraphics) {
                    this.shieldGraphics.destroy();
                    this.shieldGraphics = null;
                }
                if (type === 'CLONE') {
                    this.entities.clones.forEach(clone => {
                        if (clone.graphics) clone.graphics.destroy();
                    });
                    this.entities.clones = [];
                }
            }
        }

        if (needsUIUpdate) {
            GameSceneUI.updateUI(this);
        }
    }
}

export { GameScene };
