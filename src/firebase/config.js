// src/firebase/config.js
// ⚠️  Remplace ces valeurs par celles de TON projet Firebase
import { initializeApp } from "firebase/app";
import { getFirestore }  from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCJ-6GZCstUIl0HhPkOJ8_L49N5FQJREq8",
  authDomain: "lxco-tasks.firebaseapp.com",
  projectId: "lxco-tasks",
  storageBucket: "lxco-tasks.firebasestorage.app",
  messagingSenderId: "85069984346",
  appId: "1:85069984346:web:9b39eaf020d647c8dd9e63",
  measurementId: "G-G0C1ZMEE4X"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
