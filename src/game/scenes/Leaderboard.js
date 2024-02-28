import { Scene } from "phaser";
import { fadeIn } from "../helpers/common";
import { GameModel } from "../models/GameModel";
import Button from "../components/Button";

export class Leaderboard extends Scene {
  constructor() {
    super("Leaderboard");
  }

  create({ parentScene, leaderboardData }) {
    this.parentScene = parentScene;
    this.leaderboardData = leaderboardData;

    this.elementsContainer = this.add.container(
      this.game.config.width / 2,
      this.game.config.height / 2
    );

    this.board = this.add.sprite(0, 0, "statsBoard").setScale(10);

    leaderboardData.forEach((player, i) => {
      this.addPlayer(
        GameModel.GAME_WIDTH / 2,
        GameModel.GAME_HEIGHT / 2 + i * 40,
        player
      );
    });

    this.closeButton = new Button(this, 70, -60, "closeButton");

    this.closeButton.onClick(async () => {
      this.parentScene.scene.stop(this.scene.key);
      fadeIn(this.parentScene, 250);
    });

    this.elementsContainer.add([this.board, this.closeButton]);

    this.scale.on("resize", (gameSize, baseSize, displaySize, resolution) => {
      this.cameras.resize(gameSize.width, gameSize.height);
      // this.setSpritesPosition(gameSize.width);
    });

    //  this.setSpritesPosition(this.game.config.width);
  }

  setSpritesPosition(gameWidth) {}

  addPlayer(x, y, playerData) {
    const itemContainer = this.add.container(x, y);
    itemContainer.rank = this.add
      .text(-50, 0, playerData.Rank)
      .setOrigin(0, 0.5);
    itemContainer.playerName = this.add
      .text(-30, 0, playerData.UserID)
      .setOrigin(0, 0.5);
    // itemContainer.title = this.add
    //   .text(-55, 0, itemData.title)
    //   .setOrigin(0, 0.5);
    // itemContainer.cost = this.add.text(30, 0, itemData.cost).setOrigin(0, 0.5);
    // itemContainer.coin = this.add.image(70, 0, "coin");

    // itemContainer.purchaseButton = this.add.image(90, 0, "storeButton");

    itemContainer.add([
      itemContainer.rank,
      itemContainer.playerName,

      //   itemContainer.title,
      //   itemContainer.cost,
      //   itemContainer.coin,
      //   itemContainer.purchaseButton,
    ]);
  }
}
