# Last War - Shooter Game

A retro vertical shooter developed with Phaser 3, where you must survive endless waves of increasingly difficult enemies. [bestin-it](https://bestin-it.com/how-to-build-a-javascript-shooter-game-with-phaser-3-complete-tutorial/)

  
  


## Table of Contents

- [Overview](#overview)  
- [Features](#features)  
- [Technologies](#technologies)  
- [Installation](#installation)  
- [Gameplay](#gameplay)  
- [Power-ups](#power-ups)  
- [Progression System](#progression-system)  
- [Controls](#controls)  
- [Project Structure](#project-structure)  
- [Game Mechanics](#game-mechanics)

## Overview

**Last War** is an old-school vertical shooter where you control an army that must survive endless waves of enemies. Collect bonuses to grow your army, grab power-ups to enhance your abilities, and face increasingly powerful bosses every 10 waves. [bestin-it](https://bestin-it.com/how-to-build-a-javascript-shooter-game-with-phaser-3-complete-tutorial/)

## Features

### Core Gameplay

- **Endless waves** with progressive difficulty  
- **Army system**: your "life" is represented by the number of soldiers (Army)  
- **Boss fights**: a boss appears every 10 waves with scaling stats  
- **6 different power-ups** with unique effects  
- **Score system** with multipliers  
- **Survival timer** to track your performance  

### User Interface

- **Left panel**: Stats (Army, Wave, Score) + active power-ups  
- **Right panel**: Game timer  
- **Centered Game Over screen** with final stats  
- Cohesive design with glow effects and colored borders  

### Advanced Mechanics

- **Lane-based playfield** with barriers and passages  
- **Smart spawning**: bonuses in side lanes, enemies in the center  
- **Power-up combos**: specific combinations trigger special effects  
- **Progressive difficulty**: faster spawns and stronger enemies over time  

## Technologies

- **Phaser 3.70.0** – 2D game framework [bestin-it](https://bestin-it.com/how-to-build-a-javascript-shooter-game-with-phaser-3-complete-tutorial/)
- **JavaScript ES6** – Programming language [bestin-it](https://bestin-it.com/how-to-build-a-javascript-shooter-game-with-phaser-3-complete-tutorial/)
- **HTML5 Canvas** – Graphics rendering [bestin-it](https://bestin-it.com/how-to-build-a-javascript-shooter-game-with-phaser-3-complete-tutorial/)
- **CSS3** – User interface styling [bestin-it](https://bestin-it.com/how-to-build-a-javascript-shooter-game-with-phaser-3-complete-tutorial/)

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo>
   cd LASTWARE_videogame_prototypeproject_2D
   ```

2. **Run the game**

   Simply open `index.html` in a modern web browser (Chrome, Firefox, Edge recommended). [bestin-it](https://bestin-it.com/how-to-build-a-javascript-shooter-game-with-phaser-3-complete-tutorial/)

   **OR** use a local server:
   ```bash
   # With Python 3
   python -m http.server 8000

   # With Node.js (http-server)
   npx http-server
   ```

   Then go to `http://localhost:8000` in your browser. [bestin-it](https://bestin-it.com/how-to-build-a-javascript-shooter-game-with-phaser-3-complete-tutorial/)

## Gameplay

### Objective

Survive as long as possible by destroying enemies and avoiding collisions. Your **Army** represents your life: reach 0 and it is Game Over. [bestin-it](https://bestin-it.com/how-to-build-a-javascript-shooter-game-with-phaser-3-complete-tutorial/)

### Core Mechanics

- **Auto-shooting**: Your ship fires automatically  
- **Scaling damage**: The larger your Army, the more damage your bullets deal  
- **Dynamic fire rate**: Fire rate increases with Army size  
- **Bonus collection**: Pick up green orbs (+1 to +5 Army)  
- **Army cap**: Maximum of 99 soldiers  

## Power-ups

The game features **6 power-ups**, each lasting **15 seconds**. [bestin-it](https://bestin-it.com/how-to-build-a-javascript-shooter-game-with-phaser-3-complete-tutorial/)

| Power-up        | Icon | Effect                                      | Color        |
|-----------------|------|---------------------------------------------|-------------|
| **Triple Shot** | 3️⃣  | Fires 3 bullets in a spread                 | Magenta     |
| **Big Bullets** | 💥  | Bigger bullets (1.5x damage, 1.5x size)     | Cyan        |
| **Shield Trap** | 🛡️  | Destroys all enemies on first contact       | Orange      |
| **Clone**       | 👥  | Creates 2 clones that shoot with you        | Mint green  |
| **Speed Boost** | ⚡  | Movement speed x1.75                         | Yellow      |
| **Rapid Fire**  | 🔥  | Fire rate x2                                | Red         |

### Combos

- **Triple Shot + Big Bullets** = COMBO!!! (white flash + special message)  

### Special Rules

- **Clone** disappears if you get hit  
- **Shield Trap** does not work against bosses  
- Power-ups spawn more frequently as waves progress  

## Progression System

### Waves

- **Faster spawns**: Waves appear increasingly quickly  
- **Decreasing bonuses**: More bonuses early game, fewer later  
- **Progressive power-ups**: More power-ups spawn over time  

### Bosses (every 10 waves)

Each boss is **stronger** than the previous one. [bestin-it](https://bestin-it.com/how-to-build-a-javascript-shooter-game-with-phaser-3-complete-tutorial/)

| Stat      | Boss 1 | Boss 2 | Boss 3 | Progression        |
|-----------|--------|--------|--------|--------------------|
| **HP**    | 300    | 375    | 450    | +75 HP per boss    |
| **Speed** | 100    | 108    | 116    | +8 speed per boss  |
| **Damage**| 3      | 5      | 7      | +2 damage per boss |
| **Size**  | 60x40  | 70x50  | 80x60  | +10 pixels per boss|
| **Points**| 500    | 700    | 900    | +200 pts per boss  |

**Boss special effects:**

- AOE explosion on death  
- Victory message  
- Stronger camera shake on collisions  

### Scoring

- Standard enemy: **10 points**  
- Boss: **500 points + (200 × boss number)**  
- Collected bonus: **value × 100 points**  

## Controls

| Key                | Action            |
|--------------------|-------------------|
| **← Left Arrow**   | Move left         |
| **→ Right Arrow**  | Move right        |
| **SPACE** (Game Over) | Restart game |

**Note**: Shooting is automatic; no key press is required.

## Project Structure

```text
LASTWARE_videogame_prototypeproject_2D/
│
├── index.html                         # Entry point
├── README.md                          # Documentation
│
├── src/
│   ├── styles.css                     # UI styles
│   ├── main.js                        # Phaser initialization
│   │
│   ├── config/
│   │   ├── Constants.js              # Game constants
│   │   └── GameConfig.js             # Phaser configuration
│   │
│   ├── entities/                     # Game entities
│   │   ├── Player.js                 # Player
│   │   ├── Enemy.js                  # Enemies
│   │   ├── Boss.js                   # Boss
│   │   ├── Bullet.js                 # Projectiles
│   │   ├── Bonus.js                  # Army bonuses
│   │   └── PowerUp.js                # Power-ups
│   │
│   ├── scenes/                       # Phaser scenes (modular architecture)
│   │   ├── GameScene.js             # Main orchestrator
│   │   ├── GameSceneSetup.js        # Scene initialization
│   │   ├── GameSceneSpawning.js     # Spawning management
│   │   ├── GameSceneCollisions.js   # Collision handling
│   │   ├── GameSceneEffects.js      # Visual effects
│   │   └── GameSceneUI.js           # User interface
│   │
│   └── utils/
│       └── CollisionUtils.js        # Collision utilities
```

## Game Mechanics

### Lane System

The playfield is divided into **5 zones**:

- **2 bonus lanes** (left and right): bonuses and power-ups spawn here  
- **1 central lane**: enemies spawn here  
- **2 barriers**: block movement except at passages  
- **2 passage zones**: allow crossing through barriers  

### Smart Spawning

- **Bonuses**: Spawn alternately in left and right lanes  
- **Power-ups**: Same behavior as bonuses  
- **Enemies**: Spawn only in the central lane  
- **Bosses**: Spawn in the center every 10 waves  

### Damage System

- **Bullet damage**: `2 + (Army × 0.3)` × multipliers  
- **Standard enemy**: deals 1 damage to the player  
- **Boss**: progressive damage (3, 5, 7, 9, ...)  

### Difficulty Algorithms

#### Wave spawn interval

```javascript
Interval = 3000ms - min(wave * 50ms, 1500ms)
// Faster over time, capped at 1500ms
```

#### Bonus chance (decreasing)

```javascript
Chance = max(60% - (wave * 2%), 15%)
// Starts at 60%, decreases down to 15%
```

#### Power-up chance (increasing)

```javascript
Chance = min(2% + (wave * 0.5%), 15%)
// Starts at 2%, increases up to 15%
```

## Design and UI

### Theme Colors

- **Army**: Green (#00ff00)  
- **Wave**: Yellow (#ffff00)  
- **Score**: Magenta (#ff00ff)  
- **Timer**: Cyan (#00ffff)  
- **Borders**: Gold (#ffd700)  

### Visual Effects

- Camera shake on impact  
- Red flash on damage  
- White flash on combos  
- Animated explosions  
- Floating messages  
- Starfield background  

## Development Notes

### KISS Architecture

The project follows the **KISS** (Keep It Simple, Stupid) principle:

- Modular architecture with clear separation of concerns  
- No heavy framework, just Phaser + vanilla JS  
- Well-organized and commented code  

### Performance

- Automatic cleanup of off-screen entities  
- Optimized loops (reverse iteration for removals)  
- No memory leaks  
- Full page reload for restart (ensures clean state)  

### Configuration System

All parameters are centralized in `Constants.js`:

- Easy game balancing  
- No magic numbers in the code  
- Fast value tweaking  

## Credits

Developed with passion by **Zegthor91**. [bestin-it](https://bestin-it.com/how-to-build-a-javascript-shooter-game-with-phaser-3-complete-tutorial/)

Powered by [Phaser 3](https://phaser.io/). [phaser](https://phaser.io/news/2025/08/learn-phaser-3-by-building-a-space-shooter)

***

**Have fun!**