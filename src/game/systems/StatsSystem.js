import { PetModel } from "../models/PetModel";

export class StatsSystem {
    static getAllStats() {
        return ["#hunger", "#health", "#happines"];
    }

    static getLowStats() {
        const stats = [];

        if (PetModel.PET_DATA.HungerLevel <= 50) {
            stats.push("#hunger");
        }

        return stats;
    }

    get lowStats() {
        return StatsSystem.getLowStats();
    }

    get lowStats() {
        return StatsSystem.getLowStats();
    }
}
