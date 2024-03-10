import { Scene } from "phaser";
import { fadeIn } from "../helpers/common";
import { GameModel } from "../models/GameModel";
import Button from "../components/Button";
import { UserModel } from "../models/UserModel";
import { EventBus } from "../EventBus";

export class SignIn extends Scene {
    constructor() {
        super("SignIn");
    }

    create({ parentScene }) {
        this.parentScene = parentScene;
        // if (document.location.pathname.includes("game")) {
        //     this.scene.start("Preloader");
        // }
        // TODO : should listen for built in event instead
        // EventBus.on("startPreloader", () => {
        //     this.scene.start("Preloader");
        // });
        // if (window.solana.connect()) {
        //     this.scene.start("Preloader");
        //     return;
        // }
        this.scene.start("Preloader");
        // TODO : change backgrounds here
    }
}
