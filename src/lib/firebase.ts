
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDCLqJHwZDLQydboXaioYl7LN1xejIVNW4",
  authDomain: "adpulse-analytics-644b0.firebaseapp.com",
  projectId: "adpulse-analytics-644b0",
  storageBucket: "adpulse-analytics-644b0.appspot.com",
  messagingSenderId: "168984041768",
  appId: "1:168984041768:web:f4a29993f374344dfc581d",
  measurementId: "G-LQF3P6HQVS"
};

// Initialize Firebase and export services
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
