/**
 * GameScene Spawning Module
 * Handles all entity spawning logic: enemies, bosses, bonuses
 * KISS: Clear spawn functions, separated by entity type
 */

const GameSceneSpawning = {
    /**
     * Spawn initial waves at game start
     */
    spawnInitialWaves(scene) {
        setTimeout(() => {
            scene.enemies.push(new Enemy(scene, 300, 50, scene.wave));
        }, 100);
        setTimeout(() => {
            scene.enemies.push(new Enemy(scene, 500, 50, scene.wave));
        }, 700);
        setTimeout(() => {
            scene.bonuses.push(new Bonus(scene, 90, 50, scene.wave));
        }, 2000);
    },

    /**
     * Spawn a horde of enemies
     */
    spawnHorde(scene, hordeNumber) {
        const count = hordeNumber === 1 || hordeNumber === 2 ? 2 : 3;

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                // Spawn in central enemy corridor
                const x = Phaser.Math.Between(GAME_CONSTANTS.CORRIDOR.ENEMY_MIN, GAME_CONSTANTS.CORRIDOR.ENEMY_MAX);
                scene.enemies.push(new Enemy(scene, x, 50, scene.wave));
            }, i * GAME_CONSTANTS.SPAWN.ENEMY_SPACING);
        }
    },

    /**
     * Spawn continuous wave based on current wave number
     */
    spawnContinuousWave(scene) {
        // Calculate difficulty
        const intervalReduction = Math.min(
            scene.wave * GAME_CONSTANTS.WAVES.INTERVAL_REDUCTION,
            GAME_CONSTANTS.WAVES.MAX_REDUCTION
        );
        const spawnInterval = GAME_CONSTANTS.WAVES.BASE_INTERVAL - intervalReduction;

        // Check if it's a boss wave (every 10 waves)
        if (scene.wave % GAME_CONSTANTS.BOSS.SPAWN_INTERVAL === 0) {
            this.spawnBoss(scene);
        } else {
            this.spawnRegularEnemies(scene);
        }

        // Spawn bonus
        this.spawnBonus(scene);

        // Spawn power-up (random chance)
        this.spawnPowerUp(scene);

        scene.wave++;
        GameSceneUI.updateUI(scene);

        return spawnInterval;
    },

    /**
     * Spawn a boss
     */
    spawnBoss(scene) {
        setTimeout(() => {
            // Spawn in central enemy corridor
            const x = Phaser.Math.Between(GAME_CONSTANTS.CORRIDOR.ENEMY_MIN + 20, GAME_CONSTANTS.CORRIDOR.ENEMY_MAX - 20);
            scene.bosses.push(new Boss(scene, x, 50, scene.wave));

            // Boss warning flash
            scene.cameras.main.flash(500, 255, 100, 0);

            // Display boss message
            const bossText = scene.add.text(400, 300, 'BOSS WAVE!', {
                fontSize: '48px',
                fill: '#ff0000',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 6
            }).setOrigin(0.5);

            scene.tweens.add({
                targets: bossText,
                y: 250,
                alpha: 0,
                duration: 2000,
                onComplete: () => bossText.destroy()
            });
        }, 500);
    },

    /**
     * Spawn regular enemies based on wave tier
     */
    spawnRegularEnemies(scene) {
        // Enemy count based on wave
        let enemyCount = 2;
        for (const tier of GAME_CONSTANTS.WAVES.ENEMIES_PER_WAVE) {
            if (scene.wave <= tier.maxWave) {
                enemyCount = tier.count;
                break;
            }
        }

        // Spawn enemies with current wave scaling
        for (let i = 0; i < enemyCount; i++) {
            setTimeout(() => {
                // Spawn in central enemy corridor
                const x = Phaser.Math.Between(GAME_CONSTANTS.CORRIDOR.ENEMY_MIN, GAME_CONSTANTS.CORRIDOR.ENEMY_MAX);
                scene.enemies.push(new Enemy(scene, x, 50, scene.wave));
            }, i * GAME_CONSTANTS.SPAWN.ENEMY_SPACING);
        }
    },

    /**
     * Spawn bonus with progressive chance
     */
    spawnBonus(scene) {
        const bonusChance = Math.min(
            GAME_CONSTANTS.WAVES.BASE_BONUS_CHANCE + (scene.wave * GAME_CONSTANTS.WAVES.BONUS_CHANCE_INCREASE),
            GAME_CONSTANTS.WAVES.MAX_BONUS_CHANCE
        );

        if (Math.random() < bonusChance) {
            setTimeout(() => {
                // Randomly choose between left and right bonus corridors
                const useLeftCorridor = Math.random() < 0.5;
                const x = useLeftCorridor
                    ? Phaser.Math.Between(GAME_CONSTANTS.CORRIDOR.LEFT_BONUS_MIN, GAME_CONSTANTS.CORRIDOR.LEFT_BONUS_MAX)
                    : Phaser.Math.Between(GAME_CONSTANTS.CORRIDOR.RIGHT_BONUS_MIN, GAME_CONSTANTS.CORRIDOR.RIGHT_BONUS_MAX);
                scene.bonuses.push(new Bonus(scene, x, 50, scene.wave));
            }, GAME_CONSTANTS.SPAWN.BONUS_DELAY);
        }
    },

    /**
     * Shoot a bullet from player with damage based on army
     * Handles power-ups: Triple Shot, Big Bullets, and Combo
     */
    shootBullet(scene) {
        // Calculate bullet damage based on player army
        const bulletDamage = GAME_CONSTANTS.BULLET.BASE_DAMAGE +
                            (scene.playerArmy * GAME_CONSTANTS.BULLET.DAMAGE_PER_ARMY);

        // Check if Big Bullets power-up is active
        const sizeMultiplier = scene.bigBulletsActive
            ? GAME_CONSTANTS.POWERUP.BIG_BULLETS.SIZE_MULTIPLIER
            : 1;

        // Check if Triple Shot power-up is active
        if (scene.tripleShotActive) {
            // Fire 3 bullets at different angles
            const angleSpread = GAME_CONSTANTS.POWERUP.TRIPLE_SHOT.ANGLE_SPREAD;

            // Center bullet
            const centerBullet = new Bullet(scene, scene.player.x, scene.player.y - 30, bulletDamage, sizeMultiplier);
            scene.bullets.push(centerBullet);

            // Left diagonal bullet
            const leftBullet = new Bullet(scene, scene.player.x - 10, scene.player.y - 30, bulletDamage, sizeMultiplier);
            this._addBulletVelocity(leftBullet, -angleSpread);
            scene.bullets.push(leftBullet);

            // Right diagonal bullet
            const rightBullet = new Bullet(scene, scene.player.x + 10, scene.player.y - 30, bulletDamage, sizeMultiplier);
            this._addBulletVelocity(rightBullet, angleSpread);
            scene.bullets.push(rightBullet);
        } else {
            // Normal single bullet
            scene.bullets.push(new Bullet(scene, scene.player.x, scene.player.y - 30, bulletDamage, sizeMultiplier));
        }
    },

    /**
     * Add velocity angle to bullet for diagonal shooting
     * @private
     */
    _addBulletVelocity(bullet, angleDegrees) {
        const angleRad = (angleDegrees * Math.PI) / 180;
        const speedMagnitude = Math.abs(GAME_CONSTANTS.BULLET.SPEED);

        // Calculate velocity components
        bullet.velocityX = Math.sin(angleRad) * speedMagnitude;
        bullet.velocityY = -Math.cos(angleRad) * speedMagnitude;
    },

    /**
     * Calculate current fire rate based on player army
     */
    calculateFireRate(playerArmy) {
        const fireRate = GAME_CONSTANTS.BULLET.BASE_FIRE_RATE -
                        (playerArmy * GAME_CONSTANTS.BULLET.FIRE_RATE_DECREASE_PER_ARMY);
        return Math.max(fireRate, GAME_CONSTANTS.BULLET.MIN_FIRE_RATE);
    },

    /**
     * Spawn a power-up with random chance
     */
    spawnPowerUp(scene) {
        if (Math.random() < GAME_CONSTANTS.POWERUP.SPAWN_CHANCE) {
            setTimeout(() => {
                // Randomly choose between TRIPLE_SHOT, BIG_BULLETS, and SHIELD_TRAP
                const rand = Math.random();
                let powerUpType;
                if (rand < 0.33) {
                    powerUpType = 'TRIPLE_SHOT';
                } else if (rand < 0.66) {
                    powerUpType = 'BIG_BULLETS';
                } else {
                    powerUpType = 'SHIELD_TRAP';
                }

                // Randomly choose between left and right bonus corridors
                const useLeftCorridor = Math.random() < 0.5;
                const x = useLeftCorridor
                    ? Phaser.Math.Between(GAME_CONSTANTS.CORRIDOR.LEFT_BONUS_MIN, GAME_CONSTANTS.CORRIDOR.LEFT_BONUS_MAX)
                    : Phaser.Math.Between(GAME_CONSTANTS.CORRIDOR.RIGHT_BONUS_MIN, GAME_CONSTANTS.CORRIDOR.RIGHT_BONUS_MAX);
                scene.powerUps.push(new PowerUp(scene, x, 50, powerUpType));
            }, GAME_CONSTANTS.SPAWN.BONUS_DELAY);
        }
    }
};
