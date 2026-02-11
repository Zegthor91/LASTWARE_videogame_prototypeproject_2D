import { GAME_CONSTANTS } from '../config/Constants.js';

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
     * Update power-ups display (data-driven loop)
     */
    updatePowerUpsDisplay(scene) {
        const powerUpsContainer = document.getElementById('powerups-display');
        if (!powerUpsContainer) return;

        let powerUpsHTML = '';

        GAME_CONSTANTS.POWERUP.TYPES.forEach(type => {
            const pu = scene.activePowerUps[type];
            if (!pu.active) return;

            const config = GAME_CONSTANTS.POWERUP[type];
            const colorHex = '#' + config.COLOR.toString(16).padStart(6, '0');
            const r = (config.COLOR >> 16) & 0xFF;
            const g = (config.COLOR >> 8) & 0xFF;
            const b = config.COLOR & 0xFF;
            const timeLeft = Math.ceil(pu.timer / 1000);

            powerUpsHTML += `
                <div style="background: rgba(0, 0, 0, 0.9); padding: 12px 15px; border-radius: 8px; font-size: 15px; border: 2px solid ${colorHex}; box-shadow: 0 0 15px rgba(${r}, ${g}, ${b}, 0.5); min-width: 150px;">
                    <div style="color: ${colorHex}; font-weight: bold; margin-bottom: 5px;">${config.DISPLAY_NAME}</div>
                    <div style="color: #ffffff; font-size: 13px;">${timeLeft}s</div>
                </div>
            `;
        });

        powerUpsContainer.innerHTML = powerUpsHTML;
    },

    /**
     * Display game over screen
     */
    gameOver(scene) {
        scene.gameState = 'over';

        // Clean up all entities to prevent visual glitches
        scene.bullets.forEach(bullet => bullet.destroy());
        scene.bullets = [];

        scene.enemies.forEach(enemy => enemy.destroy());
        scene.enemies = [];

        scene.bosses.forEach(boss => boss.destroy());
        scene.bosses = [];

        scene.bonuses.forEach(bonus => bonus.destroy());
        scene.bonuses = [];

        scene.powerUps.forEach(powerUp => powerUp.destroy());
        scene.powerUps = [];

        scene.clones.forEach(clone => {
            if (clone.graphics) clone.graphics.destroy();
        });
        scene.clones = [];

        // Remove shield visual if active
        if (scene.shieldGraphics) {
            scene.shieldGraphics.destroy();
            scene.shieldGraphics = null;
        }

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
    },

    /**
     * Display pause screen
     */
    showPause(scene) {
        // Create pause overlay - similar to game over but with blue theme
        const pauseOverlay = document.createElement('div');
        pauseOverlay.id = 'pause-overlay';
        pauseOverlay.innerHTML = `
            <div style="background: rgba(0, 0, 0, 0.95); padding: 30px 80px; border-radius: 15px; border: 4px solid #0088ff; text-align: center; box-shadow: 0 0 40px rgba(0, 136, 255, 0.8);">
                <div style="color: #0088ff; font-size: 48px; font-weight: bold; margin-bottom: 20px; text-shadow: 0 0 10px rgba(0, 136, 255, 0.8);">PAUSED</div>
                <div style="background: #0088ff; height: 3px; margin: 15px 0;"></div>
                <div style="font-size: 22px; color: #ff00ff; margin: 10px 0;">Score: <span style="color: #ffffff; font-weight: bold;">${scene.score}</span></div>
                <div style="font-size: 22px; color: #ffff00; margin: 10px 0;">Wave: <span style="color: #ffffff; font-weight: bold;">${scene.wave}</span></div>
                <div style="font-size: 22px; color: #00ff00; margin: 10px 0;">Army: <span style="color: #ffffff; font-weight: bold;">${scene.playerArmy}</span></div>
                <div style="background: #0088ff; height: 3px; margin: 15px 0;"></div>
                <div style="font-size: 18px; color: #00ffff; margin-top: 15px;">
                    Press <span style="color: #fff; background: #0088ff; padding: 5px 15px; border-radius: 5px; font-weight: bold;">SPACE</span> to resume
                </div>
            </div>
        `;
        document.body.appendChild(pauseOverlay);
    },

    /**
     * Hide pause screen
     */
    hidePause(scene) {
        const pauseOverlay = document.getElementById('pause-overlay');
        if (pauseOverlay) {
            pauseOverlay.remove();
        }
    }
};

export { GameSceneUI };
