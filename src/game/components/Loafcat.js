import { MAX_WIDTH, SAFE_GAME_WIDTH } from "../constants/viewport";
import { Async } from "../utils/Async";
import { MathUtils } from "../utils/Math";

export default class Loafcat extends Phaser.GameObjects.Container {
    constructor(scene, x, y, sprite) {
        super(scene, x, y);
        scene.add.existing(this);
        this.baseY = y;
        this.sprite = sprite;
        this.effects = [];
        this.addLoafcatSprite();
    }
    setBaseY() {
        this.y = this.baseY;
    }
    addLoafcatSprite() {
        this.character = this.scene.add
            .sprite(0, 0, this.sprite)

            .play("idle");
        this.add(this.character);
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

        this.setState("walk");
    }
    setState(state) {
        switch (state) {
            case "idle":
                this.cleanEffects();
                this.setStateCatIdle();
                break;
            case "walk":
                this.setStateCatWalk();
                break;
            case "feed":
                this.setStateCatFeed();
                break;
            case "bath":
                this.setStateBathing();
                break;
            case "toiletPoop":
                this.setStateCatPoop();
                break;
            case "teeth-brush":
                this.setStateCatTeethBrush();
                break;
            case "TV":
                this.setStateCatWatchTV();
                break;
            case "sleep":
                this.sleep();
                break;
        }
    }
    work() {
        this.setStateCatIdle();
        this.character.play("working");
        this.setScale(1, 1);
        this.officeSet = this.scene.add
            .sprite(0, 0, "office-set")
            .play("office-set");

        this.add(this.officeSet);
        this.effects.push(this.officeSet);
    }

    playCurious() {
        this.setStateCatIdle();
        this.character.play("curious");
        this.curiousSprite = this.scene.add
            .sprite(0, 0, "curious")
            .play("curious-idle");

        this.add(this.curiousSprite);
        this.effects.push(this.curiousSprite);
    }
    sleep() {
        this.setStateCatIdle();
        this.character.play("sleep");
        this.sleepSprite = this.scene.add
            .sprite(0, 0, "sleep")
            .play("sleep-idle");

        this.add(this.sleepSprite);
        this.effects.push(this.sleepSprite);
    }
    setStateCatWatchTV() {
        this.setStateCatIdle();
        this.character.play("watch-tv");
        this.popcorn = this.scene.add
            .sprite(0, 0, "tv-popcorn")
            .play("tv-popcorn");

        this.add(this.popcorn);
        this.effects.push(this.popcorn);
    }
    drinkCoffee() {
        this.setStateCatIdle();
        this.character.play("drink-coffee");
        this.coffee = this.scene.add
            .sprite(0, 0, "cap-coffee")
            .play("coffee-idle");

        this.add(this.coffee);
        this.effects.push(this.coffee);
    }
    setStateCatFeed() {
        this.setStateCatIdle();
        this.character.play("feed-me");
    }
    setStateCatWalk() {
        this.character.play("walk");
        this.moveTween.resume();
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
        this.setStateCatIdle();

        this.character.play("smoke");

        this.smokeSprite = this.scene.add
            .sprite(16, -2, "smoke")
            .play("smoke-idle");

        this.add([this.smokeSprite]);
        this.effects.push(this.smokeSprite);
    }
    async feed(feedValue) {
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

    cleanEffects() {
        this.effects.forEach((effect) => {
            this.remove(effect, true);
        });
    }
    fart() {
        this.character.play("fart");
        this.fartImage = this.scene.add.sprite(0, 0, "fart").play("fart-idle");

        this.add(this.fartImage);
        this.effects.push(this.fartImage);
    }

    setStateCatPoop() {
        this.setStateCatIdle();
        this.character.play("toiletPoop");
        this.newspaper = this.scene.add
            .sprite(0, 0, "newspaper")
            .play("newspaper-idle");

        this.add(this.newspaper);

        this.effects.push(this.newspaper);
    }

    setStateCatTeethBrush() {
        // this.setBaseY();
        this.setStateCatIdle();
        this.character.play("teeth-brushing");
        this.teethBrush = this.scene.add
            .sprite(0, 0, "teeth-brushing")
            .play("teeth-brushing-idle");

        this.add(this.teethBrush);
        this.effects.push(this.teethBrush);
    }

    listenMusic() {
        this.character.play("listen-music");

        this.notes = this.scene.add
            .sprite(-35, 5, "musical-nutes")
            .play("nutes-idle");

        this.add(this.notes);
        this.effects.push(this.notes);
    }

    pee() {
        this.setStateCatIdle();
        this.character.play("front-pee");

        this.peeSprite = this.scene.add
            .sprite(0, 0, "front-pee")
            .play("front-pee-idle");

        this.add(this.peeSprite);
        this.swap(this.peeSprite, this.character);
        this.effects.push(this.peeSprite);
    }

    setStateBathing() {
        this.setStateCatIdle();
        this.moveTween.destroy();

        //this.character.play("bathing");

        this.soap = this.scene.add.sprite(0, 0, "soap"); //.play("soap-idle");

        this.add(this.soap);
        this.effects.push(this.soap);
    }
}
