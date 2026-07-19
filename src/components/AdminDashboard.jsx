import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, updateDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db, logoutUser } from '../firebase';
import { FaArrowLeft, FaSignOutAlt, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const AdminDashboard = ({ user }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    clientEmail: '',
    clientName: '',
    projectName: '',
    description: '',
    totalAmount: '',
    status: 'discussion',
    progress: 0,
    milestones: [],
    paidAmount: 0
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await updateDoc(doc(db, 'projects', editingProject.id), {
          ...formData,
          totalAmount: parseInt(formData.totalAmount),
          paidAmount: parseInt(formData.paidAmount),
          progress: parseInt(formData.progress),
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'projects'), {
          ...formData,
          totalAmount: parseInt(formData.totalAmount),
          paidAmount: parseInt(formData.paidAmount),
          progress: parseInt(formData.progress),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          payments: []
        });
      }
      setShowForm(false);
      setEditingProject(null);
      setFormData({ clientEmail: '', clientName: '', projectName: '', description: '', totalAmount: '', status: 'discussion', progress: 0, milestones: [], paidAmount: 0 });
      fetchProjects();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      clientEmail: project.clientEmail,
      clientName: project.clientName,
      projectName: project.projectName,
      description: project.description || '',
      totalAmount: project.totalAmount,
      status: project.status,
      progress: project.progress,
      milestones: project.milestones || [],
      paidAmount: project.paidAmount || 0
    });
    setShowForm(true);
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount).replace('INR', '₹');
  };

  return (
    <div className="min-h-screen bg-dark">
      <div className="glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-gray-400 hover:text-accent"><FaArrowLeft size={20} /></Link>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-sm text-gray-400">Manage all projects</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => { setEditingProject(null); setFormData({ clientEmail: '', clientName: '', projectName: '', description: '', totalAmount: '', status: 'discussion', progress: 0, milestones: [], paidAmount: 0 }); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-accent text-dark text-sm font-semibold rounded-xl hover:bg-accent-hover transition-all">
                <FaPlus /> New Project
              </button>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-red-400 glass rounded-xl transition-all">
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <div className="glass rounded-2xl p-6 border border-accent/10 mb-8">
            <h3 className="text-xl font-bold text-white mb-6">{editingProject ? 'Edit Project' : 'New Project'}</h3>
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
              <input type="email" placeholder="Client Email *" value={formData.clientEmail} onChange={(e) => setFormData({...formData, clientEmail: e.target.value})} required className="px-4 py-3 bg-dark text-white rounded-xl border border-white/10 focus:border-accent focus:outline-none" />
              <input type="text" placeholder="Client Name *" value={formData.clientName} onChange={(e) => setFormData({...formData, clientName: e.target.value})} required className="px-4 py-3 bg-dark text-white rounded-xl border border-white/10 focus:border-accent focus:outline-none" />
              <input type="text" placeholder="Project Name *" value={formData.projectName} onChange={(e) => setFormData({...formData, projectName: e.target.value})} required className="px-4 py-3 bg-dark text-white rounded-xl border border-white/10 focus:border-accent focus:outline-none" />
              <input type="number" placeholder="Total Amount (₹) *" value={formData.totalAmount} onChange={(e) => setFormData({...formData, totalAmount: e.target.value})} required className="px-4 py-3 bg-dark text-white rounded-xl border border-white/10 focus:border-accent focus:outline-none" />
              <input type="number" placeholder="Paid Amount (₹)" value={formData.paidAmount} onChange={(e) => setFormData({...formData, paidAmount: e.target.value})} className="px-4 py-3 bg-dark text-white rounded-xl border border-white/10 focus:border-accent focus:outline-none" />
              <input type="number" placeholder="Progress (%)" value={formData.progress} onChange={(e) => setFormData({...formData, progress: e.target.value})} min="0" max="100" className="px-4 py-3 bg-dark text-white rounded-xl border border-white/10 focus:border-accent focus:outline-none" />
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="px-4 py-3 bg-dark text-white rounded-xl border border-white/10 focus:border-accent focus:outline-none">
                <option value="discussion">In Discussion</option>
                <option value="advance_paid">Advance Paid</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Under Review</option>
                <option value="completed">Completed</option>
              </select>
              <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="sm:col-span-2 px-4 py-3 bg-dark text-white rounded-xl border border-white/10 focus:border-accent focus:outline-none resize-none" rows="3" />
              <div className="sm:col-span-2 flex gap-3">
                <button type="submit" className="flex-1 py-3 bg-accent text-dark font-bold rounded-xl hover:bg-accent-hover transition-all border-none cursor-pointer">{editingProject ? 'Update' : 'Create'} Project</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 glass text-white rounded-xl border border-white/10 hover:border-accent/30 transition-all">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="glass rounded-2xl p-6 border border-white/5 hover:border-accent/20 transition-all">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">{project.projectName}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                        project.status === 'in_progress' ? 'bg-purple-500/10 text-purple-400' :
                        project.status === 'review' ? 'bg-orange-500/10 text-orange-400' :
                        'bg-yellow-500/10 text-yellow-400'
                      }`}>{project.status.replace('_', ' ')}</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">Client: {project.clientName} ({project.clientEmail})</p>
                    <div className="w-full h-2 bg-dark rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-gradient-to-r from-accent to-green-400 rounded-full" style={{ width: `${project.progress || 0}%` }} />
                    </div>
                  </div>
                  <div className="sm:text-right flex-shrink-0">
                    <p className="text-xl font-bold text-white">{formatCurrency(project.totalAmount)}</p>
                    <p className="text-sm text-gray-400">Paid: {formatCurrency(project.paidAmount)}</p>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => handleEdit(project)} className="px-3 py-1.5 text-xs bg-accent/10 text-accent rounded-lg hover:bg-accent hover:text-dark transition-all"><FaEdit /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;