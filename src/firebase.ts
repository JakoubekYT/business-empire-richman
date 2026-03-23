import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDkb9bB3PKAXHwEt6tvu2l8tWFF7AU1XRc",
  authDomain: "business-empire-richman-e0fae.firebaseapp.com",
  projectId: "business-empire-richman-e0fae",
  storageBucket: "business-empire-richman-e0fae.firebasestorage.app",
  messagingSenderId: "392446883090",
  appId: "1:392446883090:web:a745ae3d40e7e84df7afcb",
  measurementId: "G-K4VZBKHC6R",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
export default app;
