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
     * @param {number} speedMultiplier - Optional speed multiplier (default 1)
     */
    move(direction, speedMultiplier = 1) {
        const newX = this.x + (direction * GAME_CONSTANTS.PLAYER.SPEED * speedMultiplier);

        // Check if player is in passage zone (can cross barrier)
        if (CollisionUtils.isInPassage(this.y)) {
            this.x = newX;
        } else {
            // Check left and right barrier collisions only
            const barriers = [
                // Left barrier
                {
                    x: GAME_CONSTANTS.CORRIDOR.LEFT_BARRIER - GAME_CONSTANTS.BARRIER.WIDTH / 2,
                    y: GAME_CONSTANTS.BARRIER.TOP_Y,
                    width: GAME_CONSTANTS.BARRIER.WIDTH,
                    height: GAME_CONSTANTS.BARRIER.TOP_HEIGHT
                },
                {
                    x: GAME_CONSTANTS.CORRIDOR.LEFT_BARRIER - GAME_CONSTANTS.BARRIER.WIDTH / 2,
                    y: GAME_CONSTANTS.BARRIER.BOTTOM_Y,
                    width: GAME_CONSTANTS.BARRIER.WIDTH,
                    height: GAME_CONSTANTS.BARRIER.BOTTOM_HEIGHT
                },
                // Right barrier
                {
                    x: GAME_CONSTANTS.CORRIDOR.RIGHT_BARRIER - GAME_CONSTANTS.BARRIER.WIDTH / 2,
                    y: GAME_CONSTANTS.BARRIER.TOP_Y,
                    width: GAME_CONSTANTS.BARRIER.WIDTH,
                    height: GAME_CONSTANTS.BARRIER.TOP_HEIGHT
                },
                {
                    x: GAME_CONSTANTS.CORRIDOR.RIGHT_BARRIER - GAME_CONSTANTS.BARRIER.WIDTH / 2,
                    y: GAME_CONSTANTS.BARRIER.BOTTOM_Y,
                    width: GAME_CONSTANTS.BARRIER.WIDTH,
                    height: GAME_CONSTANTS.BARRIER.BOTTOM_HEIGHT
                }
            ];

            const newPos = { x: newX, y: this.y, width: this.width, height: this.height };

            // Check collision with barriers
            let canMove = true;
            for (const barrier of barriers) {
                if (CollisionUtils.checkCollision(newPos, barrier)) {
                    canMove = false;
                    break;
                }
            }

            if (canMove) {
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
