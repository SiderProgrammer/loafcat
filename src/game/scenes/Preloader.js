import { Scene } from "phaser";

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    loadUI() {
        this.load.setPath("./assets/ui/shop");
        this.load.image("shopPopup", "shopPopup.png");
        this.load.image("itemBox", "itemBox.png");
        this.load.image("chocolateButton", "chocolateButton.png");
        this.load.image("greyButton", "greyButton.png");
        this.load.image("shopTab", "shopTab.png");
        this.load.image("chocolateButtonSmall", "chocolateButtonSmall.png");
        this.load.image("timeTab", "timeTab.png");
        this.load.image("whiteBox", "whiteBox.png");
    }
    loadStats() {
        this.load.setPath("./assets/stats");
        this.load.image("happines", "Happines.png");
        this.load.image("health", "Health.png");
        this.load.image("hungry", "Hungry.png");
        this.load.image("hydration", "Hydration.png");
        this.load.image("pee", "Pee.png");
        this.load.image("soap", "Soap.png");
        this.load.image("statBox", "statBox.png");
    }
    loadAmbient() {
        this.load.setPath("./assets/effects/ambient");
        this.load.spritesheet(`TV-egyptian-loaf`, `TV-egyptian-loaf.png`, {
            frameWidth: 480 / 6,
            frameHeight: 48,
        });
        this.load.spritesheet(`TV-lamp`, `TV-lamp.png`, {
            frameWidth: 480 / 6,
            frameHeight: 64,
        });
    }
    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.html("avatarSection", "./UI/avatarSection.html");
        this.load.html(
            "bottomButtonsSection",
            "./UI/bottomButtonsSection.html"
        );
        this.load.html("statsDropDownMenu", "./UI/statsDropDownMenu.html");
        this.load.setPath("assets");

        this.load.image("mp_cs_tilemap_all", "mp_cs_tilemap_all.png");
        this.load.image(
            "Kitchen Room",
            "mp_house_interiors_tileset_pack/kitchen.png"
        );

        this.load.image(
            "Bathroom",
            "mp_house_interiors_tileset_pack/bathroom.png"
        );

        this.load.image(
            "Chill Room",
            "mp_house_interiors_tileset_pack/living_room.png"
        );
        this.load.image(
            "Background",
            "mp_house_interiors_tileset_pack/walls_background.png"
        );
        this.load.image(
            "Play Room",
            "mp_house_interiors_tileset_pack/kids_bedroom.png"
        );
        this.load.image("Garage", "mp_house_interiors_tileset_pack/garage.png");
        this.load.image(
            "Work Room",
            "mp_house_interiors_tileset_pack/office.png"
        );
        this.load.image(
            "Laundry",
            "mp_house_interiors_tileset_pack/laundry_room.png"
        );
        this.load.image(
            "Bedroom",
            "mp_house_interiors_tileset_pack/parents_room.png"
        );

        this.load.image(
            "Office",
            "mp_house_interiors_tileset_pack/tileset_objects.png"
        );
        this.load.image(
            "Office 2",
            "mp_house_interiors_tileset_pack/tileset_architecture.png"
        );
        this.load.image(
            "Office 3",
            "mp_house_interiors_tileset_pack/tileset_elevator.png"
        );
        this.load.tilemapTiledJSON("streetMap", `streetMap.json`);
        this.load.tilemapTiledJSON("kitchenMap", `kitchenMap.json`);
        this.load.tilemapTiledJSON("chillRoomMap", `chillRoomMap.json`);
        this.load.tilemapTiledJSON("bathroomMap", `bathroomMap.json`);
        this.load.tilemapTiledJSON("livingRoomMap", `livingRoomMap.json`);
        this.load.tilemapTiledJSON("garageMap", `garageMap.json`);
        this.load.tilemapTiledJSON("laundryMap", `laundryMap.json`);
        this.load.tilemapTiledJSON("bedroomMap", `bedroomMap.json`);
        this.load.tilemapTiledJSON("officeMap", `officeMap.json`);

        this.load.spritesheet(`loafcat`, `loafcat.png`, {
            frameWidth: 34,
            frameHeight: 36,
        });

        this.load.spritesheet(`musical-nutes`, `effects/musical-nutes.png`, {
            frameWidth: 32,
            frameHeight: 36,
        });

        this.load.spritesheet(`pee`, `effects/pee.png`, {
            frameWidth: 32,
            frameHeight: 36,
        });
        this.load.spritesheet(`front-pee`, `effects/front-pee.png`, {
            frameWidth: 32,
            frameHeight: 36,
        });
        this.load.spritesheet(`fart`, `effects/fart.png`, {
            frameWidth: 32,
            frameHeight: 36,
        });
        this.load.spritesheet(`soap`, `effects/soap.png`, {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet(`newspaper`, `effects/newspaper.png`, {
            frameWidth: 32,
            frameHeight: 36,
        });
        this.load.spritesheet(`teeth-brushing`, `effects/teeth-brushing.png`, {
            frameWidth: 32,
            frameHeight: 36,
        });
        this.load.spritesheet(`sleep`, `effects/sleep.png`, {
            frameWidth: 32,
            frameHeight: 36,
        });
        this.load.spritesheet(`cap-coffee`, `effects/cap-coffee.png`, {
            frameWidth: 32,
            frameHeight: 36,
        });
        this.load.spritesheet(`smoke`, `effects/smoke.png`, {
            frameWidth: 256 / 8,
            frameHeight: 32,
        });
        this.load.spritesheet(`tv-popcorn`, `effects/tv-popcorn.png`, {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.image("logo", "logo.png");
        this.load.image("wallOverlay", "wallOverlay.png");
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
        this.load.image("arrow", "arrow.png");
        this.load.image("nurse", "nurse.png");
        this.load.image("soapImage", "soapImage.png");

        this.load.bitmapFont(
            "WhitePeaberry",
            "WhitePeaberry.png",
            "WhitePeaberry.xml"
        );

        this.load.audio("theme", ["audio/theme.wav"]);

        this.loadUI();
        this.loadStats();
        this.loadAmbient();
    }

    addLoafcatAnim(name, frames, row, loop = true, frameRate = 7, custom) {
        const realFrames = frames.map((frame) => frame + 14 * row);

        this.anims.create({
            key: name,
            frames: this.anims.generateFrameNumbers("loafcat", {
                frames: realFrames,
            }),
            frameRate,
            repeat: loop ? -1 : 0,
            ...custom,
        });
    }
    addBaseEffectAnim(
        animationKey,
        animationSpritesheet,
        frameRate = 7,
        loop = true,
        custom
    ) {
        this.anims.create({
            key: animationKey,
            frames: this.anims.generateFrameNumbers(animationSpritesheet),
            frameRate,
            repeat: loop ? -1 : 0,
            ...custom,
        });
    }
    create() {
        this.addLoafcatAnim("idle", [0, 1, 2], 0);
        this.addLoafcatAnim("walk", [0, 1, 2, 3], 1);
        this.addLoafcatAnim("dance", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 7);
        this.addLoafcatAnim("pee", [0, 1, 2, 3, 4, 5, 6, 7], 14);
        this.addLoafcatAnim("listen-music", [0, 1, 2, 3, 4, 5, 6, 7], 13);
        this.addLoafcatAnim(
            "drink-coffee",
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            26,
            true,
            4
        );
        this.addLoafcatAnim("feed-me", [0, 1, 2, 3], 11);
        this.addLoafcatAnim(
            "sleep",
            [0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13],
            14
        );
        this.addLoafcatAnim("fart", [0, 1, 2, 3, 4, 5, 6, 7, 8], 18, false);

        this.addLoafcatAnim("front-pee", [0, 1, 2, 3, 4, 5, 6, 7], 19);
        this.addLoafcatAnim("eat", [0, 1, 2, 3, 4], 20);
        this.addLoafcatAnim("bathing", [0, 1, 2, 3, 4, 5, 6, 7], 23);
        this.addLoafcatAnim("watch-tv", [0, 1, 2, 3, 4], 21);
        // this.addLoafcatAnim("smoke", [0, 1, 2, 3, 4, 5, 6, 7], 22, false, 5, {
        //     repeatDelay: 2500,
        // });
        this.addLoafcatAnim("dead", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 17, false);
        this.addLoafcatAnim("teeth-brushing", [0, 1, 2, 3], 24, true, 5);
        this.addLoafcatAnim(
            "toiletPoop",
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            27,
            true,
            5
        );

        this.addBaseEffectAnim("coffee-idle", "cap-coffee", 4);
        this.addBaseEffectAnim("pee-idle", "pee");
        this.addBaseEffectAnim("fart-idle", "fart");
        this.addBaseEffectAnim("front-pee-idle", "front-pee");
        this.addBaseEffectAnim("sleep-idle", "sleep");

        this.addBaseEffectAnim("soap-idle", "soap");
        this.addBaseEffectAnim("newspaper-idle", "newspaper", 5);
        this.addBaseEffectAnim("teeth-brushing-idle", "teeth-brushing", 5);

        this.addBaseEffectAnim("TV-egyptian-loaf", "TV-egyptian-loaf", 5);
        this.addBaseEffectAnim("TV-lamp", "TV-lamp");
        this.addBaseEffectAnim("tv-popcorn", "tv-popcorn");
        // this.addBaseEffectAnim("smoke-idle", "smoke", 5, true, {
        //     repeatDelay: 0,
        // });

        // this.addLoafcatAnim("smoke", [0, 1, 2, 3, 4, 5, 6, 7], 22, false, 5, {
        //     repeatDelay: 2500,
        // });

        const smokeRateLoaf = [0, 1, 2, 3, 4, 5, 6, 7, 1, 1, 1, 1, 1, 1].map(
            (frame) => frame + 14 * 22
        );
        this.anims.create({
            key: "smoke",
            frames: this.anims.generateFrameNumbers("loafcat", {
                frames: smokeRateLoaf,
            }),
            frameRate: 5,
            repeat: -1,
        });
        this.anims.create({
            key: "smoke-idle",
            frames: this.anims.generateFrameNumbers("smoke", {
                frames: [0, 1, 2, 3, 4, 5, 6, 7, 0, 1, 0, 1, 0, 1],
            }),
            frameRate: 5,
            repeat: -1,
        });

        this.scene.start("Game", { map: "garageMap" });
    }
}
