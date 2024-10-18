// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDMmylBFz65i-B7Kmfypz0a5tUIWESIIWw",
  authDomain: "logitrack-f2b97.firebaseapp.com",
  projectId: "logitrack-f2b97",
  storageBucket: "logitrack-f2b97.appspot.com",
  messagingSenderId: "383135165631",
  appId: "1:383135165631:web:3889eb9d8b0b83f7a02a0a",
  measurementId: "G-VNZJGMEQCC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app)
export const storage = getStorage(app)