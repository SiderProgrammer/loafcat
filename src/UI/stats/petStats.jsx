import { Button } from "../buttons/button";
import { Stat } from "./stat";
import { createSignal } from "react-use-signals";
export const visibilitySignal = createSignal("hidden");

export const openPetStats = () => {
    visibilitySignal.value = "visible";
    showOverlay();
};
export const closePetStats = () => {
    visibilitySignal.value = "hidden";
    hideOverlay();
};
export const PetStats = () => {
    const changeVisiblity = visibilitySignal.useStateAdapter();
    return (
        <div
            className="petStats popup ui center"
            style={{ visibility: changeVisiblity.value }}
        >
            <Button
                onClick={closePetStats}
                className="inventoryCloseButton"
                buttonIcon="closeButton"
            ></Button>
            <img src="./assets/ui/petStats/statsFrame.png"></img>
            <div>
                <div className="statsAvatar">
                    <img src="./assets/ui/petStats/statsProfile.png"></img>
                    <img className="statsAvatarImage" src="./assets/nftAvatar.jpg"></img>
                </div>
                <div className="statsView">
                    <img src="./assets/ui/petStats/statsBoard.png"></img>
                    <div className="stats">
                        <Stat fill={35} className="petViewStats" icon="Hungry"></Stat>
                        <Stat fill = {0} className="petViewStats" icon="Hungry"></Stat>
                        <Stat fill = {100} className="petViewStats" icon="Hungry"></Stat>
                        <Stat fill ={80} className="petViewStats" icon="Hungry"></Stat>
                    </div>
                </div>
            </div>
        </div>
    );
};
