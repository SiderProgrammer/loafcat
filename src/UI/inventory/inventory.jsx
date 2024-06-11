import { createSignal } from 'react-use-signals';
import { ItemSlot } from './itemSlot';
import { Button } from '../buttons/button';
import { hideOverlay, showOverlay } from '../blackOverlay/blackOverlay';
import { useEffect, useState, useRef } from 'react';
import { EventBus } from "../../game/EventBus";
import axios from 'axios';
import { UserModel } from '../../game/models/UserModel';
import Draggable from 'react-draggable';
import { getUserItems } from '../../game/helpers/requests';
import { HOST } from '../../sharedConstants/constants';
import { FetchLoading } from "../fetchLoading/fetchLoading";
import gsap from 'gsap';
export const visibilitySignal = createSignal("hidden");
export const draggableSignal = createSignal(false);
// let draggable = false

export const openInventory = (itemsDraggable = false) => {
    // draggable = itemsDraggable
    draggableSignal.value = itemsDraggable
    visibilitySignal.value = "visible"
    showOverlay()
  };
  export const closeInventory = () => {
    visibilitySignal.value = "hidden"
    hideOverlay() 
    EventBus.emit("handleMapInteraction",true)
  };
 
export const Inventory = ()=>{
    const changeVisiblity = visibilitySignal.useStateAdapter()
        const [inventoryData, setInventoryData] = useState([]);
        const [itemDraggable, setItemDraggable] = useState(false);
        const [profileVisible, setProfileVisible] = useState("hidden");
        const [isDraggable, setIsDraggable] = useState(false);
        const [isItemDescriptionHovered, setIsItemDescriptionHovered] = useState("hidden");
        const inventoryRef = useRef(null);
        const itemDescriptionRef = useRef(null);


        const dupa = [
          {
              "id": 18,
              "index": 1,
              "quantity": 2,
              "itemDetails": {
                  "ItemID": 118,
                  "name": "Apple",
                  "description": "A fruity helmet for brainy pets. Increases wisdom with a crisp bite.",
                  "pointValue": 10,
                  "price": 5,
                  "category": "food"
              }
          },
          {
              "id": 19,
              "index": 1,
              "quantity": 79,
              "itemDetails": {
                  "ItemID": 113,
                  "name": "Water",
                  "description": "Clear and pure, a thirst's sure cure, water's a drink that pets adore.",
                  "pointValue": 4,
                  "price": 2,
                  "category": "liquid"
              }
          },
          {
              "id": 20,
              "index": 1,
              "quantity": 5,
              "itemDetails": {
                  "ItemID": 134,
                  "name": "Burrito",
                  "description": "A rolled-up fiesta of flavor, perfect for siesta after.",
                  "pointValue": 12,
                  "price": 6,
                  "category": "food"
              }
          },
          {
              "id": 22,
              "index": 1,
              "quantity": 2,
              "itemDetails": {
                  "ItemID": 270,
                  "name": "Radio",
                  "description": "For jamming out to 'Who Let the Dogs Out' on repeat.",
                  "pointValue": 8,
                  "price": 4,
                  "category": "Electronics"
              }
          },
          {
            "id": 22,
            "index": 1,
            "quantity": 2,
            "itemDetails": {
                "ItemID": 270,
                "name": "Radio",
                "description": "For jamming out to 'Who Let the Dogs Out' on repeat.",
                "pointValue": 8,
                "price": 4,
                "category": "Electronics"
            }
        },
        {
          "id": 22,
          "index": 1,
          "quantity": 2,
          "itemDetails": {
              "ItemID": 270,
              "name": "Radio",
              "description": "For jamming out to 'Who Let the Dogs Out' on repeat.",
              "pointValue": 8,
              "price": 4,
              "category": "Electronics"
          }
      },
      {
        "id": 22,
        "index": 1,
        "quantity": 2,
        "itemDetails": {
            "ItemID": 270,
            "name": "Radio",
            "description": "For jamming out to 'Who Let the Dogs Out' on repeat.",
            "pointValue": 8,
            "price": 4,
            "category": "Electronics"
        }
    },
    {
      "id": 22,
      "index": 1,
      "quantity": 2,
      "itemDetails": {
          "ItemID": 270,
          "name": "Radio",
          "description": "For jamming out to 'Who Let the Dogs Out' on repeat.",
          "pointValue": 8,
          "price": 4,
          "category": "Electronics"
      }
  },
  {
    "id": 22,
    "index": 1,
    "quantity": 2,
    "itemDetails": {
        "ItemID": 270,
        "name": "Radio",
        "description": "For jamming out to 'Who Let the Dogs Out' on repeat.",
        "pointValue": 8,
        "price": 4,
        "category": "Electronics"
    }
},
{
  "id": 22,
  "index": 1,
  "quantity": 2,
  "itemDetails": {
      "ItemID": 270,
      "name": "Radio",
      "description": "For jamming out to 'Who Let the Dogs Out' on repeat.",
      "pointValue": 8,
      "price": 4,
      "category": "Electronics"
  }
},
{
  "id": 22,
  "index": 1,
  "quantity": 2,
  "itemDetails": {
      "ItemID": 270,
      "name": "Radio",
      "description": "For jamming out to 'Who Let the Dogs Out' on repeat.",
      "pointValue": 8,
      "price": 4,
      "category": "Electronics"
  }
},{
  "id": 22,
  "index": 1,
  "quantity": 2,
  "itemDetails": {
      "ItemID": 270,
      "name": "Radio",
      "description": "For jamming out to 'Who Let the Dogs Out' on repeat.",
      "pointValue": 8,
      "price": 4,
      "category": "Electronics"
  }
},
{
  "id": 22,
  "index": 1,
  "quantity": 2,
  "itemDetails": {
      "ItemID": 270,
      "name": "Radio",
      "description": "For jamming out to 'Who Let the Dogs Out' on repeat.",
      "pointValue": 8,
      "price": 4,
      "category": "Electronics"
  }
},
{
  "id": 22,
  "index": 1,
  "quantity": 2,
  "itemDetails": {
      "ItemID": 270,
      "name": "Radio",
      "description": "For jamming out to 'Who Let the Dogs Out' on repeat.",
      "pointValue": 8,
      "price": 4,
      "category": "Electronics"
  }
},
{
  "id": 22,
  "index": 1,
  "quantity": 2,
  "itemDetails": {
      "ItemID": 270,
      "name": "Radio",
      "description": "For jamming out to 'Who Let the Dogs Out' on repeat.",
      "pointValue": 8,
      "price": 4,
      "category": "Electronics"
  }
},
{
  "id": 22,
  "index": 1,
  "quantity": 2,
  "itemDetails": {
      "ItemID": 270,
      "name": "Radio",
      "description": "For jamming out to 'Who Let the Dogs Out' on repeat.",
      "pointValue": 8,
      "price": 4,
      "category": "Electronics"
  }
},
{
  "id": 22,
  "index": 1,
  "quantity": 2,
  "itemDetails": {
      "ItemID": 270,
      "name": "Radio",
      "description": "For jamming out to 'Who Let the Dogs Out' on repeat.",
      "pointValue": 8,
      "price": 4,
      "category": "Electronics"
  }
},
      ]

        const fetchData = async () =>{
            if (visibilitySignal.value === "visible") {
              const data = await getUserItems()
              // setInventoryData(dupa)
              setInventoryData(data.data)
              console.log(data.data)
            }
        }

        const handleItemDescribeVisible = (value, itemData) => {
          value ? setIsItemDescriptionHovered("visible") : setIsItemDescriptionHovered("hidden")
          if(!value) return
          itemDescriptionRef.current.textContent = itemData.itemDetails.description; 
        }


        useEffect( () => {
            fetchData()
          if(visibilitySignal.value === "visible") {
              setProfileVisible("visible")
              openTween()
          } else {
              closeTween()
          }
        }, [visibilitySignal.value]);

        useEffect( () => {
          setItemDraggable(draggableSignal.value)
          setIsDraggable(draggableSignal.value)
          return () => {};
      }, [draggableSignal.value]);

      const openTween = () => {
        gsap.fromTo(
          inventoryRef.current,
            { scale: 0},
            { scale: 1, ease: "back.out", duration: 0.6 })
    }

    const closeTween =  () => {
         gsap.fromTo(
          inventoryRef.current,
            { scale: 1 },
            { scale: 0, ease: "back.in", duration: 0.3, onComplete: ()=> {
                setProfileVisible("hidden")
            } })
    }

    return (
        <div className="inventory popup ui center" style={{visibility:profileVisible}} >   
          <div className="inventory-wrapper"  ref={inventoryRef} >
            <Button onClick={closeInventory} className="inventoryCloseButton" buttonIcon="closeButton" ></Button>
            <img src={HOST+"assets/ui/inventory/inventoryFrame.png"}></img>
            <div className="inventoryTabs">
              {/* <img src={HOST+"assets/ui/inventory/inventoryTab.png"}></img>
              <img src={HOST+"assets/ui/inventory/inventoryTab.png"}></img>
              <img src={HOST+"assets/ui/inventory/inventoryTab.png"}></img>
              <img src={HOST+"assets/ui/inventory/inventoryTab.png"}></img>
              <img src={HOST+"assets/ui/inventory/inventoryTab.png"}></img> */}
            </div>
            {inventoryData.length === 0 && <FetchLoading/>}
            <div className="itemSlotsContainer">
            {inventoryData.map((item,i)=>(
              <ItemSlot key={i} onClick={isDraggable && closeInventory} onHover={handleItemDescribeVisible} openInventory={openInventory} data={item}></ItemSlot>))}
          </div>
          <div className="item-description-container" style={{ visibility: isItemDescriptionHovered}}>
            <span className="description-text" ref={itemDescriptionRef} ></span>
          </div>
        </div>
    </div>
    )
    
    
}



