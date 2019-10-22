import React, {useState, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { borders } from '@material-ui/system';
import { Typography, Container, Paper, FormControlLabel, Switch } from '@material-ui/core';

import Firebase from "./Firebase";

const database = Firebase.database();
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

function BarView({barArea}) {
    const classes = useStyles();
    const defaultProps = {
        bgcolor: 'background.paper',
        paddingTop: "100%",
        style: {width: "100%"},
      };

    return (
        <Paper className={classes.barGrid} justify="center">
            <Typography variant="h3">Available Seats at the Bar</Typography>
            <Typography variant="subtitle">*Bar seating is first come first serve*</Typography>
            <Grid style={{marginTop: "32px"}} spacing={0} alignItems="stretch"  justify="center" container>
                {
                    barArea.map((row, indexRow)=>{
                        return(
                            row.map((column, index)=>{
                                return (
                                    <BarSeat column = {index} row = {indexRow} key = {"column:"+index + "row" +row} itemValue={column} />
                                )
                            })
                        );
                    })
                }

        </Grid>
        </Paper>
    );  
}

function BarManage({barArea, setBarArea}){
    const [enabledStatus, setEnabledStatus] = useState(false);
    const classes = useStyles();
    const statusRef = database.ref().child("114").child("settings");
    const defaultProps = {
        bgcolor: 'background.paper',
        paddingTop: "100%",
        style: {width: "100%"},
      };

    function markDirty(row, column) {
        var temp = [...barArea];
        temp[row][column]["clean"] = !temp[row][column]["clean"]; 
        setBarArea(temp);
    }
    const handleEnabledStatusChange = event => {
        setEnabledStatus(event.target.checked);
        statusRef.child("showBarSeats").set(event.target.checked);
    }
    useEffect(()=>{
        statusRef.child("showBarSeats").once("value").then((snap)=>{
            setEnabledStatus(snap.val());
        })
    }, []);

    
    return (
        <Container style={{paddingTop: "16px"}} className={classes.barGrid} justify="center">
            <Grid container>
                <Grid item xs={10}>
                    <Grid style={{marginTop: "32px"}} spacing={0} alignItems="stretch"  justify="center" container>
                        {
                            barArea.map((row, indexRow)=>{
                                return(
                                    row.map((column, index)=>{
                                        return (
                                            <BarSeat markDirty={markDirty} column = {index} row = {indexRow} key = {"column:"+index + "row" +row} itemValue={column} />
                                        )
                                    })
                                );
                            })
                        }

                    </Grid>
                </Grid>
                <Grid item xs={2}>
                <FormControlLabel 
                    control={
                        <Switch 
                            checked={enabledStatus}
                            onChange={handleEnabledStatusChange}
                            value="enabledStatus" 
                        />
                    }
                    label="Enabled Bar Slide"
                />
            </Grid>
            </Grid>

        </Container>
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

export {BarManage, BarView}