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
  isSignInWithEmailLink,
  sendPasswordResetEmail
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
  getDoc,
  orderBy
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDgdJvkBAgc_Mz507G_UnsPTjvMGu9pDEA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "developer-6fe03.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "developer-6fe03",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "developer-6fe03.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "307710858971",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:307710858971:web:aa0bc7d1d335b96ba79efe"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth functions
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => await signInWithPopup(auth, googleProvider);
export const loginWithEmail = async (email, password) => await signInWithEmailAndPassword(auth, email, password);
export const registerWithEmail = async (email, password) => await createUserWithEmailAndPassword(auth, email, password);
export const logoutUser = async () => await signOut(auth);
export const resetPassword = async (email) => await sendPasswordResetEmail(auth, email);
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

export const getAllProjects = async () => {
  const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateProjectStatus = async (projectId, data) => {
  await updateDoc(doc(db, 'projects', projectId), { ...data, updatedAt: serverTimestamp() });
};

// Re-exports
export { isSignInWithEmailLink, signInWithEmailLink, sendSignInLinkToEmail };