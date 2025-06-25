import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBt2OF2Uh8HzK4dI5GvobbIALGhadmXKXY",
    authDomain: "unipart-assignment.firebaseapp.com",
    projectId: "unipart-assignment",
    storageBucket: "unipart-assignment.firebasestorage.app",
    messagingSenderId: "331709210970",
    appId: "1:331709210970:web:950d02475fd94be10cd363"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore DB
const firestore = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

export { auth, firestore };
export default firestore;
