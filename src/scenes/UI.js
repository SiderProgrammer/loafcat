import { Scene } from "phaser";
import { fadeOut } from "../helpers/common";
import { UserModel } from "../models/UserModel";
import axios from "axios";
import Button from "../components/Button";
import { GameModel } from "../models/GameModel";

export class UI extends Scene {
  constructor() {
    super("UI");
  }

  create() {
    this.avatarSection = this.add.container(20, 20);
    this.avatarFrame = this.add.sprite(0, 0, "avatarFrame");
    this.avatarImage = this.add.sprite(0, 0, "loafcat");

    this.coin = this.add.sprite(30, -10, "coin");

    this.avatarSectionPhaser = this.add
      .dom(50, 50)
      .createFromCache("avatarSection");

    this.avatarSectionHTML = document.getElementById("avatarSection");

    this.bottomButtonsSectionPhaser = this.add
      .dom(350, 350)
      .createFromCache("bottomButtonsSection");
    this.bottomButtonsSectionHTML = document.getElementById(
      "bottomButtonsSection"
    );

    this.coinsValue = this.add
      .bitmapText(40, -10, "WhitePeaberry", "200")

      .setOrigin(0, 0.5);

    this.levelFrame = this.add.sprite(30, 5, "levelFrame");
    this.levelValue = this.add
      .bitmapText(23, 5, "WhitePeaberry", "13")
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

    this.avatarSection.setVisible(false);

    this.gearButton = this.add.sprite(0, 0, "gearButton");

    this.mainMenuButton = new Button(this, 0, 0, "mainMenuButton");
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

    this.storeButton = new Button(this, 0, 0, "storeButton");
    this.storeButton.onClick(async () => {
      const shopData = await axios({
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
      const bgFadeOut = await fadeOut(this, 250);
      console.log(shopData.data);
      await Promise.all(shopData.data, bgFadeOut);
      this.scene.launch("Shop", {
        parentScene: this,
        itemsData: shopData.data,
      });
    });

    this.statsButton = new Button(this, 0, 0, "statsButton");
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

    this.leaderboardButton = new Button(this, 0, 0, "leaderboardButton");
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

    this.scale.on("resize", () => {
      this.cameras.resize(GameModel.GAME_WIDTH, GameModel.GAME_HEIGHT);
      this.setSpritesPosition();

      // avatarSection.style.left =
      //   parseFloat(document.querySelector("canvas").style.marginLeft) +
      //   Math.round((GameModel.GAME_WIDTH - window.realWidth) / 2) *
      //     window.testScale +
      //   35 +
      //   "px";
      // avatarSection.style.top =
      //   parseFloat(document.querySelector("canvas").style.marginTop) +
      //   Math.round((GameModel.GAME_HEIGHT - window.realHeight) / 2) *
      //     window.testScale +
      //   35 +
      //   "px";

      //this.test.setScale(window.testScale)
      this.avatarSectionHTML.style.scale = window.testScale;
      this.bottomButtonsSectionHTML.style.scale = window.testScale;
    });

    this.setSpritesPosition();
  }

  setSpritesPosition() {
    const gameWidth = GameModel.GAME_WIDTH;
    // GameModel.GAME_WIDTH - (GameModel.GAME_WIDTH - window.oldW) / 2; //GameModel.GAME_WIDTH;
    const gameHeight = GameModel.GAME_HEIGHT;
    //  GameModel.GAME_WIDTH - (GameModel.GAME_WIDTH - window.oldW) / 2;
    this.avatarSectionPhaser.x =
      window.testScale * 25 +
      ((GameModel.GAME_WIDTH - window.realWidth) / 2) * window.testScale; // + 50;

    this.avatarSectionPhaser.y =
      window.testScale * 25 +
      ((GameModel.GAME_HEIGHT - window.realHeight) / 2) * window.testScale; //+ 50;

    this.bottomButtonsSectionPhaser.x =
      gameWidth * window.testScale -
      100 * window.testScale -
      ((GameModel.GAME_WIDTH - window.realWidth) / 2) * window.testScale; //+
    // ((GameModel.GAME_WIDTH - window.realWidth) / 2) * window.testScale; // + 50;

    this.bottomButtonsSectionPhaser.y =
      gameHeight * window.testScale -
      window.testScale * 25 -
      ((GameModel.GAME_HEIGHT - window.realHeight) / 2) * window.testScale; //+ 50;

    this.avatarSection.x =
      20 + Math.round((GameModel.GAME_WIDTH - window.realWidth) / 2);
    this.avatarSection.y =
      20 + Math.round((GameModel.GAME_HEIGHT - window.realHeight) / 2);

    this.gearButton.x = gameWidth - 12; //+ (GameModel.GAME_WIDTH - window.realWidth) / 2;
    this.mainMenuButton.x = gameWidth - 32;
    this.storeButton.x = gameWidth - 52;
    this.statsButton.x = gameWidth - 72;
    this.leaderboardButton.x = gameWidth - 92;

    this.gearButton.y = gameHeight - 12;
    this.mainMenuButton.y = gameHeight - 12;
    this.storeButton.y = gameHeight - 12;
    this.statsButton.y = gameHeight - 12;
    this.leaderboardButton.y = gameHeight - 12;
  }
}
