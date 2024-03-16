import { Button } from "../buttons/button";

export const ItemShelf = (props) => {
    props.data.ItemID.item_name = 'apple'

    const showBuyPopUp = ()=>{
        console.log(props);
        props.showBuyPopUp(props)
    }
  
    return (
        <div className="shelf">
            <img src="./assets/ui/shop/Board light.png"></img>
            <div className="shelfHangBoard">
                <img src="./assets/ui/shop/Hanging sign small.png"></img>
                <span className="shelfItemPrice">
                  {props.data.ItemID.Price}
                    <img src="./assets/coin.png"></img>
                    {/* <span className="closingBracket">)</span> */}
                </span>
            </div>
        <Button onClick={showBuyPopUp} className={"shelfItem"} imgPath={"./assets/"} buttonIcon={`${props.data.ItemID.item_name}`}></Button>
       
        </div>
    );
};
