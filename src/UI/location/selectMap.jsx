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
    EventBus.emit("changeMap", { map });
    closeMapSelection();
    hideOverlay();
};

export const MapSelection = () => {
    const changeVisiblity = visibilitySignal.useStateAdapter();
    const [profileVisible, setProfileVisible] = useState("hidden");
    const mapsRef = useRef(null);
    const [firstTime, setFirstTime] = useState(true);


    useEffect(() => {
        if(firstTime) {
            setFirstTime(false)
            return
        }
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
            { scale: 0 , x: '+=300', y: '+=300'},
            { scale: 1, x: '-=300', y: '-=300', ease: "back.out", duration: 0.6 })
    }
    
    const closeTween =  () => {
         gsap.fromTo(
            mapsRef.current,
            { scale: 1 },
            { scale: 0, x: '+=300', y: '+=300', ease: "back.in", duration: 0.3, onComplete: ()=> {
                setProfileVisible("hidden")
                gsap.fromTo(
                    mapsRef.current,
                    { scale: 0 },
                    { scale: 0,  x: '-=300', y: '-=300', duration: 0 })
            } })
    }


    return (
        <div className="locationSelection ui popup center" style={{visibility: profileVisible, display: "flex",flexDirection: "column",}}>
            {/* <Button  className="inventoryCloseButton" buttonIcon="closeButton" ></Button> */}
            <div className="shop-wrapper"  ref={mapsRef}>
                {MAPS_ORDER.map((map) => (
                    <div> <Button onClick={() => selectMap(map)}
                            // style={{ transform: "scale(0.4)" }}
                            className={"mapSelectButton"} buttonIcon={map + "Icon"} ext={"png"} children={<img src={HOST+"assets/ui/mapFrame.png"} style={{position:"absolute",top:"-1px",left:"-3px"}}></img>}></Button>
                    </div>
                ))}
                <Button onClick={closeMapSelection} className="inventoryCloseButton" buttonIcon="closeButton"></Button>
            </div>
        </div>
    );
};
