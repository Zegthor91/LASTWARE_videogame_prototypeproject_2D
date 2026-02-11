import { GAME_CONSTANTS } from '../config/Constants.js';
import { CollisionUtils } from '../utils/CollisionUtils.js';
import { GameSceneEffects } from './GameSceneEffects.js';
import { GameSceneUI } from './GameSceneUI.js';

const GameSceneCollisions = {
    /**
     * Handle bullet collisions with enemies and bosses
     * IMPORTANT: Loop backwards to safely remove elements during iteration
     */
    handleBulletEnemyCollisions(scene) {
        // Loop backwards through bullets to avoid index issues when removing
        for (let bIndex = scene.bullets.length - 1; bIndex >= 0; bIndex--) {
            const bullet = scene.bullets[bIndex];
            let bulletDestroyed = false;

            // Check enemy collisions
            for (let eIndex = scene.enemies.length - 1; eIndex >= 0; eIndex--) {
                const enemy = scene.enemies[eIndex];
                if (CollisionUtils.checkCollision(bullet, enemy)) {
                    // Destroy bullet
                    if (!bulletDestroyed) {
                        bullet.destroy();
                        scene.bullets.splice(bIndex, 1);
                        bulletDestroyed = true;
                    }

                    // Damage enemy with bullet damage
                    if (enemy.takeDamage(bullet.damage)) {
                        GameSceneEffects.createExplosion(scene, enemy.x, enemy.y);
                        enemy.destroy();
                        scene.enemies.splice(eIndex, 1);
                        scene.score += GAME_CONSTANTS.ENEMY.POINTS;
                        GameSceneUI.updateUI(scene);
                    }
                    break; // Bullet already destroyed, no need to check more enemies
                }
            }

            // Check boss collisions only if bullet wasn't destroyed by enemy
            if (!bulletDestroyed) {
                for (let bossIndex = scene.bosses.length - 1; bossIndex >= 0; bossIndex--) {
                    const boss = scene.bosses[bossIndex];
                    if (CollisionUtils.checkCollision(bullet, boss)) {
                        // Destroy bullet
                        bullet.destroy();
                        scene.bullets.splice(bIndex, 1);
                        bulletDestroyed = true;

                        // Damage boss with bullet damage
                        if (boss.takeDamage(bullet.damage)) {
                            // Apply AOE damage to nearby enemies
                            GameSceneEffects.applyBossExplosionDamage(scene, boss.x, boss.y);

                            // Big explosion for boss death
                            GameSceneEffects.createBossExplosion(scene, boss.x, boss.y);
                            boss.destroy();
                            scene.bosses.splice(bossIndex, 1);
                            // Use progressive boss points
                            scene.score += boss.points;
                            GameSceneUI.updateUI(scene);

                            // Victory message
                            GameSceneEffects.showBossDefeatedMessage(scene);
                        }
                        break; // Bullet already destroyed
                    }
                }
            }
        }
    },

    /**
     * Handle player collisions with enemies and bosses
     */
    handlePlayerEnemyCollisions(scene) {
        // Normal enemies - loop backwards to safely splice
        for (let i = scene.enemies.length - 1; i >= 0; i--) {
            const enemy = scene.enemies[i];
            if (CollisionUtils.checkCollision(scene.player, enemy)) {
                if (scene.shieldTrapActive) {
                    this.activateShieldTrap(scene);
                    return;
                } else {
                    this.playerHit(scene, 1);
                    this.deactivateClones(scene);
                    enemy.destroy();
                    scene.enemies.splice(i, 1);
                }
            }
        }

        // Bosses - loop backwards to safely splice
        for (let i = scene.bosses.length - 1; i >= 0; i--) {
            const boss = scene.bosses[i];
            if (CollisionUtils.checkCollision(scene.player, boss)) {
                this.playerHit(scene, boss.damage);
                this.deactivateClones(scene);
                boss.destroy();
                scene.bosses.splice(i, 1);
            }
        }
    },

    /**
     * Handle player collisions with bonuses
     */
    handlePlayerBonusCollisions(scene) {
        for (let i = scene.bonuses.length - 1; i >= 0; i--) {
            const bonus = scene.bonuses[i];
            if (CollisionUtils.checkCollision(scene.player, bonus)) {
                this.collectBonus(scene, bonus);
                bonus.destroy();
                scene.bonuses.splice(i, 1);
            }
        }
    },

    /**
     * Player takes damage
     */
    playerHit(scene, damage = 1) {
        scene.playerArmy -= damage;

        // Ensure army never goes below 0
        scene.playerArmy = Math.max(0, scene.playerArmy);

        GameSceneUI.updateUI(scene);

        // Stronger shake for boss hits
        const shakeDuration = damage > 1 ? 500 : 250;
        const shakeIntensity = damage > 1 ? 0.04 : 0.02;
        scene.cameras.main.shake(shakeDuration, shakeIntensity);
        scene.cameras.main.flash(200, 255, 0, 0);

        if (scene.playerArmy <= 0) {
            GameSceneUI.gameOver(scene);
        }
    },

    /**
     * Player collects a bonus
     */
    collectBonus(scene, bonus) {
        let armyGained;

        if (bonus.isMultiplier) {
            // Multiplier bonus: multiply current army
            const oldArmy = scene.playerArmy;
            scene.playerArmy = scene.playerArmy * bonus.value;
            armyGained = scene.playerArmy - oldArmy;
        } else {
            // Regular bonus: add value
            scene.playerArmy += bonus.value;
            armyGained = bonus.value;
        }

        // Cap army at current limit
        scene.playerArmy = Math.min(scene.playerArmy, scene.armyCap);
        scene.score += armyGained * GAME_CONSTANTS.BONUS.BASE_SCORE;
        GameSceneUI.updateUI(scene);

        // Visual feedback
        GameSceneEffects.createBonusFlash(scene, bonus);
        GameSceneEffects.createFloatingText(scene, bonus);
    },

    /**
     * Handle player collisions with power-ups
     */
    handlePlayerPowerUpCollisions(scene) {
        for (let i = scene.powerUps.length - 1; i >= 0; i--) {
            const powerUp = scene.powerUps[i];
            if (CollisionUtils.checkCollision(scene.player, powerUp)) {
                this.collectPowerUp(scene, powerUp);
                powerUp.destroy();
                scene.powerUps.splice(i, 1);
            }
        }
    },

    /**
     * Player collects a power-up (data-driven)
     */
    collectPowerUp(scene, powerUp) {
        const duration = GAME_CONSTANTS.POWERUP.DURATION;

        if (powerUp.type === 'JACKPOT') {
            // JACKPOT - Activate all power-ups
            const jackpotDuration = GAME_CONSTANTS.POWERUP.JACKPOT.DURATION;

            GAME_CONSTANTS.POWERUP.TYPES.forEach(type => {
                this._activateSinglePowerUp(scene, type,
                    scene.activePowerUps[type].active ? duration : jackpotDuration
                );
            });

            GameSceneEffects.showPowerUpMessage(scene, '777 JACKPOT!!!', GAME_CONSTANTS.POWERUP.JACKPOT.COLOR);
            scene.cameras.main.flash(500, 255, 215, 0);
        } else {
            // Single power-up activation
            this._activateSinglePowerUp(scene, powerUp.type, duration);

            const config = GAME_CONSTANTS.POWERUP[powerUp.type];
            GameSceneEffects.showPowerUpMessage(scene, config.MESSAGE, config.COLOR);

            // Check for combo (Triple Shot + Big Bullets)
            if (scene.activePowerUps.TRIPLE_SHOT.active && scene.activePowerUps.BIG_BULLETS.active) {
                GameSceneEffects.showPowerUpMessage(scene, 'COMBO!!!', GAME_CONSTANTS.POWERUP.COMBO.COLOR);
                scene.cameras.main.flash(300, 255, 255, 255);
            }
        }

        GameSceneEffects.createBonusFlash(scene, powerUp);
        GameSceneUI.updateUI(scene);
    },

    /**
     * Activate a single power-up type with given duration
     * @private
     */
    _activateSinglePowerUp(scene, type, duration) {
        const pu = scene.activePowerUps[type];
        pu.active = true;
        pu.timer = duration;

        // Type-specific activation effects
        if (type === 'SHIELD_TRAP') {
            GameSceneEffects.createShieldVisual(scene);
        }
        if (type === 'CLONE') {
            this._spawnClones(scene);
        }
    },

    /**
     * Spawn player clones (single reusable function)
     * @private
     */
    _spawnClones(scene) {
        // Destroy existing clones
        scene.clones.forEach(clone => {
            if (clone.graphics) clone.graphics.destroy();
        });
        scene.clones = [];

        const offset = GAME_CONSTANTS.POWERUP.CLONE.OFFSET_X;
        const alpha = GAME_CONSTANTS.POWERUP.CLONE.ALPHA;

        [-offset, offset].forEach(offsetX => {
            const clone = {
                offsetX,
                x: scene.player.x + offsetX,
                y: scene.player.y,
                graphics: scene.add.rectangle(
                    scene.player.x + offsetX,
                    scene.player.y,
                    GAME_CONSTANTS.PLAYER.WIDTH,
                    GAME_CONSTANTS.PLAYER.HEIGHT,
                    GAME_CONSTANTS.PLAYER.COLOR
                )
            };
            clone.graphics.setStrokeStyle(3, 0x00ffff);
            clone.graphics.setAlpha(alpha);
            scene.clones.push(clone);
        });
    },

    /**
     * Activate shield trap - destroy all enemies on screen (except bosses)
     */
    activateShieldTrap(scene) {
        let enemiesDestroyed = 0;

        // Destroy all enemies
        scene.enemies.forEach((enemy) => {
            GameSceneEffects.createExplosion(scene, enemy.x, enemy.y);
            enemy.destroy();
            scene.score += GAME_CONSTANTS.ENEMY.POINTS;
            enemiesDestroyed++;
        });
        scene.enemies = [];

        // Deactivate shield
        scene.shieldTrapActive = false;
        scene.shieldTrapTimer = 0;
        if (scene.shieldGraphics) {
            scene.shieldGraphics.destroy();
            scene.shieldGraphics = null;
        }

        // Show shield trap activation effect
        GameSceneEffects.showShieldTrapActivation(scene, enemiesDestroyed);

        // Update UI
        GameSceneUI.updateUI(scene);
    },

    /**
     * Deactivate clones power-up
     */
    deactivateClones(scene) {
        if (scene.cloneActive) {
            scene.cloneActive = false;
            scene.cloneTimer = 0;
            // Destroy all clones
            scene.clones.forEach(clone => {
                if (clone.graphics) clone.graphics.destroy();
            });
            scene.clones = [];
            GameSceneUI.updateUI(scene);
        }
    }
};

export { GameSceneCollisions };
