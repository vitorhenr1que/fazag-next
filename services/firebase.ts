import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIQ7uwXjwx1noCemkwkxIISSjrDm6MyxE",
  authDomain: "fazag-18ac2.firebaseapp.com",
  projectId: "fazag-18ac2",
  storageBucket: "fazag-18ac2.appspot.com",
  messagingSenderId: "749790195986",
  appId: "1:749790195986:web:76230a0a50ff7d2cc803cb",
  measurementId: "G-Q92YDDZNWQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);