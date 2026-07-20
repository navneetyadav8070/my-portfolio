import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  isSignInWithEmailLink
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc, 
  serverTimestamp, 
  getDoc 
} from 'firebase/firestore';

// EDIT: Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDgdJvkBAgc_Mz507G_UnsPTjvMGu9pDEA",
  authDomain: "developer-6fe03.firebaseapp.com",
  projectId: "developer-6fe03",
  storageBucket: "developer-6fe03.firebasestorage.app",
  messagingSenderId: "307710858971",
  appId: "1:307710858971:web:aa0bc7d1d335b96ba79efe"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// 🔥 Email Link (OTP) Auth
export const sendAdminOTP = async (email) => {
  const actionCodeSettings = {
    url: window.location.origin + '/ny-admin-8070',
    handleCodeInApp: true,
  };
  
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  window.localStorage.setItem('emailForSignIn', email);
};

// 🔥 Re-export Firebase functions
export { isSignInWithEmailLink, signInWithEmailLink };

// Auth functions
export const loginWithGoogle = async () => await signInWithPopup(auth, googleProvider);
export const loginWithEmail = async (email, password) => await signInWithEmailAndPassword(auth, email, password);
export const registerWithEmail = async (email, password) => await createUserWithEmailAndPassword(auth, email, password);
export const logoutUser = async () => await signOut(auth);
export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);

// Firestore functions
export const getClientProjects = async (clientEmail) => {
  const q = query(collection(db, 'projects'), where('clientEmail', '==', clientEmail));
  const snapshot = await getDocs(q);
  const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  projects.sort((a, b) => {
    const timeA = a.createdAt?.toDate?.() || new Date(0);
    const timeB = b.createdAt?.toDate?.() || new Date(0);
    return timeB - timeA;
  });
  return { docs: projects.map(p => ({ id: p.id, data: () => p })) };
};