import { useLayoutEffect, useState } from "react";
import { ProfileSection } from "./profile/profileSection";
import { PetStats } from "./stats/petStats";
import { Inventory } from "./inventory/inventory";
import { Shop } from "./shop/shop";
import { Leaderboard } from "./leaderboard/leaderboard";
import { DownRightButtons } from "./downRightButtons/downRightButtons";

export const UIView = (props) => {
  


    return (
    
    <div className="UIContainer" style={{ height: props.height, width: props.width }} >
        <ProfileSection></ProfileSection>
        <PetStats></PetStats>
        <Inventory></Inventory>
        <Shop></Shop>
        <Leaderboard></Leaderboard>
        <div id="bottomButtonsSection" className="ui">
            <DownRightButtons></DownRightButtons>
        </div>
    </div>)
};
