// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "luminaweb-92dca.firebaseapp.com",
  projectId: "luminaweb-92dca",
  storageBucket: "luminaweb-92dca.firebasestorage.app",
  messagingSenderId: "895990503696",
  appId: "1:895990503696:web:d5c07bf0e0d2aa5c056d95"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };