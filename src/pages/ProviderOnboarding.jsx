import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, CreditCard, Phone, FileText, BadgeCheck } from 'lucide-react';

// مهارات تفصيلية بدل الأقسام العامة
const skillsList = [
  'Pipe Installation', 'Leak Repair', 'Water Heater Setup', 
  'Wiring & Panels', 'Lighting Fixes', 'Appliance Repair',
  'Deep Cleaning', 'Post-Construction Cleaning', 'Furniture Assembly', 
  'Door/Window Fixing', 'Interior Painting', 'AC Maintenance'
];

export default function ProviderOnboarding() {
  const [selectedSkills, setSelectedSkills] = useState(new Set());
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nationalIdNumber, setNationalIdNumber] = useState('');
  const [bio, setBio] = useState('');
  
  // صور إلزامية
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [idFront, setIdFront] = useState(null);
  const [idBack, setIdBack] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(skill)) newSet.delete(skill);
      else newSet.add(skill);
      return newSet;
    });
  };

  const handleFileChange = (e, setter) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePhoneChange = (e) => {
    const onlyNums = e.target.value.replace(/[^0-9]/g, '');
    setPhoneNumber(onlyNums);
  };

  const handleNationalIdChange = (e) => {
    const onlyNums = e.target.value.replace(/[^0-9]/g, '');
    setNationalIdNumber(onlyNums);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // التحقق الصارم من البيانات
    if (!profilePhoto) return alert("Please upload your Profile Photo.");
    if (!idFront) return alert("Please upload the Front of your National ID.");
    if (!idBack) return alert("Please upload the Back of your National ID.");
    
    if (nationalIdNumber.length !== 14) {
      return alert("National ID must be exactly 14 digits.");
    }
    
    if (phoneNumber.length !== 11) {
      return alert("Phone Number must be exactly 11 digits.");
    }

    if (selectedSkills.size === 0) {
      return alert("Please select at least one skill.");
    }

    setIsSubmitting(true);
    
    // محاكاة الإرسال للسيرفر
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Profile completed successfully! Welcome to Baytak.");
      
      // 🔴🔴🔴 التعديل هنا: بنحفظ التوكن في الـ LocalStorage عشان ה-Navbar يحس بيك
      localStorage.setItem("token", "dummy-test-token-123");
      localStorage.setItem("userRole", "provider");
      
      // 🔴🔴🔴 التعديل هنا: بنستخدم window.location.href عشان الـ Navbar يعمل ريفريش ويظهر زرار ה-Logout
      window.location.href = '/provider/my-profile';
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto mb-8 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
          Complete Your Provider Profile
        </h1>
        <p className="text-lg text-slate-600 font-medium">
          Upload your documents to get the "Verified" badge and start receiving jobs.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit}>
          
          {/* 1. Verification Documents Section */}
          <div className="px-6 py-8 sm:px-10">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 text-sm">1</span>
              Identity Verification <span className="text-red-500 text-sm">*Required</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Photo */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Profile Photo</label>
                <div className="relative">
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setProfilePhoto)} className="hidden" id="profile-photo" />
                  <label htmlFor="profile-photo" className="block border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center cursor-pointer hover:border-cyan-500 hover:bg-cyan-50 transition-all h-48 flex flex-col justify-center">
                    {profilePhoto ? (
                      <div className="flex flex-col items-center">
                        <img src={profilePhoto} alt="Profile" className="w-20 h-20 rounded-full object-cover mb-2 shadow-sm" />
                        <span className="text-xs font-semibold text-cyan-600">Change Photo</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Camera className="w-8 h-8 text-slate-400 mb-2" />
                        <span className="text-xs font-bold text-slate-600 bg-white border px-3 py-1.5 rounded-lg shadow-sm">Upload Face</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* ID Front */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">ID Card (Front)</label>
                <div className="relative">
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setIdFront)} className="hidden" id="id-front" />
                  <label htmlFor="id-front" className="block border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-all h-48 flex flex-col justify-center">
                    {idFront ? (
                      <div className="flex flex-col items-center">
                        <img src={idFront} alt="ID Front" className="w-full h-20 object-cover rounded-lg mb-2 shadow-sm" />
                        <span className="text-xs font-semibold text-amber-600">Change Front</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <CreditCard className="w-8 h-8 text-slate-400 mb-2" />
                        <span className="text-xs font-bold text-slate-600 bg-white border px-3 py-1.5 rounded-lg shadow-sm">Upload Front</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* ID Back */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">ID Card (Back)</label>
                <div className="relative">
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setIdBack)} className="hidden" id="id-back" />
                  <label htmlFor="id-back" className="block border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-all h-48 flex flex-col justify-center">
                    {idBack ? (
                      <div className="flex flex-col items-center">
                        <img src={idBack} alt="ID Back" className="w-full h-20 object-cover rounded-lg mb-2 shadow-sm" />
                        <span className="text-xs font-semibold text-amber-600">Change Back</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <CreditCard className="w-8 h-8 text-slate-400 mb-2" />
                        <span className="text-xs font-bold text-slate-600 bg-white border px-3 py-1.5 rounded-lg shadow-sm">Upload Back</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
            
            {/* National ID Text Input */}
            <div className="mt-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">National ID Number (14 Digits)</label>
              <div className="relative">
                <BadgeCheck className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  required
                  maxLength="14"
                  value={nationalIdNumber}
                  onChange={handleNationalIdChange}
                  placeholder="e.g. 29901011234567"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 outline-none transition-all text-slate-900 font-mono tracking-widest"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100"></div>

          {/* 2. Professional Details */}
          <div className="px-6 py-8 sm:px-10">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 text-sm">2</span>
              Professional Details
            </h2>
            <div className="space-y-6">
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Phone Number (WhatsApp) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    maxLength="11"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="010XXXXXXXX"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 outline-none transition-all text-slate-900 font-mono tracking-wide"
                  />
                </div>
              </div>

              {/* Bio (Optional) */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  About You (Bio) <span className="text-slate-400 font-normal text-xs ml-1">(Optional)</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    placeholder="Tell customers about your experience, how many years you've worked, etc."
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 outline-none transition-all resize-none text-slate-900"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100"></div>

          {/* 3. Specific Skills Section */}
          <div className="px-6 py-8 sm:px-10">
            <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 text-sm">3</span>
              Specific Technical Skills <span className="text-red-500 text-sm">*</span>
            </h2>
            <p className="text-sm font-medium text-slate-500 mb-6 pl-10">
              Select the exact tasks you excel at so customers can find you easily.
            </p>
            <div className="flex flex-wrap gap-3 pl-10">
              {skillsList.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all border cursor-pointer ${
                    selectedSkills.has(skill)
                      ? 'bg-cyan-50 border-cyan-500 text-cyan-700 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-cyan-300'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-200"></div>

          {/* Footer Submit */}
          <div className="px-6 py-6 sm:px-10 bg-slate-50 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-10 py-3.5 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-700 transition-colors shadow-md border-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed text-lg"
            >
              {isSubmitting ? 'Verifying...' : 'Save & View Profile'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}