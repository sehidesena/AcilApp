// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQhC-wjU0vsnLOQ0Ege0CyKbRQyjnxo3g",
  authDomain: "acilapp-e771d.firebaseapp.com",
  projectId: "acilapp-e771d",
  storageBucket: "acilapp-e771d.firebasestorage.app",
  messagingSenderId: "733191107868",
  appId: "1:733191107868:web:27f14d3cefb408a1acf6d9",
  measurementId: "G-16BCBT1DJ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
export { db };