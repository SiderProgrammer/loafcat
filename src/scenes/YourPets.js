import { Scene } from "phaser";
import { fadeIn } from "../helpers/common";
import { GameModel } from "../models/GameModel";
import Button from "../components/Button";
import axios from "axios";
import { UserModel } from "../models/UserModel";

export class YourPets extends Scene {
  constructor() {
    super("YourPets");
  }
  preload() {
    this.load.plugin(
      "rexinputtextplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js",
      true
    );
  }

  create() {
    this.elementsContainer = this.add.container(
      this.game.config.width / 2,
      this.game.config.height / 2
    );

    this.name = "";
    this.textContent = this.add.text(0, -50, "Your Pets");
    this.nft = new Button(this, 0, 0, "loafcat2");

    this.nft.onClick(async () => {
      this.inputText = this.add
        .rexInputText({
          id: "nicknameInput",
          x: this.game.config.width / 2,
          y: 100,
          width: 100,
          height: 100,
          type: "input",
          placeholder: "Name",
          fontSize: "30px",
          fontFamily: "slkscr",
          color: "#000000",

          align: "center",

          maxLength: 10,
        })
        .resize(100, 100)
        .on("textchange", ({ text }) => {
          this.name = text;
          //   const isNameValid = this.validateName(this.name);
          //   isNameValid ? this.showNextButton() : this.hideNextButton();
          //   gameData.nickname = this.name;
        });

      this.inputBox = this.add.image(0, 60, "inputBox");
      this.inputBox.setDisplaySize(100, 50);

      this.submit = new Button(this, 0, 0, "coin");
      this.submit.onClick(async () => {
        const linkPet = await axios({
          method: "POST",
          url: `http://localhost:3000/api/link-pet/`,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          data: {
            UserID: UserModel.USER_ID,
            PetID: "samplePetID" + this.name,
            PetName: this.name,
            petType: "Nft",
          },
        });

        this.scene.start("Preloader");
      });

      this.elementsContainer.add([this.inputText, this.inputBox, this.submit]);
    });

    this.elementsContainer.add([this.textContent, this.nft]);

    this.scale.on("resize", (gameSize, baseSize, displaySize, resolution) => {
      this.cameras.resize(gameSize.width, gameSize.height);
      // this.setSpritesPosition(gameSize.width);
    });

    //  this.setSpritesPosition(this.game.config.width);
  }

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
