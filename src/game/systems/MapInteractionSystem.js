import axios from "axios";
import { UserModel } from "../models/UserModel";
import { openInventory } from "../../UI/inventory/inventory";
import { openShop } from "../../UI/shop/shop";
import { openWorkPopUp } from "../../UI/work/WorkPopUp";
import { HOST } from "../../sharedConstants/constants";

export class MapInteractionSystem {
    constructor(scene) {
        this.scene = scene;
        this.canInteract = true;
        this.zones = [];
        this.arrows = [];
        this.cursorUrl = `${HOST}assets/pointerPoint.png`;
    }
    addInteractiveZones() {
        const zones = this.scene.map.getObjectLayer("interactive");
        if (!zones) return;
        zones.objects.forEach((area) => {
            const zone = this.scene.add
                .zone(area.x, area.y, area.width, area.height)
                .setInteractive({
                    cursor: `url(${this.cursorUrl}), pointer`,
                })
                .setOrigin(0, 0);

            this.zones.push(zone);

            zone.on("pointerdown", () => {
                // TODO : also should block some of UI
                this.scene.input.setDefaultCursor(
                    `url("${HOST}assets/pointer.png"), pointer`
                );
                this.disableAll();

                this.startInteraction(area.name);
            });
        });
    }

    setAllInteractive() {
        this.zones.forEach((zone) => {
            zone.setInteractive({
                cursor: `url(${this.cursorUrl}), pointer`,
            });
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
            this.arrows.push(arrow);
        });
    }
    startInteraction(elementName) {
        //   if (!this.canInteract) return;

        //this.canInteract = false;
        switch (elementName) {
            case "shop":
                openShop();
                break;
            case "fridge":
                openInventory(true);
                break;
            case "bath":
                this.scene.setState("bath");
                break;
            case "toilet":
                this.scene.setState("toilet");
                break;
            case "sink":
                this.scene.setState("sink");
                break;
            case "tv":
                this.scene.setState("TV");
                break;
            case "smoke":
                this.scene.setState("smoke");
                break;
            case "bed":
                this.scene.setState("bed");
                break;
            case "work":
                openWorkPopUp();
                break;
        }
    }
}
