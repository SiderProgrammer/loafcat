import { hideOverlay, showOverlay } from "../blackOverlay/blackOverlay";
import { Button } from "../buttons/button";
import { ItemShelf } from "./itemShelf";
import { createSignal } from 'react-use-signals';
export const visibilitySignal = createSignal("hidden");

export const openShop = () => {
    visibilitySignal.value = "visible"
  
        showOverlay()
  };
  export const closeShop = () => {
    visibilitySignal.value = "hidden"
  hideOverlay()
        
  };
   const refreshShop = () => {

  };
export const Shop = () => {

 const changeVisiblity = visibilitySignal.useStateAdapter()
    return (
        <div className="shop popup ui center" style={{visibility:changeVisiblity.value}} >
            <img src="./assets/ui/shop/shopFrame.png"></img>
            <Button onClick={closeShop} className="shopCloseButton" buttonIcon="closeButton" ></Button>
            <Button onClick={refreshShop} className="shopRefreshButton" buttonIcon="refreshButton" text={"Refresh"} ></Button>
            <div className="shopTabs">
                {/* <div className="shopTab">
                    <img src="./assets/ui/shop/Shop Tab.png"></img>
                    <span className="shopText">Shop</span>
                </div> */}
                <div className="shopTimeTab">
                    <img src="./assets/ui/shop/Time stamp Tab.png"></img>
                    <div className="shopTimestampText">Refresh in: 21:37:59</div>
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
