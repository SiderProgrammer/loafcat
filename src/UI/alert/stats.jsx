import { statsConstant } from "../../sharedConstants/stats";
import { Stat } from "../stats/stat";
import { Button } from "../buttons/button";

export const Stats = ({ petData }) => {
    return (
        <>
            {/* TODO : handle removing/adding critical value behavior */}
            {/* TODO : plus button open map selection */}
            {/* TODO: "-" button in reversed values */}
            <div className={"dropDownMenuStatsContainer"}>
                {statsConstant.map((stat) => (
                    <div style={{ display: "flex" }}>
                        <Stat
                            fill={petData[stat.valueKey]}
                            className="petViewStats"
                            icon={stat.icon}
                            reversedValue={stat.reversedValue}
                        ></Stat>

                        {(stat.reversedValue
                            ? petData[stat.valueKey] > 70
                            : petData[stat.valueKey] < 30) && (
                                  <Button
                                      className={"plus pulseAnimation"}
                                      buttonIcon={"plus"}
                                      imgPath="./assets/"
                                  ></Button>
                              )}
                    </div>
                ))}
            </div>
        </>
    );
};
