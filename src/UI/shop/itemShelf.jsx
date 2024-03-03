export const ItemShelf = (props) => {
    props.data.ItemID.item_name = 'apple'
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

            <img className="shelfItem" src={`./assets/${props.data.ItemID.item_name}.png`}></img>
        </div>
    );
};
