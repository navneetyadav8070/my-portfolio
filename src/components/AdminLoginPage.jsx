import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { FaLock, FaArrowRight, FaShieldAlt, FaEnvelope, FaKey } from 'react-icons/fa';

const ADMIN_EMAIL = "navneetyadav8070@gmail.com";
// 🔥 ADMIN SECRET PIN - सिर्फ आपको पता
const ADMIN_SECRET_PIN = "8070";

const AdminLoginPage = () => {
  const [step, setStep] = useState(1); // 1: Email/Pass, 2: Secret PIN
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [secretPin, setSecretPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const navigate = useNavigate();

  // Step 1: Email/Password Login
  const handleStep1 = async (e) => {
    e.preventDefault();
    setError('');

    if (email !== ADMIN_EMAIL) {
      setError('Access denied.');
      return;
    }

    if (attempts >= 5) {
      setError('Too many attempts. Locked for 15 minutes.');
      return;
    }

    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      if (result.user.email === ADMIN_EMAIL) {
        // 🔥 Step 1 pass - now ask for Secret PIN
        setStep(2);
        setError('');
        setAttempts(0);
      } else {
        await auth.signOut();
        setError('Access denied.');
      }
    } catch (err) {
      setAttempts(prev => prev + 1);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid password.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Account locked. Try later.');
      } else {
        setError('Login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Secret PIN Verification
  const handleStep2 = (e) => {
    e.preventDefault();
    setError('');

    if (secretPin !== ADMIN_SECRET_PIN) {
      setError('Invalid security PIN.');
      setAttempts(prev => prev + 1);
      if (attempts >= 3) {
        // Too many PIN attempts - force re-login
        auth.signOut();
        setStep(1);
        setAttempts(0);
        setError('Too many PIN attempts. Please login again.');
      }
      return;
    }

    // 🔥 Both checks passed - Grant admin access
    sessionStorage.setItem('adminAuthenticated', 'true');
    sessionStorage.setItem('adminEmail', email);
    sessionStorage.setItem('adminLoginTime', Date.now().toString());
    sessionStorage.setItem('adminPinVerified', 'true');
    navigate('/ny-admin-8070', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4">
      <div className="glass rounded-3xl p-8 sm:p-10 border border-accent/10 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaShieldAlt className="text-yellow-400 text-2xl" />
          </div>
          <h2 className="text-xl font-bold text-white">
            {step === 1 ? 'Admin Login' : 'Security Check'}
          </h2>
          <p className="text-gray-500 text-xs mt-2">
            {step === 1 ? 'Step 1: Email & Password' : 'Step 2: Secret PIN'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-6">
          <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-accent' : 'bg-white/10'}`} />
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-accent text-dark' : 'bg-white/10 text-gray-500'}`}>1</div>
          <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-accent' : 'bg-white/10'}`} />
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-accent text-dark' : 'bg-white/10 text-gray-500'}`}>2</div>
          <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-accent' : 'bg-white/10'}`} />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-4">
            {error}
          </div>
        )}

        {step === 1 ? (
          /* Step 1: Email & Password */
          <form onSubmit={handleStep1} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Admin Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="email" value={email} readOnly
                  className="w-full pl-12 pr-4 py-3.5 bg-dark/50 text-gray-400 rounded-xl border border-white/10 cursor-not-allowed" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  required autoFocus
                  className="w-full pl-12 pr-4 py-3.5 bg-dark text-white rounded-xl border border-white/10 focus:border-yellow-400 focus:outline-none"
                  placeholder="Enter password" />
              </div>
            </div>
            <button type="submit" disabled={loading || attempts >= 5}
              className="w-full flex items-center justify-center gap-2 py-4 bg-yellow-500 text-dark font-bold rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-50 border-none cursor-pointer">
              {loading ? 'Verifying...' : <>Next <FaArrowRight /></>}
            </button>
          </form>
        ) : (
          /* Step 2: Secret PIN */
          <form onSubmit={handleStep2} className="space-y-4">
            <div className="bg-dark/50 rounded-xl p-4 text-center mb-4">
              <p className="text-gray-400 text-sm">✅ Email verified</p>
              <p className="text-white font-medium">{email}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Secret Security PIN</label>
              <div className="relative">
                <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="password" value={secretPin} onChange={(e) => setSecretPin(e.target.value)}
                  required autoFocus maxLength={10}
                  className="w-full pl-12 pr-4 py-3.5 bg-dark text-white rounded-xl border border-white/10 focus:border-yellow-400 focus:outline-none"
                  placeholder="Enter 4-digit security PIN" />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-accent text-dark font-bold rounded-xl hover:bg-accent-hover transition-all disabled:opacity-50 border-none cursor-pointer">
              <FaShieldAlt /> Access Admin Panel
            </button>
            <button type="button" onClick={() => { auth.signOut(); setStep(1); setPassword(''); }}
              className="w-full py-2 text-gray-500 hover:text-gray-400 text-sm transition-all">
              ← Back to Login
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <a href="/" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">← Website</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;