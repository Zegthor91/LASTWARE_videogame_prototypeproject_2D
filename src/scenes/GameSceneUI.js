/**
 * GameScene UI Module
 * Handles UI updates and game over screen
 * KISS: Pure UI manipulation, DOM interactions
 */

const GameSceneUI = {
    /**
     * Update UI overlay with current stats
     */
    updateUI(scene) {
        document.getElementById('armyCount').textContent = scene.playerArmy;
        document.getElementById('waveCount').textContent = scene.wave;
        document.getElementById('scoreCount').textContent = scene.score;

        // Update power-ups display
        this.updatePowerUpsDisplay(scene);
    },

    /**
     * Update power-ups display showing active power-ups and timers
     */
    updatePowerUpsDisplay(scene) {
        const powerUpsContainer = document.getElementById('powerups-display');
        if (!powerUpsContainer) return;

        let powerUpsHTML = '';

        // Triple Shot display
        if (scene.tripleShotActive) {
            const timeLeft = Math.ceil(scene.tripleShotTimer / 1000);
            powerUpsHTML += `
                <div style="background: #ff00ff; padding: 5px 10px; margin: 5px; border-radius: 5px; font-size: 14px;">
                    <strong>3X SHOT</strong> - ${timeLeft}s
                </div>
            `;
        }

        // Big Bullets display
        if (scene.bigBulletsActive) {
            const timeLeft = Math.ceil(scene.bigBulletsTimer / 1000);
            powerUpsHTML += `
                <div style="background: #00ffff; padding: 5px 10px; margin: 5px; border-radius: 5px; font-size: 14px; color: #000;">
                    <strong>BIG BULLETS</strong> - ${timeLeft}s
                </div>
            `;
        }

        // Shield Trap display
        if (scene.shieldTrapActive) {
            const timeLeft = Math.ceil(scene.shieldTrapTimer / 1000);
            powerUpsHTML += `
                <div style="background: #ffaa00; padding: 5px 10px; margin: 5px; border-radius: 5px; font-size: 14px; color: #000;">
                    <strong>SHIELD TRAP</strong> - ${timeLeft}s
                </div>
            `;
        }

        powerUpsContainer.innerHTML = powerUpsHTML;
    },

    /**
     * Display game over screen
     */
    gameOver(scene) {
        scene.gameState = 'over';

        // Animate player death
        scene.tweens.add({
            targets: scene.player.graphics,
            alpha: 0,
            angle: 360,
            duration: 1000
        });

        // Update UI
        document.getElementById('ui-overlay').innerHTML = `
            <div style="text-align: center;">
                <div style="color: #ff0000; font-size: 36px;">GAME OVER!</div>
                <div style="font-size: 20px; margin-top: 10px;">
                    Score: ${scene.score} | Wave: ${scene.wave}
                </div>
                <div style="font-size: 14px; color: #ffff00; margin-top: 10px;">
                    Press F5 to restart
                </div>
            </div>
        `;
        document.getElementById('ui-overlay').classList.add('game-over');
    }
};
