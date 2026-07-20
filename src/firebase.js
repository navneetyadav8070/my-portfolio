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
import { logger } from './utils/logger';

const firebaseConfig = {
  apiKey: "AIzaSyDgdJvkBAgc_Mz507G_UnsPTjvMGu9pDEA",
  authDomain: "developer-6fe03.firebaseapp.com",
  projectId: "developer-6fe03",
  storageBucket: "developer-6fe03.firebasestorage.app",
  messagingSenderId: "307710858971",
  appId: "1:307710858971:web:aa0bc7d1d335b96ba79efe"
};

logger.info('FIREBASE', 'Initializing Firebase', { projectId: firebaseConfig.projectId });

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

logger.success('FIREBASE', 'Firebase initialized successfully');

// 🔥 Email Link (OTP) Auth
export const sendAdminOTP = async (email) => {
  logger.firebase('Sending admin OTP', { email });
  
  const actionCodeSettings = {
    url: window.location.origin + '/ny-admin-8070',
    handleCodeInApp: true,
  };
  
  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem('emailForSignIn', email);
    logger.success('FIREBASE', 'OTP sent successfully', { email });
  } catch (err) {
    logger.error('FIREBASE', 'Failed to send OTP', { error: err.code, message: err.message });
    throw err;
  }
};

export { isSignInWithEmailLink, signInWithEmailLink };

// Auth functions
export const loginWithGoogle = async () => {
  logger.auth('Google login initiated');
  try {
    const result = await signInWithPopup(auth, googleProvider);
    logger.auth('Google login success', { email: result.user.email });
    return result;
  } catch (err) {
    logger.error('AUTH', 'Google login failed', { error: err.code, message: err.message });
    throw err;
  }
};

export const loginWithEmail = async (email, password) => {
  logger.auth('Email login attempt', { email });
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    logger.auth('Email login success', { email });
    return result;
  } catch (err) {
    logger.error('AUTH', 'Email login failed', { error: err.code, message: err.message });
    throw err;
  }
};

export const registerWithEmail = async (email, password) => {
  logger.auth('Registration attempt', { email });
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    logger.auth('Registration success', { email });
    return result;
  } catch (err) {
    logger.error('AUTH', 'Registration failed', { error: err.code, message: err.message });
    throw err;
  }
};

export const logoutUser = async () => {
  logger.auth('User logging out');
  try {
    await signOut(auth);
    logger.auth('Logout success');
  } catch (err) {
    logger.error('AUTH', 'Logout failed', { error: err.message });
  }
};

export const onAuthChange = (callback) => {
  logger.firebase('Setting up auth state listener');
  return onAuthStateChanged(auth, callback);
};

// Firestore functions
export const getClientProjects = async (clientEmail) => {
  logger.firebase('Fetching projects', { clientEmail });
  
  try {
    const q = query(collection(db, 'projects'), where('clientEmail', '==', clientEmail));
    const snapshot = await getDocs(q);
    const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    projects.sort((a, b) => {
      const timeA = a.createdAt?.toDate?.() || new Date(0);
      const timeB = b.createdAt?.toDate?.() || new Date(0);
      return timeB - timeA;
    });
    
    logger.success('FIREBASE', 'Projects fetched', { count: projects.length });
    return { docs: projects.map(p => ({ id: p.id, data: () => p })) };
  } catch (err) {
    logger.error('FIREBASE', 'Failed to fetch projects', { error: err.message });
    throw err;
  }
};