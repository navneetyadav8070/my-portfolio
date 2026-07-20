import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { FaLock, FaArrowRight, FaShieldAlt, FaEnvelope } from 'react-icons/fa';

const ADMIN_EMAIL = "navneetyadav8070@gmail.com";
const ADMIN_SECRET_PIN = "8070";

export default function AdminLoginPage() {
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState('');
  const [secretPin, setSecretPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStep1 = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
      setStep(2);
    } catch (err) {
      setError('Invalid password.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = (e) => {
    e.preventDefault();
    if (secretPin !== ADMIN_SECRET_PIN) {
      setError('Invalid security PIN.');
      return;
    }
    sessionStorage.setItem('adminAuthenticated', 'true');
    sessionStorage.setItem('adminEmail', ADMIN_EMAIL);
    navigate('/admin', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4">
      <div className="glass rounded-3xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <FaShieldAlt className="text-yellow-400 text-3xl mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white">Admin Login</h2>
        </div>
        {error && <div className="bg-red-500/10 text-red-400 px-4 py-3 rounded-xl text-sm mb-4">{error}</div>}
        
        {step === 1 ? (
          <form onSubmit={handleStep1} className="space-y-4">
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-3.5 text-gray-500" />
              <input type="email" value={ADMIN_EMAIL} readOnly className="w-full pl-12 pr-4 py-3.5 bg-dark/50 text-gray-400 rounded-xl border border-white/10" />
            </div>
            <div className="relative">
              <FaLock className="absolute left-4 top-3.5 text-gray-500" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoFocus
                className="w-full pl-12 pr-4 py-3.5 bg-dark text-white rounded-xl border border-white/10 focus:border-yellow-400 focus:outline-none" placeholder="Password" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-4 bg-yellow-500 text-dark font-bold rounded-xl">
              {loading ? 'Verifying...' : <>Next <FaArrowRight /></>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleStep2} className="space-y-4">
            <p className="text-green-400 text-sm text-center">✅ Email verified</p>
            <div className="relative">
              <FaLock className="absolute left-4 top-3.5 text-gray-500" />
              <input type="password" value={secretPin} onChange={(e) => setSecretPin(e.target.value)} required autoFocus maxLength={10}
                className="w-full pl-12 pr-4 py-3.5 bg-dark text-white rounded-xl border border-white/10 focus:border-yellow-400 focus:outline-none" placeholder="Security PIN" />
            </div>
            <button type="submit" className="w-full py-4 bg-accent text-dark font-bold rounded-xl">Access Admin</button>
          </form>
        )}
      </div>
    </div>
  );
}