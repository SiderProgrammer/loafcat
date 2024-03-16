import { useEffect, useState } from "react";
import { statsConstant } from "../../sharedConstants/stats";
import { Button } from "../buttons/button";
import { hideOverlay, showOverlay } from "../blackOverlay/blackOverlay";

import { createSignal } from "react-use-signals";
import axios from "axios";
import { UserModel } from "../../game/models/UserModel";
import { PetView } from "../stats/petView";
import { MainPetContent } from "./mainPetContent";
import { PetModel } from "../../game/models/PetModel";

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

    useEffect( () => {
        setPetData(PetModel.PET_DATA)

        
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
