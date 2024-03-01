export const Button = (props)=>{
    return (
        <button onClick={props.onClick} className={`button ${props.className}`}>
        <img src={`./assets/ui/buttons/${props.buttonIcon}.png`}/>
      </button>
    )
 
}