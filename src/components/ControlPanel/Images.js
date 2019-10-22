import React, {useState, useEffect} from "react";
import { GridList, Grid, Card, CardActionArea, CardMedia, CardActions, Button } from "@material-ui/core";

import Firebase from "../Firebase";

const database = Firebase.database();
function Images({deleteImage, filter}) {
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
            <Grid spacing={4} container>
                {(imageData !== null) ? Object.keys(imageData).filter((key)=>{
                    if(imageData[key].status === filter) {
                        return true;
                    } else {
                        return false;
                    }
                }).map(key=> {
                    var image = imageData[key];
                    return(
                    <Grid item style={{height: "30vh", marginTop: "24px"}} xs={3} key = {key}>
                        <Image deleteImage={deleteImage} id ={key} image={image} />
                    </Grid>
                )}): null}
            </Grid>
        </div>
    )
}

function Image ({id, image, deleteImage}){
    return(
    <Card>
        <CardActionArea>
            <CardMedia
                height="240"
                width="100vw" 
                component="img"
                image={image.url}
            />
        </CardActionArea>
        <CardActions>
            <Button size="small" color="primary" onClick={()=>deleteImage(id, image.status)}>
                {image.status==="active" ? "Delete" : "Undo" }
            </Button>
        </CardActions>
    </Card>
    )
}
export default Images