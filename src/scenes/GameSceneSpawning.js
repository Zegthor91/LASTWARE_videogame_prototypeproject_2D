/**
 * GameScene Spawning Module
 * Handles all entity spawning logic: enemies, bosses, bonuses
 * KISS: Clear spawn functions, separated by entity type
 */

const GameSceneSpawning = {
    /**
     * Spawn initial waves at game start
     */
    spawnInitialWaves(scene) {
        setTimeout(() => {
            scene.enemies.push(new Enemy(scene, 250, 50));
        }, 100);
        setTimeout(() => {
            scene.enemies.push(new Enemy(scene, 300, 50));
        }, 700);
        setTimeout(() => {
            scene.bonuses.push(new Bonus(scene, 550, 50, scene.wave));
        }, 2000);
    },

    /**
     * Spawn a horde of enemies
     */
    spawnHorde(scene, hordeNumber) {
        const count = hordeNumber === 1 || hordeNumber === 2 ? 2 : 3;

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const x = Phaser.Math.Between(
                    GAME_CONSTANTS.CORRIDOR.LEFT_SPAWN_MIN,
                    GAME_CONSTANTS.CORRIDOR.LEFT_SPAWN_MAX
                );
                scene.enemies.push(new Enemy(scene, x, 50));
            }, i * GAME_CONSTANTS.SPAWN.ENEMY_SPACING);
        }
    },

    /**
     * Spawn continuous wave based on current wave number
     */
    spawnContinuousWave(scene) {
        // Calculate difficulty
        const intervalReduction = Math.min(
            scene.wave * GAME_CONSTANTS.WAVES.INTERVAL_REDUCTION,
            GAME_CONSTANTS.WAVES.MAX_REDUCTION
        );
        const spawnInterval = GAME_CONSTANTS.WAVES.BASE_INTERVAL - intervalReduction;

        // Check if it's a boss wave (every 10 waves)
        if (scene.wave % GAME_CONSTANTS.BOSS.SPAWN_INTERVAL === 0) {
            this.spawnBoss(scene);
        } else {
            this.spawnRegularEnemies(scene);
        }

        // Spawn bonus
        this.spawnBonus(scene);

        scene.wave++;
        GameSceneUI.updateUI(scene);

        return spawnInterval;
    },

    /**
     * Spawn a boss
     */
    spawnBoss(scene) {
        setTimeout(() => {
            const x = Phaser.Math.Between(
                GAME_CONSTANTS.CORRIDOR.LEFT_SPAWN_MIN + 20,
                GAME_CONSTANTS.CORRIDOR.LEFT_SPAWN_MAX - 20
            );
            scene.bosses.push(new Boss(scene, x, 50));

            // Boss warning flash
            scene.cameras.main.flash(500, 255, 100, 0);

            // Display boss message
            const bossText = scene.add.text(400, 300, 'BOSS WAVE!', {
                fontSize: '48px',
                fill: '#ff0000',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 6
            }).setOrigin(0.5);

            scene.tweens.add({
                targets: bossText,
                y: 250,
                alpha: 0,
                duration: 2000,
                onComplete: () => bossText.destroy()
            });
        }, 500);
    },

    /**
     * Spawn regular enemies based on wave tier
     */
    spawnRegularEnemies(scene) {
        // Enemy count based on wave
        let enemyCount = 2;
        for (const tier of GAME_CONSTANTS.WAVES.ENEMIES_PER_WAVE) {
            if (scene.wave <= tier.maxWave) {
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
                scene.enemies.push(new Enemy(scene, x, 50));
            }, i * 700);
        }
    },

    /**
     * Spawn bonus with progressive chance
     */
    spawnBonus(scene) {
        const bonusChance = Math.min(
            GAME_CONSTANTS.WAVES.BASE_BONUS_CHANCE + (scene.wave * GAME_CONSTANTS.WAVES.BONUS_CHANCE_INCREASE),
            GAME_CONSTANTS.WAVES.MAX_BONUS_CHANCE
        );

        if (Math.random() < bonusChance) {
            setTimeout(() => {
                const x = Phaser.Math.Between(
                    GAME_CONSTANTS.CORRIDOR.RIGHT_SPAWN_MIN,
                    GAME_CONSTANTS.CORRIDOR.RIGHT_SPAWN_MAX
                );
                scene.bonuses.push(new Bonus(scene, x, 50, scene.wave));
            }, GAME_CONSTANTS.SPAWN.BONUS_DELAY);
        }
    },

    /**
     * Shoot a bullet from player
     */
    shootBullet(scene) {
        scene.bullets.push(new Bullet(scene, scene.player.x, scene.player.y - 30));
    }
};
