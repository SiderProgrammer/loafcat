import { createSignal } from 'react-use-signals';
import { ItemSlot } from './itemSlot';
import { Button } from '../buttons/button';
import { hideOverlay, showOverlay } from '../blackOverlay/blackOverlay';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { UserModel } from '../../game/models/UserModel';
import Draggable from 'react-draggable';
export const visibilitySignal = createSignal("hidden");

let draggable = false

export const openInventory = (itemsDraggable = false) => {
    draggable = itemsDraggable
        visibilitySignal.value = "visible"
        showOverlay()
  };
  export const closeInventory = () => {
    visibilitySignal.value = "hidden"
    hideOverlay()
  
        
  };
 
export const Inventory = ()=>{
    const changeVisiblity = visibilitySignal.useStateAdapter()
  
        const [inventoryData, setInventoryData] = useState([]);
        const [itemDraggable, setItemDraggable] = useState(false);
  

        const fetchData = async () =>{
            if (visibilitySignal.value === "visible") {
              const data = await axios({
                method: "POST",
                url: `http://localhost:3000/api/user-items/`,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                data: {
                    UserID: UserModel.USER_ID,
                },
            });
            
            setInventoryData(data.data)
             
            }
        }
        useEffect( () => {
     
            fetchData()
            
            return () => {};
        }, [visibilitySignal.value]);

        useEffect( () => {
          setItemDraggable(draggable)
          
          return () => {};
      }, [draggable]);

    return (
        <div className="inventory popup ui center" style={{visibility:changeVisiblity.value}} >
                 <Button onClick={closeInventory} className="inventoryCloseButton" buttonIcon="closeButton" ></Button>
            <img src="./assets/ui/inventory/inventoryFrame.png"></img>
      <div className="inventoryTabs">
        <img src="./assets/ui/inventory/inventoryTab.png"></img>
        <img src="./assets/ui/inventory/inventoryTab.png"></img>
        <img src="./assets/ui/inventory/inventoryTab.png"></img>
        <img src="./assets/ui/inventory/inventoryTab.png"></img>
        <img src="./assets/ui/inventory/inventoryTab.png"></img>
      </div>
            <div className="itemSlotsContainer">
               {inventoryData.map((item,i)=>(
              
 <ItemSlot key={i} onClick={draggable && closeInventory} openInventory={openInventory} item="apple" quantity={item.quantity} data={item}></ItemSlot>
          

               ))}
               
              
            </div>
    </div>
    )
    
    
}