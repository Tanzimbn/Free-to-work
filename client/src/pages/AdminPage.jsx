import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icons = {
  Users:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Posts:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5"><rect x="3" y="3" width="18" height="18" rx="2"/><path strokeLinecap="round" d="M7 8h10M7 12h6M7 16h8"/></svg>,
  Clock:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5"><circle cx="12" cy="12" r="9"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3"/></svg>,
  Bid:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Message: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Flag:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
  Tag:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none"/></svg>,
  Logout:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
  Close:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Check:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4"><polyline points="20 6 9 17 4 12"/></svg>,
  Plus:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Home:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Shield:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Menu:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Info:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-10 w-10"><circle cx="12" cy="12" r="9"/><path strokeLinecap="round" d="M12 8v4M12 16h.01"/></svg>,
  Chevron: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 text-slate-600"><polyline points="9 18 15 12 9 6"/></svg>,
};

// ── Animated counter hook ─────────────────────────────────────────────────────
function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

// ── Primitive chart components ────────────────────────────────────────────────
function DonutChart({ value, total, color, size = 100, stroke = 12 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = total > 0 ? Math.min(value / total, 1) * circ : 0;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e293b" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1s ease' }} />
    </svg>
  );
}

function HBar({ label, value, max, color }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="font-semibold text-slate-200">{value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function RingProgress({ pct, color, size = 56, stroke = 5 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e293b" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1.2s ease' }} />
    </svg>
  );
}

// ── Reusable UI ───────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, ringPct, ringColor, Icon }) {
  const displayed = useCountUp(value);
  return (
    <div className="relative flex items-center justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">{label}</p>
        <p className="mt-1.5 text-3xl font-bold text-slate-50 tabular-nums">{displayed.toLocaleString()}{sub}</p>
      </div>
      <div className="relative flex items-center justify-center">
        <RingProgress pct={ringPct} color={ringColor} size={56} stroke={5} />
        <div className="absolute" style={{ color: ringColor }}><Icon /></div>
      </div>
    </div>
  );
}

function NavItem({ label, active, onClick, Icon, badge }) {
  return (
    <button onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
        active ? 'bg-violet-500/15 text-violet-300' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
      }`}>
      <Icon />
      <span className="flex-1 text-left">{label}</span>
      {badge > 0 && <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-semibold text-red-400">{badge}</span>}
    </button>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 py-16 text-slate-600">
      <Icons.Info />
      <p className="mt-3 text-sm">{message}</p>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-6 p-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-28 rounded-2xl bg-slate-800/60" />)}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => <div key={i} className="h-56 rounded-2xl bg-slate-800/60" />)}
      </div>
    </div>
  );
}

// ── Section components (defined OUTSIDE AdminPage to keep stable identity) ────

function Overview({ stats, reports, feedbacks, goTo }) {
  const activity24hPct = stats.totalpost > 0 ? Math.round((stats.lastpost / stats.totalpost) * 100) : 0;
  const total = stats.totalpost + stats.totaluser + reports.length + feedbacks.length;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-100">Overview</h2>
        <p className="mt-0.5 text-sm text-slate-500">Platform health at a glance</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Users" value={stats.totaluser}
          ringPct={total > 0 ? (stats.totaluser / total) * 100 : 40}
          ringColor="#a78bfa" Icon={Icons.Users} />
        <StatCard label="Total Posts" value={stats.totalpost}
          ringPct={total > 0 ? (stats.totalpost / total) * 100 : 60}
          ringColor="#38bdf8" Icon={Icons.Posts} />
        <StatCard label="Last 24 h" value={stats.lastpost}
          ringPct={activity24hPct} ringColor="#34d399" Icon={Icons.Clock} />
        <StatCard label="Avg Bid" value={stats.avgbid} sub=" ৳"
          ringPct={Math.min((stats.avgbid / 5000) * 100, 100)}
          ringColor="#fbbf24" Icon={Icons.Bid} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="mb-4 text-sm font-semibold text-slate-300">Platform Breakdown</p>
          <div className="flex items-center gap-6">
            <DonutChart value={stats.lastpost} total={stats.totalpost} color="#34d399" size={110} stroke={13} />
            <div className="flex-1 space-y-3">
              <HBar label="Users"     value={stats.totaluser} max={Math.max(stats.totaluser, stats.totalpost, 1)} color="#a78bfa" />
              <HBar label="Posts"     value={stats.totalpost} max={Math.max(stats.totaluser, stats.totalpost, 1)} color="#38bdf8" />
              <HBar label="Last 24 h" value={stats.lastpost}  max={Math.max(stats.totaluser, stats.totalpost, 1)} color="#34d399" />
              <HBar label="Avg Bid ৳" value={stats.avgbid}    max={Math.max(stats.avgbid * 2, 1000)}             color="#fbbf24" />
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-slate-600">
            {activity24hPct}% of all posts were created in the last 24 hours
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <p className="mb-4 text-sm font-semibold text-slate-300">Moderation Queue</p>
          <div className="flex items-center justify-around">
            <div className="flex flex-col items-center gap-2">
              <DonutChart value={reports.length} total={Math.max(reports.length + feedbacks.length, 1)} color="#f87171" size={90} stroke={11} />
              <p className="text-xs text-slate-500">Reports</p>
              <p className="text-2xl font-bold text-red-400">{reports.length}</p>
            </div>
            <div className="h-20 w-px bg-slate-800" />
            <div className="flex flex-col items-center gap-2">
              <DonutChart value={feedbacks.length} total={Math.max(reports.length + feedbacks.length, 1)} color="#38bdf8" size={90} stroke={11} />
              <p className="text-xs text-slate-500">Feedbacks</p>
              <p className="text-2xl font-bold text-sky-400">{feedbacks.length}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button onClick={() => goTo('reports')}
              className="rounded-xl border border-red-500/20 bg-red-500/10 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/20">
              Review Reports →
            </button>
            <button onClick={() => goTo('feedbacks')}
              className="rounded-xl border border-sky-500/20 bg-sky-500/10 py-2 text-xs font-medium text-sky-400 transition hover:bg-sky-500/20">
              Read Feedbacks →
            </button>
          </div>
        </div>
      </div>

      <button onClick={() => goTo('categories')}
        className="flex w-full items-center justify-between rounded-2xl border border-violet-500/20 bg-violet-500/8 px-5 py-4 transition hover:bg-violet-500/15">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400">
            <Icons.Tag />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-200">Manage Categories</p>
            <p className="text-xs text-slate-500">Add or browse job categories</p>
          </div>
        </div>
        <Icons.Chevron />
      </button>
    </div>
  );
}

function Feedbacks({ feedbacks }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-100">User Feedbacks</h2>
        <p className="mt-0.5 text-sm text-slate-500">{feedbacks.length} message{feedbacks.length !== 1 ? 's' : ''}</p>
      </div>
      {feedbacks.length === 0 ? <EmptyState message="No feedbacks yet." /> : (
        <div className="space-y-3">
          {feedbacks.map(fb => (
            <div key={fb._id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-xs font-bold text-sky-300">
                  {fb.email?.[0]?.toUpperCase() ?? '?'}
                </div>
                <span className="text-sm font-medium text-slate-300">{fb.email}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{fb.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Reports({ reports, onAccept, onReject }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-100">User Reports</h2>
        <p className="mt-0.5 text-sm text-slate-500">{reports.length} pending</p>
      </div>
      {reports.length === 0 ? <EmptyState message="No pending reports." /> : (
        <div className="space-y-4">
          {reports.map(r => (
            <div key={r._id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <div className="mb-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-slate-600">Reported</span>
                  <p className="mt-0.5 font-semibold text-red-400">{r.to}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-slate-600">Reporter</span>
                  <p className="mt-0.5 font-medium text-slate-300">{r.reporter_id}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-slate-600">Reason</span>
                  <p className="mt-0.5 font-medium text-amber-400">{r.reason}</p>
                </div>
              </div>
              {r.comments && (
                <div className="mb-4 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                  <p className="mb-1 text-[10px] uppercase tracking-widest text-slate-600">Details</p>
                  <p className="text-sm leading-relaxed text-slate-400">{r.comments}</p>
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={() => onAccept(r.to, r._id)}
                  className="flex items-center gap-1.5 rounded-lg bg-red-500/15 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/25">
                  <Icons.Check /> Block user
                </button>
                <button onClick={() => onReject(r._id)}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-800/60 px-4 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-700/60">
                  <Icons.Close /> Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Categories({ categories, newCategory, setNewCategory, catFilter, setCatFilter, onAdd }) {
  const filtered = categories.filter(c => c.toLowerCase().includes(catFilter.toLowerCase()));
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-100">Categories</h2>
        <p className="mt-0.5 text-sm text-slate-500">{categories.length} total</p>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="New category name..."
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onAdd()}
          className="flex-1 rounded-xl border border-slate-700/60 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30"
        />
        <button onClick={onAdd}
          className="flex items-center gap-1.5 rounded-xl bg-violet-500/20 px-4 py-2.5 text-sm font-medium text-violet-300 transition hover:bg-violet-500/30">
          <Icons.Plus /> Add
        </button>
      </div>
      <input
        type="text"
        placeholder="Filter categories..."
        value={catFilter}
        onChange={e => setCatFilter(e.target.value)}
        className="w-full rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 outline-none focus:border-violet-500/40"
      />
      {categories.length === 0 ? <EmptyState message="No categories yet." /> : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((cat, i) => (
            <div key={i} className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2.5 text-sm text-slate-300">
              <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-violet-400" />
              <span className="truncate">{cat}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Sidebar({ nav, activeSection, goTo, navigate, handleLogout }) {
  return (
    <div className="flex h-full flex-col gap-1 px-3 py-6">
      <div className="mb-5 flex cursor-pointer items-center gap-2 px-3" onClick={() => navigate('/')}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20 text-violet-400">
          <Icons.Shield />
        </div>
        <span className="text-base font-bold text-slate-100">
          FreeToWork<span className="text-violet-400">.</span>
        </span>
      </div>
      <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">Dashboard</p>
      {nav.map(({ id, label, Icon, badge }) => (
        <NavItem key={id} label={label} active={activeSection === id} onClick={() => goTo(id)} Icon={Icon} badge={badge ?? 0} />
      ))}
      <div className="mt-auto space-y-1 border-t border-slate-800/60 pt-4">
        <NavItem label="Go to site" active={false} onClick={() => navigate('/')} Icon={Icons.Home} badge={0} />
        <NavItem label="Logout"     active={false} onClick={handleLogout}        Icon={Icons.Logout} badge={0} />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AdminPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState({ totaluser: 0, totalpost: 0, lastpost: 0, avgbid: 0 });
  const [feedbacks, setFeedbacks] = useState([]);
  const [reports, setReports]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [catFilter, setCatFilter]     = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const { data } = await api.get('/admin');
      if (data.error === 'Forbidden') { navigate('/login'); return; }
      setStats({ totaluser: data.totaluser, totalpost: data.totalpost, lastpost: data.lastpost, avgbid: data.avgbid });
      setFeedbacks(data.feedback || []);
      setReports(data.report || []);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 403) { toast.error('Access denied.'); navigate('/login'); }
      else setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.post('/allcategory', {});
      setCategories(data.map(c => c.value));
    } catch { /**/ }
  };

  const handleLogout = async () => { await api.get('/logout').catch(() => {}); navigate('/login'); };

  const handleAcceptReport = async (userId, reportId) => {
    try {
      await api.post('/block_user', { id: userId, reportid: reportId });
      setReports(p => p.filter(r => r._id !== reportId));
      toast.success('User blocked.');
    } catch { toast.error('Error blocking user.'); }
  };

  const handleRejectReport = async (reportId) => {
    try {
      await api.post('/report_process', { reportid: reportId });
      setReports(p => p.filter(r => r._id !== reportId));
      toast.info('Report dismissed.');
    } catch { toast.error('Error dismissing report.'); }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const { data } = await api.post('/category', { value: newCategory });
      if (data.message === 'Success') { setCategories(p => [...p, newCategory]); setNewCategory(''); toast.success('Category added.'); }
      else toast.error('Category already exists.');
    } catch { toast.error('Error adding category.'); }
  };

  const goTo = (section) => {
    setActiveSection(section);
    if (section === 'categories') fetchCategories();
    setSidebarOpen(false);
  };

  const nav = [
    { id: 'overview',   label: 'Overview',   Icon: Icons.Shield  },
    { id: 'feedbacks',  label: 'Feedbacks',  Icon: Icons.Message, badge: feedbacks.length },
    { id: 'reports',    label: 'Reports',    Icon: Icons.Flag,    badge: reports.length   },
    { id: 'categories', label: 'Categories', Icon: Icons.Tag     },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview stats={stats} reports={reports} feedbacks={feedbacks} goTo={goTo} />;
      case 'feedbacks':
        return <Feedbacks feedbacks={feedbacks} />;
      case 'reports':
        return <Reports reports={reports} onAccept={handleAcceptReport} onReject={handleRejectReport} />;
      case 'categories':
        return (
          <Categories
            categories={categories}
            newCategory={newCategory} setNewCategory={setNewCategory}
            catFilter={catFilter}    setCatFilter={setCatFilter}
            onAdd={handleAddCategory}
          />
        );
      default:
        return <Overview stats={stats} reports={reports} feedbacks={feedbacks} goTo={goTo} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-50">
      {/* Desktop sidebar */}
      <div className="hidden w-56 flex-shrink-0 border-r border-slate-800/60 lg:block">
        <Sidebar nav={nav} activeSection={activeSection} goTo={goTo} navigate={navigate} handleLogout={handleLogout} />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-56 border-r border-slate-800/60 bg-slate-950">
            <Sidebar nav={nav} activeSection={activeSection} goTo={goTo} navigate={navigate} handleLogout={handleLogout} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center gap-3 border-b border-slate-800/60 bg-slate-950/80 px-4 py-3 backdrop-blur-sm lg:px-6">
          <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Icons.Menu />
          </button>
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <span>Admin</span><span>/</span>
            <span className="capitalize text-slate-300">{activeSection}</span>
          </div>
          <div className="ml-auto">
            {reports.length > 0 && (
              <button onClick={() => goTo('reports')}
                className="flex items-center gap-1.5 rounded-lg bg-red-500/15 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/25">
                <Icons.Flag /> {reports.length} pending
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-8">
          {loading ? <Skeleton /> : renderSection()}
        </main>
      </div>
    </div>
  );
}
