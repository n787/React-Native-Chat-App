// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
import firebase from 'firebase';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-cqkW440w5Y2exOys3D75h5AeCGLL4To",
  authDomain: "react-native-chat-app-12077.firebaseapp.com",
  projectId: "react-native-chat-app-12077",
  storageBucket: "react-native-chat-app-12077.appspot.com",
  messagingSenderId: "90988010737",
  appId: "1:90988010737:web:d6e982216c4d871bb1dd50"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();

export default db;