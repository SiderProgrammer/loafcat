import { createSignal } from "react-use-signals";
import { showOverlay } from "../blackOverlay/blackOverlay";
import { Button } from "../buttons/button";
import { EventBus } from "../../game/EventBus";

const MAPS = [
    "garageMap",
    "kitchenMap",
    "bathroomMap",
]
export const visibilitySignal = createSignal("hidden");
export const openMapSelection = async () => {
    visibilitySignal.value = "visible";
    showOverlay();
};
export const closeMapSelection = () => {
    visibilitySignal.value = "hidden";
    hideOverlay();
};
const selectMap = (map)=>{
    EventBus.emit("changeMap",{map})
}
export const MapSelection = ()=>{


    const changeVisiblity = visibilitySignal.useStateAdapter();
    return (
        <div   className="locationSelection ui popup center"
        style={{ visibility: changeVisiblity.value, display:"flex", flexDirection:"column"}}>
            {MAPS.map((map)=><Button onClick={()=>selectMap(map)}style={{transform:"scale(0.4)"}} buttonIcon={"garageMapIcon"}></Button>)}
       
       
        </div>
    )
}