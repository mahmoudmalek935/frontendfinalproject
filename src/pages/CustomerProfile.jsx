import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Edit, ShieldCheck, Calendar, Loader2 } from 'lucide-react';

export default function CustomerProfile() {
  const [customerInfo, setCustomerInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('https://localhost:7088/api/Auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setCustomerInfo({
            name: data.fullName,
            email: data.email,
            phone: data.phone || "Not provided", 
            location: data.address || "No address saved yet",
            profilePicture: data.profilePicture || null, 
            joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) 
          });
        } else {
          localStorage.removeItem("token");
          navigate('/login');
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-cyan-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading your profile...</p>
      </div>
    );
  }

  if (!customerInfo) return null;

  // 🔴 الدالة دي عشان تظبط مسار الصورة وتقرأها من السيرفر 🔴
  const getImageUrl = (picPath) => {
    if (!picPath) return null;
    // لو المسار بيبدأ بـ / يبقى ده من السيرفر بتاعنا، نحط قبله الرابط
    if (picPath.startsWith('/')) {
      return `https://localhost:7088${picPath}`;
    }
    return picPath; // لو صورة قديمة Base64 رجعها زي ما هي
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Profile</h1>
            <p className="mt-2 text-sm font-medium text-slate-500">Manage your personal information and address.</p>
          </div>
          <Link 
            to="/edit-profile" 
            className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors shadow-sm decoration-none"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </Link>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Cover & Avatar */}
          <div className="h-32 bg-slate-200 relative">
            <div className="absolute -bottom-12 left-8">
              
              {/* 🟢 عرض الصورة بالرابط المتظبط 🟢 */}
              {customerInfo.profilePicture ? (
                <img 
                  src={getImageUrl(customerInfo.profilePicture)} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-sm bg-white"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-white bg-cyan-100 flex items-center justify-center text-cyan-700 text-3xl font-bold shadow-sm uppercase">
                  {customerInfo.name ? customerInfo.name.charAt(0) : "U"}
                </div>
              )}
            </div>
          </div>

          <div className="pt-16 pb-8 px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                {customerInfo.name}
                <ShieldCheck className="w-5 h-5 text-cyan-600" />
              </h2>
              <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mt-1">
                <Calendar className="w-4 h-4" /> Member since {customerInfo.joinDate}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Personal Details</h3>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 text-slate-500 border border-slate-100">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 mb-0.5">Full Name</p>
                    <p className="text-sm font-bold text-slate-900">{customerInfo.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 text-slate-500 border border-slate-100">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 mb-0.5">Email Address</p>
                    <p className="text-sm font-bold text-slate-900">{customerInfo.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 text-slate-500 border border-slate-100">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 mb-0.5">Phone Number</p>
                    <p className="text-sm font-bold text-slate-900">{customerInfo.phone}</p>
                  </div>
                </div>
              </div>

              {/* Address Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Saved Address</h3>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 text-slate-500 border border-slate-100">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 mb-0.5">Primary Location</p>
                    <p className="text-sm font-bold text-slate-900 leading-relaxed">{customerInfo.location}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}