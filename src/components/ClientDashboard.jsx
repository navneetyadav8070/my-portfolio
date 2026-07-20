import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getClientProjects, logoutUser } from '../firebase';
import { FaArrowLeft, FaSignOutAlt, FaEye, FaClock, FaCheckCircle, FaSpinner, FaFolderOpen, FaPlus, FaCalendarAlt, FaMoneyBillWave, FaUser, FaPhone, FaEnvelope, FaWhatsapp } from 'react-icons/fa';

const STATUS_CONFIG = {
  'pending_payment': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', icon: <FaClock />, label: 'Payment Pending', progress: 5 },
  'advance_paid': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', icon: <FaSpinner />, label: 'Advance Paid', progress: 10 },
  'fully_paid': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', icon: <FaCheckCircle />, label: 'Fully Paid', progress: 15 },
  'in_progress': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', icon: <FaSpinner className="animate-spin" />, label: 'In Progress', progress: 30 },
  'review': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', icon: <FaEye />, label: 'Under Review', progress: 80 },
  'completed': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', icon: <FaCheckCircle />, label: 'Completed', progress: 100 },
  'discussion': { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/20', icon: <FaClock />, label: 'In Discussion', progress: 0 },
};

const MILESTONE_STEPS = [
  { key: 'payment', label: 'Payment', icon: '💳' },
  { key: 'setup', label: 'Project Setup', icon: '⚙️' },
  { key: 'development', label: 'Development', icon: '💻' },
  { key: 'testing', label: 'Testing', icon: '🧪' },
  { key: 'deployment', label: 'Deployment', icon: '🚀' },
];

const ClientDashboard = ({ user }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.email) { setLoading(false); return; }
      
      try {
        const snapshot = await getClientProjects(user.email);
        let projectList = [];
        if (snapshot.docs) {
          projectList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } else if (Array.isArray(snapshot)) {
          projectList = snapshot;
        }
        setProjects(projectList);
      } catch (err) {
        console.error('Error:', err);
        setProjects([]);
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
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0).replace('INR', '₹');
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getStatusConfig = (status) => STATUS_CONFIG[status] || STATUS_CONFIG['discussion'];

  // Project Detail View
  if (selectedProject) {
    const project = selectedProject;
    const status = getStatusConfig(project.status);
    const paidPercent = project.totalAmount ? Math.round((project.paidAmount / project.totalAmount) * 100) : 0;

    return (
      <div className="min-h-screen bg-dark">
        <div className="glass border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedProject(null)} className="text-gray-400 hover:text-accent">
                  <FaArrowLeft size={20} />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-white">{project.projectName}</h1>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                    {status.icon} {status.label}
                  </span>
                </div>
              </div>
              <Link to="/" className="text-sm text-gray-400 hover:text-white">← Home</Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Tracker */}
              <div className="glass rounded-2xl p-6 border border-white/5">
                <h3 className="text-lg font-bold text-white mb-6">Project Progress</h3>
                
                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Overall Progress</span>
                    <span className="text-accent font-bold">{project.progress || status.progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-dark rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-accent to-green-400 rounded-full transition-all duration-1000" 
                      style={{ width: `${project.progress || status.progress}%` }} />
                  </div>
                </div>

                {/* Milestone Timeline */}
                <div className="space-y-0">
                  {project.milestones?.map((milestone, i) => (
                    <div key={i} className="relative flex items-start gap-4 pb-6 last:pb-0">
                      {i < project.milestones.length - 1 && (
                        <div className={`absolute left-[19px] top-10 bottom-0 w-0.5 ${milestone.completed ? 'bg-accent' : 'bg-white/10'}`} />
                      )}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${
                        milestone.completed ? 'bg-accent text-dark' : 'bg-dark-card text-gray-500 border-2 border-white/10'
                      }`}>
                        {milestone.completed ? '✅' : '⏳'}
                      </div>
                      <div className="flex-grow pt-2">
                        <h4 className={`font-semibold ${milestone.completed ? 'text-white' : 'text-gray-500'}`}>
                          {milestone.title}
                        </h4>
                        {milestone.completed && (
                          <p className="text-xs text-gray-500 mt-1">Completed ✓</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment History */}
              <div className="glass rounded-2xl p-6 border border-white/5">
                <h3 className="text-lg font-bold text-white mb-4">Payment Details</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-dark/50 rounded-xl p-4 text-center">
                    <p className="text-gray-500 text-xs mb-1">Total Amount</p>
                    <p className="text-white font-bold text-xl">{formatCurrency(project.totalAmount)}</p>
                  </div>
                  <div className="bg-dark/50 rounded-xl p-4 text-center">
                    <p className="text-gray-500 text-xs mb-1">Paid</p>
                    <p className="text-accent font-bold text-xl">{formatCurrency(project.paidAmount)}</p>
                  </div>
                  <div className="bg-dark/50 rounded-xl p-4 text-center">
                    <p className="text-gray-500 text-xs mb-1">Balance</p>
                    <p className="text-yellow-400 font-bold text-xl">{formatCurrency(project.remainingAmount || 0)}</p>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-dark/30 rounded-xl">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Payment Progress</span>
                    <span className="text-accent">{paidPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-dark rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${paidPercent}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Info */}
              <div className="glass rounded-2xl p-6 border border-white/5">
                <h3 className="text-lg font-bold text-white mb-4">Project Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <FaCalendarAlt className="text-gray-500" />
                    <span className="text-gray-400">Started: {formatDate(project.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <FaMoneyBillWave className="text-gray-500" />
                    <span className="text-gray-400">Type: {project.paymentType === 'half' ? '50% Advance' : project.paymentType === 'full' ? 'Full Payment' : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <FaClock className="text-gray-500" />
                    <span className="text-gray-400">Status: <span className={status.text}>{status.label}</span></span>
                  </div>
                  {project.paymentId && (
                    <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-white/5">
                      Payment ID: <span className="text-gray-400 font-mono">{project.paymentId}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Need Help */}
              <div className="glass rounded-2xl p-6 border border-accent/10 bg-accent/[0.02]">
                <h3 className="text-lg font-bold text-white mb-3">Need Help?</h3>
                <p className="text-gray-400 text-sm mb-4">Have questions about your project?</p>
                <div className="space-y-2">
                  <a href="tel:+918826999747" className="flex items-center gap-2 text-sm text-gray-400 hover:text-accent transition-colors">
                    <FaPhone size={12} /> +91 8826999747
                  </a>
                  <a href="mailto:Navneetyadav8070@gmail.com" className="flex items-center gap-2 text-sm text-gray-400 hover:text-accent transition-colors">
                    <FaEnvelope size={12} /> Send Email
                  </a>
                  <a href="https://wa.me/918826999747" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-400 hover:text-green-400 transition-colors">
                    <FaWhatsapp size={12} /> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Project List View
  return (
    <div className="min-h-screen bg-dark">
      <div className="glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-gray-400 hover:text-accent"><FaArrowLeft size={20} /></Link>
              <div>
                <h1 className="text-xl font-bold text-white">My Projects</h1>
                <p className="text-sm text-gray-400">{user?.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-red-400 glass rounded-xl border border-white/5 transition-all">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading your projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 glass rounded-3xl flex items-center justify-center mx-auto mb-6 border border-accent/10">
              <FaFolderOpen className="text-accent text-4xl opacity-50" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No Projects Yet</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-8">
              You haven't started any projects yet. Browse services and get started!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/#services" className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-dark font-semibold rounded-xl hover:bg-accent-hover transition-all">
                <FaPlus /> Start a New Project
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-400 text-sm mb-4">{projects.length} project{projects.length > 1 ? 's' : ''} found</p>
            
            {projects.map((project) => {
              const status = getStatusConfig(project.status);
              const paidPercent = project.totalAmount ? Math.round((project.paidAmount / project.totalAmount) * 100) : 0;

              return (
                <div key={project.id} 
                  onClick={() => setSelectedProject(project)}
                  className="glass rounded-2xl p-5 sm:p-6 border border-white/5 hover:border-accent/30 transition-all cursor-pointer group">
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors">
                          {project.projectName || 'Untitled Project'}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 ${status.bg} ${status.text} ${status.border} border`}>
                          {status.icon} {status.label}
                        </span>
                      </div>
                      
                      {/* Mini Progress */}
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex-1 h-1.5 bg-dark rounded-full overflow-hidden max-w-[200px]">
                          <div className="h-full bg-accent rounded-full" style={{ width: `${project.progress || status.progress}%` }} />
                        </div>
                        <span className="text-xs text-gray-500">{project.progress || status.progress}%</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 sm:gap-8">
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="text-white font-bold">{formatCurrency(project.totalAmount)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Paid</p>
                        <p className="text-accent font-bold">{formatCurrency(project.paidAmount)}</p>
                      </div>
                      <FaEye className="text-gray-600 group-hover:text-accent transition-colors" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;