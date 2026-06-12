import { useState } from 'react';
import { Camera } from 'lucide-react';

export default function EditProfile() {
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    firstName: 'Ahmed',
    lastName: 'Mohammed',
    email: 'ahmed.mohammed@baytak.com',
    phone: '+20 100 123 4567',
    city: 'Alexandria',
    bio: 'Looking for reliable home maintenance services.',
  });

  const [isSaving, setIsSaving] = useState(false);
  // 🔴 1. State الجديد لحفظ الصورة المعروضة 🔴
  const [profileImage, setProfileImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔴 2. فنكشن معالجة رفع الصورة 🔴
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]; // قراءة الملف المختار
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result); // حفظ الصورة كـ base64 لعرضها
      };
      reader.readAsDataURL(file); // تحويل الملف لـ Data URL
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Profile updated successfully!');
    }, 1000);
  };

  const handleCancel = () => {
    setFormData({
      firstName: 'Ahmed',
      lastName: 'Mohammed',
      email: 'ahmed.mohammed@baytak.com',
      phone: '+20 100 123 4567',
      city: 'Alexandria',
      bio: 'Looking for reliable home maintenance services.',
    });
    // لإعادة تعيين الصورة المرفوعة (لو حابب)
    // setProfileImage(null); 
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="md:col-span-1">
            {/* Avatar Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-6">
              <div className="flex flex-col items-center">
                
                {/* 🔴 3. تعديل جزء الـ Avatar ليكون Clickable 🔴 */}
                {/* جعلنا الحاوية كلها label واحدة مربوطة بالـ input المخفي */}
                <label className="relative mb-4 cursor-pointer inline-block group">
                  {/* الـ input المخفي لرفع الملفات */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden" // مخفي برمجياً
                  />

                  {/* Avatar (بيظهر الـ Gradient أو الصورة المرفوعة) */}
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-32 h-32 rounded-full object-cover shadow-inner border-2 border-cyan-100"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-600 to-cyan-400 flex items-center justify-center text-white text-4xl font-bold shadow-inner">
                      {formData.firstName[0]}{formData.lastName[0]}
                    </div>
                  )}

                  {/* Camera overlay button (دلوقتي هو جزء من الـ label) */}
                  <div className="absolute bottom-0 right-0 bg-amber-500 group-hover:bg-amber-600 text-white rounded-full p-3 shadow-lg transition-colors duration-200 border-none">
                    <Camera size={20} />
                  </div>

                  {/* تأثير التظليل عند الوقوف بالماوس */}
                  <div className="absolute inset-0 bg-slate-900/10 hidden group-hover:flex items-center justify-center rounded-full transition-all">
                  </div>
                </label>
                {/* 🔴 نهاية التعديل 🔴 */}

                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  {formData.firstName} {formData.lastName}
                </h3>
                <p className="text-sm font-medium text-slate-500 mt-1">Customer Account</p>
                
              </div>
            </div>

            {/* Navigation Tabs (ابقيتها معلقة كما في كودك الأصلي) */}
            {/* <nav className="space-y-2 bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
              {[
                { id: 'personal', label: 'Personal Info' },
                { id: 'security', label: 'Security & Password' },
                { id: 'notifications', label: 'Notifications' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-5 py-3.5 rounded-xl font-semibold transition-all duration-200 border-none cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-cyan-50 text-cyan-700 shadow-sm'
                      : 'bg-transparent text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav> */}
          </div>

          {/* Right Form Section */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 sm:p-10">
              {/* Heading */}
              <div className="mb-10 pb-6 border-b border-slate-100">
                <h1 className="text-3xl font-bold text-slate-900">
                  Personal Information
                </h1>
                <p className="text-slate-500 mt-2 text-lg font-medium">
                  Update your profile details and public bio.
                </p>
              </div>

              {/* Form Grid */}
              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                {/* First Row: First Name & Last Name */}
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

                {/* Second Row: Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 transition-all text-slate-900 font-medium"
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

                {/* Third Row: City */}
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

                {/* Bio Textarea */}
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

                {/* Action Buttons */}
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
                    disabled={isSaving}
                    className="px-8 py-3 rounded-xl bg-cyan-600 text-white font-bold hover:bg-cyan-700 disabled:opacity-70 transition-all shadow-md border-none cursor-pointer"
                  >
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