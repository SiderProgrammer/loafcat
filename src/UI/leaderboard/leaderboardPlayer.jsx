import { HOST } from "../../sharedConstants/constants";
import { shortenText } from "../../utils/stringUtils";

export const LeaderboardPlayer = (props) => {
    return (
        <div>
            <span>{props.data.Rank}.</span>
            <span>{shortenText(props.data.UserID, 5)}</span>
            {props.data.Rank <= 6 && (
                <img
                    src={`${HOST}assets/ui/leaderboard/paw${props.data.Rank}.png`}
                ></img>
            )}
        </div>
    );
};
