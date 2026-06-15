import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, CheckCircle2, X } from 'lucide-react';

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
  const navigate = useNavigate();

  // 🔴 States للمودالز الجديدة (نجاح وخطأ)
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

  // 🔴 رجعنا كلمة async هنا 🔴
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.phone.length !== 11) {
      showFeedback("error", "Invalid Phone", "Please enter a valid 11-digit Egyptian phone number.");
      return;
    }

    // لو صنايعي (بيروح يكمل بياناته)
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

    // تسجيل عميل (Customer)
    try {
      setIsLoading(true);
      
      // التحويل لـ FormData عشان الباك إند يقبلها
      const payload = new FormData();
      payload.append("FullName", formData.fullName);
      payload.append("Email", formData.email);
      payload.append("Password", formData.password);
      payload.append("Phone", formData.phone);
      payload.append("Role", "Customer"); 
      payload.append("Governorate", formData.governorate);

      const response = await fetch('https://localhost:7088/api/Auth/register', {
        method: 'POST',
        // شلنا الـ Headers
        body: payload 
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to register');
      }

      // 🔴 المودال بتاع النجاح
      showFeedback("success", "Welcome to Baytak!", "Your customer account has been created successfully.");
      
    } catch (error) {
      showFeedback("error", "Registration Failed", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // دالة لما يدوس أوك بعد النجاح يروح اللوجين
  const handleModalClose = () => {
    if (feedbackModal.type === "success") {
      navigate('/login');
    } else {
      setFeedbackModal({ isOpen: false, type: "", title: "", message: "" });
    }
  }

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
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} className="w-full pl-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-800" required />
          
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

          <button type="submit" disabled={isLoading} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3.5 rounded-xl transition border-none cursor-pointer disabled:opacity-70">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto"/> : (role === 'provider' ? 'Next Step' : 'Create Account')}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account? <Link to="/login" className="font-bold text-cyan-600 hover:text-cyan-700 decoration-none">Login here</Link>
        </p>
      </div>

      {/* ================= MODAL ================= */}
      {feedbackModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className={`w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl animate-in zoom-in duration-200 border-2 ${feedbackModal.type === "success" ? "border-green-100" : "border-red-100"}`}>
            <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${feedbackModal.type === "success" ? "bg-green-50" : "bg-red-50"}`}>
              {feedbackModal.type === "success" ? (
                <CheckCircle2 className="h-8 w-8 text-green-600" />
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
              {feedbackModal.type === "success" ? "Go to Login" : "Close"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}