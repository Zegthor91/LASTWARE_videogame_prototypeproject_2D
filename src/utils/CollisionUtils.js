/**
 * Collision Utilities
 * Simple AABB (Axis-Aligned Bounding Box) collision detection
 * KISS Principle: One clear function, no over-engineering
 */

const CollisionUtils = {
    /**
     * Check if two rectangular objects overlap
     * @param {Object} obj1 - First object with {x, y, width, height}
     * @param {Object} obj2 - Second object with {x, y, width, height}
     * @returns {boolean} - True if objects overlap
     */
    checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    },
    
    /**
     * Check if object is within passage zone
     * @param {number} y - Y position to check
     * @returns {boolean} - True if in passage zone
     */
    isInPassage(y) {
        const passageTop = GAME_CONSTANTS.CORRIDOR.PASSAGE_Y - GAME_CONSTANTS.CORRIDOR.PASSAGE_HEIGHT / 2;
        const passageBottom = GAME_CONSTANTS.CORRIDOR.PASSAGE_Y + GAME_CONSTANTS.CORRIDOR.PASSAGE_HEIGHT / 2;
        return y >= passageTop && y <= passageBottom;
    }
};
