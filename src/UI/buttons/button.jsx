export const Button = (props) => {
    const imgPath = props.imgPath ? props.imgPath : "./assets/ui/buttons/";
    const ext = props.ext ? props.ext : "png";
    return (
        <button
            onClick={props.onClick}
            className={`button hoverScale ${props.className || ""}`}
        >
            <img src={`${imgPath}${props.buttonIcon}.${ext}`} />
            <div className="buttonText">
                <span>{props.text}</span>
                {props.passComponent}
            </div>
        </button>
    );
};
