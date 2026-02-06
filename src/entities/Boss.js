/**
 * Boss Entity
 * Large enemy with high HP that spawns every 10 waves
 * KISS: Same AI as Enemy but bigger, slower, stronger
 */

class Boss {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = GAME_CONSTANTS.BOSS.WIDTH;
        this.height = GAME_CONSTANTS.BOSS.HEIGHT;
        this.speed = GAME_CONSTANTS.BOSS.BASE_SPEED;
        this.chaseSpeed = GAME_CONSTANTS.BOSS.CHASE_SPEED;
        this.hp = GAME_CONSTANTS.BOSS.HP;
        this.maxHp = GAME_CONSTANTS.BOSS.HP;
        this.damage = GAME_CONSTANTS.BOSS.DAMAGE;

        // Create graphics - Larger and orange
        this.graphics = scene.add.rectangle(x, y, this.width, this.height, GAME_CONSTANTS.BOSS.COLOR);
        this.graphics.setStrokeStyle(5, 0xff9944);

        this.hitbox = scene.add.rectangle(x, y, this.width, this.height, GAME_CONSTANTS.BOSS.COLOR, 0);
        this.hitbox.setStrokeStyle(3, 0xffff00);

        // Health bar - Larger
        this.hpBar = scene.add.rectangle(x, y + 50, 70, 8, 0xff0000);

        // Boss label
        this.label = scene.add.text(x, y - 55, 'BOSS', {
            fontSize: '20px',
            fill: '#ff0000',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Pulsing animation
        scene.tweens.add({
            targets: this.graphics,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    /**
     * Update boss position - chase player (same AI as Enemy)
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
        this.hpBar.y = this.y + 50;
        this.label.x = this.x;
        this.label.y = this.y - 55;
    }

    /**
     * Take damage
     * @returns {boolean} - True if boss died
     */
    takeDamage() {
        this.hp--;

        // Update health bar
        const percent = this.hp / this.maxHp;
        this.hpBar.scaleX = percent;

        if (percent < 0.5) this.hpBar.setFillStyle(0xff6600);
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
     * Destroy boss graphics
     */
    destroy() {
        if (this.graphics) this.graphics.destroy();
        if (this.hitbox) this.hitbox.destroy();
        if (this.hpBar) this.hpBar.destroy();
        if (this.label) this.label.destroy();
    }
}
