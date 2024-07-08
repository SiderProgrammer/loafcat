import { useState, useRef, useEffect } from "react";
import { Button } from "../UI/buttons/button";
import { UserModel } from "../game/models/UserModel";
import { WalletConnect } from "./walletConnect";
import { LinkPets } from "./linkPets";
import { useNavigate } from "react-router-dom";
import { navigatePrefixURL } from "../sharedConstants/constants"
import Phantom from "../../web3/phantom/Phantom"
import Solana from "../../web3/solana/Solana"
import { showLoadingScreen, hideLoadingScreen } from '../UI/loadingScreen/loadingScreen';
import { HOST } from "../sharedConstants/constants";
import gsap from 'gsap';
import { verifyUserWalletAddress } from "../../src/game/helpers/requests";

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

    useEffect(() => {
        showLoadingScreen()
        openTween()
    }, []);

    const handleConnect = async () => {
        if(Phantom.checkIsAvailable()) {
            await Solana.connect()

// //! /////////////////////////////////////////
    // const message = "jaja"
    // //    const userWalletAddress = Solana.userWalletAddress
    // const signedMessage = await Phantom.signMessage(message)
    // const jaja = verifyUserWalletAddress(signedMessage)

    //? BACKEND

    // router.post(
    //     "/verify-user-wallet-address",
    //     operationsController.verifyUserWalletAddress
    //   );


    // exports.verifyUserWalletAddress = async (req, res) => {
    //     const { signedMessage } = req.body;
    //     const userWalletAddress = signedMessage.publicKey;
    //     const signature = signedMessage.signature;
      
    //     const encodedMessage = new TextEncoder().encode("jaja");
    //     const encodeSignature = bs58.default.encode(signature.data);
    //     const decodedSignature = bs58.default.decode(encodeSignature);
    //     const decodedPublicKey = bs58.default.decode(userWalletAddress);
      
    //     const isValid = nacl.sign.detached.verify(
    //       encodedMessage,
    //       decodedSignature,
    //       decodedPublicKey
    //     );
      
    //     console.log(isValid);
    //   };
// //! /////////////////////////////////////////

            UserModel.USER_ID = "LofD1qHiLDAnj4q6smfDbHC61Z5rCxhGjosN2NU3vv45"; //Solana.userWalletAddress
            setWalletConnect(true);
            setIsCorrectIconVisible("visible")
            setIsButtonBlocked(true)
            await openCorrectIcon()
            handleNextScene()
        } else {
            setHasPhantom(false)
            return
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

