import { PetModel } from "../models/PetModel";
import { StatsSystem } from "./StatsSystem";

export class AlertSystem {
    constructor() {}
    updateAlerts() {
        this.hideAlerts(StatsSystem.getAllStats());

        document.querySelector("#alertIcon").style.animation = "";
        document.querySelector("#alertIcon").style.visibility = "hidden";

        if (StatsSystem.getLowStats().length > 0) {
            this.showAlerts(StatsSystem.getLowStats());
        }
    }
    hideAlerts(stats) {
        // stats.forEach((stat) => {
        //     document.querySelector(stat).children[1].style.animation = "";
        //     document.querySelector(stat).children[1].style.display = "none";
        // });
    }
    showAlerts(alertStats) {
        document.querySelector("#alertIcon").style.animation =
            "pulse 2s infinite";
        document.querySelector("#alertIcon").style.visibility = "visible";

        // alertStats.forEach((stat) => {
        //   document.querySelector(stat).children[1].style.animation =
        //     "pulse 2s infinite";
        //   document.querySelector(stat).children[1].style.display = "block";
        // });
    }
}
