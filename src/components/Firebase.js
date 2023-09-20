// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB6aXIW9auYeJW5GYSLeW-cbyfi2smbkbQ",
  authDomain: "drag-and-drop-gallery.firebaseapp.com",
  projectId: "drag-and-drop-gallery",
  storageBucket: "drag-and-drop-gallery.appspot.com",
  messagingSenderId: "559923145879",
  appId: "1:559923145879:web:9beb00b2cc343144898dd2",
  measurementId: "G-GHXTC9WW79",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

export { auth };
