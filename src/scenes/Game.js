import { Scene } from "phaser";
import { GameModel } from "../models/GameModel";
import {
  MAX_HEIGHT,
  MAX_WIDTH,
  SAFE_GAME_HEIGHT,
  SAFE_GAME_WIDTH,
} from "../constants/viewport";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  create() {
    GameModel.MAIN_SCENE = this;
    this.scene.launch("UI");
    this.cameras.main.setBackgroundColor(0x00ff00);

    this.add.image(512, 384, "background").setAlpha(0.5);

    this.map = this.make.tilemap({ key: "streetMap" });
    const streetTileset = this.map.addTilesetImage("mp_cs_tilemap_all");
    this.map.createLayer("Background", streetTileset);
    this.map.createLayer("Tile Layer 5", streetTileset);
    this.map.createLayer("Tile Layer 2", streetTileset);
    this.map.createLayer("Tile Layer 3", streetTileset);
    this.map.createLayer("Tile Layer 4", streetTileset);

    // this.add
    //   .sprite(this.game.config.width - 400, 180, "musical-nutes")
    //   .play("nutes-idle");

    this.loafcat = this.add
      .sprite(80, 275, "loafcat")

      .play("walk");

    this.moveLoafcatRandomly();

    // this.add.sprite(73, 182, "pee").play("pee-idle").setFlipX(true);
    this.scale.on("resize", (gameSize, baseSize, displaySize, resolution) => {
      this.cameras.resize(gameSize.width, gameSize.height);
      GameModel.GAME_WIDTH = gameSize.width;
      GameModel.GAME_HEIGHT = gameSize.height;

      this.cameras.main.setViewport(0, 0, gameSize.width, gameSize.height);

      this.cameras.main.centerOn(
        SAFE_GAME_WIDTH / 2 + (MAX_WIDTH - SAFE_GAME_WIDTH) / 2,
        //gameSize.height / 2
        SAFE_GAME_HEIGHT / 2 + (MAX_HEIGHT - SAFE_GAME_HEIGHT) / 2
      );
    });
  }

  moveLoafcatRandomly() {
    const newX = Phaser.Math.Between(
      (MAX_WIDTH - SAFE_GAME_WIDTH) / 2,
      SAFE_GAME_WIDTH
    );
    const pixelTravelTime = 50;

    const duration = Math.abs(this.loafcat.x - newX) * pixelTravelTime;
    const flipCat = this.loafcat.x - newX < 0 ? false : true;
    this.loafcat.setFlipX(flipCat);
    this.moveTween = this.tweens.add({
      targets: this.loafcat,
      x: newX,
      duration,
      onComplete: () => {
        this.moveLoafcatRandomly();
      },
    });
  }

  setStateCatFeed() {
    this.loafcat.play("feed-me");
    this.moveTween.pause();
  }
  setStateCatIdle() {
    this.moveTween.resume();
    this.loafcat.play("walk");
  }
}
