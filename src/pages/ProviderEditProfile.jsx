import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Upload } from 'lucide-react';

export default function ProviderEditProfile() {
  const navigate = useNavigate();

  // بيانات وهمية (المفروض دي بتيجي من الباك إند لما يفتح الصفحة)
  const [selectedSkills, setSelectedSkills] = useState(['Wiring & Panels', 'Lighting Fixes']);
  const [phoneNumber, setPhoneNumber] = useState('01012345678');
  const [bio, setBio] = useState('Professional plumber and electrician with 10+ years of experience. Licensed and insured. Available for emergency repairs 24/7.');
  const [profileImage, setProfileImage] = useState(null);

  // لستة المهارات المتاحة (تم توحيدها مع صفحة الـ Onboarding)
  const skillsList = [
    'Pipe Installation', 'Leak Repair', 'Water Heater Setup', 
    'Wiring & Panels', 'Lighting Fixes', 'Appliance Repair',
    'Deep Cleaning', 'Post-Construction Cleaning', 'Furniture Assembly', 
    'Door/Window Fixing', 'Interior Painting', 'AC Maintenance'
  ];

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log({
      phoneNumber,
      bio,
      selectedSkills,
      profileImage,
    });
    alert('Profile updated successfully!');
    // نرجعه لصفحة البروفايل أو الداشبورد
    navigate('/provider-dashboard'); 
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Page Header */}
        <div className="px-8 py-8 border-b border-slate-100">
          <h1 className="text-3xl font-bold text-slate-900">Edit Your Profile</h1>
          <p className="text-slate-600 mt-2 font-medium">Update your information, skills, and bio.</p>
        </div>

        {/* Form Content */}
        <div className="px-8 py-8">
          
          {/* Profile Picture Section */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-slate-900 mb-4">Profile Picture</label>
            <div className="flex items-center gap-6">
              {/* Avatar Circle */}
              <div className="relative">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-2 border-cyan-600 shadow-sm"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-50 to-cyan-100 flex items-center justify-center border border-cyan-200 shadow-sm">
                    <span className="text-3xl">👤</span>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors font-bold shadow-sm">
                  <Upload size={18} />
                  Upload New Photo
                </div>
              </label>
            </div>
          </div>

          <div className="h-px bg-slate-100 mb-8"></div>

          {/* Personal Info Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Personal Info</h2>

            {/* Phone Number */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number (WhatsApp)</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="tel"
                  maxLength="11"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 font-mono tracking-wide"
                  placeholder="010XXXXXXXX"
                />
              </div>
            </div>

            {/* Bio Textarea */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">About You (Bio)</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={5}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 resize-none text-slate-700"
                placeholder="Tell us about your experience and expertise..."
              />
            </div>
          </div>

          <div className="h-px bg-slate-100 mb-8"></div>

          {/* Manage Skills Section */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Manage Skills</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {skillsList.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-4 py-2.5 rounded-xl font-bold transition-all duration-200 text-sm border cursor-pointer ${
                    selectedSkills.includes(skill)
                      ? 'bg-cyan-50 border-cyan-500 text-cyan-700 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-cyan-300'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer with Buttons */}
        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/provider-dashboard')}
            className="px-6 py-3 text-slate-700 font-bold rounded-xl border border-slate-200 bg-white hover:bg-slate-100 transition-colors cursor-pointer shadow-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-8 py-3 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-700 transition-colors cursor-pointer shadow-sm border-none"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}