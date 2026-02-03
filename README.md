# Last War - Shooter Game

A Phaser.js-based shoot'em up game with progressive difficulty and strategic corridor gameplay.

## Features

- **Dual Corridor System**: Enemies on the left, bonuses on the right
- **Progressive Difficulty**: Enemy count and spawn rate increase with waves
- **Smart Enemy AI**: Enemies chase the player and navigate through passages
- **Bonus System**: Collectibles that grow in value as you progress
- **Wave-based Gameplay**: Survive increasingly difficult enemy hordes

## Project Structure

```
last-war-game/
├── index.html              # Main HTML entry point
├── src/
│   ├── config/
│   │   ├── Constants.js    # All game constants (KISS principle)
│   │   └── GameConfig.js   # Phaser configuration
│   ├── entities/
│   │   ├── Player.js       # Player class
│   │   ├── Enemy.js        # Enemy class with AI
│   │   ├── Bullet.js       # Bullet projectile
│   │   └── Bonus.js        # Collectible bonus
│   ├── scenes/
│   │   └── GameScene.js    # Main game scene
│   ├── utils/
│   │   └── CollisionUtils.js # Collision detection utilities
│   ├── styles.css          # Game styling
│   └── main.js            # Game initialization
└── assets/                # (Future: images, sounds)
```

## Design Principles

### KISS (Keep It Simple, Stupid)

1. **Single Responsibility**: Each class handles one thing
   - `Player`: Movement and position
   - `Enemy`: AI and health
   - `Bullet`: Projectile movement
   - `Bonus`: Value and collection

2. **Constants Centralization**: All magic numbers in `Constants.js`
   - No hardcoded values in game logic
   - Easy to balance and tune

3. **Clear Separation**: Config, Logic, Entities, Utils
   - Easy to find and modify code
   - Scalable architecture

4. **Simple Update Loop**: One clear flow in `GameScene.update()`
   - Update entities
   - Check collisions
   - Clean up
   - Spawn new waves

## Gameplay

### Controls
- Left arrow: Move left
- Right arrow: Move right
- Auto-fire: Bullets fire automatically

### Objective
- Survive as many waves as possible
- Destroy enemies for points
- Collect bonuses to increase your army (lives)
- Navigate between corridors using the passage

### Progression

| Wave | Enemies/Wave | Spawn Interval | Bonus Value |
|------|--------------|----------------|-------------|
| 1-3  | 2            | 5.0s           | +1          |
| 4-6  | 3            | 4.5s           | +1 to +2    |
| 7-10 | 4            | 4.0s           | +2          |
| 11-15| 5            | 3.5s           | +3          |
| 16-20| 6            | 3.2s           | +5          |
| 21+  | 6            | 3.0s           | +10         |

## Technical Details

### Technologies
- **Phaser 3.70.0**: Game framework
- **Vanilla JavaScript**: ES6+ features
- **HTML5 Canvas**: Rendering

### Performance
- Manual entity management (arrays)
- Efficient collision detection (AABB)
- Object pooling ready (future optimization)

### Code Quality
- Clear naming conventions
- Comprehensive comments
- Modular architecture
- KISS principle throughout
- No over-engineering

## How to Run

1. **Simple HTTP Server** (recommended):
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Or Node.js
   npx http-server
   ```

2. **Open in browser**:
   ```
   http://localhost:8000
   ```

3. **VS Code Live Server**:
   - Install "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"

## Future Enhancements

### Easy (1-2 hours)
- Sound effects (shoot, explosion, collect)
- Background music
- Particle effects for explosions
- Screen shake on hit

### Medium (1 day)
- Boss enemies every 5 waves
- Power-ups (rapid fire, shield, spread shot)
- High score persistence (localStorage)
- Pause menu

### Advanced (3-5 days)
- Multiple player ships to choose from
- Achievement system
- Campaign mode with levels
- Multiplayer co-op
- Mobile touch controls
- Sprite-based graphics

## Configuration

All game parameters can be tuned in `src/config/Constants.js`:

```javascript
// Example: Make game easier
ENEMY: {
    HP: 2,  // Instead of 3
    CHASE_SPEED: 60  // Instead of 80
}

// Example: More generous bonuses
WAVES: {
    BASE_BONUS_CHANCE: 0.3,  // Instead of 0.2
}
```

## Code Examples

### Adding a New Enemy Type

```javascript
// In src/entities/Enemy.js
constructor(scene, x, y, type = 'normal') {
    // ... existing code
    
    if (type === 'fast') {
        this.speed = 150;
        this.hp = 2;
        this.graphics.setFillStyle(0xff8800);
    }
}
```

### Adding a New Power-Up

```javascript
// Create new file: src/entities/PowerUp.js
class PowerUp {
    constructor(scene, x, y, type) {
        this.type = type; // 'speed', 'shield', etc.
        // ... implementation
    }
}
```

## Debugging

Enable physics debug mode in `src/config/GameConfig.js`:

```javascript
arcade: {
    debug: true  // Shows hitboxes
}
```

## License

Free to use and modify for educational purposes.

## Author

Created following professional Phaser.js and JavaScript best practices.

---

Built with Phaser.js and the KISS principle
