import { Button } from "../buttons/button";

export const PetLinkPopUp = (props) => {
    const linkPet = async ()=>{
        // await axios({
        //   method: "GET",
        //   url: `http://localhost:3001/link-pet`,
        //   headers: {
        //     Accept: "application/json",
        //     "Content-Type": "application/json",
        //   },
        //   data: {
        //     UserID: UserModel.USER_ID,
        //     petType: nftsData.data.model,
        //     PetID: UserModel.PET_ID,
        //     PetName: "Bobby",
        //   },
        // });
        props.setLinkPetVisiblity("hidden")
  }

    return (
        <div
            className={"petLinkPopUpContainer"}
            style={{ visibility: props.visibility }}
        >
  
            <img style={{transform:"scale(1.5)"}} src="./assets/ui/linkPet/linkPetBoard.png"></img>
            <span style={{position:"absolute",left:"0px",top:"-13px",color:"black"}}>{props.petData.name}</span>
            <div>
               
                <img
                    className={"statsAvatarImage petLinkPopUpAvatar"}
                    src="./assets/nftAvatar.jpg"
                ></img>
                <div style={{pointerEvents:"pointer-events: all;"}}>
                
                    <img
                        className={"petLinkPopUpNameInput"}
                        src="./assets/ui/linkPet/nameInput.png"
                    ></img>
                        <input type="text" id="petNameInput" placeholder={"Your nickname..."} />
                </div>

                <Button
                onClick={linkPet}
                    className={"nameSubmitButton"}
                    buttonIcon={"submitButton"}
                    text={"Link Pet"}
                />
            </div>
        </div>
    );
};
