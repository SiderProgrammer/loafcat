import { useEffect, useLayoutEffect, useState } from "react";
import { Button } from "../UI/buttons/button";
import { UserModel } from "../game/models/UserModel";
import { WalletConnect } from "./walletConnect";
import { LinkPets } from "./linkPets";
import { useNavigate } from "react-router-dom";
import { EventBus } from "../game/EventBus";
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { GameModel } from "../game/models/GameModel";
export const PreGameScreen = (props) => {
    const [isWalletConnected, setWalletConnect] = useState(false);
    const navigate = useNavigate();
    useLayoutEffect(() => {
        const connect = async () => {
            await connectWalletClicked();
        };
        connect();
    }, []);

    const connectToWallet = async () => {
        try {
            if (window.solana) {
                window.solana.on("connect", () => {});
                const resp = await window.solana.connect();
                console.log("connected wallet", resp);
                const connection = new Connection('https://multi-blissful-wind.solana-mainnet.quiknode.pro/13fc50b03434c8775643c0ae2d3db06e6162d1ef');
                GameModel.solanaConnection = connection
            }
        } catch (err) {
            // TODO : update the text on connect error
            // { code: 4001, message: 'User rejected the request.' }
        }
    };

    const connectWalletClicked = async () => {
        await connectToWallet();
        if (window.solana.publicKey) {
            UserModel.USER_ID = "LofD1qHiLDAnj4q6smfDbHC61Z5rCxhGjosN2NU3vv45"; //window.solana.publicKey.toString();
            setWalletConnect(true);
            // EventBus.emit("startPreloader")
            navigate("/loafcat/game/");
        }
    };

    return (
        <div
            className="UIContainer preGameScreenContainer"
            // style={{ height: props.height, width: props.width}}
        >
            {isWalletConnected ? (
                <LinkPets />
            ) : (
                <WalletConnect connectWalletClicked={connectWalletClicked} />
            )}
        </div>
    );
};
