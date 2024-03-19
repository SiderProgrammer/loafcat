import { createSignal } from "react-use-signals";
import { hideOverlay, showOverlay } from "../blackOverlay/blackOverlay";
import { Button } from "../buttons/button";
import { EventBus } from "../../game/EventBus";
import { MAPS_ORDER } from "../../game/constants/houseRooms";

export const visibilitySignal = createSignal("hidden");
export const openMapSelection = async () => {
    visibilitySignal.value = "visible";
    showOverlay();
};
export const closeMapSelection = () => {
    visibilitySignal.value = "hidden";
    hideOverlay();
};
const selectMap = (map) => {
    EventBus.emit("changeMap", { map });
    closeMapSelection();
    hideOverlay();
};
export const MapSelection = () => {
    const changeVisiblity = visibilitySignal.useStateAdapter();
    return (
        <div
            className="locationSelection ui popup center"
            style={{
                visibility: changeVisiblity.value,
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* <Button  className="inventoryCloseButton" buttonIcon="closeButton" ></Button> */}
            {MAPS_ORDER.map((map) => (
                <Button
                    onClick={() => selectMap(map)}
                    style={{ transform: "scale(0.4)" }}
                    buttonIcon={map + "Icon"}
                    ext={"png"}
                ></Button>
            ))}
        </div>
    );
};