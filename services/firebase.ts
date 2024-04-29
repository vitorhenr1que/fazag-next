import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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