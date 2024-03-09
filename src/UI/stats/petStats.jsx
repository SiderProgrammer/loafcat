import { useEffect, useState } from "react";
import { statsConstant } from "../../sharedConstants/stats";
import { Button } from "../buttons/button";
import { hideOverlay, showOverlay } from "../blackOverlay/blackOverlay";
import { Stat } from "./stat";
import { createSignal } from "react-use-signals";
import axios from "axios";
import { UserModel } from "../../game/models/UserModel";
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
                onClick={closePetStats}
                className="inventoryCloseButton"
                buttonIcon="closeButton"
            ></Button>
            <img src="./assets/ui/petStats/statsFrame.png"></img>
            <div>
                <div className="statsAvatar">
                    <img src="./assets/ui/petStats/statsProfile.png"></img>
                    <img className="statsAvatarImage" src="./assets/nftAvatar.jpg"></img>
                </div>
                <div className="statsView">
                    <img src="./assets/ui/petStats/statsBoard.png"></img>
                    {/* TODO: Health stat should be bigger and only 1 in line && low stats should have red fill*/}
                    <div className="stats">
                        {statsConstant.map(stat => (
                         <Stat fill={petData[stat.valueKey]} className="petViewStats" icon={stat.icon}></Stat>
                        ))}
              
              
                    </div>
                </div>
            </div>
        </div>
    );
};
