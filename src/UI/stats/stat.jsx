export const Stat =(props)=>{
    return (
        <div  className={props.className}>
         
        <img src="./assets/ui/stats/statBox.png" />
        <img className="alertIcon" src={`./assets/ui/stats/${props.icon}.png`}></img>
        <img className="statsGreenFill" src={`./assets/ui/stats/greenFill.png`}></img>
      </div>
    )
   
}