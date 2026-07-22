import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, getClientProjects } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { FaUser, FaFolder, FaCog, FaSignOutAlt, FaEnvelope } from 'react-icons/fa';

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
      // Client ke apne projects laao
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
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="glass rounded-2xl p-6 border border-accent/10 text-center">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">
                  {user?.displayName?.charAt(0) || 'U'}
                </span>
              </div>
              <h3 className="text-white font-bold">{user?.displayName || 'User'}</h3>
              <p className="text-gray-400 text-sm">{user?.email}</p>
              <p className="text-accent text-xs mt-1">Client</p>
            </div>

            <div className="glass rounded-2xl p-4 border border-white/5 space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-white bg-accent/10 border border-accent/20">
                <FaUser size={16} /> My Profile
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                <FaFolder size={16} /> My Projects
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                <FaCog size={16} /> Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
              >
                <FaSignOutAlt size={16} /> Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <div className="glass rounded-2xl p-6 border border-accent/10">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome, {user?.displayName || 'User'}! 👋</h2>
              <p className="text-gray-400">Manage your projects and profile from here.</p>
            </div>

            {/* Profile Info */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="glass rounded-2xl p-5 border border-white/5">
                <p className="text-gray-500 text-xs uppercase tracking-wider">Email</p>
                <p className="text-white font-medium flex items-center gap-2 mt-1">
                  <FaEnvelope className="text-accent text-sm" /> {user?.email}
                </p>
              </div>
              <div className="glass rounded-2xl p-5 border border-white/5">
                <p className="text-gray-500 text-xs uppercase tracking-wider">Member Since</p>
                <p className="text-white font-medium mt-1">
                  {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            {/* Projects Section */}
            <div className="glass rounded-2xl p-6 border border-white/5">
              <h3 className="text-lg font-bold text-white mb-4">
                Your Projects {projects.length > 0 && <span className="text-accent">({projects.length})</span>}
              </h3>

              {projects.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🚀</div>
                  <p className="text-gray-400">No projects yet</p>
                  <Link
                    to="/#services"
                    className="inline-block mt-3 px-6 py-2.5 bg-accent text-dark font-semibold rounded-xl hover:bg-accent-hover transition-all"
                  >
                    Start a Project
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.map((project) => (
                    <div key={project.id} className="glass rounded-xl p-4 border border-white/5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-white font-medium">{project.title || project.service || 'Untitled Project'}</p>
                        {project.description && (
                          <p className="text-gray-500 text-sm mt-0.5 line-clamp-1">{project.description}</p>
                        )}
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full whitespace-nowrap ${
                        project.status === 'completed'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : project.status === 'in-progress'
                          ? 'bg-accent/10 text-accent border border-accent/20'
                          : 'bg-white/5 text-gray-400 border border-white/10'
                      }`}>
                        {project.status || 'pending'}
                      </span>
                    </div>
                  ))}
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