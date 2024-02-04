import { Scene } from "phaser";
import { GameModel } from "../models/GameModel";
import { MAX_WIDTH, SAFE_GAME_WIDTH } from "../constants/viewport";

export class Game extends Scene {
  constructor() {
    super("Game");
  }

  create() {
    this.scene.launch("UI");
    this.cameras.main.setBackgroundColor(0x00ff00);

    this.add.image(512, 384, "background").setAlpha(0.5);

    this.map = this.make.tilemap({ key: "streetMap" });
    const streetTileset = this.map.addTilesetImage("mp_cs_tilemap_all");
    this.map.createLayer("ground", streetTileset);

    this.add
      .sprite(this.game.config.width - 400, 180, "loafcat")

      .play("walk");

    this.scale.on("resize", (gameSize, baseSize, displaySize, resolution) => {
      this.cameras.resize(gameSize.width, gameSize.height);
      GameModel.GAME_WIDTH = gameSize.width;
      GameModel.GAME_HEIGHT = gameSize.height;

      this.cameras.main.setViewport(0, 0, gameSize.width, gameSize.height);

      this.cameras.main.centerOn(
        SAFE_GAME_WIDTH / 2 + (MAX_WIDTH - SAFE_GAME_WIDTH) / 2,
        gameSize.height / 2
      );
    });
  }
}
