import React, { useState } from 'react';
import api from '../services/api';

const ReportUserModal = ({ isOpen, onClose, targetUserId }) => {
    const [reason, setReason] = useState('');
    const [comments, setComments] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reason) {
            setMessage("Select a reason!");
            setTimeout(() => setMessage(''), 1000);
            return;
        }

        try {
            // The backend redirects after report submission.
            // Axios will follow the redirect and return the HTML of the profile page.
            // We can just assume success if no error is thrown.
            await api.post('/report', {
                to: targetUserId,
                reportReason: reason,
                additionalComments: comments
            });

            setMessage("Report Submitted!");
            setTimeout(() => {
                setMessage('');
                setReason('');
                setComments('');
                onClose();
            }, 1000);
        } catch (err) {
            console.error("Error submitting report:", err);
            setMessage("Error submitting report.");
            setTimeout(() => setMessage(''), 1000);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="rep_container" style={{ visibility: 'visible', opacity: 1 }}>
            <h1>Report User</h1>
            <span className="close" onClick={onClose}>&times;</span>
            <form id="reportForm" onSubmit={handleSubmit}>
                <select 
                    name="to" 
                    id="to" 
                    value={targetUserId} 
                    disabled
                    style={{ display: 'none' }}
                >
                    <option value={targetUserId}>{targetUserId}</option>
                </select>

                <label htmlFor="reportReason">Reason for Report:</label>
                <select 
                    id="reportReason" 
                    name="reportReason" 
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                >
                    <option value="" disabled>Select a reason</option>
                    <option value="misbehavior">Misbehavior</option>
                    <option value="misleadingInfo">Misleading Information</option>
                    <option value="fakeInfo">Providing Fake Information</option>
                </select>

                <label htmlFor="additionalComments">Additional Comments:</label>
                <textarea 
                    id="additionalComments" 
                    name="additionalComments" 
                    rows="4" 
                    required
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                ></textarea>

                <button type="submit">Submit Report</button>
                <div style={{ textAlign: 'center', marginTop: '10px', color: 'green' }}>{message}</div>
            </form>
        </div>
    );
};

export default ReportUserModal;
