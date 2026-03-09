import { useState } from 'react';
import api from '../services/api';

const REASONS = [
  { value: 'misbehavior', label: 'Misbehavior' },
  { value: 'misleadingInfo', label: 'Misleading Information' },
  { value: 'fakeInfo', label: 'Providing Fake Information' },
];

export default function ReportUserModal({ isOpen, onClose, targetUserId }) {
  const [reason, setReason] = useState('');
  const [comments, setComments] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const flash = (msg, type = 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) {
      flash('Please select a reason.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/report', {
        to: targetUserId,
        reportReason: reason,
        additionalComments: comments,
      });
      flash('Report submitted. Thank you.', 'success');
      setTimeout(() => {
        setReason('');
        setComments('');
        setMessage('');
        onClose();
      }, 1500);
    } catch {
      flash('Error submitting report.');
    } finally {
      setSubmitting(false);
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
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-950/60 text-red-400">
              <i className="bx bx-flag text-sm" />
            </div>
            <h2 className="text-sm font-semibold text-slate-50">Report User</h2>
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            Help us keep FreeToWork safe. Reports are reviewed by our team and kept confidential.
          </p>

          {/* Reason */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Reason
            </label>
            <div className="space-y-2">
              {REASONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setReason(value)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-2.5 text-sm text-left transition-colors ${
                    reason === value
                      ? 'border-red-700/60 bg-red-950/40 text-red-300'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                      reason === value ? 'border-red-500' : 'border-slate-600'
                    }`}
                  >
                    {reason === value && (
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                    )}
                  </span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Additional comments */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Additional comments
            </label>
            <textarea
              rows={3}
              placeholder="Provide any additional context..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-red-700"
            />
          </div>

          {message && (
            <p className={`text-[11px] ${messageType === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
              {message}
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
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 rounded-full bg-red-700 px-4 py-2 text-xs font-medium text-white shadow-md shadow-red-900/40 transition-colors hover:bg-red-600 disabled:opacity-60"
            >
              {submitting ? (
                <i className="bx bx-loader-alt animate-spin text-sm" />
              ) : (
                <i className="bx bx-flag text-sm" />
              )}
              Submit report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
