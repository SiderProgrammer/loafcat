import { Scene } from "phaser";

export class UI extends Scene {
  constructor() {
    super("UI");
  }

  create() {
    this.loafcat = this.add.sprite(0, 0, "loafcat");

    this.avatarSection = this.add.container(20, 20);
    this.avatarImage = this.add.sprite(0, 0, "loafcat");
    this.coin = this.add.sprite(30, 0, "coin");
    this.coinsValue = this.add.text(40, 0, "200").setOrigin(0, 0.5);

    this.avatarSection.add([this.avatarImage, this.coin, this.coinsValue]);

    this.gearButton = this.add.sprite(
      0,
      this.game.config.height - 12,
      "gearButton"
    );
    this.mainMenuButton = this.add.sprite(
      0,
      this.game.config.height - 12,
      "mainMenuButton"
    );
    this.storeButton = this.add.sprite(
      0,
      this.game.config.height - 12,
      "storeButton"
    );
    this.statsButton = this.add
      .sprite(0, this.game.config.height - 12, "statsButton")
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.launch("Stats");
      });
    this.scale.on("resize", (gameSize, baseSize, displaySize, resolution) => {
      this.cameras.resize(gameSize.width, gameSize.height);
      this.setSpritesPosition(gameSize.width);
    });

    this.setSpritesPosition(this.game.config.width);
  }

  setSpritesPosition(gameWidth) {
    this.loafcat.x = gameWidth - 50;
    this.gearButton.x = gameWidth - 12;
    this.mainMenuButton.x = gameWidth - 32;
    this.storeButton.x = gameWidth - 52;
    this.statsButton.x = gameWidth - 72;
  }
}
