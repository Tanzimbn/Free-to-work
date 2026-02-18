import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import './AdminPage.css';

export default function AdminPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totaluser: 0,
        totalpost: 0,
        lastpost: 0,
        avgbid: 0
    });
    const [feedbacks, setFeedbacks] = useState([]);
    const [reports, setReports] = useState([]);
    const [activeModal, setActiveModal] = useState(null); // 'feedback', 'report', 'category'
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const response = await api.get('/admin');
            const data = response.data;
            if (data.error === "Forbidden") {
                navigate('/login');
                return;
            }
            setStats({
                totaluser: data.totaluser,
                totalpost: data.totalpost,
                lastpost: data.lastpost,
                avgbid: data.avgbid
            });
            setFeedbacks(data.feedback || []);
            setReports(data.report || []);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching admin data:", error);
            if (error.response && error.response.status === 403) {
                toast.error("Access Denied. Admins only.");
                navigate('/login');
            } else {
                setLoading(false);
            }
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.post('/allcategory', {});
            setCategories(response.data.map(cat => cat.value));
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleLogout = async () => {
        try {
            await api.get('/logout');
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleAcceptReport = async (userId, reportId) => {
        try {
            await api.post('/block_user', { id: userId, reportid: reportId });
            setReports(prev => prev.filter(r => r._id !== reportId));
            toast.success("User blocked and report resolved.");
        } catch (error) {
            console.error("Error accepting report:", error);
            toast.error("Error blocking user.");
        }
    };

    const handleRejectReport = async (reportId) => {
        try {
            await api.post('/report_process', { reportid: reportId });
            setReports(prev => prev.filter(r => r._id !== reportId));
            toast.info("Report rejected.");
        } catch (error) {
            console.error("Error rejecting report:", error);
            toast.error("Error rejecting report.");
        }
    };

    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;
        try {
            const response = await api.post('/category', { value: newCategory });
            if (response.data.message === "Success") {
                setCategories(prev => [...prev, newCategory]);
                setNewCategory('');
                toast.success("Category added successfully.");
            } else {
                toast.error("Category already exists or error occurred.");
            }
        } catch (error) {
            console.error("Error adding category:", error);
            toast.error("Error adding category.");
        }
    };

    const openCategoryModal = () => {
        setActiveModal('category');
        fetchCategories();
    };

    if (loading) return <div className="loading">Loading Admin Dashboard...</div>;

    return (
        <div className="admin-page">
            <nav className="nav_admin">
                <p className="logo" onClick={() => navigate('/')}>FreeToWork.</p>
                <button className="logout" onClick={handleLogout}>Logout</button>
            </nav>

            <div className="dashboard">
                <div className="d_contents">
                    <p>Total Posts</p>
                    <p className="pno">{stats.totalpost}</p>
                </div>
                <div className="d_contents">
                    <p>Total posts in last 24 hours</p>
                    <p className="pno">{stats.lastpost}</p>
                </div>
                <div className="d_contents">
                    <p>Total No of Users</p>
                    <p className="pno">{stats.totaluser}</p>
                </div>
                <div className="d_contents">
                    <p>Average Bid</p>
                    <p className="pno">{stats.avgbid} BDT</p>
                </div>
                <div className="d_contents" onClick={() => setActiveModal('feedback')}>
                    <p>Feedbacks</p>
                    <p id="click_view">click to view</p>
                </div>
                <div className="d_contents" onClick={() => setActiveModal('report')}>
                    <p>User Reports</p>
                    <p id="click_view">click to view</p>
                </div>
                <div className="d_contents" onClick={openCategoryModal}>
                    <p>Add category</p>
                    <p id="click_view">click to view</p>
                </div>
            </div>

            {/* Modals */}
            {activeModal === 'feedback' && (
                <div className="modal-overlay" onClick={() => setActiveModal(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <span className="modal-close" onClick={() => setActiveModal(null)}>&times;</span>
                        <h1>User Feedbacks</h1>
                        <div className="reviews">
                            {feedbacks.length === 0 ? <p>No feedbacks yet.</p> : feedbacks.map(fb => (
                                <div className="review" key={fb._id}>
                                    <div className="user-info">
                                        <span className="user-email">{fb.email}</span>
                                    </div>
                                    <div className="user-comment">
                                        <p>{fb.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeModal === 'report' && (
                <div className="modal-overlay" onClick={() => setActiveModal(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <span className="modal-close" onClick={() => setActiveModal(null)}>&times;</span>
                        <h1>User Reports</h1>
                        <div className="adminreport">
                            <div className="report-container">
                                {reports.length === 0 ? <p>No reports pending.</p> : reports.map(report => (
                                    <div className="report-item" key={report._id}>
                                        <div className="report-details">
                                            <span className="reported-user"><b>Reported User :</b> {report.to}</span>
                                            <span className="reporter-user"><b>Reported By :</b> {report.reporter_id}</span>
                                            <span className="short-reason"><b>Short Reason :</b> {report.reason}</span>
                                        </div>
                                        <div className="elaborate-reason">
                                            <h3>Elaborate Reason:</h3>
                                            <p>{report.comments}</p>
                                        </div>
                                        <div className="accpt_rej">
                                            <button type="button" onClick={() => handleAcceptReport(report.to, report._id)}>Accept (Block User)</button>
                                            <button type="button" onClick={() => handleRejectReport(report._id)}>Reject</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeModal === 'category' && (
                <div className="modal-overlay" onClick={() => setActiveModal(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <span className="modal-close" onClick={() => setActiveModal(null)}>&times;</span>
                        <h1>Add Category</h1>
                        <div className="add_category_box">
                            <input 
                                type="text" 
                                placeholder="Search or Add Category" 
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                            />
                            <button onClick={handleAddCategory}>Add</button>
                        </div>
                        <div className="category-suggest">
                            <h3>Existing Categories:</h3>
                            <ul className="category-list">
                                {categories.filter(c => c.toLowerCase().includes(newCategory.toLowerCase())).map((cat, idx) => (
                                    <li key={idx}>{cat}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
