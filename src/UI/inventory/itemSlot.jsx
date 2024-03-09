import { useEffect, useState } from "react";
import { closeInventory, openInventory } from "./inventory";
import { visibilitySignal } from "./inventory";
import { EventBus } from "../../game/EventBus";
export const ItemSlot = (props) => {
    const [isDragging,setDrag] = useState(false)
    const [itemVisible, setItemVisibility] = useState("hidden")
    const onDragStart = ()=>{
        closeInventory()

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
            <img draggable={false} src="./assets/ui/inventory/itemSlot.png"></img>
            <img className={`inventoryItem ${isDragging && "grabCursor"}`}onDragStart={onDragStart} onDragEnd={onDragEnd} draggable={props.itemDraggable} style={{visibility:itemVisible}} src={`./assets/${props.item}.png`}></img>
            <span>{props.quantity}</span>
        </div>
    );
};
