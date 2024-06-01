import { Button } from "../buttons/button";
import { openCoinsBuy } from "../coinsBuy/coinsBuy";
import { openInventory } from "../inventory/inventory";
import { openLeaderboard } from "../leaderboard/leaderboard";
import { openMapSelection } from "../location/selectMap";
import { openMainPetView } from "../profile/mainPetView";
import { openShop } from "../shop/shop";
import { openPetStats } from "../stats/petStats";
export const DownRightButtons = () => {
    return (
        <div className="buttons-container">
            <Button onClick={openMainPetView} buttonIcon="statsButton"></Button>
            <Button
                onClick={openInventory}
                buttonIcon="inventoryButton"
            ></Button>
            <Button onClick={openShop} buttonIcon="storeButton"></Button>
            <Button
                onClick={openLeaderboard}
                buttonIcon="leaderboardButton"
            ></Button>

            <Button onClick={openMapSelection} buttonIcon="mapButton"></Button>
            <Button onClick={openCoinsBuy} buttonIcon="coinButton"></Button>
        </div>
    );
};
