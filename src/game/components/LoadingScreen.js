export default class LoadingScreen {
    constructor(scene) {
        this.scene = scene;
        this.screenWidth = this.scene.cameras.main.width;
        this.screenHeight = this.scene.cameras.main.height;

        this.background = this.createBackground();
        this.barContainer = this.createBarContainer();
        this.bar = this.createBar();
        this.energyBar = this.bar;
        this.barMask = this.createBarMask();
        this.percentText = this.createPercentText();
        this.assetText = this.createAssetsText();

        this.setupBarMask();

        this.handleLoadProgress();
        this.handleFileLoadProgress();
        this.handleCompleteProgress();

        this.startTween();
    }

    createBackground() {
        return this.scene.add
            .image(
                this.screenWidth / 2,
                this.screenHeight / 2,
                "preloadBackground"
            )
            .setOrigin(0.5, 0.5)
            .setScale(1);
    }

    createBarContainer() {
        return this.scene.add.sprite(
            this.screenWidth / 2,
            this.screenHeight / 2,
            "barContainer"
        );
    }

    createBar() {
        return this.scene.add.sprite(
            this.barContainer.x,
            this.barContainer.y,
            "progressBar"
        );
    }
    createBarMask() {
        return this.scene.add
            .sprite(this.bar.x, this.bar.y, "progressBar")
            .setVisible(false);
    }

    createPercentText() {
        return this.scene.make
            .text({
                x: this.screenWidth / 2,
                y: this.screenHeight / 2 + 30,
                text: "0%",
                style: {
                    font: "20px slkscr",
                    fill: "#ffffff",
                },
            })
            .setOrigin(0.5, 0.5)
            .setScale(0.5);
    }

    createAssetsText() {
        return this.scene.make
            .text({
                x: this.screenWidth / 2,
                y: this.screenHeight / 2 + 50,
                text: "",
                style: {
                    font: "20px slkscr",
                    fill: "#ffffff",
                },
            })
            .setOrigin(0.5, 0.5)
            .setScale(0.5);
    }

    setupBarMask() {
        this.bar.mask = new Phaser.Display.Masks.BitmapMask(
            this.scene,
            this.barMask
        );
    }

    handleFileLoadProgress() {
        this.scene.load.on("fileprogress", (file) => {
            try {
                this.assetText.setText("Loading asset: " + file.key);
            } catch {}
        });
    }

    handleLoadProgress() {
        this.scene.load.on("progress", (value) => {
            this.percentText.active &&
                this.percentText.setText(parseInt(value * 100) + "%");

            if (this.barMask)
                this.barMask.x =
                    this.energyBar.x -
                    this.energyBar.displayWidth +
                    this.energyBar.displayWidth * value;
        });
    }

    handleCompleteProgress() {
        this.scene.load.on("complete", () => {
            this.percentText.destroy();
            this.assetText.destroy();
            this.background.destroy();
            this.barContainer.destroy();
            this.bar.destroy();
            this.energyBar.destroy();
            this.barMask.destroy();

            this.percentText = null;
            this.assetText = null;
            this.background = null;
            this.barContainer = null;
            this.bar = null;
            this.energyBar = null;
            this.barMask = null;
        });
    }

    startTween() {
        const barSet = [
            this.barContainer,
            this.bar,
            this.energyBar,
            this.barMask,
        ];
        const textSet = [this.percentText, this.assetText];
        const elements = [...barSet, ...textSet];

        elements.forEach((element) => {
            element.setScale(0);
        });

        this.scene.tweens.add({
            targets: barSet,
            ease: "Back.out",
            duration: 400,
            scale: 1,
            onComplete: () => {},
        });

        this.scene.tweens.add({
            targets: textSet,
            ease: "Back.out",
            duration: 500,
            scale: 0.5,
            onComplete: () => {},
        });
    }
}
