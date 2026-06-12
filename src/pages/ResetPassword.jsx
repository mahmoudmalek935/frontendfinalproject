import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, EyeOff } from 'lucide-react';

export default function ResetPassword() {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validation
    if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
      setErrorMessage('Please enter a valid 6-digit code');
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('Password reset successfully! Redirecting to login...');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      
      // التوجيه التلقائي بعد ثانيتين لصفحة اللوجين
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    }, 1500);
  };

  const handleResend = () => {
    setSuccessMessage('Code resent to your email');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 flex items-center justify-center p-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-cyan-50 rounded-full flex items-center justify-center mb-4 border border-cyan-100 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-cyan-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">
            Set New Password
          </h1>
          <p className="text-sm text-slate-500 text-center leading-relaxed">
            Enter the 6-digit code sent to your email and choose a new password.
          </p>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-bold text-center">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-bold text-center">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Verification Code Input */}
          <div>
            <label htmlFor="otp" className="block text-sm font-bold text-slate-700 mb-2">
              Verification Code (OTP)
            </label>
            <input
              id="otp"
              type="text"
              placeholder="e.g. 123456"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 transition text-slate-900 placeholder-slate-400 text-center tracking-widest font-mono text-lg"
            />
          </div>

          {/* New Password Input */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-bold text-slate-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 transition text-slate-900 placeholder-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition bg-transparent border-none cursor-pointer"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-bold text-slate-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 transition text-slate-900 placeholder-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition bg-transparent border-none cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-400 text-white font-bold py-3.5 rounded-xl transition duration-200 mt-8 shadow-md border-none cursor-pointer"
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        {/* Footer Text */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-500 font-medium">
          Didn't receive the code?{' '}
          <button
            onClick={handleResend}
            className="text-cyan-600 hover:text-cyan-700 font-bold transition bg-transparent border-none cursor-pointer p-0 underline decoration-cyan-200 underline-offset-4"
          >
            Resend
          </button>
        </div>
      </div>
    </div>
  );
}