import { useEffect, useState } from "react";
import { closeInventory, openInventory } from "./inventory";
import { visibilitySignal } from "./inventory";
import { EventBus } from "../../game/EventBus";
import  itemsData  from "../../game/config/itemsData";
import Draggable from "react-draggable";
import { HOST } from "../../sharedConstants/constants";
// TODO : fix visiblity (add drag check)
export const ItemSlot = (props) => {
    const [isDragging,setDrag] = useState(false)
    // const [itemVisible, setItemVisibility] = useState("hidden")
    const [isHovered, setHovered] = useState(false);
    const [isClicked, setClicked] = useState(false);

    const onClick = ()=>{
        //props.onDragStart()
       // closeInventory()
       if(props.onClick === false) return
       props.onClick()
       EventBus.emit("itemGrab",props)
       // TODO : need to update item inventory data
       EventBus.once("itemDrop",()=>props.openInventory(true))
       setClicked(!isClicked);
    }

    const onMouseEnter = () => {
        setHovered(true);
    };

    const onMouseLeave = () => {
        setHovered(false);
        setClicked(false); 
    };
    // const onDragEnd = async ()=>{
    //     // TODO : finish item drop
    //     EventBus.emit("itemDrop")
    //     //props.data
    //     openInventory(true)
    // }

    // useEffect(()=>{
    //     if(isDragging || visibilitySignal.value ==='visible') {
    //         setItemVisibility("visible")   
    //     } else {
    //         setItemVisibility("hidden")   
    //     }
    // },[isDragging, visibilitySignal.value])

    return (
        <div className="itemSlot" onMouseEnter={onMouseEnter}  onMouseLeave={onMouseLeave}>
            <img draggable={false} src={HOST+"assets/ui/inventory/itemSlot.png"}></img>
            <img onPointerDown={onClick} draggable={false} className={`inventoryItem ${isDragging && "grabCursor"}`}src={`${HOST}assets/apple.png`}></img>
            <div className="count-text-container">
                <span className="count"> {props.data.quantity}</span>
            </div>
            {(isHovered || isClicked) && (
                <div className="description-container">
                    <span className="description"> {props.data.itemDetails.description}</span>
                </div>
            )}
        </div>
    );
};
// data.itemDetails.description
// data.itemDetails.ItemID
