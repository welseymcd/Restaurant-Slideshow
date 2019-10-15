import React, {useState, useEffect} from "react";
import { GridList, GridListTile } from "@material-ui/core";

import Firebase from "../Firebase";

const database = Firebase.database();
function Images() {
    const [imageData, setImageData] = useState(null);
    const imagesRef = database.ref().child("114").child("slideshowImages");
    
    const handleNewImage = snap =>{
        if(snap.val()){
            setImageData(snap.val())

        }
    }
    
    useEffect(()=>{
        imagesRef.on("value", handleNewImage)
        return ()=>{imagesRef.off("value", handleNewImage)}
    }, [])
    console.log(imageData)
    return(
        <div>
            <GridList cellHeight={160} cols={4}>
                {(imageData !== null) ? Object.keys(imageData).map(key=> {
                    var image = imageData[key];
                    return(
                    <GridListTile key = {key}>
                        <img src={image.url} alt="Yup"/>
                    </GridListTile>
                )}): null}
            </GridList>
        </div>
    )
}

export default Images