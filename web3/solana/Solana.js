import { Connection, PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import * as web3 from "@solana/web3.js";
import CONTRACT_ADDRESS from "./config";

class Solana {
    constructor() {
        this.walletAddress = null;
        this.contractAddress = CONTRACT_ADDRESS;
    }

    async connect() {
        try {
            // window.solana.on("connect", () => {});
            const resp = await window.solana.connect();
            this.walletAddress = window.solana.publicKey.toString();
            console.log("Connected to wallet:", this.walletAddress);
            const connection = new Connection(
                "https://multi-blissful-wind.solana-mainnet.quiknode.pro/13fc50b03434c8775643c0ae2d3db06e6162d1ef"
            );
        } catch (err) {
            // TODO : update the text on connect error
            // { code: 4001, message: 'User rejected the request.' }
        }
    }

    get userWalletAddress() {
        return this.walletAddress;
    }
}

const solana = new Solana();
export default solana;
