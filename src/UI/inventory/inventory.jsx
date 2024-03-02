import { createSignal } from 'react-use-signals';
import { ItemSlot } from './itemSlot';
import { Button } from '../buttons/button';
import { hideOverlay, showOverlay } from '../blackOverlay/blackOverlay';
export const visibilitySignal = createSignal("hidden");

export const openInventory = () => {
        visibilitySignal.value = "visible"
        showOverlay()
  };
  export const closeInventory = () => {
    visibilitySignal.value = "hidden"
    hideOverlay()
  
        
  };
export const Inventory = ()=>{
    const changeVisiblity = visibilitySignal.useStateAdapter()

    return (
        <div className="inventory popup ui center" style={{visibility:changeVisiblity.value}} >
                 <Button onClick={closeInventory} className="inventoryCloseButton" buttonIcon="closeButton" ></Button>
            <img src="./assets/ui/inventory/inventoryFrame.png"></img>
            <div className="itemSlotsContainer">
                <ItemSlot item="apple"></ItemSlot>
                <ItemSlot item="apple"></ItemSlot>
                <ItemSlot item="apple"></ItemSlot>
                <ItemSlot item="apple"></ItemSlot>
                <ItemSlot item="apple"></ItemSlot>
                <ItemSlot item="apple"></ItemSlot>
                <ItemSlot item="apple"></ItemSlot>
                <ItemSlot item="apple"></ItemSlot>
                <ItemSlot item="apple"></ItemSlot>
                <ItemSlot item="apple"></ItemSlot>
                <ItemSlot item="apple"></ItemSlot>
                <ItemSlot item="apple"></ItemSlot>
            </div>
    </div>
    )
    
    
}