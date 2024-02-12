import { Scene } from "phaser";
import { fadeIn } from "../helpers/common";
import { GameModel } from "../models/GameModel";
import Button from "../components/Button";
import axios from "axios";
import { UserModel } from "../models/UserModel";

export class Shop extends Scene {
  constructor() {
    super("Shop");
  }

  create({ parentScene, itemsData }) {
    this.parentScene = parentScene;
    this.itemsData = itemsData;

    this.items = [];

    this.elementsContainer = this.add.container(
      this.game.config.width / 2,
      this.game.config.height / 2
    );

    // TODO : refresh every 24 hours
    // TODO : make buy button work

    this.updateItems(itemsData);

    this.board = this.add.sprite(0, 0, "statsBoard").setScale(10);

    this.refreshButton = new Button(this, 0, -70, "statsButton");
    this.refreshButton.onClick(async () => {
      await axios({
        method: "POST",
        url: "http://localhost:3000/api/refresh-items",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: {
          UserID: UserModel.USER_ID,
        },
      });

      const newItems = await axios({
        method: "POST",
        url: `http://localhost:3000/api/daily-items`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: {
          UserID: UserModel.USER_ID,
        },
      });

      this.updateItems(newItems.data);
    });

    this.closeButton = new Button(this, 70, -60, "closeButton");

    this.closeButton.onClick(async () => {
      this.parentScene.scene.stop(this.scene.key);
      fadeIn(this.parentScene, 250);
    });

    this.elementsContainer.add([
      this.board,
      this.closeButton,
      this.refreshButton,
    ]);

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

    return itemContainer;
  }

  updateItems(itemsData) {
    if (this.items.length > 0) {
      this.items.forEach((item) => {
        item.removeAll(true);
      });
      this.items = [];
    }

    itemsData.forEach((itemData, i) => {
      const item = this.addItem(100 + i * 30, {
        image: "loafcat", //itemData.item_name,
        title: itemData.ItemID.item_name,
        cost: itemData.ItemID.Price,
      });

      this.items.push(item);
    });
  }
}
