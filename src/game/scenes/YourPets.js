import { Scene } from "phaser";
import { fadeIn } from "../helpers/common";
import { GameModel } from "../models/GameModel";
import Button from "../components/Button";
import axios from "axios";
import { UserModel } from "../models/UserModel";
import { getMyPetsData } from "../helpers/requests";

export class YourPets extends Scene {
  constructor() {
    super("YourPets");
  }

  async create() {
    const petsData = await getMyPetsData()

    const nftsData = await axios({
      method: "GET",
      url: `http://localhost:3001/wallet-nfts/` + UserModel.USER_ID,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    console.log(petsData);
    console.log(nftsData);

    this.elementsContainer = this.add.container(
      this.game.config.width / 2,
      this.game.config.height / 2
    );
    // TODO : filter linked pets from not linked and label them as "linked" / "not linked"
    // TODO : to do it, needs ID in NFTs metadata

    const petData = nftsData.data;
    const petName = this.add.text(-150, -50, petData.name);

    const petButton = new Button(this, 0, -50, "loafcat2");

    petButton.onClick(async () => {
      // await axios({
      //   method: "GET",
      //   url: `http://localhost:3001/link-pet`,
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "application/json",
      //   },
      //   data: {
      //     UserID: UserModel.USER_ID,
      //     petType: nftsData.data.model,
      //     PetID: UserModel.PET_ID,
      //     PetName: "Bobby",
      //   },
      // });
      this.scene.start("Preloader");
    });

    this.elementsContainer.add([petButton, petName]);

    // nftsData.data.forEach((petData, i) => {
    //   const petName = this.add.text(-150, -50 + i * 40, petData.name);
    //   //const level = petData.Level ? petData.Level.LevelNumber : 1;
    //   //const petLevel = this.add.text(50, -50 + i * 40, "Level " + level);
    //   const petButton = new Button(this, 0, -50 + i * 40, "loafcat2");

    //   petButton.onClick(async () => {
    //     this.scene.start("Preloader");
    //   });

    //   this.elementsContainer.add([petButton, petName]);
    // });

    this.textContent = this.add.text(-50, -100, "Your NFTs");

    this.elementsContainer.add([this.textContent]);

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
// this.load.plugin(
//   "rexinputtextplugin",
//   "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js",
//   true
// );
// // }

// async create() {
// const petsData = await axios({
//   method: "POST",
//   url: `http://localhost:3000/api/my-pets`,
//   headers: {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   },
//   data: {
//     UserID: UserModel.USER_ID,
//   },
// });

// this.elementsContainer = this.add.container(
//   this.game.config.width / 2,
//   this.game.config.height / 2
// );
// petsData.data.pets.forEach((petData, i) => {
//   const petName = this.add.text(-150, -50 + i * 40, petData.Name);
//   const level = petData.Level ? petData.Level.LevelNumber : 1;
//   const petLevel = this.add.text(50, -50 + i * 40, "Level " + level);
//   const petButton = new Button(this, 0, -50 + i * 40, "loafcat2");

//   petButton.onClick(async () => {
//     this.scene.start("Preloader");
//   });

//   this.elementsContainer.add([petButton, petName, petLevel]);
// });

// this.elementsContainer = this.add.container(
//   this.game.config.width / 2,
//   this.game.config.height / 2
// );

// this.textContent = this.add.text(-50, -100, "Your Linked Pets");

// this.elementsContainer.add([this.textContent]);
