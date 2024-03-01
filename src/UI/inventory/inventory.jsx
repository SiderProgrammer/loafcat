import { createSignal } from 'react-use-signals';
import { ItemSlot } from './itemSlot';
export const visibilitySignal = createSignal("visible");

export const openInventory = () => {
        visibilitySignal.value = "hidden"
  };
  export const closeInventory = () => {
    visibilitySignal.value = "hidden"
  
        
  };
export const Inventory = ()=>{
    const changeVisiblity = visibilitySignal.useStateAdapter()

    return (
        <div className="inventory" style={{visibility:changeVisiblity.value}} >
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