import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAfZO6HpM7ansyavAjjeIF-8-JlijC3eJs",
  authDomain: "moneymind-14556.firebaseapp.com",
  projectId: "moneymind-14556",
  storageBucket: "moneymind-14556.firebasestorage.app",
  messagingSenderId: "34679673649",
  appId: "1:34679673649:web:3594a37bf71d1be5e59610",
  measurementId: "G-PHHFEN2G17"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot
};

export default app;
