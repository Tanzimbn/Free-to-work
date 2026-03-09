import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NewsfeedPage from './pages/NewsfeedPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import ListPage from './pages/ListPage';
import ErrorPage from './pages/ErrorPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout>
          <ToastContainer />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes — AuthLayout provides the shared navbar */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AuthLayout />}>
                <Route path="/newsfeed" element={<NewsfeedPage />} />
                <Route path="/list" element={<ListPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/:id" element={<ProfilePage />} />
              </Route>
            </Route>

            {/* Admin — has its own sidebar layout, does not use AuthNavbar */}
            <Route element={<ProtectedRoute adminOnly />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>

            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;