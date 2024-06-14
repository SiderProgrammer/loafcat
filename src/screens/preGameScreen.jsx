import { useLayoutEffect, useState, useRef, useEffect } from "react";
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
import { HOST } from "../sharedConstants/constants";
import gsap from 'gsap';

export const PreGameScreen = (props) => {
    const [isWalletConnected, setWalletConnect] = useState(false);
    const [isButtonBlocked, setIsButtonBlocked] = useState(true);
    const [hasPhantom, setHasPhantom] = useState(true)
    const [isCorrectIconVisible, setIsCorrectIconVisible] = useState("hidden");
    const preGameScreenRef = useRef(null);
    const walletRef = useRef(null);
    const correctIconRef = useRef(null);
    const navigate = useNavigate();
    const phantomExtensionURL = "https://phantom.app"

    // useLayoutEffect(async () => {
    //     showLoadingScreen()
    //     connect();
    // }, []);

    useEffect(() => {
        showLoadingScreen()
        openTween()
    }, []);

    const handleConnect = async () => {
        const hasPhantomWallet = checkHasPhantom()
        if(!hasPhantomWallet) {
            setHasPhantom(false)
            return
        }
        await connectBlockchain()
        await connectWallet();
        handleNextScene()
    };

    const checkHasPhantom = () => window.solana && window.solana.isPhantom;

    const connectBlockchain = async () => {
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

    const connectWallet = async () => {
        if (window.solana && window.solana.publicKey) {
            UserModel.USER_ID = "LofD1qHiLDAnj4q6smfDbHC61Z5rCxhGjosN2NU3vv45"; //window.solana.publicKey.toString();
            setWalletConnect(true);
            setIsCorrectIconVisible("visible")
            setIsButtonBlocked(true)
            await openCorrectIcon()
        }
    };

    const handleNextScene = async () => {
        closeCorrectIcon()
        // EventBus.emit("startPreloader")
         walletRef.current.closeTween()
        await closeBackgroundTween()
        navigate(navigatePrefixURL+"/game/");
    }

    const openPhantomURL = () => {
        window.open(phantomExtensionURL, '_blank');
      };

    const openCorrectIcon = async  () => {
        await  gsap.fromTo(
            correctIconRef.current,
            { scale: 0 },
            { scale: 0.05, ease: "back.out", duration: 0.8})
    }

    const closeCorrectIcon = async  () => {
        await  gsap.fromTo(
            correctIconRef.current,
            { scale: 0.05 },
            { scale: 0, ease: "back.in", duration: 0.5})
    }

    const closeBackgroundTween = async ()=>{
       await gsap.fromTo(
            preGameScreenRef.current,
            { scale: 1 },
            { scale: 4, ease: "back.in", duration: 0.8})
    }

    const openTween = async () => {
        await  gsap.fromTo(
            preGameScreenRef.current,
            { scale: 4 },
            { scale: 1, ease: "back.out", duration: 0.9, onComplete: ()=> {
                setIsButtonBlocked(false)
                handleConnect();
            } })
    }

    return (
        <div className="UIContainer preGameScreenContainer" >
         <div className="UIContainer pre-game-background"  ref={preGameScreenRef} />
            {hasPhantom && <WalletConnect connectWalletClicked={isButtonBlocked ? "" : handleConnect} ref={walletRef}/>}
            {hasPhantom && <img className= "UIContainer correct-icon" src={HOST +"assets/correct_icon.png"}  style={{visibility: isCorrectIconVisible}} ref={correctIconRef}></img>}
            {!hasPhantom && <div className="ui install-phantom-section" >
                <h2 >To use this app, please install the extension Phantom to your browser</h2>
                <h2 >You can download it here:</h2>
                <h2 style={{ fontWeight: 'bold', color:"aqua" ,transform: "scale(1.3)"}} onClick={openPhantomURL} >Phantom</h2>
            </div>}
        </div>
    );
};

