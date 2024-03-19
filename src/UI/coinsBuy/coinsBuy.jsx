import { statsConstant } from "../../sharedConstants/stats";
import { Stat } from "../stats/stat";
import { Button } from "../buttons/button";
import { createSignal } from "react-use-signals";
import { hideOverlay, showOverlay } from "../blackOverlay/blackOverlay";
import { useRef, useState } from "react";
export const visibilitySignal = createSignal("hidden");

export const openCoinsBuy = () => {

        visibilitySignal.value = "visible"
        showOverlay()
  };
  export const closeCoinsBuy = () => {
    visibilitySignal.value = "hidden"
    hideOverlay()
  
        
  };


export const CoinsBuy = () => {
    const changeVisiblity = visibilitySignal.useStateAdapter()
    const [getValue, setGetValue] = useState(0)
    const input = useRef()
    const updateGetValue = () => {
        setGetValue((Number(input.current.value)*5).toFixed(2))
    }
    const balance = 1373
    return (
        <>
        
            <div className={"popup ui center"}  style={{visibility:changeVisiblity.value}}>
            <img style={{transform:"scale(1.5)"}} src="./assets/ui/linkPet/linkPetBoard.png"></img>
        
               
          
               <div className={"coinBuyMainContainer"}>
                <span>Swap</span>
                <span>Available {balance} USDT</span>
                   <img
                       className={""}
                       src="./assets/ui/linkPet/nameInput.png"
                   ></img>
                       <input  min={5} max={balance} type="number"  id="swapAmount" placeholder={"0.00"} ref={input} onChange={updateGetValue}/>
               </div>
               <div className={"youGetContainer"}>
               <span>You get</span>
               <img
                       className={""}
                       src="./assets/ui/linkPet/nameInput.png"
                   ></img>
                   <span className={"getAmount"}>{getValue}( )</span>
               </div>
        
               <Button
          
                   className={"nameSubmitButton"}
                   buttonIcon={"submitButton"}
                   text={"Swap!"}
               />
        
            </div>
        </>
    );
};
