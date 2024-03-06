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
                        <Stat className="petViewStats" icon="Hungry"></Stat>
                        <Stat className="petViewStats" icon="Hungry"></Stat>
                        <Stat className="petViewStats" icon="Hungry"></Stat>
                        <Stat className="petViewStats" icon="Hungry"></Stat>
                    </div>
                </div>
            </div>
        </div>
    );
};
