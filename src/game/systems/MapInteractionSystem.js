import axios from "axios";
import { UserModel } from "../models/UserModel";
import { openInventory } from "../../UI/inventory/inventory";
import { openShop } from "../../UI/shop/shop";

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
                .setInteractive({
                    cursor: 'url("./assets/pointerPoint.png"), pointer',
                })
                .setOrigin(0, 0);

            this.zones.push(zone);

            zone.on("pointerdown", () => {
                // TODO : also should block some of UI
                this.disableAll();

                this.startInteraction(area.name);
            });
        });
    }

    setAllInteractive() {
        this.zones.forEach((zone) => {
            zone.setInteractive({
                cursor: 'url("./assets/pointerPoint.png"), pointer',
            });
            zone.arrow.setVisible(true);
        });
    }

    disableAll() {
        this.zones.forEach((zone) => {
            zone.disableInteractive();
            zone.arrow.setVisible(false);
        });
    }

    // TODO : show arrow again on interaction complete
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
        //   if (!this.canInteract) return;

        //this.canInteract = false;
        switch (elementName) {
            case "shop":
                this.interactShop();
                break;
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
            case "tv":
                this.interactTV();
                break;
            case "smoke":
                this.interactSmoke();
                break;
        }
    }

    async interactFridge() {
        openInventory(true);
    }

    interactShop() {
        openShop();
        // this.scene.setState("shopping");
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
    interactTV() {
        this.scene.setState("TV");
    }
    interactSmoke() {
        this.scene.setState("smoke");
    }
}
