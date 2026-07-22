import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { FaUserShield, FaEnvelope, FaLock, FaUser, FaArrowRight } from 'react-icons/fa';

const CreateAdmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create admin document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        displayName: name,
        photoURL: null,
        role: 'super_admin',
        status: 'active',
        emailVerified: true,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        createdBy: 'system'
      });

      setSuccess('✅ Admin created successfully!');
      setTimeout(() => navigate('/admin/dashboard'), 2000);
    } catch (err) {
      setError(err.message || 'Failed to create admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4">
      <div className="glass rounded-3xl p-8 max-w-md w-full border border-accent/10">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">👑</div>
          <h1 className="text-2xl font-bold text-white">Create Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Set up super admin account</p>
        </div>

        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-sm mb-4">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleCreateAdmin} className="space-y-4">
          <div className="relative">
            <FaUser className="absolute left-4 top-3.5 text-gray-500" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3.5 bg-dark text-white rounded-xl border border-white/10 focus:border-accent focus:outline-none transition-all"
              placeholder="Admin Full Name"
            />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute left-4 top-3.5 text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3.5 bg-dark text-white rounded-xl border border-white/10 focus:border-accent focus:outline-none transition-all"
              placeholder="Admin Email"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-4 top-3.5 text-gray-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full pl-12 pr-4 py-3.5 bg-dark text-white rounded-xl border border-white/10 focus:border-accent focus:outline-none transition-all"
              placeholder="Password (min 6 chars)"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 bg-accent text-dark font-bold rounded-xl hover:bg-accent-hover transition-all shadow-lg shadow-accent/20 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
            ) : (
              <>
                <FaUserShield size={18} />
                Create Admin
              </>
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-6 border-t border-white/5 pt-4">
          This page should be removed after admin creation for security
        </p>
      </div>
    </div>
  );
};

export default CreateAdmin;