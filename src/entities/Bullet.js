/**
 * Bullet Entity
 * Projectile with variable damage based on player army
 * KISS: Position, speed, damage, visual representation
 */

class Bullet {
    constructor(scene, x, y, damage = 1) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = GAME_CONSTANTS.BULLET.WIDTH;
        this.height = GAME_CONSTANTS.BULLET.HEIGHT;
        this.speed = GAME_CONSTANTS.BULLET.SPEED; // Negative = upward
        this.damage = damage; // Damage dealt to enemies

        // Visual size scales with damage (max 2x)
        const sizeScale = Math.min(1 + (damage - 1) * 0.1, 2);
        const visualWidth = this.width * sizeScale;
        const visualHeight = this.height * sizeScale;

        // Color intensity increases with damage
        const colorIntensity = Math.min(damage * 20, 255);
        const bulletColor = (colorIntensity << 16) | (colorIntensity << 8) | 0;

        // Create graphics
        this.graphics = scene.add.rectangle(x, y, visualWidth, visualHeight, bulletColor);
        this.graphics.setStrokeStyle(2, 0xffaa00);

        this.hitbox = scene.add.rectangle(x, y, this.width, this.height, bulletColor, 0);
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
