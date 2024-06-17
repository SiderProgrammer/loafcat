import gameConfig from "../config/index";

export class MapInteractionSystem {
    constructor(scene, mapLayers, cursorController) {
        this.config = gameConfig.mapConfig.pointArrow;
        this.scene = scene;
        this.mapLayers = mapLayers;
        this.cursorController = cursorController;
        this.canInteract = true;

        this.zones = [];
        this.arrows = [];

        this.addInteractiveZones();
        this.addPointingArrows();
    }

    addInteractiveZones() {
        const zones = this.mapLayers;
        if (!zones) return;
        zones.objects.forEach((area) => {
            const zone = this.scene.add
                .zone(area.x, area.y, area.width, area.height)
                .setInteractive()
                .setOrigin(0, 0);

            zone.areaName = area.name;
            this.zones.push(zone);

            zone.on("pointerover", () => {
                this.cursorController.indicator();
            });
            zone.on("pointerout", () => {
                this.cursorController.idle();
            });
        });
    }

    getZones() {
        return this.zones;
    }

    setAllInteractive() {
        this.zones.forEach((zone) => {
            zone.setInteractive();
            zone.arrow.setVisible(true);
            this.scene.tweens.add({
                targets: zone.arrow,
                scale: 1,
                ease: "back.out",
                duration: 300,
            });
        });
    }

    disableAll() {
        this.zones.forEach((zone) => {
            zone.disableInteractive();
            this.scene.tweens.add({
                targets: zone.arrow,
                scale: 0,
                ease: "back.in",
                duration: 200,
                onComplete: () => {
                    zone.arrow.setVisible(false);
                },
            });
        });
    }

    // TODO : show arrow again on interaction complete
    addPointingArrows() {
        this.zones.forEach((zone) => {
            const arrow = this.scene.add
                .image(
                    zone.x + zone.width / 2 + this.config.offsetX,
                    zone.y + this.config.offsetY,
                    this.config.textureKey
                )
                .setOrigin(0.5, 0.5);

            this.scene.tweens.add({
                targets: arrow,
                alpha: 0.5,
                yoyo: true,
                repeat: -1,
                duration: 1000,
            });

            zone.arrow = arrow;
            this.arrows.push(arrow);
        });
    }
}
