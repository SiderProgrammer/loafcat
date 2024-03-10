import { useState } from "react";
import { Stats } from "../alert/stats";

export const ProfileSection = () =>{
    const [alertStatsVisible, setAlertStatsVisibility] = useState("none");
    const openAlertStats = () => {
        if (alertStatsVisible === "block") {
            setAlertStatsVisibility("none");
        } else {
            setAlertStatsVisibility("block");
        }
    };


    return (
<div id="avatarSection" className="ui">
<img
    id="profileFrame"
    src="./assets/ui/profileView/profileFrame.png"
/>
<div id="characterAvatarSection">
    <img
        id="avatarFrame"
        src="./assets/ui/profileView/avatarFrame.png"
    />
    <img
        id="avatarImage"
        src="./assets/nftAvatar.jpg"
    />
</div>
<div>
    <div id="coinSection">
        <img id="coinIcon" src="./assets/coin.png" />
        <span id="coinValue">13</span>
    </div>
    <div id="addressSection">
        <span id="walletAddress">78e7e...301b</span>
    </div>
    <div id="levelSection">
        {/* <img id="levelFrame" src="./assets/ui/profileView/levelBox.png" />  */}
        <span id="levelValue">Lv.13</span>
    </div>
</div>



<div id="statsDropDownMenu" class="dropdown">
<button className="dropbtn button hoverScale" onClick={openAlertStats}>
    <img
        id="alertBox"
        src="./assets/ui/profileView/alertBox1.png"
    ></img>
    <img id="alertIcon" src="./assets/alertIcon.png" />
    <img
        id="alertArrow"
        src="./assets/ui/profileView/alertArrowDown.png"
    ></img>
</button>
<div
    className="dropdown-content"
    style={{ display: alertStatsVisible }}
>
    <img
        id="alertStatsBoard"
        src="./assets/ui/profileView/alertStatsBoard.png"
    ></img>
    <Stats></Stats>
</div>
</div>
</div>
    )

}
