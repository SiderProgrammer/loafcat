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
import { addAmbientAnimations } from "../helpers/addAmbientAnimations";
import { EventBus } from "../EventBus";

export class Game extends Scene {
    constructor() {
        super("Game");
    }

    async create({ map }) {
        this.input.setDefaultCursor('url("./assets/pointer.png"), pointer');
        // this.scale.displaySize.setSnap(SAFE_GAME_WIDTH, SAFE_GAME_HEIGHT);
        // this.scale.refresh();
        this.sound.add("theme").play({ loop: true });

        this.mapKey = map;
        GameModel.MAIN_SCENE = this;
        //this.scene.launch("UI");
        this.cameras.main.setBackgroundColor(0x00ff00);

        //this.add.image(512, 384, "background").setAlpha(0.5);
        this.alertSystem = new AlertSystem();
        this.mapInteractionSystem = new MapInteractionSystem(this);
        this.createMap();

        this.pet = new Loafcat(this, 325.5, 277, "loafcat");
        this.pet.setDepth(1);
        // this.pet.moveRandomly();
        //this.pet.drinkCoffee();

        // this.pet.smoke();
        // setTimeout(() => {
        //     this.pet.setStateCatDead();
        // }, 7500);
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

        EventBus.on("itemDrop", async (callback) => {
            // TODO : finish item drop
            const isPetFed = await this.checkFeedPet(
                this.slots[this.itemInUse.slot].item.itemData
            );

            this.pet.setState("walk");
            callback();
            //   if (isPetFed) {
            //     this.itemUsed(this.itemInUse.slot);
            //     this.itemInUse = null;
            //   }
        });

        EventBus.on("changeMap", (map) => {
            this.scene.start("Game", map);
        });
    }

    createMap() {
        this.map = this.make.tilemap({ key: this.mapKey });
        linkTilemaps(this.map, this.mapKey);

        //if (!houseRoomsPlacement[this.mapKey]) return;
        // change name to: roomAbove
        if (houseRoomsPlacement[this.mapKey]) {
            this.nextFloor = this.make.tilemap({
                key: houseRoomsPlacement[this.mapKey].nextFloor,
            });
            linkTilemaps(
                this.nextFloor,
                houseRoomsPlacement[this.mapKey].nextFloor,
                true
            );
        }

        let roomBelow;
        for (const room in houseRoomsPlacement) {
            if (houseRoomsPlacement[room].nextFloor === this.mapKey)
                roomBelow = room;
        }

        if (roomBelow) {
            this.roomBelow = this.make.tilemap({
                key: roomBelow,
            });

            linkTilemaps(this.roomBelow, roomBelow, false, true);
            this.add.image(0, 290, "wallOverlay").setOrigin(0, 0);
        }
        addAmbientAnimations(this, this.mapKey);
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
                this.bathAction();
                break;
            case "toilet":
                this.toiletAction();
                break;
            case "sink":
                this.sinkAction();
                break;
        }
    }

    resize() {
        // document.getElementById("game-container").children[0].style.width =
        //     document.querySelector("canvas").style.width;
        // document.getElementById("game-container").children[0].style.height =
        //     document.querySelector("canvas").style.height;

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
    sinkAction() {
        this.pet.setState("teeth-brush");
        this.time.delayedCall(3000, () => {
            this.stopTeethBrushAction();
        });
    }

    stopTeethBrushAction() {
        this.pet.stopToothBrush();
        //this.pet.setState("idle")
    }
    toiletAction() {
        this.pet.setState("toiletPoop");
    }
    bathAction() {
        // this.itemInUse = this.add
        //   .image(
        //     this.input.activePointer.worldX,
        //     this.input.activePointer.worldY,
        //     "soapImage"
        //   )
        //   .setDepth(3);
        this.input.setDefaultCursor('url("./assets/soapImage.png"), pointer');
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
        // TODO : soap too big in some scales, bigger hitbox, check zooming in
        this.pet.character.on("pointerover", () => {
            const pointerPos = {
                x: this.input.activePointer.worldX,
                y: this.input.activePointer.worldY,
            };
            if (
                Phaser.Math.Distance.BetweenPoints(pointerPos, lastEventPoint) <
                5
            )
                return;

            if (counter == 25) {
                this.stopBathAction();
                clearTimeout(dc);
                return;
            }
            lastEventPoint = {
                x: this.input.activePointer.worldX,
                y: this.input.activePointer.worldY,
            };

            if (!dc) {
                if (counter === 0) {
                    this.pet.character.play("bathing");
                    this.pet.soap.play("soap-idle");
                }

                this.pet.soap.anims.resume();
                this.pet.character.anims.resume();
                dc = setTimeout(() => {
                    this.pet.soap.anims.restart();
                    this.pet.character.anims.restart();
                    this.pet.soap.anims.pause();
                    this.pet.character.anims.pause();
                    dc = null;
                }, 500);
            } else if (dc) {
                clearTimeout(dc);
                dc = setTimeout(() => {
                    this.pet.soap.anims.restart();

                    this.pet.soap.anims.pause();
                    this.pet.character.anims.pause();
                    dc = null;
                }, 500);
            }
            counter++;
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
    }
    stopBathAction() {
        this.input.setDefaultCursor('url("./assets/pointer.png"), pointer');
        this.pet.setBaseY();
        // this.pet.moveRandomly();
        this.pet.setState("idle");
        this.pet.soap.destroy();
        this.pet.character.removeInteractive();
        this.map.getLayer("Bath").tilemapLayer.setDepth(0);
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
