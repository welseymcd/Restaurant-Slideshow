import firebase from 'firebase/app';
import "firebase/storage";
import "firebase/database";
var firebaseConfig = {
    apiKey: "AIzaSyAbEIc-8EsuT5-GsRLU9EeyB9ISRMq41-Y",
    authDomain: "photowebapp-8e07e.firebaseapp.com",
    databaseURL: "https://photowebapp-8e07e.firebaseio.com",
    projectId: "photowebapp-8e07e",
    storageBucket: "photowebapp-8e07e.appspot.com",
    messagingSenderId: "1097527464840",
    appId: "1:1097527464840:web:be2929114306571b97203d",
    measurementId: "G-VCRQTD51DP"
  };

const Firebase = firebase.initializeApp(firebaseConfig);

export default Firebase;