import { createSignal } from 'react-use-signals';
import { useEffect, useState, useRef } from 'react';
import "./CSS/blackOverlay.css";
import gsap from 'gsap';

export const visibilitySignal = createSignal("hidden");

export const showOverlay = () => {
        visibilitySignal.value = "visible"
  };
  export const hideOverlay = () => {
    visibilitySignal.value = "hidden"
  };

export const BlackOverlay = ()=>{
  const [inventoryVisible, setInventoryVisible] = useState("hidden");
  const blackOverlayRef = useRef(null);
  const changeVisiblity = visibilitySignal.useStateAdapter()

  useEffect( () => {
  if(visibilitySignal.value === "visible") {
    setInventoryVisible("visible")
      openTween()
  } else {
      closeTween()
  }
}, [visibilitySignal.value]);

const openTween = () => {
  gsap.fromTo(
    blackOverlayRef.current,
      { alpha: 0},
      { alpha: 1, duration: 0.4 })
}

const closeTween =  () => {
   gsap.fromTo(
    blackOverlayRef.current,
      { alpha: 1 },
      { alpha: 0, duration: 0.3, onComplete: ()=> {
        setInventoryVisible("hidden")
      } })
}

  return (
    <div className="blackOverlay" style={{visibility:inventoryVisible}} ref={blackOverlayRef}></div>
  )
}