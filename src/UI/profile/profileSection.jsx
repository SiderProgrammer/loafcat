import { useState } from "react";
import { Stats } from "../alert/stats";
import { shortenText } from "../../utils/stringUtils";
import { UserModel } from "../../game/models/UserModel";
import { PetModel } from "../../game/models/PetModel";
import { HOST } from "../../sharedConstants/constants";

export const ProfileSection = () =>{
    const [alertStatsVisible, setAlertStatsVisibility] = useState("none");
    
    const [petData,setPetData] = useState(PetModel.PET_DATA)
    console.log(process.env.PUBLIC_URL);
    const openAlertStats = () => {
        if (alertStatsVisible === "block") {
            setAlertStatsVisibility("none");
        } else {
            setAlertStatsVisibility("block");
            setPetData(PetModel.PET_DATA)
        }
    };


    return (
<div id="avatarSection" className="ui">
<img
    id="profileFrame"
    src={"../assets/ui/profileView/profileFrame.png"}
/>
<div id="characterAvatarSection">
    <img
        id="avatarFrame"
        src={HOST+"./assets/ui/profileView/avatarFrame.png"}
    />
    <img
        id="avatarImage"
        src={HOST+"./assets/nftAvatar.jpg"}
    />
</div>
<div>
    <div id="coinSection">
        <img id="coinIcon" src={HOST+"./assets/coin.png"} />
        <span id="coinValue">13</span>
    </div>
    <div id="addressSection">
        <span id="walletAddress">{shortenText(UserModel.USER_ID)}</span>
    </div>
    <div id="levelSection">
        {/* <img id="levelFrame" src={HOST+"./assets/ui/profileView/levelBox.png"} />  */}
        <span id="levelValue">Lv.13</span>
    </div>
</div>



<div id="statsDropDownMenu" class="dropdown">
<button className="dropbtn button hoverScale" onClick={openAlertStats}>
    <img
        id="alertBox"
        src={HOST+"./assets/ui/profileView/alertBox1.png"}
    ></img>
    <img id="alertIcon" src={HOST+"./assets/alertIcon.png"} />
    <img
        id="alertArrow"
        src={HOST+"./assets/ui/profileView/alertArrowDown.png"}
    ></img>
</button>
<div
    className="dropdown-content"
    style={{ display: alertStatsVisible }}
>
    <img
        id="alertStatsBoard"
        src={HOST+"./assets/ui/profileView/alertStatsBoard.png"}
    ></img>
    {/* // TODO : sort by lowest value to highest? */}
    <Stats petData={petData}></Stats>
</div>
</div>
</div>
    )

}

