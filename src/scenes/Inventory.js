import { Scene } from "phaser";
import { fadeIn } from "../helpers/common";
import { GameModel } from "../models/GameModel";
import Button from "../components/Button";
import { SAFE_GAME_HEIGHT, SAFE_GAME_WIDTH } from "../constants/viewport";

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

    this.board = this.add.sprite(0, 0, "statsBoard").setScale(10);
    this.slots = [];
    let slotIndex = 0;
    for (let column = 0; column <= 5; column++) {
      for (let row = 0; row <= 5; row++) {
        const x = 150 + row * 30;
        const y = 100 + column * 30;
        this.slots[slotIndex] = { x, y, item: {} };
        this.add.image(x, y, "levelFrame");
        slotIndex++;
      }
    }

    inventoryData.forEach((item, i) => {
      if (item.quantity === 0) return;
      // TODO : later can use item.index instead
      const invItem = this.addItem(item, i);
      this.slots[i].item = invItem;
    });

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
    this.addInputs();
  }

  setSpritesPosition(gameWidth) {}

  addItem(itemData, slot) {
    const { x, y } = this.slots[slot];

    itemData.itemDetails.name = "apple";
    const itemContainer = this.add.container(x, y);
    // itemContainer.frame = this.add.image(0, 0, "avatarFrame").setScale(0.5);
    itemContainer.itemData = itemData;
    itemContainer.item = this.add.image(0, 0, itemData.itemDetails.name);
    itemContainer.item.setInteractive();
    itemContainer.quantityText = this.add.bitmapText(
      5,
      5,
      "WhitePeaberry",
      itemData.quantity
    );
    // itemContainer.quantityText = this.add.text(5, 5, itemData.quantity, {
    //   fontSize: 10,
    // });

    // TODO : change main scene input to work with inventory instead add only call 1 method from main scene on pointerup
    itemContainer.item.on("pointerdown", () => {
      this.scene.sleep();
      this.parentScene.blackOverlay.setVisible(false);
      GameModel.MAIN_SCENE.setStateCatFeed();

      const diffX = GameModel.MAIN_SCENE.cameras.main.scrollX;
      const diffY = GameModel.MAIN_SCENE.cameras.main.scrollY;

      this.itemInUse = GameModel.MAIN_SCENE.add
        .image(
          GameModel.MAIN_SCENE.input.activePointer.worldX + diffX,
          GameModel.MAIN_SCENE.input.activePointer.worldY + diffY,
          itemData.itemDetails.name
        )
        .setInteractive();

      this.itemInUse.slot = slot;
    });

    // itemContainer.title = this.add
    //   .text(-55, 0, itemData.title)
    //   .setOrigin(0, 0.5);
    // itemContainer.cost = this.add.text(30, 0, itemData.cost).setOrigin(0, 0.5);
    // itemContainer.coin = this.add.image(70, 0, "coin");

    // itemContainer.purchaseButton = this.add.image(90, 0, "storeButton");

    return itemContainer.add([
      //itemContainer.frame,
      itemContainer.item,
      itemContainer.quantityText,
      //   itemContainer.title,
      //   itemContainer.cost,
      //   itemContainer.coin,
      //   itemContainer.purchaseButton,
    ]);
  }
  itemUsed(slot) {
    const item = this.slots[slot].item;
    const quantity = --item.itemData.quantity;

    if (quantity <= 0) {
      item.removeAll(true);
      item.destroy();
      return;
    }
    item.quantityText.setText(quantity);
  }

  addInputs() {
    GameModel.MAIN_SCENE.input.on("pointermove", () => {
      if (!this.itemInUse) return;
      this.itemInUse.setPosition(
        GameModel.MAIN_SCENE.input.activePointer.worldX,
        GameModel.MAIN_SCENE.input.activePointer.worldY
      );
    });

    GameModel.MAIN_SCENE.input.on("pointerup", () => {
      if (!this.itemInUse) return;

      // TODO : check if mouse hovering pet
      GameModel.MAIN_SCENE.checkFeedPet(
        this.slots[this.itemInUse.slot].item.itemData
      );
      GameModel.MAIN_SCENE.setStateCatIdle();

      this.itemInUse.destroy();
      this.scene.wake();
      this.parentScene.blackOverlay.setVisible(true);
      this.itemUsed(this.itemInUse.slot);
    });
  }
}
