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
import { MAPS_ORDER } from "../../game/constants/houseRooms";
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
import { handleBottomButtonsInteractive } from "../../UI/UIView";
import { openWorkPopUp } from "../../UI/work/WorkPopUp";

export class Game extends Scene {
    constructor() {
        super("Game");
    }

    async create({ map, restarted = false }) {
        this.restarted = restarted;
        this.mapKey = map;
        GameModel.MAIN_SCENE = this;

        this.backgroundAudio = this.playAudio(this.mapKey, 0.1, true);
        this.cursorController = new CursorController(this);
        this.alertSystem = new AlertSystem();
        this.map = new Map(this, this.mapKey);
        this.pet = new Loafcat(this).setDepth(1);
        this.usableItem = new UsableItem(this, this.input.activePointer);

        if (this.restarted) this.restartTween();
        this.handleMapInteraction();
        this.handlePetInteraction();
        this.createListeners();
        this.handleResize();

        this.fetchedGameData = await this.handleFetchGameData();

        EventBus.emit("current-scene-ready");
        hideLoadingScreen();

        if (!this.restarted) {
            this.openTween();
            // this.playAudio(this.mapKey, 0.1, true);
            // this.playAudio("kitchen", 0.1, true);
            // this.playAudio("city", 0.01, true);
            // this.playAudio("theme", 0.03, true);
        }
    }

    update() {
        if (!this.usableItem.isInUse) return;
        this.usableItem.setPosition(
            this.input.activePointer.worldX,
            this.input.activePointer.worldY
        );
    }

    handlePetInteraction() {
        const pointerdownCb = () => {
            this.cursorController.grab();
            this.playAudio("squeezePet", 0.1);
        };
        const pointerupCb = () => {
            this.cursorController.indicator();
        };
        const pointeroverCb = () => {
            this.cursorController.indicator();
        };
        const pointerOutCb = () => {
            this.cursorController.idle();
        };

        this.pet.handleInteraction(
            pointerdownCb,
            pointerupCb,
            pointeroverCb,
            pointerOutCb
        );
    }

    handleMapInteraction() {
        this.map.interactionZones.forEach((zone) => {
            const pointerdownCb = async () => {
                this.handleGameInteractive(false);
                this.cursorController.idle();
                this.playAudio("click", 0.5);
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
                        this.addReward("Happiness", 15);
                        this.updatePetData({
                            ...PetModel.PET_DATA,
                            CleanlinessLevel: 100,
                        });
                        break;
                    case "toilet":
                        await this.pet.setState("toilet");
                        this.addReward("Happiness", 15);
                        this.updatePetData({
                            ...PetModel.PET_DATA,
                            PoopLevel: 0,
                            PeeLevel: 0,
                        });
                        break;
                    case "sink":
                        await this.pet.setState("sink");
                        this.addReward("Happiness", 15);
                        this.updatePetData({
                            ...PetModel.PET_DATA,
                            HappinessLevel:
                                PetModel.PET_DATA.HappinessLevel + 15,
                        });
                        break;
                    case "tv":
                        await this.pet.setState("TV");
                        this.addReward("Happiness", 15);
                        this.updatePetData({
                            ...PetModel.PET_DATA,
                            CleanlinessLevel:
                                PetModel.PET_DATA.CleanlinessLevel + 15,
                        });
                        break;
                    case "smoke":
                        await this.pet.setState("smoke");
                        this.addReward("Happiness", 15);
                        this.updatePetData({
                            ...PetModel.PET_DATA,
                            HappinessLevel:
                                PetModel.PET_DATA.HappinessLevel + 15,
                        });
                        break;
                    case "bed":
                        await this.pet.setState("bed");
                        this.addReward("Happiness", 15);
                        this.updatePetData({
                            ...PetModel.PET_DATA,
                            HappinessLevel:
                                PetModel.PET_DATA.HappinessLevel + 15,
                        });
                        break;
                }
                this.handleGameInteractive(true);
            };
            const pointeroverCb = () => {
                this.cursorController.indicator();
            };
            const pointerOutCb = () => {
                this.cursorController.idle();
            };
            zone.handleInteractive(pointerdownCb, pointeroverCb, pointerOutCb);

            // zone.on("pointerover", () => {
            //     this.cursorController.indicator();
            // });
            // zone.on("pointerout", () => {
            //     this.cursorController.idle();
            // });
            // zone.on("pointerdown", async () => {
            //     this.handleGameInteractive(false);
            //     this.cursorController.idle();

            //     switch (zone.areaName) {
            //         case "shop":
            //             openShop();
            //             return;
            //         case "fridge":
            //             openInventory(true);
            //             return;
            //         case "work":
            //             openWorkPopUp();
            //             return;
            //         case "bath":
            //             this.cursorController.soap();
            //             this.map.getLayer("Bath").tilemapLayer.setDepth(2);
            //             await this.pet.setState("bath");
            //             this.map.getLayer("Bath").tilemapLayer.setDepth(0);
            //             this.addReward("Happiness", 15);
            //             this.updatePetData({
            //                 ...PetModel.PET_DATA,
            //                 CleanlinessLevel: 100,
            //             });
            //             break;
            //         case "toilet":
            //             await this.pet.setState("toilet");
            //             this.addReward("Happiness", 15);
            //             this.updatePetData({
            //                 ...PetModel.PET_DATA,
            //                 PoopLevel: 0,
            //                 PeeLevel: 0,
            //             });
            //             break;
            //         case "sink":
            //             await this.pet.setState("sink");
            //             this.addReward("Happiness", 15);
            //             this.updatePetData({
            //                 ...PetModel.PET_DATA,
            //                 HappinessLevel:
            //                     PetModel.PET_DATA.HappinessLevel + 15,
            //             });
            //             break;
            //         case "tv":
            //             await this.pet.setState("TV");
            //             this.addReward("Happiness", 15);
            //             this.updatePetData({
            //                 ...PetModel.PET_DATA,
            //                 CleanlinessLevel:
            //                     PetModel.PET_DATA.CleanlinessLevel + 15,
            //             });
            //             break;
            //         case "smoke":
            //             await this.pet.setState("smoke");
            //             this.addReward("Happiness", 15);
            //             this.updatePetData({
            //                 ...PetModel.PET_DATA,
            //                 HappinessLevel:
            //                     PetModel.PET_DATA.HappinessLevel + 15,
            //             });
            //             break;
            //         case "bed":
            //             await this.pet.setState("bed");
            //             this.addReward("Happiness", 15);
            //             this.updatePetData({
            //                 ...PetModel.PET_DATA,
            //                 HappinessLevel:
            //                     PetModel.PET_DATA.HappinessLevel + 15,
            //             });
            //             break;
            //     }
            //     this.handleGameInteractive(true);
            // });
        });
    }

    checkIsPointerHoverPet() {
        const petRect = new Phaser.Geom.Rectangle(
            this.pet.x - 25,
            this.pet.y - 25,
            50,
            50
        );
        return Phaser.Geom.Rectangle.Contains(
            petRect,
            this.input.activePointer.worldX,
            this.input.activePointer.worldY
        );
    }

    async handlePetFeed(statsPointValue) {
        this.handleGameInteractive(false);
        await this.pet.setState("eat", statsPointValue);
        this.handleGameInteractive(true);
        this.addReward("Happiness", statsPointValue);
        this.updatePetData({
            ...PetModel.PET_DATA,
            HungerLevel: PetModel.PET_DATA.HungerLevel + statsPointValue,
        });
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

    handleGameInteractive(value) {
        this.map.interaction(value);
        handleBottomButtonsInteractive(value);
    }

    async handleFetchGameData() {
        const gameData = await getMyPetData();
        this.updatePetData(gameData.data.pet);
        return gameData;
    }

    playAudio(key, volume = 1, loop = false) {
        const sound = this.sound.add(key);
        sound.play({ volume: volume, loop: loop });
        return sound;
    }

    createListeners() {
        if (!EventBus.eventNames().includes("itemGrab")) {
            EventBus.on("itemGrab", async (itemData) => {
                this.playAudio("grab");
                this.cursorController.grab();
                this.usableItem.take("apple", itemData);
                // this.pet.setState("feed");
            });
        }

        this.input.on("pointerup", async () => {
            if (!this.usableItem.isInUse) return;
            // this.pet.breakStateDuration();
            this.cursorController.idle();
            this.usableItem.put();
            if (!this.checkIsPointerHoverPet()) return;
            await this.handlePetFeed(
                this.usableItem.itemData.itemDetails.pointValue
            );
            EventBus.emit("openInventory");
        });

        EventBus.once("changeMap", (map) => {
            this.backgroundAudio.stop();
            this.scene.start("Game", map);
        });
        EventBus.on("startWork", () => {
            this.pet.setState("work");
        });
        EventBus.on("breakPetStateDuration", () => {
            this.pet.breakStateDuration();
            // handleBottomButtonsInteractive(true);
        });
        EventBus.on("handleMapInteraction", (value) => {
            this.map.interaction(value);
        });
        EventBus.on("handleGameInteraction", (value) => {
            this.handleGameInteractive(value);
        });
        EventBus.on("addReward", (imageKey, value) => {
            this.addReward(imageKey, value);
        });
        EventBus.on("playAudio", (soundKey, volume = 1) => {
            this.playAudio(soundKey, volume);
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
