import { createSignal } from 'react-use-signals';
export const visibilitySignal = createSignal("hidden");

export const showOverlay = () => {
        visibilitySignal.value = "visible"
  };
  export const hideOverlay = () => {
    visibilitySignal.value = "hidden"
  
        
  };

export const BlackOverlay = ()=>{
    const changeVisiblity = visibilitySignal.useStateAdapter()
    return (
        <div className="blackOverlay" style={{visibility:changeVisiblity.value}}></div>
    )
}