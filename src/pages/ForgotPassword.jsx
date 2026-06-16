import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Key, ArrowLeft, ShieldCheck, Loader2, Clock } from 'lucide-react';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 300 ثانية = 5 دقايق
  
  const navigate = useNavigate();

  // لوجيك التايمر
  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
      const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timerId);
    }
  }, [step, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // 1. إرسال الكود للإيميل
  const handleSendCode = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      // ⚠️ تأكد إن البورت 7088 هو نفس بورت الباك إند عندك لو مختلف غيره
      const response = await fetch('https://localhost:7088/api/Auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to send OTP.');
      }

      setStep(2);
      setTimeLeft(300);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. التأكد من الـ OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (otp.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit code');
      return;
    }

    if (timeLeft === 0) {
      setErrorMessage('Code has expired. Please resend a new one.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://localhost:7088/api/Auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Invalid OTP code.');
      }

      navigate('/reset-password', { state: { email, otp } });
      
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. إعادة إرسال الكود
  const handleResend = async () => {
    setTimeLeft(300);
    setOtp('');
    setErrorMessage('');
    
    try {
      await fetch('https://localhost:7088/api/Auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      alert('A new code has been sent to your email.');
    } catch (error) {
      setErrorMessage('Failed to resend code.');
    }
  };

  return (
    <div className="py-16 bg-slate-50 flex items-center justify-center px-4 min-h-[85vh]">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 max-w-md w-full p-8 transition-all duration-300">
        
        <div className="flex justify-center mb-6">
          <div className="bg-cyan-50 p-4 rounded-full shadow-sm border border-cyan-100">
            {step === 1 ? <Key className="w-8 h-8 text-cyan-600" /> : <ShieldCheck className="w-8 h-8 text-cyan-600" />}
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">
          {step === 1 ? 'Forgot Password?' : 'Verify Email'}
        </h1>
        <p className="text-center text-slate-500 text-sm mb-8 leading-relaxed">
          {step === 1 
            ? 'Enter your registered email address to receive a password reset link and OTP.'
            : `We've sent a 6-digit verification code to ${email}`
          }
        </p>

        {errorMessage && (
          <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-bold text-center">
            {errorMessage}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-6">
            <div>
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

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-400 text-white font-bold py-3.5 rounded-xl transition shadow-md border-none cursor-pointer"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Code'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="otp" className="block text-sm font-bold text-slate-700">
                  Verification Code (OTP)
                </label>
                <span className={`text-xs font-bold flex items-center gap-1 ${timeLeft <= 60 ? 'text-rose-600' : 'text-slate-500'}`}>
                  <Clock className="w-3.5 h-3.5" />
                  {formatTime(timeLeft)}
                </span>
              </div>
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

            <button 
              type="submit" 
              disabled={isLoading || timeLeft === 0}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition shadow-md border-none cursor-pointer"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Code'}
            </button>

            {timeLeft === 0 && (
              <div className="text-center text-sm font-medium text-slate-500 pt-2">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-cyan-600 hover:text-cyan-700 font-bold bg-transparent border-none cursor-pointer p-0 underline decoration-cyan-200 underline-offset-4"
                >
                  Resend Code
                </button>
              </div>
            )}
          </form>
        )}

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          {step === 2 ? (
             <button onClick={() => setStep(1)} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-cyan-600 transition decoration-none bg-transparent border-none cursor-pointer">
               <ArrowLeft className="w-4 h-4" /> Change Email
             </button>
          ) : (
            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-cyan-600 transition decoration-none">
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}