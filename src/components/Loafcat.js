import { MAX_WIDTH, SAFE_GAME_WIDTH } from "../constants/viewport";
import { Async } from "../utils/Async";
import { MathUtils } from "../utils/Math";

export default class Loafcat extends Phaser.GameObjects.Container {
  constructor(scene, x, y, sprite) {
    super(scene, x, y);
    scene.add.existing(this);

    this.sprite = sprite;

    this.addLoafcatSprite();
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
    }
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
    this.moveTween.stop();
  }

  async feed(feedValue) {
    this.character.play("eat");
    await Async.delay(2000);
    if (MathUtils.chance(30)) {
      this.fart();
      await Async.delay(2000);
    }
  }

  fart() {
    this.character.play("fart");
    this.fartImage = this.scene.add.sprite(0, 0, "fart").play("fart-idle");

    this.add(this.fartImage);
  }

  listenMusic() {
    this.character.play("listen-music");

    this.notes = this.scene.add
      .sprite(-35, 5, "musical-nutes")
      .play("nutes-idle");

    this.add(this.notes);
  }

  pee() {
    this.character.play("front-pee");

    this.peeSprite = this.scene.add
      .sprite(0, 0, "front-pee")
      .play("front-pee-idle");

    this.add(this.peeSprite);
    this.swap(this.peeSprite, this.character);
  }

  setStateBathing() {
    this.setStateCatIdle();
    this.x = 369;
    this.y = 272;
    this.character.play("bathing");

    this.soap = this.scene.add.sprite(0, 0, "soap").play("soap-idle");

    this.add(this.soap);
  }
}
