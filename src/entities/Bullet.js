/**
 * Bullet Entity
 * Projectile with variable damage based on player army
 * KISS: Position, speed, damage, visual representation
 */

class Bullet {
    constructor(scene, x, y, damage = 1, sizeMultiplier = 1) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.speed = GAME_CONSTANTS.BULLET.SPEED; // Negative = upward
        this.damage = damage; // Damage dealt to enemies

        // Apply size multiplier from Big Bullets power-up
        this.width = GAME_CONSTANTS.BULLET.WIDTH * sizeMultiplier;
        this.height = GAME_CONSTANTS.BULLET.HEIGHT * sizeMultiplier;

        // Hitbox slightly larger for better collision detection
        const hitboxWidth = this.width + 4;
        const hitboxHeight = this.height + 4;

        // Visual size scales with damage (max 2x)
        const damageScale = Math.min(1 + (damage - 1) * 0.1, 2);
        const visualWidth = this.width * damageScale;
        const visualHeight = this.height * damageScale;

        // Color intensity increases with damage
        const colorIntensity = Math.min(damage * 20, 255);
        const bulletColor = (colorIntensity << 16) | (colorIntensity << 8) | 0;

        // Create graphics
        this.graphics = scene.add.rectangle(x, y, visualWidth, visualHeight, bulletColor);
        this.graphics.setStrokeStyle(2, 0xffaa00);

        this.hitbox = scene.add.rectangle(x, y, hitboxWidth, hitboxHeight, bulletColor, 0);
        this.hitbox.setStrokeStyle(2, 0x00ffff);

        // Store hitbox dimensions for collision detection
        this.width = hitboxWidth;
        this.height = hitboxHeight;
    }
    
    /**
     * Update bullet position
     * Supports diagonal movement for Triple Shot power-up
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        // Use velocity components if set (for diagonal bullets), otherwise use default upward movement
        if (this.velocityX !== undefined && this.velocityY !== undefined) {
            this.x += this.velocityX * dt;
            this.y += this.velocityY * dt;
            this.graphics.x = this.x;
            this.graphics.y = this.y;
            this.hitbox.x = this.x;
            this.hitbox.y = this.y;
        } else {
            this.y += this.speed * dt;

            // Update graphics
            this.graphics.y = this.y;
            this.hitbox.y = this.y;
        }
    }
    
    /**
     * Check if bullet is off screen
     * Accounts for diagonal bullets going off sides
     * @returns {boolean}
     */
    isOffScreen() {
        return this.y < -50 || this.x < -50 || this.x > 850;
    }
    
    /**
     * Destroy bullet graphics
     */
    destroy() {
        if (this.graphics) this.graphics.destroy();
        if (this.hitbox) this.hitbox.destroy();
    }
}
