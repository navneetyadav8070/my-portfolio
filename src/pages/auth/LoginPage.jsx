import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginWithEmail, loginWithGoogle, resetPassword } from '../../firebase/config';
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
    setError(''); setMessage(''); setLoading(true);
    try {
      await loginWithEmail(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setError(''); setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Google login failed');
    } finally { setLoading(false); }
  };

  const handleForgot = async () => {
    if (!email) { setError('Enter email first'); return; }
    try {
      await resetPassword(email);
      setMessage('Password reset email sent!');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4">
      <div className="glass rounded-3xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="text-4xl font-black gradient-text">NY</Link>
          <h1 className="text-2xl font-bold text-white mt-4">Welcome Back</h1>
        </div>
        {message && <div className="bg-green-500/10 text-green-400 px-4 py-3 rounded-xl text-sm mb-4">{message}</div>}
        {error && <div className="bg-red-500/10 text-red-400 px-4 py-3 rounded-xl text-sm mb-4">{error}</div>}
        
        <button onClick={handleGoogle} disabled={loading} className="w-full flex items-center justify-center gap-3 py-3.5 glass text-white rounded-xl mb-4">
          <FaGoogle className="text-red-400" /> Continue with Google
        </button>
        
        <div className="flex items-center gap-4 mb-4"><div className="flex-1 h-px bg-white/10" /><span className="text-gray-500 text-xs">or</span><div className="flex-1 h-px bg-white/10" /></div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative"><FaEnvelope className="absolute left-4 top-3.5 text-gray-500" /><input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full pl-12 pr-4 py-3.5 bg-dark text-white rounded-xl border border-white/10" placeholder="Email" /></div>
          <div className="relative"><FaLock className="absolute left-4 top-3.5 text-gray-500" /><input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full pl-12 pr-4 py-3.5 bg-dark text-white rounded-xl border border-white/10" placeholder="Password" /></div>
          <button type="button" onClick={handleForgot} className="text-xs text-accent">Forgot password?</button>
          <button type="submit" disabled={loading} className="w-full py-4 bg-accent text-dark font-bold rounded-xl">{loading ? 'Signing in...' : <>Sign In <FaArrowRight /></>}</button>
        </form>
        
        <p className="text-center text-gray-500 text-sm mt-6">Don't have an account? <Link to="/register" className="text-accent">Register</Link></p>
      </div>
    </div>
  );
}