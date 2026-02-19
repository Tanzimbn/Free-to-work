import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

export default function PostDetailsModal({ post, user, onClose }) {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bidValue, setBidValue] = useState('');
    const [maxBid, setMaxBid] = useState(0);
    const [maxBidUser, setMaxBidUser] = useState('');
    const [maxBidUserName, setMaxBidUserName] = useState('No Bid yet');

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [replyTo, setReplyTo] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await api.post('/post_detail', { id: post._id });
                setDetails(res.data);
                
                // Initialize bid state
                setMaxBid(res.data.max_bid || 0);
                setMaxBidUser(res.data.max_bid_user || '');
                setMaxBidUserName(res.data.max_bid_user_name || 'No Bid yet');

                // Fetch comments
                const commentRes = await api.post('/get_comments', { post_id: post._id });
                setComments(commentRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (post && post._id) fetchDetails();
    }, [post]);

    const handleBidSubmit = async () => {
        if (!bidValue) {
            toast.error("Please enter a bid amount");
            return;
        }

        const newBid = parseInt(bidValue);
        const currentMax = parseInt(maxBid);

        // Logic from bidding.js: if(max_bid == "" || parseInt(new_bid) < parseInt(max_bid))
        // Note: In a freelance marketplace, lower bid is better (reverse auction)
        const isFirstBid = maxBidUserName === 'No Bid yet';
        
        if (!isFirstBid && newBid >= currentMax) {
            toast.error("Your bid must be lower than the current best bid!");
            return;
        }

        try {
            const res = await api.post('/update_bid', {
                id: post._id,
                new_bid: newBid,
                new_user_name: user?.name || 'Unknown'
            });

            if (res.data.user_id === "-1") {
                toast.error("You can't bid in your own post!");
                return;
            }
            if (res.data.user_id === "-2") {
                toast.error("Bidding time ended!");
                return;
            }

            // Update UI on success
            setMaxBid(newBid);
            setMaxBidUser(res.data.user_id);
            setMaxBidUserName(user?.name || 'Unknown');
            setBidValue('');
            toast.success("Bid submitted successfully!");

        } catch (err) {
            console.error(err);
            toast.error("Failed to submit bid. Please try again.");
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const res = await api.post('/add_comment', {
                post_id: post._id,
                text: newComment,
                parent_id: replyTo ? replyTo.id : null
            });
            
            if (res.data.message === "Success") {
                setComments(prev => [res.data.comment, ...prev]);
                setNewComment("");
                setReplyTo(null);
                toast.success("Comment added!");
            } else {
                toast.error("Failed to add comment");
            }
        } catch (error) {
            console.error("Error adding comment:", error);
            toast.error("Error adding comment");
        }
    };

    const buildCommentTree = (comments) => {
        const map = {};
        const roots = [];
        // Deep copy to avoid mutating state directly
        const commentsCopy = comments.map(c => ({...c, children: []}));
        
        commentsCopy.forEach(c => {
            map[c._id] = c;
        });
        
        commentsCopy.forEach(c => {
            if (c.parent_id && map[c.parent_id]) {
                map[c.parent_id].children.push(c);
            } else {
                roots.push(c);
            }
        });
        
        // Sort by date descending for roots
        roots.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        return roots;
    };

    const renderComment = (comment) => (
        <div
            key={comment._id}
            className={`mt-3 ${comment.parent_id ? 'ml-4 sm:ml-6' : ''}`}
        >
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 sm:p-3.5">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-semibold text-slate-100">
                        {comment.user_name}
                    </h3>
                    <span className="text-[10px] text-slate-500">
                        {new Date(comment.created_at).toLocaleString()}
                    </span>
                </div>
                <p className="mt-1 text-xs text-slate-200 leading-relaxed">
                    {comment.text}
                </p>
                <div className="mt-2 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => setReplyTo({ id: comment._id, name: comment.user_name })}
                        className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300"
                    >
                        Reply
                    </button>
                </div>
            </div>
            {comment.children && comment.children.length > 0 && (
                <div className="ml-3 border-l border-slate-800 pl-3">
                    {comment.children
                        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                        .map((child) => renderComment(child))}
                </div>
            )}
        </div>
    );

    if (!post) return null;

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-3 sm:px-4">
            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white text-xs"
                >
                    <i className="fa-solid fa-times" />
                </button>

                {loading ? (
                    <div className="flex h-60 items-center justify-center text-xs text-slate-300">
                        Loading details...
                    </div>
                ) : details ? (
                    <div className="flex flex-col gap-4 px-4 pb-4 pt-5 sm:px-5 sm:pt-6 sm:pb-5 overflow-y-auto max-h-[90vh]">
                        <div className="flex flex-col gap-4 border-b border-slate-800 pb-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300 mb-1">
                                    <span className="h-1 w-1 rounded-full bg-emerald-400" />
                                    <span>Job detail</span>
                                </div>
                                <h2 className="text-base sm:text-lg font-semibold text-slate-50">
                                    {details.title}
                                </h2>
                                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2.5 py-0.5 border border-slate-700">
                                        Est. budget:{' '}
                                        <span className="text-slate-100 font-medium">
                                            {details.budget} BDT
                                        </span>
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                        <span className="h-1 w-1 rounded-full bg-slate-600" />
                                        Posted {post.time_ago || 'recently'}
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                        <i className="fa-solid fa-location-dot text-slate-500" />
                                        <span>
                                            {details.division}, {details.district}
                                        </span>
                                    </span>
                                </div>
                                {details.category && (
                                    <div className="mt-2">
                                        <span className="inline-flex items-center rounded-full bg-slate-950/70 px-2.5 py-0.5 text-[11px] font-medium text-sky-300 border border-slate-700">
                                            {details.category}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="w-full max-w-xs rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
                                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">
                                    Best bid
                                </p>
                                <div className="mt-2 flex items-baseline justify-between">
                                    <span className="text-sm font-semibold text-slate-50">
                                        {maxBidUserName}
                                    </span>
                                    <span className="text-xs font-medium text-emerald-400">
                                        {maxBid} BDT
                                    </span>
                                </div>
                                <div className="mt-3">
                                    <label className="text-[11px] text-slate-400 mb-1 block">
                                        Place your bid
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            placeholder="Enter your bid"
                                            value={bidValue}
                                            onChange={(e) => setBidValue(e.target.value)}
                                            className="flex-1 rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1.5 text-xs text-slate-100 outline-none placeholder:text-slate-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleBidSubmit}
                                            className="inline-flex items-center rounded-full bg-emerald-500 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-emerald-600"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-slate-300 mb-1">Details</p>
                            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                                {details.detail}
                            </p>
                        </div>

                        <div className="mt-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-3 sm:p-4">
                            <p className="text-xs font-semibold text-slate-300 mb-2">Comments</p>

                            {comments.length === 0 ? (
                                <p className="text-[11px] text-slate-500">No comments yet.</p>
                            ) : (
                                <div className="mt-1">
                                    {buildCommentTree(comments).map((comment) => renderComment(comment))}
                                </div>
                            )}

                            <div className="mt-4 border-t border-slate-800 pt-3">
                                {replyTo && (
                                    <div className="mb-2 flex items-center justify-between text-[11px] text-slate-400">
                                        <span>
                                            Replying to <span className="font-semibold">{replyTo.name}</span>
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setReplyTo(null)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                                <form onSubmit={handleCommentSubmit} className="space-y-2">
                                    <textarea
                                        name="message"
                                        placeholder={
                                            replyTo
                                                ? `Replying to ${replyTo.name}...`
                                                : 'Write a comment'
                                        }
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="min-h-[70px] w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none placeholder:text-slate-500"
                                    />
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-medium text-slate-900 hover:bg-white"
                                        >
                                            Comment
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-60 items-center justify-center text-xs text-slate-300">
                        Details not found.
                    </div>
                )}
            </div>
        </div>
    );
}
