import { statsConstant } from "../../sharedConstants/stats";
import { Stat } from "../stats/stat";
import { Button } from "../buttons/button";
import { HOST } from "../../sharedConstants/constants";

export const Stats = ({ petData }) => {
    return (
        <>
            {/* TODO : handle removing/adding critical value behavior */}
            {/* TODO : plus button open map selection */}
            {/* TODO: "-" button in reversed values */}
            <div className={"stats-container"}>
                <img id="alertStatsBoard" src={HOST+"assets/ui/profileView/alertStatsBoard.png"}></img>
                <div className={"dropDownMenuStatsContainer"}>
                    {statsConstant.map((stat, index) => (
                        <div key={index} style={{ display: "flex" }}>
                            <Stat fill={petData[stat.valueKey]} icon={stat.icon} reversedValue={stat.reversedValue}></Stat>
                            {stat.reversedValue && petData[stat.valueKey] > 70 && (
                            <Button className={"plus pulseAnimation"} buttonIcon={"minus"} imgPath="assets/"></Button>
                            )}
                            {!stat.reversedValue && petData[stat.valueKey] < 30 && (
                            <Button className={"plus pulseAnimation"} buttonIcon={"plus"} imgPath="assets/"></Button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
