import { useEffect, useState } from "react"
import { UserModel } from "../../game/models/UserModel"
import { statsConstant } from "../../sharedConstants/stats"
import { Stat } from "../stats/stat"

export const Stats = ()=> {
    const [petData,setPetData] = useState(UserModel.PET_DATA)
    useEffect(()=>{
        setPetData(UserModel.PET_DATA)
    },[UserModel.PET_DATA])
    return (
        <>
        {/* TODO : handle removing/adding critical value behavior */}
           {statsConstant.map(stat => ( <div style={{display:"flex"}}>
                 <Stat fill={petData[stat.valueKey]} className="petViewStats" icon={stat.icon}></Stat>
            {petData[stat.valueKey] < 30 && <img src="./assets/plus.png" className="plus pulseAnimation"></img>}
            </div>
       ))}
 
    

        
</>
    )
}

