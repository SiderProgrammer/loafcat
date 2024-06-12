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
import { MAPS_ORDER } from "../constants/houseRooms";
import { MapInteractionSystem } from "../systems/MapInteractionSystem";
import { AlertSystem } from "../systems/AlertSystem";
import { PetModel } from "../models/PetModel";
import { addAmbientAnimations } from "../helpers/addAmbientAnimations";
import { EventBus } from "../EventBus";
import { getMyPetData } from "../helpers/requests";
import {
    showLoadingScreen,
    hideLoadingScreen,
} from "../../UI/loadingScreen/loadingScreen";
import { HOST } from "../../sharedConstants/constants";

export class Game extends Scene {
    constructor() {
        super("Game");
    }

    async create({ map, restarted = false }) {
        this.restarted = restarted;
        this.setIdleCursor();
        // this.scale.displaySize.setSnap(SAFE_GAME_WIDTH, SAFE_GAME_HEIGHT);
        // this.scale.refresh();
        if (!this.restarted) this.sound.add("theme").play({ loop: true });

        this.mapKey = map;
        GameModel.MAIN_SCENE = this;
        //this.scene.launch("UI");
        // this.cameras.main.setBackgroundColor(0x00ff00);

        //this.add.image(512, 384, "background").setAlpha(0.5);
        this.alertSystem = new AlertSystem();

        this.mapInteractionSystem = new MapInteractionSystem(this);
        this.createMap();

        this.pet = this.createPet();
        // this.pet.moveRandomly();
        if (this.restarted) this.restartTween();

        //this.pet.playCurious();

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

        this.petData = await getMyPetData();
        this.updatePetData(this.petData.data.pet);
        EventBus.emit("current-scene-ready");
        // this.alertSystem.updateAlerts();

        this.input.on("pointerup", async () => {
            if (!this.itemInUse) return;
            this.setIdleCursor();
            this.itemInUse.destroy();
            const isPetFed = await this.checkFeedPet(this.itemInUse.itemData);

            // this.pet.setState("walk");

            EventBus.emit("itemDrop");
            //callback();

            //   if (isPetFed) {
            //     this.itemUsed(this.itemInUse.slot);
            //     this.itemInUse = null;
            //   }
        });
        if (!EventBus.eventNames().includes("itemGrab")) {
            EventBus.on("itemGrab", async ({ data }) => {
                // const diffX = GameModel.MAIN_SCENE.cameras.main.scrollX;
                // const diffY = GameModel.MAIN_SCENE.cameras.main.scrollY;

                this.setGrabCursor();
                // this.pet.setState("feed");
                this.itemInUse = GameModel.MAIN_SCENE.add
                    .image(
                        this.input.activePointer.worldX,
                        this.input.activePointer.worldY,
                        "apple"
                    )
                    .setDepth(2);

                this.itemInUse.itemData = data;
                // .setInteractive();
            });
        }

        EventBus.once("changeMap", (map) => {
            this.scene.start("Game", map);
        });

        EventBus.on("startWork", () => {
            this.setState("work");
        });
        EventBus.on("stopWork", () => {
            this.pet.breakStateDuration();
        });
        EventBus.on("handleMapInteraction", (value) => {
            if (value) this.mapInteractionSystem.setAllInteractive();
        });

        hideLoadingScreen();
        if (!this.restarted) this.openTween();
        // const layers = this.map.layers;

        // layers.forEach((layer) => {
        //     this.tweens.add({
        //         targets: layer.tilemapLayer,
        //         scale: { from: 3, to: 1 }, // przesunięcie o 100 pikseli
        //         duration: 1000,
        //         ease: "Power2",
        //     });
        // });

        // const tiles = this.map.layers.flatMap((layer) => layer.data);
        // tiles.forEach((tileArray) => {
        //     // console.log(tileArray);
        //     this.tweens.add({
        //         targets: tileArray,
        //         duration: 1000,
        //         alpha: { from: 0.1, to: 1 },
        //     });
        // });
    }

    setIdleCursor() {
        this.input.setDefaultCursor(
            `url("${HOST}assets/pointer.png"), pointer`
        );
    }

    setGrabCursor() {
        this.input.setDefaultCursor(
            `url("${HOST}assets/pointerHold.png"), pointer`
        );
    }

    setSoapCursor() {
        this.input.setDefaultCursor(
            `url("${HOST}assets/soapImage.png"), pointer`
        );
    }

    update() {
        if (!this.itemInUse) return;
        this.itemInUse.setPosition(
            this.input.activePointer.worldX,
            this.input.activePointer.worldY
        );
    }

    createMap() {
        this.map = this.make.tilemap({ key: this.mapKey });
        linkTilemaps(this.map, this.mapKey);

        //if (!houseRoomsPlacement[this.mapKey]) return;
        // change name to: roomAbove
        const mapIndex = MAPS_ORDER.indexOf(this.mapKey);
        if (mapIndex !== 0) {
            if (mapIndex !== -1) {
                this.nextFloor = this.make.tilemap({
                    key: MAPS_ORDER[mapIndex + 1],
                });
                linkTilemaps(this.nextFloor, MAPS_ORDER[mapIndex + 1], true);
            }

            let roomBelow = MAPS_ORDER[mapIndex - 1];
            if (roomBelow !== "streetMap") {
                if (roomBelow) {
                    this.roomBelow = this.make.tilemap({
                        key: roomBelow,
                    });

                    linkTilemaps(this.roomBelow, roomBelow, false, true);
                    this.add.image(0, 290, "wallOverlay").setOrigin(0, 0);
                }
            }
        }

        // for (const room in houseRoomsPlacement) {
        //     if (houseRoomsPlacement[room].nextFloor === this.mapKey)
        //         roomBelow = room;
        // }

        addAmbientAnimations(this, this.mapKey);
        this.mapInteractionSystem.addInteractiveZones();
        this.mapInteractionSystem.addPointingArrows();
    }

    createPet() {
        const config = {
            x: 325.5,
            y: 277,
            textureKey: "loafcat",
        };
        return new Loafcat(this, config).setDepth(1);
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
            ...PetModel.PET_DATA,
            HungerLevel: PetModel.PET_DATA.HungerLevel + 15,
        });
        // this.alertSystem.updateAlerts();
        await this.pet.setState("eat", 1); // itemData.itemDetails.pointValue
        return true;
    }

    updatePetData(data) {
        PetModel.PET_DATA = data;
    }

    setState(state) {
        this.pet.setState(state);
    }

    resize() {
        // this.resize();
        this.cameras.main.setBounds(0, -20, MAX_WIDTH, MAX_HEIGHT);
        this.cameras.main.centerOn(
            Math.round(SAFE_GAME_WIDTH / 2 + (MAX_WIDTH - SAFE_GAME_WIDTH) / 2),
            MAX_HEIGHT
        );
    }

    openTween() {
        const camera = this.cameras.main;
        this.pet.startCreateTween(700);
        this.tweens.add({
            targets: camera,
            zoom: { from: 4, to: 1 },
            duration: 1500,
            ease: "Power3",
        });
    }

    restartTween() {
        const camera = this.cameras.main;
        this.pet.startCreateTween(200);
        this.tweens.add({
            targets: camera,
            zoom: { from: 2, to: 1 },
            duration: 800,
            ease: "Power3",
            onComplete: () => {},
        });

        // const layers = this.map.layers;
        // layers.forEach((layer) => {
        //     this.tweens.add({
        //         targets: layer.tilemapLayer,
        //         alpha: { from: 0, to: 1 },
        //         duration: 1000,
        //         ease: "Power2",
        //     });
        // });
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
