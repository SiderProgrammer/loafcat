import { statsConstant } from "../../sharedConstants/stats";
import { Stat } from "../stats/stat";
import { Button } from "../buttons/button";
import { createSignal } from "react-use-signals";
import { hideOverlay, showOverlay } from "../blackOverlay/blackOverlay";
import { useRef, useState, useEffect } from "react";
import {
    Connection,
    PublicKey,
    SystemProgram,
    Transaction,
} from "@solana/web3.js";
import { GameModel } from "../../game/models/GameModel";
import * as buffer from "buffer";
import { processDeposit } from "../../game/helpers/requests";
import { HOST } from "../../sharedConstants/constants";
import gsap from 'gsap';

window.Buffer = buffer.Buffer;

export const visibilitySignal = createSignal("hidden");

export const openCoinsBuy = () => {
    visibilitySignal.value = "visible";
    showOverlay();
};
export const closeCoinsBuy = () => {
    visibilitySignal.value = "hidden";
    hideOverlay();
};

export const CoinsBuy = () => {
    const changeVisiblity = visibilitySignal.useStateAdapter();
    const [getValue, setGetValue] = useState(0);
    const [buyCoinsVisible, setBuyCoinsVisible] = useState("hidden");
    const [inputValue, setInputValue] = useState("0.00");
    const input = useRef();
    const coinsBuyRef = useRef(null);
    const updateGetValue = () => {
        setGetValue((Number(input.current.value) * 5).toFixed(2));
    };
    const balance = 1373;

    const onSwap = async () => {
        // TODO : add process-deposit API call && integrate dynamic sol send amount changing via input
        try {
            if (!GameModel.solanaConnection) {
                throw new Error("There is no solana connection!!!");
            }
            const publicKey = await window.solana.publicKey;

            console.log("User public key:", publicKey.toString());

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: "Gj5jeHJnpS5AQdGDdGb1CF7g3YtTWN5VJBWYKLLCWBrC",
                    lamports: 0.005 * 1000000000,
                })
            );
            let blockhash = (
                await GameModel.solanaConnection.getLatestBlockhash("finalized")
            ).blockhash;
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = publicKey;
            // Sign the transaction
            const signedTransaction = await window.solana.signTransaction(
                transaction
            );

            // Broadcast the transaction to the Solana network
            const signature =
                await GameModel.solanaConnection.sendRawTransaction(
                    signedTransaction.serialize()
                );

            setTimeout(()=>processDeposit(),5000);

            console.log("Transaction sent:", signature);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect( () => {
        updateGetValue()
      if(visibilitySignal.value === "visible") {
        setBuyCoinsVisible("visible")
          openTween()
      } else {
          closeTween()
      }
    }, [visibilitySignal.value]);


    const openTween = () => {
        gsap.fromTo(
            coinsBuyRef.current,
            { scale: 0},
            { scale: 1, ease: "back.out", duration: 0.6 })
    }

    const closeTween =  () => {
         gsap.fromTo(
            coinsBuyRef.current,
            { scale: 1 },
            { scale: 0, ease: "back.in", duration: 0.3, onComplete: ()=> {
                setBuyCoinsVisible("hidden")
                setInputValue("0.00")
            } })
    }

    return (
        <div className={"coins-buy-container"} style={{ visibility: buyCoinsVisible }}>
            <div className="coins-buy-wrapper"  ref={coinsBuyRef} >
                <div className={"popup ui center"} >
                    <Button onClick={closeCoinsBuy} className="coinsBuyCloseButton" buttonIcon="closeButton" ></Button>
                    <img style={{ transform: "scale(1.5)" }} src={HOST+"assets/ui/linkPet/linkPetBoard.png"}></img>
                    <div className={"coinBuyMainContainer"}>
                        <span>Swap</span>
                        <span>Available {balance} USDT</span>
                        <img className={""} src={HOST+"assets/ui/valueHolder.png"}></img>
                        <input min={5} max={balance} type="number"id="swapAmount"placeholder={inputValue} ref={input}onChange={updateGetValue}/>
                    </div>
                    <div className={"youGetContainer"}>
                        <span>You get</span>
                        <img className={""} src={HOST+"assets/ui/valueHolder.png"}></img>
                        <span className={"getAmount"}>{getValue}</span>
                    </div>
                    <Button onClick={onSwap} className={"nameSubmitButton"} buttonIcon={"submitButton"} text={"Swap!"}/>
                </div>
            </div>
        </div>
    );
};
