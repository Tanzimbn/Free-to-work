import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
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
      toast.success('Email verified successfully! You can now login.');
      window.history.replaceState({}, document.title, '/login');
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
      toast.error('Login failed. Please try again.');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/change_password', { email: forgotEmail });
      const data = response.data;
      if (data.state === '1') {
        toast.success(data.message);
        setForgotPasswordOpen(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Request failed.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-[#d11f0c]/25 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-sky-500/30 blur-3xl" />
      </div>
      <div className="relative grid w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/80 shadow-2xl shadow-black/60 md:grid-cols-[1.1fr_minmax(0,1fr)]">
        <div className="relative flex flex-col justify-between border-b border-slate-800/80 px-6 py-6 md:border-b-0 md:border-r md:px-8 md:py-8">
          <div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-slate-200"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d11f0c] text-[11px] font-semibold text-white">
                FT
              </span>
              <span>FreeToWork</span>
            </button>
            <h1 className="text-2xl font-semibold text-slate-50 sm:text-3xl">Welcome back.</h1>
            <p className="mt-2 text-sm text-slate-300">
              Sign in to find nearby work or manage the jobs you have posted.
            </p>
          </div>
          <div className="mt-8 space-y-2 text-xs text-slate-300">
            <p className="font-medium text-slate-200">New to FreeToWork?</p>
            <p>Join our trusted community and turn your free time into real income.</p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-full bg-slate-50 px-4 py-1.5 text-xs font-medium text-slate-900 hover:bg-slate-200"
            >
              Create an account
            </Link>
          </div>
        </div>

        <div className="flex flex-col justify-center px-6 py-6 md:px-8 md:py-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <p className="text-sm font-medium text-slate-100">Login</p>
              <p className="mt-1 text-xs text-slate-400">
                Use the email and password you registered with.
              </p>
            </div>
            <div className="space-y-3">
              <div className="space-y-1 text-xs">
                <label htmlFor="email" className="text-slate-300">
                  Email
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2">
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1 text-xs">
                <label htmlFor="password" className="text-slate-300">
                  Password
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-[11px] font-medium text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(true)}
                className="hover:text-slate-200"
              >
                Forgot password?
              </button>
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-[#d11f0c] px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-[#d11f0c]/40 hover:bg-[#b91a09]"
            >
              Continue
            </button>
          </form>
        </div>
      </div>

      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950/95 p-5 shadow-xl shadow-black/60">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-50">Reset password</h2>
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(false)}
                className="text-lg text-slate-400 hover:text-slate-200"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-1 text-xs">
                <label htmlFor="forgot-email" className="text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  id="forgot-email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-slate-50 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-slate-200"
              >
                Send reset link
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;

