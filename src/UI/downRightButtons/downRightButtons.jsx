import { Button } from "../buttons/button";
import { openInventory } from "../inventory/inventory";
import { openLeaderboard } from "../leaderboard/leaderboard";
import { openShop } from "../shop/shop";
import { openPetStats } from "../stats/petStats";
export const DownRightButtons = () => {
    return (
        <>
            <Button onClick={openPetStats} buttonIcon="statsButton"></Button>
            <Button
                onClick={openInventory}
                buttonIcon="inventoryButton"
            ></Button>
            <Button onClick={openShop} buttonIcon="storeButton"></Button>
            <Button
                onClick={openLeaderboard}
                buttonIcon="leaderboardButton"
            ></Button>

            <Button buttonIcon="mapButton"></Button>
        </>
    );
};
