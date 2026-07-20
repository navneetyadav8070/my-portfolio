import { useState, useEffect, useContext, createContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          // Check if account is active
          if (userData.status === 'disabled' || userData.status === 'blocked') {
            await auth.signOut();
            setUser(null);
            setUserData(null);
            setLoading(false);
            return;
          }
          
          // Combine Firebase auth + Firestore data
          const fullUser = {
            ...firebaseUser,
            ...userData,
            uid: firebaseUser.uid,
            role: userData.role || 'user',
            isAdmin: userData.role === 'admin' || userData.role === 'super_admin',
            isSuperAdmin: userData.role === 'super_admin'
          };
          
          setUser(fullUser);
          setUserData(userData);
        } else {
          // User doc not found - sign out
          await auth.signOut();
          setUser(null);
          setUserData(null);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}