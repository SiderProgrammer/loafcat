import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(512, 384, "background");

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on("progress", (progress) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath("assets");

    this.load.image("mp_cs_tilemap_all", "mp_cs_tilemap_all.png");
    this.load.image(
      "Kitchen Room",
      "mp_house_interiors_tileset_pack/kitchen.png"
    );

    this.load.image("Bathroom", "mp_house_interiors_tileset_pack/bathroom.png");

    this.load.image(
      "Chill Room",
      "mp_house_interiors_tileset_pack/living_room.png"
    );
    this.load.image(
      "Background",
      "mp_house_interiors_tileset_pack/walls_background.png"
    );
    this.load.tilemapTiledJSON("streetMap", `streetMap.json`);
    this.load.tilemapTiledJSON("kitchenMap", `kitchenMap.json`);

    this.load.spritesheet(`loafcat`, `loafcat.png`, {
      frameWidth: 42,
      frameHeight: 42,
    });

    this.load.spritesheet(`musical-nutes`, `effects/musical-nutes.png`, {
      frameWidth: 32,
      frameHeight: 36,
    });

    this.load.spritesheet(`pee`, `effects/pee.png`, {
      frameWidth: 32,
      frameHeight: 36,
    });

    this.load.image("logo", "logo.png");
    this.load.image("gearButton", "gearButton.png");
    this.load.image("coin", "coin.png");
    this.load.image("storeButton", "storeButton.png");
    this.load.image("statsButton", "statsButton.png");
    this.load.image("mainMenuButton", "mainMenuButton.png");
    this.load.image("closeButton", "closeButton.png");
    this.load.image("leaderboardButton", "leaderboardButton.png");

    this.load.image("hourGlassIcon", "hourGlassIcon.png");
    this.load.image("hungerIcon", "hungerIcon.png");
    this.load.image("hearthIcon", "hearthIcon.png");
    this.load.image("thunderIcon", "thunderIcon.png");
    this.load.image("statsProgressBar", "statsProgressBar.png");
    this.load.image("statsProgressBarFill", "statsProgressBarFill.png");

    this.load.image("avatarFrame", "avatarFrame.png");
    this.load.image("levelFrame", "levelFrame.png");
    this.load.image("statsBoard", "statsBoard.png");
    this.load.image("blackBackground", "blackBackground.png");
    this.load.image("apple", "apple.png");
    this.load.image("petPopup", "petPopup.png");
  }

  addLoafcatAnim(name, frames, row) {
    const realFrames = frames.map((frame) => frame + 13 * row);

    this.anims.create({
      key: name,
      frames: this.anims.generateFrameNumbers("loafcat", {
        frames: realFrames,
      }),
      frameRate: 8,
      repeat: -1,
    });
  }

  create() {
    this.addLoafcatAnim("idle", [0, 1, 2], 0);
    this.addLoafcatAnim("walk", [0, 1, 2, 3], 1);
    this.addLoafcatAnim("dance", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 7);
    this.addLoafcatAnim("pee", [0, 1, 2, 3, 4, 5, 6, 7], 14);
    this.addLoafcatAnim("feed-me", [0, 1, 2, 3], 11);

    this.anims.create({
      key: "nutes-idle",
      frames: this.anims.generateFrameNumbers("musical-nutes", {
        frames: [0, 1, 2, 3, 4, 5, 6],
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "pee-idle",
      frames: this.anims.generateFrameNumbers("pee", {
        frames: [0, 1, 2, 3, 4, 5, 6, 7],
      }),
      frameRate: 8,
      repeat: -1,
    });
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    this.scene.start("Game", { map: "streetMap" });
  }
}
