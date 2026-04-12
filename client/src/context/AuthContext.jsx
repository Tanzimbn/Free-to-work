import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../services/api';

/**
 * AuthContext provides authentication state and methods to manage user sessions.
 * It includes user data, notifications, admin status, and loading state.
 */

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [hasUnseenNotifications, setHasUnseenNotifications] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isDemo, setIsDemo] = useState(false);
    const [backendWaking, setBackendWaking] = useState(false);
    const [wakeSeconds, setWakeSeconds] = useState(0);
    const wakeTimerRef = useRef(null);
    const wakeCounterRef = useRef(null);

    // Fetches minimal identity data — user doc + unseen boolean.
    // No posts, no full notification list.
    const fetchUserData = async () => {
        try {
            const res = await api.get('/newsfeed');
            if (res.data.user) {
                setUser(res.data.user);
                setHasUnseenNotifications(res.data.hasUnseenNotifications || false);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    // Lazy — called only when the notification panel is opened.
    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data.notifications || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            // After 5s with no response, assume Render cold start — show waking screen
            wakeTimerRef.current = setTimeout(() => {
                setBackendWaking(true);
                setWakeSeconds(0);
                wakeCounterRef.current = setInterval(() => {
                    setWakeSeconds((s) => s + 1);
                }, 1000);
            }, 5000);

            try {
                const res = await api.get('/login');
                if (res.data.loggedIn) {
                    if (res.data.role === 'admin') {
                        setIsAdmin(true);
                        setUser({ email: 'admin@free2work.com', role: 'admin' });
                    } else {
                        setIsDemo(res.data.isDemo || false);
                        await fetchUserData();
                    }
                } else {
                    setUser(null);
                    setIsAdmin(false);
                    setIsDemo(false);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                setUser(null);
            } finally {
                clearTimeout(wakeTimerRef.current);
                clearInterval(wakeCounterRef.current);
                setBackendWaking(false);
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/login', { email, password });
        if (res.data.message === 'admin') {
            setIsAdmin(true);
            setUser({ email: 'admin@free2work.com', role: 'admin' });
            return { success: true, role: 'admin' };
        } else if (res.data.message === 'correct') {
            setIsAdmin(false);
            await fetchUserData();
            return { success: true, role: 'user' };
        } else {
            return { success: false, message: res.data.message };
        }
    };

    const demoLogin = async () => {
        const res = await api.post('/demo-login');
        if (res.data.message === 'correct') {
            setIsDemo(true);
            await fetchUserData();
            return { success: true };
        }
        return { success: false, message: res.data.error };
    };

    const logout = async () => {
        await api.get('/logout');
        setUser(null);
        setIsAdmin(false);
        setIsDemo(false);
        setNotifications([]);
        setHasUnseenNotifications(false);
    };

    const updateUser = (userData) => {
        setUser(userData);
    };

    // Re-checks the unseen boolean and refreshes the list if the panel is open.
    const refreshNotifications = async () => {
        await fetchUserData();
        await fetchNotifications();
    };

    const value = {
        user,
        isAdmin,
        isDemo,
        loading,
        notifications,
        hasUnseenNotifications,
        login,
        demoLogin,
        logout,
        updateUser,
        fetchNotifications,
        refreshNotifications,
    };

    if (loading && backendWaking) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center">
                <div className="pointer-events-none fixed inset-0 -z-10">
                    <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/10 blur-3xl" />
                </div>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#d11f0c] text-lg font-bold text-white shadow-lg shadow-[#d11f0c]/30">
                    FT
                </div>
                <div className="mb-4 flex items-center gap-2">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-sky-400 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-sky-400 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-sky-400" />
                </div>
                <p className="text-base font-semibold text-slate-100">Backend is waking up…</p>
                <p className="mt-2 max-w-xs text-sm text-slate-400">
                    The server starts fresh after inactivity. This usually takes under a minute.
                </p>
                <p className="mt-4 text-xs text-slate-500">
                    Waiting {wakeSeconds}s — please hang tight
                </p>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}