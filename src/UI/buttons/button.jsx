export const Button = (props)=>{
 
    return (
        <button  onClick={props.onClick} className={`button hoverScale ${props.className || ""}`}>
        <img src={`./assets/ui/buttons/${props.buttonIcon}.png`}/>
        <div className="buttonText">
        <span>{props.text}</span>
        {props.passComponent}
        </div>
 
      </button>
    )
 
}