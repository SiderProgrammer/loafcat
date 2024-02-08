import { Scene } from "phaser";
import { fadeIn } from "../helpers/common";
import { GameModel } from "../models/GameModel";
import Button from "../components/Button";

export class SignIn extends Scene {
  constructor() {
    super("SignIn");
  }

  create({ parentScene }) {
    this.parentScene = parentScene;
    // TODO : create pet linking and pet naming, use API
    // if (window.solana.connect()) {
    //   this.scene.start("Preloader");
    //   return;
    // }

    this.elementsContainer = this.add.container(
      this.game.config.width / 2,
      this.game.config.height / 2
    );

    this.textContent = this.add.text(0, -50, "Sign In using the wallet");
    this.walletStage();

    this.elementsContainer.add([this.textContent, this.walletButton]);

    this.scale.on("resize", (gameSize, baseSize, displaySize, resolution) => {
      this.cameras.resize(gameSize.width, gameSize.height);
      // this.setSpritesPosition(gameSize.width);
    });

    //  this.setSpritesPosition(this.game.config.width);
  }

  walletStage() {
    this.walletButton = new Button(this, 0, 0, "loafcat2");

    this.walletButton.onClick(async () => {
      await this.connectToWallet();
      this.textContent.text = "Submit your name";
      this.walletButton.destroy();
      this.nameStage();
    });
  }

  nameStage() {
    this.nameButton = new Button(this, 0, 0, "coin");

    this.nameButton.onClick(() => {
      this.cleanScreen();
      this.linkedPetsButton = new Button(this, 0, -50, "coin");

      this.linkedPetsButton.onClick(() => {
        this.elementsContainer.add(this.linkedPetsButton);
        this.scene.start("LinkedPets");
      });

      this.yourPetsButton = new Button(this, 0, 50, "coin");

      this.yourPetsButton.onClick(() => {
        this.elementsContainer.add(this.yourPetsButton);
        this.scene.start("YourPets");
      });

      this.elementsContainer.add([this.linkedPetsButton, this.yourPetsButton]);
    });

    this.elementsContainer.add(this.nameButton);
  }

  cleanScreen() {
    this.elementsContainer.removeAll(true);
  }

  async connectToWallet() {
    let wallet;
    try {
      if (window.solana) {
        // window.solana.on("connect", () => {

        // });
        const resp = await window.solana.connect();
        wallet = resp;
        window.wallet = wallet;
      }

      // 26qv4GCcx98RihuK3c4T6ozB3J7L6VwCuFVc7Ta2A3Uo
    } catch (err) {
      // { code: 4001, message: 'User rejected the request.' }
    }
  }

  setSpritesPosition(gameWidth) {}

  addItem(x, y, itemData) {
    const itemContainer = this.add.container(x, y);
    itemContainer.frame = this.add.image(0, 0, "avatarFrame").setScale(0.5);
    itemContainer.image = this.add.image(0, 0, itemData.image);
    // itemContainer.title = this.add
    //   .text(-55, 0, itemData.title)
    //   .setOrigin(0, 0.5);
    // itemContainer.cost = this.add.text(30, 0, itemData.cost).setOrigin(0, 0.5);
    // itemContainer.coin = this.add.image(70, 0, "coin");

    // itemContainer.purchaseButton = this.add.image(90, 0, "storeButton");

    itemContainer.add([
      itemContainer.frame,
      itemContainer.image,
      //   itemContainer.title,
      //   itemContainer.cost,
      //   itemContainer.coin,
      //   itemContainer.purchaseButton,
    ]);
  }
}
