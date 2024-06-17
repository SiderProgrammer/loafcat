import { useEffect, useState, useRef } from "react"
import { EventBus } from "../../game/EventBus"
import { HOST } from "../../sharedConstants/constants";
import "./CSS/flyingValue.css";
import gsap from 'gsap';

export const FlyingValue = ()=>{
    const [rewardImage, setRewardImage] = useState("")
    const [value,setValue] = useState(0)
    const [visible,setVisiblity] = useState('hidden')
    const rewardContainerRef = useRef(null);

    EventBus.on("rewardUpdate", async (rewardData)=>{
        const {value,img} = rewardData
        setRewardImage(img)
        setValue(value)
        setVisiblity("visible")
        openTween()
    })

    const openTween = async () => {
        await gsap.fromTo(
            rewardContainerRef.current,
            { scale: 0, y:'+=50' },
            { scale: 3, ease: "back.out", y: '-=150', duration: 0.8, onComplete: ()=> {
                closeTween()
            } })
    }

    const closeTween =  () => {
         gsap.fromTo(
            rewardContainerRef.current,
            { scale: 3},
            { scale: 0, duration: 0.3, delay: 0.5,onComplete: ()=> {
                 gsap.to(
                    rewardContainerRef.current,
                    { y: '50%' })
            } })
    }

    return (
        <div className="flyingValue" style={{visibility:visible}}>
             <div className="flyingValueWrapper" ref={rewardContainerRef} >
                <span>+{value}</span>
                <img className="reward-image" src={HOST+"assets/ui/stats/" + rewardImage + ".png"}></img>
            </div>
        </div>
    )
}