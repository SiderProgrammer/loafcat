import { useEffect, useState } from "react";
import { hideOverlay, showOverlay } from "../blackOverlay/blackOverlay";
import { Button } from "../buttons/button";
import { ItemShelf } from "./itemShelf";
import { createSignal } from 'react-use-signals';
import axios from "axios";
import { UserModel } from "../../game/models/UserModel";
export const visibilitySignal = createSignal("hidden");

export const openShop = () => {
    visibilitySignal.value = "visible"
  
        showOverlay()
  };
  export const closeShop = () => {
    visibilitySignal.value = "hidden"
  hideOverlay()
        
  };

export const Shop = () => {
    const changeVisiblity = visibilitySignal.useStateAdapter();
    const [shopData, setShopData] = useState([]);
    const fetchData = async () =>{
        if (visibilitySignal.value === "visible") {
            const data = await axios({
                method: "POST",
                url: `http://localhost:3000/api/daily-items`,
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                data: {
                  UserID: UserModel.USER_ID,
                  limit:8
                },
              });
        
              setShopData(data.data)
         
        }
    }
    useEffect( () => {
 
        fetchData()
        
        return () => {};
    }, [visibilitySignal.value]);

    const refreshShop = async () => {
        await axios({
            method: "POST",
            url: "http://localhost:3000/api/refresh-items",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            data: {
              UserID: UserModel.USER_ID,
            },
          });
    

        fetchData()
    };
  

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
            {shopData.length &&
                    shopData.map((prop) => (
                        <ItemShelf data={prop}></ItemShelf>
                    ))}
        
            
            </div>
        </div>
    );
};
