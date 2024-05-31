import { useEffect, useState } from "react"
import { PetStats } from "../UI/stats/petStats"
import { PetView } from "../UI/stats/petView"
import { UserModel } from "../game/models/UserModel"
import axios from "axios"
import { Button } from "../UI/buttons/button"
import { useNavigate } from "react-router-dom";
import { PetLinkPopUp } from "../UI/petLink/petLinkPopUp"
import { showOverlay } from "../UI/blackOverlay/blackOverlay"
import { HOST, navigatePrefixURL } from "../sharedConstants/constants"
import { getMyPetsData } from "../game/helpers/requests"
  


 
export const LinkPets = (props) => {
  const navigate = useNavigate();
  const choosePet = (petData) => {

    UserModel.PET_ID = petData.PetID
    navigate(navigatePrefixURL+"/game/")
  }
  
  const linkPet = (petData) => {
   // showOverlay()
   console.log(petData);
   setLinkPetData(petData)
    setLinkPetVisiblity("visible")
    // TODO : open name pop up
    // const linkedNftsData = await axios({
    //   method: "POST",
    //   url: `http://localhost:3000/api/my-pets`,
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //   },
    //   data: {
    //     "UserID": "string",
    //     "petType": "string",
    //     "PetID": "string",
    //     "PetName": "string
    //   },
    // });
  }

  const PetViewContainer = ({petData}) =>  {
    const isLinked = petData.UserID
    return (
      <div>
      <span style={{position:"absolute", fontSize:"10px",color:"black"}}>{isLinked ? "Linked" : "Not linked"}</span>
    <PetView petData={petData}></PetView>
    <Button onClick={()=>{isLinked ? choosePet(petData) : linkPet(petData)}} buttonIcon={"LinkPetButton"} text={isLinked ? "Play" : "Link Pet"}/>
    </div>
    )
  }
  

    const [linkedPetsData,setLinkedPetsData] = useState([])
    const [petsData,setPetsData] = useState([])

    const [linkPetVisibility, setLinkPetVisiblity] = useState("hidden")
    const [linkPetData, setLinkPetData] = useState({})


    const fetchData = async ()=>{
        const linkedNftsData = await getMyPetsData()
      
          const nftsData = await axios({
            method: "GET",
            url: `http://localhost:3001/wallet-nfts/` + UserModel.USER_ID,
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });
    
          // TODO : fix on BE, should be sent in an array
          setLinkedPetsData([linkedNftsData.data.pets])
          setPetsData([...linkedNftsData.data.pets,nftsData.data,nftsData.data,nftsData.data,nftsData.data,nftsData.data])

         console.log(petsData);
  
    }
    useEffect( ()=>{
    
         fetchData()
        return  ()=>{}
    },[])

    return (
      // TODO : scroll in horizontal axis?
        <div style={{ display:"flex", flexDirection:"column"}}className={"ui center linkPetsContainer"}>
          <img src={HOST+"assets/ui/petStats/petsBoard.png"}></img>
        <span className={"yourPetsText"}>
            Your Pets
        </span>
        <div className={"petsContainer"}>
           {petsData.length && petsData.map(data=>(
      <PetViewContainer petData={data}/>
           ))}
         
    
        </div>
            <PetLinkPopUp petData={linkPetData} visibility={linkPetVisibility} setLinkPetVisiblity={setLinkPetVisiblity}/>
    </div>
    )
}

