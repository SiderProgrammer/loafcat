import { useEffect, useState } from "react";
import { hideOverlay, showOverlay } from "../blackOverlay/blackOverlay";
import { Button } from "../buttons/button";
import { ItemShelf } from "./itemShelf";
import { createSignal } from "react-use-signals";
import axios from "axios";
import { UserModel } from "../../game/models/UserModel";
export const visibilitySignal = createSignal("hidden");

export const openShop = () => {
    visibilitySignal.value = "visible";

    showOverlay();
};
export const closeShop = () => {
    visibilitySignal.value = "hidden";
    hideOverlay();
};


const RefreshPrice = () => {
    return (
        <div
            style={{
                display: "flex",
                fontFamily: "slkscr",
                fontSize: "6px",
                alignItems: "center",
            }}
        >
            <div>(30</div>
            <img src="./assets/coin.png"></img>){/* <div>)</div> */}
        </div>
    );
};
export const Shop = () => {
    const changeVisiblity = visibilitySignal.useStateAdapter();
    const [shopData, setShopData] = useState([]);
    const [itemPopUpData, setItemPopUpData] = useState({});

    const showBuyPopUp = (props) => {
        setItemPopUpData({ ...props, visibility: "visible" });
    };

    const closePopUp = () => {
        setItemPopUpData({});
    };

  const getDailyItems =async () => {
    return  axios({
      method: "POST",
      url: `http://localhost:3000/api/daily-items`,
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
      },
      data: {
          UserID: UserModel.USER_ID,
          limit: 8,
      },
  });
  }
    const buyItem = async (data) => {

closePopUp()
  await axios({
        method: "POST",
        url: `http://localhost:3000/api/buy-item`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: {
          UserID: UserModel.USER_ID,
          ItemID: data.data.ItemID.id
        },
      });
   
      const newItems = await getDailyItems()
      setShopData(newItems.data)
  };


    const fetchData = async () => {
        if (visibilitySignal.value === "visible") {
            const newItems = await getDailyItems()
            console.log(newItems.data);
            setShopData(newItems.data);
        }
    };
    useEffect(() => {
        fetchData();

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

        fetchData();
    };

   

    return (
        <div
            className="shop popup ui center"
            style={{ visibility: changeVisiblity.value }}
        >
            <img src="./assets/ui/shop/shopFrame.png"></img>
            <Button
                onClick={closeShop}
                className="shopCloseButton"
                buttonIcon="closeButton"
            ></Button>
            <Button
                onClick={refreshShop}
                className="shopRefreshButton"
                buttonIcon="refreshButton"
                text={"REFRESH"}
                passComponent={<RefreshPrice />}
            ></Button>
            <div className="shopTabs">
                {/* <div className="shopTab">
                    <img src="./assets/ui/shop/Shop Tab.png"></img>
                    <span className="shopText">Shop</span>
                </div> */}
                <div className="shopTimeTab">
                    <img src="./assets/ui/shop/Time stamp Tab.png"></img>
                    <div className="shopTimestampText">
                        REFRESH IN: 21:37:59
                    </div>
                </div>
            </div>
            <div className="shelfs">
                {shopData.length &&
                    shopData.map(
                        (prop, i) =>
                            i < 8 && (
                                <ItemShelf
                                    showBuyPopUp={showBuyPopUp}
                                    data={prop}
                                ></ItemShelf>
                            )
                    )}
            </div>




            <div
                className={"itemBuyPopUp"}
                style={{
                    visibility: itemPopUpData.visibility
                        ? itemPopUpData.visibility
                        : "hidden",
                }}
            >
                <img src="./assets/ui/leaderboard/Leaderboard.png"></img>
                <Button
                    onClick={closePopUp}
                    className="shopClosePopUpButton"
                    buttonIcon="closeButton"
                ></Button>
                <div className={"itemBuyContent"}>
                    <img src="./assets/ui/shop/Chocolate Board.png"></img>

                    <img
                        className={"buyPopUpShelf"}
                        src="./assets/ui/shop/Board light.png"
                    ></img>
                    <img
                        className={"buyPopUpItem"}
                        src="./assets/apple.png"
                    ></img>
                    <img
                        className={"buyPopUpBoard"}
                        src="./assets/ui/shop/Description Box Mini.png"
                    ></img>
                    <div>
                        <img
                            className={"buyPopUpPriceBoard"}
                            src="./assets/ui/linkPet/nameInput.png"
                        ></img>
                        <span className={"buyPopUpPrice"}>
                            {30}
                            <img src="./assets/coin.png"></img>
                        </span>
                    </div>

                    <Button
                        onClick={() => buyItem(itemPopUpData)}
                        className={"buyButton"}
                        buttonIcon={"Buy Button"}
                        text={"Buy"}
                    />
                </div>
            </div>
        </div>
    );
};
