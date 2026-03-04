export default function ProfilePostCard({ post, onShowDetails, isOwner, onDelete }) {
  const location = [post.district, post.division].filter(Boolean).join(', ');
  const timeLabel = post.time_ago || (post.time ? new Date(post.time).toLocaleDateString() : '');

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-4 transition-colors hover:border-slate-700">
      {/* Title + delete */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold leading-snug text-slate-100">
          {post.title}
        </h3>
        {isOwner && (
          <button
            type="button"
            onClick={() => onDelete(post._id)}
            className="flex-shrink-0 rounded-full p-1 text-slate-500 transition-colors hover:bg-red-950/40 hover:text-red-400"
            title="Delete post"
          >
            <i className="bx bx-trash text-sm" />
          </button>
        )}
      </div>

      {/* Budget */}
      <div className="mb-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {post.budget} BDT
        </span>
      </div>

      {/* Description */}
      {post.detail && (
        <p className="mb-3 text-xs leading-relaxed text-slate-400 line-clamp-2">
          {post.detail}
        </p>
      )}

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/60 pt-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {post.category && (
            <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/60 px-2.5 py-0.5 text-[11px] font-medium text-sky-300">
              {post.category}
            </span>
          )}
          {location && (
            <span className="flex items-center gap-1 text-[11px] text-slate-500">
              <i className="bx bx-map-pin text-[10px]" />
              {location}
            </span>
          )}
          {timeLabel && (
            <span className="text-[11px] text-slate-600">{timeLabel}</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => onShowDetails(post)}
          className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800 px-3 py-1.5 text-[11px] font-semibold text-slate-100 transition-colors hover:border-slate-600 hover:bg-slate-700"
        >
          View Details
          <i className="bx bx-chevron-right text-sm leading-none" />
        </button>
      </div>
    </article>
  );
}
