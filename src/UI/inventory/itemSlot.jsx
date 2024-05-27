import { useEffect, useState } from "react";
import { closeInventory, openInventory } from "./inventory";
import { visibilitySignal } from "./inventory";
import { EventBus } from "../../game/EventBus";
import Draggable from "react-draggable";
// TODO : fix visiblity (add drag check)
export const ItemSlot = (props) => {
    const [isDragging,setDrag] = useState(false)
    const [itemVisible, setItemVisibility] = useState("hidden")
    const onClick = ()=>{
        //props.onDragStart()
       // closeInventory()
       props.onClick()
       EventBus.emit("itemGrab",props)

       // TODO : need to update item inventory data
       EventBus.once("itemDrop",props.openInventory)

    }
    const onDragEnd = async ()=>{
        // TODO : finish item drop
        EventBus.emit("itemDrop")
        //props.data
        openInventory(true)
    }
    useEffect(()=>{
        if(    isDragging || visibilitySignal.value ==='visible') {
            setItemVisibility("visible")   
        } else {
            setItemVisibility("hidden")   
        }
       
    },[isDragging, visibilitySignal.value])

    return (
      
        <div className="itemSlot">
            <img draggable={false} src={HOST+"assets/ui/inventory/itemSlot.png"}></img>


            <img onPointerDown={onClick} draggable={false} className={`inventoryItem ${isDragging && "grabCursor"}`}style={{visibility:itemVisible}} src={`${HOST}assets/${props.item}.png`}></img>
  
         
            <span>{props.quantity}</span>
        </div>
    );
};
