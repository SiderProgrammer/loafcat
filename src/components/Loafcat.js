import { MAX_WIDTH, SAFE_GAME_WIDTH } from "../constants/viewport";

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

      .play("walk");
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

    this.character.setFlipX(flipCat);

    this.moveTween = this.scene.tweens.add({
      targets: this,
      x: newX,
      duration,
      onComplete: () => {
        this.moveRandomly();
      },
    });
  }
  setStateCatFeed() {
    this.character.play("feed-me");
    this.moveTween.pause();
  }
  setStateCatIdle() {
    this.character.play("walk");
    this.moveTween.resume();
  }

  // updateNotifications(petData) {
  //   this.checkAddNotification(petData)
  //   this.checkRemoveNotification(petData)

  // }

  checkAddNotification(petData) {
    this.petData = petData;

    if (petData.HungerLevel < 50) {
      // const popupContainer = this.scene.add.container(0,0,[])
      const popUp = this.scene.add.image(0, -20, "petPopup").setScale(1.5);
      const hungerIcon = this.scene.add.image(0, -20, "hungerIcon");

      this.add([popUp, hungerIcon]);
      //popupContainer.add([popUp, hungerIcon]);
      this.removeNotification = () => {
        this.remove([popUp, hungerIcon]);
      };
      // this.scene.time.delayedCall(5000, () => {
      //   this.removeNotification();
      // });
    }
  }

  checkRemoveNotification() {
    if (this.petData.HungerLevel > 50) {
      this.removeNotification();
    }
  }

  feed(feedValue) {
    this.petData.HungerLevel += feedValue;
    this.checkRemoveNotification();
  }
}
