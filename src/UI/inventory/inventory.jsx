import { createSignal } from 'react-use-signals';
export const visibilitySignal = createSignal("visible");

export const handleVisibility = () => {
        visibilitySignal.value = "hidden"
  };
export const Inventory = ()=>{
    const changeVisiblity = visibilitySignal.useStateAdapter()

    return (
        <div style={{visibility:changeVisiblity.value}} onClick={handleVisibility}>
        155555555555555555555555555555555
    </div>
    )
    
    
}