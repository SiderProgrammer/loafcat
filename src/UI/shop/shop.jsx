import { useEffect, useState, useRef } from "react";
import { hideOverlay, showOverlay } from "../blackOverlay/blackOverlay";
import { Button } from "../buttons/button";
import { FetchLoading } from "../fetchLoading/fetchLoading";
import { ItemShelf } from "./itemShelf";
import { Timestamp } from "./timestamp/Timestamp";
import { createSignal } from "react-use-signals";
import { EventBus } from "../../game/EventBus";
import axios from "axios";
import { UserModel } from "../../game/models/UserModel";
import { HOST } from "../../sharedConstants/constants";
import { getDailyItemsData, refreshItems } from "../../game/helpers/requests";
export const visibilitySignal = createSignal("hidden");
import gsap from 'gsap';

let canOpen = true

export const openShop = () => {
    if(!canOpen) return
    visibilitySignal.value = "visible";
    EventBus.emit("handleGameInteraction",false)
    showOverlay();
    canOpen = false
    EventBus.emit("playAudio","store_enter", 1)
};
export const closeShop = () => {
    visibilitySignal.value = "hidden";
    hideOverlay();
};

export const Shop = () => {
    const changeVisiblity = visibilitySignal.useStateAdapter();
    const [shopData, setShopData] = useState([]);
    const [itemPopUpData, setItemPopUpData] = useState({});
    const [refreshCost, setRefreshCost] = useState(300);
    const [profileVisible, setProfileVisible] = useState("hidden");
    const [isItemBuyPopUp, setIsItemBuyPopUp] = useState(false);
    const [isItemBuying, setIsItemBuying] = useState(false);
    const shopeRef = useRef(null);
    const itemBuyPopUpRef = useRef(null);

    const showBuyPopUp = (props) => {
        setItemPopUpData(props);
        setIsItemBuyPopUp(!isItemBuyPopUp)
    };

    const closePopUp = () => {
        setIsItemBuyPopUp(!isItemBuyPopUp)
        setItemPopUpData({});
    };

  const getDailyItems = async () => {
    return  getDailyItemsData()
  }
  
    const buyItem = async (data) => {
        // closePopUp()
        setIsItemBuying(true)
        await buyItem(data.ItemID.id)
        EventBus.emit("playAudio", "buy_item", 1);
      const newItems = await getDailyItems()
      setIsItemBuying(false)
      setShopData(newItems.data)
  };

    const fetchData = async () => {
        if (visibilitySignal.value === "visible") {
            const newItems = await getDailyItems()
            setShopData(newItems.data);
            console.log(newItems)
        }
    };

    useEffect(() => {
        if(isItemBuyPopUp) {
            openBuyItemPopUpTween()
        } else {
            closeBuyItemPopUpTween()
        }

    }, [isItemBuyPopUp]);

    useEffect(() => {
        fetchData();
        if(visibilitySignal.value === "visible") {
            setProfileVisible("visible")
            openTween()
        } else {
            closeTween()
        }

    }, [visibilitySignal.value]);

    const refreshShop = async () => {
        await refreshItems()
        fetchData();
    };

    const openBuyItemPopUpTween = () => {
        if(itemBuyPopUpRef.current === null) return
        gsap.fromTo(
            itemBuyPopUpRef.current,
            { scale: 0},
            { scale: 1, ease: "back.out", duration: 0.6 })
    }

    const closeBuyItemPopUpTween = () => {
        if(itemBuyPopUpRef.current === null) return
        gsap.fromTo(
            itemBuyPopUpRef.current,
            { scale: 1 },
            { scale: 0, ease: "back.in", duration: 0.3, onComplete: ()=> {
                setIsItemBuyPopUp(false)
                // setProfileVisible("hidden")
            } })
    }

    const openTween = () => {
        gsap.fromTo(
            shopeRef.current,
            { scale: 0},
            { scale: 1, ease: "back.out", duration: 0.6 })
    }

    const closeTween =  () => {
         gsap.fromTo(
            shopeRef.current,
            { scale: 1 },
            { scale: 0, ease: "back.in", duration: 0.3, onComplete: ()=> {
                setProfileVisible("hidden")
                EventBus.emit("handleGameInteraction",true)
                canOpen = true
            } })
    }

    const RefreshPrice = () => {
        return (
            <div style={{ display: "flex", fontFamily: "slkscr", fontSize: "6px", alignItems: "center", marginLeft: "5px"}}>
                <div style={{ color: "white"}}>{refreshCost}</div>
                <img src={HOST+"assets/coin.png"} style={{ transform: "Scale(0.83)",marginLeft: "-2px"}}></img>{/* <div>)</div> */}
            </div>
        );
    };

    return (
        <div className="shop popup ui center" style={{ visibility: profileVisible }}>
            <div className="shop-wrapper"  ref={shopeRef}>
                <img src={HOST+"assets/ui/shop/shopFrame.png"}></img>
                <Button onClick={closeShop} className="shopCloseButton" buttonIcon="closeButton" ></Button>
                <Button onClick={refreshShop} className="shopRefreshButton" buttonIcon="refreshButton" text={"REFRESH"} passComponent={<RefreshPrice />}></Button>
                <div className="shopTabs">
                    {/* <div className="shopTab">
                        <img src={HOST+"assets/ui/shop/Shop Tab.png"}></img>
                        <span className="shopText">Shop</span>
                    </div> */}
                    <div className="shopTimeTab">
                        <img src={HOST+"assets/ui/shop/Time stamp Tab.png"}></img>
                        <div className="refresh-timer"> REFRESH IN: {<Timestamp timeStart = {24 * 60 * 60 * 1000} restart ={true}/>}</div> 
                    </div>
                </div>
                <div className="shelfs">
                    {shopData.length &&
                        shopData.map((prop, i) =>
                            i < 8 && ( <ItemShelf key = {i} showBuyPopUp={showBuyPopUp} data={prop} ></ItemShelf>)
                        )}
                </div>
                {shopData.length === 0 && <FetchLoading/>}
                {isItemBuyPopUp && <div className="itemBuyPopUp" ref={itemBuyPopUpRef}>
                    <img src={HOST+"assets/ui/leaderboard/Leaderboard.png"}></img>
                    <Button onClick={closePopUp} className="shopClosePopUpButton" buttonIcon="closeButton"></Button>
                    <div className="itemBuyContent">
                        <img src={HOST+"assets/ui/shop/Chocolate Board.png"}></img>
                        <img className={"buyPopUpShelf"} src={HOST+"assets/ui/shop/Board light.png"}></img>
                        <img className={"buyPopUpItem"} src={HOST+"assets/" + itemPopUpData.data.ItemID.item_name +".png"}></img>
                        <img className={"buyPopUpBoard"} src={HOST+"assets/ui/shop/Description Box Mini.png"}></img>
                        <span className="item-describe">{itemPopUpData.data.ItemID.Description } </span>
                        <div className="item-cost-label">
                            <img className="buyPopUpPriceBoard" src={HOST+"assets/ui/linkPet/nameInput.png"}></img>
                            <span className="buyPopUpPrice">{itemPopUpData.data.ItemID.Price} 
                                <img src={HOST+"assets/coin.png"} style={{ transform: "Scale(1.3" }}></img>
                            </span>
                        </div>
                        {isItemBuying && <FetchLoading/>}
                        {!isItemBuying && <Button onClick={() => buyItem(itemPopUpData)} className={"buyButton"} buttonIcon={"Buy Button"} text={"Buy"}/>}
                    </div>
                </div>}
            </div>
        </div>
    );
};
