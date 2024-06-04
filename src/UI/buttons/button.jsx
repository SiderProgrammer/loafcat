import { HOST } from "../../sharedConstants/constants";
import React, {  } from "react";


export const Button = React.forwardRef((props, ref) => {
    const imgPath = props.imgPath ? props.imgPath : "./assets/ui/buttons/";
    const ext = props.ext ? props.ext : "png";


    return (
        <button ref={ref} onClick={()=>{props.onClick()}}className={`button hoverScale ${props.className || ""}`}>
            <div className="button-wrapper">
                <img  className= "button-image" src={`${HOST}${imgPath}${props.buttonIcon}.${ext}`} />
                <div className="buttonText">
                    <span>{props.text}</span>
                    {props.passComponent}
                </div>
                {props.children}
            </div>
        </button>
    );
})
