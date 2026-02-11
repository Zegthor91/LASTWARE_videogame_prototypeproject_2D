/**
 * Main Entry Point
 * Initializes and starts the Phaser game
 * KISS: Simple initialization, no complexity
 */

import { GAME_CONSTANTS } from './config/Constants.js';
import { GameScene } from './scenes/GameScene.js';

const gameConfig = {
    type: Phaser.AUTO,
    width: GAME_CONSTANTS.GAME_WIDTH,
    height: GAME_CONSTANTS.GAME_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#0a0a1a',
    scene: GameScene
};

const game = new Phaser.Game(gameConfig);

console.log("Last War - Game Started!");
console.log("Use left/right arrows to move, bullets auto-fire");
console.log("Collect bonuses in side corridors!");
