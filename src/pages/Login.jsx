import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, Info, X } from 'lucide-react';

import { useGoogleLogin } from '@react-oauth/google';
import fbLogin from 'react-facebook-login/dist/facebook-login-render-props';
const FacebookLogin = fbLogin.default || fbLogin;
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [feedbackModal, setFeedbackModal] = useState({ isOpen: false, title: "", message: "" });

  const navigate = useNavigate();

  const showFeedback = (title, message) => {
    setFeedbackModal({ isOpen: true, title, message });
  }

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      setIsLoading(true);

      const response = await fetch('https://localhost:7088/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Invalid email or password');
      }

      const data = await response.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role.toLowerCase());
      localStorage.setItem("fullName", data.fullName);

      if (data.providerId) {
        localStorage.setItem("providerId", data.providerId);
      }

      const returnUrl = location?.state?.from || "/";
      window.location.href = returnUrl;

    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await fetch('https://localhost:7088/api/auth/google-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: tokenResponse.access_token })
        });

        if (!response.ok) throw new Error('Failed to authenticate');

        const data = await response.json();

        if (data.isNewUser) {
          showFeedback("info", "Account Not Found", "You don't have an account yet. Please register first.");
          setTimeout(() => navigate('/register'), 2500); 
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role.toLowerCase());
        localStorage.setItem("fullName", data.fullName);
        if (data.providerId) localStorage.setItem("providerId", data.providerId);

        window.location.href = "/";

      } catch (error) {
        showFeedback("error", "Login Failed", "Something went wrong during Google authentication.");
      }
    },
    onError: () => showFeedback("error", "Google Error", "Could not connect to Google.")
  });

  const handleFacebookSignIn = async (fbResponse) => {
    if (!fbResponse.accessToken) {
      showFeedback("error", "Facebook Error", "Login cancelled or failed.");
      return;
    }

    try {
      const response = await fetch('https://localhost:7088/api/auth/facebook-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: fbResponse.accessToken })
      });

      if (!response.ok) throw new Error('Failed to authenticate');
      const data = await response.json();
      
      if (data.isNewUser) {
         showFeedback("info", "Account Not Found", "You don't have an account yet. Please register first.");
         setTimeout(() => navigate('/register'), 2500);
         return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role.toLowerCase()); 
      localStorage.setItem("fullName", data.fullName);
      if (data.providerId) localStorage.setItem("providerId", data.providerId);
      
      window.location.href = "/";

    } catch (error) {
      showFeedback("error", "Login Failed", "Something went wrong during Facebook authentication.");
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    navigate('/forgot-password');
  };

  return (
    <div className="py-16 bg-slate-50 flex items-center justify-center px-4 min-h-[85vh] relative">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 max-w-md w-full p-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 text-center mb-2">
            Welcome back to Baytak
          </h1>
          <p className="text-center text-slate-500 text-sm">
            Sign in to access your services
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm font-bold text-red-700">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-5">
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 transition text-slate-900 placeholder-slate-400"
                required
              />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 transition text-slate-900 placeholder-slate-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition bg-transparent border-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 bg-slate-50 cursor-pointer accent-cyan-600"
              />
              <span className="text-slate-700 font-medium">Remember me</span>
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-cyan-600 hover:text-cyan-700 font-bold transition decoration-none bg-transparent border-none cursor-pointer p-0"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-400 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition shadow-md border-none cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Or continue with</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        {/* 🔴 أزرار السوشيال ميديا 🔴 */}
        <div className="grid grid-cols-2 gap-3 mb-6 items-center">

          {/* زرار جوجل */}
          <button onClick={() => handleGoogleSignIn()} type="button" className="flex items-center justify-center gap-2 h-[46px] w-full border border-slate-200 bg-white rounded-xl hover:bg-slate-50 transition font-bold text-slate-700 cursor-pointer shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="text-sm">Google</span>
          </button>

          {/* زرار فيسبوك */}
          <FacebookLogin
            appId="4290232774521719" // 🔴 حط الـ ID هنا
            fields="name,email,picture"
            callback={handleFacebookSignIn}
            render={renderProps => (
              <button onClick={renderProps.onClick} type="button" className="flex items-center justify-center gap-2 h-[46px] w-full border border-slate-200 bg-white rounded-xl hover:bg-slate-50 transition font-bold text-slate-700 cursor-pointer shadow-sm">
                <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-sm">Facebook</span>
              </button>
            )}
          />
        </div>

        <div className="text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-cyan-600 hover:text-cyan-700 font-bold transition decoration-none">
            Sign up
          </Link>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {feedbackModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl animate-in zoom-in duration-200 border-2 border-cyan-100">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-50">
              <Info className="h-8 w-8 text-cyan-600" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">{feedbackModal.title}</h3>
            <p className="mt-2 text-sm font-medium text-slate-500">
              {feedbackModal.message}
            </p>
            <button
              onClick={() => setFeedbackModal({ isOpen: false, title: "", message: "" })}
              className="mt-6 w-full rounded-xl bg-slate-100 py-3 font-bold text-slate-700 transition hover:bg-slate-200 border-none cursor-pointer"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}