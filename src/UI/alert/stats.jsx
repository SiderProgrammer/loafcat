import { useEffect, useState } from "react"
import { UserModel } from "../../game/models/UserModel"
import { statsConstant } from "../../sharedConstants/stats"
import { Stat } from "../stats/stat"
import { Button } from "../buttons/button"

export const Stats = ({petData})=> {
    // const [petData,setPetData] = useState(UserModel.PET_DATA)
    // useEffect(()=>{
    //     setPetData(UserModel.PET_DATA)
    // },[UserModel.PET_DATA])
    return (
        <>
        {/* TODO : handle removing/adding critical value behavior */}
        {/* TODO : plus button open map selection */}
           {statsConstant.map(stat => ( <div style={{display:"flex"}}>
                 <Stat fill={petData[stat.valueKey]} className="petViewStats" icon={stat.icon}></Stat>
            {petData[stat.valueKey] < 30 &&   <Button className={"plus pulseAnimation"} buttonIcon={"plus"} imgPath="./assets/"></Button>}
            </div>
       ))}
 
    

        
</>
    )
}

