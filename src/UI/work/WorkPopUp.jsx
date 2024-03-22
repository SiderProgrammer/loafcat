import { statsConstant } from "../../sharedConstants/stats";
import { Stat } from "../stats/stat";
import { Button } from "../buttons/button";
import { createSignal } from "react-use-signals";
import { hideOverlay, showOverlay } from "../blackOverlay/blackOverlay";
import React, { useRef, useState } from "react";
import { RangeSlider } from "../common/rangeSlider.jsx/rangeSlider";
export const visibilitySignal = createSignal("hidden");

export const openCoinsBuy = () => {

        visibilitySignal.value = "visible"
        showOverlay()
  };
  export const closeCoinsBuy = () => {
    visibilitySignal.value = "hidden"
    hideOverlay()
  
        
  };


export const WorkPopUp = () => {
    const changeVisiblity = visibilitySignal.useStateAdapter()
    visibilitySignal.value = "visible"


    const [value, setValue] = React.useState({ min: 0, max: 100 });

    return (
        <>
        
            <div className={"popup ui center"}  style={{visibility:changeVisiblity.value}}>
            <img style={{transform:"scale(1.5)"}} src="./assets/ui/linkPet/linkPetBoard.png"></img>
        
               
          
               <div className={"coinBuyMainContainer"}>
             
                <span>Set working hours</span>
                   <img
                       className={""}
                       src="./assets/ui/valueHolder.png"
                   ></img>
                        <RangeSlider min={0} max={100} step={5} value={value} onChange={setValue} />
    </div>
                       {/* <input  min={5} max={balance} type="number"  id="swapAmount" placeholder={"0.00"} ref={input} onChange={updateGetValue}/>
           
               <div className={"youGetContainer"}>
               <span>You get</span>
               <img
                       className={""}
                       src="./assets/ui/valueHolder.png"
                   ></img>
                   <span className={"getAmount"}>{getValue}( )</span>
               </div> */}
    
               <Button
          
                   className={"nameSubmitButton"}
                   buttonIcon={"submitButton"}
                   text={"Start work"}
               />
        
            </div>
        </>
    );
};
