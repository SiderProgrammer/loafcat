import axios from "axios";
import { UserModel } from "../models/UserModel";

// TODO : move all API requests here
const HOST_URL = "https://gamev1.loaf.pet";
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
        url: `${HOST_URL}api/process-deposits`,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        data: {
            UserID: UserModel.USER_ID,
        },
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
        url: `${HOST_URL}/api/my-pets`,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        data: {
            UserID: UserModel.USER_ID,
        },
    });
};

export const getUserItems = () => {
    return axios({
        method: "POST",
        url: `${HOST_URL}/api/user-items/`,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        data: {
            UserID: UserModel.USER_ID,
        },
    });
};
