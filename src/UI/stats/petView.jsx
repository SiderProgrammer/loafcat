import { statsConstant } from "../../sharedConstants/stats"
import { Stat } from "./stat"

export const PetView = (props)=>{
    return (<>
        <img src="./assets/ui/petStats/statsFrame.png"></img>
            <div>
                <div className="statsAvatar">
                    <img src="./assets/ui/petStats/statsProfile.png"></img>
                    <img className="statsAvatarImage" src="./assets/nftAvatar.jpg"></img>
                </div>
                <div className="statsView">
                    <img src="./assets/ui/petStats/statsBoard.png"></img>
                    {/* TODO: Health stat should be bigger and only 1 in line && low stats should have red fill*/}
                    <div className="stats">
                        {statsConstant.map(stat => (
                         <Stat fill={props.petData ? props.petData[stat.valueKey] : 0 } className="petViewStats" icon={stat.icon}></Stat>
                        ))}
              
              
                    </div>
                </div>
            </div></>)
}