import { HOST } from "../../sharedConstants/constants";
import { Button } from "../buttons/button";
import "./CSS/itemShelf.css";;

export const ItemShelf = (props) => {
    props.data.ItemID.item_name = 'apple'

    const showBuyPopUp = ()=>{
        console.log(props);
        props.showBuyPopUp(props)
    }
  
    return (
        <div className="shelf">
            <img className="board-image" src={HOST+"assets/ui/shop/Board light.png"}></img>
            <div className="price-label">
                <img src={HOST+"assets/ui/shop/Hanging sign small.png"}></img>
                <div className="price">
                    <span className="shelfItemPrice">  {props.data.ItemID.Price}</span>
                    <img className="coin-image" src={HOST+"assets/coin.png"}></img>
                </div>
            </div>
            <Button onClick={showBuyPopUp} className={"shelfItem"} imgPath={"assets/"} buttonIcon={`${props.data.ItemID.item_name}`}></Button>
        </div>
    );
};
