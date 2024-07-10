import { useEffect, useState, useRef } from "react";
import { closeInventory, openInventory } from "./inventory";
import { visibilitySignal } from "./inventory";
import { EventBus } from "../../game/EventBus";
import  itemsData  from "../../game/config/itemsData";
import Draggable from "react-draggable";
import { HOST } from "../../sharedConstants/constants";
// TODO : fix visiblity (add drag check)
export const ItemSlot = (props) => {
    const [isDragging,setDrag] = useState(false)
    const [isClicked, setClicked] = useState(false);
    const itemSlotRef = useRef(null);

    const onClick = ()=>{
       if(props.onClick === false) return
       props.onClick()
       EventBus.emit("itemGrab",props.data)
       // TODO : need to update item inventory data
       setClicked(!isClicked);
    }
 
    const onMouseEnter = () => {
        props.onHover(true, props.data)
    };

    const onMouseLeave = () => {
        props.onHover(false)
    };

    // useEffect(()=>{
    //     if(isDragging || visibilitySignal.value ==='visible') {
    //         setItemVisibility("visible")   
    //     } else {
    //         setItemVisibility("hidden")   
    //     }
    // },[isDragging, visibilitySignal.value])

    return (
        <div className="itemSlot"ref={itemSlotRef} >
            <div className="hitbox" onMouseEnter={onMouseEnter}  onMouseLeave={onMouseLeave}>
                <img draggable={false} src={HOST+"assets/ui/inventory/itemSlot.png"}></img>
                <img onPointerDown={onClick} draggable={false} className={`inventoryItem ${isDragging && "grabCursor"}`}src={`${HOST}assets/apple.png`}></img>
            </div>
            <div className="count-text-container">
                <span className="count"> {props.data.quantity}</span>
            </div>
        </div>
    );
};
// data.itemDetails.description
// data.itemDetails.ItemID