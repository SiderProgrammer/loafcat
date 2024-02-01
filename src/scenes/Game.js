import { Scene } from "phaser";

export class Game extends Scene {
  constructor() {
    super("Game");

    this.GAME_WIDTH = 480;
    this.GAME_HEIGHT = 270;
  }

  create() {
    this.scene.launch("UI");
    this.cameras.main.setBackgroundColor(0x00ff00);

    this.add.image(512, 384, "background").setAlpha(0.5);

    this.map = this.make.tilemap({ key: "streetMap" });
    const streetTileset = this.map.addTilesetImage("mp_cs_tilemap_all");
    this.map.createLayer("ground", streetTileset);

    const loafcat = this.add
      .sprite(this.game.config.width - 350, 250, "loafcat")

      .play("idle");

    this.scale.on("resize", (gameSize, baseSize, displaySize, resolution) => {
      this.cameras.resize(gameSize.width, gameSize.height);

      //loafcat.x = gameSize.width - 50;

      // this.cameras.main.centerOn(gameSize.width / 2, gameSize.height / 2);
      // this.cameras.main.setViewport(
      //   (gameSize.width - 480) / 2,
      //   0,
      //   gameSize.width,
      //   gameSize.height
      // );
      // resize();
    });
  }
}
