export const Stat =(props)=>{
    return (
        <div  className="statistic">
         
        <img src="./assets/ui/stats/statBox.png" />
        <img className="alertIcon" src={`./assets/ui/stats/${props.icon}.png`}></img>
      </div>
    )
   
}