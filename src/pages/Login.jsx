import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    // دي الخدعة اللي هتنور اللوحات لحد ما نربط بالباك إند
    localStorage.setItem("token", "dummy-test-token-123");
    navigate(0); // ريفريش عشان الـ Navbar يحس بالتوكن
    navigate("/"); // توجيه للرئيسية
  };

  const handleGoogleSignIn = () => {
    console.log('Sign in with Google');
  };

  const handleAppleSignIn = () => {
    console.log('Sign in with Apple');
  };

  return (
    <div className="py-16 bg-slate-50 flex items-center justify-center px-4">
      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 max-w-md w-full p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 text-center mb-2">
            Welcome back to Baytak
          </h1>
          <p className="text-center text-slate-500 text-sm">
            Sign in to access your services
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignIn} className="space-y-5">
          {/* Email Input */}
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
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
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition text-slate-900 placeholder-slate-400"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
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
                className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition text-slate-900 placeholder-slate-400"
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

          {/* Remember Me & Forgot Password */}
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
            <a href="#" className="text-cyan-600 hover:text-cyan-700 font-medium transition decoration-none">
              Forgot Password?
            </a>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-xl transition transform hover:scale-[1.02] active:scale-95 text-base shadow-md border-none cursor-pointer"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="text-xs font-medium text-slate-500">Or continue with</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        {/* Social Auth Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Google */}
          <button
            onClick={handleGoogleSignIn}
            type="button"
            className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-slate-200 bg-white rounded-xl hover:border-slate-300 hover:bg-slate-50 transition font-medium text-slate-700 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="text-sm">Google</span>
          </button>

          {/* Apple */}
          <button
            onClick={handleAppleSignIn}
            type="button"
            className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-slate-200 bg-white rounded-xl hover:border-slate-300 hover:bg-slate-50 transition font-medium text-slate-700 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.38-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.38C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8.905-.15 1.77-.76 2.84-.64 1.2.12 2.09.72 2.59 1.81-2.62 1.58-2.24 5.98.48 7.13-.55 1.49-1.36 2.06-2.99 2.27z" />
            </svg>
            <span className="text-sm">Apple</span>
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-cyan-600 hover:text-cyan-700 font-bold transition decoration-none">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}