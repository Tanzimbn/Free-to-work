import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.get('verified') === 'true') {
            toast.success("Email verified successfully! You can now login.");
            // Remove query param from URL without reload
            window.history.replaceState({}, document.title, "/login");
        }
    }, [location]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const result = await login(email, password);
            if (result.success) {
                if (result.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/newsfeed');
                }
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Login failed. Please try again.");
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/change_password', { email: forgotEmail });
            const data = response.data;
            if (data.state === "1") {
                toast.success(data.message);
                setForgotPasswordOpen(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Request failed.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 px-4">
            <div className={`w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row ${forgotPasswordOpen ? 'ring-2 ring-slate-300' : ''}`}>
                <div className="md:w-5/12 bg-slate-900 text-white flex flex-col justify-center p-8 md:p-10">
                    <div className="mb-6 cursor-pointer" onClick={() => navigate('/')}>
                        <span className="text-2xl font-bold tracking-wide">FreeToWork.</span>
                    </div>
                    <p className="text-2xl md:text-3xl font-semibold mb-2">Welcome!</p>
                    <p className="text-sm md:text-base mb-4">Are you free to work? Join the community and find a job now.</p>
                    <p className="text-sm md:text-base mb-4">If you don't have an account then join with us.</p>
                    <Link
                        to="/register"
                        className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white text-slate-900 text-sm font-medium mt-2 hover:bg-slate-100 transition"
                    >
                        Register now
                    </Link>
                </div>
                <div className="flex-1 flex flex-col justify-center p-6 md:p-10">
                    <form className="w-full" onSubmit={handleLogin}>
                        <p className="text-2xl font-semibold mb-4 text-slate-900">Login</p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 border border-slate-200 rounded-full px-3 py-2 bg-slate-50">
                                <label htmlFor="email" className="text-slate-500">
                                    <i className="bx bx-envelope"></i>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 placeholder:text-slate-400"
                                />
                            </div>
                            <div className="flex items-center gap-2 border border-slate-200 rounded-full px-3 py-2 bg-slate-50">
                                <label htmlFor="password" className="text-slate-500">
                                    <i className="bx bx-lock-alt"></i>
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 placeholder:text-slate-400"
                                />
                                <i
                                    className={`fa-solid ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}
                                    style={{ color: '#FFDAB9', cursor: 'pointer', marginLeft: '10px' }}
                                    onClick={() => setShowPassword(!showPassword)}
                                ></i>
                            </div>
                        </div>
                        <input
                            type="submit"
                            value="Login"
                            className="mt-6 w-full rounded-full bg-slate-900 hover:bg-slate-800 text-white py-2 text-sm font-medium cursor-pointer transition"
                        />
                    </form>
                    <div className="forgot-password-link mt-3 text-right">
                        <a
                            href="#"
                            className="text-xs text-slate-600 hover:text-slate-900"
                            onClick={(e) => { e.preventDefault(); setForgotPasswordOpen(true); }}
                        >
                            Forgot Password?
                        </a>
                    </div>
                </div>
            </div>

            {forgotPasswordOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 relative">
                        <button
                            type="button"
                            className="absolute top-3 right-3 text-slate-500 hover:text-slate-700 text-xl"
                            onClick={() => setForgotPasswordOpen(false)}
                        >
                            &times;
                        </button>
                        <h1 className="text-xl font-semibold mb-4 text-slate-900">Reset Password</h1>
                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="forgot-email" className="text-sm font-medium text-slate-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="forgot-email"
                                    required
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full rounded-full bg-slate-900 hover:bg-slate-800 text-white py-2 text-sm font-medium transition"
                            >
                                Send Reset Link
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
