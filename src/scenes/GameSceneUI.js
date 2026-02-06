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
     * Update game timer display
     */
    updateGameTime(scene) {
        const totalSeconds = Math.floor(scene.gameTime / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        const gameTimeElement = document.getElementById('gameTime');
        if (gameTimeElement) {
            gameTimeElement.textContent = formattedTime;
        }
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
                <div style="background: rgba(0, 0, 0, 0.9); padding: 12px 15px; border-radius: 8px; font-size: 15px; border: 2px solid #ff00ff; box-shadow: 0 0 15px rgba(255, 0, 255, 0.5); min-width: 150px;">
                    <div style="color: #ff00ff; font-weight: bold; margin-bottom: 5px;">3X SHOT</div>
                    <div style="color: #ffffff; font-size: 13px;">${timeLeft}s</div>
                </div>
            `;
        }

        // Big Bullets display
        if (scene.bigBulletsActive) {
            const timeLeft = Math.ceil(scene.bigBulletsTimer / 1000);
            powerUpsHTML += `
                <div style="background: rgba(0, 0, 0, 0.9); padding: 12px 15px; border-radius: 8px; font-size: 15px; border: 2px solid #00ffff; box-shadow: 0 0 15px rgba(0, 255, 255, 0.5); min-width: 150px;">
                    <div style="color: #00ffff; font-weight: bold; margin-bottom: 5px;">BIG BULLETS</div>
                    <div style="color: #ffffff; font-size: 13px;">${timeLeft}s</div>
                </div>
            `;
        }

        // Shield Trap display
        if (scene.shieldTrapActive) {
            const timeLeft = Math.ceil(scene.shieldTrapTimer / 1000);
            powerUpsHTML += `
                <div style="background: rgba(0, 0, 0, 0.9); padding: 12px 15px; border-radius: 8px; font-size: 15px; border: 2px solid #ffaa00; box-shadow: 0 0 15px rgba(255, 170, 0, 0.5); min-width: 150px;">
                    <div style="color: #ffaa00; font-weight: bold; margin-bottom: 5px;">SHIELD TRAP</div>
                    <div style="color: #ffffff; font-size: 13px;">${timeLeft}s</div>
                </div>
            `;
        }

        // Clone display
        if (scene.cloneActive) {
            const timeLeft = Math.ceil(scene.cloneTimer / 1000);
            powerUpsHTML += `
                <div style="background: rgba(0, 0, 0, 0.9); padding: 12px 15px; border-radius: 8px; font-size: 15px; border: 2px solid #00ff88; box-shadow: 0 0 15px rgba(0, 255, 136, 0.5); min-width: 150px;">
                    <div style="color: #00ff88; font-weight: bold; margin-bottom: 5px;">CLONE</div>
                    <div style="color: #ffffff; font-size: 13px;">${timeLeft}s</div>
                </div>
            `;
        }

        // Speed Boost display
        if (scene.speedBoostActive) {
            const timeLeft = Math.ceil(scene.speedBoostTimer / 1000);
            powerUpsHTML += `
                <div style="background: rgba(0, 0, 0, 0.9); padding: 12px 15px; border-radius: 8px; font-size: 15px; border: 2px solid #ffff00; box-shadow: 0 0 15px rgba(255, 255, 0, 0.5); min-width: 150px;">
                    <div style="color: #ffff00; font-weight: bold; margin-bottom: 5px;">SPEED BOOST</div>
                    <div style="color: #ffffff; font-size: 13px;">${timeLeft}s</div>
                </div>
            `;
        }

        // Rapid Fire display
        if (scene.rapidFireActive) {
            const timeLeft = Math.ceil(scene.rapidFireTimer / 1000);
            powerUpsHTML += `
                <div style="background: rgba(0, 0, 0, 0.9); padding: 12px 15px; border-radius: 8px; font-size: 15px; border: 2px solid #ff0000; box-shadow: 0 0 15px rgba(255, 0, 0, 0.5); min-width: 150px;">
                    <div style="color: #ff0000; font-weight: bold; margin-bottom: 5px;">RAPID FIRE</div>
                    <div style="color: #ffffff; font-size: 13px;">${timeLeft}s</div>
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

        // Calculate final time
        const totalSeconds = Math.floor(scene.gameTime / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        // Create game over overlay - separate element
        const gameOverOverlay = document.createElement('div');
        gameOverOverlay.id = 'game-over-overlay';
        gameOverOverlay.innerHTML = `
            <div style="background: rgba(0, 0, 0, 0.95); padding: 30px 80px; border-radius: 15px; border: 4px solid #ff0000; text-align: center; box-shadow: 0 0 40px rgba(255, 0, 0, 0.8);">
                <div style="color: #ff0000; font-size: 42px; font-weight: bold; margin-bottom: 15px; text-shadow: 0 0 10px rgba(255, 0, 0, 0.8);">GAME OVER</div>
                <div style="background: #ff0000; height: 3px; margin: 15px 0;"></div>
                <div style="font-size: 22px; color: #ff00ff; margin: 10px 0;">Score: <span style="color: #ffffff; font-weight: bold;">${scene.score}</span></div>
                <div style="font-size: 22px; color: #ffff00; margin: 10px 0;">Wave: <span style="color: #ffffff; font-weight: bold;">${scene.wave}</span></div>
                <div style="font-size: 22px; color: #00ffff; margin: 10px 0;">Time: <span style="color: #ffffff; font-weight: bold;">${formattedTime}</span></div>
                <div style="background: #ff0000; height: 3px; margin: 15px 0;"></div>
                <div style="font-size: 18px; color: #ffff00; margin-top: 15px;">
                    Press <span style="color: #000; background: #ffaa00; padding: 5px 15px; border-radius: 5px; font-weight: bold;">SPACE</span> to restart
                </div>
            </div>
        `;
        document.body.appendChild(gameOverOverlay);
    },

    /**
     * Clean up game over UI for restart
     */
    cleanupGameOver() {
        // Remove game over overlay
        const overlay = document.getElementById('game-over-overlay');
        if (overlay) overlay.remove();

        // Reset UI panels to initial state (with safety checks)
        const armyCount = document.getElementById('armyCount');
        const waveCount = document.getElementById('waveCount');
        const scoreCount = document.getElementById('scoreCount');
        const gameTime = document.getElementById('gameTime');
        const powerupsDisplay = document.getElementById('powerups-display');

        if (armyCount) armyCount.textContent = '1';
        if (waveCount) waveCount.textContent = '1';
        if (scoreCount) scoreCount.textContent = '0';
        if (gameTime) gameTime.textContent = '0:00';
        if (powerupsDisplay) powerupsDisplay.innerHTML = '';
    }
};
