
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA2E1C50-ZiqkfWtoZh0k_5T-Ri3p1T7S4",
  authDomain: "feb-38d20.firebaseapp.com",
  databaseURL: "https://feb-38d20-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "feb-38d20",
  storageBucket: "feb-38d20.firebasestorage.app",
  messagingSenderId: "376674884472",
  appId: "1:376674884472:web:0cb538d78e94592f25068d",
  measurementId: "G-20Q3CJ2XQM"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
