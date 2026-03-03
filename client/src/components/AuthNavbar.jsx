import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AuthNavbar({ onPostClick }) {
    const { user, logout, notifications, hasUnseenNotifications, updateUser } = useAuth();
    const [menuActive, setMenuActive] = useState(false);
    const [notiActive, setNotiActive] = useState(false);
    const [userImage, setUserImage] = useState('');
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const menuRef = useRef(null);
    const notiRef = useRef(null);

    useEffect(() => {
        if (user && user.img && user.img.data) {
            try {
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
                setUserImage('');
            }
        } else {
            setUserImage('');
        }
    }, [user]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuActive(false);
            if (notiRef.current && !notiRef.current.contains(e.target)) setNotiActive(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleMoodToggle = async () => {
        if (!user) return;
        const newMood = !user.mood;
        try {
            await api.post('/update_mood', { check: newMood });
            updateUser({ ...user, mood: newMood });
            toast.info(newMood ? "You're now available for work." : "Job alerts paused.");
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

    const navLinkClass = (path) =>
        `inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors ${
            pathname.startsWith(path)
                ? 'bg-slate-800 text-slate-50'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
        }`;

    return (
        <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/95 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">

                {/* Left: Logo + Nav */}
                <div className="flex items-center gap-4">
                    <Link to="/newsfeed" className="flex flex-shrink-0 items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d11f0c] text-[11px] font-bold text-white shadow-sm shadow-[#d11f0c]/40">
                            FT
                        </div>
                        <span className="hidden text-sm font-semibold text-slate-50 sm:block">
                            FreeToWork
                        </span>
                    </Link>

                    <div className="hidden h-5 w-px bg-slate-800 sm:block" />

                    <nav className="hidden items-center gap-1 sm:flex">
                        <Link to="/newsfeed" className={navLinkClass('/newsfeed')}>
                            <i className="bx bxs-home-alt-2 text-xs" />
                            Newsfeed
                        </Link>
                        <Link to="/list" className={navLinkClass('/list')}>
                            <i className="bx bx-list-ul text-xs" />
                            Browse list
                        </Link>
                    </nav>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">

                    {/* Post a job */}
                    <button
                        type="button"
                        onClick={handlePostClick}
                        className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600 sm:px-4"
                    >
                        <i className="bx bx-plus text-sm" />
                        <span className="hidden sm:inline">Post a job</span>
                    </button>

                    {/* Bell */}
                    <div className="relative" ref={notiRef}>
                        <button
                            type="button"
                            onClick={() => { setNotiActive(p => !p); setMenuActive(false); }}
                            className="relative flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-400 transition-colors hover:border-slate-600 hover:text-slate-200"
                        >
                            <i className="bx bx-bell text-sm" />
                            {hasUnseenNotifications && (
                                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
                            )}
                        </button>

                        {/* Notification panel */}
                        <div className={`absolute right-0 top-full mt-2 w-72 rounded-2xl border border-slate-800 bg-slate-950 shadow-xl transition-all duration-150 ${
                            notiActive ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
                        }`}>
                            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                                    Notifications
                                </p>
                                {hasUnseenNotifications && (
                                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                                        New
                                    </span>
                                )}
                            </div>
                            <div className="max-h-72 overflow-y-auto p-2">
                                {notifications && notifications.length > 0 ? (
                                    notifications.map((noti, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            className={`w-full rounded-xl px-3 py-2.5 text-left text-[11px] transition-colors hover:bg-slate-800/80 ${
                                                noti.unseen ? 'border border-emerald-500/30 bg-emerald-500/10' : 'border border-transparent'
                                            }`}
                                            onClick={() => handleNotificationClick(noti)}
                                        >
                                            <div className="flex items-start gap-2">
                                                {noti.unseen && (
                                                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                                                )}
                                                <p className="leading-relaxed text-slate-200">{noti.type}</p>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center gap-2 py-8">
                                        <i className="bx bx-bell-off text-2xl text-slate-600" />
                                        <p className="text-[11px] text-slate-500">No notifications yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* User menu */}
                    <div className="relative" ref={menuRef}>
                        <button
                            type="button"
                            onClick={() => { setMenuActive(p => !p); setNotiActive(false); }}
                            className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 py-1 pl-1 pr-2.5 transition-colors hover:border-slate-600"
                        >
                            <img
                                src={userImage || '/pictures/user.png'}
                                alt="User"
                                className="h-6 w-6 rounded-full object-cover ring-1 ring-slate-600 sm:h-7 sm:w-7"
                            />
                            <div className="hidden min-w-0 sm:flex sm:flex-col">
                                <span className="max-w-[80px] truncate text-[11px] font-medium text-slate-50">
                                    {user ? user.fname : 'User'}
                                </span>
                                <span className="max-w-[80px] truncate text-[10px] text-slate-500">
                                    {user ? (user.category || 'Member') : ''}
                                </span>
                            </div>
                            <i className={`bx bx-chevron-down hidden text-sm text-slate-500 transition-transform duration-200 sm:block ${menuActive ? 'rotate-180' : ''}`} />
                        </button>

                        {/* User dropdown */}
                        <div className={`absolute right-0 top-full mt-2 w-60 rounded-2xl border border-slate-800 bg-slate-950 shadow-xl transition-all duration-150 ${
                            menuActive ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
                        }`}>
                            {/* Profile header */}
                            <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-3">
                                <img
                                    src={userImage || '/pictures/user.png'}
                                    alt="User"
                                    className="h-9 w-9 flex-shrink-0 rounded-full object-cover ring-2 ring-slate-700"
                                />
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-slate-50">
                                        {user ? `${user.fname} ${user.lname}` : 'User'}
                                    </p>
                                    <p className="truncate text-[11px] text-slate-400">
                                        {user ? (user.category || 'Member') : ''}
                                    </p>
                                </div>
                            </div>

                            {/* Availability toggle */}
                            {user && (
                                <div className="border-b border-slate-800 px-4 py-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-[11px] font-medium text-slate-200">Availability</p>
                                            <p className="text-[10px] text-slate-500">
                                                {user.mood ? 'Receiving job alerts' : 'Alerts paused'}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleMoodToggle}
                                            className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-200 ${
                                                user.mood ? 'bg-emerald-500' : 'bg-slate-700'
                                            }`}
                                        >
                                            <span className={`mx-0.5 inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                                                user.mood ? 'translate-x-4' : 'translate-x-0'
                                            }`} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Menu items */}
                            <div className="p-1.5">
                                <button
                                    type="button"
                                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs text-slate-300 transition-colors hover:bg-slate-800 hover:text-slate-100"
                                    onClick={() => { navigate('/profile'); setMenuActive(false); }}
                                >
                                    <i className="bx bx-user text-sm text-slate-400" />
                                    My profile
                                </button>
                                <button
                                    type="button"
                                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                                    onClick={handleLogout}
                                >
                                    <i className="bx bx-log-out text-sm" />
                                    Log out
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </header>
    );
}
