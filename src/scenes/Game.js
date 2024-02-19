import { Scene } from "phaser";
import { GameModel } from "../models/GameModel";
import {
  MAX_HEIGHT,
  MAX_WIDTH,
  SAFE_GAME_HEIGHT,
  SAFE_GAME_WIDTH,
} from "../constants/viewport";
import axios from "axios";
import { UserModel } from "../models/UserModel";
import Loafcat from "../components/Loafcat";
import { linkTilemaps } from "../helpers/linkTilemaps";
import { houseRoomsPlacement } from "../constants/houseRooms";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  async create({ map }) {
    this.mapKey = map;
    GameModel.MAIN_SCENE = this;
    this.scene.launch("UI");
    this.cameras.main.setBackgroundColor(0x00ff00);

    //this.add.image(512, 384, "background").setAlpha(0.5);

    this.createMap();

    this.loafcat = new Loafcat(this, 80, 275, "loafcat");
    this.loafcat.listenMusic();
    // this.loafcat.moveRandomly();

    // this.add.sprite(73, 182, "pee").play("pee-idle").setFlipX(true);
    this.scale.on("resize", (gameSize, baseSize, displaySize, resolution) => {
      this.cameras.resize(gameSize.width, gameSize.height);
      GameModel.GAME_WIDTH = gameSize.width;
      // window.innerWidth / window.testScale < MAX_WIDTH
      //   ? window.innerWidth / window.testScale
      //   : MAX_WIDTH;
      document.getElementById("game-container").children[0].style.width =
        document.querySelector("canvas").style.width;
      document.getElementById("game-container").children[0].style.height =
        document.querySelector("canvas").style.height;

      GameModel.GAME_HEIGHT = gameSize.height;
      this.cameras.main.setViewport(0, 0, gameSize.width, gameSize.height);
      // TODO : fix it
      this.cameras.main.centerOn(
        Math.round(SAFE_GAME_WIDTH / 2 + (MAX_WIDTH - SAFE_GAME_WIDTH) / 2),
        Math.round(SAFE_GAME_HEIGHT / 2 + (MAX_HEIGHT - SAFE_GAME_HEIGHT) / 2) +
          3.5
      );
    });

    // this.petData = await axios({
    //   method: "POST",
    //   url: "http://localhost:3000/api/my-pet",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    //   data: {
    //     UserID: UserModel.USER_ID,
    //     PetID: UserModel.PET_ID,
    //   },
    // });
    // console.log(this.petData.data.pet);
    //this.loafcat.checkAddNotification(this.petData.data.pet);\
  }

  createMap() {
    this.map = this.make.tilemap({ key: this.mapKey });
    linkTilemaps(this.map, this.mapKey);

    if (!houseRoomsPlacement[this.mapKey]) return;

    this.nextFloor = this.make.tilemap({
      key: houseRoomsPlacement[this.mapKey].nextFloor,
    });
    linkTilemaps(
      this.nextFloor,
      houseRoomsPlacement[this.mapKey].nextFloor,
      true
    );
  }

  setStateCatFeed() {
    this.loafcat.setStateCatFeed();
  }
  setStateCatIdle() {
    this.loafcat.setStateCatIdle();
  }

  checkFeedPet(itemData) {
    this.loafcat.feed(1); // itemData.itemDetails.pointValue

    axios({
      method: "POST",
      url: "http://localhost:3000/api/feed-pet",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        UserID: UserModel.USER_ID,
        PetID: UserModel.PET_ID,

        ItemID: itemData.itemDetails.ItemID,

        foodType: itemData.itemDetails.category,
        quantity: 1,
      },
    });
  }
}
