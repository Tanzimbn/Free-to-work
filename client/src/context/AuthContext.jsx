import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

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

    const fetchUserData = async () => {
        try {
            const userRes = await api.get('/newsfeed');
            if (userRes.data.user && userRes.data.user.length > 0) {
                setUser(userRes.data.user[0]);
                setNotifications(userRes.data.noti || []);
                setHasUnseenNotifications(userRes.data.unseen || false);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get('/login'); // check_login
                if (res.data.loggedIn) {
                    if (res.data.role === 'admin') {
                        setIsAdmin(true);
                        setUser({ email: 'admin@free2work.com', role: 'admin' });
                    } else {
                        // Fetch user details
                        await fetchUserData();
                    }
                } else {
                    setUser(null);
                    setIsAdmin(false);
                    setNotifications([]);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/login', { email, password });
        if (res.data.message === "admin") {
            setIsAdmin(true);
            setUser({ email: 'admin@free2work.com', role: 'admin' });
            return { success: true, role: 'admin' };
        } else if (res.data.message === "correct") {
            setUser(res.data.userdata);
            setIsAdmin(false);
            // Fetch initial notifications after login
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
    };
    
    const updateUser = (userData) => {
        setUser(userData);
    };

    const refreshNotifications = async () => {
        await fetchUserData();
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
        refreshNotifications
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
