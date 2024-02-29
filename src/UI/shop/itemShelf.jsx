export const ItemShelf = (props) => {
    return (
        <div className="shelf">
            <img src="./assets/ui/shop/Board dark.png"></img>
            <div className="shelfHangBoard">
                <img src="./assets/ui/shop/Hanging sign small dark.png"></img>
                <span className="shelfItemPrice">
                    30(
                    <img src="./assets/coin.png"></img>
                    <span className="closingBracket">)</span>
                </span>
            </div>

            <img className="shelfItem" src={`./assets/${props.item}.png`}></img>
        </div>
    );
};
