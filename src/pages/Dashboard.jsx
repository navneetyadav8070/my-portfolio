import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, getClientProjects } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { FaSignOutAlt, FaClock, FaInfoCircle, FaHome, FaPlus, FaFolder } from 'react-icons/fa';
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

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
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
        setProjects(result.docs.map(d => ({ id: d.id, ...d.data() })));
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
    active: projects.filter(p => (p.workStatus || (Number(p.progress) >= 100 ? 'completed' : 'in_progress')) !== 'completed').length,
    paid: projects.reduce((s, p) => s + (Number(p.paidAmount) || 0), 0),
  }), [projects]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Top bar — client yahan se home ja sakta hai */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-dark/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-accent to-green-400 rounded-xl flex items-center justify-center">
              <span className="text-lg font-bold text-dark">NY</span>
            </div>
            <span className="text-white font-bold hidden sm:block">Navneet Yadav</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white glass rounded-xl border border-white/10 hover:border-accent/30 transition-all">
              <FaHome size={14} /> <span className="hidden sm:inline">Home</span>
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl border border-transparent hover:border-red-500/20 transition-all bg-transparent cursor-pointer">
              <FaSignOutAlt size={14} /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="glass rounded-2xl p-6 border border-accent/10 text-center">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl text-accent font-bold">{user?.displayName?.charAt(0)?.toUpperCase() || 'U'}</span>
              </div>
              <h3 className="text-white font-bold">{user?.displayName || 'Client'}</h3>
              <p className="text-gray-400 text-sm break-all">{user?.email}</p>
              <span className="inline-block mt-2 text-accent text-xs px-3 py-1 rounded-full bg-accent/10 border border-accent/20">Client</span>
            </div>

            <div className="glass rounded-2xl p-3 border border-white/5 space-y-1.5">
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white bg-accent/10 border border-accent/20 font-medium">
                <FaFolder size={15} /> My Projects
              </div>
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all bg-transparent border-none cursor-pointer">
                <FaSignOutAlt size={15} /> Logout
              </button>
            </div>

            {/* Password: Google user ko Set, baaki ko Change */}
            <PasswordManager user={user} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Attractive banner (naam/email dobara nahi — wo sidebar me hai) */}
            <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 border border-accent/20 bg-gradient-to-br from-accent/10 via-dark to-dark">
              <div className="relative z-10">
                <p className="text-accent text-[11px] uppercase tracking-[0.2em] mb-2">Client Dashboard</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Your Project Overview</h2>
                <p className="text-gray-400 text-sm max-w-md">Apne projects ka live progress, payments aur updates yahaan dekho.</p>
                <Link to="/#services" className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-accent text-dark font-semibold rounded-xl hover:bg-accent-hover transition-all text-sm">
                  <FaPlus size={13} /> Start New Project
                </Link>
              </div>
              <div className="absolute -right-10 -top-10 w-44 h-44 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute right-10 bottom-0 w-24 h-24 bg-green-400/10 rounded-full blur-2xl pointer-events-none" />
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="glass rounded-2xl p-5 border border-white/5">
                <p className="text-gray-500 text-xs uppercase tracking-wider">Projects</p>
                <p className="text-2xl sm:text-3xl font-bold text-white mt-1">{summary.total}</p>
              </div>
              <div className="glass rounded-2xl p-5 border border-white/5">
                <p className="text-gray-500 text-xs uppercase tracking-wider">Active</p>
                <p className="text-2xl sm:text-3xl font-bold text-accent mt-1">{summary.active}</p>
              </div>
              <div className="glass rounded-2xl p-5 border border-white/5">
                <p className="text-gray-500 text-xs uppercase tracking-wider">Total Paid</p>
                <p className="text-2xl sm:text-3xl font-bold text-white mt-1">{money(summary.paid)}</p>
              </div>
            </div>

            {/* Projects */}
            <div className="glass rounded-2xl p-6 border border-white/5">
              <h3 className="text-lg font-bold text-white mb-4">
                Your Projects {projects.length > 0 && <span className="text-accent">({projects.length})</span>}
              </h3>

              {projects.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-4xl mb-3">🚀</div>
                  <p className="text-gray-400">Abhi tak koi project nahi.</p>
                  <Link to="/#services" className="inline-block mt-4 px-6 py-2.5 bg-accent text-dark font-semibold rounded-xl hover:bg-accent-hover transition-all">
                    Start a Project
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => {
                    const meta = workMeta(project);
                    const progress = Number(project.progress) || 0;
                    const remaining = Number(project.remainingAmount) || 0;
                    return (
                      <div key={project.id} className="glass rounded-xl p-5 border border-white/5">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <p className="text-white font-semibold">{project.projectName || 'Untitled Project'}</p>
                          <span className={`text-xs px-3 py-1 rounded-full whitespace-nowrap border ${meta.color}`}>{meta.label}</span>
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

                        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-400">
                          <span>Paid: <span className="text-accent font-medium">{money(project.paidAmount)}</span> / {money(project.totalAmount)}</span>
                          {remaining > 0 && <span>Remaining: <span className="text-yellow-400 font-medium">{money(remaining)}</span></span>}
                          {project.estimatedTime && (
                            <span className="flex items-center gap-1.5"><FaClock className="text-accent/70" /> ETA: <span className="text-white">{project.estimatedTime}</span></span>
                          )}
                        </div>

                        {project.adminNote && (
                          <div className="mt-3 flex items-start gap-2 text-sm text-gray-300 bg-white/[0.03] rounded-lg p-3 border border-white/5">
                            <FaInfoCircle className="text-accent mt-0.5 flex-shrink-0" />
                            <span>{project.adminNote}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
