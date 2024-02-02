import { Scene } from "phaser";
import { fadeIn } from "../helpers/common";

export class Stats extends Scene {
  constructor() {
    super("Stats");
  }

  create({ parentScene }) {
    this.parentScene = parentScene;

    this.elementsContainer = this.add.container(
      this.game.config.width / 2,
      this.game.config.height / 2
    );
    this.loafcat = this.add.sprite(-10, 0, "loafcat").setScale(2);

    this.board = this.add.sprite(0, 0, "statsBoard").setScale(10);

    this.healthIcon = this.add.sprite(30, -40, "hearthIcon");
    this.happinesIcon = this.add.sprite(30, -20, "thunderIcon");
    this.hungerIcon = this.add.sprite(30, 0, "hungerIcon");
    this.cleanlinessIcon = this.add.sprite(30, 20, "hourGlassIcon");

    this.healthBar = this.add.sprite(50, -40, "statsProgressBar");

    this.closeButton = this.add
      .sprite(70, -60, "closeButton")
      .setInteractive()
      .on("pointerdown", async () => {
        this.parentScene.scene.stop(this.scene.key);
        fadeIn(this.parentScene, 250);
      });

    this.elementsContainer.add([
      this.board,
      this.loafcat,

      this.healthIcon,
      this.happinesIcon,
      this.hungerIcon,
      this.cleanlinessIcon,
      this.healthBar,
      this.closeButton,
    ]);

    this.scale.on("resize", (gameSize, baseSize, displaySize, resolution) => {
      this.cameras.resize(gameSize.width, gameSize.height);
      // this.setSpritesPosition(gameSize.width);
    });

    //  this.setSpritesPosition(this.game.config.width);
  }

  setSpritesPosition(gameWidth) {}
}
