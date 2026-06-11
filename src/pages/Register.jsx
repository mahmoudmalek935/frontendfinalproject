import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, ChevronDown } from 'lucide-react';

export default function Register() {
  const [role, setRole] = useState('customer');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    specialty: '',
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // لما نربط بالباك إند، هنبعت الداتا دي: { role, ...formData }
    alert('Account Created Successfully! Please Login.');
    navigate('/login'); // بعد ما يسجل، بنوديه لصفحة الدخول
  };

  const specialties = [
    'Plumbing',
    'Electrical',
    'Carpentry',
    'HVAC',
    'Painting',
    'Landscaping',
    'Cleaning',
    'General Maintenance',
  ];

  return (
    <div className="py-16 bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 text-center">
            Create your Baytak Account
          </h1>
        </div>

        {/* Role Toggle */}
        <div className="flex gap-3 mb-8 bg-slate-100 p-1 rounded-full">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`flex-1 px-4 py-3 rounded-full font-semibold text-sm transition-all duration-200 cursor-pointer border-none ${
              role === 'customer'
                ? 'bg-cyan-600 text-white shadow-lg'
                : 'bg-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            I need a service
          </button>
          <button
            type="button"
            onClick={() => setRole('provider')}
            className={`flex-1 px-4 py-3 rounded-full font-semibold text-sm transition-all duration-200 cursor-pointer border-none ${
              role === 'provider'
                ? 'bg-cyan-600 text-white shadow-lg'
                : 'bg-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            I want to work
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent text-slate-900 placeholder-slate-400"
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent text-slate-900 placeholder-slate-400"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent text-slate-900 placeholder-slate-400"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent text-slate-900 placeholder-slate-400"
              required
            />
          </div>

          {/* Specialty - Only for Provider */}
          {role === 'provider' && (
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400">
                <ChevronDown className="w-5 h-5" />
              </div>
              <select
                name="specialty"
                value={formData.specialty}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent text-slate-900 appearance-none cursor-pointer bg-white"
                required
              >
                <option value="">Select My Specialty</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Create Account Button */}
          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-xl transition-colors duration-200 mt-6 border-none cursor-pointer"
          >
            Create Account
          </button>
        </form>

        {/* Footer Text */}
        <div className="mt-6 text-center">
          <p className="text-slate-600 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-600 hover:text-cyan-700 font-semibold transition-colors duration-200 decoration-none">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}