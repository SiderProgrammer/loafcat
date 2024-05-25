import { Scene } from "phaser";
import { fadeIn } from "../helpers/common";
import { GameModel } from "../models/GameModel";
import Button from "../components/Button";
import axios from "axios";
import { UserModel } from "../models/UserModel";
import { getMyPetsData } from "../helpers/requests";

export class LinkedPets extends Scene {
    constructor() {
        super("LinkedPets");
    }

    async create() {
        const petsData = await getMyPetsData();

        this.elementsContainer = this.add.container(
            this.game.config.width / 2,
            this.game.config.height / 2
        );
        console.log(petsData);
        petsData.data.length &&
            petsData.data.pets.forEach((petData, i) => {
                const petName = this.add.text(-150, -50 + i * 40, petData.Name);
                const level = petData.Level ? petData.Level.LevelNumber : 1;
                const petLevel = this.add.text(
                    50,
                    -50 + i * 40,
                    "Level " + level
                );
                const petButton = new Button(this, 0, -50 + i * 40, "loafcat2");

                petButton.onClick(async () => {
                    this.scene.start("Preloader");
                });

                this.elementsContainer.add([petButton, petName, petLevel]);
            });

        // this.elementsContainer = this.add.container(
        //   this.game.config.width / 2,
        //   this.game.config.height / 2
        // );

        this.textContent = this.add.text(-50, -100, "Your Linked Pets");

        this.elementsContainer.add([this.textContent]);

        this.scale.on(
            "resize",
            (gameSize, baseSize, displaySize, resolution) => {
                this.cameras.resize(gameSize.width, gameSize.height);
                // this.setSpritesPosition(gameSize.width);
            }
        );

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
