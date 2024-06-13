import { useEffect, useState, useRef } from "react";
import "./CSS/Timestamp.css";

export const openShop = () => {

};

export const Timestamp = (props) => {
    // const [shopTimestampText, setShopTimestampText] = useState("21:37:59");
    const [timeLeft, setTimeLeft] = useState(props.timeStart);

    const formatTime = (time) => {
        const hours = String(Math.floor(time / (1000 * 60 * 60))).padStart(2, '0');
        const minutes = String(Math.floor((time % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        const seconds = String(Math.floor((time % (1000 * 60)) / 1000)).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
      };

    const restartCountdown = () => {
        setTimeLeft(props.timeStart);
    };

    useEffect(() => {
        const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
            if (prevTime <= 1000) {
            clearInterval(timer);
            if(props.restart) restartCountdown()
            if(props.callback) props.callback()
            return props.timeStart;
            }
            return prevTime - 1000;
        });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

    return (
        <span className="timestamp-text">{formatTime(timeLeft)}</span>
    );
};
