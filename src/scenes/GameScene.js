/**
 * Main Game Scene
 * Orchestrates game flow using modular components
 * KISS: Lightweight coordinator, delegates to specialized modules
 */

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');

        // Game state
        this.gameState = 'playing';
        this.playerArmy = GAME_CONSTANTS.PLAYER.STARTING_ARMY;
        this.score = 0;
        this.wave = 1;

        // Entity arrays
        this.player = null;
        this.enemies = [];
        this.bosses = [];
        this.bullets = [];
        this.bonuses = [];
        this.powerUps = [];
        this.stars = [];

        // Timers
        this.shootTimer = 0;
        this.spawnTimer = 0;

        // Power-up state
        this.tripleShotActive = false;
        this.tripleShotTimer = 0;
        this.bigBulletsActive = false;
        this.bigBulletsTimer = 0;
        this.shieldTrapActive = false;
        this.shieldTrapTimer = 0;
        this.shieldGraphics = null; // Visual shield around player
    }

    create() {
        console.log("Game Scene Created");

        // Setup scene (delegated to GameSceneSetup module)
        GameSceneSetup.createBackground(this);
        GameSceneSetup.createBarriers(this);
        GameSceneSetup.createStars(this, this.stars);

        // Create player
        this.player = GameSceneSetup.createPlayer(this);

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();

        // Initial spawns (delegated to GameSceneSpawning module)
        GameSceneSpawning.spawnInitialWaves(this);

        // Update UI
        GameSceneUI.updateUI(this);
    }

    update(time, delta) {
        if (this.gameState !== 'playing') return;

        const dt = delta / 1000; // Convert to seconds

        // Update stars
        this.updateStars(dt);

        // Player movement
        this.handlePlayerMovement();

        // Auto-shoot
        this.handleShooting(delta);

        // Update entities
        this.updateEntities(dt);

        // Collisions (delegated to GameSceneCollisions module)
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
        this.stars.forEach(star => {
            star.graphics.y += star.speed * dt;
            if (star.graphics.y > 650) {
                star.graphics.y = -50;
                star.graphics.x = Phaser.Math.Between(0, 800);
            }
        });
    }

    handlePlayerMovement() {
        if (this.cursors.left.isDown) {
            this.player.move(-1);
        }
        if (this.cursors.right.isDown) {
            this.player.move(1);
        }
    }

    handleShooting(delta) {
        this.shootTimer += delta;

        // Calculate dynamic fire rate based on player army
        const currentFireRate = GameSceneSpawning.calculateFireRate(this.playerArmy);

        if (this.shootTimer > currentFireRate) {
            GameSceneSpawning.shootBullet(this);
            this.shootTimer = 0;
        }
    }

    updateEntities(dt) {
        this.enemies.forEach(enemy => enemy.update(dt, { x: this.player.x, y: this.player.y }));
        this.bosses.forEach(boss => boss.update(dt, { x: this.player.x, y: this.player.y }));
        this.bullets.forEach(bullet => bullet.update(dt));
        this.bonuses.forEach(bonus => bonus.update(dt));
        this.powerUps.forEach(powerUp => powerUp.update(dt));
    }

    cleanupOffscreenEntities() {
        this.enemies = this.enemies.filter(e => {
            if (e.y > 650) {
                e.destroy();
                return false;
            }
            return true;
        });

        this.bosses = this.bosses.filter(b => {
            if (b.y > 650) {
                b.destroy();
                return false;
            }
            return true;
        });

        this.bullets = this.bullets.filter(b => {
            if (b.isOffScreen()) {
                b.destroy();
                return false;
            }
            return true;
        });

        this.bonuses = this.bonuses.filter(b => {
            if (b.isOffScreen()) {
                b.destroy();
                return false;
            }
            return true;
        });

        this.powerUps = this.powerUps.filter(p => {
            if (p.isOffScreen()) {
                p.destroy();
                return false;
            }
            return true;
        });
    }

    handleWaveSpawning(delta) {
        this.spawnTimer += delta;
        const currentInterval = GAME_CONSTANTS.WAVES.BASE_INTERVAL - Math.min(
            this.wave * GAME_CONSTANTS.WAVES.INTERVAL_REDUCTION,
            GAME_CONSTANTS.WAVES.MAX_REDUCTION
        );

        if (this.spawnTimer > currentInterval) {
            GameSceneSpawning.spawnContinuousWave(this);
            this.spawnTimer = 0;
        }
    }

    updatePowerUpTimers(delta) {
        // Triple Shot timer
        if (this.tripleShotActive) {
            this.tripleShotTimer -= delta;
            if (this.tripleShotTimer <= 0) {
                this.tripleShotActive = false;
                this.tripleShotTimer = 0;
                GameSceneUI.updateUI(this);
            }
        }

        // Big Bullets timer
        if (this.bigBulletsActive) {
            this.bigBulletsTimer -= delta;
            if (this.bigBulletsTimer <= 0) {
                this.bigBulletsActive = false;
                this.bigBulletsTimer = 0;
                GameSceneUI.updateUI(this);
            }
        }

        // Shield Trap timer
        if (this.shieldTrapActive) {
            this.shieldTrapTimer -= delta;
            if (this.shieldTrapTimer <= 0) {
                this.shieldTrapActive = false;
                this.shieldTrapTimer = 0;
                // Remove shield visual
                if (this.shieldGraphics) {
                    this.shieldGraphics.destroy();
                    this.shieldGraphics = null;
                }
                GameSceneUI.updateUI(this);
            }
        }
    }
}
