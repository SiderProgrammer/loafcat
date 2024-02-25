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
import { MapInteractionSystem } from "../systems/MapInteractionSystem";
import { AlertSystem } from "../systems/AlertSystem";
import { PetModel } from "../models/PetModel";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  async create({ map }) {
    // this.scale.displaySize.setSnap(SAFE_GAME_WIDTH, SAFE_GAME_HEIGHT);
    // this.scale.refresh();
    this.mapKey = map;
    GameModel.MAIN_SCENE = this;
    this.scene.launch("UI");
    this.cameras.main.setBackgroundColor(0x00ff00);

    //this.add.image(512, 384, "background").setAlpha(0.5);
    this.alertSystem = new AlertSystem();
    this.mapInteractionSystem = new MapInteractionSystem(this);
    this.createMap();

    this.pet = new Loafcat(this, 80, 275, "loafcat");
    this.pet.moveRandomly();

    //this.pet.listenMusic();

    // this.pet.pee();
    //this.pet.bathing();

    this.scale.on("resize", () => {
      this.resize();
    });

    this.resize();

    this.petData = await axios({
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
    this.updatePetData(this.petData.data.pet);

    this.alertSystem.updateAlerts();

    console.log(this.petData.data.pet);

    this.input.on("pointermove", () => {
      if (!this.itemInUse) return;
      this.itemInUse.setPosition(
        this.input.activePointer.worldX,
        this.input.activePointer.worldY
      );
    });
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

    this.mapInteractionSystem.addInteractiveZones();
    this.mapInteractionSystem.addPointingArrows();
  }

  async checkFeedPet(itemData) {
    // TODO : memory leak?
    const petRect = new Phaser.Geom.Rectangle(
      this.pet.x - 25,
      this.pet.y - 25,
      50,
      50
    );
    if (
      !Phaser.Geom.Rectangle.Contains(
        petRect,
        this.input.activePointer.worldX,
        this.input.activePointer.worldY
      )
    )
      return false;

    this.updatePetData({
      ...this.petData.data.pet,
      HungerLevel: this.petData.data.pet.HungerLevel + 15,
    });
    this.alertSystem.updateAlerts();
    await this.pet.feed(1); // itemData.itemDetails.pointValue

    return true;
    // axios({
    //   method: "POST",
    //   url: "http://localhost:3000/api/feed-pet",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    //   data: {
    //     UserID: UserModel.USER_ID,
    //     PetID: UserModel.PET_ID,

    //     ItemID: itemData.itemDetails.ItemID,

    //     foodType: itemData.itemDetails.category,
    //     quantity: 1,
    //   },
    // });
  }

  updatePetData(data) {
    PetModel.PET_DATA = data;
  }

  setState(state) {
    // TODO : should be pipeline for all pet states?
    switch (state) {
      case "bath":
        // this.itemInUse = this.add
        //   .image(
        //     this.input.activePointer.worldX,
        //     this.input.activePointer.worldY,
        //     "soapImage"
        //   )
        //   .setDepth(3);
        this.map.getLayer("Bath").tilemapLayer.setDepth(2);
        this.pet.setState("bath");
        this.pet.character.setInteractive();
        let soapIn = false;
        let lastEventPoint = {
          x: this.input.activePointer.worldX,
          y: this.input.activePointer.worldY,
        };
        let dc = null;
        let counter = 0;
        // TODO : set cursor to soap, reset animation frames to first, check zooming in
        this.pet.character.on("pointerover", () => {
          const pointerPos = {
            x: this.input.activePointer.worldX,
            y: this.input.activePointer.worldY,
          };
          if (
            Phaser.Math.Distance.BetweenPoints(pointerPos, lastEventPoint) < 10
          )
            return;
          if (counter == 20) {
            console.log("bathed");
          }
          lastEventPoint = {
            x: this.input.activePointer.worldX,
            y: this.input.activePointer.worldY,
          };

          if (!dc) {
            console.log("create");
            this.pet.soap.anims.resume();
            this.pet.character.anims.resume();
            dc = setTimeout(() => {
              console.log("callback");
              this.pet.soap.anims.pause();
              this.pet.character.anims.pause();
              dc = null;
            }, 1000);
          } else if (dc) {
            console.log("in progress");
            clearTimeout(dc);
            dc = setTimeout(() => {
              console.log("callback");
              this.pet.soap.anims.pause();
              this.pet.character.anims.pause();
              dc = null;
            }, 1000);
          }
        });

        // this.pet.character.on("pointerout", () => {

        //  // soapIn = false;
        //   this.pet.soap.anims.pause();
        //   this.pet.character.anims.pause();
        // });

        // this.cameras.main.zoomTo(2, 500);
        // const tweenData = {
        //   scrollX: this.cameras.main.scrollX,
        //   scrollY: this.cameras.main.scrollY,
        // };
        // this.tweens.add({
        //   targets: tweenData,
        //   scrollX: 120,
        //   scrollY: 200,
        //   duration: 500,
        //   onUpdate: () => {
        //     this.cameras.main.setScroll(tweenData.scrollX, tweenData.scrollY);
        //     //   this.cameras.main.centerOn(tweenData.centerX, tweenData.centerY);
        //   },
        // });

        break;
    }
  }

  resize() {
    document.getElementById("game-container").children[0].style.width =
      document.querySelector("canvas").style.width;
    document.getElementById("game-container").children[0].style.height =
      document.querySelector("canvas").style.height;

    // this.resize();
    this.cameras.main.setBounds(0, -20, MAX_WIDTH, MAX_HEIGHT);
    this.cameras.main.centerOn(
      Math.round(SAFE_GAME_WIDTH / 2 + (MAX_WIDTH - SAFE_GAME_WIDTH) / 2),
      MAX_HEIGHT
      //  Math.round(SAFE_GAME_HEIGHT / 2 + (MAX_HEIGHT - SAFE_GAME_HEIGHT) / 2)
    );
    // GameModel.GAME_WIDTH = this.scale.width;
    // GameModel.GAME_HEIGHT = this.scale.height;

    // this.cameras.resize(this.scale.width, this.scale.height);

    // document.getElementById("game-container").children[0].style.width =
    //   document.querySelector("canvas").style.width;
    // document.getElementById("game-container").children[0].style.height =
    //   document.querySelector("canvas").style.height;

    // // this.cameras.main.setViewport(0, 0, gameSize.width, gameSize.height);
    // // // TODO : fix it

    // this.cameras.main.setBounds(0, 0, MAX_WIDTH, MAX_HEIGHT);
    // this.cameras.main.centerOn(
    //   Math.round(SAFE_GAME_WIDTH / 2 + (MAX_WIDTH - SAFE_GAME_WIDTH) / 2),
    //   Math.round(SAFE_GAME_HEIGHT / 2 + (MAX_HEIGHT - SAFE_GAME_HEIGHT) / 2) +
    //     3.5
    // );
  }
}

// this.cameras.main.zoomTo(2, 500);
// const tweenData = {
//   centerX: this.cameras.main.centerX,
//   centerY: this.cameras.main.centerY,
// };
// this.tweens.add({
//   targets: tweenData,
//   centerX: this.pet.x,
//   centerY: this.pet.y,
//   duration: 500,
//   onUpdate: () => {
//     this.cameras.main.centerOn(tweenData.centerX, tweenData.centerY);
//   },
// });
// this.cameras.main.zoomTo(1, 500);
// const tweenData = {
//   centerX: this.cameras.main.centerX,
//   centerY: this.cameras.main.centerY,
// };

// this.tweens.add({
//   targets: tweenData,
//   centerX: Math.round(
//     SAFE_GAME_WIDTH / 2 + (MAX_WIDTH - SAFE_GAME_WIDTH) / 2
//   ),
//   centerY:
//     Math.round(SAFE_GAME_HEIGHT / 2 + (MAX_HEIGHT - SAFE_GAME_HEIGHT) / 2) +
//     3.5,
//   duration: 500,
//   onUpdate: () => {
//     this.cameras.main.centerOn(tweenData.centerX, tweenData.centerY);
//   },
// });
