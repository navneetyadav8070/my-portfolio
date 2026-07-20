import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
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
  deleteDoc,
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

// FIXED: ab name bhi save hota hai (displayName set hota hai)
export const registerWithEmail = async (name, email, password) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (name && name.trim()) {
    await updateProfile(credential.user, { displayName: name.trim() });
  }
  return credential;
};

export const logoutUser = async () => {
  return await signOut(auth);
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// orderBy hataya gaya hai index error se bachne ke liye (manually sort kar rahe hain)
export const getClientProjects = async (clientEmail) => {
  const q = query(
    collection(db, 'projects'),
    where('clientEmail', '==', clientEmail)
  );
  const snapshot = await getDocs(q);

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

// NEW: project delete karne ke liye
export const deleteProject = async (projectId) => {
  return await deleteDoc(doc(db, 'projects', projectId));
};