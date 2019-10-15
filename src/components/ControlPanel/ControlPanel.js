import React, { useEffect, useState } from 'react';
import Bar from '../Bar';
import Firebase from "../Firebase";
import ImageUpload from "../ControlPanel/ImageUpload";
import Images from "./Images";
const testBarSetup = [
    [{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":2,
    "clean": true},{"type":1,
    "clean": true},{"type":1,
    "clean": true},{"type":1,
    "clean": true},{"type":1,
    "clean": true},{"type":3,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true}],
    [{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":1,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":1,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true}],
    [{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":1,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":1,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true}],
    [{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":1,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":1,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true}],
    [{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":1,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":1,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true}],
    [{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":1,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":1,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true}],
    [{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":1,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":1,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true},{"type":0,
    "clean": true}],

    
]
  // Your web app's Firebase configuration

  // Initialize Firebase
  var database = Firebase.database();
  var storage = Firebase.storage().ref();

function ControlPanel(){
    const barLayoutRef = database.ref().child("114").child("barLayout");
    const imagesRef = database.ref().child("114").child("slideshowImages");
    const [barSeats, setBarSeats] = useState([])
    const setBarArea = (temp) =>{
        barLayoutRef.set(temp);
        setBarSeats(temp);
    } 
    const [uploadImageId, setUploadImageId] = useState(null);
    useEffect(()=>{
     const handleNewBarSeats = snap => { 
        if(snap.val()){
             setBarSeats(snap.val());
         }
         console.log("New value loaded")
    }   
     barLayoutRef.on("value", handleNewBarSeats);

     return () => {barLayoutRef.off("value", handleNewBarSeats);}
    }, [])
    
    const onSave = (id, url) =>{
        console.log("Google File Saved: " + id)
        console.log(url);
        imagesRef.child(id).set({url: url});
        setUploadImageId(null);
    }

    return(
        <div><ImageUpload defaultFiles={[]} onRequestClear={()=>{setUploadImageId(null)}} onRequestSave={onSave} />
        <Images />
        
        </div>
    )
}

export default ControlPanel