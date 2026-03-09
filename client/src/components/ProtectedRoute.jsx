import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * A protected route component that restricts access to authenticated users.
 * If the user is not authenticated, they will be redirected to the login page.
 * If the adminOnly prop is set to true, only admin users will have access.
 * Otherwise, all authenticated users will have access.
 */

export default function ProtectedRoute({ adminOnly = false }) {
    const { user, isAdmin, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to="/newsfeed" />;
    }

    return <Outlet />;
}