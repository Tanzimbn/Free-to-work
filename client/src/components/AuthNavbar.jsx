import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

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
            toast.info(newMood ? "Free mood is on!" : "Work mood on! You won't get any notification of new post.");
        } catch (error) {
            console.error("Failed to update mood", error);
        }
    };

    const handleNotificationClick = (notification) => {
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
        <nav className="relative sticky top-0 z-40 bg-gradient-to-r from-slate-900 via-sky-900 to-sky-500 text-white shadow">
            <div className="flex items-center justify-between max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 gap-4 py-3">
                <div className="flex items-center gap-4">
                    <Link
                        to="/newsfeed"
                        className="text-white no-underline text-lg sm:text-xl leading-tight font-semibold tracking-tight"
                    >
                        Free to<br />work.
                    </Link>
                    <ul className="hidden sm:flex items-center gap-4 text-xl">
                        <li><Link to="/newsfeed"><i className="bx bxs-home"></i></Link></li>
                        <li><Link to="/list"><i className="bx bx-list-ul"></i></Link></li>
                        <li onClick={toggleNoti}>
                            <i className={`fa-solid fa-bell ${hasUnseenNotifications ? 'text-red-400' : ''}`} />
                        </li>
                    </ul>
                </div>

                <div className="flex items-center gap-3 flex-1 justify-end">
                    <div className="flex-1 max-w-xs hidden sm:flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 border border-white/20">
                        <img src="/pictures/search-alt-regular-24.png" alt="search" className="w-4 h-4 opacity-80" />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-200 text-white"
                        />
                    </div>

                    <div
                        className="hidden sm:flex items-center justify-center px-4 py-1 rounded-full bg-white text-slate-900 text-sm cursor-pointer shadow hover:bg-slate-100 transition"
                        onClick={handlePostClick}
                    >
                        <p>Post</p>
                    </div>

                    <div className="flex items-center cursor-pointer" onClick={toggleMenu}>
                        <img
                            src={userImage || "/pictures/user.png"}
                            alt="User"
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-white/40"
                        />
                    </div>
                </div>
            </div>

            <div
                className={`absolute right-4 top-full mt-3 w-72 bg-white text-slate-900 rounded-xl shadow-lg border border-slate-100 text-sm transform transition-all origin-top-right ${
                    notiActive ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
                }`}
            >
                <h3 className="text-base font-semibold text-slate-800 text-center mb-2">Notifications</h3>
                <hr className="border-slate-100 mb-1" />
                {notifications && notifications.length > 0 ? (
                    notifications.map((noti, index) => (
                        <div
                            key={index}
                            className={`mt-2 rounded-md px-3 py-2 cursor-pointer text-xs ${
                                noti.unseen ? 'bg-emerald-100' : 'bg-orange-50'
                            }`}
                            onClick={() => handleNotificationClick(noti)}
                        >
                            {noti.type}
                        </div>
                    ))
                ) : (
                    <div className="mt-2 rounded-md px-3 py-2 text-xs text-slate-500 text-center">
                        No notifications
                    </div>
                )}
            </div>

            <div
                className={`absolute right-4 top-full mt-3 w-56 bg-white text-slate-900 rounded-xl shadow-lg border border-slate-100 text-sm transform transition-all origin-top-right ${
                    menuActive ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
                }`}
            >
                <div className="flex flex-col items-center mb-2 pt-3">
                    <img
                        src={userImage || "/pictures/user.png"}
                        alt="User"
                        className="w-14 h-14 rounded-full object-cover mb-1"
                    />
                </div>
                <h3 className="w-full text-center text-base font-semibold text-slate-800 mb-1">
                    {user ? `${user.fname} ${user.lname}` : 'User'}
                    <br />
                    <span className="text-xs font-normal text-slate-400">{user ? user.category : ''}</span>
                </h3>

                {user && (
                    <div className="flex justify-center pb-3">
                        <button
                            type="button"
                            onClick={handleMoodToggle}
                            className="relative inline-flex w-16 h-8 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200"
                            style={{ backgroundColor: user.mood ? '#33cc33' : 'rgba(223, 64, 64, 0.242)' }}
                        >
                            <span
                                className="absolute top-0.5 left-0.5 w-7 h-7 rounded-full bg-white shadow transition-transform duration-200"
                                style={{ transform: user.mood ? 'translateX(1.9rem)' : 'translateX(0)' }}
                            />
                        </button>
                    </div>
                )}

                <ul className="divide-y divide-slate-100">
                    <li className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-slate-50">
                        <img src="/pictures/user1.png" alt="Profile" className="w-5 h-5 opacity-70" />
                        <Link to="/profile" className="text-sm text-slate-700">
                            My profile
                        </Link>
                    </li>
                    <li className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-slate-50">
                        <img src="/pictures/logout.png" alt="Logout" className="w-5 h-5 opacity-70" />
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="text-sm text-slate-700"
                        >
                            Log out
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
