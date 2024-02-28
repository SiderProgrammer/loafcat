import { useLayoutEffect, useRef, useState } from 'react';

import Phaser from 'phaser';
import { PhaserGame } from './game/PhaserGame';

function App ()
{
    // The sprite can only be moved in the MainMenu Scene
    // const [canMoveLogo, setCanMoveLogo] = useState(true);
    
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef();
    const UIRef = useRef();
    // const [logoPosition, setLogoPosition] = useState({ x: 0, y: 0 });
    const [height, setHeight] = useState('100%'); 
    const [width, setWidth] = useState('100%'); 
  
    const resizeUI = () => {
        // TODO : find better more reactable solution
        const canvas = document.querySelector('canvas') 
        let newHeight = canvas.style.height
        if(parseFloat(newHeight) > window.innerHeight) {
            newHeight = window.innerHeight
        }
        setHeight(newHeight)


        let newWidth = canvas.style.width
        // if(parseFloat(newWidth) > window.innerHeight) {
        //     newWidth = window.innerHeight
        // }
        setWidth(newWidth)


    }


useLayoutEffect(() => {
   
    window.addEventListener("resize", resizeUI);

    return () => {

        window.removeEventListener("resize", resizeUI);
    }
}, [phaserRef]);
    // const changeScene = () => {

    //     const scene = phaserRef.current.scene;

    //     if (scene)
    //     {
    //         scene.changeScene();
    //     }
    // }

    // const moveSprite = () => {

    //     const scene = phaserRef.current.scene;

    //     if (scene && scene.scene.key === 'MainMenu')
    //     {
    //         // Get the update logo position
    //         scene.moveLogo(({ x, y }) => {

    //             setLogoPosition({ x, y });

    //         });
    //     }
    // }

    // const addSprite = () => {

    //     const scene = phaserRef.current.scene;

    //     if (scene)
    //     {
    //         // Add more stars
    //         const x = Phaser.Math.Between(64, scene.scale.width - 64);
    //         const y = Phaser.Math.Between(64, scene.scale.height - 64);

    //         //  `add.sprite` is a Phaser GameObjectFactory method and it returns a Sprite Game Object instance
    //         const star = scene.add.sprite(x, y, 'star');

    //         //  ... which you can then act upon. Here we create a Phaser Tween to fade the star sprite in and out.
    //         //  You could, of course, do this from within the Phaser Scene code, but this is just an example
    //         //  showing that Phaser objects and systems can be acted upon from outside of Phaser itself.
    //         scene.add.tween({
    //             targets: star,
    //             duration: 500 + Math.random() * 1000,
    //             alpha: 0,
    //             yoyo: true,
    //             repeat: -1
    //         });
    //     }
    // }

    // Event emitted from the PhaserGame component
    const currentScene = (scene) => {
        setCanMoveLogo(scene.scene.key !== 'MainMenu');
    }

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} currentActiveScene={currentScene} />
            <div id="UI" style={{height:height, width:width}} ref={UIRef}>
                {/* <div>
                    <button className="button" onClick={changeScene}>Change Scene</button>
                </div>
                <div>
                    <button disabled={canMoveLogo} className="button" onClick={moveSprite}>Toggle Movement</button>
                </div>
                <div className="spritePosition">Sprite Position:
                    <pre>{`{\n  x: ${logoPosition.x}\n  y: ${logoPosition.y}\n}`}</pre>
                </div>
                <div>
                    <button className="button" onClick={addSprite}>Add New Sprite</button>
                </div> */}
                <div id="avatarSection">
  <img id="profileFrame" src="./assets/ui/profileView/profileFrame.png" />
  <div id="characterAvatarSection">
    <img id="avatarFrame" src="./assets/ui/profileView/avatarFrame.png" />
    <img id="avatarImage" src="./assets/loafcatAvatar.png" />
  </div>
   <div>
     <div id="coinSection">
      <img id="coinIcon" src="./assets/coin.png" />
      <span id="coinValue">13</span>
    </div>
     <div id="addressSection">
      <span id="walletAddress">78e7e...301b</span>
    </div>  
    <div id="levelSection">
    <img id="levelFrame" src="./assets/ui/profileView/levelBox.png" /> 
      <span id="levelValue">Lv.13</span>
    </div>
  </div> 
</div>


<div id="statsDropDownMenu" class="dropdown">
  <button className="dropbtn button">
    <img src="./assets/ui/profileView/alertBox1.png"></img>
    <img id="alertIcon" src="./assets/alertIcon.png" />
  </button>
  <div className="dropdown-content">
    <div id="hunger" class="statistic">
      <img src="./assets/hungerIcon.png" />
      <img class="plus" src="./assets/plus.png" />
    </div>
    <div id="health" class="statistic">
      <img src="./assets/hearthIcon.png" />
      <img class="plus" src="./assets/plus.png" />
    </div>
    <div id="happines" class="statistic">
      <img src="./assets/thunderIcon.png" />
      <img class="plus" src="./assets/plus.png" />
    </div>
    <div class="statistic">
      <img src="./assets/hourGlassIcon.png" />
      <img class="plus" src="./assets/plus.png" />
    </div>
  </div>
</div>





                <div id="bottomButtonsSection">
  <button id="leaderboardButton" className="button">
    <img src="./assets/leaderboardButton.png" />
  </button>
  <button id="statsButton" className="button">
    <img src="./assets/statsButton.png" />
  </button>
  <button id="storeButton" className="button">
    <img src="./assets/storeButton.png" />
  </button>
  <button id="mainMenuButton" className="button">
    <img src="./assets/mainMenuButton.png" />
  </button>
  <button id="gearButton" className="button">
    <img src="./assets/gearButton.png" />
  </button>
</div>

            </div>
        </div>
    )
}

export default App
