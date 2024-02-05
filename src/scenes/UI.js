import { Scene } from "phaser";
import { fadeOut } from "../helpers/common";
import { UserModel } from "../models/UserModel";
import axios from "axios";
import Button from "../components/Button";

export class UI extends Scene {
  constructor() {
    super("UI");
  }

  create() {
    this.loafcat = this.add.sprite(0, 0, "loafcat");

    this.avatarSection = this.add.container(20, 20);
    this.avatarFrame = this.add.sprite(0, 0, "avatarFrame");
    this.avatarImage = this.add.sprite(0, 0, "loafcat");

    this.coin = this.add.sprite(30, -10, "coin");
    this.coinsValue = this.add
      .text(40, -10, "200", { fontSize: 10 })
      .setOrigin(0, 0.5);

    this.levelFrame = this.add.sprite(30, 5, "levelFrame").setScale(0.5);
    this.levelValue = this.add
      .text(23, 5, "13", { fontSize: 10 })
      .setOrigin(0, 0.5);
    this.levelBar = this.add
      .sprite(40, 5, "statsProgressBar")
      .setOrigin(0, 0.5)
      .setScale(1.5);

    this.avatarSection.add([
      this.avatarFrame,
      this.avatarImage,

      this.coin,
      this.coinsValue,

      this.levelFrame,
      this.levelValue,
      this.levelBar,
    ]);

    this.gearButton = this.add.sprite(
      0,
      this.game.config.height - 12,
      "gearButton"
    );

    this.mainMenuButton = new Button(
      this,
      0,
      this.game.config.height - 12,
      "mainMenuButton"
    );
    this.mainMenuButton.onClick(async () => {
      const inventoryData = await axios({
        method: "POST",
        url: `http://localhost:3000/api/user-items/`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: {
          UserID: UserModel.USER_ID,
        },
      });

      const bgFadeOut = await fadeOut(this, 250);
      console.log(inventoryData);
      await Promise.all([inventoryData, bgFadeOut]);

      this.scene.launch("Inventory", {
        parentScene: this,
        inventoryData: inventoryData.data,
      });
    });

    this.storeButton = new Button(
      this,
      0,
      this.game.config.height - 12,
      "storeButton"
    );
    this.storeButton.onClick(async () => {
      // TODO : fix request URL to shop
      const shopData = await axios({
        method: "GET",
        url: `http://localhost:3000/api/daily-items`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: {
          UserID: UserModel.USER_ID,
        },
      });
      const bgFadeOut = await fadeOut(this, 250);
      console.log(shopData.data);
      await Promise.all(shopData.data, bgFadeOut);
      this.scene.launch("Shop", {
        parentScene: this,
        itemsData: shopData.data,
      });
    });

    this.statsButton = new Button(
      this,
      0,
      this.game.config.height - 12,
      "statsButton"
    );
    this.statsButton.onClick(async () => {
      const petData = await axios({
        method: "POST",
        url: "http://localhost:3000/api/my-pet",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: {
          UserID: UserModel.USER_ID,
          PetID: "6",
        },
      });

      const bgFadeOut = await fadeOut(this, 250);
      await Promise.all([petData, bgFadeOut]);
      this.scene.launch("Stats", {
        parentScene: this,
        petData: petData.data.pet,
      });
    });

    this.leaderboardButton = new Button(
      this,
      0,
      this.game.config.height - 12,
      "leaderboardButton"
    );
    this.leaderboardButton.onClick(async () => {
      const leaderboardData = await axios({
        method: "POST",
        url: "http://localhost:3000/api/leadersboard",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: {
          UserID: UserModel.USER_ID,
          limit: "50",
        },
      });
      const bgFadeOut = fadeOut(this, 250);
      await Promise.all([leaderboardData, bgFadeOut]);
      this.scene.launch("Leaderboard", {
        parentScene: this,
        leaderboardData: leaderboardData.data.leadersBoard,
      });
    });

    this.scale.on("resize", (gameSize, baseSize, displaySize, resolution) => {
      this.cameras.resize(gameSize.width, gameSize.height);
      this.setSpritesPosition(gameSize.width);
    });

    this.setSpritesPosition(this.game.config.width);
  }

  setSpritesPosition(gameWidth) {
    this.loafcat.x = gameWidth - 50;
    this.gearButton.x = gameWidth - 12;
    this.mainMenuButton.x = gameWidth - 32;
    this.storeButton.x = gameWidth - 52;
    this.statsButton.x = gameWidth - 72;
    this.leaderboardButton.x = gameWidth - 92;
  }
}
