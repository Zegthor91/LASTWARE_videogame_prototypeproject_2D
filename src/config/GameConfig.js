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
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false // Set to true for hitbox debugging
        }
    },
    scene: null // Will be set in main.js
};
