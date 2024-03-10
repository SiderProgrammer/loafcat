import { Button } from "../UI/buttons/button"

export const WalletConnect = (props) => {
    return (
        <div style={{ display:"flex", flexDirection:"column"}}className={"ui center"}>
        <span>
            Connect your wallet to continue!
        </span>
    <Button className={"connectWalletButton"} onClick={props.connectWalletClicked} buttonIcon={"connectWallet"} text={"Connect Wallet"}></Button>
    </div>
    )
}