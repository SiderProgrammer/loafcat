import { Button } from "../UI/buttons/button"
import React,{useImperativeHandle , useRef, useEffect} from "react";
import gsap from 'gsap';
import { navigatePrefixURL } from "../sharedConstants/constants";

export const WalletConnect = React.forwardRef((props, ref) => {
    const buttonRef = useRef(null);

    useEffect(() => {
        openTween()
    }, []);

    useImperativeHandle(ref, () => ({
        openTween,
        closeTween
      }));

    const openTween =() => {
        gsap.fromTo(
            buttonRef.current,
            { scale: 0 },
            { scale: 2, ease: "back.out", duration: 1 })
    }

    const closeTween = async () => {
        await gsap.fromTo(
            buttonRef.current,
            { scale: 2 },
            { scale: 0, ease: "back.in", duration: 0.6 })
    }

    return (
        <div style={{ display:"flex", flexDirection:"column"}}className={"ui center"} ref={ref}  >
        {/* <div>
            Connect your wallet to continue!
        </div> */}
        <Button className={"connectWalletButton"} path={"." + navigatePrefixURL + "/"} onClick={props.connectWalletClicked} buttonIcon={"connectWallet"} text={"Connect Wallet"} ref={buttonRef} ></Button>
    </div>
    )
})