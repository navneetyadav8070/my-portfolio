import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // ✅ YEH IMPORT ADD KARO
import { auth, db } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FaUsers, FaFolder, FaCog, FaSignOutAlt, FaUserShield } from 'react-icons/fa';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  // ✅ AB YEH KAAM KAREGA

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role !== 'super_admin' && userData.role !== 'admin') {
          navigate('/dashboard');
          return;
        }
        setUser(user);
        setUserRole(userData.role);
      } else {
        navigate('/login');
      }
      
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="glass rounded-2xl p-6 border border-accent/10 text-center">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">{user?.displayName?.charAt(0) || 'A'}</span>
              </div>
              <h3 className="text-white font-bold">{user?.displayName || 'Admin'}</h3>
              <p className="text-gray-400 text-sm">{user?.email}</p>
              <p className="text-accent text-xs mt-1 flex items-center justify-center gap-1">
                <FaUserShield className="text-xs" /> {userRole || 'Admin'}
              </p>
            </div>

            <div className="glass rounded-2xl p-4 border border-white/5 space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-white bg-accent/10 border border-accent/20">
                <FaUsers size={16} /> All Users
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                <FaFolder size={16} /> All Projects
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                <FaCog size={16} /> Settings
              </button>
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all">
                <FaSignOutAlt size={16} /> Logout
              </button>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="glass rounded-2xl p-6 border border-accent/10">
              <h2 className="text-2xl font-bold text-white mb-2">Admin Dashboard 👑</h2>
              <p className="text-gray-400">Welcome back, {user?.displayName || 'Admin'}!</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="glass rounded-2xl p-5 border border-white/5">
                <p className="text-gray-500 text-xs uppercase tracking-wider">Total Users</p>
                <p className="text-3xl font-bold text-white mt-1">0</p>
              </div>
              <div className="glass rounded-2xl p-5 border border-white/5">
                <p className="text-gray-500 text-xs uppercase tracking-wider">Total Projects</p>
                <p className="text-3xl font-bold text-white mt-1">0</p>
              </div>
              <div className="glass rounded-2xl p-5 border border-white/5">
                <p className="text-gray-500 text-xs uppercase tracking-wider">Revenue</p>
                <p className="text-3xl font-bold text-accent mt-1">₹0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;