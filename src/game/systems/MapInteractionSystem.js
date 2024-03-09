import axios from "axios";
import { UserModel } from "../models/UserModel";
import { openInventory } from "../../UI/inventory/inventory";

export class MapInteractionSystem {
    constructor(scene) {
        this.scene = scene;
        this.canInteract = true;
        this.zones = [];
    }
    addInteractiveZones() {
        const zones = this.scene.map.getObjectLayer("interactive");
        if (!zones) return;
        zones.objects.forEach((area) => {
            const zone = this.scene.add
                .zone(area.x, area.y, area.width, area.height)
                .setInteractive()
                .setOrigin(0, 0);

            this.zones.push(zone);

            zone.on("pointerdown", () => {
                console.log(area);
                zone.arrow.destroy();
                this.startInteraction(area.name);
            });
        });
    }
    addPointingArrows() {
        this.zones.forEach((zone) => {
            const arrow = this.scene.add.image(
                zone.x + zone.width / 2,
                zone.y - 15,
                "arrow"
            );
            this.scene.tweens.add({
                targets: arrow,
                alpha: 0.5,
                yoyo: true,
                repeat: -1,
                duration: 1000,
            });

            zone.arrow = arrow;
        });
    }
    startInteraction(elementName) {
        if (!this.canInteract) return;
        //this.canInteract = false;
        switch (elementName) {
            case "fridge":
                this.interactFridge();
                break;
            case "bath":
                this.interactBath();
                break;
            case "toilet":
                this.interactToilet();
                break;
            case "sink":
                this.interactSink();
                break;
        }
    }

    async interactFridge() {
        openInventory(true);
    }

    interactBath() {
        this.scene.setState("bath");
    }

    interactToilet() {
        this.scene.setState("toilet");
    }

    interactSink() {
        this.scene.setState("sink");
    }
}
