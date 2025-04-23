// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDls7NYWxj7gWM9uDKj7ifixMJqMTUWzxM",
  authDomain: "budgetbrain-aec9b.firebaseapp.com",
  projectId: "budgetbrain-aec9b",
  storageBucket: "budgetbrain-aec9b.firebasestorage.app",
  messagingSenderId: "1053849902513",
  appId: "1:1053849902513:web:d69bebda792b426fcab190",
  measurementId: "G-VWFF64PTGM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
