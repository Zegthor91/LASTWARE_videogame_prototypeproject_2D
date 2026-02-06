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
                        scene.score += GAME_CONSTANTS.BOSS.POINTS;
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
                this.playerHit(scene, 1); // Normal enemy deals 1 damage
                enemy.destroy();
                scene.enemies.splice(index, 1);
            }
        });

        // Bosses - deal more damage
        scene.bosses.forEach((boss, index) => {
            if (CollisionUtils.checkCollision(scene.player, boss)) {
                this.playerHit(scene, GAME_CONSTANTS.BOSS.DAMAGE); // Boss deals 3 damage
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
        scene.score += bonus.value * GAME_CONSTANTS.BONUS.BASE_SCORE;
        GameSceneUI.updateUI(scene);

        // Visual feedback
        GameSceneEffects.createBonusFlash(scene, bonus);
        GameSceneEffects.createFloatingText(scene, bonus);
    }
};
