import { statsConstant } from "../../sharedConstants/stats";
import { Stat } from "../stats/stat";
import { Button } from "../buttons/button";
import { createSignal } from "react-use-signals";
import { hideOverlay, showOverlay } from "../blackOverlay/blackOverlay";
import { useRef, useState } from "react";
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
    const input = useRef();
    const updateGetValue = () => {
        setGetValue((Number(input.current.value) * 5).toFixed(2));
    };

    const onSwap = async () => {
        // TODO : add process-deposit API call && integrate dynamic sol send amount changing via input
        try {
            if (!GameModel.solanaConnection) {
                throw new Error("There is no solana connection!");
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
    const balance = 1373;
    return (
        <>
            <div
                className={"popup ui center"}
                style={{ visibility: changeVisiblity.value }}
            >
                <img
                    style={{ transform: "scale(1.5)" }}
                    src={HOST+"assets/ui/linkPet/linkPetBoard.png"}
                ></img>

                <div className={"coinBuyMainContainer"}>
                    <span>Swap</span>
                    <span>Available {balance} USDT</span>
                    <img className={""} src={HOST+"assets/ui/valueHolder.png"}></img>
                    <input
                        min={5}
                        max={balance}
                        type="number"
                        id="swapAmount"
                        placeholder={"0.00"}
                        ref={input}
                        onChange={updateGetValue}
                    />
                </div>
                <div className={"youGetContainer"}>
                    <span>You get</span>
                    <img className={""} src={HOST+"assets/ui/valueHolder.png"}></img>
                    <span className={"getAmount"}>{getValue}( )</span>
                </div>

                <Button
                    onClick={onSwap}
                    className={"nameSubmitButton"}
                    buttonIcon={"submitButton"}
                    text={"Swap!"}
                />
            </div>
        </>
    );
};
