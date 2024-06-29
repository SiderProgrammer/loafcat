import React,{ useEffect, useState, useRef } from "react";
import { ProfileSection } from "./profile/profileSection";
import { PetStats } from "./stats/petStats";
import { Inventory } from "./inventory/inventory";
import { createSignal } from "react-use-signals";
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
// import { LoadingScreen } from "./loadingScreen/loadingScreen";

export const bottomButtonsInteractiveSignal = createSignal("all");

export const handleBottomButtonsInteractive = (value) => {
    bottomButtonsInteractiveSignal.value = value ? "all" : "none";
};

export const UIView = (props) => {
    const changeVisiblity = bottomButtonsInteractiveSignal.useStateAdapter();
    const [UIVisible, setUIVisible] = useState("hidden");
    const [bottomButtonsInteractive, setBottomButtonsInteractive] = useState("all");
    const UIRef = useRef(null);

    useEffect(() => {
        setBottomButtonsInteractive( bottomButtonsInteractiveSignal.value )
    }, [bottomButtonsInteractiveSignal.value]);

    useEffect(() => {
        setUIVisible("visible")
        openTween()
    }, []);

    const openTween = () => {
        gsap.fromTo(
            UIRef.current,
            { scale: 0 },
            { scale: 1, ease: "back.out", duration: 1, delay: 0.3 })
    }

    return (
        <div className="UIContainer" style={{ height: props.height, width: props.width, visibility:UIVisible}} ref={UIRef} >
            <ProfileSection></ProfileSection>
            <MainPetView></MainPetView>
            <Inventory></Inventory>
            <Shop></Shop>
            <Leaderboard></Leaderboard>
            <MapSelection></MapSelection>
            <CoinsBuy></CoinsBuy>
            <WorkPopUp></WorkPopUp>
            <div id="bottomButtonsSection" className="ui" style={{ pointerEvents: bottomButtonsInteractive}} >
                <DownRightButtons></DownRightButtons>
            </div>
            <FlyingValue></FlyingValue>
            <BlackOverlay></BlackOverlay>
        </div>)
};