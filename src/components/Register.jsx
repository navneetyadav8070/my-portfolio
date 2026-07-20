import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerWithEmail, loginWithGoogle } from '../firebase';
import { FaEnvelope, FaLock, FaUser, FaArrowRight, FaGoogle } from 'react-icons/fa';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // FIXED: name ab actually save hota hai (displayName)
      await registerWithEmail(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setLoading(true);

    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4">
      <div className="glass rounded-3xl p-8 sm:p-10 border border-accent/10 max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold gradient-text">NY</Link>
          <h2 className="text-2xl font-bold text-white mt-4">Create Account</h2>
          <p className="text-gray-400 text-sm mt-2">Register to track your projects</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        {/* Google Sign Up */}
        <button
          onClick={handleGoogleSignUp}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-6 py-3.5 glass text-white font-medium rounded-xl border border-white/10 hover:border-accent/30 transition-all mb-4 disabled:opacity-50"
        >
          <FaGoogle className="text-red-400" />
          Sign up with Google
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Full Name</label>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full pl-12 pr-4 py-3.5 bg-dark text-white rounded-xl border border-white/10 focus:border-accent focus:outline-none transition-all"
                placeholder="Your name" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full pl-12 pr-4 py-3.5 bg-dark text-white rounded-xl border border-white/10 focus:border-accent focus:outline-none transition-all"
                placeholder="your@email.com" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Password (min 6 characters)</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                className="w-full pl-12 pr-4 py-3.5 bg-dark text-white rounded-xl border border-white/10 focus:border-accent focus:outline-none transition-all"
                placeholder="Create password" />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-accent text-dark font-bold rounded-xl hover:bg-accent-hover transition-all disabled:opacity-50 border-none cursor-pointer">
            {loading ? 'Creating Account...' : <>Register <FaArrowRight /></>}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account? <Link to="/login" className="text-accent hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
