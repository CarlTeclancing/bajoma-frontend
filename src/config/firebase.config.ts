// Firebase Web SDK configuration for real-time messaging
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, onValue, off, set, remove, push, query, limitToLast, orderByChild, onDisconnect } from 'firebase/database';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBm8djMSeaJQrQ1uZDTTVU-8HMN5MF2CmA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "learning-769c0.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://learning-769c0-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "learning-769c0",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "learning-769c0.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "286257368962",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:286257368962:web:b1435307d1acecacfb099b",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-JGVKP3RC47"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const database = getDatabase(app);

export { 
  database, 
  ref, 
  onValue, 
  off, 
  set, 
  remove, 
  push, 
  query, 
  limitToLast,
  orderByChild,
  onDisconnect
};
