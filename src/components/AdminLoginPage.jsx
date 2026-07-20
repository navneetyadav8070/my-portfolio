import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendAdminOTP, isSignInWithEmailLink, signInWithEmailLink, auth } from '../firebase';
import { FaLock, FaArrowRight, FaShieldAlt, FaEnvelope, FaCheckCircle, FaRedo } from 'react-icons/fa';

const ADMIN_EMAIL = "navneetyadav8070@gmail.com";

const AdminLoginPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  // 🔥 Check if coming back from email link
  useEffect(() => {
    const checkEmailLink = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        try {
          let storedEmail = window.localStorage.getItem('emailForSignIn');
          if (!storedEmail) {
            storedEmail = ADMIN_EMAIL;
          }
          
          const result = await signInWithEmailLink(auth, storedEmail, window.location.href);
          
          if (result.user.email === ADMIN_EMAIL) {
            sessionStorage.setItem('adminAuthenticated', 'true');
            sessionStorage.setItem('adminEmail', result.user.email);
            sessionStorage.setItem('adminLoginTime', Date.now().toString());
            window.localStorage.removeItem('emailForSignIn');
            navigate('/ny-admin-8070');
          } else {
            await auth.signOut();
            setError('Access denied. Admin only.');
          }
        } catch (err) {
          console.error('Email link verification failed:', err);
          setError('Verification failed. Please try again.');
        }
      }
    };
    checkEmailLink();
  }, [navigate]);

  // 🔥 Send OTP to Email
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    
    if (email !== ADMIN_EMAIL) {
      setError('Access denied. Admin email required.');
      return;
    }
    
    setLoading(true);
    
    try {
      await sendAdminOTP(email);
      setStep(2);
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Resend OTP
  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setLoading(true);
    try {
      await sendAdminOTP(email);
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setError('');
    } catch (err) {
      setError('Failed to resend. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4">
      <div className="glass rounded-3xl p-8 sm:p-10 border border-accent/10 max-w-md w-full">
        
        {step === 1 ? (
          <>
            {/* Step 1: Send OTP */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-yellow-400 text-2xl" />
              </div>
              <h2 className="text-xl font-bold text-white">Admin Access</h2>
              <p className="text-gray-500 text-xs mt-2">OTP will be sent to admin email</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Admin Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input 
                    type="email" 
                    value={email} 
                    readOnly
                    className="w-full pl-12 pr-4 py-3.5 bg-dark/50 text-gray-400 rounded-xl border border-white/10 cursor-not-allowed"
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-yellow-500 text-dark font-bold rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-50 border-none cursor-pointer"
              >
                {loading ? 'Sending OTP...' : <>Send OTP to Email <FaArrowRight /></>}
              </button>
            </form>
          </>
        ) : (
          <>
            {/* Step 2: OTP Sent */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-green-400 text-3xl" />
              </div>
              <h2 className="text-xl font-bold text-white">OTP Sent! 📧</h2>
              <p className="text-gray-400 text-sm mt-2">
                Check your email<br/>
                <span className="text-accent font-medium">{email}</span>
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Click the link in email to login automatically
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="bg-dark/50 rounded-xl p-4 border border-white/5">
                <p className="text-gray-400 text-xs text-center">
                  📩 We sent a magic link to your email<br/>
                  🔗 Click the link to access admin panel<br/>
                  ⏰ Link expires in 1 hour
                </p>
              </div>

              <button 
                onClick={handleResendOTP}
                disabled={countdown > 0 || loading}
                className="w-full flex items-center justify-center gap-2 py-3 glass text-white rounded-xl border border-white/10 hover:border-accent/30 transition-all disabled:opacity-50"
              >
                <FaRedo size={14} />
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
              </button>

              <button 
                onClick={() => setStep(1)}
                className="w-full py-3 text-gray-400 hover:text-white text-sm transition-all"
              >
                ← Change Email
              </button>
            </div>
          </>
        )}

        <div className="mt-6 pt-6 border-t border-white/5 text-center">
          <a href="/" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
            ← Back to Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;