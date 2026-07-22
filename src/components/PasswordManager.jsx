import { useState } from 'react';
import { FaKey, FaLock, FaCheckCircle, FaChevronDown } from 'react-icons/fa';
import { hasPasswordProvider, setUserPassword, changeUserPassword } from '../firebase/config';

// Google-login user ko "Set Password", baaki ko "Change Password".
// Set karne ke baad automatically "Change Password" ho jaata hai.
const PasswordManager = ({ user }) => {
  const [hasPass, setHasPass] = useState(hasPasswordProvider(user));
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const reset = () => {
    setCurrent(''); setNext(''); setConfirm(''); setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (next.length < 6) {
      setError('Password kam se kam 6 characters ka ho.');
      return;
    }
    if (next !== confirm) {
      setError('Dono passwords match nahi kar rahe.');
      return;
    }

    setLoading(true);
    try {
      if (hasPass) {
        await changeUserPassword(current, next);
      } else {
        await setUserPassword(next);
        setHasPass(true); // ab "Change Password" dikhega
      }
      setDone(true);
      reset();
      setTimeout(() => { setDone(false); setOpen(false); }, 2000);
    } catch (err) {
      const map = {
        'auth/wrong-password': 'Current password galat hai.',
        'auth/invalid-credential': 'Current password galat hai.',
        'auth/weak-password': 'Password bahut kamzor hai (min 6 chars).',
        'auth/requires-recent-login': 'Suraksha ke liye dobara login karein, phir try karein.',
        'auth/popup-closed-by-user': 'Google verify window band ho gayi.',
        'auth/credential-already-in-use': 'Is email par password pehle se set hai.',
      };
      setError(map[err.code] || err.message || 'Kuch galat ho gaya.');
    } finally {
      setLoading(false);
    }
  };

  const title = hasPass ? 'Change Password' : 'Set Password';

  return (
    <div className="glass rounded-2xl p-4 border border-white/5">
      <button
        onClick={() => { setOpen(!open); reset(); }}
        className="w-full flex items-center justify-between gap-3 text-left bg-transparent border-none cursor-pointer"
      >
        <span className="flex items-center gap-3 text-gray-200 font-medium">
          <FaKey className="text-accent" size={15} /> {title}
        </span>
        <FaChevronDown size={12} className={`text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {!hasPass && !open && (
        <p className="text-gray-500 text-xs mt-2">Aap Google se login ho — ek password set kar lo taaki email/password se bhi login kar sako.</p>
      )}

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          {hasPass && (
            <div className="relative">
              <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
              <input
                type="password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                required
                placeholder="Current password"
                className="w-full pl-10 pr-3 py-2.5 bg-dark text-white text-sm rounded-xl border border-white/10 focus:border-accent focus:outline-none"
              />
            </div>
          )}
          <div className="relative">
            <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
            <input
              type="password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              required
              placeholder="New password (min 6)"
              className="w-full pl-10 pr-3 py-2.5 bg-dark text-white text-sm rounded-xl border border-white/10 focus:border-accent focus:outline-none"
            />
          </div>
          <div className="relative">
            <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              placeholder="Confirm new password"
              className="w-full pl-10 pr-3 py-2.5 bg-dark text-white text-sm rounded-xl border border-white/10 focus:border-accent focus:outline-none"
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-accent text-dark text-sm font-semibold rounded-xl hover:bg-accent-hover transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
            ) : done ? (
              <><FaCheckCircle /> Saved!</>
            ) : (
              title
            )}
          </button>
        </form>
      )}

      {done && !open && (
        <p className="text-green-400 text-xs mt-2 flex items-center gap-1.5"><FaCheckCircle /> Password updated!</p>
      )}
    </div>
  );
};

export default PasswordManager;
