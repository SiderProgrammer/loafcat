import { useEffect, useLayoutEffect, useRef, useState } from "react";

import Phaser from "phaser";
import { PhaserGame } from "./game/PhaserGame";

import { Stats } from "./UI/alert/stats";
import { DownRightButtons } from "./UI/downRightButtons/downRightButtons";
import { Inventory } from "./UI/inventory/inventory";
import { Shop } from "./UI/shop/shop";
import { BlackOverlay } from "./UI/blackOverlay/blackOverlay";
import { Leaderboard } from "./UI/leaderboard/leaderboard";
import { PetStats } from "./UI/stats/petStats";

import { Route, Routes, useNavigate } from "react-router-dom";
import { ProfileSection } from "./UI/profile/profileSection";
import { UIView } from "./UI/UIView";
import { PreGameScreen } from "./screens/preGameScreen";
import { UserModel } from "./game/models/UserModel";
function App() {
    // The sprite can only be moved in the MainMenu Scene
    // const [canMoveLogo, setCanMoveLogo] = useState(true);

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef();

    const alertStatsBox = useRef();
    // const [logoPosition, setLogoPosition] = useState({ x: 0, y: 0 });

    const currentScene = (scene) => {
        setCanMoveLogo(scene.scene.key !== "MainMenu");
    };
    const navigate = useNavigate();

    const [height, setHeight] = useState("100%");
    const [width, setWidth] = useState("100%");
    const resizeUI = () => {
        // TODO : find better more reactable solution
        setTimeout(() => {
            const canvas = document.querySelector("canvas");
            let newHeight = canvas.style.height;
            if (parseFloat(newHeight) > window.innerHeight) {
                newHeight = window.innerHeight;
            }
            setHeight(newHeight);

            let newWidth = canvas.style.width;
            // if(parseFloat(newWidth) > window.innerHeight) {
            //     newWidth = window.innerHeight
            // }
            setWidth(newWidth);
        }, 0);
    };

    useLayoutEffect(() => {
        resizeUI();
        window.addEventListener("resize", resizeUI);

        return () => {
            // observer.disconnect();
            window.removeEventListener("resize", resizeUI);
        };
    }, [phaserRef.ref]);

    useEffect(()=>{
        UserModel.USER_ID.length === 0 &&    navigate("/")
    },[])

    return (
        <div id="app">
            <Routes>
                <Route
                    path="/"
                    element={<PreGameScreen width={width} height={height} />}
                ></Route>

                <Route
                    path="/game"
                    element={
                        
                            <>
                                <PhaserGame
                                    ref={phaserRef}
                                    currentScene={currentScene}
                                />
                                <UIView width={width} height={height} />
                            </>
                        
                    }
                ></Route>
            </Routes>

            <BlackOverlay></BlackOverlay>
        </div>
    );
}

export default App;
