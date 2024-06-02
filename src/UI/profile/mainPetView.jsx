import { useEffect, useState, useRef } from "react";
import { statsConstant } from "../../sharedConstants/stats";
import { Button } from "../buttons/button";
import { hideOverlay, showOverlay } from "../blackOverlay/blackOverlay";
import { createSignal } from "react-use-signals";
import axios from "axios";
import { UserModel } from "../../game/models/UserModel";
import { PetView } from "../stats/petView";
import { MainPetContent } from "./mainPetContent";
import { PetModel } from "../../game/models/PetModel";
import gsap from 'gsap';

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
    const [profileVisible, setProfileVisible] = useState("hidden");
    const profileRef = useRef(null);

    useEffect(  () => {
        setPetData(PetModel.PET_DATA)

        if(visibilitySignal.value === "visible") {
            setProfileVisible("visible")
            openTween()
        } else {
            closeTween()
        }
        // return () => {};
    }, [visibilitySignal.value]);
    

    const openTween = () => {
        gsap.fromTo(
            profileRef.current,
            { scale: 0},
            { scale: 1, ease: "back.out", duration: 0.6 })
    }

    const closeTween =  () => {
         gsap.fromTo(
            profileRef.current,
            { scale: 1 },
            { scale: 0, ease: "back.in", duration: 0.3, onComplete: ()=> {
                setProfileVisible("hidden")
            } })
    }

    return (
        <div className="petStats popup ui center" style={{ visibility: profileVisible}}>
             <div className="profile-wrapper"  ref={profileRef}>
                <Button onClick={closeMainPetView} className="inventoryCloseButton" buttonIcon="closeButton"></Button>
                <MainPetContent petData={petData}></MainPetContent>
            </div>
        </div>
    );
};
