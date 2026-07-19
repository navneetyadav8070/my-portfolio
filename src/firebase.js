import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
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
  onSnapshot, 
  getDoc
} from 'firebase/firestore';

// EDIT: Replace with your Firebase config
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

export const loginWithGoogle = async () => {
  return await signInWithPopup(auth, googleProvider);
};

export const loginWithEmail = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const registerWithEmail = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async () => {
  return await signOut(auth);
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// 🔥 FIXED: Removed orderBy to avoid index error
export const getClientProjects = async (clientEmail) => {
  const q = query(
    collection(db, 'projects'),
    where('clientEmail', '==', clientEmail)
  );
  const snapshot = await getDocs(q);
  
  // Sort manually
  const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  projects.sort((a, b) => {
    const timeA = a.createdAt?.toDate?.() || new Date(0);
    const timeB = b.createdAt?.toDate?.() || new Date(0);
    return timeB - timeA;
  });
  
  return { docs: projects.map(p => ({ id: p.id, data: () => p })) };
};

export const getProjectById = async (projectId) => {
  const docRef = doc(db, 'projects', projectId);
  return await getDoc(docRef);
};

export const getAllProjects = async () => {
  const snapshot = await getDocs(collection(db, 'projects'));
  const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  projects.sort((a, b) => {
    const timeA = a.createdAt?.toDate?.() || new Date(0);
    const timeB = b.createdAt?.toDate?.() || new Date(0);
    return timeB - timeA;
  });
  return { docs: projects.map(p => ({ id: p.id, data: () => p })) };
};

export const createProject = async (projectData) => {
  return await addDoc(collection(db, 'projects'), {
    ...projectData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};