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
    // this.add

    this.loafcat = new Loafcat(this, 80, 275, "loafcat");
    this.loafcat.listenMusic();
    // this.loafcat.moveRandomly();

    // this.add.sprite(73, 182, "pee").play("pee-idle").setFlipX(true);
    this.scale.on("resize", (gameSize, baseSize, displaySize, resolution) => {
      this.cameras.resize(gameSize.width, gameSize.height);
      GameModel.GAME_WIDTH = gameSize.width;
      GameModel.GAME_HEIGHT = gameSize.height;

      this.cameras.main.setViewport(0, 0, gameSize.width, gameSize.height);

      this.cameras.main.centerOn(
        SAFE_GAME_WIDTH / 2 + (MAX_WIDTH - SAFE_GAME_WIDTH) / 2,
        //gameSize.height / 2
        SAFE_GAME_HEIGHT / 2 + (MAX_HEIGHT - SAFE_GAME_HEIGHT) / 2
      );
    });

    this.petData = await axios({
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
    console.log(this.petData.data.pet);
    //this.loafcat.checkAddNotification(this.petData.data.pet);
  }

  createMap() {
    this.map = this.make.tilemap({ key: this.mapKey });
    linkTilemaps(this, this.mapKey);
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
        PetID: "6",

        ItemID: itemData.itemDetails.ItemID,

        foodType: itemData.itemDetails.category,
        quantity: 1,
      },
    });
  }
}
