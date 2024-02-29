export const Button = (props)=>{
    return (
        <button onClick={props.onClick} className={`button ${props.className}`}>
        <img src={`./assets/${props.buttonIcon}.png`}/>
      </button>
    )
 
}