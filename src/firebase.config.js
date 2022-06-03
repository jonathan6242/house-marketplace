import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8iSxkd21UfgQjop2kyqPJgUwZTWWJp9M",
  authDomain: "house-marketplace-91bef.firebaseapp.com",
  projectId: "house-marketplace-91bef",
  storageBucket: "house-marketplace-91bef.appspot.com",
  messagingSenderId: "778912169588",
  appId: "1:778912169588:web:6cd5a81870c1ff18765b21"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();