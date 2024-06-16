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
import CursorController from "../CursorController";
import Map from "../Map";
import { AlertSystem } from "../systems/AlertSystem";
import { PetModel } from "../models/PetModel";
import { EventBus } from "../EventBus";
import { getMyPetData } from "../helpers/requests";
import {
    showLoadingScreen,
    hideLoadingScreen,
} from "../../UI/loadingScreen/loadingScreen";
import { openInventory } from "../../UI/inventory/inventory";
import { openShop } from "../../UI/shop/shop";
import { openWorkPopUp } from "../../UI/work/WorkPopUp";
// import { openWorkPopUp } from "../config/index";

export class Game extends Scene {
    constructor() {
        super("Game");
    }

    async create({ map, restarted = false }) {
        this.restarted = restarted;
        this.mapKey = map;
        GameModel.MAIN_SCENE = this;

        this.cursorController = new CursorController(this);
        this.alertSystem = new AlertSystem();
        this.map = new Map(this, this.mapKey, this.cursorController);
        this.pet = new Loafcat(this).setDepth(1);

        if (this.restarted) this.restartTween();
        this.handleMapInteraction();
        this.createListeners();
        this.handleResize();

        this.petData = await getMyPetData();
        this.updatePetData(this.petData.data.pet);

        EventBus.emit("current-scene-ready");
        hideLoadingScreen();

        if (!this.restarted) {
            this.openTween();
            this.sound.add("theme").play({ loop: true });
        }
    }

    update() {
        if (!this.itemInUse) return;
        this.itemInUse.setPosition(
            this.input.activePointer.worldX,
            this.input.activePointer.worldY
        );
    }

    handleMapInteraction() {
        this.map.interactionZones.forEach((zone) => {
            zone.on("pointerdown", async () => {
                this.map.interaction(false);
                this.cursorController.idle();

                switch (zone.areaName) {
                    case "shop":
                        openShop();
                        break;
                    case "fridge":
                        openInventory(true);
                        break;
                    case "bath":
                        this.cursorController.soap();
                        this.map.getLayer("Bath").tilemapLayer.setDepth(2);
                        await this.pet.setState("bath");
                        this.map.getLayer("Bath").tilemapLayer.setDepth(0);
                        this.updatePetData({
                            ...PetModel.PET_DATA,
                            CleanlinessLevel: 100,
                        });
                        break;
                    case "toilet":
                        await this.pet.setState("toilet");
                        this.updatePetData({
                            ...PetModel.PET_DATA,
                            PoopLevel: 0,
                            PeeLevel: 0,
                        });
                        break;
                    case "sink":
                        await this.pet.setState("sink");
                        this.updatePetData({
                            ...PetModel.PET_DATA,
                            HappinessLevel:
                                PetModel.PET_DATA.HappinessLevel + 15,
                        });
                        break;
                    case "tv":
                        await this.pet.setState("TV");
                        this.updatePetData({
                            ...PetModel.PET_DATA,
                            CleanlinessLevel:
                                PetModel.PET_DATA.CleanlinessLevel + 15,
                        });
                        break;
                    case "smoke":
                        await this.pet.setState("smoke");
                        break;
                    case "bed":
                        await this.pet.setState("bed");
                        break;
                    case "work":
                        openWorkPopUp();
                        break;
                }
                this.map.interaction(true);
            });
        });
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

    handleResize() {
        this.scale.on("resize", () => {
            this.resize();
        });

        this.resize();
    }

    resize() {
        // this.resize();
        this.cameras.main.setBounds(0, -20, MAX_WIDTH, MAX_HEIGHT);
        this.cameras.main.centerOn(
            Math.round(SAFE_GAME_WIDTH / 2 + (MAX_WIDTH - SAFE_GAME_WIDTH) / 2),
            MAX_HEIGHT
        );
    }

    updatePetData(data) {
        PetModel.PET_DATA = data;
    }

    createListeners() {
        this.input.on("pointerup", async () => {
            if (!this.itemInUse) return;
            this.cursorController.idle();
            this.itemInUse.destroy();
            const isPetFed = await this.checkFeedPet(this.itemInUse.itemData);
            EventBus.emit("itemDrop");
            //   if (isPetFed) {
            //     this.itemUsed(this.itemInUse.slot);
            //     this.itemInUse = null;
            //   }
        });
        if (!EventBus.eventNames().includes("itemGrab")) {
            EventBus.on("itemGrab", async ({ data }) => {
                // const diffX = GameModel.MAIN_SCENE.cameras.main.scrollX;
                // const diffY = GameModel.MAIN_SCENE.cameras.main.scrollY;
                this.cursorController.grab();
                // this.pet.setState("feed");
                this.itemInUse = GameModel.MAIN_SCENE.add
                    .image(
                        this.input.activePointer.worldX,
                        this.input.activePointer.worldY,
                        "apple"
                    )
                    .setDepth(2);

                this.itemInUse.itemData = data;
            });
        }

        EventBus.once("changeMap", (map) => {
            this.scene.start("Game", map);
        });

        EventBus.on("startWork", () => {
            // this.setState("work");
            this.pet.setState("work");
        });
        EventBus.on("breakPetStateDuration", () => {
            this.pet.breakStateDuration();
        });
        EventBus.on("handleMapInteraction", (value) => {
            this.map.interaction(value);
        });
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
    }
}
