import { useEffect, useState, useRef } from "react";
import { createSignal } from "react-use-signals";
import { HOST } from "../../sharedConstants/constants";
export const visibilitySignal = createSignal("hidden");
import "./CSS/fetchLoading.css";;

export const FetchLoading = () => {
    // const [isItemBuyPopUp, setIsItemBuyPopUp] = useState(false);
    const fetchLoadingRef = useRef(null)

    useEffect(() => {

    }, []);

    return (
        <div className="fetch-loading-container"  ref={fetchLoadingRef}>
            <img className="fetch-loading-image" src={HOST+"assets/ui/fetchLoading.svg"}></img>
        </div>
    );
};
