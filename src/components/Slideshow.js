import React, {useEffect, useState} from 'react';
import {BarView} from "./Bar";
import { Box, Typography } from '@material-ui/core';
import Firebase from "./Firebase";

const database = Firebase.database();

export default function Slideshow({barOverride, barFrequency, displayInSeconds}) {
    var images = ["https://image.businessinsider.com/5d029e166fc92003bc28ee09?width=1300&format=jpeg&auto=webp",
                    "https://www.destinationmansfield.com/wp-content/uploads/upload/images/members/dining/restaurants/Texas_Roadhouse/xphoto.JPG.pagespeed.ic.hLNyDow_qz.webp",
                    "http://blogliterati.com/wp-content/uploads/2018/03/Texas-Roadhouse-La-Mer_3.jpg"
    ]
    const imagesRef = database.ref().child("114").child("slideshowImages");
    const customSettingsRef = database.ref().child("114").child("settings");
    barFrequency = 5;
    displayInSeconds = 5;
    const [currentImage, setCurrentImage] = useState(0);
    const [pictures, setPictures] = useState([]);
    const [elements, setElements] = useState([]);
    const [slidesSinceCustom, setSlidesSinceCustom] = useState(0);
    const [barSeats, setBarSeats] = useState([])
    const [element, setElement] = useState(null);
    const [customSlideEnabled, setCustomSlideEnabled] = useState(false);
    const timerFunction = () => {
        console.log("Custom Slide Enabled " + customSlideEnabled); 
        if(customSlideEnabled){
            setSlidesSinceCustom(slidesSinceCustom + 1);
            if(slidesSinceCustom === barFrequency){
                setSlidesSinceCustom(0);
                console.log("Slides since custom slide: " + slidesSinceCustom)
            } else {
                setElement(elements[currentImage]);
                console.log("Slides since custom slide: " + slidesSinceCustom)
                if(currentImage + 1 === elements.length){
                    setCurrentImage(0);
                } else {
                    setCurrentImage(currentImage + 1);
                }
            }
        } else {
            setElement(elements[currentImage]);
            if(currentImage + 1 === elements.length){
                setCurrentImage(0);
            } else {
                setCurrentImage(currentImage + 1);
            }
        }


    }

    const setBarArea = (temp) =>{
        barLayoutRef.set(temp);
        setBarSeats(temp);
    } 
    
    const barLayoutRef = database.ref().child("114").child("barLayout");
    const handleEnableCustom = snap => {
        console.log("Custom Slide State Change");
        console.log(snap.val())
        if(snap.val() !== null) {
            setCustomSlideEnabled(snap.val())
        }
        console.log(customSlideEnabled)
        
    }
    const handleNewImages = snap => {
        if(snap.val()){
            console.log("Loading new images")
            var tempElements = Object.keys(snap.val()).map((key)=>{
                var image = snap.val()[key];
                return (
                    <img height="100%" src = {image.url} alt={key} key = {key} />
                )
            })
            console.log(tempElements)
            setPictures(tempElements);
            setElement(tempElements[0]);
            console.log(pictures);
        }
    }
    const handleNewBarSeats = snap => { 
        if(snap.val()){
             setBarSeats(snap.val());
             console.log("New Bar loaded")
         }
    }  
    useEffect(()=>{
        document.body.style.overflow = "hidden";
        return ()=> document.body.style.overflow = "visible"
    }, [])
    // This use effect sets up a listener for the firebase database
    // listening for changes to the bar layout
    useEffect(()=>{
        barLayoutRef.on("value", handleNewBarSeats);
        return () => {barLayoutRef.off("value", handleNewBarSeats);}
       }, [])

    // This use effect sets up a listener for changes on the image 
    // changes
    useEffect(()=>{
        imagesRef.orderByChild("status").equalTo("active").on("value", handleNewImages);
       return ()=> {
           imagesRef.off("value", handleNewImages);
       } 
    }, [])
    useEffect(()=>{
        customSettingsRef.child("showBarSeats").on("value", handleEnableCustom);
        return(()=>{
            customSettingsRef.off("value", handleEnableCustom);
        })
    }, [])
    // This useEffect is used to combine the bar seating chart and the slideshow, together.
    // TODO:
    //      - Optional for the bar to show up or not.
    //      - Insert into the array more than once?
    useEffect(()=>{
        if(pictures !== null){
            console.log(pictures);
            var tempElements = [...pictures];
            setElements(pictures);
            console.log("Setting Elements");
            console.log(elements);
        }
    }, [pictures])

    // This useEffect sets the timer for the slideshow
    // - Make the slideshow delay and option?
    
    useEffect(()=>{
        const timer = setInterval(timerFunction, 5000);
        console.log(elements.length)
        return (()=> clearInterval(timer))
    }, [currentImage, slidesSinceCustom])
    if(elements.length === 0){
        return(
        <Box alignItems="center" height={1} border={1}>
            <Typography variant="h6">Loading images</Typography>
        </Box>
        )
    }
    return(
        <Box alignItems="center" height={1} border={1}>
            <Box height={1} display={((slidesSinceCustom < barFrequency))?null : "none"}>{element}</Box>
            <Box height={1} display={((slidesSinceCustom >= barFrequency) && customSlideEnabled)?null:"none"}><BarView barArea={barSeats}/></Box>
        </Box>
    )
}9