import React from "react";


import {Box} from "@material-ui/core";


const SlideShowPreload = ({interval}) => {
    interval = 5;

    return(
        <Box alignItems="center" height={1} border={1}>
            <Box height={1} display={((slidesSinceCustom < barFrequency))?null : "none"}>{element}</Box>
            <Box height={1} display={((slidesSinceCustom >= barFrequency) && customSlideEnabled)?null:"none"}><BarView barArea={barSeats}/></Box>
        </Box>
    );
} 