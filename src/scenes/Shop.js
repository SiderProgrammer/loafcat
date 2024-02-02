import { Scene } from "phaser";
import { fadeIn } from "../helpers/common";
import { GameModel } from "../models/GameModel";

export class Shop extends Scene {
  constructor() {
    super("Shop");
  }

  create({ parentScene }) {
    this.parentScene = parentScene;

    this.elementsContainer = this.add.container(
      this.game.config.width / 2,
      this.game.config.height / 2
    );

    this.board = this.add.sprite(0, 0, "statsBoard").setScale(10);

    this.addItem(GameModel.GAME_HEIGHT / 2, {
      image: "loafcat",
      title: "kitty",
      cost: 40,
    });
    this.addItem(GameModel.GAME_HEIGHT / 2 + 30, {
      image: "thunderIcon",
      title: "thunder",
      cost: 999,
    });

    this.closeButton = this.add
      .sprite(70, -60, "closeButton")
      .setInteractive()
      .on("pointerdown", async () => {
        this.parentScene.scene.stop(this.scene.key);
        fadeIn(this.parentScene, 250);
      });

    this.elementsContainer.add([this.board, this.closeButton]);

    this.scale.on("resize", (gameSize, baseSize, displaySize, resolution) => {
      this.cameras.resize(gameSize.width, gameSize.height);
      // this.setSpritesPosition(gameSize.width);
    });

    //  this.setSpritesPosition(this.game.config.width);
  }

  setSpritesPosition(gameWidth) {}

  addItem(y, itemData) {
    const itemContainer = this.add.container(GameModel.GAME_WIDTH / 2, y);
    itemContainer.image = this.add.image(-80, 0, itemData.image);
    itemContainer.title = this.add
      .text(-55, 0, itemData.title)
      .setOrigin(0, 0.5);
    itemContainer.cost = this.add.text(30, 0, itemData.cost).setOrigin(0, 0.5);
    itemContainer.coin = this.add.image(70, 0, "coin");

    itemContainer.purchaseButton = this.add.image(90, 0, "storeButton");

    itemContainer.add([
      itemContainer.image,
      itemContainer.title,
      itemContainer.cost,
      itemContainer.coin,
      itemContainer.purchaseButton,
    ]);
  }
}
