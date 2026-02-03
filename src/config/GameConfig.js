/**
 * Phaser Game Configuration
 * Main configuration object for Phaser.js game instance
 */

const gameConfig = {
    type: Phaser.AUTO,
    width: GAME_CONSTANTS.GAME_WIDTH,
    height: GAME_CONSTANTS.GAME_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#0a0a1a',
    scene: null // Will be set in main.js
};
