import React, {useState, useEffect} from "react";
import {FormControl, Box, Toolbar, Container, Select, Menu, MenuItem, FormHelperText } from "@material-ui/core";
import Images from "./Images";
import ImageUpload from "./ImageUpload";
import Firebase from "../Firebase";

// Firebase definitions
var database = Firebase.database();
var storage = Firebase.storage().ref();

function ImageControlPanel(){
    // States
    const [uploadImageId, setUploadImageId] = useState(null);
    const [imageFilter, setImageFilter] = useState("active");
    // Firebase refs
    const imagesRef = database.ref().child("114").child("slideshowImages");


    const onSave = (id, url) =>{
        console.log("Google File Saved: " + id)
        console.log(url);
        imagesRef.child(id).set({url: url});
        setUploadImageId(null);
    }
    const handleFilterChange = event => {
        setImageFilter(event.target.value);
    }
    const deleteImage = (id, status) =>{
         const specifiedImageRef = imagesRef.child(id);
         var newStatus = (status==="active") ? "inactive" : "active";
        specifiedImageRef.update({
            status: newStatus,
        })
    }
    return(
        <Container style={{}}>
            <ImageUpload  defaultFiles={[]} onRequestClear={()=>{setUploadImageId(null)}} onRequestSave={onSave} />
            <Toolbar>
                <FormControl>
                <FormHelperText>Image Filter</FormHelperText>                   

                    <Select
                        value={imageFilter}
                        onChange={handleFilterChange}
                        inputProps={{
                            name: 'filter',
                            id: 'filter-label-placeholder'
                        }}
                        name="filter"
                    >
                        <MenuItem value="active">
                            Active
                        </MenuItem>
                        <MenuItem value="inactive">
                            Inactive
                        </MenuItem>
                    </Select>
                </FormControl>
            </Toolbar>
            <Images filter={imageFilter} deleteImage = {deleteImage} />
        </Container>
    );
}

export {ImageControlPanel};