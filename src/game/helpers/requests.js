import axios from "axios";
import { UserModel } from "../models/UserModel";

// TODO : move all API requests here
const HOST_URL = "https://gamev1.loaf.pet";
const getBaseConfig = (api) => {
    return {
        url: `${HOST_URL}/api/${api}`,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        data: {
            UserID: UserModel.USER_ID,
        },
    };
};
export const takeAction = (action) => {
    return axios({
        method: "POST",
        url: `${HOST_URL}/api/take-action`,
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

export const processDeposit = () => {
    return axios({
        method: "POST",

        ...getBaseConfig("process-deposits"),
    });
};
export const getMyPetData = () => {
    return axios({
        method: "POST",
        url: `${HOST_URL}/api/my-pet`,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        data: {
            UserID: UserModel.USER_ID,
            PetID: UserModel.PET_ID,
        },
    });
};
export const getMyPetsData = () => {
    return axios({
        method: "POST",

        ...getBaseConfig("my-pets"),
    });
};

export const getUserItems = () => {
    return axios({
        method: "POST",

        ...getBaseConfig("user-items"),
    });
};
export const getDailyItems = () => {
    return axios({
        method: "POST",

        ...getBaseConfig("daily-items"),
    });
};
export const refreshItems = () => {
    return axios({
        method: "POST",

        ...getBaseConfig("refresh-items"),
    });
};

export const getLeadersboard = () => {
    return axios({
        method: "POST",

        url: "http://localhost:3000/api/leadersboard",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        data: {
            UserID: UserModel.USER_ID,
            limit: "50",
        },
    });
};

export const buyItem = (itemID) => {
    return axios({
        method: "POST",

        url: `http://localhost:3000/api/buy-item`,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        data: {
            UserID: UserModel.USER_ID,
            ItemID: itemID,
        },
    });
};
