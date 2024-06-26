import { useEffect, useState, useRef } from "react";
import { statsConstant } from "../../sharedConstants/stats";
import { Button } from "../buttons/button";
import { hideOverlay, showOverlay } from "../blackOverlay/blackOverlay";
import { createSignal } from "react-use-signals";
import axios from "axios";
import { EventBus } from "../../game/EventBus";
import { UserModel } from "../../game/models/UserModel";
import { PetView } from "../stats/petView";
// import { MainPetContent } from "./mainPetContent";
import { PetModel } from "../../game/models/PetModel";
import { Stat } from "../stats/stat"
import { HOST } from "../../sharedConstants/constants"
import { shortenText } from "../../utils/stringUtils"
import gsap from 'gsap';

export const visibilitySignal = createSignal("hidden");

export const openMainPetView = () => {
    visibilitySignal.value = "visible";
    showOverlay();
    EventBus.emit("handleGameInteraction",false)
};
export const closeMainPetView = () => {
    visibilitySignal.value = "hidden";
    hideOverlay();
};

export const MainPetView = () => {
    const changeVisiblity = visibilitySignal.useStateAdapter();
    const [petData, setPetData] = useState([]);
    const [profileVisible, setProfileVisible] = useState("hidden");
    const profileRef = useRef(null);

    useEffect(  () => {
        setPetData(PetModel.PET_DATA)

        if(visibilitySignal.value === "visible") {
            setProfileVisible("visible")
            openTween()
        } else {
            closeTween()
        }
        // return () => {};

    }, [visibilitySignal.value]);


    const openTween = () => {
        gsap.fromTo(
            profileRef.current,
            { scale: 0},
            { scale: 1, ease: "back.out", duration: 0.6 })
    }

    const closeTween =  () => {
         gsap.fromTo(
            profileRef.current,
            { scale: 1 },
            { scale: 0, ease: "back.in", duration: 0.3, onComplete: ()=> {
                setProfileVisible("hidden")
                EventBus.emit("handleGameInteraction",true)
            } })
    }
   
    return (
        <div className="petStats popup ui center" style={{ visibility: profileVisible}}>
             <div className="profile-wrapper"  ref={profileRef}>
                <Button onClick={closeMainPetView} className="inventoryCloseButton" buttonIcon="closeButton"></Button>
                <img style={{transform:"scale(1.5"}} src={HOST+"assets/ui/petStats/statsFrame.png"}></img>
                <div className="stats-context">
                    <div className="profile-image-container">
                        <img className="statsAvatarImage" src={HOST+"assets/nftAvatar.png"}></img>
                        <img className="avatarBorder" src={HOST+"assets/ui/profileView/avatarBorder.png"}></img>
                        <span className="user-id-text">{shortenText(UserModel.USER_ID) }</span>
                    </div>
                    <div className="stats-container">
                        <div>
                            <img className="petViewNameBoard" src={HOST+"assets/ui/linkPet/nameInput.png"}></img>
                            <span className="pet-name-text">{petData.Name }</span>
                        </div>
                        <div className={"pet-information-container"}>
                            <span>Lv.13</span>
                            <div className={"information-section"}>
                                <img src={HOST+"assets/coin.png"}></img>
                                <span>{13}</span>
                            </div>
                            <div className={"information-section"}>
                                <img src={HOST+"assets/hearthIcon.png"}></img>
                                <span>{petData.lives}</span>
                            </div>
                            <div className={"information-section"}>
                                <img src={HOST+"assets/hourGlassIcon.png"}></img>
                                <span>{7}</span>
                            </div>
                        </div>
                    </div>
                    <div className="stats-diagrams-container">
                        <div className="stats">
                            <div className="bigger-stats">    
                                <Stat fill={petData ? petData[statsConstant[0].valueKey] : 0 } reversedValue={statsConstant[0].reversedValue}  icon={statsConstant[0].icon} scale = {2.2}></Stat>
                            </div>
                            <div className="smaller-stats">   
                                {statsConstant.slice(1).map((stat,index) => ( 
                                <div key ={index} className="stat-container">
                                    <Stat fill={petData ? petData[stat.valueKey] : 0 } reversedValue={stat.reversedValue}  icon={stat.icon}  scale = {1.2}></Stat>
                                </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
























// import { useEffect, useState, useRef } from "react";
// import { statsConstant } from "../../sharedConstants/stats";
// import { Button } from "../buttons/button";
// import { hideOverlay, showOverlay } from "../blackOverlay/blackOverlay";
// import { createSignal } from "react-use-signals";
// import axios from "axios";
// import { UserModel } from "../../game/models/UserModel";
// import { PetView } from "../stats/petView";
// // import { MainPetContent } from "./mainPetContent";
// import { PetModel } from "../../game/models/PetModel";
// import { Stat } from "../stats/stat"
// import { HOST } from "../../sharedConstants/constants"
// import { shortenText } from "../../utils/stringUtils"
// import gsap from 'gsap';

// export const visibilitySignal = createSignal("hidden");

// export const openMainPetView = () => {
//     visibilitySignal.value = "visible";
//     showOverlay();
// };
// export const closeMainPetView = () => {
//     visibilitySignal.value = "hidden";
//     hideOverlay();
// };

// export const MainPetView = () => {
//     const changeVisiblity = visibilitySignal.useStateAdapter();
//     const [petData, setPetData] = useState([]);
//     const [profileVisible, setProfileVisible] = useState("hidden");
//     const profileRef = useRef(null);

//     useEffect(  () => {
//         setPetData(PetModel.PET_DATA)

//         if(visibilitySignal.value === "visible") {
//             setProfileVisible("visible")
//             openTween()
//         } else {
//             closeTween()
//         }
//         // return () => {};

//     }, [visibilitySignal.value]);


//     const openTween = () => {
//         gsap.fromTo(
//             profileRef.current,
//             { scale: 0},
//             { scale: 1, ease: "back.out", duration: 0.6 })
//     }

//     const closeTween =  () => {
//          gsap.fromTo(
//             profileRef.current,
//             { scale: 1 },
//             { scale: 0, ease: "back.in", duration: 0.3, onComplete: ()=> {
//                 setProfileVisible("hidden")
//             } })
//     }

//     return (
//         <div className="petStats popup ui center" style={{ visibility: profileVisible}}>
//              <div className="profile-wrapper"  ref={profileRef}>
//                 <Button onClick={closeMainPetView} className="inventoryCloseButton" buttonIcon="closeButton"></Button>
//                 <img style={{transform:"scale(1.5"}} src={HOST+"assets/ui/petStats/statsFrame.png"}></img>
//                 <div className="stats-context">
//                     <div className="profile-image-container">
//                         <img className="statsAvatarImage" src={HOST+"assets/nftAvatar.png"}></img>
//                         <img className="avatarBorder" src={HOST+"assets/ui/profileView/avatarBorder.png"}></img>
//                         <span className="user-id-text">{shortenText(UserModel.USER_ID) }</span>
//                     </div>
//                     <div className="stats-container">
//                         <div>
//                             <img className="petViewNameBoard" src={HOST+"assets/ui/linkPet/nameInput.png"}></img>
//                             <span className="pet-name-text">{petData.Name }</span>
//                         </div>
//                         <div className={"pet-information-container"}>
//                             <span>Lv.13</span>
//                             <div className={"information-section"}>
//                                 <img src={HOST+"assets/coin.png"}></img>
//                                 <span>{13}</span>
//                             </div>
//                             <div className={"information-section"}>
//                                 <img src={HOST+"assets/hearthIcon.png"}></img>
//                                 <span>{petData.lives}</span>
//                             </div>
//                             <div className={"information-section"}>
//                                 <img src={HOST+"assets/hourGlassIcon.png"}></img>
//                                 <span>{7}</span>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="stats-diagrams-container">
//                         <div className="stats">
//                             {statsConstant.map((stat,index) => ( 
//                             <div key ={index} className="stat-container">
//                                 <Stat fill={petData ? petData[stat.valueKey] : 0 } reversedValue={stat.reversedValue}  icon={stat.icon} index = {index}></Stat>
//                             </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>.slice(1)
//     );
// };