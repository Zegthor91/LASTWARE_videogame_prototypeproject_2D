import { GAME_CONSTANTS } from '../config/Constants.js';
import { Enemy } from '../entities/Enemy.js';
import { Boss } from '../entities/Boss.js';
import { Bullet } from '../entities/Bullet.js';
import { Bonus } from '../entities/Bonus.js';
import { PowerUp } from '../entities/PowerUp.js';
import { GameSceneUI } from './GameSceneUI.js';

const GameSceneSpawning = {
    /**
     * Spawn initial waves at game start
     */
    spawnInitialWaves(scene) {
        const spawnY = GAME_CONSTANTS.SPAWN_Y;
        setTimeout(() => {
            scene.enemies.push(new Enemy(scene, 300, spawnY, scene.wave));
        }, 100);
        setTimeout(() => {
            scene.enemies.push(new Enemy(scene, 500, spawnY, scene.wave));
        }, 700);
        setTimeout(() => {
            scene.bonuses.push(new Bonus(scene, 90, spawnY, scene.wave));
        }, 2000);
    },

    /**
     * Spawn a horde of enemies
     */
    spawnHorde(scene, hordeNumber) {
        const count = hordeNumber === 1 || hordeNumber === 2 ? 2 : 3;

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const x = Phaser.Math.Between(GAME_CONSTANTS.CORRIDOR.ENEMY_MIN, GAME_CONSTANTS.CORRIDOR.ENEMY_MAX);
                scene.enemies.push(new Enemy(scene, x, GAME_CONSTANTS.SPAWN_Y, scene.wave));
            }, i * GAME_CONSTANTS.SPAWN.ENEMY_SPACING);
        }
    },

    /**
     * Spawn continuous wave based on current wave number
     */
    spawnContinuousWave(scene) {
        const intervalReduction = Math.min(
            scene.wave * GAME_CONSTANTS.WAVES.INTERVAL_REDUCTION,
            GAME_CONSTANTS.WAVES.MAX_REDUCTION
        );
        const spawnInterval = GAME_CONSTANTS.WAVES.BASE_INTERVAL - intervalReduction;

        if (scene.wave % GAME_CONSTANTS.BOSS.SPAWN_INTERVAL === 0) {
            this.spawnBoss(scene);
        } else {
            this.spawnRegularEnemies(scene);
        }

        this.spawnBonus(scene);
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
            const x = Phaser.Math.Between(GAME_CONSTANTS.CORRIDOR.ENEMY_MIN + 20, GAME_CONSTANTS.CORRIDOR.ENEMY_MAX - 20);
            scene.bosses.push(new Boss(scene, x, GAME_CONSTANTS.SPAWN_Y, scene.wave));

            scene.cameras.main.flash(500, 255, 100, 0);

            const bossText = scene.add.text(
                GAME_CONSTANTS.GAME_WIDTH / 2,
                GAME_CONSTANTS.GAME_HEIGHT / 2,
                'BOSS WAVE!', {
                    fontSize: '48px',
                    fill: '#ff0000',
                    fontStyle: 'bold',
                    stroke: '#000000',
                    strokeThickness: 6
                }).setOrigin(0.5);

            scene.tweens.add({
                targets: bossText,
                y: bossText.y - 50,
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
        let enemyCount = 2;
        for (const tier of GAME_CONSTANTS.WAVES.ENEMIES_PER_WAVE) {
            if (scene.wave <= tier.maxWave) {
                enemyCount = tier.count;
                break;
            }
        }

        for (let i = 0; i < enemyCount; i++) {
            setTimeout(() => {
                const x = Phaser.Math.Between(GAME_CONSTANTS.CORRIDOR.ENEMY_MIN, GAME_CONSTANTS.CORRIDOR.ENEMY_MAX);
                scene.enemies.push(new Enemy(scene, x, GAME_CONSTANTS.SPAWN_Y, scene.wave));
            }, i * GAME_CONSTANTS.SPAWN.ENEMY_SPACING);
        }
    },

    /**
     * Spawn bonus with progressive chance (decreases over time)
     */
    spawnBonus(scene) {
        const bonusChance = Math.max(
            GAME_CONSTANTS.WAVES.BASE_BONUS_CHANCE - (scene.wave * GAME_CONSTANTS.WAVES.BONUS_CHANCE_DECREASE),
            GAME_CONSTANTS.WAVES.MIN_BONUS_CHANCE
        );

        if (Math.random() < bonusChance) {
            setTimeout(() => {
                const x = this._randomCorridorX();
                scene.bonuses.push(new Bonus(scene, x, GAME_CONSTANTS.SPAWN_Y, scene.wave));
            }, GAME_CONSTANTS.SPAWN.BONUS_DELAY);
        }
    },

    /**
     * Shoot bullets from player (and clones if active)
     * Handles power-ups: Triple Shot, Big Bullets, and Combo
     */
    shootBullet(scene) {
        let bulletDamage = GAME_CONSTANTS.BULLET.BASE_DAMAGE +
                           (scene.playerArmy * GAME_CONSTANTS.BULLET.DAMAGE_PER_ARMY);

        const sizeMultiplier = scene.bigBulletsActive
            ? GAME_CONSTANTS.POWERUP.BIG_BULLETS.SIZE_MULTIPLIER
            : 1;

        if (scene.bigBulletsActive) {
            bulletDamage *= GAME_CONSTANTS.POWERUP.BIG_BULLETS.DAMAGE_MULTIPLIER;
        }

        // Fire from player
        this._fireBulletsFrom(scene, scene.player.x, scene.player.y, bulletDamage, sizeMultiplier);

        // Fire from clones if active
        if (scene.cloneActive && scene.clones.length > 0) {
            scene.clones.forEach(clone => {
                this._fireBulletsFrom(scene, clone.x, clone.y, bulletDamage, sizeMultiplier);
            });
        }
    },

    /**
     * Fire bullets from a given position (reused for player and clones)
     * @private
     */
    _fireBulletsFrom(scene, x, y, damage, sizeMultiplier) {
        const bulletY = y - GAME_CONSTANTS.BULLET_OFFSET_Y;

        if (scene.tripleShotActive) {
            const angleSpread = GAME_CONSTANTS.POWERUP.TRIPLE_SHOT.ANGLE_SPREAD;

            const centerBullet = new Bullet(scene, x, bulletY, damage, sizeMultiplier);
            scene.bullets.push(centerBullet);

            const leftBullet = new Bullet(scene, x - 10, bulletY, damage, sizeMultiplier);
            this._addBulletVelocity(leftBullet, -angleSpread);
            scene.bullets.push(leftBullet);

            const rightBullet = new Bullet(scene, x + 10, bulletY, damage, sizeMultiplier);
            this._addBulletVelocity(rightBullet, angleSpread);
            scene.bullets.push(rightBullet);
        } else {
            scene.bullets.push(new Bullet(scene, x, bulletY, damage, sizeMultiplier));
        }
    },

    /**
     * Add velocity angle to bullet for diagonal shooting
     * @private
     */
    _addBulletVelocity(bullet, angleDegrees) {
        const angleRad = (angleDegrees * Math.PI) / 180;
        const speedMagnitude = Math.abs(GAME_CONSTANTS.BULLET.SPEED);

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
     * Spawn a power-up with progressive chance (increases with waves)
     */
    spawnPowerUp(scene) {
        const powerUpChance = Math.min(
            GAME_CONSTANTS.POWERUP.BASE_SPAWN_CHANCE + (scene.wave * GAME_CONSTANTS.POWERUP.SPAWN_CHANCE_INCREASE),
            GAME_CONSTANTS.POWERUP.MAX_SPAWN_CHANCE
        );

        if (Math.random() < powerUpChance) {
            setTimeout(() => {
                let powerUpType;

                if (Math.random() < GAME_CONSTANTS.POWERUP.JACKPOT_CHANCE) {
                    powerUpType = 'JACKPOT';
                } else {
                    // Use TYPES array for equal-weight random selection
                    const types = GAME_CONSTANTS.POWERUP.TYPES;
                    powerUpType = types[Math.floor(Math.random() * types.length)];
                }

                const x = this._randomCorridorX();
                scene.powerUps.push(new PowerUp(scene, x, GAME_CONSTANTS.SPAWN_Y, powerUpType));
            }, GAME_CONSTANTS.SPAWN.BONUS_DELAY);
        }
    },

    /**
     * Pick a random X in left or right bonus corridor
     * @private
     */
    _randomCorridorX() {
        const useLeft = Math.random() < 0.5;
        return useLeft
            ? Phaser.Math.Between(GAME_CONSTANTS.CORRIDOR.LEFT_BONUS_MIN, GAME_CONSTANTS.CORRIDOR.LEFT_BONUS_MAX)
            : Phaser.Math.Between(GAME_CONSTANTS.CORRIDOR.RIGHT_BONUS_MIN, GAME_CONSTANTS.CORRIDOR.RIGHT_BONUS_MAX);
    }
};

export { GameSceneSpawning };
