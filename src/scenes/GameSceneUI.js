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
