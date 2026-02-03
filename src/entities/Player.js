/**
 * Player Entity
 * Represents the player character
 * KISS: Simple object with position, movement, and rendering
 */

class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = GAME_CONSTANTS.PLAYER.WIDTH;
        this.height = GAME_CONSTANTS.PLAYER.HEIGHT;
        
        // Create visual representation
        this.graphics = scene.add.rectangle(x, y, this.width, this.height, GAME_CONSTANTS.PLAYER.COLOR);
        this.graphics.setStrokeStyle(3, 0x00ffff);
    }
    
    /**
     * Move player horizontally
     * @param {number} direction - -1 for left, 1 for right
     */
    move(direction) {
        const newX = this.x + (direction * GAME_CONSTANTS.PLAYER.SPEED);
        
        // Check if player is in passage zone (can cross barrier)
        if (CollisionUtils.isInPassage(this.y)) {
            this.x = newX;
        } else {
            // Check barrier collision
            const barrierTop = {
                x: GAME_CONSTANTS.CORRIDOR.CENTER - GAME_CONSTANTS.BARRIER.WIDTH / 2,
                y: GAME_CONSTANTS.BARRIER.TOP_Y,
                width: GAME_CONSTANTS.BARRIER.WIDTH,
                height: GAME_CONSTANTS.BARRIER.TOP_HEIGHT
            };
            
            const barrierBottom = {
                x: GAME_CONSTANTS.CORRIDOR.CENTER - GAME_CONSTANTS.BARRIER.WIDTH / 2,
                y: GAME_CONSTANTS.BARRIER.BOTTOM_Y,
                width: GAME_CONSTANTS.BARRIER.WIDTH,
                height: GAME_CONSTANTS.BARRIER.BOTTOM_HEIGHT
            };
            
            const newPos = { x: newX, y: this.y, width: this.width, height: this.height };
            
            if (!CollisionUtils.checkCollision(newPos, barrierTop) && 
                !CollisionUtils.checkCollision(newPos, barrierBottom)) {
                this.x = newX;
            }
        }
        
        // Clamp to screen bounds
        this.x = Phaser.Math.Clamp(this.x, GAME_CONSTANTS.PLAYER.MIN_X, GAME_CONSTANTS.PLAYER.MAX_X);
        
        // Update graphics
        this.graphics.x = this.x;
    }
    
    /**
     * Destroy player graphics
     */
    destroy() {
        if (this.graphics) {
            this.graphics.destroy();
        }
    }
}
