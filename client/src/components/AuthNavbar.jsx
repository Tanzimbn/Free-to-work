import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthNavbar.css';

export default function AuthNavbar({ onPostClick, onSearch }) {
    const { user, logout, notifications, hasUnseenNotifications, updateUser, refreshNotifications } = useAuth();
    const [menuActive, setMenuActive] = useState(false);
    const [notiActive, setNotiActive] = useState(false);
    const navigate = useNavigate();
    const [userImage, setUserImage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (user && user.img && user.img.data) {
            try {
                // Check if user.img.data is buffer (array of bytes)
                // If backend sends it as buffer object { type: 'Buffer', data: [...] }
                const bufferData = user.img.data.data || user.img.data;
                const base64String = btoa(
                    new Uint8Array(bufferData).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        ''
                    )
                );
                setUserImage(`data:${user.img.contentType};base64,${base64String}`);
            } catch (e) {
                console.error("Error processing image", e);
                setUserImage("");
            }
        } else {
            setUserImage("");
        }
    }, [user]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const toggleMenu = () => {
        setMenuActive(!menuActive);
        if (notiActive) setNotiActive(false);
    };

    const toggleNoti = () => {
        setNotiActive(!notiActive);
        if (menuActive) setMenuActive(false);
    };

    const handleMoodToggle = async () => {
        if (!user) return;
        const newMood = !user.mood;
        try {
            await api.post('/update_mood', { check: newMood });
            updateUser({ ...user, mood: newMood });
            alert(newMood ? "Free mood is on!" : "Work mood on! You won't get any notification of new post.");
        } catch (error) {
            console.error("Failed to update mood", error);
        }
    };

    const handleNotificationClick = (notification) => {
        // Mark as seen locally? HBS uses notiseen(this) which just removes 'unseen' class
        // Navigate to post
        // We can navigate to newsfeed and pass the post ID to open details
        navigate('/newsfeed', { state: { openPostId: notification.postid } });
        setNotiActive(false);
    };

    const handlePostClick = () => {
        if (onPostClick) {
            onPostClick();
        } else {
            navigate('/newsfeed', { state: { openPostModal: true } });
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    return (
        <nav className="navbar-auth">
            <div className="nav_left">
                <Link to="/newsfeed" className="logo" style={{ color: '#ffffff', textDecoration: 'none' }}>Free to<br />work.</Link>
                <ul>
                    <li><Link to="/newsfeed"><i className='bx bxs-home'></i></Link></li>
                    <li><Link to="/list"><i className='bx bx-list-ul'></i></Link></li>
                    <li onClick={toggleNoti}>
                        <i className={`fa-solid fa-bell ${hasUnseenNotifications ? 'taken' : ''}`}></i>
                    </li>
                </ul>
                <div className={`noti ${notiActive ? 'active' : ''}`}>
                    <h3>Notifications</h3>
                    <hr />
                    {notifications && notifications.length > 0 ? (
                        notifications.map((noti, index) => (
                            <div 
                                key={index} 
                                className={`noti_message ${noti.unseen ? 'unseen' : ''}`}
                                onClick={() => handleNotificationClick(noti)}
                            >
                                {noti.type}
                            </div>
                        ))
                    ) : (
                        <div className="noti_message">No notifications</div>
                    )}
                </div>
            </div>
            <div className="nav_right">
                <div className="serach_box">
                    <img src="/pictures/search-alt-regular-24.png" alt="search" />
                    <input 
                        type="text" 
                        placeholder="Search" 
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="create_post" onClick={handlePostClick}>
                    <p>Post</p>
                </div>
                
                <div className="user_icon" onClick={toggleMenu}>
                    <img src={userImage || "/pictures/user.png"} alt="User" className="nav_profile_img" />
                </div>
                
                <div className={`menu ${menuActive ? 'active' : ''}`}>
                    <div className="menu_user_icon">
                        <img src={userImage || "/pictures/user.png"} alt="User" />
                    </div>
                    <h3>{user ? `${user.fname} ${user.lname}` : 'User'}<br /><span>{user ? user.category : ''}</span></h3>
                    
                    {user && (
                        <div className="mood">
                            <input 
                                type="checkbox" 
                                id="mood_toggle" 
                                checked={user.mood || false} 
                                onChange={handleMoodToggle}
                                style={{ display: 'none' }} 
                            />
                            <label 
                                htmlFor="mood_toggle" 
                                className="mood_toggle" 
                                style={{ backgroundColor: user.mood ? '#33cc33' : 'rgba(223, 64, 64, 0.242)' }}
                            ></label>
                        </div>
                    )}

                    <ul>
                        <li>
                            <img src="/pictures/user1.png" alt="Profile" />
                            <Link to={`/profile`}>My profile</Link>
                        </li>
                        <li>
                            <img src="/pictures/logout.png" alt="Logout" />
                            <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Log out</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
