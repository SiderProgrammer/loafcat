import { createSignal } from "react-use-signals";
import { useEffect, useState, useRef } from "react";
import { hideOverlay, showOverlay } from "../blackOverlay/blackOverlay";
import { Button } from "../buttons/button";
import { EventBus } from "../../game/EventBus";
import { MAPS_ORDER } from "../../game/constants/houseRooms";
import { HOST } from "../../sharedConstants/constants";
import gsap from 'gsap';

export const visibilitySignal = createSignal("hidden");
export const openMapSelection = async () => {
    visibilitySignal.value = "visible";
    showOverlay();
};
export const closeMapSelection = () => {
    visibilitySignal.value = "hidden";
    hideOverlay();
};
const selectMap = (map) => {
    EventBus.emit("changeMap", { map, restarted: true });
    closeMapSelection();
    hideOverlay();
};

export const MapSelection = () => {
    const changeVisiblity = visibilitySignal.useStateAdapter();
    const [profileVisible, setProfileVisible] = useState("hidden");
    const mapsRef = useRef(null);

    useEffect(() => {

        if(visibilitySignal.value === "visible") {
            setProfileVisible("visible")
            openTween()
        } else {
            closeTween()
        }

    }, [visibilitySignal.value]);


    const openTween = () => {
        gsap.fromTo(
            mapsRef.current,
            { scale: 0},
            { scale: 1, ease: "back.out", duration: 0.6 })
    }
    
    const closeTween =  () => {
         gsap.fromTo(
            mapsRef.current,
            { scale: 1 },
            { scale: 0, ease: "back.in", duration: 0.3, onComplete: ()=> {
                setProfileVisible("hidden")
                gsap.fromTo(
                    mapsRef.current,
                    { scale: 0 },
                    { scale: 0, duration: 0 })
            } })
    }

    return (
        <div className="locationSelection ui popup center" style={{visibility: profileVisible, display: "flex",flexDirection: "column",}}>
            {/* <Button  className="inventoryCloseButton" buttonIcon="closeButton" ></Button> */}
            <div className="dup"  ref={mapsRef}>
                <img className= "background-image" src="/assets/ui/leaderboard/Leaderboard.png" ></img>
                <Button onClick={closeMapSelection} className="inventoryCloseButton" buttonIcon="closeButton"></Button>
                <div className="maps-container"  >
                    <div className="maps-wrapper">
                        {MAPS_ORDER.map((map, index) => (
                                <Button key ={index} onClick={() => selectMap(map)} className={"mapSelectButton"} buttonIcon={map + "Icon"} ext={"png"} ></Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};