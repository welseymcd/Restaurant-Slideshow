import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { borders } from '@material-ui/system';
import { Typography, Paper } from '@material-ui/core';

const useStyles = makeStyles({
    empty: {
        background: "white",
    },
    open: {
        background: "green",
        
    },
    barGrid: {
        maxWidth: "1000px",
        height: "100%",
        margin: "auto"
    },

})

export default function Bar({barArea, setBarArea}) {
    const classes = useStyles();

    function markDirty(row, column) {
        var temp = [...barArea];
        temp[row][column]["clean"] = !temp[row][column]["clean"]; 
        setBarArea(temp);
    }
    const defaultProps = {
        bgcolor: 'background.paper',
        paddingTop: "100%",
        style: {width: "100%"},
      };

    return (
        <Paper className={classes.barGrid} borderColor="text.primary" justify="center">
            <Typography variant="h3">Available Seats at the Bar</Typography>
            <Typography variant="subtitle">*Bar seating is first come first serve*</Typography>
            <Grid style={{marginTop: "32px"}} spacing={0} alignItems="stretch"  justify="center" container>
                {
                    barArea.map((row, indexRow)=>{
                        return(
                            row.map((column, index)=>{
                                return (
                                    <BarSeat column = {index} row = {indexRow} key = {"column:"+index + "row" +row} markDirty={markDirty} itemValue={column} />
                                )
                            })
                        );
                    })
                }

        </Grid>
        </Paper>
    );  
}


function BarSeat({itemValue, markDirty, column, row}) {
    const seatProps ={
        style: {
            background: "white",
            borderRadius: "0px"
        },
        border: 0,
        borderColor: "text.primary"
      };
      if(itemValue["type"] !== 0){
          seatProps.border = 1;
          seatProps.style["width"]= "100%";
          seatProps.paddingTop = "100%";
      }
      // Define the seat color

      if(itemValue["clean"] === true){
          seatProps.style.background = "green";
      } else {
          seatProps.style.background = "#A9A9A9";
      }

      if(itemValue.type===2){
        seatProps.style["borderTopLeftRadius"] = "50px";
      } else if (itemValue.type === 3){
        seatProps.style["borderTopRightRadius"] = "50px";
      }

    return(
        <Grid item xs = {1}>
            <Box onClick={()=>markDirty(row, column)}{...seatProps}></Box>
        </Grid>
    )
}