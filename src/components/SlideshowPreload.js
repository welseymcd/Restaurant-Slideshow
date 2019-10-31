import React, { useState, useEffect } from "react";
import Firebase from "./Firebase";
import {Box} from "@material-ui/core";

import {BarView} from "./Bar";
const database = Firebase.database()

const SlideShowTimer = ({interval}) => {
    const [tickCount, setTickCount] = useState(0);
    const maxTickCount = (24*60*60) / interval;
    const timerFunction = () => {
        if(tickCount + 1 <= maxTickCount){
            setTickCount(tickCount + 1);
        } else {
            setTickCount(0);
        }
    }
    useEffect(()=>{
        const timer = setInterval(timerFunction, interval);
        return ()=> clearInterval(timer)
    }, [tickCount])
    return(
        <SlideShowPreload tick={tickCount} />
    )
}
const SlideShowPreload = ({tick}) => {
        // State Definitions
        const [pictures, setPictures] = useState([]);
        const [currentImageCount, setCurrentImageCount] = useState(89);
        const [currentImage, setCurrentImage] = useState("none");
        const [slidesSinceCustom, setSlidesSinceCustom] = useState(0);
        const [slidesSinceBar, setSlidesSinceBar] = useState(0);
        const [barSlideViewState, setBarSlideViewState] = useState(false);
        const [barSeats, setBarSeats] = useState([])
        const [imageElementCount, setImageElementCount] = useState(0);
        const [imageElementViewState, setImageElementViewState] = useState([true,false,false]);
        const [imageElementImageSource, setImageElementImageSource] = useState(["", "", ""]);
        // Firebase ref definitions
        const imagesRef = database.ref().child("114").child("slideshowImages");
        const barLayoutRef = database.ref().child("114").child("barLayout");

        const barInterval = 5;
        const customInterval = 5;
        // Function Defintions
        const handleNewImages = snap => {
        if(snap.val()){
            console.log("Loading new images")
            var tempElements = Object.keys(snap.val()).map((key)=>{
                var image = snap.val()[key];
                return {
                    key: key,
                    url: image.url
                }
            })
            console.log(tempElements)
            setPictures(tempElements);
            console.log(tempElements[0]);
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
        imagesRef.orderByChild("status").equalTo("active").on("value", handleNewImages);

       return ()=> {
           imagesRef.off("value", handleNewImages);
       } 
    }, [])
    useEffect(()=>{
        barLayoutRef.on("value", handleNewBarSeats);
        return () => {barLayoutRef.off("value", handleNewBarSeats);}
       }, [])
    useEffect(()=>{
        if(pictures.length > 0){
            var tempImageElements = [...imageElementImageSource];
            var tempViewState = [... imageElementViewState];
            if(slidesSinceBar === barInterval){
                setBarSlideViewState(true);
                setSlidesSinceBar(0);
                setImageElementViewState([false, false, false])
            } else {
                if(barSlideViewState){
                    setBarSlideViewState(false)
                }
                if(imageElementCount === 0){
                    tempImageElements[2] = pictures[currentImageCount].url;
                    setImageElementCount(imageElementCount + 1);
                    setImageElementImageSource(tempImageElements);
                    tempViewState[imageElementCount] = false;
                    tempViewState[imageElementCount + 1] = true;
                } else if(imageElementCount === 1) {
                    tempImageElements[0] = pictures[currentImageCount].url;
                    setImageElementCount(imageElementCount + 1);
                    setImageElementImageSource(tempImageElements);
                    tempViewState[imageElementCount] = false;
                    tempViewState[imageElementCount + 1] = true;
                } else {
                    tempImageElements[1] = pictures[currentImageCount].url;
                    setImageElementImageSource(tempImageElements);
                    setImageElementCount(0);
                    tempViewState[imageElementCount] = false;
                    tempViewState[0] = true;
                }
                setImageElementViewState(tempViewState);
                setSlidesSinceBar(slidesSinceBar + 1);
                if(currentImageCount === pictures.length - 1){
                    setCurrentImageCount(0);
                } else {
                    setCurrentImageCount(currentImageCount + 1);
                }
            }

        }
    }, [tick])
    return(
        <Box alignItems="center" height={1}>
            <Box height={1} display={((imageElementViewState[0]))?null : "none"}><img height="100%" src={imageElementImageSource[0]} /></Box>
            <Box height={1} display={((imageElementViewState[1]))?null : "none"}><img height="100%" src={imageElementImageSource[1]} /></Box>
            <Box height={1} display={((imageElementViewState[2]))?null : "none"}><img height="100%" src={imageElementImageSource[2]} /></Box>
            <Box height={1} display={(barSlideViewState)?null : "none"}><BarView barArea={barSeats}/></Box>


        </Box>
    );
} 

export {SlideShowTimer};