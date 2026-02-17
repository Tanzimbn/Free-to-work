import React, { useState } from 'react';
import api from '../services/api';

const ReviewsModal = ({ isOpen, onClose, reviews, targetUserId, currentUser, onUpdate }) => {
    const [text, setText] = useState('');
    const [rating, setRating] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async () => {
        if (!rating) {
            setMessage("Give rating!");
            setTimeout(() => setMessage(''), 1000);
            return;
        }
        
        try {
            // The backend expects 'reviewer' in the body.
            // In the original code, it took the name from the navbar: document.querySelector('#nav_user_name').innerHTML
            // We should use the currentUser's name.
            const reviewerName = currentUser ? `${currentUser.fname} ${currentUser.lname}` : "Anonymous";

            const res = await api.post('/review', {
                id: targetUserId,
                reviewer: reviewerName,
                text: text,
                rating: rating
            });

            setMessage(res.data.message);
            
            if (res.data.message === "Review Added!") {
                setText('');
                setRating('');
                onUpdate(); // Refresh profile to get new reviews and updated rating
                setTimeout(() => {
                    setMessage('');
                    onClose();
                }, 1000);
            } else {
                setTimeout(() => setMessage(''), 1000);
            }
        } catch (err) {
            console.error("Error submitting review:", err);
            setMessage("Error submitting review.");
            setTimeout(() => setMessage(''), 1000);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="rev_container" style={{ visibility: 'visible', opacity: 1 }}>
            <h1>User Reviews</h1>
            <div className="close-button" onClick={onClose}>&#10005;</div>
            
            <div className="post_review">
                <h4>Give your review</h4>
                <textarea 
                    name="review" 
                    id="review_text" 
                    placeholder="Enter review here"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                ></textarea>
                <div className="box_2">
                    <select 
                        name="give_rating" 
                        id="give_rating"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                    >
                        <option value="" disabled>Give rating</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                    <div id="review_status" style={{ color: 'rgb(255, 0, 102)' }}>{message}</div>
                    <button type="button" onClick={handleSubmit}>Submit!</button>
                </div>
            </div>
            
            <div className="reviews">
                {reviews && reviews.map((review, index) => (
                    <div className="review" key={index}>
                        <div className="user-info">
                            <span className="user-name">{review.reviewer}</span>
                            <span className="user-rating">{review.rating}/5</span>
                        </div>
                        <div className="user-comment">
                            <p>{review.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewsModal;
