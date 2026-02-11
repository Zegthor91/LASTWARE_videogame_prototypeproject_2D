import { GAME_CONSTANTS } from '../config/Constants.js';

class Bonus {
    constructor(scene, x, y, wave) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = GAME_CONSTANTS.BONUS.RADIUS * 2;
        this.height = GAME_CONSTANTS.BONUS.RADIUS * 2;
        this.speed = GAME_CONSTANTS.BONUS.SPEED;
        
        // Determine value based on wave
        const tier = this._getTierForWave(wave);
        this.value = tier.value;
        this.color = tier.color;
        this.text = tier.text;
        this.isMultiplier = tier.isMultiplier;
        
        // Create graphics
        this.graphics = scene.add.circle(x, y, GAME_CONSTANTS.BONUS.RADIUS, this.color);
        this.graphics.setStrokeStyle(3, this.color - 0x003300);

        this.hitbox = scene.add.circle(x, y, GAME_CONSTANTS.BONUS.RADIUS, this.color, 0);
        
        this.textGraphics = scene.add.text(x, y, this.text, {
            fontSize: this.isMultiplier ? '24px' : (this.value >= 5 ? '22px' : '18px'),
            fill: '#fff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: this.isMultiplier ? 5 : 3
        }).setOrigin(0.5);

        // Animate
        const scaleAmount = this.isMultiplier ? 1.5 : (this.value >= 5 ? 1.4 : 1.3);
        const duration = this.isMultiplier ? 500 : 600;
        scene.tweens.add({
            targets: this.graphics,
            scaleX: scaleAmount,
            scaleY: scaleAmount,
            duration: duration,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Add extra pulsing animation for multiplier bonuses
        if (this.isMultiplier) {
            scene.tweens.add({
                targets: this.textGraphics,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 400,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }
    
    /**
     * Get bonus tier based on wave number
     * @private
     */
    _getTierForWave(wave) {
        for (const tier of GAME_CONSTANTS.BONUS.TIERS) {
            if (wave <= tier.maxWave) {
                return tier;
            }
        }
        return GAME_CONSTANTS.BONUS.TIERS[0]; // Fallback
    }
    
    /**
     * Update bonus position
     * @param {number} dt - Delta time in seconds
     */
    update(dt) {
        this.y += this.speed * dt;
        
        // Update graphics
        this.graphics.y = this.y;
        this.hitbox.y = this.y;
        this.textGraphics.x = this.x;
        this.textGraphics.y = this.y;
    }
    
    /**
     * Check if bonus is off screen
     * @returns {boolean}
     */
    isOffScreen() {
        return this.y > GAME_CONSTANTS.OFFSCREEN_Y;
    }
    
    /**
     * Destroy bonus graphics
     */
    destroy() {
        if (this.graphics) this.graphics.destroy();
        if (this.hitbox) this.hitbox.destroy();
        if (this.textGraphics) this.textGraphics.destroy();
    }
}

export { Bonus };
