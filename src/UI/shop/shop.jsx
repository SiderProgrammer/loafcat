import { ItemShelf } from "./itemShelf";

export const Shop = () => {
    return (
        <div className="shop">
            <img src="./assets/ui/shop/shopFrame.png"></img>
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
