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
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  EmailAuthProvider,
  linkWithCredential,
  updatePassword,
  reauthenticateWithCredential,
  reauthenticateWithPopup
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
  setDoc
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

export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  
  // Check if user exists in Firestore
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    // Create user document for new Google user
    await setDoc(userRef, {
      email: user.email,
      displayName: user.displayName || 'User',
      photoURL: user.photoURL,
      role: 'user',
      status: 'active',
      emailVerified: true,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    });
  } else {
    // Update last login
    await updateDoc(userRef, {
      lastLogin: serverTimestamp()
    });
  }
  
  return { success: true, user };
};

export const loginWithEmail = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update last login (merge:true taaki doc na hone par bhi na crash ho, khud ban jaaye)
  const userRef = doc(db, 'users', user.uid);
  await setDoc(userRef, {
    email: user.email,
    lastLogin: serverTimestamp()
  }, { merge: true });

  return { success: true, user };
};

export const registerWithEmail = async (email, password, displayName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Update profile
  await updateProfile(user, { displayName });

  // Verification email bhejo (register message se match kare)
  await sendEmailVerification(user);

  // Create user document in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    email: email,
    displayName: displayName || 'User',
    photoURL: null,
    role: 'user',
    status: 'active',
    emailVerified: false,
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp()
  });

  return { success: true, user };
};

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
  const snapshot = await getDocs(collection(db, 'projects'));
  const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  projects.sort((a, b) => {
    const timeA = a.createdAt?.toDate?.() || new Date(0);
    const timeB = b.createdAt?.toDate?.() || new Date(0);
    return timeB - timeA;
  });
  return projects;
};

export const getAllUsers = async () => {
  const snapshot = await getDocs(collection(db, 'users'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateProjectStatus = async (projectId, data) => {
  await updateDoc(doc(db, 'projects', projectId), { ...data, updatedAt: serverTimestamp() });
};

// ==========================================
// PASSWORD MANAGEMENT
// ==========================================

// User ke paas password provider hai ya nahi (Google-only user ke paas nahi hota)
export const hasPasswordProvider = (user) =>
  !!(user?.providerData || []).some((p) => p.providerId === 'password');

// Google user apna password SET kare (email/password provider link karke)
export const setUserPassword = async (newPassword) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Aap logged in nahi ho.');
  const cred = EmailAuthProvider.credential(user.email, newPassword);
  try {
    await linkWithCredential(user, cred);
  } catch (err) {
    if (err.code === 'auth/requires-recent-login') {
      // Google se dobara verify karke retry
      await reauthenticateWithPopup(user, googleProvider);
      await linkWithCredential(user, cred);
    } else {
      throw err;
    }
  }
  return { success: true };
};

// Jis user ke paas password hai wo CHANGE kare (pehle current password se verify)
export const changeUserPassword = async (currentPassword, newPassword) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Aap logged in nahi ho.');
  const cred = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, cred); // galat current password → error
  await updatePassword(user, newPassword);
  return { success: true };
};