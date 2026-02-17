import React, { useState } from 'react';
import './PostCard.css';

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
        <div className="post-content">
            <div className="heading">
                <p onClick={() => onShowDetails(post)} style={{cursor: 'pointer'}}>{post.title}</p>
                {isOwner && onDelete && (
                    <p>
                        <i 
                            className="fa-solid fa-trash-can" 
                            style={{color: '#db0f0f', cursor: 'pointer'}}
                            onClick={() => onDelete(post._id)}
                        ></i>
                    </p>
                )}
            </div>
            <div className="budget">
                <p>Est. budget: {post.budget} BDT</p>
                <p>.</p>
                <p>Posted: {timeAgo}</p> 
            </div>
            <div className="details">
                <p>
                    {displayedDetail}
                    {isLong && (
                        <button 
                            className="see-btn" 
                            onClick={() => setExpanded(!expanded)}
                        >
                            {expanded ? "see less" : "more"}
                        </button>
                    )}
                </p>
            </div>
            <div className="post_tag">
                <ul>
                    <li>{post.category}</li>
                </ul>
            </div>
            <div className="location">
                <i className="fa-solid fa-location-dot"></i>
                <p>{post.division}</p>
            </div>
        </div>
    );
}
