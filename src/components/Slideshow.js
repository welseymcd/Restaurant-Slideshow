import React, {useEffect, useState} from 'react';
import Bar from "./Bar";
import { Box } from '@material-ui/core';
import Firebase from "./Firebase";

const database = Firebase.database();

export default function Slideshow({barOverride, barFrequency, displayInSeconds}) {
    var images = ["https://image.businessinsider.com/5d029e166fc92003bc28ee09?width=1300&format=jpeg&auto=webp",
                    "https://www.destinationmansfield.com/wp-content/uploads/upload/images/members/dining/restaurants/Texas_Roadhouse/xphoto.JPG.pagespeed.ic.hLNyDow_qz.webp",
                    "http://blogliterati.com/wp-content/uploads/2018/03/Texas-Roadhouse-La-Mer_3.jpg"
    ]
    const imagesRef = database.ref().child("114").child("slideshowImages");

    barFrequency = 3;
    displayInSeconds = 5;
    const [currentImage, setCurrentImage] = useState(0);
    const [pictures, setPictures] = useState([]);
    const [elements, setElements] = useState([]);
    const timerFunction = () => {
        console.log(currentImage);  
        if(currentImage + 1 === elements.length){
            setCurrentImage(0);
        } else {
            setCurrentImage(currentImage + 1);
        }
    }
    const [barSeats, setBarSeats] = useState([])
    const setBarArea = (temp) =>{
        barLayoutRef.set(temp);
        setBarSeats(temp);
    } 
    const barLayoutRef = database.ref().child("114").child("barLayout");
    const handleNewImages = snap => {
        if(snap.val()){
            console.log("Loading new images")
            var tempElements = Object.keys(snap.val()).map((key)=>{
                var image = snap.val()[key];
                return (
                    <img height="100%" src = {image.url} alt={key} key = {key} />
                )
            })
            setPictures(tempElements);
        }
    }
    const handleNewBarSeats = snap => { 
        if(snap.val()){
             setBarSeats(snap.val());
             
         }
         console.log("New Bar loaded")
    }  

    // This use effect sets up a listener for the firebase database
    // listening for changes to the bar layout
    useEffect(()=>{
        barLayoutRef.on("value", handleNewBarSeats);
        return () => {barLayoutRef.off("value", handleNewBarSeats);}
       }, [])

    // This use effect sets up a listener for changes on the image 
    // changes
    useEffect(()=>{
        imagesRef.on("value", handleNewImages);

       return ()=> {
           imagesRef.off("value", handleNewImages);
       } 
    }, [])

    // This useEffect is used to combine the bar seating chart and the slideshow, together.
    // TODO:
    //      - Optional for the bar to show up or not.
    //      - Insert into the array more than once?
    useEffect(()=>{
        var tempElements = [(()=>{return(<Bar barArea={barSeats} setBarArea={setBarArea}/>)})(), ...pictures];
        setElements(tempElements);
    }, [barSeats, pictures])

    // This useEffect sets the timer for the slideshow
    // - Make the slideshow delay and option?
    
    useEffect(()=>{
        const timer = setTimeout(timerFunction, 5000);
        console.log(elements.length)
        return (()=> clearTimeout(timer))
    }, [currentImage])
    return(
        <Box alignItems="center" height={1} border={1}>{elements[currentImage]}</Box>
    )
}