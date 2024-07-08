import { HOST } from "../sharedConstants/constants";
import React, { useRef, useImperativeHandle } from "react";

 const Audio = React.forwardRef((props, ref) => {
    const audioRef = useRef(null);

    const play = () => {
        audioRef.current.volume = props.volume ? props.volume : 1.0
        audioRef.current.play()
    };

    useImperativeHandle(ref, () => ({
        play
    }));

    return (
        <audio ref={audioRef} src={HOST +`assets/audio/${props.soundKey}.mp3`}></audio>
    );
})
export default Audio;