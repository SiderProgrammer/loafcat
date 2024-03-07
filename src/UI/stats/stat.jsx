import { useState } from "react"

export const Stat =(props)=>{
  
    return (
        <div  className={props.className}>
         
        <img src="./assets/ui/stats/statBox.png" />
        <img style={{height:props.fill+"%"}} className="statsGreenFill" src={`./assets/ui/stats/greenFill.png`}></img>
        <img className="alertIcon" src={`./assets/ui/stats/${props.icon}.png`}></img>
      
      </div>
    )
   
}