import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const createAdmin = async () => {
  const adminEmail = "admin@yourdomain.com";
  const adminPassword = "Admin@123456";
  const adminName = "Super Admin";

  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      adminEmail, 
      adminPassword
    );
    const user = userCredential.user;

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: adminEmail,
      displayName: adminName,
      photoURL: null,
      role: 'super_admin',
      status: 'active',
      emailVerified: true,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      createdBy: 'system'
    });

    console.log('✅ Admin created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  }
};

// Run this function
createAdmin();