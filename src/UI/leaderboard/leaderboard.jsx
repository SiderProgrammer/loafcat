import { useEffect, useState, useRef} from "react";
import { LeaderboardPlayer } from "./leaderboardPlayer";
import { createSignal } from "react-use-signals";
import axios from "axios";
import { UserModel } from "../../game/models/UserModel";
import { hideOverlay, showOverlay } from "../blackOverlay/blackOverlay";
import { Button } from "../buttons/button";
import { HOST } from "../../sharedConstants/constants";
import { getLeadersboard } from "../../game/helpers/requests";
import { FetchLoading } from "../fetchLoading/fetchLoading";
import gsap from 'gsap';
export const visibilitySignal = createSignal("hidden");

const sampleData = [{Rank:1, UserID:"asdasd"},{Rank:2, UserID:"asdasd"},{Rank:3, UserID:"asdasd"},{Rank:4, UserID:"asdasd"},{Rank:5, UserID:"asdasd"},{Rank:6, UserID:"asdasd"},{Rank:7, UserID:"asdasd"},{Rank:8, UserID:"asdasd"},{Rank:9, UserID:"asdasd"}]
export const openLeaderboard = async () => {
    visibilitySignal.value = "visible";
    showOverlay();
};
export const closeLeaderboard = () => {
    visibilitySignal.value = "hidden";
    hideOverlay();
};

              
export const Leaderboard = (props) => {
    const changeVisiblity = visibilitySignal.useStateAdapter();
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [profileVisible, setProfileVisible] = useState("hidden");
    const leaderBoardRef = useRef(null);

    useEffect( () => {
        const fetchData = async () =>{
            if(visibilitySignal.value === "visible") {
                setProfileVisible("visible")
                openTween()
                const data = await getLeadersboard()
                setLeaderboardData(data.data.leadersBoard)
                // setLeaderboardData(sampleData)
            } else {
                closeTween()
            }
        }
        fetchData()
        
        return () => {};
    }, [visibilitySignal.value]);


    const openTween = () => {
        gsap.fromTo(
            leaderBoardRef.current,
            { scale: 0 },
            { scale: 1, ease: "back.out", duration: 0.6 })
    }

    const closeTween =  () => {
         gsap.fromTo(
            leaderBoardRef.current,
            { scale: 1 },
            { scale: 0,ease: "back.in", duration: 0.3, onComplete: ()=> {
                setProfileVisible("hidden")
            } })
    }

    return (
        <div className="leaderboard ui popup center" style={{ visibility: profileVisible }}>
            <div className="leader-board-wrapper"  ref={leaderBoardRef}>
                <Button onClick={closeLeaderboard} className="leaderboardCloseButton" buttonIcon="closeButton" ></Button>
                <img src={HOST+"assets/ui/leaderboard/Leaderboard.png"}></img>
                <div className="leaderboardTop">
                    <img src={HOST+"assets/ui/leaderboard/Paw.png"}></img>
                    <div className="leaderboardLabel">
                    <img src={HOST+"assets/ui/leaderboard/leaderboardLabel.png"}></img>
                    <span>LEADERBOARD</span>
                    </div>
                    <img src={HOST+"assets/ui/leaderboard/Paw.png"}></img>
                </div>
                {leaderboardData.length === 0 && <FetchLoading/>}
                <div className="leaderboardPlayers">
                    {leaderboardData.length &&
                        leaderboardData.map((prop, index) => (
                            <LeaderboardPlayer key= {index} data={prop}></LeaderboardPlayer>
                        ))}
                </div>
            </div>
        </div>
    );
};
