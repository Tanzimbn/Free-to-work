import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

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
        <div className="login-wrapper">
            <div className={`container ${forgotPasswordOpen ? 'review-active' : ''}`}>
                <div className="login-link">
                    <div className="logo" onClick={() => navigate('/')}>
                        <span className="text">FreeToWork.</span>
                    </div>
                    <p className="side-big-heading">Welcome!</p>
                    <p className="primary-bg-text">Are you free to work? Join the community and find a job now.</p>
                    <br />
                    <p className="primary-reg-text">If you don't have an account then join with us.</p>
                    <Link to="/register" className="loginbtn">Register now</Link>
                </div>
                <form className="login-form-container" onSubmit={handleLogin}>
                    <p className="login-big-heading">Login</p>
                    <div className="login-form-contents">
                        <div className="text-fields login_email">
                            <label htmlFor="email"><i className='bx bx-envelope'></i></label>
                            <input 
                                type="email" 
                                name="email" 
                                id="email" 
                                placeholder="Enter your email id" 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="text-fields login_password">
                            <label htmlFor="password"><i className='bx bx-lock-alt'></i></label>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name="password" 
                                id="password" 
                                placeholder="Enter password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <i 
                                className={`fa-solid ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`} 
                                style={{ color: '#FFDAB9', cursor: 'pointer', marginLeft: '10px' }} 
                                onClick={() => setShowPassword(!showPassword)}
                            ></i>
                        </div>
                    </div>
                    <input type="submit" value="Login" className="nextPage" />
                </form>
                
                <div className="forgot-password-link">
                    <a href="#" onClick={(e) => { e.preventDefault(); setForgotPasswordOpen(true); }}>Forgot Password?</a>
                </div>
            </div>

            <div className={`popup-review ${forgotPasswordOpen ? 'popup-active' : ''}`}>
                <div className="overlay" onClick={() => setForgotPasswordOpen(false)}></div>
                <div className="content">
                    <div className="close-btn" onClick={() => setForgotPasswordOpen(false)}>&times;</div>
                    <h1>Reset Password</h1>
                    <form onSubmit={handleForgotPassword}>
                        <div className="text-fields">
                            <label htmlFor="forgot-email">Email</label>
                            <input 
                                type="email" 
                                id="forgot-email" 
                                required 
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                            />
                        </div>
                        <button type="submit">Send Reset Link</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
