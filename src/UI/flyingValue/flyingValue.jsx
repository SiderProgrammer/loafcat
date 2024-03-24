import { useEffect, useState } from "react"
import { EventBus } from "../../game/EventBus"

export const FlyingValue = ()=>{
    const [statsImg,setStatImg] = useState("")
    const [value,setValue] = useState(0)
    const [visible,setVisiblity] = useState('hidden')
    const [pos,setPosition] = useState({x:0,y:0})
    useEffect(()=>{
        EventBus.on("actionUpdate",(data)=>{
            setStatImg(data.img)
            setValue(data.value)
            setVisiblity("visible")
            setPosition({x:data.pos.event.x,y:data.pos.event.y})
         
        })
    },[])

    return (
        <div className={"flyingValue"} style={{visibility:visible, left:pos.x+"px",top:pos.y+"px"}}>
        <span>+{value}</span>
        <img style={{transform:"scale(2)"}}src={"./assets/stats/"+statsImg+".png"}></img>
    </div>
    )
}