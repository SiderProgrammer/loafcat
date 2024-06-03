import { useLayoutEffect, useState, useRef } from "react";
import { Button } from "../UI/buttons/button";
import { UserModel } from "../game/models/UserModel";
import { WalletConnect } from "./walletConnect";
import { LinkPets } from "./linkPets";
import { useNavigate } from "react-router-dom";
import { EventBus } from "../game/EventBus";
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { GameModel } from "../game/models/GameModel";
import { navigatePrefixURL } from "../sharedConstants/constants"
import { showLoadingScreen, hideLoadingScreen } from '../UI/loadingScreen/loadingScreen';
import gsap from 'gsap';

export const PreGameScreen = (props) => {
    const [isWalletConnected, setWalletConnect] = useState(false);
    const [isButtonBlocked, setIsButtonBlocked] = useState(true);
    // const [backgroundOpenTween, setBackgroundOpenTween] = useState(false);
    const preGameScreenRef = useRef(null);
    const walletRef = useRef(null);
    const navigate = useNavigate();

    useLayoutEffect(() => {
        showLoadingScreen()
        const connect = async () => {
            await  gsap.fromTo(
                preGameScreenRef.current,
                { scale: 4 },
                { scale: 1, ease: "back.out", duration: 0.9, onComplete: ()=> {
                    setIsButtonBlocked(false)
                    // gsap.fromTo(
                    //     preGameScreenRef.current,
                    //     { scale: 1.3 },
                    //     { scale: 1, ease: "power1.out", duration: 2})
                } })
         
            await connectWalletClicked();
        };
        connect();
    }, []);

    const connectToWallet = async () => {
        try {
            if (window.solana) {
                window.solana.on("connect", () => {});
                const resp = await window.solana.connect();
                console.log("connected wallet", resp);
                const connection = new Connection('https://multi-blissful-wind.solana-mainnet.quiknode.pro/13fc50b03434c8775643c0ae2d3db06e6162d1ef');
                GameModel.solanaConnection = connection
            }
        } catch (err) {
            // TODO : update the text on connect error
            // { code: 4001, message: 'User rejected the request.' }
        }
    };

    const connectWalletClicked = async () => {
        await connectToWallet();
        if (window.solana && window.solana.publicKey) {
            UserModel.USER_ID = "LofD1qHiLDAnj4q6smfDbHC61Z5rCxhGjosN2NU3vv45"; //window.solana.publicKey.toString();
            setWalletConnect(true);
            setIsButtonBlocked(true)
            // EventBus.emit("startPreloader")
             walletRef.current.closeTween()
            await closeBackgroundTween()
            navigate(navigatePrefixURL+"/game/");
        }
    };

    const closeBackgroundTween = async ()=>{
        // backgroundOpenTween.pause()

       await gsap.fromTo(
            preGameScreenRef.current,
            { scale: 1 },
            { scale: 4, ease: "back.in", duration: 0.8})
    }

    return (
        <div
            className="UIContainer preGameScreenContainer" 
            // style={{ height: props.height, width: props.width}}
        >
         <div className="UIContainer pre-game-background"  ref={preGameScreenRef} />

                <WalletConnect connectWalletClicked={isButtonBlocked ? "" : connectWalletClicked} ref={walletRef}/>

        </div>
    );
};

