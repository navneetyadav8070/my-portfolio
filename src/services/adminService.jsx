import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendSignInLinkToEmail
} from 'firebase/auth';
import { 
  doc, setDoc, updateDoc, deleteDoc, 
  getDoc, getDocs, collection, query, 
  where, serverTimestamp, orderBy, limit 
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';

class AdminService {
  
  // ==========================================
  // CREATE FIRST SUPER ADMIN
  // This is done via Firebase Console or CLI
  // ==========================================
  async createFirstSuperAdmin(email, password, displayName) {
    // This should be called only ONCE via a secure method
    // Companies use Firebase CLI or Cloud Functions for this
    
    try {
      // 1. Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // 2. Set custom claims (super_admin role)
      // This requires Firebase Admin SDK (Cloud Functions)
      // await admin.auth().setCustomUserClaims(user.uid, { role: 'super_admin' });
      
      // 3. Create Firestore document
      await setDoc(doc(db, 'users', user.uid), {
        email,
        displayName,
        photoURL: null,
        role: 'super_admin',
        status: 'active',
        emailVerified: true, // Super admin auto-verified
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        createdBy: 'system',
        metadata: {
          loginCount: 0,
          lastPasswordChange: serverTimestamp()
        }
      });
      
      return { success: true, user };
    } catch (error) {
      throw error;
    }
  }
  
  // ==========================================
  // ADMIN LOGIN
  // ==========================================
  async adminLogin(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check Firestore for admin role
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        await signOut(auth);
        throw new Error('Account not found.');
      }
      
      const userData = userDoc.data();
      
      // Verify admin role
      if (userData.role !== 'admin' && userData.role !== 'super_admin') {
        await signOut(auth);
        throw new Error('Access denied. Admin only.');
      }
      
      // Check account status
      if (userData.status !== 'active') {
        await signOut(auth);
        throw new Error('Account is ' + userData.status + '.');
      }
      
      // Update last login
      await updateDoc(doc(db, 'users', user.uid), {
        lastLogin: serverTimestamp(),
        'metadata.loginCount': (userData.metadata?.loginCount || 0) + 1
      });
      
      // Log admin action
      await this.logAdminAction(email, 'admin_login', 'self');
      
      return { success: true, user: { ...user, ...userData } };
    } catch (error) {
      throw error;
    }
  }
  
  // ==========================================
  // CREATE NEW ADMIN (Super Admin only)
  // ==========================================
  async createNewAdmin(superAdminEmail, newAdminEmail, newAdminName, tempPassword) {
    try {
      // Verify super admin
      const superAdminDoc = await getDoc(
        doc(db, 'users', auth.currentUser?.uid)
      );
      
      if (!superAdminDoc.exists() || superAdminDoc.data().role !== 'super_admin') {
        throw new Error('Unauthorized. Super admin only.');
      }
      
      // Check if email already exists
      const existingQuery = query(
        collection(db, 'users'),
        where('email', '==', newAdminEmail)
      );
      const existingDocs = await getDocs(existingQuery);
      
      if (!existingDocs.empty) {
        throw new Error('Email already registered.');
      }
      
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth, newAdminEmail, tempPassword
      );
      const newAdmin = userCredential.user;
      
      // Set custom claims via Cloud Function
      // await setAdminClaim(newAdmin.uid);
      
      // Create Firestore document
      await setDoc(doc(db, 'users', newAdmin.uid), {
        email: newAdminEmail,
        displayName: newAdminName,
        photoURL: null,
        role: 'admin',
        status: 'active',
        emailVerified: false,
        createdAt: serverTimestamp(),
        lastLogin: null,
        createdBy: superAdminEmail,
        metadata: {
          loginCount: 0,
          lastPasswordChange: serverTimestamp()
        }
      });
      
      // Send password reset email so admin sets their own password
      await sendPasswordResetEmail(auth, newAdminEmail);
      
      // Log action
      await this.logAdminAction(superAdminEmail, 'create_admin', newAdminEmail);
      
      return { success: true, message: 'Admin created. Password reset email sent.' };
    } catch (error) {
      throw error;
    }
  }
  
  // ==========================================
  // DISABLE ADMIN
  // ==========================================
  async disableAdmin(superAdminEmail, adminEmail) {
    const adminQuery = query(
      collection(db, 'users'),
      where('email', '==', adminEmail)
    );
    const adminDocs = await getDocs(adminQuery);
    
    if (adminDocs.empty) {
      throw new Error('Admin not found.');
    }
    
    const adminDoc = adminDocs.docs[0];
    
    await updateDoc(doc(db, 'users', adminDoc.id), {
      status: 'disabled'
    });
    
    await this.logAdminAction(superAdminEmail, 'disable_admin', adminEmail);
    
    return { success: true };
  }
  
  // ==========================================
  // GET ALL ADMINS
  // ==========================================
  async getAllAdmins() {
    const adminQuery = query(
      collection(db, 'users'),
      where('role', 'in', ['admin', 'super_admin']),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(adminQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  
  // ==========================================
  // GET ALL USERS
  // ==========================================
  async getAllUsers() {
    const userQuery = query(
      collection(db, 'users'),
      where('role', '==', 'user'),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(userQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  
  // ==========================================
  // ADMIN ACTION LOGGER
  // ==========================================
  async logAdminAction(adminEmail, action, target) {
    await setDoc(doc(collection(db, 'admin_logs')), {
      adminEmail,
      action,
      target,
      timestamp: serverTimestamp(),
      ipAddress: 'client-side' // Server-side would get real IP
    });
  }
}

export const adminService = new AdminService();