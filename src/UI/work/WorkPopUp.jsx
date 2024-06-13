import { statsConstant } from "../../sharedConstants/stats";
import { Stat } from "../stats/stat";
import { Button } from "../buttons/button";
import { createSignal } from "react-use-signals";
import { hideOverlay, showOverlay } from "../blackOverlay/blackOverlay";
import React, { useRef, useState, useEffect } from "react";
import { RangeSlider } from "../common/rangeSlider.jsx/rangeSlider";
import { EventBus } from "../../game/EventBus";
import { HOST } from "../../sharedConstants/constants";
export const visibilitySignal = createSignal("hidden");
import { Timestamp } from "../../UI/shop/timestamp/Timestamp";
import "./CSS/WorkPopUp.css";
import gsap from 'gsap';

export const openWorkPopUp = () => {
    visibilitySignal.value = "visible";
    showOverlay();
};
export const closeWorkPopUp = () => {
    visibilitySignal.value = "hidden";
    hideOverlay();
};

export const WorkPopUp = () => {
    const changeVisiblity = visibilitySignal.useStateAdapter();
    const [numberOfHours, setNumberOfHours] = useState({ min: 1, max: 10 });
    const [isWorking, setIsWorking] = useState(false);
    const [workPopupVisible, setWorkPopupVisible] = useState("hidden");
    const [isWorkingFinished, setIsWorkingFinished] = useState(false);
    const [coinsToEarn, setCoinsToEarn] = useState(null);
    const workPopupRef = useRef(null);

    const startWork = () => {
        setIsWorking(true);
        EventBus.emit("startWork");
    };
    const stopWork = () => {
        setIsWorking(false);
        EventBus.emit("stopWork");
        // closeWorkPopUp();
    };

    const restartWork = () => {
        setIsWorkingFinished(false)
        setIsWorking(false);
    }

    const finishWork = () => {
        setIsWorkingFinished(true)
        setIsWorking(false);
        EventBus.emit("stopWork");
        console.log("Work finished")
    }

    useEffect( () => {
        if(visibilitySignal.value === "visible") {
          setWorkPopupVisible("visible")
            openTween()
        } else {
            closeTween()
        }
      }, [visibilitySignal.value]);

    useEffect( () => {
        setCoinsToEarn(numberOfHours.min * 2)
    }, [numberOfHours]);

    const openTween = () => {
        gsap.fromTo(
            workPopupRef.current,
            { scale: 0},
            { scale: 1, ease: "back.out", duration: 0.6 })
    }

    const closeTween =  () => {
         gsap.fromTo(
            workPopupRef.current,
            { scale: 1 },
            { scale: 0, ease: "back.in", duration: 0.3, onComplete: ()=> {
                setWorkPopupVisible("hidden")
                EventBus.emit("handleMapInteraction", true);
            } })
    }


    return (
        <div className={"work-popup popup ui center"} style={{ visibility: workPopupVisible }}>
            <div className="work-popup-wrapper"  ref={workPopupRef} >
                <Button onClick={closeWorkPopUp} className="workPopupCloseButton" buttonIcon="closeButton" ></Button>
                <img style={{ transform: "scale(1.5)" }} src={HOST+"assets/ui/linkPet/linkPetBoard.png"}></img>
                <div className={"coinBuyMainContainer"}>
                {isWorking && 
                    <div style={{ letterSpacing: "-1px", lineHeight:"8px"}}>
                        <div style={{ marginTop: "3px", transform: "scale(1.1)" }}>Your pet is currently busy in work!</div>
                        <div style={{ marginTop: "17px" }}>Your exemplary alertness will be rewarded but only after completing your duty.</div>
                        <img className="coffee-icon" src= {HOST+ "assets/coffee_cup_icon.png"}  alt="Loading_icon" />
                        <div style={{ marginTop: "66px", textAlign: "center",  transform: "scale(1.4)"}}> <Timestamp timeStart = {numberOfHours.min * 60 * 60 * 1000} callback = {finishWork}/></div>
                        {/* <div style={{ marginTop: "66px", textAlign: "center",  transform: "scale(1.4)"}}> <Timestamp timeStart = { 2 * 1000} callback = {finishWork}/></div> */}
                        <div style={{ marginTop: "2px", textAlign: "center"}}> hours left</div>
                     </div>
                } 
                {!isWorking && !isWorkingFinished && 
                    <>
                        <span style={{ textAlign: "center", transform: "scale(1.3)", marginBottom: "15px"}}>Office work</span>
                        <span style={{ lineHeight:"8px"}}> Working in an office is demanding and commendable. Work to get paid and don't upset your boss!</span>
                        <RangeSlider min={1} max={10} step={1} value={numberOfHours} onChange={setNumberOfHours}/>
                        <span style={{ marginTop: "10px", letterSpacing: "-1px",}}> Work for <span style={{ fontWeight: 'bold' }}>{numberOfHours.min}</span> {numberOfHours.min > 1 ? "hours" : "hour"}.</span>
                        <span style={{ marginTop: "0px", letterSpacing: "-1px",}}> You will earn <span style={{ fontWeight: 'bold' }}>{coinsToEarn}</span> coins. </span>
                    </>
                }
                  {isWorkingFinished &&
                     <div className="work-finish-label">
                        <span style={{ textAlign: "center", transform: "scale(1.3)", marginTop: "4px"}}>Work finished!</span>
                        <span style={{ marginTop: "14px", lineHeight:"1.5"}}>You managed to finish your job without any disturbance.</span>
                        <span style={{ marginTop: "10px", textAlign: "center"}}>Here's your reward:</span>
                        <span style={{marginTop: "1px", textAlign: "center"}}><span style={{ fontWeight: 'bold' }}>{coinsToEarn}</span> coins.</span>
                        <img className="coin-icon" src= {HOST+ "assets/coin.png"}  alt="Loading_icon" />
                    </div>
                }
                </div>
                {isWorking && <Button onClick={stopWork} className={"nameSubmitButton"} buttonIcon={"submitButton"} text={"Stop working"}/>}
                {!isWorking && !isWorkingFinished && <Button onClick={startWork} className={"nameSubmitButton"} buttonIcon={"submitButton"} text={"Start work"}/>}
                {isWorkingFinished && <Button onClick={restartWork} className={"nameSubmitButton"} buttonIcon={"submitButton"} text={"Ok"}/>}
            </div>
        </div>
    );
};