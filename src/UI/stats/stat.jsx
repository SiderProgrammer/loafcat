import { HOST } from "../../sharedConstants/constants"
import { useEffect, useState, useRef } from "react";

export const Stat =(props)=>{
    // const statRef = useRef(null);
    const isCriticalValue = props.reversedValue ? props.fill > 70 : props.fill < 30
    const scaleStyle = props.scale ? { transform: `scale(${props.scale})` } : {};
    // const scaleStyle = {}

    return (
      <div className={`stat-icon-container  ${isCriticalValue && "pulseAnimation" }`} style={scaleStyle}>
        <img className= "border-image" src={HOST+"assets/ui/stats/statBox.png" }/>
        <div className="statFillContainer">
          <img style={{height:props.fill+"%"}} className={`statsGreenFill`} src={`${HOST}assets/ui/stats/${ isCriticalValue ? 'redFill' : 'greenFill'}.png`}></img>
        </div>
        <img className="alertIcon " src={`${HOST}assets/ui/stats/${props.icon}.png`}></img>
    </div>
    )
}

