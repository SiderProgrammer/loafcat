import { Boot } from "./scenes/Boot";
import { Game } from "./scenes/Game";

import { Preloader } from "./scenes/Preloader";
import { UI } from "./scenes/UI";
import { Stats } from "./scenes/Stats";
import { Shop } from "./scenes/Shop";
import { Inventory } from "./scenes/Inventory";
import {
  MAX_HEIGHT,
  MAX_WIDTH,
  SAFE_GAME_HEIGHT,
  SAFE_GAME_WIDTH,
} from "./constants/viewport";
import { Leaderboard } from "./scenes/Leaderboard";
import { SignIn } from "./scenes/SignIn";
import { YourPets } from "./scenes/YourPets";

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
    width: SAFE_GAME_WIDTH,
    height: SAFE_GAME_HEIGHT,
  },
  scene: [
    Boot,
    SignIn,
    Preloader,
    Game,
    UI,
    Stats,
    Shop,
    Inventory,
    Leaderboard,
    YourPets,
  ],
  pixelArt: true,
  roundPixels: true,
  dom: {
    createContainer: true,
  },
};

//let SCALE_MODE = "SMOOTH";

const game = new Phaser.Game(config);

window.addEventListener("load", () => {
  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    let width = SAFE_GAME_WIDTH;
    let height = SAFE_GAME_HEIGHT;
    let maxWidth = MAX_WIDTH;
    let maxHeight = MAX_HEIGHT;
    // let scaleMode = SCALE_MODE;

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

globalThis.__PHASER_GAME__ = game;
