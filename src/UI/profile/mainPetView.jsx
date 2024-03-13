import { useEffect, useState } from "react";
import { statsConstant } from "../../sharedConstants/stats";
import { Button } from "../buttons/button";
import { hideOverlay, showOverlay } from "../blackOverlay/blackOverlay";

import { createSignal } from "react-use-signals";
import axios from "axios";
import { UserModel } from "../../game/models/UserModel";
import { PetView } from "../stats/petView";
import { MainPetContent } from "./mainPetContent";

export const visibilitySignal = createSignal("hidden");

export const openMainPetView = () => {
    visibilitySignal.value = "visible";
    showOverlay();
};
export const closeMainPetView = () => {
    visibilitySignal.value = "hidden";
    hideOverlay();
};
export const MainPetView = () => {

    const changeVisiblity = visibilitySignal.useStateAdapter();
    const [petData, setPetData] = useState([]);
    const fetchData = async () =>{
        if (visibilitySignal.value === "visible") {
            const petData = await axios({
                method: "POST",
                url: "http://localhost:3000/api/my-pet",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                data: {
                    UserID: UserModel.USER_ID,
                    PetID: UserModel.PET_ID,
                },
            });

            //TODO : pet data shouldn't be updated here
            UserModel.PET_DATA = petData.data.pet
            setPetData(petData.data.pet)
         
        }
    }
    useEffect( () => {
 
        fetchData()
        
        return () => {};
    }, [visibilitySignal.value]);
    

   
    return (
        <div
            className="petStats popup ui center"
            style={{ visibility: changeVisiblity.value }}
        >
            <Button
                onClick={closeMainPetView}
                className="inventoryCloseButton"
                buttonIcon="closeButton"
            ></Button>
            <MainPetContent petData={petData}></MainPetContent>
        </div>
    );
};
