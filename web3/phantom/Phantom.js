import { CONFIRM_MESSAGE } from "./config";

class Phantom {
    constructor() {
        this.confirmMessage = CONFIRM_MESSAGE;
    }

    checkIsAvailable() {
        return window.solana && window.solana.isPhantom;
    }

    async signMessage(message) {
        // const encodedMessage = new TextEncoder().encode(message);
        const encodedMessage = new TextEncoder().encode(this.confirmMessage);
        const signedMessage = await window.solana.request({
            method: "signMessage",
            params: {
                message: encodedMessage,
            },
        });

        return signedMessage;
        // const encodedMessage = new TextEncoder().encode(message);
        // const signedMessage = await window.solana.signMessage(
        //     encodedMessage,
        //     "utf8"
        // );
        // const signature = signedMessage.signature;
        // return signature;
    }
}

const phantom = new Phantom();
export default phantom;
