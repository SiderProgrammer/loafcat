import { Scene } from "phaser";
import { fadeOut } from "../helpers/common";
import { UserModel } from "../models/UserModel";
import axios from "axios";
import Button from "../components/Button";
import { GameModel } from "../models/GameModel";
// TODO : this scene should be set visible/invisible instead of destroying and starting again
export class UI extends Scene {
  constructor() {
    super("UI");
  }

  init() {
    this.listenersAttached = false;
  }

  create() {
    this.avatarSectionPhaser = this.add
      .dom(50, 50)
      .createFromCache("avatarSection");

    this.avatarSectionHTML = document.getElementById("avatarSection");

    this.statsDropDownMenuPhaser = this.add
      .dom(50, 50)
      .createFromCache("statsDropDownMenu");

    this.statsDropDownMenuHTML = document.getElementById("statsDropDownMenu");

    this.bottomButtonsSectionPhaser = this.add
      .dom(350, 350)
      .createFromCache("bottomButtonsSection");
    this.bottomButtonsSectionHTML = document.getElementById(
      "bottomButtonsSection"
    );

    if (!this.listenersAttached) {
      this.getHTMLButtons();
      this.addHTMLButtonsEvents();

      this.listenersAttached = true;
    }

    // this.gearButton = this.add.sprite(0, 0, "gearButton");
    // this.mainMenuButton = new Button(this, 0, 0, "mainMenuButton");
    // this.storeButton = new Button(this, 0, 0, "storeButton");

    this.scale.on("resize", () => {
      this.resize();
    });
    this.resize();
  }

  resize() {
    //  this.cameras.resize(GameModel.GAME_WIDTH, GameModel.GAME_HEIGHT);
    this.setSpritesPosition();

    // this.avatarSectionHTML.style.scale = window.testScale;
    // this.bottomButtonsSectionHTML.style.scale = window.testScale;
    // this.statsDropDownMenuHTML.style.scale = window.testScale;
  }

  setSpritesPosition() {
    // const gameWidth = this.scale.width;
    // const gameHeight = this.scale.width;
    // this.gearButton.x = gameWidth - 12; //+ (GameModel.GAME_WIDTH - window.realWidth) / 2;
    // this.mainMenuButton.x = gameWidth - 32;
    // this.storeButton.x = gameWidth - 52;
    // this.statsButton.x = gameWidth - 72;
    // this.leaderboardButton.x = gameWidth - 92;

    // const y =
    //   this.scale.displaySize.height > window.innerHeight
    //     ? window.innerHeight
    //     : this.scale.displaySize.height;
    // this.gearButton.y = y * this.scale.displayScale.y - 15;
    // this.mainMenuButton.y = gameHeight - 12;
    // this.storeButton.y = gameHeight - 12;
    // this.statsButton.y = gameHeight - 12;
    // this.leaderboardButton.y = gameHeight - 12;

    let scale = 1; //window.testScale;

    const gameWidth = this.scale.displaySize.width;
    // GameModel.GAME_WIDTH - (GameModel.GAME_WIDTH - window.oldW) / 2; //GameModel.GAME_WIDTH;
    const gameHeight = this.scale.displaySize.height;
    //  GameModel.GAME_WIDTH - (GameModel.GAME_WIDTH - window.oldW) / 2;
    const y =
      this.scale.displaySize.height > window.innerHeight
        ? (this.scale.displaySize.height - window.innerHeight) / 2
        : 0;

    this.avatarSectionPhaser.y = y * this.scale.displayScale.y + 20; // + 50;
    this.avatarSectionPhaser.x = 20; // + 50;

    // this.avatarSectionPhaser.y =
    //   scale * 25 + ((GameModel.GAME_HEIGHT - window.realHeight) / 2) * scale; //0; // document.getElementById("game-container").children[0].style.height
    // // scale * 0 + ((GameModel.GAME_HEIGHT - window.realHeight) / 2) * scale; //+ 50;
    // //  this.scale.displaySize.
    // this.statsDropDownMenuPhaser.x =
    //   scale * 25 + ((GameModel.GAME_WIDTH - window.realWidth) / 2) * scale; // + 50;

    // this.statsDropDownMenuPhaser.y =
    //   scale * 55 + ((GameModel.GAME_HEIGHT - window.realHeight) / 2) * scale; //+ 50;

    // // TODO : try anchoring it from left side, this can fix overflow-y caused by big UI div
    // // TODO : fix positioning
    // this.bottomButtonsSectionPhaser.x =
    //   gameWidth * scale -
    //   67 * scale -
    //   ((GameModel.GAME_WIDTH - window.realWidth) / 2) * scale; //+

    // // ((GameModel.GAME_WIDTH - window.realWidth) / 2) * window.testScale; // + 50;
    const y2 =
      this.scale.displaySize.height < window.innerHeight
        ? window.innerHeight -
          (window.innerHeight - this.scale.displaySize.height)
        : innerHeight -
          (window.innerHeight - this.scale.displaySize.height) / 2;

    this.bottomButtonsSectionPhaser.y = this.scale.displayScale.y * y2;
  }

  getHTMLButtons() {
    this.mainMenuButton = document.getElementById("mainMenuButton");
    this.storeButton = document.getElementById("storeButton");
    this.statsButton = document.getElementById("statsButton");
    this.leaderboardButton = document.getElementById("leaderboardButton");
  }
  addHTMLButtonsEvents() {
    // TODO : add preventDefault on click events
    this.mainMenuButton.addEventListener("click", async () => {
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

      console.log(inventoryData);

      this.scene.launch("Inventory", {
        parentScene: this,
        inventoryData: inventoryData.data,
      });
    });
    this.storeButton.addEventListener("click", async () => {
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

      console.log(shopData.data);

      this.scene.launch("Shop", {
        parentScene: this,
        itemsData: shopData.data,
      });
    });
    this.statsButton.addEventListener("click", async () => {
      const petData = await axios({
        method: "POST",
        url: "http://localhost:3000/api/my-pet",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: {
          UserID: UserModel.USER_ID,
          PetID: UserModel.PET_ID,
        },
      });
      console.log(petData);
      this.scene.launch("Stats", {
        parentScene: this,
        petData: petData.data.pet,
      });
    });
    this.leaderboardButton.addEventListener("click", async () => {
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
      console.log(leaderboardData);
      this.scene.launch("Leaderboard", {
        parentScene: this,
        leaderboardData: leaderboardData.data.leadersBoard,
      });
    });
  }
}
