/**
 * Main Entry Point
 * Initializes and starts the Phaser game
 * KISS: Simple initialization, no complexity
 */

// Set the scene in config
gameConfig.scene = GameScene;

// Create and start the game
const game = new Phaser.Game(gameConfig);

console.log("🎮 Last War - Game Started!");
console.log("📝 Use ← → to move, bullets auto-fire");
console.log("🎯 Collect bonuses in right corridor!");
