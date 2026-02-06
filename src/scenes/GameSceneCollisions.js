/**
 * GameScene Collisions Module
 * Handles all collision detection and responses
 * KISS: Bullet/Enemy, Player/Enemy, Player/Bonus, Boss collisions
 */

const GameSceneCollisions = {
    /**
     * Handle bullet collisions with enemies and bosses
     */
    handleBulletEnemyCollisions(scene) {
        scene.bullets.forEach((bullet, bIndex) => {
            // Check enemy collisions
            scene.enemies.forEach((enemy, eIndex) => {
                if (CollisionUtils.checkCollision(bullet, enemy)) {
                    // Destroy bullet
                    bullet.destroy();
                    scene.bullets.splice(bIndex, 1);

                    // Damage enemy with bullet damage
                    if (enemy.takeDamage(bullet.damage)) {
                        GameSceneEffects.createExplosion(scene, enemy.x, enemy.y);
                        enemy.destroy();
                        scene.enemies.splice(eIndex, 1);
                        scene.score += GAME_CONSTANTS.ENEMY.POINTS;
                        GameSceneUI.updateUI(scene);
                    }
                }
            });

            // Check boss collisions
            scene.bosses.forEach((boss, bossIndex) => {
                if (CollisionUtils.checkCollision(bullet, boss)) {
                    // Destroy bullet
                    bullet.destroy();
                    scene.bullets.splice(bIndex, 1);

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
                }
            });
        });
    },

    /**
     * Handle player collisions with enemies and bosses
     */
    handlePlayerEnemyCollisions(scene) {
        // Normal enemies
        scene.enemies.forEach((enemy, index) => {
            if (CollisionUtils.checkCollision(scene.player, enemy)) {
                // Check if shield trap is active
                if (scene.shieldTrapActive) {
                    // SHIELD TRAP ACTIVATED - Kill all enemies!
                    this.activateShieldTrap(scene);
                    return; // Exit early - all enemies destroyed
                } else {
                    this.playerHit(scene, 1); // Normal enemy deals 1 damage
                    // Deactivate clones when player is hit
                    this.deactivateClones(scene);
                    enemy.destroy();
                    scene.enemies.splice(index, 1);
                }
            }
        });

        // Bosses - deal progressive damage (shield doesn't affect boss collision)
        scene.bosses.forEach((boss, index) => {
            if (CollisionUtils.checkCollision(scene.player, boss)) {
                // Use progressive boss damage
                this.playerHit(scene, boss.damage);
                // Deactivate clones when player is hit by boss
                this.deactivateClones(scene);
                boss.destroy();
                scene.bosses.splice(index, 1);
            }
        });
    },

    /**
     * Handle player collisions with bonuses
     */
    handlePlayerBonusCollisions(scene) {
        scene.bonuses.forEach((bonus, index) => {
            if (CollisionUtils.checkCollision(scene.player, bonus)) {
                this.collectBonus(scene, bonus);
                bonus.destroy();
                scene.bonuses.splice(index, 1);
            }
        });
    },

    /**
     * Player takes damage
     */
    playerHit(scene, damage = 1) {
        scene.playerArmy -= damage;
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
        scene.playerArmy += bonus.value;
        // Cap army at 99
        scene.playerArmy = Math.min(scene.playerArmy, 99);
        scene.score += bonus.value * GAME_CONSTANTS.BONUS.BASE_SCORE;
        GameSceneUI.updateUI(scene);

        // Visual feedback
        GameSceneEffects.createBonusFlash(scene, bonus);
        GameSceneEffects.createFloatingText(scene, bonus);
    },

    /**
     * Handle player collisions with power-ups
     */
    handlePlayerPowerUpCollisions(scene) {
        scene.powerUps.forEach((powerUp, index) => {
            if (CollisionUtils.checkCollision(scene.player, powerUp)) {
                this.collectPowerUp(scene, powerUp);
                powerUp.destroy();
                scene.powerUps.splice(index, 1);
            }
        });
    },

    /**
     * Player collects a power-up
     */
    collectPowerUp(scene, powerUp) {
        const duration = GAME_CONSTANTS.POWERUP.DURATION;

        if (powerUp.type === 'TRIPLE_SHOT') {
            scene.tripleShotActive = true;
            scene.tripleShotTimer = duration;

            // Show power-up message
            GameSceneEffects.showPowerUpMessage(scene, 'TRIPLE SHOT!', GAME_CONSTANTS.POWERUP.TRIPLE_SHOT.COLOR);
        } else if (powerUp.type === 'BIG_BULLETS') {
            scene.bigBulletsActive = true;
            scene.bigBulletsTimer = duration;

            // Show power-up message
            GameSceneEffects.showPowerUpMessage(scene, 'BIG BULLETS!', GAME_CONSTANTS.POWERUP.BIG_BULLETS.COLOR);
        } else if (powerUp.type === 'SHIELD_TRAP') {
            scene.shieldTrapActive = true;
            scene.shieldTrapTimer = duration;

            // Create shield visual
            GameSceneEffects.createShieldVisual(scene);

            // Show power-up message
            GameSceneEffects.showPowerUpMessage(scene, 'SHIELD TRAP!', GAME_CONSTANTS.POWERUP.SHIELD_TRAP.COLOR);
        } else if (powerUp.type === 'CLONE') {
            scene.cloneActive = true;
            scene.cloneTimer = duration;

            // Destroy existing clones if any
            scene.clones.forEach(clone => {
                if (clone.graphics) clone.graphics.destroy();
            });
            scene.clones = [];

            // Create 2 simple clones (left and right)
            const offset = GAME_CONSTANTS.POWERUP.CLONE.OFFSET_X;

            // Left clone
            const leftClone = {
                offsetX: -offset,
                x: scene.player.x - offset,
                y: scene.player.y,
                graphics: scene.add.rectangle(
                    scene.player.x - offset,
                    scene.player.y,
                    GAME_CONSTANTS.PLAYER.WIDTH,
                    GAME_CONSTANTS.PLAYER.HEIGHT,
                    GAME_CONSTANTS.PLAYER.COLOR
                )
            };
            leftClone.graphics.setStrokeStyle(3, 0x00ffff);
            leftClone.graphics.setAlpha(GAME_CONSTANTS.POWERUP.CLONE.ALPHA);
            scene.clones.push(leftClone);

            // Right clone
            const rightClone = {
                offsetX: offset,
                x: scene.player.x + offset,
                y: scene.player.y,
                graphics: scene.add.rectangle(
                    scene.player.x + offset,
                    scene.player.y,
                    GAME_CONSTANTS.PLAYER.WIDTH,
                    GAME_CONSTANTS.PLAYER.HEIGHT,
                    GAME_CONSTANTS.PLAYER.COLOR
                )
            };
            rightClone.graphics.setStrokeStyle(3, 0x00ffff);
            rightClone.graphics.setAlpha(GAME_CONSTANTS.POWERUP.CLONE.ALPHA);
            scene.clones.push(rightClone);

            // Show power-up message
            GameSceneEffects.showPowerUpMessage(scene, 'CLONE!', GAME_CONSTANTS.POWERUP.CLONE.COLOR);
        } else if (powerUp.type === 'SPEED_BOOST') {
            scene.speedBoostActive = true;
            scene.speedBoostTimer = duration;

            // Show power-up message
            GameSceneEffects.showPowerUpMessage(scene, 'SPEED BOOST!', GAME_CONSTANTS.POWERUP.SPEED_BOOST.COLOR);
        } else if (powerUp.type === 'RAPID_FIRE') {
            scene.rapidFireActive = true;
            scene.rapidFireTimer = duration;

            // Show power-up message
            GameSceneEffects.showPowerUpMessage(scene, 'RAPID FIRE!', GAME_CONSTANTS.POWERUP.RAPID_FIRE.COLOR);
        }

        // Check for combo (both power-ups active)
        if (scene.tripleShotActive && scene.bigBulletsActive) {
            GameSceneEffects.showPowerUpMessage(scene, 'COMBO!!!', GAME_CONSTANTS.POWERUP.COMBO.COLOR);
            scene.cameras.main.flash(300, 255, 255, 255);
        }

        // Visual feedback
        GameSceneEffects.createBonusFlash(scene, powerUp);

        // Update UI to show active power-ups
        GameSceneUI.updateUI(scene);
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
