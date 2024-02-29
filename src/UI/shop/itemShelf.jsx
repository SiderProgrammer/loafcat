export const ItemShelf =(props)=>{
    return (
        <div className="shelf">
    
                <img src="./assets/ui/shop/Board dark.png"></img>
            <img className="shelfHangBoard" src="./assets/ui/shop/Hanging sign small dark.png"></img>
            <img className="shelfItem" src={`./assets/${props.item}.png`}></img>
        </div>
    )
}