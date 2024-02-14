import Phaser from "phaser";
export default class Button extends Phaser.GameObjects.Image {
  constructor(scene, x, y, image) {
    super(scene, x, y, image);
    scene.add.existing(this);
    this.scene = scene;

    this.setInteractive();
    // this.on("pointerdown", () => {
    //   this.setScale(0.95);
    // });

    // this.on("pointerup", () => {
    //   this.setScale(1);
    // });
  }

  onClick(callback) {
    this.on("pointerup", () => {
      callback();
    });
    return this;
  }
}
