import React from "react";
import Firebase from "../Firebase";
import firebase from "firebase";
import "firebase/storage";
import shortid from "shortid";
import {FilePond, registerPlugin} from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";


// And import the necessary css
import "filepond/dist/filepond.min.css"
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const storage = Firebase.storage().ref();
const database = Firebase.database();
const imagesRef = database.ref().child("114").child("slideshowImages");


  export default function ImageUpload({
    onRequestSave,
    onRequestClear,
    defaultFiles = [],
  }) {
    // use a useState hook to maintain our files collection
    const [files, setFiles] = React.useState(defaultFiles)
    const server = {
        // this uploads the image using firebase
        process: (fieldName, file, metadata, load, error, progress, abort) => {
          // create a unique id for the file
          const id = shortid.generate()
      
          // upload the image to firebase
          const task = storage.child('images/' + id).put(file, {
            contentType: 'image/jpeg',
          })
          // monitor the task to provide updates to FilePond
          task.on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            snap => {
              // provide progress updates
              progress(true, snap.bytesTransferred, snap.totalBytes)
            },
            err => {
              // provide errors
              error(err.message)
            },
            snap => {
              // the file has been uploaded
              storage.child("images/"+id)
              .getDownloadURL()
              .then(url => {
                imagesRef.child(id).set({url: url}).then(()=>{
                    console.log("Added to database")
                });
                  
              })
              load(id)
              
            }
          )
        },
      
        // this loads an already uploaded image to firebase
        load: (source, load, error, progress, abort) => {
          // reset our progress
          progress(true, 0, 1024)
      
          // fetch the download URL from firebase
          storage
            .child('images/' + source)
            .getDownloadURL()
            .then(url => {
              // fetch the actual image using the download URL
              // and provide the blob to FilePond using the load callback
              let xhr = new XMLHttpRequest()
              xhr.responseType = 'blob'
              xhr.onload = function(event) {
                let blob = xhr.response
                load(blob)
              }
              xhr.open('GET', url)
              xhr.send()
            })
            .catch(err => {
              error(err.message)
              abort()
            })
        },
      }
    return (
      <FilePond
        files={files}
        allowMultiple={true}
        maxFiles={10}
        onprocessfiles={()=>{
            setTimeout(()=>{
                console.log("Timeout running");
                setFiles([]);
            }, 5000)
        }}
        onupdatefiles={fileItems => {
          if (fileItems.length === 0) {
            setFiles([]);
            onRequestClear()
          }
  
          setFiles(fileItems.map(fileItem => fileItem.file))
        }}
        server={server} // todo: add custom server functionality using firebase
      />
    )
  }

