import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProjects, updateProjectStatus } from '../../firebase/config';
import {
  FaArrowLeft, FaSearch, FaTimes, FaSave, FaCheckCircle,
  FaCalendarAlt, FaClock, FaReceipt, FaUser, FaEnvelope, FaCog
} from 'react-icons/fa';

// Work status options (admin inhe set karega)
const WORK_STATUS = [
  { value: 'not_started', label: 'Not Started', color: 'text-gray-400 bg-white/5 border-white/10' },
  { value: 'in_progress', label: 'In Process', color: 'text-accent bg-accent/10 border-accent/20' },
  { value: 'in_review', label: 'In Review', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { value: 'on_hold', label: 'On Hold', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
  { value: 'completed', label: 'Completed', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
];

const statusMeta = (value) => WORK_STATUS.find(s => s.value === value) || WORK_STATUS[0];
const workKey = (p) => p.workStatus || (Number(p.progress) >= 100 ? 'completed' : 'in_progress');

const money = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
    .format(Number(amount) || 0)
    .replace('INR', '₹');

// Chhota format (mobile par bade amount fit karne ke liye): ₹1L, ₹1.5L, ₹1Cr
const moneyShort = (amount) => {
  const n = Number(amount) || 0;
  if (n >= 10000000) return '₹' + (n / 10000000).toFixed(n % 10000000 ? 1 : 0) + 'Cr';
  if (n >= 100000) return '₹' + (n / 100000).toFixed(n % 100000 ? 1 : 0) + 'L';
  if (n >= 1000) return '₹' + (n / 1000).toFixed(n % 1000 ? 1 : 0) + 'K';
  return '₹' + n.toLocaleString('en-IN');
};

const formatDate = (ts) => {
  if (!ts) return 'N/A';
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  if (isNaN(d)) return 'N/A';
  return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// ---------- Manage Modal (click karne par khulta hai) ----------
const ManageModal = ({ project, onClose, onSaved }) => {
  const [workStatus, setWorkStatus] = useState(workKey(project));
  const [progress, setProgress] = useState(Number(project.progress) || 0);
  const [estimatedTime, setEstimatedTime] = useState(project.estimatedTime || '');
  const [adminNote, setAdminNote] = useState(project.adminNote || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const paidFull = (Number(project.remainingAmount) || 0) <= 0;

  const handleSave = async () => {
    setSaving(true); setError(''); setSaved(false);
    try {
      const patch = {
        workStatus,
        progress: Number(progress),
        estimatedTime: estimatedTime.trim(),
        adminNote: adminNote.trim(),
      };
      await updateProjectStatus(project.id, patch);
      setSaved(true);
      onSaved(project.id, patch);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Update failed:', err);
      setError('Save nahi hua. Dobara try karein.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="glass rounded-2xl border border-accent/20 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-start justify-between gap-3 sticky top-0 bg-dark/95 backdrop-blur-xl z-10">
          <div>
            <h3 className="text-white font-bold text-lg">{project.projectName || 'Untitled Project'}</h3>
            <p className="text-gray-400 text-sm mt-1 flex items-center gap-1.5"><FaUser className="text-xs" /> {project.clientName}</p>
            <p className="text-gray-500 text-xs flex items-center gap-1.5 mt-0.5"><FaEnvelope className="text-xs" /> {project.clientEmail}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white bg-transparent border-none cursor-pointer p-1">
            <FaTimes size={18} />
          </button>
        </div>

        {/* Payment summary */}
        <div className="p-5 grid grid-cols-2 gap-3 border-b border-white/5">
          <div className="glass rounded-xl p-3 border border-white/5">
            <p className="text-gray-500 text-[11px] uppercase">Total</p>
            <p className="text-white font-bold">{money(project.totalAmount)}</p>
          </div>
          <div className="glass rounded-xl p-3 border border-white/5">
            <p className="text-gray-500 text-[11px] uppercase">Paid</p>
            <p className="text-accent font-bold">{money(project.paidAmount)}</p>
          </div>
          <div className="glass rounded-xl p-3 border border-white/5">
            <p className="text-gray-500 text-[11px] uppercase">Remaining</p>
            <p className={`font-bold ${paidFull ? 'text-green-400' : 'text-yellow-400'}`}>{money(project.remainingAmount)}</p>
          </div>
          <div className="glass rounded-xl p-3 border border-white/5">
            <p className="text-gray-500 text-[11px] uppercase">Payment</p>
            <p className="text-white font-medium">{paidFull ? 'Full Paid' : '50% Advance'}</p>
          </div>
        </div>

        <div className="px-5 py-3 border-b border-white/5 flex flex-col gap-1 text-xs text-gray-400">
          <span className="flex items-center gap-1.5"><FaCalendarAlt className="text-accent/70" /> Paid on: {formatDate(project.paymentDate || project.createdAt)}</span>
          {project.paymentId && <span className="flex items-center gap-1.5"><FaReceipt className="text-accent/70" /> ID: <span className="font-mono text-gray-300">{project.paymentId}</span></span>}
        </div>

        {/* Controls */}
        <div className="p-5 space-y-4">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Manage this project</p>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Status (Process / Hold / Complete)</label>
            <select
              value={workStatus}
              onChange={(e) => setWorkStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-dark text-white rounded-xl border border-white/10 focus:border-accent focus:outline-none"
            >
              {WORK_STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1.5 flex items-center gap-1.5"><FaClock className="text-xs" /> Estimated Time</label>
            <input
              type="text"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              placeholder="e.g. 5 din, 2 hafte, 20 Aug tak"
              className="w-full px-4 py-2.5 bg-dark text-white rounded-xl border border-white/10 focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm text-gray-400">Progress</label>
              <span className="text-accent font-bold text-sm">{progress}%</span>
            </div>
            <input type="range" min="0" max="100" step="5" value={progress} onChange={(e) => setProgress(Number(e.target.value))} className="w-full accent-accent cursor-pointer" />
            <div className="w-full h-2 bg-white/5 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Message for client</label>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              rows={3}
              placeholder="e.g. Design ho gaya, development chal raha hai. 2 din me demo milega."
              className="w-full px-4 py-2.5 bg-dark text-white rounded-xl border border-white/10 focus:border-accent focus:outline-none resize-none"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-accent text-dark font-semibold rounded-xl hover:bg-accent-hover transition-all disabled:opacity-50"
            >
              {saving ? <div className="w-4 h-4 border-2 border-dark/30 border-t-dark rounded-full animate-spin" /> : <FaSave size={14} />}
              {saving ? 'Saving...' : 'Save & Notify Client'}
            </button>
            {saved && <span className="text-green-400 text-sm flex items-center gap-1.5"><FaCheckCircle /> Saved!</span>}
          </div>
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
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setProjects(await getAllProjects());
      } catch (err) {
        console.error('Projects load failed:', err);
        setError('Projects load nahi hue. Firestore rules / connection check karein.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSaved = (id, patch) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, ...patch } : prev));
  };

  const stats = useMemo(() => ({
    count: projects.length,
    revenue: projects.reduce((s, p) => s + (Number(p.paidAmount || p.amount) || 0), 0),
    pending: projects.reduce((s, p) => s + (Number(p.remainingAmount) || 0), 0),
  }), [projects]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) =>
      (p.clientName || '').toLowerCase().includes(q) ||
      (p.clientEmail || '').toLowerCase().includes(q) ||
      (p.projectName || '').toLowerCase().includes(q)
    );
  }, [projects, search]);

  return (
    <div className="min-h-screen bg-dark pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate('/admin/dashboard')} className="text-gray-400 hover:text-white mb-5 flex items-center gap-2 text-sm bg-transparent border-none cursor-pointer">
          <FaArrowLeft size={14} /> Back to Dashboard
        </button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">All Projects</h1>
          <p className="text-gray-400 text-sm mt-1">Sabhi clients ki payment aur project status ek jagah — manage karne ke liye kisi row par click karein.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div className="glass rounded-2xl p-4 sm:p-5 border border-white/5">
            <p className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider">Projects</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-1">{stats.count}</p>
          </div>
          <div className="glass rounded-2xl p-4 sm:p-5 border border-accent/10">
            <p className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider">Received</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-accent mt-1 truncate" title={money(stats.revenue)}>{moneyShort(stats.revenue)}</p>
          </div>
          <div className="glass rounded-2xl p-4 sm:p-5 border border-white/5">
            <p className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider">Bakaya</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-400 mt-1 truncate" title={money(stats.pending)}>{moneyShort(stats.pending)}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, email ya project..."
            className="w-full pl-11 pr-4 py-2.5 bg-dark text-white rounded-xl border border-white/10 focus:border-accent focus:outline-none"
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="glass rounded-2xl p-8 border border-red-500/20 text-center text-red-400">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-2xl p-12 border border-white/5 text-center">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-400">{projects.length === 0 ? 'Abhi tak koi payment/project nahi aaya.' : 'Koi match nahi mila.'}</p>
          </div>
        ) : (
          <div className="glass rounded-2xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[720px]">
                <thead>
                  <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b border-white/10 bg-white/[0.02]">
                    <th className="px-4 py-3 font-semibold">S.No</th>
                    <th className="px-4 py-3 font-semibold">Client Name</th>
                    <th className="px-4 py-3 font-semibold">Project</th>
                    <th className="px-4 py-3 font-semibold text-right">Total</th>
                    <th className="px-4 py-3 font-semibold text-right">Paid</th>
                    <th className="px-4 py-3 font-semibold text-right">Bakaya</th>
                    <th className="px-4 py-3 font-semibold text-center">Type</th>
                    <th className="px-4 py-3 font-semibold text-center">Status</th>
                    <th className="px-4 py-3 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => {
                    const meta = statusMeta(workKey(p));
                    const remaining = Number(p.remainingAmount) || 0;
                    const paidFull = remaining <= 0;
                    return (
                      <tr
                        key={p.id}
                        onClick={() => setSelected(p)}
                        className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                        <td className="px-4 py-3">
                          <p className="text-white font-medium">{p.clientName || 'Unknown'}</p>
                          <p className="text-gray-500 text-xs">{p.clientEmail}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-300">{p.projectName || '—'}</td>
                        <td className="px-4 py-3 text-right text-white">{money(p.totalAmount)}</td>
                        <td className="px-4 py-3 text-right text-accent font-medium">{money(p.paidAmount)}</td>
                        <td className={`px-4 py-3 text-right font-medium ${paidFull ? 'text-green-400' : 'text-yellow-400'}`}>{money(remaining)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-[11px] px-2 py-1 rounded-full ${paidFull ? 'text-green-400 bg-green-500/10' : 'text-yellow-400 bg-yellow-500/10'}`}>
                            {paidFull ? 'Full' : 'Half'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-[11px] px-2.5 py-1 rounded-full border ${meta.color}`}>{meta.label}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelected(p); }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent border border-accent/20 rounded-lg hover:bg-accent/20 transition-all text-xs font-medium"
                          >
                            <FaCog size={12} /> Manage
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selected && <ManageModal project={selected} onClose={() => setSelected(null)} onSaved={handleSaved} />}
    </div>
  );
};

export default ManageProjects;
