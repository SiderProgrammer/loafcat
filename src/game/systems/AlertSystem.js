import { PetModel } from "../models/PetModel";

export class AlertSystem {
    constructor() {}
    updateAlerts() {
        this.hideAlerts(this.getAllStats());

        document.querySelector("#alertIcon").style.animation = "";
        document.querySelector("#alertIcon").style.visibility = "hidden";

        if (this.getLowStats().length > 0) {
            this.showAlerts(this.getLowStats());
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

    getAllStats() {
        return ["#hunger", "#health", "#happines"];
    }

    getLowStats() {
        const stats = [];

        if (this.stats.HungerLevel <= 50) {
            stats.push("#hunger");
        }

        return stats;
    }

    get stats() {
        return PetModel.PET_DATA;
    }
}
