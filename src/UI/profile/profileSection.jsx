import { useState, useRef, useEffect } from "react";
import { Stats } from "../alert/stats";
import { shortenText } from "../../utils/stringUtils";
import { UserModel } from "../../game/models/UserModel";
import { PetModel } from "../../game/models/PetModel";
import { HOST } from "../../sharedConstants/constants";
import gsap from 'gsap';
import profileFramePNG from '../../../public/assets/ui/profileView/avatarFrame.png'

export const ProfileSection = () =>{
    const [petData,setPetData] = useState(PetModel.PET_DATA)
    const [areStatsVisible, setAreStatsVisible] = useState(false);
    const statsContentRef = useRef(null);

    const handleOpenAlertStats = async () => {
        areStatsVisible ? statsContentCloseTween() : statsContentOpenTween()
    };

    useEffect(() => {
        if(areStatsVisible) statsContentOpenTween()
    }, [areStatsVisible]);

    const statsContentOpenTween = () => {
        setAreStatsVisible(true)
        if(statsContentRef.current === null) return
        gsap.fromTo(
            statsContentRef.current,
            { scaleY: 0, y: '-=80'},
            { scaleY: 1, y: '+=80', ease: "back.out", duration: 0.6 })
        
    }

    const statsContentCloseTween = () => {
        if(statsContentRef.current === null) return
        gsap.fromTo(
            statsContentRef.current,
            { scaleY: 1 },
            { scaleY: 0,  y: '-=80', ease: "back.in", duration: 0.3, onComplete: ()=> {
                setAreStatsVisible(false)
                gsap.to(
                    statsContentRef.current,
                    { y: '+=80', duration: 0 })
            } })
    }

    return (
        <div id="avatarSection" className="ui">
            <img id="profileFrame" src={HOST+"assets/ui/profileView/profileFrame.png"}/>
        <div id="characterAvatarSection">
            <img id="avatarFrame" src={HOST+"assets/ui/profileView/avatarFrame.png"}/>
            <img id="avatarImage" src={HOST+"assets/nftAvatar.png"}/>
        </div>
        <div className="avatar-information">
            <div id="coinSection">
                <img id="coinIcon" src={HOST+"assets/coin.png"} />
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
        <div id="statsDropDownMenu" className="dropdown">
            <button className="dropbtn button hoverScale" onClick={handleOpenAlertStats}>
            <img id="alertBox" src={HOST+"assets/ui/profileView/alertBox1.png"}></img>
            <img id="alertIcon" src={HOST+"assets/alertIcon.png"} />
            <img id="alertArrow" src={HOST+"assets/ui/profileView/alertArrowDown.png"}></img>
        </button>
        {areStatsVisible && <div className="dropdown-content"  ref={statsContentRef}>
            {/* // TODO : sort by lowest value to highest? */}
            <Stats petData={petData}></Stats>
        </div> }
        </div>
        </div>
    )

}

