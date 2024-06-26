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
import { LinkedPets } from "./scenes/LinkedPets";
import { GameModel } from "./models/GameModel";

const config = {
    type: Phaser.AUTO,
    //autoRound: true,
    parent: "game-container",
    backgroundColor: "#028af8",
    canvasStyle: "",
    autoRound: true,
    scale: {
        mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT, //      mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: SAFE_GAME_WIDTH,
        height: SAFE_GAME_HEIGHT,

        // min: {
        //   width: MAX_WIDTH,
        //   height: MAX_HEIGHT,
        // },
        max: {
            width: SAFE_GAME_WIDTH * 4 + 256,
            height: SAFE_GAME_HEIGHT * 4 + 256,
        },
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
        LinkedPets,
    ],
    pixelArt: true,
    roundPixels: true,
    antialias: false,
    antialiasGL: false,
    render: {
        pixelArt: true,
        roundPixels: true,
    },
    dom: {
        createContainer: true,
    },
};

//let SCALE_MODE = "SMOOTH";

//const game = new Phaser.Game(config);

window.addEventListener("load", () => {
    const resize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;

        let width = SAFE_GAME_WIDTH;
        let height = SAFE_GAME_HEIGHT;
        let maxWidth = MAX_WIDTH;
        let maxHeight = MAX_HEIGHT;
        // let scaleMode = SCALE_MODE;

        let scale = Number(Math.min(w / width, h / height));
        let newWidth = Math.min(w / scale, maxWidth);
        let newHeight = Math.min(h / scale, maxHeight);

        // if (
        //   Math.abs(newWidth - GameModel.GAME_WIDTH) < 16 &&
        //   Math.abs(newHeight - GameModel.GAME_HEIGHT) < 16
        // ) {
        //   return;
        // }

        // let defaultRatio = SAFE_GAME_WIDTH / SAFE_GAME_HEIGHT;
        // let maxRatioWidth = MAX_WIDTH / SAFE_GAME_HEIGHT;
        // let maxRatioHeight = SAFE_GAME_WIDTH / MAX_HEIGHT;

        // // // smooth scaling
        // let smooth = 1;

        // const maxSmoothScale = 1.15;
        // const normalize = (value, min, max) => {
        //   return (value - min) / (max - min);
        // };
        // if (width / height < w / h) {
        //   smooth =
        //     -normalize(newWidth / newHeight, defaultRatio, maxRatioWidth) /
        //       (1 / (maxSmoothScale - 1)) +
        //     maxSmoothScale;
        // } else {
        //   smooth =
        //     -normalize(newWidth / newHeight, defaultRatio, maxRatioHeight) /
        //       (1 / (maxSmoothScale - 1)) +
        //     maxSmoothScale;
        // }
        window.realWidth = newWidth;
        window.realHeight = newHeight;

        // let oldW = newWidth;
        // newWidth = Math.round(newWidth);

        // newHeight = Math.round(newHeight);
        let c = 16;
        if (newWidth > SAFE_GAME_WIDTH) {
            newWidth = Math.floor(newWidth / c) * c + c;
            //   newHeight = Math.floor(newHeight / c) * c + c * 0.5625;
        }

        if (newHeight > SAFE_GAME_HEIGHT) {
            newHeight = Math.floor(newHeight / c) * c + c;
        }

        game.scale.resize(newWidth, newHeight);
        //game.scale.autoCenter
        // scale the width and height of the css
        game.canvas.style.width = newWidth * scale + "px";
        game.canvas.style.height = newHeight * scale + "px";

        // center the game with css margin
        window.testScale = scale;
        game.canvas.style.marginTop = `${(h - newHeight * scale) / 2}px`;
        game.canvas.style.marginLeft = `${
            (w - newWidth * scale) / 2 // + (MAX_WIDTH - oldW) / 2
        }px`;
    };
    window.addEventListener("resize", (event) => {
        //  resize();
    });

    // resize();
});
const StartGame = (parent) => {
    const game = new Phaser.Game({ ...config, parent: parent });
    globalThis.__PHASER_GAME__ = game;
    return game;
};

export default StartGame;

//export default game;
