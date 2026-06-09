import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  // IMPORTANT: Replace with your actual Firebase Web API Key
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_FIREBASE_API_KEY",
  authDomain: "ayurwell-d8f6c.firebaseapp.com",
  projectId: "ayurwell-d8f6c",
  storageBucket: "ayurwell-d8f6c.firebasestorage.app",
  messagingSenderId: "1234567890", // Replace if needed
  appId: "1:1234567890:web:abcdef" // Replace if needed
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
