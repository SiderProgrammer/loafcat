import { Button } from "../buttons/button"
import { openShop } from "../shop/shop"
export const DownRightButtons = ()=>{
    return (
        <>
          <Button buttonIcon ="leaderboardButton"></Button>
          <Button buttonIcon ="statsButton"></Button>
          <Button onClick={openShop} buttonIcon ="storeButton"></Button>
          <Button buttonIcon ="mainMenuButton"></Button>
          <Button buttonIcon ="gearButton"></Button>



        </>
    )

}