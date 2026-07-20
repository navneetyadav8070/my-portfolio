import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerWithEmail, loginWithGoogle } from '../../firebase/config';
import { FaEnvelope, FaLock, FaGoogle, FaArrowRight, FaUser } from 'react-icons/fa';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const result = await registerWithEmail(email, password, name);
      if (result.success) {
        setMessage('Registration successful! Please verify your email.');
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Google registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4">
      <div className="glass rounded-3xl p-8 max-w-md w-full border border-accent/10">
        <div className="text-center mb-8">
          <Link to="/" className="text-4xl font-black gradient-text inline-block">NY</Link>
          <h1 className="text-2xl font-bold text-white mt-4">Create Account</h1>
          <p className="text-gray-400 text-sm mt-1">Join as a client</p>
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

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative">
            <FaUser className="absolute left-4 top-3.5 text-gray-500" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3.5 bg-dark text-white rounded-xl border border-white/10 focus:border-accent focus:outline-none transition-all"
              placeholder="Full Name"
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
              minLength={6}
              className="w-full pl-12 pr-4 py-3.5 bg-dark text-white rounded-xl border border-white/10 focus:border-accent focus:outline-none transition-all"
              placeholder="Password (min 6 chars)"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-4 top-3.5 text-gray-500" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-3.5 bg-dark text-white rounded-xl border border-white/10 focus:border-accent focus:outline-none transition-all"
              placeholder="Confirm Password"
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
                Create Account <FaArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:text-accent-hover transition-colors font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}