import firebase from "firebase/app";
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

// firebase init - add your own config here
const firebaseConfig = {
    apiKey: "AIzaSyDrj21HB3Y_qk3gnGkzxRTvFj2qvIj_ezg",
    authDomain: "hora-do-up.firebaseapp.com",
    projectId: "hora-do-up",
    storageBucket: "hora-do-up.appspot.com",
    messagingSenderId: "441048775037",
    appId: "1:441048775037:web:4b12c98975367b6e8ff414",
    measurementId: "G-PKZ4EGB75M"
};

firebase.initializeApp(firebaseConfig);

// export utils
export default firebase