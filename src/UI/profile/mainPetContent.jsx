// import { UserModel } from "../../game/models/UserModel"
// import { HOST } from "../../sharedConstants/constants"
// import { statsConstant } from "../../sharedConstants/stats"
// import { shortenText } from "../../utils/stringUtils"
// import { Stat } from "../stats/stat"


// export const MainPetContent = (props)=>{
//     return (<>
//             <img style={{transform:"scale(1.5"}} src={HOST+"assets/ui/petStats/statsFrame.png"}></img>
//             <div>
//                 <div className="statsAvatar">
//                     <span className="user-id-text">{shortenText(UserModel.USER_ID) }</span>
//                     <img src={HOST+"assets/ui/petStats/statsProfile.png"}></img>
//                     <img className="statsAvatarImage" src={HOST+"assets/nftAvatar.jpg"}></img>
//                     <img className="petViewNameBoard" src={HOST+"assets/ui/linkPet/nameInput.png"}></img>
//                     <span style={{position:"absolute",fontSize:"8px",color:"black",top:"60px",left:"-10px"}}>{props.petData.Name }</span>
//                     <div className={"petViewMainInfoContainer"}>
//                         <span>Lv.13</span>
//                         <div>
//                             <img src={HOST+"assets/coin.png"}></img>
//                             <span>{13}</span>
//                         </div>
//                         <div>
//                             <img src={HOST+"assets/hearthIcon.png"}></img>
//                             <span>{props.petData.lives}</span>
//                         </div>
//                         <div>
//                             <img src={HOST+"assets/hourGlassIcon.png"}></img>
//                             <span>{7}</span>
//                         </div>
//                     </div>
//                 </div>
//                 <div style={{transform:"scale(1.5)", top:"-160px",left:"125px"}}className="statsView">
//                     {/* TODO: Health stat should be bigger and only 1 in line && low stats should have red fill*/}
//                     <div className="stats">
//                         {statsConstant.map(stat => (
//                          <Stat fill={props.petData ? props.petData[stat.valueKey] : 0 } reversedValue={stat.reversedValue} className="petViewStats" icon={stat.icon}></Stat>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </>)
// }









// // export const MainPetContent = (props)=>{
// //     return (<>
// //             <img style={{transform:"scale(1.5"}} src={HOST+"assets/ui/petStats/statsFrame.png"}></img>
// //             <div>
// //                 <div className="statsAvatar">
// //                     <span className="user-id-text">{shortenText(UserModel.USER_ID) }</span>
// //                     <img src={HOST+"assets/ui/petStats/statsProfile.png"}></img>
// //                     <img className="statsAvatarImage" src={HOST+"assets/nftAvatar.jpg"}></img>
// //                     <img className="petViewNameBoard" src={HOST+"assets/ui/linkPet/nameInput.png"}></img>
// //                     <span style={{position:"absolute",fontSize:"8px",color:"black",top:"60px",left:"-10px"}}>{props.petData.Name }</span>
// //                     <div className={"petViewMainInfoContainer"}>
// //                         <span>Lv.13</span>
// //                         <div>
// //                             <img src={HOST+"assets/coin.png"}></img>
// //                             <span>{13}</span>
// //                         </div>
// //                         <div>
// //                             <img src={HOST+"assets/hearthIcon.png"}></img>
// //                             <span>{props.petData.lives}</span>
// //                         </div>
// //                         <div>
// //                             <img src={HOST+"assets/hourGlassIcon.png"}></img>
// //                             <span>{7}</span>
// //                         </div>
// //                     </div>
// //                 </div>
// //                 <div style={{transform:"scale(1.5)", top:"-160px",left:"125px"}}className="statsView">
// //                     {/* TODO: Health stat should be bigger and only 1 in line && low stats should have red fill*/}
// //                     <div className="stats">
// //                         {statsConstant.map(stat => (
// //                          <Stat fill={props.petData ? props.petData[stat.valueKey] : 0 } reversedValue={stat.reversedValue} className="petViewStats" icon={stat.icon}></Stat>
// //                         ))}
// //                     </div>
// //                 </div>
// //             </div>
// //         </>)
// // }