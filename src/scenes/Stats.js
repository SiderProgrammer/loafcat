import { Scene } from "phaser";
import { fadeIn } from "../helpers/common";
import ProgressBar from "../components/ProgressBar";
import Button from "../components/Button";

export class Stats extends Scene {
  constructor() {
    super("Stats");
  }

  create({ parentScene, petData }) {
    this.parentScene = parentScene;
    this.petData = petData;
    console.log(petData);
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

    this.healthBar = new ProgressBar({
      scene: this,
      x: 50,
      y: -40,
      maxFillValue: 100,
      containerImage: "statsProgressBar",
      fillImage: "statsProgressBarFill",
    });

    this.happinesBar = new ProgressBar({
      scene: this,
      x: 50,
      y: -20,
      maxFillValue: 100,
      containerImage: "statsProgressBar",
      fillImage: "statsProgressBarFill",
    });

    this.hungerBar = new ProgressBar({
      scene: this,
      x: 50,
      y: 0,
      maxFillValue: 100,
      containerImage: "statsProgressBar",
      fillImage: "statsProgressBarFill",
    });

    this.cleanlinessBar = new ProgressBar({
      scene: this,
      x: 50,
      y: 20,
      maxFillValue: 100,
      containerImage: "statsProgressBar",
      fillImage: "statsProgressBarFill",
    });

    this.healthBar.updateProgress(petData.HealthLevel);
    this.happinesBar.updateProgress(petData.HappinessLevel);
    this.hungerBar.updateProgress(petData.HungerLevel);
    this.cleanlinessBar.updateProgress(petData.CleanlinessLevel);

    this.hungerButton = new Button(this, 100, 0, "statsButton");
    this.hungerButton.onClick(() => {
      this.scene.stop();
      this.scene.start("Game", { map: "kitchenMap" });
    });
    this.happinesButton = new Button(this, 100, -20, "statsButton");
    this.happinesButton.onClick(() => {
      this.scene.stop();
      this.scene.start("Game", { map: "chillRoomMap" });
    });

    this.closeButton = new Button(this, 70, -60, "closeButton");

    this.closeButton.onClick(async () => {
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

      this.closeButton,

      this.healthBar,
      this.happinesBar,
      this.hungerBar,
      this.cleanlinessBar,

      this.hungerButton,
      this.happinesButton,
    ]);

    this.scale.on("resize", (gameSize, baseSize, displaySize, resolution) => {
      this.cameras.resize(gameSize.width, gameSize.height);
      // this.setSpritesPosition(gameSize.width);
    });

    //  this.setSpritesPosition(this.game.config.width);
  }

  setSpritesPosition(gameWidth) {}
}
