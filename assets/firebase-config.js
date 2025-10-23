// ============================================
// FIREBASE CONFIGURATION
// ============================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  GeoPoint,
  doc,
  updateDoc,
  setDoc,
  getDoc
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Your DigiGet Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUBVjVH22qIBvHeknfeGXteQuT6jikvAA",
  authDomain: "digiget-l9.firebaseapp.com",
  projectId: "digiget-l9",
  storageBucket: "digiget-l9.firebasestorage.app",
  messagingSenderId: "66838869613",
  appId: "1:66838869613:web:51bf0664d55a3c164e3164"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export Firebase instances and modules
export {
  auth,
  db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  GeoPoint,
  doc,
  updateDoc,
  setDoc,
  getDoc
};
