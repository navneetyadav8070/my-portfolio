import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getClientProjects, logoutUser } from '../firebase';
import { FaArrowLeft, FaSignOutAlt, FaEye, FaClock, FaCheckCircle, FaSpinner, FaFolderOpen, FaPlus } from 'react-icons/fa';

const STATUS_COLORS = {
  'discussion': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', icon: <FaClock />, label: 'In Discussion' },
  'advance_paid': { bg: 'bg-blue-500/10', text: 'text-blue-400', icon: <FaSpinner />, label: 'Advance Paid' },
  'in_progress': { bg: 'bg-purple-500/10', text: 'text-purple-400', icon: <FaSpinner className="animate-spin" />, label: 'In Progress' },
  'review': { bg: 'bg-orange-500/10', text: 'text-orange-400', icon: <FaEye />, label: 'Under Review' },
  'completed': { bg: 'bg-green-500/10', text: 'text-green-400', icon: <FaCheckCircle />, label: 'Completed' },
};

const ClientDashboard = ({ user }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      
      try {
        const snapshot = await getClientProjects(user.email);
        
        // 🔥 FIXED: Check if snapshot has docs property (Firestore returns)
        let projectList = [];
        if (snapshot.docs) {
          // Standard Firestore snapshot
          projectList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } else if (Array.isArray(snapshot)) {
          // Array fallback
          projectList = snapshot;
        }
        
        setProjects(projectList);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setProjects([]); // Empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [user?.email]);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR', 
      maximumFractionDigits: 0 
    }).format(amount || 0).replace('INR', '₹');
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-gray-400 hover:text-accent transition-colors">
                <FaArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">My Projects</h1>
                <p className="text-sm text-gray-400">{user?.email || 'User'}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-red-400 glass rounded-xl border border-white/5 transition-all">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading your projects...</p>
          </div>
        ) : projects.length === 0 ? (
          /* NO PROJECTS STATE */
          <div className="text-center py-20">
            <div className="w-24 h-24 glass rounded-3xl flex items-center justify-center mx-auto mb-6 border border-accent/10">
              <FaFolderOpen className="text-accent text-4xl opacity-50" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No Projects Yet</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-8">
              You don't have any active projects. Contact Navneet to discuss your requirements and start a new project.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/#contact" className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-dark font-semibold rounded-xl hover:bg-accent-hover transition-all">
                <FaPlus /> Start a New Project
              </Link>
              <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 glass text-white font-semibold rounded-xl border border-white/10 hover:border-accent/30 transition-all">
                ← Browse Services
              </Link>
            </div>
          </div>
        ) : (
          /* PROJECT LIST */
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm">Showing {projects.length} project{projects.length > 1 ? 's' : ''}</p>
            </div>
            
            <div className="grid gap-6">
              {projects.map((project) => {
                const status = STATUS_COLORS[project.status] || STATUS_COLORS['discussion'];
                return (
                  <div key={project.id} className="glass rounded-2xl p-6 border border-white/5 hover:border-accent/20 transition-all">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold text-white">{project.projectName || 'Untitled Project'}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${status.bg} ${status.text}`}>
                            {status.icon} {status.label}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">{project.description || 'No description'}</p>
                        
                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-accent font-medium">{project.progress || 0}%</span>
                          </div>
                          <div className="w-full h-2.5 bg-dark rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-accent to-green-400 rounded-full transition-all duration-700" 
                              style={{ width: `${project.progress || 0}%` }} />
                          </div>
                        </div>
                      </div>

                      <div className="sm:text-right flex-shrink-0">
                        <p className="text-gray-500 text-sm">Total Amount</p>
                        <p className="text-2xl font-bold text-white">{formatCurrency(project.totalAmount)}</p>
                        <div className="mt-1 space-y-1">
                          <p className="text-gray-500 text-xs">
                            Paid: <span className="text-accent font-medium">{formatCurrency(project.paidAmount || 0)}</span>
                          </p>
                          <p className="text-gray-500 text-xs">
                            Balance: <span className="text-yellow-400 font-medium">
                              {formatCurrency((project.totalAmount || 0) - (project.paidAmount || 0))}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Milestones */}
                    {project.milestones && project.milestones.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-sm text-gray-400 mb-3">Milestones</p>
                        <div className="flex flex-wrap gap-2">
                          {project.milestones.map((milestone, i) => (
                            <span key={i} className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                              milestone.completed 
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                : 'bg-white/5 text-gray-400 border border-white/5'
                            }`}>
                              {milestone.completed ? '✅' : '⏳'} {milestone.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;