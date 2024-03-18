import axios from "axios";
import { UserModel } from "../models/UserModel";

export const takeAction = (action) => {
    return axios({
        method: "POST",
        url: "http://localhost:3000/api/take-action",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        data: {
            action,
            UserID: UserModel.USER_ID,
            PetID: UserModel.PET_ID,
        },
    });
};
