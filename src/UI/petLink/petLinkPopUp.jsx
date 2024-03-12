import { Button } from "../buttons/button";

export const PetLinkPopUp = (props) => {
    return (
        <div
            className={"petLinkPopUpContainer"}
            style={{ visibility: props.visibility }}
        >
            <img src="./assets/ui/linkPet/linkPetBoard.png"></img>
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
                    className={"nameSubmitButton"}
                    buttonIcon={"submitButton"}
                    text={"Submit!"}
                />
            </div>
        </div>
    );
};
