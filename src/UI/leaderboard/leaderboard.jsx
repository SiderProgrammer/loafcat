import { useEffect, useState } from "react";
import { LeaderboardPlayer } from "./leaderboardPlayer";
import { createSignal } from "react-use-signals";
import axios from "axios";
import { UserModel } from "../../game/models/UserModel";
import { hideOverlay, showOverlay } from "../blackOverlay/blackOverlay";
export const visibilitySignal = createSignal("hidden");

const sampleData = [{Rank:5, UserID:"asdasd"},{Rank:5, UserID:"asdasd"},{Rank:5, UserID:"asdasd"},{Rank:5, UserID:"asdasd"},{Rank:5, UserID:"asdasd"},{Rank:5, UserID:"asdasd"},{Rank:5, UserID:"asdasd"},{Rank:5, UserID:"asdasd"},{Rank:5, UserID:"asdasd"}]
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
    useEffect( () => {
        const fetchData = async () =>{
            if (visibilitySignal.value === "visible") {
                const data = await axios({
                    method: "POST",
                    url: "http://localhost:3000/api/leadersboard",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    data: {
                        UserID: UserModel.USER_ID,
                        limit: "50",
                    },
                });
                setLeaderboardData(sampleData)
                //setLeaderboardData(data.data.leadersBoard);
            }
        }
        fetchData()
        
        return () => {};
    }, [visibilitySignal.value]);
    return (
        <div
            className="leaderboard ui popup center"
            style={{ visibility: changeVisiblity.value }}
        >
            <img src="./assets/ui/leaderboard/Leaderboard.png"></img>
            <div className="leaderboardPlayers">
                {leaderboardData.length &&
                    leaderboardData.map((prop) => (
                        <LeaderboardPlayer data={prop}></LeaderboardPlayer>
                    ))}
            </div>
        </div>
    );
};
