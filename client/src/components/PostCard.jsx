import React, { useState } from 'react';

export default function PostCard({ post, onShowDetails, isOwner, onDelete }) {
    const [expanded, setExpanded] = useState(false);
    
    // Determine how to show details
    // If detail is long (> 200 chars), truncate it
    const detail = post.detail || "";
    const isLong = detail.length > 200;
    const displayedDetail = expanded ? detail : (isLong ? detail.substring(0, 200) + "..." : detail);

    const getTimeAgo = (dateString) => {
        if (!dateString) return "Just now";
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        let interval = Math.floor(seconds / 31536000);
        if (interval > 1) return interval + " years ago";
        if (interval === 1) return interval + " year ago";
        
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) return interval + " months ago";
        if (interval === 1) return interval + " month ago";
        
        interval = Math.floor(seconds / 86400);
        if (interval > 1) return interval + " days ago";
        if (interval === 1) return interval + " day ago";
        
        interval = Math.floor(seconds / 3600);
        if (interval > 1) return interval + " hours ago";
        if (interval === 1) return interval + " hour ago";
        
        interval = Math.floor(seconds / 60);
        if (interval > 1) return interval + " minutes ago";
        if (interval === 1) return interval + " minute ago";
        
        return Math.floor(seconds) + " seconds ago";
    };

    const timeAgo = post.time_ago || getTimeAgo(post.time);

    const location = [post.district, post.division].filter(Boolean).join(', ');

    return (
        <article className="group rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-4 sm:px-5 transition-all duration-200 hover:border-slate-600 hover:bg-slate-900">
            {/* Poster row */}
            <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-400">
                        <i className="bx bx-user text-xs" />
                    </div>
                    <span className="text-[11px] text-slate-400">Posted {timeAgo}</span>
                </div>
                {isOwner && onDelete && (
                    <button
                        type="button"
                        className="text-xs text-red-400 hover:text-red-300"
                        onClick={() => onDelete(post._id)}
                    >
                        <i className="fa-solid fa-trash-can" />
                    </button>
                )}
            </div>

            {/* Title */}
            <h3 className="mb-2 text-sm font-semibold text-slate-50 line-clamp-2 sm:text-base">
                {post.title}
            </h3>

            {/* Budget */}
            <div className="mb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {post.budget} BDT
                </span>
            </div>

            {/* Description */}
            <div className="mb-3 text-xs leading-relaxed text-slate-300">
                <p className={!expanded && isLong ? 'line-clamp-3' : ''}>
                    {displayedDetail}
                </p>
                {isLong && (
                    <button
                        type="button"
                        className="mt-1 text-[11px] font-medium text-emerald-400 hover:text-emerald-300"
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? 'See less' : 'Read more'}
                    </button>
                )}
            </div>

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/60 pt-3">
                <div className="flex flex-wrap items-center gap-1.5">
                    {post.category && (
                        <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/60 px-2.5 py-0.5 text-[11px] font-medium text-sky-300">
                            {post.category}
                        </span>
                    )}
                    {location && (
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                            <i className="fa-solid fa-location-dot text-[10px] text-slate-500" />
                            {location}
                        </span>
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
