// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCuwBKP3oWtS2ljfrTo4ThUxUYzd2JcFe4",
  authDomain: "mockmate-6df5e.firebaseapp.com",
  projectId: "mockmate-6df5e",
  storageBucket: "mockmate-6df5e.firebasestorage.app",
  messagingSenderId: "943209630083",
  appId: "1:943209630083:web:1649ee6452e4b49ce50eb6",
  measurementId: "G-3VSM0H2CVT"
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);