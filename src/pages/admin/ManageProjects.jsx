import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProjects, updateProjectStatus } from '../../firebase/config';
import {
  FaArrowLeft, FaSearch, FaUser, FaEnvelope,
  FaCalendarAlt, FaClock, FaSave, FaCheckCircle, FaFolderOpen, FaReceipt
} from 'react-icons/fa';

// Work status options (admin inhe set karega)
const WORK_STATUS = [
  { value: 'not_started', label: 'Not Started', color: 'text-gray-400 bg-white/5 border-white/10' },
  { value: 'in_progress', label: 'In Progress', color: 'text-accent bg-accent/10 border-accent/20' },
  { value: 'in_review', label: 'In Review', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { value: 'on_hold', label: 'On Hold', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
  { value: 'completed', label: 'Completed', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
];

const statusMeta = (value) => WORK_STATUS.find(s => s.value === value) || WORK_STATUS[0];

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
    .format(Number(amount) || 0)
    .replace('INR', '₹');

const formatDate = (ts) => {
  if (!ts) return 'N/A';
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  if (isNaN(d)) return 'N/A';
  return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// ---------- Single Project Card (apna local edit state rakhta hai) ----------
const ProjectCard = ({ project, onSaved }) => {
  const initialWork = project.workStatus || (project.progress >= 100 ? 'completed' : 'in_progress');
  const [workStatus, setWorkStatus] = useState(initialWork);
  const [progress, setProgress] = useState(Number(project.progress) || 0);
  const [estimatedTime, setEstimatedTime] = useState(project.estimatedTime || '');
  const [adminNote, setAdminNote] = useState(project.adminNote || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const dirty =
    workStatus !== initialWork ||
    progress !== (Number(project.progress) || 0) ||
    estimatedTime !== (project.estimatedTime || '') ||
    adminNote !== (project.adminNote || '');

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      await updateProjectStatus(project.id, {
        workStatus,
        progress: Number(progress),
        estimatedTime: estimatedTime.trim(),
        adminNote: adminNote.trim(),
      });
      setSaved(true);
      onSaved?.(project.id, { workStatus, progress: Number(progress), estimatedTime, adminNote });
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('Update failed:', err);
      setError('Save nahi hua. Dobara try karein.');
    } finally {
      setSaving(false);
    }
  };

  const meta = statusMeta(workStatus);
  const paidFull = (Number(project.remainingAmount) || 0) <= 0;

  return (
    <div className="glass rounded-2xl border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-white/5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <FaFolderOpen className="text-accent" /> {project.projectName || 'Untitled Project'}
          </h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm">
            <span className="text-gray-300 flex items-center gap-1.5">
              <FaUser className="text-gray-500 text-xs" /> {project.clientName || 'Unknown'}
            </span>
            <span className="text-gray-400 flex items-center gap-1.5">
              <FaEnvelope className="text-gray-500 text-xs" /> {project.clientEmail}
            </span>
          </div>
        </div>
        <span className={`text-xs px-3 py-1.5 rounded-full border whitespace-nowrap ${meta.color}`}>
          {meta.label}
        </span>
      </div>

      {/* Payment Info */}
      <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white/[0.02]">
        <div>
          <p className="text-gray-500 text-[11px] uppercase tracking-wider">Total</p>
          <p className="text-white font-bold mt-0.5">{formatCurrency(project.totalAmount)}</p>
        </div>
        <div>
          <p className="text-gray-500 text-[11px] uppercase tracking-wider">Paid</p>
          <p className="text-accent font-bold mt-0.5">{formatCurrency(project.paidAmount)}</p>
        </div>
        <div>
          <p className="text-gray-500 text-[11px] uppercase tracking-wider">Remaining</p>
          <p className={`font-bold mt-0.5 ${paidFull ? 'text-green-400' : 'text-yellow-400'}`}>
            {formatCurrency(project.remainingAmount)}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-[11px] uppercase tracking-wider">Payment</p>
          <p className="text-white font-medium mt-0.5 capitalize">
            {paidFull ? 'Full Paid' : (project.paymentType === 'half' ? '50% Advance' : project.paymentType || '—')}
          </p>
        </div>
      </div>

      {/* Payment meta row */}
      <div className="px-5 py-3 border-t border-white/5 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <FaCalendarAlt className="text-accent/70" /> Paid on: {formatDate(project.paymentDate || project.createdAt)}
        </span>
        {project.paymentId && (
          <span className="flex items-center gap-1.5">
            <FaReceipt className="text-accent/70" /> Payment ID: <span className="font-mono text-gray-300">{project.paymentId}</span>
          </span>
        )}
      </div>

      {/* Admin Controls */}
      <div className="p-5 border-t border-white/5 space-y-4">
        <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Manage this project</p>

        {/* Status + Estimated time */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Work Status</label>
            <select
              value={workStatus}
              onChange={(e) => setWorkStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-dark text-white rounded-xl border border-white/10 focus:border-accent focus:outline-none transition-all"
            >
              {WORK_STATUS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5 flex items-center gap-1.5">
              <FaClock className="text-gray-500 text-xs" /> Estimated Time
            </label>
            <input
              type="text"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              placeholder="e.g. 5 din, 2 hafte, 20 Aug tak"
              className="w-full px-4 py-2.5 bg-dark text-white rounded-xl border border-white/10 focus:border-accent focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Progress slider */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-sm text-gray-400">Progress</label>
            <span className="text-accent font-bold text-sm">{progress}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full accent-accent cursor-pointer"
          />
          <div className="w-full h-2 bg-white/5 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Admin note */}
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Note for client (optional)</label>
          <textarea
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            rows={2}
            placeholder="e.g. Design ho gaya, ab development chal raha hai..."
            className="w-full px-4 py-2.5 bg-dark text-white rounded-xl border border-white/10 focus:border-accent focus:outline-none transition-all resize-none"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {/* Save */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving || !dirty}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent text-dark font-semibold rounded-xl hover:bg-accent-hover transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
            ) : (
              <FaSave size={14} />
            )}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {saved && (
            <span className="text-green-400 text-sm flex items-center gap-1.5">
              <FaCheckCircle /> Saved!
            </span>
          )}
          {!dirty && !saved && <span className="text-gray-600 text-xs">No changes</span>}
        </div>
      </div>
    </div>
  );
};

// ---------- Main Page ----------
const ManageProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllProjects();
        setProjects(data);
      } catch (err) {
        console.error('Projects load failed:', err);
        setError('Projects load nahi hue. Firestore rules / connection check karein.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Local update after save (taaki UI turant refresh ho)
  const handleSaved = (id, patch) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const stats = useMemo(() => {
    const revenue = projects.reduce((s, p) => s + (Number(p.paidAmount || p.amount) || 0), 0);
    const pending = projects.reduce((s, p) => s + (Number(p.remainingAmount) || 0), 0);
    return { count: projects.length, revenue, pending };
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const ws = p.workStatus || (p.progress >= 100 ? 'completed' : 'in_progress');
      const matchFilter = filter === 'all' || ws === filter;
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        (p.clientName || '').toLowerCase().includes(q) ||
        (p.clientEmail || '').toLowerCase().includes(q) ||
        (p.projectName || '').toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [projects, filter, search]);

  return (
    <div className="min-h-screen bg-dark pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="text-gray-400 hover:text-white mb-5 flex items-center gap-2 text-sm bg-transparent border-none cursor-pointer"
        >
          <FaArrowLeft size={14} /> Back to Dashboard
        </button>

        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Manage Projects</h1>
            <p className="text-gray-400 text-sm mt-1">Client payments track karein aur project progress update karein.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="glass rounded-2xl p-5 border border-white/5">
            <p className="text-gray-500 text-xs uppercase tracking-wider">Total Projects</p>
            <p className="text-3xl font-bold text-white mt-1">{stats.count}</p>
          </div>
          <div className="glass rounded-2xl p-5 border border-accent/10">
            <p className="text-gray-500 text-xs uppercase tracking-wider">Total Received</p>
            <p className="text-3xl font-bold text-accent mt-1">{formatCurrency(stats.revenue)}</p>
          </div>
          <div className="glass rounded-2xl p-5 border border-white/5">
            <p className="text-gray-500 text-xs uppercase tracking-wider">Pending (Remaining)</p>
            <p className="text-3xl font-bold text-yellow-400 mt-1">{formatCurrency(stats.pending)}</p>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by client, email ya project name..."
              className="w-full pl-11 pr-4 py-2.5 bg-dark text-white rounded-xl border border-white/10 focus:border-accent focus:outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['all', ...WORK_STATUS.map(s => s.value)].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-2 rounded-xl text-sm whitespace-nowrap transition-all border ${
                  filter === f
                    ? 'bg-accent/10 text-accent border-accent/30'
                    : 'text-gray-400 border-white/10 hover:text-white hover:bg-white/5'
                }`}
              >
                {f === 'all' ? 'All' : statusMeta(f).label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="glass rounded-2xl p-8 border border-red-500/20 text-center text-red-400">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-2xl p-12 border border-white/5 text-center">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-400">
              {projects.length === 0 ? 'Abhi tak koi project/payment nahi aaya.' : 'Is filter/search se koi project nahi mila.'}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} onSaved={handleSaved} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProjects;
