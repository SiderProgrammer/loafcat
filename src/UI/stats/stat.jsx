

export const Stat =(props)=>{
    const isCriticalValue = props.reversedValue ? props.fill > 70 : props.fill < 30

    return (
        <div  className={`${props.className}  ${isCriticalValue && "pulseAnimation" }`}>
         
         <img src="./assets/ui/stats/statBox.png" />
        <div className="statFillContainer">
        <img style={{height:props.fill+"%"}} className={`statsGreenFill`} src={`./assets/ui/stats/${ isCriticalValue ? 'redFill' : 'greenFill'}.png`}></img>
        </div>

        <img className="alertIcon " src={`./assets/ui/stats/${props.icon}.png`}></img>
      
      </div>
    )
   
}