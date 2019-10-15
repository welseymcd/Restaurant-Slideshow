import React, { useEffect, useState } from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Bar from '../Bar';
import Firebase from "../Firebase";
import ImageUpload from "../ControlPanel/ImageUpload";
import Images from "./Images";
import {Drawer, MenuList, IconButton, AppBar, Toolbar, Typography, MenuItem, Button } from '@material-ui/core';
import MenuIcon from "@material-ui/icons/Menu";

import {Route, Switch, useRouteMatch, useParams, Link} from "react-router-dom";
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

const useStyles = makeStyles(theme => ({
    menuButton: {
        marginRight: theme.spacing(2),
    }, 
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
    }

}));
  // Your web app's Firebase configuration

  // Initialize Firebase
  var database = Firebase.database();
  var storage = Firebase.storage().ref();
 //
function ControlPanel(){
    const barLayoutRef = database.ref().child("114").child("barLayout");
    const imagesRef = database.ref().child("114").child("slideshowImages");
    const [barSeats, setBarSeats] = useState([])
    const [drawerOpen, setDrawerState] = useState(false);
    const setBarArea = (temp) =>{
        barLayoutRef.set(temp);
        setBarSeats(temp);
    } 
    const [uploadImageId, setUploadImageId] = useState(null);
    const classes = useStyles();
    const match = useRouteMatch();
    const toggleDrawer = (open) => event => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
          }
        console.log("Should be switching!")
        setDrawerState(!drawerOpen);
    };

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
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton onClick={toggleDrawer()} className={classes.menuButton} edit="start" color="inherit">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">Management Panel</Typography>

                </Toolbar>
            </AppBar>
            <Switch>
                <Route path={`${match.path}/bar`}>
                    <Bar barArea={barSeats} setBarArea={setBarArea} />
                </Route>
                <Route path={match.path}>
                    <ImageUpload defaultFiles={[]} onRequestClear={()=>{setUploadImageId(null)}} onRequestSave={onSave} />
                    <Images />
                </Route>
            </Switch>
            <Drawer open={drawerOpen} onClose={toggleDrawer()}>
                <div onClick={toggleDrawer()}>
                    <DrawerMenu />
                </div>    
            </Drawer> 

        </div>
    )
}

const DrawerMenu = () =>{
    return(<MenuList>
        <MenuItem component="Button">
            <Link to="/manage/"><Typography variant="inherit">Image Management</Typography></Link>
        </MenuItem>
        <MenuItem>
            <Link to="/manage/bar"><Typography variant="inherit">Bar Area Management</Typography></Link>
        </MenuItem>
    </MenuList>
    );
}

export default ControlPanel