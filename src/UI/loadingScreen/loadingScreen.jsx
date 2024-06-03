import { createSignal } from 'react-use-signals';
import { useEffect, useState, useRef } from 'react';
import { HOST } from "../../sharedConstants/constants";
import gsap from 'gsap';

export const visibilitySignal = createSignal("hidden");

export const showLoadingScreen = () => {
        visibilitySignal.value = "visible"
  };
  export const hideLoadingScreen = () => {
    visibilitySignal.value = "hidden"
  };

export const LoadingScreen = ()=>{
  const [screenVisible, setScreenVisible] = useState("hidden");
  const loadingScreenRef = useRef(null);

  useEffect( () => {
  if(visibilitySignal.value === "visible") {
    setScreenVisible("visible")
      openTween()
  } else {
      closeTween()
  }
}, [visibilitySignal.value]);

const openTween = () => {
    // gsap.fromTo(
    //     loadingScreenRef.current,
    //       { scale: 0},
    //       { scale: 1, ease: "back.out", duration: 0.4 })
}

const closeTween =  () => {
    gsap.fromTo(
        loadingScreenRef.current,
          { scale: 1 },
          { scale: 0, ease: "back.in", duration: 0.4, onComplete: ()=> {
              setProfileVisible("hidden")
          } })
}

    // const changeVisiblity = visibilitySignal.useStateAdapter()
    return (
        <div className="loading-screen" style={{visibility:screenVisible}} ref={loadingScreenRef}>
            <img className="logo" src= {HOST+ "assets/ui/loadingScreen/loading_animation.svg"}  alt="Loading_logo" />
            <img className="loading-icon" src= {HOST+ "assets/ui/loadingScreen/loading_animation.svg"}  alt="Loading_icon" />
        </div>
    );
}