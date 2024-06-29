import { MapInteractionSystem } from "./systems/MapInteractionSystem";
import { MAPS_ORDER } from "./constants/houseRooms";
import { linkTilemaps } from "./helpers/linkTilemaps";
import { addAmbientAnimations } from "./helpers/addAmbientAnimations";
import gameConfig from "./config/index";

export default class Map {
    constructor(scene, key) {
        this.config = gameConfig.mapConfig;
        this.scene = scene;
        this.mapKey = key;
        this.tile = this.createTile();
        addAmbientAnimations(this.scene, this.mapKey);
        this.interactionSystem = new MapInteractionSystem(
            this.scene,
            this.tile.getObjectLayer("interactive")
        );
    }

    createTile() {
        const map = this.scene.make.tilemap({ key: this.mapKey });
        linkTilemaps(map, this.mapKey);
        //if (!houseRoomsPlacement[this.mapKey]) return;
        // change name to: roomAbove
        const mapIndex = MAPS_ORDER.indexOf(this.mapKey);
        if (mapIndex !== 0) {
            if (mapIndex !== -1) {
                this.nextFloor = this.scene.make.tilemap({
                    key: MAPS_ORDER[mapIndex + 1],
                });
                linkTilemaps(this.nextFloor, MAPS_ORDER[mapIndex + 1], true);
            }

            let roomBelow = MAPS_ORDER[mapIndex - 1];
            if (roomBelow !== "streetMap") {
                if (roomBelow) {
                    this.roomBelow = this.scene.make.tilemap({
                        key: roomBelow,
                    });

                    linkTilemaps(this.roomBelow, roomBelow, false, true);
                    this.scene.add
                        .image(
                            this.config.downOverlay.x,
                            this.config.downOverlay.y,
                            this.config.downOverlay.textureKey
                        )
                        .setOrigin(0, 0);
                }
            }
        }
        return map;
    }

    interaction(value) {
        value
            ? this.interactionSystem.setAllInteractive()
            : this.interactionSystem.disableAll();
    }

    get interactionZones() {
        return this.interactionSystem.getZones();
    }

    getLayer(key) {
        return this.tile.getLayer(key);
    }
}
