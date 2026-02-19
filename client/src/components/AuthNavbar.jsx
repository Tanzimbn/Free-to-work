import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AuthNavbar({ onPostClick }) {
    const { user, logout, notifications, hasUnseenNotifications, updateUser, refreshNotifications } = useAuth();
    const [menuActive, setMenuActive] = useState(false);
    const [notiActive, setNotiActive] = useState(false);
    const navigate = useNavigate();
    const [userImage, setUserImage] = useState('');

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

    return (
        <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/95 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:py-3.5">
                <div className="flex items-center gap-2 sm:gap-3">
                    <Link to="/newsfeed" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d11f0c] text-[11px] font-semibold text-white shadow-sm shadow-[#d11f0c]/40 sm:h-9 sm:w-9">
                            FT
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-50 sm:text-sm">
                                FreeToWork
                            </span>
                            <span className="hidden text-[10px] text-slate-500 sm:block">
                                Live opportunities
                            </span>
                        </div>
                    </Link>

                    <nav className="hidden items-center gap-4 text-[11px] font-medium text-slate-300 sm:flex">
                        <Link to="/newsfeed" className="inline-flex items-center gap-1 hover:text-slate-50">
                            <i className="bx bxs-home-alt-2 text-xs" />
                            <span>Newsfeed</span>
                        </Link>
                        <Link to="/list" className="inline-flex items-center gap-1 hover:text-slate-50">
                            <i className="bx bx-list-ul text-xs" />
                            <span>Browse list</span>
                        </Link>
                        <button
                            type="button"
                            onClick={toggleNoti}
                            className="relative inline-flex items-center gap-1 hover:text-slate-50"
                        >
                            <i className="fa-solid fa-bell text-xs" />
                            {hasUnseenNotifications && (
                                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-emerald-400" />
                            )}
                            <span>Alerts</span>
                        </button>
                    </nav>
                </div>

                <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
                    <button
                        type="button"
                        onClick={handlePostClick}
                        className="inline-flex items-center rounded-full bg-emerald-500 px-3 py-1.5 text-[11px] font-medium text-white shadow-sm hover:bg-emerald-600 sm:px-4 sm:text-xs"
                    >
                        <span className="hidden sm:inline">Post a job</span>
                        <span className="sm:hidden">Post</span>
                    </button>

                    <button
                        type="button"
                        className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-1.5 py-1 pl-1.5 pr-2 text-left sm:px-2"
                        onClick={toggleMenu}
                    >
                        <img
                            src={userImage || '/pictures/user.png'}
                            alt="User"
                            className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-600 sm:h-8 sm:w-8"
                        />
                        <div className="hidden sm:flex flex-col">
                            <span className="text-[11px] font-medium text-slate-50">
                                {user ? user.fname : 'User'}
                            </span>
                            <span className="text-[10px] text-slate-500">
                                {user ? user.category : ''}
                            </span>
                        </div>
                        <i className="bx bx-chevron-down hidden text-slate-500 sm:block" />
                    </button>
                </div>
            </div>

            <div
                className={`absolute right-4 top-full mt-3 w-72 rounded-2xl border border-slate-800 bg-slate-950/95 text-xs text-slate-100 shadow-xl backdrop-blur transition-all ${
                    notiActive ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
                }`}
            >
                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Notifications
                    </p>
                    <button
                        type="button"
                        onClick={toggleNoti}
                        className="text-[10px] text-slate-500 hover:text-slate-200"
                    >
                        Close
                    </button>
                </div>
                <div className="max-h-64 overflow-y-auto px-3 py-2">
                    {notifications && notifications.length > 0 ? (
                        notifications.map((noti, index) => (
                            <button
                                key={index}
                                type="button"
                                className={`mt-1 w-full rounded-xl px-3 py-2 text-left text-[11px] ${
                                    noti.unseen ? 'bg-emerald-500/10 border border-emerald-500/40' : 'bg-slate-900/80 border border-slate-800'
                                }`}
                                onClick={() => handleNotificationClick(noti)}
                            >
                                <p className="text-slate-100">{noti.type}</p>
                            </button>
                        ))
                    ) : (
                        <p className="py-4 text-center text-[11px] text-slate-500">
                            No notifications
                        </p>
                    )}
                </div>
            </div>

            <div
                className={`absolute right-4 top-full mt-3 w-64 rounded-2xl border border-slate-800 bg-slate-950/95 text-xs text-slate-100 shadow-xl backdrop-blur transition-all ${
                    menuActive ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
                }`}
            >
                <div className="flex flex-col items-center px-4 pt-4 pb-3">
                    <img
                        src={userImage || '/pictures/user.png'}
                        alt="User"
                        className="mb-2 h-12 w-12 rounded-full object-cover ring-2 ring-slate-700"
                    />
                    <div className="text-center">
                        <p className="text-sm font-semibold text-slate-50">
                            {user ? `${user.fname} ${user.lname}` : 'User'}
                        </p>
                        <p className="text-[11px] text-slate-400">
                            {user ? user.category : ''}
                        </p>
                    </div>
                    {user && (
                        <button
                            type="button"
                            onClick={handleMoodToggle}
                            className="mt-3 inline-flex h-7 w-20 items-center rounded-full bg-slate-900 px-1 text-[10px] text-slate-200"
                        >
                            <span
                                className={`inline-flex h-5 w-9 items-center justify-center rounded-full text-[10px] font-medium transition-all ${
                                    user.mood ? 'translate-x-0 bg-emerald-500 text-white' : 'translate-x-9 bg-slate-700 text-slate-100'
                                }`}
                            >
                                {user.mood ? 'Free' : 'Busy'}
                            </span>
                        </button>
                    )}
                </div>
                <div className="border-t border-slate-800">
                    <button
                        type="button"
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left hover:bg-slate-900"
                        onClick={() => {
                            navigate('/profile');
                            setMenuActive(false);
                        }}
                    >
                        <img src="/pictures/user1.png" alt="Profile" className="h-4 w-4 opacity-70" />
                        <span>My profile</span>
                    </button>
                    <button
                        type="button"
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left hover:bg-slate-900"
                        onClick={handleLogout}
                    >
                        <img src="/pictures/logout.png" alt="Logout" className="h-4 w-4 opacity-70" />
                        <span>Log out</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
