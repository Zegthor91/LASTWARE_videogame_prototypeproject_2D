import { GAME_CONSTANTS } from '../config/Constants.js';
import { Player } from '../entities/Player.js';

const GameSceneSetup = {
    /**
     * Create background rectangle
     */
    createBackground(scene) {
        scene.add.rectangle(400, 300, 800, 600, 0x0a0a1a);
    },

    /**
     * Create barriers and passage indicators
     */
    createBarriers(scene) {
        // LEFT BARRIER (separates left bonus from enemies)
        scene.add.rectangle(
            GAME_CONSTANTS.CORRIDOR.LEFT_BARRIER,
            GAME_CONSTANTS.BARRIER.TOP_Y,
            6,
            GAME_CONSTANTS.BARRIER.TOP_HEIGHT,
            GAME_CONSTANTS.BARRIER.COLOR
        );
        scene.add.rectangle(
            GAME_CONSTANTS.CORRIDOR.LEFT_BARRIER,
            GAME_CONSTANTS.BARRIER.BOTTOM_Y,
            6,
            GAME_CONSTANTS.BARRIER.BOTTOM_HEIGHT,
            GAME_CONSTANTS.BARRIER.COLOR
        );

        // RIGHT BARRIER (separates enemies from right bonus)
        scene.add.rectangle(
            GAME_CONSTANTS.CORRIDOR.RIGHT_BARRIER,
            GAME_CONSTANTS.BARRIER.TOP_Y,
            6,
            GAME_CONSTANTS.BARRIER.TOP_HEIGHT,
            GAME_CONSTANTS.BARRIER.COLOR
        );
        scene.add.rectangle(
            GAME_CONSTANTS.CORRIDOR.RIGHT_BARRIER,
            GAME_CONSTANTS.BARRIER.BOTTOM_Y,
            6,
            GAME_CONSTANTS.BARRIER.BOTTOM_HEIGHT,
            GAME_CONSTANTS.BARRIER.COLOR
        );

        // Passage indicators
        const passageY = GAME_CONSTANTS.CORRIDOR.PASSAGE_Y;

        // Left passage indicator
        scene.add.rectangle(GAME_CONSTANTS.CORRIDOR.LEFT_BARRIER, passageY, 8, 54, 0x00ff00, 0.4);

        // Right passage indicator
        scene.add.rectangle(GAME_CONSTANTS.CORRIDOR.RIGHT_BARRIER, passageY, 8, 54, 0x00ff00, 0.4);

        // Zone labels
        scene.add.text(90, 30, 'BONUS', {
            fontSize: '18px', fill: '#00ff00', fontStyle: 'bold',
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);

        scene.add.text(400, 30, 'ENEMIES', {
            fontSize: '26px', fill: '#ff0000', fontStyle: 'bold',
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);

        scene.add.text(710, 30, 'BONUS', {
            fontSize: '18px', fill: '#00ff00', fontStyle: 'bold',
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);

        // Corridor borders
        scene.add.rectangle(GAME_CONSTANTS.CORRIDOR.LEFT_BORDER, 300, 6, 600, 0x00ffff, 0.7);
        scene.add.rectangle(GAME_CONSTANTS.CORRIDOR.RIGHT_BORDER, 300, 6, 600, 0x00ffff, 0.7);
    },

    /**
     * Create animated star background
     */
    createStars(scene, starsArray) {
        for (let i = 0; i < GAME_CONSTANTS.EFFECTS.STAR_COUNT; i++) {
            const star = {
                graphics: scene.add.circle(
                    Phaser.Math.Between(0, 800),
                    Phaser.Math.Between(0, 600),
                    2, 0xffffff, 0.8
                ),
                speed: Phaser.Math.Between(
                    GAME_CONSTANTS.EFFECTS.STAR_SPEED_MIN,
                    GAME_CONSTANTS.EFFECTS.STAR_SPEED_MAX
                )
            };
            starsArray.push(star);
        }
    },

    /**
     * Create player instance
     */
    createPlayer(scene) {
        return new Player(
            scene,
            GAME_CONSTANTS.PLAYER.START_X,
            GAME_CONSTANTS.PLAYER.START_Y
        );
    }
};

export { GameSceneSetup };
