import { Scene } from "phaser";
import { fadeOut } from "../helpers/common";

export class UI extends Scene {
  constructor() {
    super("UI");
  }

  create() {
    this.loafcat = this.add.sprite(0, 0, "loafcat");

    this.avatarSection = this.add.container(20, 20);
    this.avatarFrame = this.add.sprite(0, 0, "avatarFrame");
    this.avatarImage = this.add.sprite(0, 0, "loafcat");

    this.coin = this.add.sprite(30, -10, "coin");
    this.coinsValue = this.add
      .text(40, -10, "200", { fontSize: 10 })
      .setOrigin(0, 0.5);

    this.levelFrame = this.add.sprite(30, 5, "levelFrame").setScale(0.5);
    this.levelValue = this.add
      .text(23, 5, "13", { fontSize: 10 })
      .setOrigin(0, 0.5);
    this.levelBar = this.add
      .sprite(40, 5, "statsProgressBar")
      .setOrigin(0, 0.5)
      .setScale(1.5);

    this.avatarSection.add([
      this.avatarFrame,
      this.avatarImage,

      this.coin,
      this.coinsValue,

      this.levelFrame,
      this.levelValue,
      this.levelBar,
    ]);

    this.gearButton = this.add.sprite(
      0,
      this.game.config.height - 12,
      "gearButton"
    );
    this.mainMenuButton = this.add
      .sprite(0, this.game.config.height - 12, "mainMenuButton")
      .setInteractive()
      .on("pointerdown", async () => {
        await fadeOut(this, 250);
        this.scene.launch("Inventory", { parentScene: this });
      });
    this.storeButton = this.add
      .sprite(0, this.game.config.height - 12, "storeButton")
      .setInteractive()
      .on("pointerdown", async () => {
        await fadeOut(this, 250);
        this.scene.launch("Shop", { parentScene: this });
      });
    this.statsButton = this.add
      .sprite(0, this.game.config.height - 12, "statsButton")
      .setInteractive()
      .on("pointerdown", async () => {
        await fadeOut(this, 250);
        this.scene.launch("Stats", { parentScene: this });
      });
    this.scale.on("resize", (gameSize, baseSize, displaySize, resolution) => {
      this.cameras.resize(gameSize.width, gameSize.height);
      this.setSpritesPosition(gameSize.width);
    });

    this.leaderboardButton = this.add
      .sprite(0, this.game.config.height - 12, "leaderboardButton")
      .setInteractive()
      .on("pointerdown", async () => {
        await fadeOut(this, 250);
        this.scene.launch("Leaderboard", { parentScene: this });
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
    this.leaderboardButton.x = gameWidth - 92;
  }
}
