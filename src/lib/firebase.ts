import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBEYpmgUFAq8v4_voQfL1ppFmW23RSwXY0",
  authDomain: "shein-revamp.firebaseapp.com",
  projectId: "shein-revamp",
  storageBucket: "shein-revamp.firebasestorage.app",
  messagingSenderId: "575272051996",
  appId: "1:575272051996:web:121c8cef5b817ba096c6d9",
  measurementId: "G-6QT23Y0N09"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
