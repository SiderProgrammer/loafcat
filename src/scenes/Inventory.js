import { Scene } from "phaser";
import { fadeIn } from "../helpers/common";
import { GameModel } from "../models/GameModel";
import Button from "../components/Button";

export class Inventory extends Scene {
  constructor() {
    super("Inventory");
  }

  create({ parentScene, inventoryData }) {
    this.parentScene = parentScene;
    this.inventoryData = inventoryData;

    this.elementsContainer = this.add.container(
      this.game.config.width / 2,
      this.game.config.height / 2
    );
    // TODO : quantity items stacking
    this.board = this.add.sprite(0, 0, "statsBoard").setScale(10);
    this.slots = [];
    let slotIndex = 0;
    for (let column = 0; column <= 5; column++) {
      for (let row = 0; row <= 5; row++) {
        slotIndex++;
        const x = 150 + column * 30;
        const y = 100 + row * 30;
        this.slots[slotIndex] = { x, y, item: {} };
        this.add.image(x, y, "levelFrame");
      }
    }

    inventoryData.forEach((item) => {
      const invItem = this.addItem(item, item.index);
      this.slots[item.index].item = invItem;
    });

    // this.addItem(GameModel.GAME_WIDTH / 2, GameModel.GAME_HEIGHT / 2, {
    //   image: "loafcat",
    // });
    // this.addItem(GameModel.GAME_WIDTH / 2 + 50, GameModel.GAME_HEIGHT / 2, {
    //   image: "thunderIcon",
    // });
    // this.addItem(GameModel.GAME_WIDTH / 2 + 100, GameModel.GAME_HEIGHT / 2, {
    //   image: "hearthIcon",
    // });
    // this.addItem(GameModel.GAME_WIDTH / 2, GameModel.GAME_HEIGHT / 2 + 50, {
    //   image: "hearthIcon",
    // });
    this.closeButton = new Button(this, 70, -60, "closeButton");

    this.closeButton.onClick(async () => {
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

  addItem(itemData, slot) {
    const { x, y } = this.slots[slot];
    itemData.itemDetails.name = "loafcat";
    const itemContainer = this.add.container(x, y);
    itemContainer.frame = this.add.image(0, 0, "avatarFrame").setScale(0.5);
    itemContainer.image = this.add.image(0, 0, itemData.itemDetails.name);

    // itemContainer.title = this.add
    //   .text(-55, 0, itemData.title)
    //   .setOrigin(0, 0.5);
    // itemContainer.cost = this.add.text(30, 0, itemData.cost).setOrigin(0, 0.5);
    // itemContainer.coin = this.add.image(70, 0, "coin");

    // itemContainer.purchaseButton = this.add.image(90, 0, "storeButton");

    return itemContainer.add([
      itemContainer.frame,
      itemContainer.image,
      //   itemContainer.title,
      //   itemContainer.cost,
      //   itemContainer.coin,
      //   itemContainer.purchaseButton,
    ]);
  }
}
