import { GAME_CONSTANTS } from '../config/Constants.js';
import { CollisionUtils } from '../utils/CollisionUtils.js';

class Enemy {
    constructor(scene, x, y, wave = 1) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = GAME_CONSTANTS.ENEMY.WIDTH;
        this.height = GAME_CONSTANTS.ENEMY.HEIGHT;

        // Scale stats based on wave
        const hpBonus = Math.floor((wave - 1) * GAME_CONSTANTS.ENEMY.HP_INCREASE_PER_WAVE);
        const speedBonus = Math.floor((wave - 1) * GAME_CONSTANTS.ENEMY.SPEED_INCREASE_PER_WAVE);

        this.speed = GAME_CONSTANTS.ENEMY.BASE_SPEED + speedBonus;
        this.chaseSpeed = GAME_CONSTANTS.ENEMY.CHASE_SPEED + speedBonus;
        this.hp = GAME_CONSTANTS.ENEMY.HP + hpBonus;
        this.maxHp = GAME_CONSTANTS.ENEMY.HP + hpBonus;
        
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

                const newPos = { x: newX, y: newY, width: this.width, height: this.height };

                // Check collision with barriers
                let blocked = false;
                let nearestBarrier = 400; // Center of map
                for (const barrier of barriers) {
                    if (CollisionUtils.checkCollision(newPos, barrier)) {
                        blocked = true;
                        // Determine which barrier is blocking
                        const barrierCenterX = barrier.x + barrier.width / 2;
                        nearestBarrier = barrierCenterX;
                        break;
                    }
                }

                if (!blocked) {
                    this.x = newX;
                    this.y = newY;
                } else {
                    // Move toward passage if blocked
                    this.y += this.speed * dt;
                    if (Math.abs(this.y - GAME_CONSTANTS.CORRIDOR.PASSAGE_Y) < 100) {
                        const toBarrier = this.x < nearestBarrier ? 30 : -30;
                        this.x += toBarrier * dt;
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

export { Enemy };
