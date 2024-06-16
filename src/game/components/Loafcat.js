import { MAX_WIDTH, SAFE_GAME_WIDTH } from "../constants/viewport";
import { Async } from "../utils/Async";
import { MathUtils } from "../utils/Math";
import { EventBus } from "../EventBus";
import { PetModel } from "../models/PetModel";
import gameConfig from "../config/index";
// import { PetStateSystem } from "../systems/StateSystem";

export default class Loafcat extends Phaser.GameObjects.Container {
    constructor(scene) {
        const { x, y } = gameConfig.petConfig;
        super(scene, x, y);
        this.config = gameConfig.petConfig;
        this.scene.add.existing(this);

        this.character = this.createCharacter();
        this.actualStateDelay = null;
        this.moveTween = null;
        this.effects = [];

        this.add([this.character]);
        this.setState("walk");

        // const text = this.scene.add
        //     .text(200, 100, "HELLOOO", {
        //         font: "20px Arial",
        //         fill: "#ffffff",
        //     })
        //     .setScale(0.5);
    }

    createCharacter() {
        return this.scene.add.sprite(0, 0, this.config.textureKey);
    }

    async setState(state, value) {
        if (this.moveTween) this.moveTween.pause();

        switch (state) {
            case "idle":
                this.cleanEffects();
                this.setStateCatIdle();
                break;
            case "walk":
                this.setStateCatWalk();
                break;
            case "feed":
                await this.setStateCatFeed();
                break;
            case "eat":
                await this.eat(value);
                break;
            case "bath":
                await this.setStateBathing();
                break;
            case "toilet":
                await this.setStateCatPoop();
                break;
            case "teeth-brush":
                await this.setStateCatTeethBrush();
                break;
            case "TV":
                await this.setStateCatWatchTV();
                break;
            case "bed":
                await this.sleep();
                break;
            case "sink":
                await this.teethBrush();
                break;
            case "smoke":
                await this.smoke();
                break;
            case "work":
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

    breakStateDuration() {
        Async.break();
    }

    async work() {
        this.handlePlayEffect("working", "office-set", "office-set", 0, 0);
        this.x = 422;
        this.y = 266.5;
        this.actualStateDelay = await Async.delay(100000000);
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

        await Async.delay(3000);
    }

    setStateCatTeethBrush() {
        // this.setBaseY();
        this.handlePlayEffect(
            "teeth-brushing",
            "teeth-brushing",
            "teeth-brushing-idle"
        );

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 3000);
        });
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
        this.setBaseY();
        this.setState("idle");
        this.soap.destroy();
        this.character.removeInteractive();
    }

    actionStopped() {
        this.cleanEffects();
        this.setStateCatIdle();
        this.setStateCatWalk();
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
