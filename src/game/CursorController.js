import { HOST } from "../sharedConstants/constants";

export default class CursorController {
    constructor(scene) {
        this.scene = scene;
        this.idle();
    }

    idle() {
        this.changeTexture("pointer");
    }

    indicator() {
        this.changeTexture("pointerPoint");
    }

    grab() {
        this.changeTexture("pointerHold");
    }

    soap() {
        this.changeTexture("soapImage");
    }

    changeTexture(textureKey) {
        this.scene.input.setDefaultCursor(
            `url("${HOST}assets/${textureKey}.png"), pointer`
        );
    }
}
