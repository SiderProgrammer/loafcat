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

    this.board = this.add.sprite(0, 0, "shopPopup");
    const shopTab = this.add.sprite(-122, -106, "shopTab");
    const timeTab = this.add.sprite(-22, -105, "timeTab");
    const whiteBox = new Button(this, 107, 20, "whiteBox");

    const buyButton = new Button(this, 107, 75, "greyButton");

    this.refreshButton = new Button(this, -58, 75, "chocolateButton");
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
      shopTab,
      timeTab,
      whiteBox,

      buyButton,
    ]);
    this.updateItems(itemsData);
    this.scale.on("resize", (gameSize, baseSize, displaySize, resolution) => {
      this.cameras.resize(gameSize.width, gameSize.height);
      // this.setSpritesPosition(gameSize.width);
    });

    //  this.setSpritesPosition(this.game.config.width);
  }

  setSpritesPosition(gameWidth) {}

  addItem(x, y, itemData) {
    const itemContainer = this.add.container(x, y);
    const box = this.add.image(0, 0, "itemBox");
    const priceBox = this.add.image(0, 40, "chocolateButtonSmall");
    itemContainer.image = this.add.image(0, 5, itemData.image);
    itemContainer.title = this.add
      .text(-55, -15, itemData.title, { fontFamily: "slkscr" })
      .setOrigin(0, 0.5)
      .setScale(0.5);
    itemContainer.cost = this.add
      .text(0, 40, itemData.cost, { fontFamily: "slkscr" })
      .setOrigin(0, 0.5)
      .setScale(0.5);
    // itemContainer.coin = this.add.image(70, 0, "coin");

    // itemContainer.purchaseButton = this.add.image(90, 0, "storeButton");

    itemContainer.add([
      box,
      priceBox,
      itemContainer.image,
      itemContainer.title,
      itemContainer.cost,
      // itemContainer.coin,
      // itemContainer.purchaseButton,
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
      // TODO : set limit on backend to 6
      if (i >= 1) return;

      const item = this.addItem(-120, -60, {
        image: "loafcat", //itemData.item_name,
        title: itemData.ItemID.item_name,
        cost: itemData.ItemID.Price,
      });

      this.items.push(item);

      this.elementsContainer.add(item);
    });
  }
}
