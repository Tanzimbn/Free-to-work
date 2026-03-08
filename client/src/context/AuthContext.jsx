import React, { createContext, useContext, useState, useEffect } from 'react';
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
            try {
                const res = await api.get('/login');
                if (res.data.loggedIn) {
                    if (res.data.role === 'admin') {
                        setIsAdmin(true);
                        setUser({ email: 'admin@free2work.com', role: 'admin' });
                    } else {
                        await fetchUserData();
                    }
                } else {
                    setUser(null);
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                setUser(null);
            } finally {
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

    const logout = async () => {
        await api.get('/logout');
        setUser(null);
        setIsAdmin(false);
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
        loading,
        notifications,
        hasUnseenNotifications,
        login,
        logout,
        updateUser,
        fetchNotifications,
        refreshNotifications,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}