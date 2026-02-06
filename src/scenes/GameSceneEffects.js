/**
 * GameScene Effects Module
 * Handles all visual effects: explosions, flashes, floating text
 * KISS: Pure visual feedback, no game logic
 */

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
    }
};
