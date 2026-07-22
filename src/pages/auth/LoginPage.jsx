import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginWithEmail, loginWithGoogle, resetPassword } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FaEnvelope, FaLock, FaGoogle, FaArrowRight } from 'react-icons/fa';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const result = await loginWithEmail(email, password);
      if (result.success) {
        // Check user role
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.role === 'super_admin' || userData.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/dashboard');
          }
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await loginWithGoogle();
      // Check user role
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'super_admin' || userData.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!email) {
      setError('Please enter your email first');
      return;
    }
    setError('');
    setMessage('');
    try {
      await resetPassword(email);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4">
      <div className="glass rounded-3xl p-8 max-w-md w-full border border-accent/10">
        <div className="text-center mb-8">
          <Link to="/" className="text-4xl font-black gradient-text inline-block">NY</Link>
          <h1 className="text-2xl font-bold text-white mt-4">Welcome Back</h1>
          <p className="text-gray-400 text-sm mt-1">Login to your account</p>
        </div>

        {message && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-sm mb-4">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3.5 glass text-white rounded-xl hover:border-accent/30 transition-all"
        >
          <FaGoogle className="text-red-400" />
          Continue with Google
        </button>

        <div className="flex items-center gap-4 my-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-gray-500 text-xs">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-3.5 text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3.5 bg-dark text-white rounded-xl border border-white/10 focus:border-accent focus:outline-none transition-all"
              placeholder="Email address"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-4 top-3.5 text-gray-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3.5 bg-dark text-white rounded-xl border border-white/10 focus:border-accent focus:outline-none transition-all"
              placeholder="Password"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleForgot}
              className="text-xs text-accent hover:text-accent-hover transition-colors"
            >
              Forgot password?
            </button>
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
                Sign In <FaArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent hover:text-accent-hover transition-colors font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}