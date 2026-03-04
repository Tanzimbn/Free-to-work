import { useState, useEffect } from 'react';
import api from '../services/api';

export default function EditProfileModal({ isOpen, onClose, user, onUpdate }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [bio, setBio] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setBio(user.bio || '');
      setCategory(user.category || '');
    }
    fetchCategories();
  }, [user, isOpen]);

  const fetchCategories = async () => {
    try {
      const res = await api.post('/allcategory');
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const flash = (msg, type = 'error') => {
    setStatus(msg);
    setStatusType(type);
    setTimeout(() => setStatus(''), 2000);
  };

  const handleSave = async () => {
    if (!oldPassword && newPassword) {
      flash('Enter your current password to set a new one.');
      return;
    }
    setSaving(true);
    try {
      if (oldPassword) {
        const userRes = await api.post('/user_data', { id: user._id });
        if (userRes.data?.length > 0 && oldPassword !== userRes.data[0].password) {
          flash('Current password is incorrect.');
          setSaving(false);
          return;
        }
      }

      const formData = new FormData();
      formData.append('id', user._id);
      formData.append('password', newPassword || user.password);
      formData.append('bio', bio);
      formData.append('category', category);

      await api.post('/edit_user_info', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      flash('Profile updated!', 'success');
      setOldPassword('');
      setNewPassword('');
      onUpdate();
      setTimeout(onClose, 1000);
    } catch {
      flash('Error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl shadow-black/60">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-slate-300">
              <i className="bx bx-edit text-sm" />
            </div>
            <h2 className="text-sm font-semibold text-slate-50">Edit Profile</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
          >
            <i className="bx bx-x text-lg" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 p-5">
          {/* Bio */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Bio
            </label>
            <textarea
              rows={3}
              placeholder="Tell people about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-600"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Category
            </label>
            <div className="relative">
              <i className="bx bx-briefcase absolute left-3 top-1/2 -translate-y-1/2 text-base text-slate-500" />
              <input
                type="text"
                list="category_list"
                autoComplete="off"
                placeholder="e.g. Plumber, Electrician..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-600"
              />
              <datalist id="category_list">
                {categories.map((cat, i) => (
                  <option key={i} value={cat.value} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-800/60" />

          {/* Change password */}
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Change password
            </p>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">Current password</label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5">
                <i className="bx bx-lock-alt flex-shrink-0 text-base text-slate-500" />
                <input
                  type={showOld ? 'text' : 'password'}
                  placeholder="Enter current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowOld((p) => !p)}
                  className="flex-shrink-0 text-[11px] font-medium text-slate-500 hover:text-slate-300"
                >
                  {showOld ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400">New password</label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5">
                <i className="bx bx-lock-open-alt flex-shrink-0 text-base text-slate-500" />
                <input
                  type={showNew ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((p) => !p)}
                  className="flex-shrink-0 text-[11px] font-medium text-slate-500 hover:text-slate-300"
                >
                  {showNew ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          </div>

          {status && (
            <p className={`text-[11px] ${statusType === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
              {status}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#d11f0c] px-4 py-2 text-xs font-medium text-white shadow-md shadow-[#d11f0c]/30 transition-colors hover:bg-[#b91a09] disabled:opacity-60"
            >
              {saving ? (
                <i className="bx bx-loader-alt animate-spin text-sm" />
              ) : (
                <i className="bx bx-check text-sm" />
              )}
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
