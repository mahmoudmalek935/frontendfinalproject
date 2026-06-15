import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Loader2, CheckCircle2 } from 'lucide-react'; 

export default function EditProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  
  // 🔴 1. حالة جديدة لحفظ ملف الصورة الفعلي 🔴
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    bio: '',
  });

  const getUserIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] 
                  || payload["nameid"] 
                  || payload["sub"] 
                  || payload.Id;
                  
      return userId;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('https://localhost:7088/api/Auth/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          const nameParts = data.fullName ? data.fullName.split(" ") : ["", ""];
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ") || "";

          setFormData({
            firstName: firstName,
            lastName: lastName,
            email: data.email || "",
            phone: data.phone || "",
            city: data.address || "", 
            bio: data.bio || "", 
          });
          
          // لو في صورة جاية من الباك إند، بنحط معاها رابط السيرفر عشان تظهر
          if (data.profilePicture) {
              setProfileImage("https://localhost:7088" + data.profilePicture);
          }
        } else {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // 🔴 2. حفظ الملف الفعلي هنا عشان نبعته للباك إند 🔴
      setSelectedFile(file); 
      
      // ده عشان نعرض الصورة للمستخدم قبل ما يحفظ
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const token = localStorage.getItem("token");
    const userId = getUserIdFromToken(token);
    
    if (!userId) {
      navigate('/login');
      return;
    }

    // 🔴 3. تجهيز الـ FormData بدل الـ JSON 🔴
    const formDataObj = new FormData();
    formDataObj.append('FullName', `${formData.firstName} ${formData.lastName}`.trim());
    formDataObj.append('Phone', formData.phone);
    formDataObj.append('Governorate', formData.city);
    formDataObj.append('Bio', formData.bio);
    formDataObj.append('Role', localStorage.getItem("role") || "Customer");
    
    // لو اختار صورة، نبعت الملف الفعلي للباك إند
    if (selectedFile) {
      formDataObj.append('ProfileImage', selectedFile); 
    }

    try {
      const response = await fetch(`https://localhost:7088/api/Auth/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
          // ⚠️ ملحوظة: مبنكتبش Content-Type خالص مع الـ FormData، المتصفح بيظبطها لوحده
        },
        body: formDataObj 
      });

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/my-profile'); 
        }, 2000);

      } else {
        alert('Failed to update profile. Please try again.'); 
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert('An error occurred. Check your connection.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/my-profile'); 
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-cyan-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative">
      
      {showSuccess && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-xl animate-in slide-in-from-top-5 fade-in duration-300">
          <CheckCircle2 className="w-6 h-6" />
          <p className="font-bold text-lg">Profile updated successfully!</p>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-6">
              <div className="flex flex-col items-center">
                
                <label className="relative mb-4 cursor-pointer inline-block group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-32 h-32 rounded-full object-cover shadow-inner border-2 border-cyan-100"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-600 to-cyan-400 flex items-center justify-center text-white text-4xl font-bold shadow-inner uppercase">
                      {formData.firstName[0] || ''}{formData.lastName[0] || ''}
                    </div>
                  )}

                  <div className="absolute bottom-0 right-0 bg-amber-500 group-hover:bg-amber-600 text-white rounded-full p-3 shadow-lg transition-colors duration-200 border-none">
                    <Camera size={20} />
                  </div>

                  <div className="absolute inset-0 bg-slate-900/10 hidden group-hover:flex items-center justify-center rounded-full transition-all"></div>
                </label>

                <h3 className="text-xl font-bold text-slate-900 mt-2 text-center">
                  {formData.firstName} {formData.lastName}
                </h3>
                <p className="text-sm font-medium text-slate-500 mt-1">Customer Account</p>
                
              </div>
            </div>
          </div>

          {/* Right Form Section */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 sm:p-10">
              <div className="mb-10 pb-6 border-b border-slate-100">
                <h1 className="text-3xl font-bold text-slate-900">
                  Personal Information
                </h1>
                <p className="text-slate-500 mt-2 text-lg font-medium">
                  Update your profile details and public bio.
                </p>
              </div>

              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-bold text-slate-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 transition-all text-slate-900 font-medium"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-bold text-slate-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 transition-all text-slate-900 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">
                      Email Address <span className="text-slate-400 font-normal">(Cannot be changed)</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 font-medium cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 transition-all text-slate-900 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-bold text-slate-700 mb-2">
                    City / Governorate
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 transition-all text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-bold text-slate-700 mb-2">
                    About Me
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 transition-all text-slate-900 resize-none font-medium"
                  />
                </div>

                <div className="flex justify-end gap-4 pt-8 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-8 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all bg-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving || showSuccess}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-cyan-600 text-white font-bold hover:bg-cyan-700 disabled:opacity-70 transition-all shadow-md border-none cursor-pointer"
                  >
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}