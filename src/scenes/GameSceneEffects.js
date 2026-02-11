import { GAME_CONSTANTS } from '../config/Constants.js';

const GameSceneEffects = {
    /**
     * Create standard explosion effect
     */
    createExplosion(scene, x, y) {
        const explosion = scene.add.circle(x, y, GAME_CONSTANTS.EFFECTS.EXPLOSION_SIZE, 0xffaa00, 0.8);
        scene.tweens.add({
            targets: explosion,
            scale: 2,
            alpha: 0,
            duration: GAME_CONSTANTS.EFFECTS.EXPLOSION_DURATION,
            onComplete: () => explosion.destroy()
        });
    },

    /**
     * Create boss explosion effect (multiple rings)
     */
    createBossExplosion(scene, x, y) {
        // Multiple explosion rings for boss death
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const explosion = scene.add.circle(
                    x + Phaser.Math.Between(-30, 30),
                    y + Phaser.Math.Between(-30, 30),
                    80, 0xff6600, 0.8
                );
                scene.tweens.add({
                    targets: explosion,
                    scale: 3,
                    alpha: 0,
                    duration: 800,
                    onComplete: () => explosion.destroy()
                });
            }, i * 100);
        }

        // Screen shake
        scene.cameras.main.shake(800, 0.03);
    },

    /**
     * Create flash effect when collecting bonus
     */
    createBonusFlash(scene, bonus) {
        const flash = scene.add.circle(bonus.x, bonus.y, 40 + (bonus.value * 5), bonus.color, 0.7);
        scene.tweens.add({
            targets: flash,
            scale: 2.5,
            alpha: 0,
            duration: 400,
            onComplete: () => flash.destroy()
        });
    },

    /**
     * Create floating text when collecting bonus
     */
    createFloatingText(scene, bonus) {
        const floatingText = scene.add.text(bonus.x, bonus.y - 30, `+${bonus.value} ARMY!`, {
            fontSize: bonus.value >= 5 ? '24px' : '18px',
            fill: bonus.value >= 10 ? '#ffff00' : '#00ff00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        scene.tweens.add({
            targets: floatingText,
            y: floatingText.y - 50,
            alpha: 0,
            duration: 1000,
            onComplete: () => floatingText.destroy()
        });
    },

    /**
     * Show boss defeated message
     */
    showBossDefeatedMessage(scene) {
        const victoryText = scene.add.text(400, 300, 'BOSS DEFEATED! +500', {
            fontSize: '36px',
            fill: '#ffff00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        scene.tweens.add({
            targets: victoryText,
            y: 250,
            alpha: 0,
            duration: 2000,
            onComplete: () => victoryText.destroy()
        });
    },

    /**
     * Apply AOE damage to enemies near boss explosion
     * @param {Object} scene - Game scene
     * @param {number} bossX - Boss X position
     * @param {number} bossY - Boss Y position
     * @returns {number} - Number of enemies damaged
     */
    applyBossExplosionDamage(scene, bossX, bossY) {
        let enemiesDamaged = 0;
        const radius = GAME_CONSTANTS.BOSS.EXPLOSION_RADIUS;
        const damage = GAME_CONSTANTS.BOSS.EXPLOSION_DAMAGE;

        // Visual AOE indicator
        const aoeCircle = scene.add.circle(bossX, bossY, radius, 0xff6600, 0.4);
        scene.tweens.add({
            targets: aoeCircle,
            scale: 1.5,
            alpha: 0,
            duration: 600,
            onComplete: () => aoeCircle.destroy()
        });

        // Check each enemy's distance from boss - loop backwards to safely splice
        for (let i = scene.enemies.length - 1; i >= 0; i--) {
            const enemy = scene.enemies[i];
            const dx = enemy.x - bossX;
            const dy = enemy.y - bossY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= radius) {
                if (enemy.takeDamage(damage)) {
                    this.createExplosion(scene, enemy.x, enemy.y);
                    enemy.destroy();
                    scene.enemies.splice(i, 1);
                    scene.score += GAME_CONSTANTS.ENEMY.POINTS;
                }
                enemiesDamaged++;
            }
        }

        // Show damage indicator if enemies were hit
        if (enemiesDamaged > 0) {
            const damageText = scene.add.text(bossX, bossY - 80, `${enemiesDamaged} ENEMIES HIT!`, {
                fontSize: '20px',
                fill: '#ff6600',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5);

            scene.tweens.add({
                targets: damageText,
                y: damageText.y - 40,
                alpha: 0,
                duration: 1500,
                onComplete: () => damageText.destroy()
            });
        }

        return enemiesDamaged;
    },

    /**
     * Show power-up collection message
     */
    showPowerUpMessage(scene, text, color) {
        const powerUpText = scene.add.text(400, 350, text, {
            fontSize: '32px',
            fill: `#${color.toString(16).padStart(6, '0')}`,
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        scene.tweens.add({
            targets: powerUpText,
            y: 300,
            alpha: 0,
            duration: 1500,
            onComplete: () => powerUpText.destroy()
        });
    },

    /**
     * Create shield visual around player
     */
    createShieldVisual(scene) {
        // Remove old shield if exists
        if (scene.shieldGraphics) {
            scene.shieldGraphics.destroy();
        }

        // Create shield circle
        const radius = GAME_CONSTANTS.POWERUP.SHIELD_TRAP.SHIELD_RADIUS;
        scene.shieldGraphics = scene.add.circle(
            scene.player.x,
            scene.player.y,
            radius,
            GAME_CONSTANTS.POWERUP.SHIELD_TRAP.COLOR,
            0.3
        );
        scene.shieldGraphics.setStrokeStyle(3, GAME_CONSTANTS.POWERUP.SHIELD_TRAP.COLOR);

        // Pulsing animation
        scene.tweens.add({
            targets: scene.shieldGraphics,
            scaleX: 1.15,
            scaleY: 1.15,
            alpha: 0.5,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Update shield position in every frame
        scene.events.on('update', () => {
            if (scene.shieldGraphics && scene.shieldTrapActive) {
                scene.shieldGraphics.x = scene.player.x;
                scene.shieldGraphics.y = scene.player.y;
            }
        });
    },

    /**
     * Show shield trap activation effect (when enemy hits shield)
     */
    showShieldTrapActivation(scene, enemiesDestroyed) {
        // Massive screen flash
        scene.cameras.main.flash(600, 255, 165, 0);
        scene.cameras.main.shake(800, 0.05);

        // Shockwave effect
        const shockwave = scene.add.circle(
            scene.player.x,
            scene.player.y,
            30,
            0xffaa00,
            0.7
        );
        scene.tweens.add({
            targets: shockwave,
            scaleX: 20,
            scaleY: 20,
            alpha: 0,
            duration: 800,
            ease: 'Cubic.easeOut',
            onComplete: () => shockwave.destroy()
        });

        // Display message
        const messageText = scene.add.text(400, 300, 'SHIELD TRAP ACTIVATED!', {
            fontSize: '40px',
            fill: '#ffaa00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        const countText = scene.add.text(400, 350, `${enemiesDestroyed} ENEMIES DESTROYED!`, {
            fontSize: '28px',
            fill: '#ff6600',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        scene.tweens.add({
            targets: [messageText, countText],
            y: '-=50',
            alpha: 0,
            duration: 2000,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                messageText.destroy();
                countText.destroy();
            }
        });
    }
};

export { GameSceneEffects };
