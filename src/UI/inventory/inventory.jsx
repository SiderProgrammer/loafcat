import { createSignal } from 'react-use-signals';
import { ItemSlot } from './itemSlot';
import { Button } from '../buttons/button';
import { hideOverlay, showOverlay } from '../blackOverlay/blackOverlay';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { UserModel } from '../../game/models/UserModel';
import Draggable from 'react-draggable';
import { getUserItems } from '../../game/helpers/requests';
import { HOST } from '../../sharedConstants/constants';
import gsap from 'gsap';

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
        const [profileVisible, setProfileVisible] = useState("hidden");
        const inventoryRef = useRef(null);
        const [firstTime, setFirstTime] = useState(true);
  

        const fetchData = async () =>{
            if (visibilitySignal.value === "visible") {
              const data = await getUserItems()
            
            setInventoryData(data.data)
             
            }
        }

        useEffect( () => {
            fetchData()
            if(firstTime) {
              setFirstTime(false)
              return
          }
          if(visibilitySignal.value === "visible") {
              setProfileVisible("visible")
              openTween()
          } else {
              closeTween()
          }
        }, [visibilitySignal.value]);

        useEffect( () => {
          setItemDraggable(draggable)
          return () => {};
      }, [draggable]);

      const openTween = () => {
        gsap.fromTo(
          inventoryRef.current,
            { scale: 0 , x: '+=300', y: '+=300'},
            { scale: 1, x: '-=300', y: '-=300', ease: "back.out", duration: 0.6 })
    }

    const closeTween =  () => {
         gsap.fromTo(
          inventoryRef.current,
            { scale: 1 },
            { scale: 0, x: '+=300', y: '+=300', ease: "back.in", duration: 0.3, onComplete: ()=> {
                setProfileVisible("hidden")
                gsap.fromTo(
                  inventoryRef.current,
                    { scale: 0 },
                    { scale: 0,  x: '-=300', y: '-=300', duration: 0 })
            } })
    }

    return (
        <div className="inventory popup ui center" style={{visibility:profileVisible}} >   
          <div className="inventory-wrapper"  ref={inventoryRef} >
            <Button onClick={closeInventory} className="inventoryCloseButton" buttonIcon="closeButton" ></Button>
            <img src={HOST+"assets/ui/inventory/inventoryFrame.png"}></img>
            <div className="inventoryTabs">
              <img src={HOST+"assets/ui/inventory/inventoryTab.png"}></img>
              <img src={HOST+"assets/ui/inventory/inventoryTab.png"}></img>
              <img src={HOST+"assets/ui/inventory/inventoryTab.png"}></img>
              <img src={HOST+"assets/ui/inventory/inventoryTab.png"}></img>
              <img src={HOST+"assets/ui/inventory/inventoryTab.png"}></img>
            </div>
            <div className="itemSlotsContainer">
               {inventoryData.map((item,i)=>(
            <ItemSlot key={i} onClick={draggable && closeInventory} openInventory={openInventory} item="apple" quantity={item.quantity} data={item}></ItemSlot>))}
          </div>
        </div>
    </div>
    )
    
    
}