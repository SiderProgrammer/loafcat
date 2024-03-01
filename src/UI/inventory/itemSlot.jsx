export const ItemSlot = (props) => {
    return (
        <div className="itemSlot">
            <img src="./assets/ui/inventory/itemSlot.png"></img>
            <img className="inventoryItem" src={`./assets/${props.item}.png`}></img>
        </div>
    );
};
