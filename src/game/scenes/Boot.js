import { Scene } from "phaser";

export class Boot extends Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        // this.load.image("coin", "assets/coin.png");
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
