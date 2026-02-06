/**
 * Boss Entity
 * Large enemy with high HP that spawns every 10 waves
 * KISS: Same AI as Enemy but bigger, slower, stronger
 */

class Boss {
    constructor(scene, x, y, wave = 10) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        // Scale stats based on boss number (wave 10 = boss 1, wave 20 = boss 2, etc.)
        const bossNumber = Math.floor(wave / GAME_CONSTANTS.BOSS.SPAWN_INTERVAL);
        const hpBonus = (bossNumber - 1) * GAME_CONSTANTS.BOSS.HP_INCREASE_PER_BOSS;
        const speedBonus = (bossNumber - 1) * GAME_CONSTANTS.BOSS.SPEED_INCREASE_PER_BOSS;
        const damageBonus = (bossNumber - 1) * GAME_CONSTANTS.BOSS.DAMAGE_INCREASE_PER_BOSS;
        const sizeBonus = (bossNumber - 1) * GAME_CONSTANTS.BOSS.SIZE_INCREASE_PER_BOSS;
        const pointsBonus = (bossNumber - 1) * GAME_CONSTANTS.BOSS.POINTS_MULTIPLIER_PER_BOSS;

        // Progressive scaling
        this.width = GAME_CONSTANTS.BOSS.WIDTH + sizeBonus;
        this.height = GAME_CONSTANTS.BOSS.HEIGHT + sizeBonus;
        this.speed = GAME_CONSTANTS.BOSS.BASE_SPEED + speedBonus;
        this.chaseSpeed = GAME_CONSTANTS.BOSS.CHASE_SPEED + speedBonus;
        this.hp = GAME_CONSTANTS.BOSS.HP + hpBonus;
        this.maxHp = GAME_CONSTANTS.BOSS.HP + hpBonus;
        this.damage = GAME_CONSTANTS.BOSS.DAMAGE + damageBonus;
        this.points = GAME_CONSTANTS.BOSS.POINTS + pointsBonus;
        this.bossNumber = bossNumber; // Store for display

        // Create graphics - Larger and orange
        this.graphics = scene.add.rectangle(x, y, this.width, this.height, GAME_CONSTANTS.BOSS.COLOR);
        this.graphics.setStrokeStyle(5, 0xff9944);

        this.hitbox = scene.add.rectangle(x, y, this.width, this.height, GAME_CONSTANTS.BOSS.COLOR, 0);
        this.hitbox.setStrokeStyle(3, 0xffff00);

        // Health bar - Larger
        this.hpBar = scene.add.rectangle(x, y + 50, 70, 8, 0xff0000);

        // Boss label with level number
        const labelText = bossNumber === 1 ? 'BOSS' : `BOSS ${bossNumber}`;
        this.label = scene.add.text(x, y - 55, labelText, {
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
        this.hpBar.y = this.y + 50;
        this.label.x = this.x;
        this.label.y = this.y - 55;
    }

    /**
     * Take damage
     * @param {number} damage - Amount of damage to take
     * @returns {boolean} - True if boss died
     */
    takeDamage(damage = 1) {
        this.hp -= damage;

        // Update health bar
        const percent = Math.max(0, this.hp / this.maxHp);
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
