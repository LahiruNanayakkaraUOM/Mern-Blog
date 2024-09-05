// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = { 
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-ac2eb.firebaseapp.com",
  projectId: "mern-blog-ac2eb",
  storageBucket: "mern-blog-ac2eb.appspot.com",
  messagingSenderId: "548919761553",
  appId: "1:548919761553:web:d3664dde02293d56d8fd30",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
