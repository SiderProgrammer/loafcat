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
        this.interactive = false;
        this.effects = [];

        this.add([this.character]);
        this.setSize(34, 36);
        this.setState("walk");
    }

    createCharacter() {
        return this.scene.add.sprite(0, 0, this.config.textureKey);
    }

    async setState(state, value) {
        if (this.moveTween) this.moveTween.pause();
        this.interactive = false;

        switch (state) {
            case "idle":
                this.cleanEffects();
                this.idle();
                break;
            case "walk":
                this.walk();
                break;
            case "feed":
                await this.feed();
                break;
            case "eat":
                await this.eat(value);
                break;
            case "bath":
                await this.moveToPointTween(369, 272);
                await this.bath();
                break;
            case "toilet":
                await this.moveToPointTween(185, 268);
                await this.poop();
                await this.moveToStandOnFloorTween();
                break;
            case "TV":
                await this.moveToPointTween(336, 260.5);
                await this.watchTV();
                await this.moveToStandOnFloorTween();
                break;
            case "bed":
                await this.moveToPointTween(410, 261);
                await this.sleep();
                await this.moveToStandOnFloorTween();
                break;
            case "sink":
                await this.moveToPointTween(248);
                await this.brushTeeth();
                break;
            case "smoke":
                await this.moveToPointTween(127);
                await this.smoke();
                break;
            case "work":
                await this.moveToPointTween(422, 266);
                await this.work();
                await this.moveToStandOnFloorTween();
                break;
        }
        this.actionStopped();
    }

    handleInteraction(pointerdownCb, pointerupCb, pointeroverCb, pointerOutCb) {
        this.setInteractive();
        this.interactive = true;

        this.on("pointerover", () => {
            pointeroverCb();
        });
        this.on("pointerout", () => {
            pointerOutCb();
        });
        this.on("pointerdown", () => {
            if (!this.interactive) return;
            this.flatTween("width");
            pointerdownCb();
        });
        this.on("pointerup", () => {
            pointerupCb();
        });
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
    }

    breakStateDuration() {
        Async.break();
    }

    setFacingDirection(sideKey) {
        if (sideKey === "left") {
            this.setScale(-1, 1);
        } else if ("right") {
            this.setScale(1, 1);
        }
    }

    async work() {
        this.handlePlayEffect("working", "office-set", "office-set", 0, 0);
        this.setFacingDirection("right");
        this.actualStateDelay = await Async.delay(100000000);
    }

    playCurious() {
        this.handlePlayEffect("curious", "curious", "curious-idle");
    }

    async sleep() {
        EventBus.emit("playAudio", "sleep", 0.5);
        this.handlePlayEffect("sleep", "sleep", "sleep-idle");
        this.setFacingDirection("left");
        await Async.delay(11000);
    }
    async watchTV() {
        EventBus.emit("playAudio", "popcorn_eating", 0.1);
        this.handlePlayEffect("watch-tv", "tv-popcorn", "tv-popcorn");
        this.setFacingDirection("right");
        await Async.delay(4000);
    }
    drinkCoffee() {
        this.handlePlayEffect("drink-coffee", "cap-coffee", "coffee-idle");
    }

    async feed() {
        this.idle();
        this.character.play("feed-me");
        await Async.delay(300000000000000000000);
    }
    walk() {
        this.character.play("walk");
        this.moveRandomly();
    }
    idle() {
        this.character.play("idle");
        this.moveTween && this.moveTween.pause();
    }
    dead() {
        this.idle();
        this.cleanEffects();
        this.character.play("dead");
    }
    async smoke() {
        EventBus.emit("playAudio", "smoking", 0.5);
        this.handlePlayEffect("smoke", "smoke", "smoke-idle", 16, -2);
        await Async.delay(7000);
    }

    async eat(feedValue) {
        EventBus.emit("playAudio", "eating", 0.5);
        this.character.play("eat");
        await Async.delay(2000);
        // should be only when food is not liquid
        if (MathUtils.chance(30)) {
            await this.fart();
            // should be only when food is liquid
        }

        this.cleanEffects();
    }

    async fart() {
        EventBus.emit("playAudio", "fart", 0.5);
        this.handlePlayEffect("fart", "fart", "fart-idle");
        await Async.delay(2000);
    }

    async poop() {
        EventBus.emit("playAudio", "poop", 0.2);
        this.handlePlayEffect("toiletPoop", "newspaper", "newspaper-idle");
        // TODO : best to have select menu between poop/pee when toilet clicked

        // TODO: play here pee then poop just after
        // this.x = 185;
        // this.y = 268;
        // this.pet.setState("toiletPoop");
        //takeAction("poo")
        //takeAction("pee")
        await Async.delay(5000);
    }

    async brushTeeth() {
        EventBus.emit("playAudio", "teeth_brush", 0.5);
        this.handlePlayEffect(
            "teeth-brushing",
            "teeth-brushing",
            "teeth-brushing-idle"
        );

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 5000);
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

    async bath() {
        this.handlePlayEffect("bathing", "soap", "soap-idle");
        await this.bathAction();
    }

    async bathAction() {
        // this.x = 369;
        // this.y = 272;
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

    flatTween(type) {
        this.interactive = false;
        const time = 100;
        const x = type === "height" ? 1.2 : 0.8;
        const y = type === "height" ? 0.8 : 1.2;

        this.scene.tweens.add({
            targets: this.character,
            scaleX: x,
            scaleY: y,
            yoyo: true,
            duration: time,
            onComplete: () => {
                this.interactive = true;
            },
        });
    }

    stopBathAction() {
        this.setBaseY();
        this.setState("idle");
        this.soap.destroy();
        this.character.removeInteractive();
    }

    actionStopped() {
        this.interactive = true;
        this.cleanEffects();
        this.idle();
        this.walk();
        // this.setBaseY();
    }

    handlePlayEffect(
        characterStateKey,
        effectSetKey,
        effectAnimationKey,
        x = 0,
        y = 0,
        scale = 1
    ) {
        this.idle();
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

    async moveToStandOnFloorTween() {
        this.cleanEffects();
        const time = 300;
        this.character.play("idle");
        await this.scene.tweens.add({
            targets: this,
            y: this.config.y,
            ease: "power3.out",
            duration: time - 100,
            onComplete: () => {
                this.flatTween("height");
                EventBus.emit("playAudio", "fall_down", 0.2);
            },
        });
        await Async.delay(time);
    }

    async moveToPointTween(x, y) {
        const time = 500;
        const startY = this.y;
        EventBus.emit("playAudio", "jump", 0.3);
        this.scene.tweens.add({
            targets: this,
            x: x ? x : this.x,
            // y: y ? y : this.y,
            angle: -360,
            ease: "power3.out",
            duration: time,
            onComplete: () => {},
        });
        this.scene.tweens.add({
            targets: this,
            y: this.y - 50,
            ease: "power3.out",
            duration: time / 2,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this,
                    y: y ? y : startY,
                    ease: "power3.out",
                    duration: time / 2,
                    onComplete: () => {
                        this.flatTween("height");
                        EventBus.emit("playAudio", "fall_down", 0.2);
                    },
                });
            },
        });
        await Async.delay(time);
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
