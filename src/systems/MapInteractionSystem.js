import axios from "axios";
import { UserModel } from "../models/UserModel";

export class MapInteractionSystem {
  constructor(scene) {
    this.scene = scene;
    this.zones = [];
  }
  addInteractiveZones() {
    this.scene.map.getObjectLayer("interactive").objects.forEach((area) => {
      const zone = this.scene.add
        .zone(area.x, area.y, area.width, area.height)
        .setInteractive()
        .setOrigin(0, 0);

      this.zones.push(zone);

      zone.on("pointerdown", () => {
        console.log(area);
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
        y: "+=5",
        yoyo: true,
        repeat: -1,
      });
    });
  }
  startInteraction(elementName) {
    switch (elementName) {
      case "fridge":
        this.interactFridge();
    }
  }

  async interactFridge() {
    const inventoryData = await axios({
      method: "POST",
      url: `http://localhost:3000/api/user-items/`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        UserID: UserModel.USER_ID,
      },
    });

    this.scene.scene.launch("Inventory", {
      parentScene: this.scene,
      inventoryData: inventoryData.data,
    });
  }
}
