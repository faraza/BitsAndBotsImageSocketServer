import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyD6-aU_uME6OioiQdJZx22F4LItcxUiKW8",
    authDomain: "bitsandbots.firebaseapp.com",
    projectId: "bitsandbots",
    storageBucket: "bitsandbots.appspot.com",
    messagingSenderId: "889167914862",
    appId: "1:889167914862:web:8decea2efcb8e69d68c37f",
    measurementId: "G-F9WE4J599Q"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
