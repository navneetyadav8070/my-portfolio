import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db, logoutUser } from '../firebase';
import { FaArrowLeft, FaSignOutAlt, FaEdit, FaSearch, FaFilter, FaCheckCircle, FaSpinner, FaClock, FaEye, FaRocket } from 'react-icons/fa';

const STATUS_OPTIONS = [
  { value: 'pending_payment', label: 'Payment Pending', color: 'bg-yellow-500/10 text-yellow-400' },
  { value: 'advance_paid', label: 'Advance Paid', color: 'bg-blue-500/10 text-blue-400' },
  { value: 'fully_paid', label: 'Fully Paid', color: 'bg-green-500/10 text-green-400' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-purple-500/10 text-purple-400' },
  { value: 'review', label: 'Under Review', color: 'bg-orange-500/10 text-orange-400' },
  { value: 'completed', label: 'Completed', color: 'bg-green-500/10 text-green-400' },
];

const MILESTONE_TEMPLATES = {
  website: ['Design Approved', 'Frontend Development', 'Backend Setup', 'Testing', 'Deployment'],
  ecommerce: ['Design Approved', 'Product Setup', 'Payment Gateway', 'Testing', 'Launch'],
  webapp: ['Architecture Design', 'Core Features', 'API Integration', 'Testing', 'Deployment'],
  ai: ['Requirements Finalized', 'API Integration', 'Model Training', 'Testing', 'Deployment'],
  android: ['UI Design', 'Core Features', 'Backend Integration', 'Testing', 'Play Store Launch'],
  seo: ['Audit Complete', 'On-Page SEO', 'Off-Page SEO', 'Ad Campaigns', 'Monthly Report'],
  custom: ['Project Setup', 'Development', 'Testing', 'Review', 'Deployment']
};

const AdminDashboard = ({ user }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingProject, setEditingProject] = useState(null);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (projectId, newStatus) => {
    const progressMap = {
      'pending_payment': 5,
      'advance_paid': 10,
      'fully_paid': 15,
      'in_progress': 40,
      'review': 80,
      'completed': 100
    };

    await updateDoc(doc(db, 'projects', projectId), {
      status: newStatus,
      progress: progressMap[newStatus] || 0,
      updatedAt: serverTimestamp()
    });
    fetchProjects();
  };

  const handleMilestoneToggle = async (projectId, index) => {
    const project = projects.find(p => p.id === projectId);
    const milestones = [...(project.milestones || [])];
    if (milestones[index]) {
      milestones[index].completed = !milestones[index].completed;
      const completedCount = milestones.filter(m => m.completed).length;
      const progress = Math.round((completedCount / milestones.length) * 100);
      
      await updateDoc(doc(db, 'projects', projectId), {
        milestones,
        progress,
        updatedAt: serverTimestamp()
      });
      fetchProjects();
    }
  };

  const addMilestones = async (projectId, serviceType) => {
    const template = MILESTONE_TEMPLATES[serviceType] || MILESTONE_TEMPLATES['custom'];
    const milestones = template.map(title => ({ title, completed: false }));
    
    await updateDoc(doc(db, 'projects', projectId), {
      milestones,
      updatedAt: serverTimestamp()
    });
    fetchProjects();
  };

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

  const filteredProjects = projects.filter(project => {
    const matchesSearch = (project.clientEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (project.clientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (project.projectName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: projects.length,
    active: projects.filter(p => ['advance_paid', 'fully_paid', 'in_progress', 'review'].includes(p.status)).length,
    completed: projects.filter(p => p.status === 'completed').length,
    totalEarnings: projects.reduce((sum, p) => sum + (p.paidAmount || 0), 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="glass border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-gray-400 hover:text-accent"><FaArrowLeft size={20} /></Link>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-sm text-gray-400">Manage all projects</p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-red-400 glass rounded-xl transition-all">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Projects', value: stats.total, icon: '📊', color: 'text-white' },
            { label: 'Active', value: stats.active, icon: '⚡', color: 'text-accent' },
            { label: 'Completed', value: stats.completed, icon: '✅', color: 'text-green-400' },
            { label: 'Earnings', value: formatCurrency(stats.totalEarnings), icon: '💰', color: 'text-yellow-400' },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-2xl p-4 border border-white/5">
              <span className="text-2xl">{stat.icon}</span>
              <p className={`text-2xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
              <p className="text-gray-500 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by client name or email..."
              className="w-full pl-12 pr-4 py-3 bg-dark text-white rounded-xl border border-white/10 focus:border-accent focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-dark text-white rounded-xl border border-white/10 focus:border-accent focus:outline-none"
          >
            <option value="all">All Status</option>
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <div key={project.id} className="glass rounded-2xl p-6 border border-white/5">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Project Info */}
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white">{project.projectName || 'Untitled'}</h3>
                    <select
                      value={project.status}
                      onChange={(e) => handleStatusChange(project.id, e.target.value)}
                      className="text-xs px-2 py-1 rounded-full bg-dark border border-white/10 text-white cursor-pointer"
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-3">
                    <span>👤 {project.clientName || 'N/A'}</span>
                    <span>📧 {project.clientEmail || 'N/A'}</span>
                    <span>📅 {formatDate(project.createdAt)}</span>
                  </div>

                  {/* Progress */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-dark rounded-full overflow-hidden max-w-[300px]">
                      <div className="h-full bg-accent rounded-full" style={{ width: `${project.progress || 0}%` }} />
                    </div>
                    <span className="text-xs text-gray-500">{project.progress || 0}%</span>
                  </div>

                  {/* Milestones */}
                  {project.milestones ? (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {project.milestones.map((milestone, i) => (
                        <button
                          key={i}
                          onClick={() => handleMilestoneToggle(project.id, i)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            milestone.completed
                              ? 'bg-green-500/10 text-green-400 border-green-500/20'
                              : 'bg-white/5 text-gray-400 border-white/5 hover:border-accent/30'
                          }`}
                        >
                          {milestone.completed ? '✅' : '⏳'} {milestone.title}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button
                      onClick={() => addMilestones(project.id, project.serviceType)}
                      className="text-xs text-accent hover:underline mt-3"
                    >
                      + Add Milestones
                    </button>
                  )}
                </div>

                {/* Payment Info */}
                <div className="lg:text-right flex-shrink-0">
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="text-lg font-bold text-white">{formatCurrency(project.totalAmount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Paid</p>
                      <p className="text-lg font-bold text-accent">{formatCurrency(project.paidAmount)}</p>
                    </div>
                    {(project.remainingAmount || 0) > 0 && (
                      <div>
                        <p className="text-xs text-gray-500">Balance</p>
                        <p className="text-lg font-bold text-yellow-400">{formatCurrency(project.remainingAmount)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400">No projects found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;