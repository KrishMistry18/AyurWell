import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbLW4u88uwzUPrfgMNgfbL8pOwUTdRYi4",
  authDomain: "ayurwell-d8f6c.firebaseapp.com",
  projectId: "ayurwell-d8f6c",
  storageBucket: "ayurwell-d8f6c.firebasestorage.app",
  messagingSenderId: "585638389735",
  appId: "1:585638389735:web:64bea76d635ce9f06cbf42",
  measurementId: "G-FTPGK6LZP7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
