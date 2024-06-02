import React,{ useEffect, useState, useRef } from "react";
import { ProfileSection } from "./profile/profileSection";
import { PetStats } from "./stats/petStats";
import { Inventory } from "./inventory/inventory";
import { Shop } from "./shop/shop";
import { Leaderboard } from "./leaderboard/leaderboard";
import { DownRightButtons } from "./downRightButtons/downRightButtons";
import { MainPetView } from "./profile/mainPetView";
import { MapSelection } from "./location/selectMap";
import { CoinsBuy } from "./coinsBuy/coinsBuy";
import { WorkPopUp } from "./work/WorkPopUp";
import { FlyingValue } from "./flyingValue/flyingValue";
import gsap from 'gsap';
import { BlackOverlay } from "./blackOverlay/blackOverlay";


export const UIView = (props) => {
    const [UIVisible, setUIVisible] = useState("hidden");
    const UIRef = useRef(null);

    useEffect(() => {
        setUIVisible("visible")
        gsap.fromTo(
            UIRef.current,
            { scale: 0 },
            { scale: 1, ease: "back.out", duration: 1 })
    }, []);

    return (
        <div className="UIContainer" style={{ height: props.height, width: props.width, visibility:UIVisible }} ref={UIRef} >
            <ProfileSection></ProfileSection>
            <MainPetView></MainPetView>
            <Inventory></Inventory>
            <Shop></Shop>
            <Leaderboard></Leaderboard>
            <MapSelection></MapSelection>
            <CoinsBuy></CoinsBuy>
            <WorkPopUp></WorkPopUp>
    
            <div id="bottomButtonsSection" className="ui">
                <DownRightButtons></DownRightButtons>
            </div>
        <FlyingValue></FlyingValue>
        <BlackOverlay></BlackOverlay>
        </div>)
};
