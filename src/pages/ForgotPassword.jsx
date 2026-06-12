import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Key, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // هنا المفروض الباك إند يبعت الإيميل، إحنا هنعمل محاكاة
    alert(`A password reset link has been sent to ${email}`);
    // هننقله لصفحة الـ Reset عشان يكمل الدورة
    navigate('/reset-password');
  };

  return (
    <div className="py-16 bg-slate-50 flex items-center justify-center px-4 min-h-[85vh]">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 max-w-md w-full p-8">
        {/* Header Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-cyan-50 p-4 rounded-full shadow-sm border border-cyan-100">
            <Key className="w-8 h-8 text-cyan-600" />
          </div>
        </div>
        
        {/* Texts */}
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">Forgot Password?</h1>
        <p className="text-center text-slate-500 text-sm mb-8 leading-relaxed">
          Enter your registered email address to receive a password reset link and OTP.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3.5 rounded-xl transition shadow-md border-none cursor-pointer"
          >
            Send Reset Link
          </button>
        </form>

        {/* Back to Login */}
        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-cyan-600 transition decoration-none">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}