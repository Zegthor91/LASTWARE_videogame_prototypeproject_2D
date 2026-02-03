/**
 * Main Game Scene
 * Handles all game logic, spawning, updates, and collisions
 * KISS: Clear separation of concerns, simple update loop
 */

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        
        // Game state
        this.gameState = 'playing';
        this.playerArmy = GAME_CONSTANTS.PLAYER.STARTING_ARMY;
        this.score = 0;
        this.wave = 1;
        
        // Entity arrays
        this.player = null;
        this.enemies = [];
        this.bullets = [];
        this.bonuses = [];
        this.stars = [];
        
        // Timers
        this.shootTimer = 0;
        this.spawnTimer = 0;
    }
    
    create() {
        console.log("Game Scene Created");
        
        this._createBackground();
        this._createBarriers();
        this._createStars();
        
        // Create player
        this.player = new Player(
            this, 
            GAME_CONSTANTS.PLAYER.START_X, 
            GAME_CONSTANTS.PLAYER.START_Y
        );
        
        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Initial spawns
        this._spawnInitialWaves();
        
        this._updateUI();
    }
    
    // ==================== SETUP METHODS ====================
    
    _createBackground() {
        this.add.rectangle(400, 300, 800, 600, 0x0a0a1a);
    }
    
    _createBarriers() {
        // Top barrier
        this.add.rectangle(
            GAME_CONSTANTS.CORRIDOR.CENTER, 
            GAME_CONSTANTS.BARRIER.TOP_Y, 
            6, 
            GAME_CONSTANTS.BARRIER.TOP_HEIGHT, 
            GAME_CONSTANTS.BARRIER.COLOR
        );
        
        // Bottom barrier
        this.add.rectangle(
            GAME_CONSTANTS.CORRIDOR.CENTER, 
            GAME_CONSTANTS.BARRIER.BOTTOM_Y, 
            6, 
            GAME_CONSTANTS.BARRIER.BOTTOM_HEIGHT, 
            GAME_CONSTANTS.BARRIER.COLOR
        );
        
        // Passage indicator
        const passageY = GAME_CONSTANTS.CORRIDOR.PASSAGE_Y;
        this.add.rectangle(passageY, passageY, 8, 54, 0x00ff00, 0.4);
        
        this.add.text(360, passageY - 10, '→', { fontSize: '28px', fill: '#ffff00', fontStyle: 'bold' });
        this.add.text(420, passageY - 10, '←', { fontSize: '28px', fill: '#ffff00', fontStyle: 'bold' });
        this.add.text(405, passageY - 35, 'PASSAGE', { 
            fontSize: '14px', 
            fill: '#ffff00', 
            fontStyle: 'bold',
            backgroundColor: '#000000',
            padding: { x: 5, y: 3 }
        });
        
        // Labels
        this.add.text(275, 30, 'ENEMIES', {
            fontSize: '20px', fill: '#ff0000', fontStyle: 'bold',
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);
        
        this.add.text(525, 30, 'BONUS', {
            fontSize: '20px', fill: '#00ff00', fontStyle: 'bold',
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);
        
        // Corridor borders
        this.add.rectangle(GAME_CONSTANTS.CORRIDOR.LEFT_BORDER, 300, 6, 600, 0x00ffff, 0.7);
        this.add.rectangle(GAME_CONSTANTS.CORRIDOR.RIGHT_BORDER, 300, 6, 600, 0x00ffff, 0.7);
    }
    
    _createStars() {
        for (let i = 0; i < GAME_CONSTANTS.EFFECTS.STAR_COUNT; i++) {
            const star = {
                graphics: this.add.circle(
                    Phaser.Math.Between(0, 800),
                    Phaser.Math.Between(0, 600),
                    2, 0xffffff, 0.8
                ),
                speed: Phaser.Math.Between(
                    GAME_CONSTANTS.EFFECTS.STAR_SPEED_MIN, 
                    GAME_CONSTANTS.EFFECTS.STAR_SPEED_MAX
                )
            };
            this.stars.push(star);
        }
    }
    
    _spawnInitialWaves() {
        // Horde 1
        setTimeout(() => this._spawnHorde(1), GAME_CONSTANTS.SPAWN.INITIAL_HORDE_1);
        // Horde 2
        setTimeout(() => this._spawnHorde(2), GAME_CONSTANTS.SPAWN.INITIAL_HORDE_2);
        // Horde 3
        setTimeout(() => this._spawnHorde(3), GAME_CONSTANTS.SPAWN.INITIAL_HORDE_3);
        
        // Initial bonuses
        setTimeout(() => {
            const x = Phaser.Math.Between(GAME_CONSTANTS.CORRIDOR.RIGHT_SPAWN_MIN, GAME_CONSTANTS.CORRIDOR.RIGHT_SPAWN_MAX);
            this.bonuses.push(new Bonus(this, x, 50, this.wave));
        }, GAME_CONSTANTS.SPAWN.INITIAL_BONUS_1);
        
        setTimeout(() => {
            const x = Phaser.Math.Between(GAME_CONSTANTS.CORRIDOR.RIGHT_SPAWN_MIN, GAME_CONSTANTS.CORRIDOR.RIGHT_SPAWN_MAX);
            this.bonuses.push(new Bonus(this, x, 50, this.wave));
        }, GAME_CONSTANTS.SPAWN.INITIAL_BONUS_2);
    }
    
    // ==================== SPAWNING METHODS ====================
    
    _spawnHorde(hordeNumber) {
        const count = hordeNumber === 1 || hordeNumber === 2 ? 2 : 3;
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const x = Phaser.Math.Between(
                    GAME_CONSTANTS.CORRIDOR.LEFT_SPAWN_MIN, 
                    GAME_CONSTANTS.CORRIDOR.LEFT_SPAWN_MAX
                );
                this.enemies.push(new Enemy(this, x, 50));
            }, i * GAME_CONSTANTS.SPAWN.ENEMY_SPACING);
        }
    }
    
    _spawnContinuousWave() {
        // Calculate difficulty
        const intervalReduction = Math.min(
            this.wave * GAME_CONSTANTS.WAVES.INTERVAL_REDUCTION, 
            GAME_CONSTANTS.WAVES.MAX_REDUCTION
        );
        const spawnInterval = GAME_CONSTANTS.WAVES.BASE_INTERVAL - intervalReduction;
        
        // Enemy count based on wave
        let enemyCount = 2;
        for (const tier of GAME_CONSTANTS.WAVES.ENEMIES_PER_WAVE) {
            if (this.wave <= tier.maxWave) {
                enemyCount = tier.count;
                break;
            }
        }
        
        // Spawn enemies
        for (let i = 0; i < enemyCount; i++) {
            setTimeout(() => {
                const x = Phaser.Math.Between(
                    GAME_CONSTANTS.CORRIDOR.LEFT_SPAWN_MIN, 
                    GAME_CONSTANTS.CORRIDOR.LEFT_SPAWN_MAX
                );
                this.enemies.push(new Enemy(this, x, 50));
            }, i * 700);
        }
        
        // Spawn bonus
        const bonusChance = Math.min(
            GAME_CONSTANTS.WAVES.BASE_BONUS_CHANCE + (this.wave * GAME_CONSTANTS.WAVES.BONUS_CHANCE_INCREASE),
            GAME_CONSTANTS.WAVES.MAX_BONUS_CHANCE
        );
        
        if (Math.random() < bonusChance) {
            setTimeout(() => {
                const x = Phaser.Math.Between(
                    GAME_CONSTANTS.CORRIDOR.RIGHT_SPAWN_MIN, 
                    GAME_CONSTANTS.CORRIDOR.RIGHT_SPAWN_MAX
                );
                this.bonuses.push(new Bonus(this, x, 50, this.wave));
            }, GAME_CONSTANTS.SPAWN.BONUS_DELAY);
        }
        
        this.wave++;
        this._updateUI();
        
        return spawnInterval;
    }
    
    _shootBullet() {
        this.bullets.push(new Bullet(this, this.player.x, this.player.y - 30));
    }
    
    // ==================== COLLISION METHODS ====================
    
    _handleBulletEnemyCollisions() {
        this.bullets.forEach((bullet, bIndex) => {
            this.enemies.forEach((enemy, eIndex) => {
                if (CollisionUtils.checkCollision(bullet, enemy)) {
                    // Destroy bullet
                    bullet.destroy();
                    this.bullets.splice(bIndex, 1);
                    
                    // Damage enemy
                    if (enemy.takeDamage()) {
                        this._createExplosion(enemy.x, enemy.y);
                        enemy.destroy();
                        this.enemies.splice(eIndex, 1);
                        this.score += GAME_CONSTANTS.ENEMY.POINTS;
                        this._updateUI();
                    }
                }
            });
        });
    }
    
    _handlePlayerEnemyCollisions() {
        this.enemies.forEach((enemy, index) => {
            if (CollisionUtils.checkCollision(this.player, enemy)) {
                this._playerHit();
                enemy.destroy();
                this.enemies.splice(index, 1);
            }
        });
    }
    
    _handlePlayerBonusCollisions() {
        this.bonuses.forEach((bonus, index) => {
            if (CollisionUtils.checkCollision(this.player, bonus)) {
                this._collectBonus(bonus);
                bonus.destroy();
                this.bonuses.splice(index, 1);
            }
        });
    }
    
    // ==================== GAME EVENTS ====================
    
    _playerHit() {
        this.playerArmy--;
        this._updateUI();
        
        this.cameras.main.shake(250, 0.02);
        this.cameras.main.flash(200, 255, 0, 0);
        
        if (this.playerArmy <= 0) {
            this._gameOver();
        }
    }
    
    _collectBonus(bonus) {
        this.playerArmy += bonus.value;
        this.score += bonus.value * GAME_CONSTANTS.BONUS.BASE_SCORE;
        this._updateUI();
        
        // Visual feedback
        const flash = this.add.circle(bonus.x, bonus.y, 40 + (bonus.value * 5), bonus.color, 0.7);
        this.tweens.add({
            targets: flash,
            scale: 2.5,
            alpha: 0,
            duration: 400,
            onComplete: () => flash.destroy()
        });
        
        const floatingText = this.add.text(bonus.x, bonus.y - 30, `+${bonus.value} ARMY!`, {
            fontSize: bonus.value >= 5 ? '24px' : '18px',
            fill: bonus.value >= 10 ? '#ffff00' : '#00ff00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: floatingText,
            y: floatingText.y - 50,
            alpha: 0,
            duration: 1000,
            onComplete: () => floatingText.destroy()
        });
    }
    
    _createExplosion(x, y) {
        const explosion = this.add.circle(x, y, GAME_CONSTANTS.EFFECTS.EXPLOSION_SIZE, 0xffaa00, 0.8);
        this.tweens.add({
            targets: explosion,
            scale: 2,
            alpha: 0,
            duration: GAME_CONSTANTS.EFFECTS.EXPLOSION_DURATION,
            onComplete: () => explosion.destroy()
        });
    }
    
    _gameOver() {
        this.gameState = 'over';
        
        // Animate player death
        this.tweens.add({
            targets: this.player.graphics,
            alpha: 0,
            angle: 360,
            duration: 1000
        });
        
        // Update UI
        document.getElementById('ui-overlay').innerHTML = `
            <div style="text-align: center;">
                <div style="color: #ff0000; font-size: 36px;">GAME OVER!</div>
                <div style="font-size: 20px; margin-top: 10px;">
                    Score: ${this.score} | Wave: ${this.wave}
                </div>
                <div style="font-size: 14px; color: #ffff00; margin-top: 10px;">
                    Press F5 to restart
                </div>
            </div>
        `;
        document.getElementById('ui-overlay').classList.add('game-over');
    }
    
    _updateUI() {
        document.getElementById('armyCount').textContent = this.playerArmy;
        document.getElementById('waveCount').textContent = this.wave;
        document.getElementById('scoreCount').textContent = this.score;
    }
    
    // ==================== UPDATE LOOP ====================
    
    update(time, delta) {
        if (this.gameState !== 'playing') return;
        
        const dt = delta / 1000; // Convert to seconds
        
        // Update stars
        this.stars.forEach(star => {
            star.graphics.y += star.speed * dt;
            if (star.graphics.y > 650) {
                star.graphics.y = -50;
                star.graphics.x = Phaser.Math.Between(0, 800);
            }
        });
        
        // Player movement
        if (this.cursors.left.isDown) {
            this.player.move(-1);
        } else if (this.cursors.right.isDown) {
            this.player.move(1);
        }
        
        // Auto-shoot
        this.shootTimer += delta;
        if (this.shootTimer > GAME_CONSTANTS.BULLET.FIRE_RATE) {
            this._shootBullet();
            this.shootTimer = 0;
        }
        
        // Update entities
        this.enemies.forEach(enemy => enemy.update(dt, { x: this.player.x, y: this.player.y }));
        this.bullets.forEach(bullet => bullet.update(dt));
        this.bonuses.forEach(bonus => bonus.update(dt));
        
        // Collisions
        this._handleBulletEnemyCollisions();
        this._handlePlayerEnemyCollisions();
        this._handlePlayerBonusCollisions();
        
        // Cleanup off-screen entities
        this.enemies = this.enemies.filter(e => {
            if (e.y > 650) {
                e.destroy();
                return false;
            }
            return true;
        });
        
        this.bullets = this.bullets.filter(b => {
            if (b.isOffScreen()) {
                b.destroy();
                return false;
            }
            return true;
        });
        
        this.bonuses = this.bonuses.filter(b => {
            if (b.isOffScreen()) {
                b.destroy();
                return false;
            }
            return true;
        });
        
        // Continuous wave spawning
        this.spawnTimer += delta;
        const currentInterval = GAME_CONSTANTS.WAVES.BASE_INTERVAL - Math.min(
            this.wave * GAME_CONSTANTS.WAVES.INTERVAL_REDUCTION,
            GAME_CONSTANTS.WAVES.MAX_REDUCTION
        );
        
        if (this.spawnTimer > currentInterval) {
            this._spawnContinuousWave();
            this.spawnTimer = 0;
        }
    }
}
