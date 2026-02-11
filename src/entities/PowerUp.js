import { GAME_CONSTANTS } from '../config/Constants.js';

class PowerUp {
    constructor(scene, x, y, type) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = GAME_CONSTANTS.BONUS.RADIUS * 2;
        this.height = GAME_CONSTANTS.BONUS.RADIUS * 2;
        this.speed = GAME_CONSTANTS.BONUS.SPEED;
        this.type = type; // 'TRIPLE_SHOT', 'BIG_BULLETS', 'SHIELD_TRAP', 'CLONE', 'SPEED_BOOST', 'RAPID_FIRE', or 'JACKPOT'

        // Get color and icon from constants (direct lookup)
        const config = GAME_CONSTANTS.POWERUP[type] || GAME_CONSTANTS.POWERUP.JACKPOT;

        this.color = config.COLOR;
        this.icon = config.ICON;

        // Create graphics - Star shape for power-ups
        this.graphics = this._createStar(scene, x, y, GAME_CONSTANTS.BONUS.RADIUS, this.color);

        this.hitbox = scene.add.circle(x, y, GAME_CONSTANTS.BONUS.RADIUS, this.color, 0);
        this.hitbox.setStrokeStyle(3, 0xffffff);

        this.textGraphics = scene.add.text(x, y, this.icon, {
            fontSize: '16px',
            fill: '#fff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Spinning animation for power-ups
        scene.tweens.add({
            targets: this.graphics,
            angle: 360,
            duration: 2000,
            repeat: -1,
            ease: 'Linear'
        });

        // Pulsing scale - enhanced for JACKPOT
        if (type === 'JACKPOT') {
            // Stronger pulsing effect for jackpot
            scene.tweens.add({
                targets: [this.graphics, this.textGraphics],
                scaleX: 1.6,
                scaleY: 1.6,
                duration: 400,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            // Add golden glow effect
            this.hitbox.setStrokeStyle(6, 0xffd700, 1);
            scene.tweens.add({
                targets: this.hitbox,
                alpha: { from: 0.6, to: 1 },
                duration: 300,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        } else {
            // Normal pulsing for other power-ups
            scene.tweens.add({
                targets: [this.graphics, this.textGraphics],
                scaleX: 1.3,
                scaleY: 1.3,
                duration: 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            // Add blinking effect to hitbox for regular power-ups
            scene.tweens.add({
                targets: this.hitbox,
                alpha: { from: 0.5, to: 1 },
                duration: 400,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    /**
     * Create a star shape for power-up visual
     * @private
     */
    _createStar(scene, x, y, radius, color) {
        const graphics = scene.add.graphics();
        graphics.fillStyle(color, 1);
        graphics.lineStyle(3, 0xffffff, 1);

        const points = 5;
        const innerRadius = radius * 0.5;
        const outerRadius = radius;
        const angle = Math.PI / points;

        graphics.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const r = i % 2 === 0 ? outerRadius : innerRadius;
            const currAngle = angle * i - Math.PI / 2;
            const px = x + Math.cos(currAngle) * r;
            const py = y + Math.sin(currAngle) * r;

            if (i === 0) {
                graphics.moveTo(px, py);
            } else {
                graphics.lineTo(px, py);
            }
        }
        graphics.closePath();
        graphics.fillPath();
        graphics.strokePath();

        return graphics;
    }

    /**
     * Update power-up position
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
     * Check if power-up is off screen
     * @returns {boolean}
     */
    isOffScreen() {
        return this.y > GAME_CONSTANTS.OFFSCREEN_Y;
    }

    /**
     * Destroy power-up graphics
     */
    destroy() {
        if (this.graphics) this.graphics.destroy();
        if (this.hitbox) this.hitbox.destroy();
        if (this.textGraphics) this.textGraphics.destroy();
    }
}

export { PowerUp };
