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

    this.scale.on("resize", () => {
      this.resize();
    });
    this.resize();
  }

  resize() {
    this.cameras.resize(GameModel.GAME_WIDTH, GameModel.GAME_HEIGHT);
    this.setSpritesPosition();

    this.avatarSectionHTML.style.scale = window.testScale;
    this.bottomButtonsSectionHTML.style.scale = window.testScale;
    this.statsDropDownMenuHTML.style.scale = window.testScale;
  }

  setSpritesPosition() {
    let scale = window.testScale;

    const gameWidth = GameModel.GAME_WIDTH;
    // GameModel.GAME_WIDTH - (GameModel.GAME_WIDTH - window.oldW) / 2; //GameModel.GAME_WIDTH;
    const gameHeight = GameModel.GAME_HEIGHT;
    //  GameModel.GAME_WIDTH - (GameModel.GAME_WIDTH - window.oldW) / 2;
    this.avatarSectionPhaser.x =
      scale * 25 + ((GameModel.GAME_WIDTH - window.realWidth) / 2) * scale; // + 50;

    this.avatarSectionPhaser.y =
      scale * 25 + ((GameModel.GAME_HEIGHT - window.realHeight) / 2) * scale; //0; // document.getElementById("game-container").children[0].style.height
    // scale * 0 + ((GameModel.GAME_HEIGHT - window.realHeight) / 2) * scale; //+ 50;

    this.statsDropDownMenuPhaser.x =
      scale * 25 + ((GameModel.GAME_WIDTH - window.realWidth) / 2) * scale; // + 50;

    this.statsDropDownMenuPhaser.y =
      scale * 55 + ((GameModel.GAME_HEIGHT - window.realHeight) / 2) * scale; //+ 50;

    // TODO : try anchoring it from left side, this can fix overflow-y caused by big UI div
    // TODO : fix positioning
    this.bottomButtonsSectionPhaser.x =
      gameWidth * scale -
      67 * scale -
      ((GameModel.GAME_WIDTH - window.realWidth) / 2) * scale; //+

    // ((GameModel.GAME_WIDTH - window.realWidth) / 2) * window.testScale; // + 50;

    this.bottomButtonsSectionPhaser.y =
      gameHeight * scale -
      scale * 10 -
      ((GameModel.GAME_HEIGHT - window.realHeight) / 2) * scale; //+ 50;
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
