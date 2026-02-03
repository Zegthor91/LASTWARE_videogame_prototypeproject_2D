/**
 * Bullet Entity
 * Simple projectile that moves upward
 * KISS: Position, speed, visual representation
 */

class Bullet {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = GAME_CONSTANTS.BULLET.WIDTH;
        this.height = GAME_CONSTANTS.BULLET.HEIGHT;
        this.speed = GAME_CONSTANTS.BULLET.SPEED; // Negative = upward
        
        // Create graphics
        this.graphics = scene.add.rectangle(x, y, this.width, this.height, GAME_CONSTANTS.BULLET.COLOR);
        this.graphics.setStrokeStyle(2, 0xffaa00);
        
        this.hitbox = scene.add.rectangle(x, y, this.width, this.height, GAME_CONSTANTS.BULLET.COLOR, 0);
        this.hitbox.setStrokeStyle(2, 0x00ffff);
    }
    
    /**
     * Update bullet position
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        this.y += this.speed * dt;
        
        // Update graphics
        this.graphics.y = this.y;
        this.hitbox.y = this.y;
    }
    
    /**
     * Check if bullet is off screen
     * @returns {boolean}
     */
    isOffScreen() {
        return this.y < -50;
    }
    
    /**
     * Destroy bullet graphics
     */
    destroy() {
        if (this.graphics) this.graphics.destroy();
        if (this.hitbox) this.hitbox.destroy();
    }
}
