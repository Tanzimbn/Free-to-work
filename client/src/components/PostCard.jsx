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

    return (
        <article className="group rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-4 sm:px-5 sm:py-4 shadow-sm hover:border-slate-600 hover:bg-slate-900 transition-colors">
            <div className="flex items-start justify-between gap-3">
                <button
                    type="button"
                    onClick={() => onShowDetails(post)}
                    className="text-left"
                >
                    <h3 className="text-sm sm:text-base font-semibold text-slate-50 group-hover:text-white line-clamp-2">
                        {post.title}
                    </h3>
                </button>
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

            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-slate-400">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-950/60 px-2.5 py-0.5 border border-slate-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Est. budget: <span className="text-slate-100 font-medium">{post.budget} BDT</span>
                </span>
                <span className="inline-flex items-center gap-1 text-slate-500">
                    <span className="h-1 w-1 rounded-full bg-slate-600" />
                    Posted {timeAgo}
                </span>
            </div>

            <div className="mt-3 text-xs text-slate-200 leading-relaxed">
                <p className={isLong ? 'line-clamp-3 sm:line-clamp-4' : ''}>
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

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    {post.category && (
                        <span className="inline-flex items-center rounded-full bg-slate-950/60 px-2.5 py-0.5 text-[11px] font-medium text-sky-300 border border-slate-700">
                            {post.category}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <i className="fa-solid fa-location-dot text-slate-500" />
                    <span>{post.division}</span>
                </div>
            </div>
        </article>
    );
}
