import { MAX_WIDTH, SAFE_GAME_WIDTH } from "../constants/viewport";
import { Async } from "../utils/Async";
import { MathUtils } from "../utils/Math";
import { EventBus } from "../EventBus";
import { PetModel } from "../models/PetModel";
// import { PetStateSystem } from "../systems/StateSystem";

export default class Loafcat extends Phaser.GameObjects.Container {
    constructor(scene, config) {
        const { x, y } = config;
        super(scene, x, y);
        this.config = config;
        this.scene.add.existing(this);

        this.character = this.createCharacter();
        // this.stateSystem = new PetStateSystem(this.scene, this);

        this.moveTween = null;
        this.effects = [];

        this.add([this.character]);

        // this.moveRandomly();
        this.setState("walk");
    }

    createCharacter() {
        return this.scene.add.sprite(0, 0, this.config.sprite);
        // .play("idle");
    }

    async setState(state, value) {
        // this.moveTween && this.moveTween.pause();
        if (this.moveTween) this.moveTween.pause();

        // console.log(state);
        switch (state) {
            case "idle":
                this.cleanEffects();
                this.setStateCatIdle();
                break;
            case "walk":
                this.setStateCatWalk();
                break;
            case "feed":
                console.log("FEEEEDDD");
                await this.setStateCatFeed();
                break;
            case "eat":
                await this.eat(value);
                break;
            case "bath":
                // this.stateSystem.setState(state);
                await this.setStateBathing();
                break;
            case "toilet":
                // this.stateSystem.setState(state);
                await this.setStateCatPoop();
                break;
            case "teeth-brush":
                await this.setStateCatTeethBrush();
                break;
            case "TV":
                // this.stateSystem.setState(state);
                await this.setStateCatWatchTV();
                break;
            case "bed":
                // this.stateSystem.setState(state);
                await this.sleep();
                break;
            case "sink":
                // await this.stateSystem.setState(state);
                await this.teethBrush();
                break;
            case "smoke":
                // this.stateSystem.setState(state);
                await this.smoke();
                break;
            case "work":
                // this.stateSystem.setState(state);
                await this.work();
                break;
        }
        this.actionStopped();
    }

    setBaseY() {
        this.y = this.config.y;
    }

    moveRandomly() {
        const newX = Phaser.Math.Between(
            (MAX_WIDTH - SAFE_GAME_WIDTH) / 2,
            SAFE_GAME_WIDTH
        );
        const pixelTravelTime = 50;

        const duration = Math.abs(this.x - newX) * pixelTravelTime;
        const flipCat = this.x - newX < 0 ? false : true;
        this.setScale(flipCat ? -1 : 1, 1);
        // this.setFlipX(flipCat);

        this.moveTween = this.scene.tweens.add({
            targets: this,
            x: newX,
            duration,
            onComplete: () => {
                this.moveRandomly();
            },
        });

        // this.setState("walk");
    }

    async work() {
        this.handlePlayEffect("working", "office-set", "office-set", 0, 0);
        this.x = 422;
        this.y = 266.5;
        await Async.delay(100000000);
    }

    playCurious() {
        this.handlePlayEffect("curious", "curious", "curious-idle");
    }

    async sleep() {
        this.handlePlayEffect("sleep", "sleep", "sleep-idle");
        this.x = 410;
        this.y = 261;
        await Async.delay(10000);
    }
    async setStateCatWatchTV() {
        this.handlePlayEffect("watch-tv", "tv-popcorn", "tv-popcorn");
        this.setPosition(336, 260.5);
        this.setScale(1, 1);
        // this.pet.setState("TV");
        //takeAction("toothBrush")
        this.scene.updatePetData({
            ...PetModel.PET_DATA,
            CleanlinessLevel: PetModel.PET_DATA.CleanlinessLevel + 15,
        });
        await Async.delay(3000);
    }
    drinkCoffee() {
        this.handlePlayEffect("drink-coffee", "cap-coffee", "coffee-idle");
    }

    async teethBrush() {
        this.setState("teeth-brush");
        EventBus.emit("actionUpdate", {
            value: 15,
            img: "Happiness",
            pos: this.scene.input.activePointer,
        });
        this.x = 248;
        this.scene.updatePetData({
            ...PetModel.PET_DATA,
            HappinessLevel: PetModel.PET_DATA.HappinessLevel + 15,
        });

        await Async.delay(3000);
    }

    async setStateCatFeed() {
        this.setStateCatIdle();
        this.character.play("feed-me");
        await Async.delay(3000);
    }
    setStateCatWalk() {
        this.character.play("walk");
        this.moveRandomly();
        // this.moveTween.resume();
    }
    setStateCatIdle() {
        this.character.play("idle");
        this.moveTween && this.moveTween.pause();
    }
    setStateCatDead() {
        this.setStateCatIdle();
        this.cleanEffects();
        this.character.play("dead");
    }
    async smoke() {
        this.handlePlayEffect("smoke", "smoke", "smoke-idle", 16, -2);
        this.x = 127;
        await Async.delay(3000);
    }

    async eat(feedValue) {
        this.character.play("eat");
        await Async.delay(2000);
        // should be only when food is not liquid
        if (MathUtils.chance(30)) {
            this.fart();
            await Async.delay(2000);
            // should be only when food is liquid
        }

        this.cleanEffects();
    }

    fart() {
        this.handlePlayEffect("fart", "fart", "fart-idle");
    }

    async setStateCatPoop() {
        this.handlePlayEffect("toiletPoop", "newspaper", "newspaper-idle");
        // TODO : best to have select menu between poop/pee when toilet clicked

        // TODO: play here pee then poop just after
        this.x = 185;
        this.y = 268;
        // this.pet.setState("toiletPoop");
        //takeAction("poo")
        //takeAction("pee")

        this.scene.updatePetData({
            ...PetModel.PET_DATA,
            PoopLevel: 0,
            PeeLevel: 0,
        });

        await Async.delay(3000);
    }

    setStateCatTeethBrush() {
        // this.setBaseY();
        this.handlePlayEffect(
            "teeth-brushing",
            "teeth-brushing",
            "teeth-brushing-idle"
        );
    }

    listenMusic() {
        this.handlePlayEffect(
            "listen-music",
            "musical-nutes",
            "nutes-idle",
            -35,
            5
        );
    }

    pee() {
        this.handlePlayEffect("front-pee", "front-pee", "front-pee-idle");
        // this.swap(this.peeSprite, this.character);
    }

    async setStateBathing() {
        this.handlePlayEffect("bathing", "soap", "soap-idle");
        await this.bathAction();
    }

    async bathAction() {
        this.x = 369;
        this.y = 272;
        // this.itemInUse = this.add
        //   .image(
        //     this.input.activePointer.worldX,
        //     this.input.activePointer.worldY,
        //     "soapImage"
        //   )
        //   .setDepth(3);
        // TODO : refactor it
        return new Promise((resolve) => {
            this.scene.setSoapCursor();
            this.scene.map.getLayer("Bath").tilemapLayer.setDepth(2);
            // this.pet.setState("bath");

            this.character.setInteractive();
            let soapIn = false;
            let lastEventPoint = {
                x: this.scene.input.activePointer.worldX,
                y: this.scene.input.activePointer.worldY,
            };
            let dc = null;
            let counter = 0;
            // TODO : soap too big in some scales, bigger hitbox, check zooming in
            this.character.on("pointerover", () => {
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
                        this.character.play("bathing");
                        this.soap.play("soap-idle");
                    }

                    this.soap.anims.resume();
                    this.character.anims.resume();
                    dc = setTimeout(() => {
                        this.soap.anims.restart();
                        this.character.anims.restart();
                        this.soap.anims.pause();
                        this.character.anims.pause();
                        dc = null;
                    }, 500);
                } else if (dc) {
                    clearTimeout(dc);
                    dc = setTimeout(() => {
                        this.soap.anims.restart();

                        this.soap.anims.pause();
                        this.character.anims.pause();
                        dc = null;
                    }, 500);
                }
                counter++;
            });
        });
    }

    stopBathAction() {
        this.scene.setIdleCursor();
        this.setBaseY();
        // this.pet.moveRandomly();
        this.setState("idle");
        this.soap.destroy();
        this.character.removeInteractive();
        this.scene.map.getLayer("Bath").tilemapLayer.setDepth(0);
        this.scene.mapInteractionSystem.setAllInteractive();
        //takeAction("bath")
        this.scene.updatePetData({
            ...PetModel.PET_DATA,
            CleanlinessLevel: 100,
        });
    }

    actionStopped() {
        this.cleanEffects();
        this.setStateCatIdle();
        this.setStateCatWalk();
        this.scene.mapInteractionSystem.setAllInteractive();
        this.setBaseY();
    }

    handlePlayEffect(
        characterStateKey,
        effectSetKey,
        effectAnimationKey,
        x = 0,
        y = 0,
        scale = 1
    ) {
        this.setStateCatIdle();
        this.character.play(characterStateKey);
        const officeSet = this.scene.add
            .sprite(x, y, effectSetKey)
            .play(effectAnimationKey)
            .setScale(scale);

        this.add(officeSet);
        this.effects.push(officeSet);
    }

    cleanEffects() {
        this.effects.forEach((effect) => {
            this.remove(effect, true);
        });
    }

    startCreateTween(delay) {
        this.character.setScale(0);
        this.scene.tweens.add({
            targets: this.character,
            ease: "Back.out",
            duration: 1000,
            delay: delay,
            scale: 1,
            onComplete: () => {},
        });
    }
}
