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
import UsableItem from "../components/UsableItem";
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
        this.usableItem = new UsableItem(this, this.input.activePointer);

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
        if (!this.usableItem.isInUse) return;
        this.usableItem.setPosition(
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
                        return;
                    case "fridge":
                        openInventory(true);
                        return;
                    case "work":
                        openWorkPopUp();
                        return;
                    case "bath":
                        this.cursorController.soap();
                        this.map.getLayer("Bath").tilemapLayer.setDepth(2);
                        await this.pet.setState("bath");
                        this.map.getLayer("Bath").tilemapLayer.setDepth(0);
                        this.updatePetData({
                            ...PetModel.PET_DATA,
                            CleanlinessLevel: 100,
                        });
                        this.addReward("Happiness", 15);
                        break;
                    case "toilet":
                        await this.pet.setState("toilet");
                        this.updatePetData({
                            ...PetModel.PET_DATA,
                            PoopLevel: 0,
                            PeeLevel: 0,
                        });
                        this.addReward("Happiness", 15);
                        break;
                    case "sink":
                        await this.pet.setState("sink");
                        this.updatePetData({
                            ...PetModel.PET_DATA,
                            HappinessLevel:
                                PetModel.PET_DATA.HappinessLevel + 15,
                        });
                        this.addReward("Happiness", 15);
                        break;
                    case "tv":
                        await this.pet.setState("TV");
                        this.updatePetData({
                            ...PetModel.PET_DATA,
                            CleanlinessLevel:
                                PetModel.PET_DATA.CleanlinessLevel + 15,
                        });
                        this.addReward("Happiness", 15);
                        break;
                    case "smoke":
                        await this.pet.setState("smoke");
                        this.addReward("Happiness", 15);
                        break;
                    case "bed":
                        await this.pet.setState("bed");
                        this.addReward("Happiness", 15);
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
        this.map.interaction(false);
        await this.pet.setState("eat", 1); // itemData.itemDetails.pointValue
        this.map.interaction(true);
        this.addReward("Happiness", 15);
        return true;
    }

    handleResize() {
        this.scale.on("resize", () => {
            this.resize();
        });

        this.resize();
    }

    resize() {
        this.cameras.main.setBounds(0, -20, MAX_WIDTH, MAX_HEIGHT);
        this.cameras.main.centerOn(
            Math.round(SAFE_GAME_WIDTH / 2 + (MAX_WIDTH - SAFE_GAME_WIDTH) / 2),
            MAX_HEIGHT
        );
    }

    updatePetData(data) {
        PetModel.PET_DATA = data;
    }

    addReward(imageKey, value) {
        EventBus.emit("rewardUpdate", {
            value: value,
            img: imageKey,
        });
    }

    createListeners() {
        if (!EventBus.eventNames().includes("itemGrab")) {
            EventBus.on("itemGrab", async (itemData) => {
                this.cursorController.grab();
                this.usableItem.take("apple", itemData);
                // this.pet.setState("feed");
            });
        }

        this.input.on("pointerup", async () => {
            if (!this.usableItem.isInUse) return;
            this.cursorController.idle();
            this.usableItem.put();
            const isPetFed = await this.checkFeedPet(this.usableItem.itemData);
            EventBus.emit("openInventory");
            //   if (isPetFed) {
            //     this.itemUsed(this.itemInUse.slot);
            //     this.itemInUse = null;
            //   }
        });

        EventBus.once("changeMap", (map) => {
            this.scene.start("Game", map);
        });
        EventBus.on("startWork", () => {
            this.pet.setState("work");
        });
        EventBus.on("breakPetStateDuration", () => {
            this.pet.breakStateDuration();
        });
        EventBus.on("handleMapInteraction", (value) => {
            this.map.interaction(value);
        });
        EventBus.on("addReward", (imageKey, value) => {
            this.addReward(imageKey, value);
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
