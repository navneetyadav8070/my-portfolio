import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

class AuthService {
  
  // ==========================================
  // REGISTRATION
  // ==========================================
  async registerWithEmail(email, password, displayName) {
    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile
      await updateProfile(user, { displayName });
      
      // Send verification email
      await sendEmailVerification(user);
      
      // Create Firestore document
      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        displayName: displayName,
        photoURL: null,
        phone: null,
        role: 'user', // Default role
        status: 'active',
        emailVerified: false,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        createdBy: 'self',
        metadata: {
          loginCount: 1,
          lastPasswordChange: serverTimestamp()
        }
      });
      
      return { success: true, user };
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // ==========================================
  // LOGIN
  // ==========================================
  async loginWithEmail(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if email is verified
      if (!user.emailVerified) {
        // Resend verification
        await sendEmailVerification(user);
        throw new Error('Please verify your email. Verification link resent.');
      }
      
      // Update Firestore
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Check if account is active
        if (userData.status !== 'active') {
          await signOut(auth);
          throw new Error('Account is ' + userData.status + '. Contact support.');
        }
        
        // Update last login
        await updateDoc(userRef, {
          lastLogin: serverTimestamp(),
          'metadata.loginCount': (userData.metadata?.loginCount || 0) + 1
        });
      }
      
      return { success: true, user };
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // ==========================================
  // GOOGLE LOGIN
  // ==========================================
  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user exists in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // First time Google login - create document
        await setDoc(userRef, {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          phone: user.phoneNumber || null,
          role: 'user',
          status: 'active',
          emailVerified: true, // Google verified
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          createdBy: 'google',
          metadata: {
            loginCount: 1
          }
        });
      } else {
        // Update last login
        await updateDoc(userRef, {
          lastLogin: serverTimestamp(),
          'metadata.loginCount': (userDoc.data().metadata?.loginCount || 0) + 1
        });
      }
      
      return { success: true, user };
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // ==========================================
  // LOGOUT
  // ==========================================
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // ==========================================
  // FORGOT PASSWORD
  // ==========================================
  async forgotPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'Password reset email sent. Check your inbox.' };
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // ==========================================
  // RESEND VERIFICATION
  // ==========================================
  async resendVerification() {
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        return { success: true, message: 'Verification email sent.' };
      }
      throw new Error('No user logged in.');
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  // ==========================================
  // ERROR HANDLER
  // ==========================================
  handleError(error) {
    const errorMap = {
      'auth/email-already-in-use': 'This email is already registered.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/operation-not-allowed': 'This login method is not enabled.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Check your connection.',
      'auth/popup-closed-by-user': 'Login popup was closed.',
      'auth/invalid-credential': 'Invalid email or password.'
    };
    
    return new Error(errorMap[error.code] || error.message || 'An error occurred.');
  }
}

export const authService = new AuthService();