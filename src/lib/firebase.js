import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Configuração do Firebase do aplicativo web
const firebaseConfig = {
  apiKey: "AIzaSyBKIGKLfhPHpFOSpkPaqm8v1D6GadSe7Lg",
  authDomain: "sistema-prisional-multi.firebaseapp.com",
  projectId: "sistema-prisional-multi",
  storageBucket: "sistema-prisional-multi.firebasestorage.app",
  messagingSenderId: "658221532460",
  appId: "1:658221532460:web:2eab7399c21f3a89f61889"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

