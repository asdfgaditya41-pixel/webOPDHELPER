import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration extracted from the Flutter project
const firebaseConfig = {
  apiKey: "AIzaSyBtpsSwr4pCahsENPaEKflLaCdQqlh_pco",
  authDomain: "hospital-app-aditya.firebaseapp.com",
  projectId: "hospital-app-aditya",
  storageBucket: "hospital-app-aditya.firebasestorage.app",
  messagingSenderId: "1007762784529",
  appId: "1:1007762784529:web:3c6eab2ba67443c6f2ccb0"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

// 🔍 Test Connection Function
export const testFirebaseConnection = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "beds"));
    console.log("🔥 Firebase Connection Test Success!");
    console.log("🛏️ Beds Data:", querySnapshot.docs.map(doc => doc.data()));
  } catch (error) {
    console.error("❌ Firebase Connection Test Failed:", error);
  }
};
