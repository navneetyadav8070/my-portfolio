import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, getClientProjects } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { FaSignOutAlt, FaClock, FaInfoCircle, FaHome, FaPlus, FaChevronDown } from 'react-icons/fa';
import PasswordManager from '../components/PasswordManager';

const WORK_STATUS_LABELS = {
  not_started: { label: 'Not Started', color: 'bg-white/5 text-gray-400 border-white/10' },
  in_progress: { label: 'In Process', color: 'bg-accent/10 text-accent border-accent/20' },
  in_review: { label: 'In Review', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  on_hold: { label: 'On Hold', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  completed: { label: 'Completed', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
};

const workMeta = (p) => {
  const key = p.workStatus || (Number(p.progress) >= 100 ? 'completed' : 'in_progress');
  return WORK_STATUS_LABELS[key] || WORK_STATUS_LABELS.in_progress;
};

const money = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
    .format(Number(amount) || 0)
    .replace('INR', '₹');

const moneyShort = (amount) => {
  const n = Number(amount) || 0;
  if (n >= 10000000) return '₹' + (n / 10000000).toFixed(n % 10000000 ? 1 : 0) + 'Cr';
  if (n >= 100000) return '₹' + (n / 100000).toFixed(n % 100000 ? 1 : 0) + 'L';
  if (n >= 1000) return '₹' + (n / 1000).toFixed(n % 1000 ? 1 : 0) + 'K';
  return '₹' + n.toLocaleString('en-IN');
};

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);
      try {
        const result = await getClientProjects(user.email);
        setProjects(result.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error('Projects load nahi hue:', err);
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

  const summary = useMemo(() => ({
    total: projects.length,
    active: projects.filter((p) => (p.workStatus || (Number(p.progress) >= 100 ? 'completed' : 'in_progress')) !== 'completed').length,
    paid: projects.reduce((s, p) => s + (Number(p.paidAmount) || 0), 0),
  }), [projects]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  const firstName = (user?.displayName || 'Client').split(' ')[0];
  const initial = (user?.displayName || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-dark">
      {/* ---------- Top bar ---------- */}
      <header className="fixed top-0 inset-x-0 z-50 bg-dark/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-accent to-green-400 rounded-xl flex items-center justify-center">
              <span className="text-base font-bold text-dark">NY</span>
            </div>
            <span className="text-white font-bold hidden sm:block text-sm">Navneet Yadav</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 px-3.5 py-2 text-sm text-gray-300 hover:text-white rounded-xl hover:bg-white/5 transition-all">
              <FaHome size={14} /> <span className="hidden sm:inline">Home</span>
            </Link>

            {/* Profile dropdown — sab kuch yahan (space bachta hai) */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full glass border border-white/10 hover:border-accent/30 transition-all cursor-pointer"
              >
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-green-400 flex items-center justify-center text-dark font-bold text-sm">{initial}</span>
                <span className="text-white text-sm font-medium hidden sm:block max-w-[110px] truncate">{firstName}</span>
                <FaChevronDown size={11} className={`text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-72 max-h-[80vh] overflow-y-auto z-50 glass rounded-2xl border border-white/10 shadow-2xl shadow-black/50 p-4 space-y-3">
                    <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                      <span className="w-11 h-11 rounded-full bg-gradient-to-br from-accent to-green-400 flex items-center justify-center text-dark font-bold shrink-0">{initial}</span>
                      <div className="min-w-0">
                        <p className="text-white font-semibold truncate">{user?.displayName || 'Client'}</p>
                        <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                      </div>
                    </div>
                    <PasswordManager user={user} />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all bg-transparent border-none cursor-pointer text-sm"
                    >
                      <FaSignOutAlt size={14} /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ---------- Content ---------- */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-16">
        {/* Slim hero + inline stats */}
        <div className="relative overflow-hidden rounded-3xl border border-accent/15 bg-gradient-to-br from-accent/10 via-dark to-dark p-5 sm:p-6 mb-5">
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div>
              <p className="text-accent text-[11px] uppercase tracking-[0.2em] mb-1">Client Dashboard</p>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Hi {firstName} 👋</h1>
            </div>
            <Link to="/#services" className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent text-dark font-semibold rounded-xl hover:bg-accent-hover transition-all text-sm shrink-0">
              <FaPlus size={12} /> <span className="hidden xs:inline sm:inline">New Project</span>
            </Link>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-3 mt-5">
            <div className="rounded-2xl bg-white/[0.04] border border-white/10 px-3 py-2.5">
              <p className="text-gray-400 text-[10px] uppercase tracking-wider">Projects</p>
              <p className="text-lg sm:text-2xl font-bold text-white">{summary.total}</p>
            </div>
            <div className="rounded-2xl bg-white/[0.04] border border-white/10 px-3 py-2.5">
              <p className="text-gray-400 text-[10px] uppercase tracking-wider">Active</p>
              <p className="text-lg sm:text-2xl font-bold text-accent">{summary.active}</p>
            </div>
            <div className="rounded-2xl bg-white/[0.04] border border-white/10 px-3 py-2.5">
              <p className="text-gray-400 text-[10px] uppercase tracking-wider">Paid</p>
              <p className="text-lg sm:text-2xl font-bold text-white truncate" title={money(summary.paid)}>{moneyShort(summary.paid)}</p>
            </div>
          </div>

          <div className="absolute -right-10 -top-12 w-44 h-44 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Projects */}
        <h2 className="text-lg font-bold text-white mb-3">
          Your Projects {projects.length > 0 && <span className="text-accent">({projects.length})</span>}
        </h2>

        {projects.length === 0 ? (
          <div className="glass rounded-2xl p-10 border border-white/5 text-center">
            <div className="text-5xl mb-3">🚀</div>
            <p className="text-gray-400">Abhi tak koi project nahi.</p>
            <Link to="/#services" className="inline-block mt-4 px-6 py-2.5 bg-accent text-dark font-semibold rounded-xl hover:bg-accent-hover transition-all">
              Start a Project
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {projects.map((project) => {
              const meta = workMeta(project);
              const progress = Number(project.progress) || 0;
              const remaining = Number(project.remainingAmount) || 0;
              return (
                <div key={project.id} className="glass rounded-2xl p-5 border border-white/5 hover:border-accent/20 transition-all">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-white font-semibold leading-snug">{project.projectName || 'Untitled Project'}</h3>
                    <span className={`text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap border ${meta.color}`}>{meta.label}</span>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span className="text-accent font-semibold">{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                    <span>Paid: <span className="text-accent font-medium">{moneyShort(project.paidAmount)}</span> / {moneyShort(project.totalAmount)}</span>
                    {remaining > 0 && <span>Bakaya: <span className="text-yellow-400 font-medium">{moneyShort(remaining)}</span></span>}
                    {project.estimatedTime && (
                      <span className="flex items-center gap-1"><FaClock className="text-accent/70" size={10} /> {project.estimatedTime}</span>
                    )}
                  </div>

                  {project.adminNote && (
                    <div className="mt-3 flex items-start gap-2 text-xs text-gray-300 bg-white/[0.03] rounded-lg p-2.5 border border-white/5">
                      <FaInfoCircle className="text-accent mt-0.5 shrink-0" size={12} />
                      <span>{project.adminNote}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
