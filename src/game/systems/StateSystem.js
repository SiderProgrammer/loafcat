import { openWorkPopUp } from "../../UI/work/WorkPopUp";
import { statsConstant } from "../../sharedConstants/stats";
import { EventBus } from "../EventBus";
import { PetModel } from "../models/PetModel";
import { Async } from "../utils/Async";

export class PetStateSystem {
    constructor(scene, pet) {
        this.scene = scene;
        this.pet = pet;
    }
    async setState(state) {
        switch (state) {
            case "bath":
                await this.bathAction();
                break;
            case "toilet":
                await this.toiletAction();
                break;
            case "sink":
                await this.sinkAction();
                break;
            case "smoke":
                await this.smokeAction();
                break;
            case "TV":
                await this.TVAction();
                break;
            case "bed":
                await this.bedAction();
                break;
            case "work":
                await this.workAction();
                break;
        }
        this.actionStopped();
    }
    actionStopped() {
        this.pet.setState("idle");
        this.scene.mapInteractionSystem.setAllInteractive();
        this.pet.y = this.pet.baseY;
    }
    async bedAction() {
        this.pet.sleep();
        this.pet.x = 410;
        this.pet.y = 261;
        await Async.delay(10000);
        //takeAction("sleep")
    }
    async workAction() {
        this.pet.work();
        this.pet.x = 422;
        this.pet.y = 266.5;
        await Async.delay(100000000);
        //takeAction("sleep")
    }
    async smokeAction() {
        this.pet.smoke();
        this.pet.x = 127;
        await Async.delay(3000);
        //takeAction("smoke")
    }
    async sinkAction() {
        //  const icon = statsConstant.find(stat => stat.icon==="Happiness").
        EventBus.emit("actionUpdate", {
            value: 15,
            img: "Happiness",
            pos: this.scene.input.activePointer,
        });
        this.pet.x = 248;
        this.pet.setState("teeth-brush");
        this.scene.updatePetData({
            ...PetModel.PET_DATA,
            HappinessLevel: PetModel.PET_DATA.HappinessLevel + 15,
        });

        await Async.delay(3000);

        //takeAction("toothBrush")
    }
    async TVAction() {
        this.pet.setPosition(336, 260.5);
        this.pet.setScale(1, 1);
        this.pet.setState("TV");
        //takeAction("toothBrush")
        this.scene.updatePetData({
            ...PetModel.PET_DATA,
            CleanlinessLevel: PetModel.PET_DATA.CleanlinessLevel + 15,
        });
        await Async.delay(3000);
    }

    async toiletAction() {
        // TODO : best to have select menu between poop/pee when toilet clicked

        // TODO: play here pee then poop just after
        this.pet.x = 185;
        this.pet.y = 268;
        this.pet.setState("toiletPoop");
        //takeAction("poo")
        //takeAction("pee")

        this.scene.updatePetData({
            ...PetModel.PET_DATA,
            PoopLevel: 0,
            PeeLevel: 0,
        });

        await Async.delay(3000);
    }
    bathAction() {
        this.pet.x = 369;
        this.pet.y = 272;
        // this.itemInUse = this.add
        //   .image(
        //     this.input.activePointer.worldX,
        //     this.input.activePointer.worldY,
        //     "soapImage"
        //   )
        //   .setDepth(3);
        // TODO : refactor it
        return new Promise((resolve) => {
            this.scene.input.setDefaultCursor(
                'url("./assets/soapImage.png"), pointer'
            );
            this.scene.map.getLayer("Bath").tilemapLayer.setDepth(2);
            this.pet.setState("bath");

            this.pet.character.setInteractive();
            let soapIn = false;
            let lastEventPoint = {
                x: this.scene.input.activePointer.worldX,
                y: this.scene.input.activePointer.worldY,
            };
            let dc = null;
            let counter = 0;
            // TODO : soap too big in some scales, bigger hitbox, check zooming in
            this.pet.character.on("pointerover", () => {
                const pointerPos = {
                    x: this.scene.input.activePointer.worldX,
                    y: this.scene.input.activePointer.worldY,
                };
                if (
                    Phaser.Math.Distance.BetweenPoints(
                        pointerPos,
                        lastEventPoint
                    ) < 5
                )
                    return;

                if (counter == 25) {
                    this.stopBathAction();
                    resolve();
                    clearTimeout(dc);
                    return;
                }
                lastEventPoint = {
                    x: this.scene.input.activePointer.worldX,
                    y: this.scene.input.activePointer.worldY,
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
        });
    }
    stopBathAction() {
        this.scene.input.setDefaultCursor(
            'url("./assets/pointer.png"), pointer'
        );
        this.pet.setBaseY();
        // this.pet.moveRandomly();
        this.pet.setState("idle");
        this.pet.soap.destroy();
        this.pet.character.removeInteractive();
        this.scene.map.getLayer("Bath").tilemapLayer.setDepth(0);
        this.scene.mapInteractionSystem.setAllInteractive();
        //takeAction("bath")
        this.scene.updatePetData({
            ...PetModel.PET_DATA,
            CleanlinessLevel: 100,
        });
    }
}
