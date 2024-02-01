import { Scene } from "phaser";

export class Boot extends Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
    //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

    this.load.image("background", "assets/bg.png");
    this.load.image("mp_cs_tilemap_all", "assets/mp_cs_tilemap_all.png");

    this.load.tilemapTiledJSON("streetMap", `assets/streetMap.json`);

    this.load.spritesheet(`loafcat`, `assets/loafcat.png`, {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    this.scene.start("Preloader");
  }
}
