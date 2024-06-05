import { Scene } from "phaser";
import { HOST } from "../../sharedConstants/constants";

export class Boot extends Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        this.load.image(
            "preloadBackground",
            `${HOST}assets/preload/preloadBackground.png`
        );
        this.load.image("progressBar", `${HOST}assets/preload/progressBar.png`);
        this.load.image(
            "barContainer",
            `${HOST}assets/preload/barContainer.png`
        );
        // this.load.image("background", "assets/bg.png");
        // this.load.image("inputBox", "assets/inputBox.png");
        // this.load.spritesheet(`loafcat2`, `assets/loafcat.png`, {
        //   frameWidth: 32,
        //   frameHeight: 32,
        // });
    }

    create() {
        this.scene.start("SignIn");
    }
}
