import { Boot } from "./scenes/Boot";
import { Game } from "./scenes/Game";

import { Preloader } from "./scenes/Preloader";
import { UI } from "./scenes/UI";
import { Stats } from "./scenes/Stats";

const GAME_WIDTH = 480; //ratio * 720;
const GAME_HEIGHT = 270; //720;

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
  type: Phaser.AUTO,

  // height: GAME_HEIGHT,

  parent: "game-container",
  backgroundColor: "#028af8",
  scale: {
    mode: Phaser.Scale.NONE,
    // autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  scene: [Boot, Preloader, Game, UI, Stats],
  pixelArt: true,
  roundPixels: true,
};

const DEFAULT_WIDTH = 480;
const DEFAULT_HEIGHT = 270;
const MAX_WIDTH = 540;
const MAX_HEIGHT = 270;
let SCALE_MODE = "SMOOTH";

const game = new Phaser.Game(config);

window.addEventListener("load", () => {
  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    let width = DEFAULT_WIDTH;
    let height = DEFAULT_HEIGHT;
    let maxWidth = MAX_WIDTH;
    let maxHeight = MAX_HEIGHT;
    let scaleMode = SCALE_MODE;

    let scale = Math.min(w / width, h / height);
    let newWidth = Math.min(w / scale, maxWidth);
    let newHeight = Math.min(h / scale, maxHeight);

    // let defaultRatio = DEFAULT_WIDTH / DEFAULT_HEIGHT;
    // let maxRatioWidth = MAX_WIDTH / DEFAULT_HEIGHT;
    // let maxRatioHeight = DEFAULT_WIDTH / MAX_HEIGHT;

    // // smooth scaling
    // let smooth = 1;
    // if (scaleMode === "SMOOTH") {
    //   const maxSmoothScale = 1.15;
    //   const normalize = (value, min, max) => {
    //     return (value - min) / (max - min);
    //   };
    //   if (width / height < w / h) {
    //     smooth =
    //       -normalize(newWidth / newHeight, defaultRatio, maxRatioWidth) /
    //         (1 / (maxSmoothScale - 1)) +
    //       maxSmoothScale;
    //   } else {
    //     smooth =
    //       -normalize(newWidth / newHeight, defaultRatio, maxRatioHeight) /
    //         (1 / (maxSmoothScale - 1)) +
    //       maxSmoothScale;
    //   }
    // }

    // resize the game
    game.scale.resize(newWidth, newHeight);
    //game.scale.autoCenter
    // scale the width and height of the css
    game.canvas.style.width = newWidth * scale + "px";
    game.canvas.style.height = newHeight * scale + "px";

    // center the game with css margin

    game.canvas.style.marginTop = `${(h - newHeight * scale) / 2}px`;
    game.canvas.style.marginLeft = `${(w - newWidth * scale) / 2}px`;
  };
  window.addEventListener("resize", (event) => {
    resize();
  });

  resize();
});

export default game;

// A pet care game typically involves managing various aspects of a pet's life, such as feeding, grooming, playing, and health.

// ### Game Elements:

// 1. **Pet Stats:**
//    - Hunger (0-100)
//    - Happiness (0-100)
//    - Health (0-100)
//    - Cleanliness (0-100)

// 2. **Actions:**
//    - Feed
//    - Play
//    - Clean
//    - Checkup (health)

// 3. **Items:**
//    - Food (different types)
//    - Toys
//    - Cleaning supplies
//    - Medicine

// 4. **Timers:**
//    - Hunger increases over time
//    - Happiness decreases over time
//    - Health affected by hunger and cleanliness
//    - Cleanliness decreases over time
