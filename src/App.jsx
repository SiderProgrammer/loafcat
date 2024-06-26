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
import { LoadingScreen } from "./UI/loadingScreen/loadingScreen";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ProfileSection } from "./UI/profile/profileSection";
import { UIView } from "./UI/UIView";
import { PreGameScreen } from "./screens/preGameScreen";
import { UserModel } from "./game/models/UserModel";
import axios from "axios";
import { navigatePrefixURL } from "./sharedConstants/constants";
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
    // TODO : on web refresh, this shouldnt be applied before we enter the game
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

    const [isGameLoaded, setGameLoaded] = useState(false)

    const onGameLoaded = () => { 
        setGameLoaded(true)
    }

    useLayoutEffect(() => {
     
        // TODO : run resizeUI on navigate to /game
        resizeUI();
        window.addEventListener("resize", resizeUI);

        return () => {
            // observer.disconnect();
            window.removeEventListener("resize", resizeUI);
        };
    }, [phaserRef.ref]);

    useEffect(()=>{
        UserModel.USER_ID.length === 0 && navigate("/")
    },[])

 

    return (
        <div id="app">
            <Routes>
                <Route path="/" element={<PreGameScreen width={width} height={height} />}></Route>
                <Route path={navigatePrefixURL+"/game/"} element={
                    <>
                        <PhaserGame onStart={resizeUI} ref={phaserRef} currentScene={currentScene} onGameLoaded={onGameLoaded}/>
                        {isGameLoaded ? <UIView width={width} height={height} />: null } 
                        <LoadingScreen></LoadingScreen>
                    </>
                    }
                ></Route>
            </Routes>
        </div>
    );
}

export default App;
