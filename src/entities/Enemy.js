/**
 * Enemy Entity
 * Represents an enemy with AI behavior
 * KISS: Position, HP, movement toward player
 */

class Enemy {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = GAME_CONSTANTS.ENEMY.WIDTH;
        this.height = GAME_CONSTANTS.ENEMY.HEIGHT;
        this.speed = GAME_CONSTANTS.ENEMY.BASE_SPEED;
        this.chaseSpeed = GAME_CONSTANTS.ENEMY.CHASE_SPEED;
        this.hp = GAME_CONSTANTS.ENEMY.HP;
        this.maxHp = GAME_CONSTANTS.ENEMY.HP;
        
        // Create graphics
        this.graphics = scene.add.rectangle(x, y, this.width, this.height, GAME_CONSTANTS.ENEMY.COLOR);
        this.graphics.setStrokeStyle(3, 0xff6666);
        
        this.hitbox = scene.add.rectangle(x, y, this.width, this.height, GAME_CONSTANTS.ENEMY.COLOR, 0);
        this.hitbox.setStrokeStyle(2, 0xffff00);
        
        // Health bar
        this.hpBar = scene.add.rectangle(x, y + 30, 35, 5, 0x00ff00);
    }
    
    /**
     * Update enemy position - chase player
     * @param {number} dt - Delta time in seconds
     * @param {Object} playerPos - Player position {x, y}
     */
    update(dt, playerPos) {
        // Calculate direction to player
        const dx = playerPos.x - this.x;
        const dy = playerPos.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            const dirX = dx / distance;
            const dirY = dy / distance;
            
            const newX = this.x + dirX * this.chaseSpeed * dt;
            const newY = this.y + dirY * this.chaseSpeed * dt;
            
            // Check if in passage zone
            if (CollisionUtils.isInPassage(this.y)) {
                this.x = newX;
                this.y = newY;
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
                
                const newPos = { x: newX, y: newY, width: this.width, height: this.height };
                
                if (!CollisionUtils.checkCollision(newPos, barrierTop) && 
                    !CollisionUtils.checkCollision(newPos, barrierBottom)) {
                    this.x = newX;
                    this.y = newY;
                } else {
                    // Move toward passage if blocked
                    this.y += this.speed * dt;
                    if (Math.abs(this.y - GAME_CONSTANTS.CORRIDOR.PASSAGE_Y) < 100) {
                        const toCenter = this.x < GAME_CONSTANTS.CORRIDOR.CENTER ? 30 : -30;
                        this.x += toCenter * dt;
                    }
                }
            }
        }
        
        // Update graphics positions
        this.graphics.x = this.x;
        this.graphics.y = this.y;
        this.hitbox.x = this.x;
        this.hitbox.y = this.y;
        this.hpBar.x = this.x;
        this.hpBar.y = this.y + 30;
    }
    
    /**
     * Take damage
     * @param {number} damage - Amount of damage to take
     * @returns {boolean} - True if enemy died
     */
    takeDamage(damage = 1) {
        this.hp -= damage;

        // Update health bar
        const percent = Math.max(0, this.hp / this.maxHp);
        this.hpBar.scaleX = percent;

        if (percent < 0.5) this.hpBar.setFillStyle(0xffaa00);
        if (percent < 0.25) this.hpBar.setFillStyle(0xff0000);

        // Flash effect
        this.scene.tweens.add({
            targets: this.graphics,
            alpha: 0.3,
            duration: GAME_CONSTANTS.EFFECTS.HIT_FLASH_DURATION,
            yoyo: true
        });

        return this.hp <= 0;
    }
    
    /**
     * Destroy enemy graphics
     */
    destroy() {
        if (this.graphics) this.graphics.destroy();
        if (this.hitbox) this.hitbox.destroy();
        if (this.hpBar) this.hpBar.destroy();
    }
}
