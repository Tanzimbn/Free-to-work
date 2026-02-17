import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './PostDetailsModal.css';

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
            alert("Please enter a bid amount");
            return;
        }

        const newBid = parseInt(bidValue);
        const currentMax = parseInt(maxBid);

        // Logic from bidding.js: if(max_bid == "" || parseInt(new_bid) < parseInt(max_bid))
        // Note: In a freelance marketplace, lower bid is better (reverse auction)
        const isFirstBid = maxBidUserName === 'No Bid yet';
        
        if (!isFirstBid && newBid >= currentMax) {
            alert("Your bid must be lower than the current best bid!");
            return;
        }

        try {
            const res = await api.post('/update_bid', {
                id: post._id,
                new_bid: newBid,
                new_user_name: user?.name || 'Unknown'
            });

            if (res.data.user_id === "-1") {
                alert("You can't bid in your own post!");
                return;
            }
            if (res.data.user_id === "-2") {
                alert("Bidding time ended!");
                return;
            }

            // Update UI on success
            setMaxBid(newBid);
            setMaxBidUser(res.data.user_id);
            setMaxBidUserName(user?.name || 'Unknown');
            setBidValue('');
            alert("Bid submitted successfully!");

        } catch (err) {
            console.error(err);
            alert("Failed to submit bid. Please try again.");
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
            } else {
                alert("Failed to add comment");
            }
        } catch (error) {
            console.error("Error adding comment:", error);
            alert("Error adding comment");
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
        <div key={comment._id} className="comment_container" style={{ marginLeft: comment.parent_id ? '20px' : '0', marginTop: '10px' }}>
            <div className="comment_card" style={{ borderLeft: '4px solid #1a1d86', paddingLeft: '10px', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '5px' }}>
                <h3 className="comment_title" style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#333' }}>{comment.user_name}</h3>
                <p style={{ margin: '0 0 10px 0', fontSize: '13px' }}>{comment.text}</p>
                <div className="comment_footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="reply" onClick={() => setReplyTo({ id: comment._id, name: comment.user_name })} style={{ cursor: 'pointer', color: '#1a1d86', fontWeight: 'bold', fontSize: '12px' }}>reply</div>
                    <div className="show_reply" style={{fontSize: '11px', color: '#888'}}>
                        {new Date(comment.created_at).toLocaleString()}
                    </div>
                </div>
            </div>
            {comment.children && comment.children.length > 0 && (
                 <div style={{ marginLeft: '10px' }}>
                    {comment.children.sort((a,b) => new Date(a.created_at) - new Date(b.created_at)).map(child => renderComment(child))}
                 </div>
            )}
        </div>
    );

    if (!post) return null;

    return (
        <div className="details_overlay">
            <div className="details_content">
                <span className="close-btn" onClick={onClose}>
                    <i className="fa-solid fa-times"></i>
                </span>
                
                {loading ? (
                    <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading details...</p>
                ) : details ? (
                    <div className="details_body">
                        <div className="details_body_left">
                            <div className="details_body_left_head">
                                <div className="basic_info">
                                    <div className="title">
                                        <span>{details.title}</span>
                                    </div>
                                    <div className="budget_time">
                                        <p>Est. budget: {details.budget} BDT</p>
                                        <p>Posted {post.time_ago || 'recently'}</p>
                                    </div>
                                    <div className="tag">
                                        <ul>
                                            <li>{details.category}</li>
                                        </ul>
                                    </div>
                                    <div className="details_location">
                                        <i className="fa-solid fa-location-dot"></i>
                                        <p>{details.division}, {details.district}</p>
                                    </div>
                                </div>
                                
                                <div className="best_bid">
                                    <div className="best_bid_box">
                                        <p className="best_bidder_name">{maxBidUserName}</p>
                                        <p><span>{maxBid}</span> BDT</p>
                                    </div>
                                    <div className="bid_label">
                                        <p>BEST BID</p>
                                    </div>
                                </div>
                                
                                <div className="sumbit_bid">
                                    <div className="submit_bid_box">
                                        <input 
                                            type="number" 
                                            placeholder="Enter your bid" 
                                            value={bidValue}
                                            onChange={(e) => setBidValue(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <button className="submit_btn" onClick={handleBidSubmit}>SUBMIT</button>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="details_body_left_body">
                                <p id="details">Details:</p>
                                <span className="post_detail_detail">
                                    {details.detail}
                                </span>
                            </div>
                            
                            <div className="comment">
                                <p id="comment">Comments:</p>
                                <div className="comment_container opened">
                                    {comments.length === 0 ? (
                                        <p style={{padding: '10px', color: '#666'}}>No comments yet.</p>
                                    ) : (
                                        buildCommentTree(comments).map(comment => renderComment(comment))
                                    )}
                                    
                                    <div className="comment_box" style={{ marginTop: '20px' }}>
                                        {replyTo && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '12px', color: '#666' }}>
                                                <span>Replying to <b>{replyTo.name}</b></span>
                                                <span onClick={() => setReplyTo(null)} style={{ cursor: 'pointer', color: 'red' }}>Cancel</span>
                                            </div>
                                        )}
                                        <form onSubmit={handleCommentSubmit}>
                                            <textarea 
                                                name="message" 
                                                placeholder={replyTo ? `Replying to ${replyTo.name}...` : "Write comment"}
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                            ></textarea>
                                            <input type="submit" value="Comment" />
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>Details not found.</p>
                )}
            </div>
        </div>
    );
}
