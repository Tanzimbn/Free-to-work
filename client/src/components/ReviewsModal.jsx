import { useState } from 'react';
import api from '../services/api';

export default function ReviewsModal({ isOpen, onClose, reviews, targetUserId, currentUser, onUpdate }) {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isOwnProfile = currentUser && currentUser._id === targetUserId;

  const flash = (msg, type = 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 2000);
  };

  const handleSubmit = async () => {
    if (!rating) {
      flash('Please select a star rating.');
      return;
    }
    setSubmitting(true);
    try {
      const reviewerName = currentUser ? `${currentUser.fname} ${currentUser.lname}` : 'Anonymous';
      const res = await api.post('/review', {
        id: targetUserId,
        reviewer: reviewerName,
        text,
        rating: String(rating),
      });
      if (res.data.message === 'Review Added!') {
        flash('Review submitted!', 'success');
        setText('');
        setRating(0);
        onUpdate();
        setTimeout(onClose, 1200);
      } else {
        flash(res.data.message);
      }
    } catch {
      flash('Error submitting review.');
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
      <div className="flex w-full max-w-lg flex-col rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl shadow-black/60">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div className="flex items-center gap-2">
            <i className="bx bxs-star text-amber-400" />
            <h2 className="text-sm font-semibold text-slate-50">Reviews</h2>
            {reviews?.length > 0 && (
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-400">
                {reviews.length}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
          >
            <i className="bx bx-x text-lg" />
          </button>
        </div>

        <div className="flex flex-col gap-5 overflow-y-auto p-5" style={{ maxHeight: '75vh' }}>
          {/* Write a review — hidden for own profile */}
          {!isOwnProfile && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
                Write a review
              </p>

              <textarea
                rows={3}
                placeholder="Share your experience..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full resize-none rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-600"
              />

              {/* Star rating */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="text-xl transition-transform hover:scale-110"
                    >
                      <i
                        className={
                          (hoverRating || rating) >= star
                            ? 'bx bxs-star text-amber-400'
                            : 'bx bx-star text-slate-600'
                        }
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 text-[11px] text-slate-400">{rating} / 5</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#d11f0c] px-4 py-1.5 text-xs font-medium text-white shadow-md shadow-[#d11f0c]/30 transition-colors hover:bg-[#b91a09] disabled:opacity-60"
                >
                  {submitting ? (
                    <i className="bx bx-loader-alt animate-spin text-sm" />
                  ) : (
                    <i className="bx bx-send text-sm" />
                  )}
                  Submit
                </button>
              </div>

              {message && (
                <p className={`mt-2 text-[11px] ${messageType === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {message}
                </p>
              )}
            </div>
          )}

          {/* Reviews list */}
          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
              All reviews
            </p>
            {reviews && reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.map((review, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-100">{review.reviewer}</p>
                      <div className="flex flex-shrink-0 items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i
                            key={star}
                            className={`text-xs ${
                              Number(review.rating) >= star
                                ? 'bx bxs-star text-amber-400'
                                : 'bx bx-star text-slate-600'
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-[11px] text-slate-400">{review.rating}/5</span>
                      </div>
                    </div>
                    {review.text && (
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{review.text}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-center text-sm text-slate-500">
                No reviews yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
