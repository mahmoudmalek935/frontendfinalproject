import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, ChevronDown, MapPin } from 'lucide-react'; // ضفنا MapPin

export default function Register() {
  const [role, setRole] = useState('customer');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    governorate: '', // ضفنا المحافظة في الـ state
    specialty: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // لو بيكتب في التليفون، نمنع الحروف ونخليه أرقام بس
    if (name === 'phone') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: onlyNums }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // التحقق من أن رقم التليفون 11 رقم بالظبط
    if (formData.phone.length !== 11) {
      alert("Please enter a valid 11-digit Egyptian phone number.");
      return;
    }
    
    if (role === 'provider') {
      navigate('/provider-onboarding');
    } else {
      alert('Account Created Successfully! Please Login.');
      navigate('/login'); 
    }
  };

  const specialties = [
    'Plumbing', 'Electrical', 'Carpentry', 'AC Repair', 
    'Painting', 'Gardening', 'Cleaning', 'Pest Control',
  ];

  // قائمة محافظات مصر
  const governorates = [
    "Cairo", "Alexandria", "Giza", "Qalyubia", "Port Said", "Suez", "Gharbia",
    "Dakahlia", "Ismailia", "Asyut", "Faiyum", "Sharqia", "Aswan", "Damietta",
    "Beheira", "Minya", "Beni Suef", "Qena", "Sohag", "Hurghada (Red Sea)",
    "Luxor", "Monufia", "Kafr El Sheikh", "North Sinai", "South Sinai", "New Valley", "Matrouh"
  ];

  return (
    <div className="py-16 bg-slate-50 flex items-center justify-center px-4 min-h-screen">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 text-center">
            Create your Baytak Account
          </h1>
        </div>

        <div className="flex gap-3 mb-8 bg-slate-100 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer border-none ${
              role === 'customer' ? 'bg-cyan-600 text-white shadow-md' : 'bg-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            I need a service
          </button>
          <button
            type="button"
            onClick={() => setRole('provider')}
            className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer border-none ${
              role === 'provider' ? 'bg-cyan-600 text-white shadow-md' : 'bg-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            I want to work
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 text-slate-900 placeholder-slate-400 transition"
              required
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 text-slate-900 placeholder-slate-400 transition"
              required
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="tel"
              name="phone"
              maxLength="11"
              placeholder="Phone Number (11 digits)"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 text-slate-900 placeholder-slate-400 transition"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 text-slate-900 placeholder-slate-400 transition"
              required
            />
          </div>

          {/* 🔴 Select Governorate (يظهر للعميل والصنايعي) 🔴 */}
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none">
              <ChevronDown className="w-5 h-5" />
            </div>
            <select
              name="governorate"
              value={formData.governorate}
              onChange={handleInputChange}
              className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 appearance-none cursor-pointer transition font-medium ${formData.governorate === "" ? "text-slate-400" : "text-slate-900"}`}
              required
            >
              <option value="" disabled hidden>Select Governorate</option>
              {governorates.map(gov => (
                <option key={gov} value={gov} className="text-slate-900">
                  {gov}
                </option>
              ))}
            </select>
          </div>

          {/* Specialty (يظهر للصنايعي فقط) */}
          {role === 'provider' && (
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none">
                <ChevronDown className="w-5 h-5" />
              </div>
              <select
                name="specialty"
                value={formData.specialty}
                onChange={handleInputChange}
                className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 appearance-none cursor-pointer transition font-medium ${formData.specialty === "" ? "text-slate-400" : "text-slate-900"}`}
                required
              >
                <option value="" disabled hidden>Select Primary Specialty</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty} className="text-slate-900">
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3.5 rounded-xl transition shadow-md mt-8 border-none cursor-pointer"
          >
            Create Account
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-slate-100">
          <p className="text-slate-600 text-sm font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-600 hover:text-cyan-700 font-bold transition decoration-none">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}