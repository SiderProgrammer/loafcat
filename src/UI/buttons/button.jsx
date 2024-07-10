import { HOST } from "../../sharedConstants/constants";
import React, { useRef } from "react";
// import Audio  from "../../components/Audio"
import { EventBus } from "../../game/EventBus";


export const Button = React.forwardRef((props, ref) => {
    const imgPath = props.imgPath ? props.imgPath : "./assets/ui/buttons/";
    const ext = props.ext ? props.ext : "png";
    const hostURLPrefix = props.hostURLPrefix ? props.hostURLPrefix : true
    const audioRef = useRef(null);

    const handleClick = () => {
        if(props.onClick)props.onClick()
        // audioRef.current.play()
        EventBus.emit("playAudio","click", 1)
    };

    return (
        <button ref={ref} onClick={handleClick }className={`button hoverScale ${props.className || ""}`}>
            <div className="button-wrapper">
                <img  className= "button-image" src={`${hostURLPrefix ? HOST : ''}${imgPath}${props.buttonIcon}.${ext}`} />
                <div className="buttonText">
                    <span>{props.text}</span>
                    {props.passComponent}
                </div>
                {props.children}
                {/* <Audio ref={audioRef} soundKey = {"click"} /> */}
            </div>
        </button>
    );
})
