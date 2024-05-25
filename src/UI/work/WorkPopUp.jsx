import { statsConstant } from "../../sharedConstants/stats";
import { Stat } from "../stats/stat";
import { Button } from "../buttons/button";
import { createSignal } from "react-use-signals";
import { hideOverlay, showOverlay } from "../blackOverlay/blackOverlay";
import React, { useRef, useState } from "react";
import { RangeSlider } from "../common/rangeSlider.jsx/rangeSlider";
import { EventBus } from "../../game/EventBus";
import { HOST } from "../../sharedConstants/constants";
export const visibilitySignal = createSignal("hidden");

export const openWorkPopUp = () => {
    visibilitySignal.value = "visible";
    showOverlay();
};
export const closeWorkPopUp = () => {
    visibilitySignal.value = "hidden";
    hideOverlay();
};

export const WorkPopUp = () => {
    const changeVisiblity = visibilitySignal.useStateAdapter();

    const [value, setValue] = React.useState({ min: 0, max: 100 });
    const [isWorking, setIsWorking] = React.useState(false);

    const startWork = () => {
        setIsWorking(true);
        EventBus.emit("startWork");
    };
    const stopWork = () => {
        setIsWorking(false);
        EventBus.emit("stopWork");
        closeWorkPopUp();
    };
    return (
        <>
            <div
                className={"popup ui center"}
                style={{ visibility: changeVisiblity.value }}
            >
                <img
                    style={{ transform: "scale(1.5)" }}
                    src={HOST+"assets/ui/linkPet/linkPetBoard.png"}
                ></img>

                <div className={"coinBuyMainContainer"}>
                    {isWorking ? (
                        <div
                            style={{
                                letterSpacing: "-1px",
                                textAlign: "center",
                            }}
                        >
                            <div>You pet is currently busy in work!</div>
                            <div style={{ marginTop: "3px" }}>
                                {value.min / 10 - 1}:59 hours left
                            </div>
                        </div>
                    ) : (
                        <>
                            <span>Set working hours</span>

                            <RangeSlider
                                min={0}
                                max={100}
                                step={10}
                                value={value}
                                onChange={setValue}
                            />
                            <div
                                style={{
                                    display: "flex",
                                    gap: "5.5px",
                                    marginLeft: "4px",
                                }}
                            >
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                                    (hour) => (
                                        <div>{hour}</div>
                                    )
                                )}
                            </div>
                            <span
                                style={{
                                    marginTop: "40px",
                                    letterSpacing: "-1px",
                                }}
                            >
                                You will earn {value.min / 2} coins
                            </span>
                        </>
                    )}
                </div>

                {/* //TODO : show start work button when hours are set > 0 */}
                {isWorking ? (
                    <Button
                        onClick={stopWork}
                        className={"nameSubmitButton"}
                        buttonIcon={"submitButton"}
                        text={"Stop working"}
                    />
                ) : (
                    <Button
                        onClick={startWork}
                        className={"nameSubmitButton"}
                        buttonIcon={"submitButton"}
                        text={"Start work"}
                    />
                )}
            </div>
        </>
    );
};
