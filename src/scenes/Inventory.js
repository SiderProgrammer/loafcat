import { Scene } from "phaser";
import { fadeIn } from "../helpers/common";
import { GameModel } from "../models/GameModel";

export class Inventory extends Scene {
  constructor() {
    super("Inventory");
  }

  create({ parentScene }) {
    this.parentScene = parentScene;

    this.elementsContainer = this.add.container(
      this.game.config.width / 2,
      this.game.config.height / 2
    );

    this.board = this.add.sprite(0, 0, "statsBoard").setScale(10);

    this.addItem(GameModel.GAME_WIDTH / 2, GameModel.GAME_HEIGHT / 2, {
      image: "loafcat",
    });
    this.addItem(GameModel.GAME_WIDTH / 2 + 50, GameModel.GAME_HEIGHT / 2, {
      image: "thunderIcon",
    });
    this.addItem(GameModel.GAME_WIDTH / 2 + 100, GameModel.GAME_HEIGHT / 2, {
      image: "hearthIcon",
    });
    this.addItem(GameModel.GAME_WIDTH / 2, GameModel.GAME_HEIGHT / 2 + 50, {
      image: "hearthIcon",
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

  addItem(x, y, itemData) {
    const itemContainer = this.add.container(x, y);
    itemContainer.frame = this.add.image(0, 0, "avatarFrame").setScale(0.5);
    itemContainer.image = this.add.image(0, 0, itemData.image);
    // itemContainer.title = this.add
    //   .text(-55, 0, itemData.title)
    //   .setOrigin(0, 0.5);
    // itemContainer.cost = this.add.text(30, 0, itemData.cost).setOrigin(0, 0.5);
    // itemContainer.coin = this.add.image(70, 0, "coin");

    // itemContainer.purchaseButton = this.add.image(90, 0, "storeButton");

    itemContainer.add([
      itemContainer.frame,
      itemContainer.image,
      //   itemContainer.title,
      //   itemContainer.cost,
      //   itemContainer.coin,
      //   itemContainer.purchaseButton,
    ]);
  }
}
