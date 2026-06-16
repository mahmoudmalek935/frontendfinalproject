import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, X, Eye, EyeOff, Info } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google'; 
import fbLogin from 'react-facebook-login/dist/facebook-login-render-props';
const FacebookLogin = fbLogin.default || fbLogin;
export default function Register() {
  const [role, setRole] = useState('customer');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    governorate: '',
    specialty: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSocialAuth, setIsSocialAuth] = useState(false); // 🔴 وحدنا الـ State هنا
  const navigate = useNavigate();

  const [feedbackModal, setFeedbackModal] = useState({ isOpen: false, type: "", title: "", message: "" });

  const showFeedback = (type, title, message) => {
    setFeedbackModal({ isOpen: true, type, title, message });
  }

  const specialties = [
    'Plumbing', 'Electrical', 'Carpentry', 'AC Repair',
    'Painting', 'Gardening', 'Cleaning', 'Pest Control',
  ];

  const governorates = [
    "Cairo", "Alexandria", "Giza", "Qalyubia", "Port Said", "Suez", "Gharbia",
    "Dakahlia", "Ismailia", "Asyut", "Faiyum", "Sharqia", "Aswan", "Damietta",
    "Beheira", "Minya", "Beni Suef", "Qena", "Sohag", "Hurghada (Red Sea)",
    "Luxor", "Monufia", "Kafr El Sheikh", "North Sinai", "South Sinai", "New Valley", "Matrouh"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: onlyNums }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.phone.length !== 11) {
      showFeedback("error", "Invalid Phone", "Please enter a valid 11-digit Egyptian phone number.");
      return;
    }

    if (role === 'provider') {
      const calculatedServiceId = specialties.indexOf(formData.specialty) + 1;
      navigate('/provider-onboarding', {
        state: {
          ...formData,
          role: 'Provider',
          serviceId: calculatedServiceId
        }
      });
      return;
    }

    try {
      setIsLoading(true);

      const payload = new FormData();
      payload.append("FullName", formData.fullName);
      payload.append("Email", formData.email);
      payload.append("Password", formData.password);
      payload.append("Phone", formData.phone);
      payload.append("Role", "Customer");
      payload.append("Governorate", formData.governorate);

      const response = await fetch('https://localhost:7088/api/Auth/register', {
        method: 'POST',
        body: payload
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to register');
      }

      showFeedback("success", "Welcome to Baytak!", "Your customer account has been created successfully.");

    } catch (error) {
      showFeedback("error", "Registration Failed", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    if (feedbackModal.type === "success") {
      navigate('/login');
    } else {
      setFeedbackModal({ isOpen: false, type: "", title: "", message: "" });
    }
  }

  const handleGoogleSignUp = useGoogleLogin({
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
          setIsSocialAuth(true); 
          setFormData(prev => ({
            ...prev,
            fullName: data.name,
            email: data.email,
            password: Math.random().toString(36).slice(-8) + "Aa1@!"
          }));
          showFeedback("info", "Google Linked", "Please complete the remaining fields (Phone, Governorate, Role) to finish creating your account.");
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role.toLowerCase());
        localStorage.setItem("fullName", data.fullName);
        if (data.providerId) localStorage.setItem("providerId", data.providerId);
        window.location.href = "/";

      } catch (error) {
        showFeedback("error", "Signup Failed", "Something went wrong during Google registration.");
      }
    },
    onError: () => showFeedback("error", "Google Error", "Could not connect to Google.")
  });

  const handleFacebookSignUp = async (fbResponse) => {
    if (!fbResponse.accessToken) {
      showFeedback("error", "Facebook Error", "Signup cancelled or failed.");
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
        setIsSocialAuth(true); 
        setFormData(prev => ({
          ...prev,
          fullName: data.name,
          email: data.email,
          password: Math.random().toString(36).slice(-8) + "Aa1@!" 
        }));
        showFeedback("info", "Facebook Linked", "Please complete the remaining fields (Phone, Governorate, Role) to finish creating your account.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role.toLowerCase());
      localStorage.setItem("fullName", data.fullName);
      if (data.providerId) localStorage.setItem("providerId", data.providerId);
      window.location.href = "/";

    } catch (error) {
      showFeedback("error", "Signup Failed", "Something went wrong during Facebook registration.");
    }
  };

  return (
    <div className="py-16 bg-slate-50 flex items-center justify-center px-4 min-h-screen relative">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <h1 className="text-3xl font-bold text-slate-900 text-center mb-8">Create your Baytak Account</h1>

        <div className="flex gap-3 mb-8 bg-slate-100 p-1.5 rounded-2xl">
          <button type="button" onClick={() => setRole('customer')} className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer border-none ${role === 'customer' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-600 bg-transparent'}`}>I need a service</button>
          <button type="button" onClick={() => setRole('provider')} className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer border-none ${role === 'provider' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-600 bg-transparent'}`}>I want to work</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} className="w-full pl-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-800" required />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} className="w-full pl-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-800" required />
          <input type="tel" name="phone" maxLength="11" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} className="w-full pl-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-800" required />

          {!isSocialAuth && (
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-800"
                required={!isSocialAuth} 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-600 transition-colors bg-transparent border-none cursor-pointer p-0"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          )}

          <select name="governorate" value={formData.governorate} onChange={handleInputChange} className="w-full pl-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-800" required>
            <option value="" disabled>Select Governorate</option>
            {governorates.map(gov => <option key={gov} value={gov}>{gov}</option>)}
          </select>

          {role === 'provider' && (
            <select name="specialty" value={formData.specialty} onChange={handleInputChange} className="w-full pl-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-800" required>
              <option value="" disabled>Select Specialty</option>
              {specialties.map(spec => <option key={spec} value={spec}>{spec}</option>)}
            </select>
          )}

          <button type="submit" disabled={isLoading} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3.5 rounded-xl transition border-none cursor-pointer disabled:opacity-70 shadow-md">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (role === 'provider' ? 'Next Step' : 'Create Account')}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Or register with</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        {/* 🔴 Social Signup Buttons 🔴 */}
        <div className="grid grid-cols-2 gap-3 mb-6 items-center">

          {/* زرار جوجل */}
          <button onClick={() => handleGoogleSignUp()} type="button" className="flex items-center justify-center gap-2 h-[46px] w-full border border-slate-200 bg-white rounded-xl hover:bg-slate-50 transition font-bold text-slate-700 cursor-pointer shadow-sm">
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
            callback={handleFacebookSignUp}
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

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account? <Link to="/login" className="font-bold text-cyan-600 hover:text-cyan-700 decoration-none">Login here</Link>
        </p>
      </div>

      {/* ================= MODAL ================= */}
      {feedbackModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className={`w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl animate-in zoom-in duration-200 border-2 ${feedbackModal.type === "success" ? "border-green-100" :
            feedbackModal.type === "info" ? "border-cyan-100" : "border-red-100"
            }`}>
            <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${feedbackModal.type === "success" ? "bg-green-50" :
              feedbackModal.type === "info" ? "bg-cyan-50" : "bg-red-50"
              }`}>
              {feedbackModal.type === "success" ? (
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              ) : feedbackModal.type === "info" ? (
                <Info className="h-8 w-8 text-cyan-600" />
              ) : (
                <X className="h-8 w-8 text-red-600" />
              )}
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">{feedbackModal.title}</h3>
            <p className="mt-2 text-sm font-medium text-slate-500">
              {feedbackModal.message}
            </p>
            <button
              onClick={handleModalClose}
              className="mt-6 w-full rounded-xl bg-slate-100 py-3 font-bold text-slate-700 transition hover:bg-slate-200 border-none cursor-pointer"
            >
              {feedbackModal.type === "success" ? "Go to Login" : "Okay"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}