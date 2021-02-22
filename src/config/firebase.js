// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyB2npnPLoC0U5TRmhse9saSeRd8m0wZNmo",
    authDomain: "kartik-demo-app.firebaseapp.com",
    projectId: "kartik-demo-app",
    storageBucket: "kartik-demo-app.appspot.com",
    messagingSenderId: "187265162586",
    appId: "1:187265162586:web:8ec70749637c744bb6a763"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default {
    auth: firebase.auth,
    firestore: firebase.firestore,
    firebase: firebase
}