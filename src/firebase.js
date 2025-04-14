// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBX6-umin8lvSXFxi-xpFCPrHpEEQfWkqk",
  authDomain: "dignitary-tracker.firebaseapp.com",
  projectId: "dignitary-tracker",
  storageBucket: "dignitary-tracker.firebasestorage.app",
  messagingSenderId: "697251295075",
  appId: "1:697251295075:web:0f1a1fb5cf21d1f41aad56"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);