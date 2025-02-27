import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCvEYvhjpYMz29KXj-n795H0GwA26YCQPI",
    authDomain: "event-planner-2a016.firebaseapp.com",
    projectId: "event-planner-2a016",
    storageBucket: "event-planner-2a016.firebasestorage.app",
    messagingSenderId: "433600383857",
    appId: "1:433600383857:web:099441ad748d8f269384d0",
    measurementId: "G-RW5E9L75RY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
export { auth, signInWithEmailAndPassword,db };