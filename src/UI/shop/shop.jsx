import { Button } from "../buttons/button";
import { ItemShelf } from "./itemShelf";
import { createSignal } from 'react-use-signals';
export const visibilitySignal = createSignal("visible");

export const openShop = () => {
    visibilitySignal.value = "visible"
  
        
  };
  export const closeShop = () => {
    visibilitySignal.value = "hidden"
  
        
  };

export const Shop = () => {

 const changeVisiblity = visibilitySignal.useStateAdapter()
    return (
        <div className="shop" style={{visibility:changeVisiblity.value}} >
            <img src="./assets/ui/shop/shopFrame.png"></img>
            <Button onClick={closeShop} className="shopCloseButton" buttonIcon="closeButton" ></Button>
            <div className="shopTabs">
                <div className="shopTab">
                    <img src="./assets/ui/shop/Shop Tab.png"></img>
                    <span className="shopText">Shop</span>
                </div>
                <div className="shopTimeTab">
                    <img src="./assets/ui/shop/Time stamp Tab.png"></img>
                    <span className="shopTimestampText">21:37:59</span>
                </div>
            </div>
            <div className="shelfs">
                <ItemShelf item="apple"></ItemShelf>
                <ItemShelf item="apple"></ItemShelf>
                <ItemShelf item="apple"></ItemShelf>
                <ItemShelf item="apple"></ItemShelf>
                <ItemShelf item="apple"></ItemShelf>
                <ItemShelf item="apple"></ItemShelf>
                <ItemShelf item="apple"></ItemShelf>
                <ItemShelf item="apple"></ItemShelf>
            </div>
        </div>
    );
};
