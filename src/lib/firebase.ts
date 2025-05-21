
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD0iZk_x9g2vfSI-yjdcSJ9Mfq9G5Z0eTc",
  authDomain: "loveablefeb25.firebaseapp.com",
  projectId: "loveablefeb25",
  storageBucket: "loveablefeb25.firebasestorage.app",
  messagingSenderId: "896531660566",
  appId: "1:896531660566:web:9175732c4fde506ca11a37",
  measurementId: "G-P5WCGP4V1F"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
