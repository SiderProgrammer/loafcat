import { useEffect, useState } from "react";
import { statsConstant } from "../../sharedConstants/stats";
import { Button } from "../buttons/button";
import { hideOverlay, showOverlay } from "../blackOverlay/blackOverlay";
import { Stat } from "./stat";
import { createSignal } from "react-use-signals";
import axios from "axios";
import { UserModel } from "../../game/models/UserModel";
import { PetView } from "./petView";
import { getMyPetData } from "../../game/helpers/requests";
export const visibilitySignal = createSignal("hidden");

export const openPetStats = () => {
    visibilitySignal.value = "visible";
    showOverlay();
};
export const closePetStats = () => {
    visibilitySignal.value = "hidden";
    hideOverlay();
};
export const PetStats = () => {
// TODO : remove it?
    const changeVisiblity = visibilitySignal.useStateAdapter();
    const [petData, setPetData] = useState([]);
    const fetchData = async () =>{
        if (visibilitySignal.value === "visible") {
            const petData = await getMyPetData()

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
                onClick={closePetStats}
                className="inventoryCloseButton"
                buttonIcon="closeButton"
            ></Button>
            <PetView petData={petData}></PetView>
        </div>
    );
};
