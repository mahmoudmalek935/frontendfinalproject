import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Upload, X, Loader2, ImagePlus, CheckCircle2, Wallet } from 'lucide-react'; // 🔴 ضفنا أيقونة Wallet للسعر

export default function ProviderEditProfile() {
  const navigate = useNavigate();
  const providerId = localStorage.getItem("providerId");
  const token = localStorage.getItem("token");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [phoneNumber, setPhoneNumber] = useState('');
  const [bio, setBio] = useState('');
  const [price, setPrice] = useState(0); // 🔴 ده الـ State بتاع السعر
  const [selectedSkills, setSelectedSkills] = useState([]);
  
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  const [portfolioFiles, setPortfolioFiles] = useState([]); 
  const [existingPortfolio, setExistingPortfolio] = useState([]); 

  const skillsList = [
    'Pipe Installation', 'Leak Repair', 'Water Heater Setup', 
    'Wiring & Panels', 'Lighting Fixes', 'Appliance Repair',
    'Deep Cleaning', 'Post-Construction Cleaning', 'Furniture Assembly', 
    'Door/Window Fixing', 'Interior Painting', 'AC Maintenance'
  ];

  useEffect(() => {
    if (!providerId) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(`https://localhost:7088/api/providers/${providerId}`);
        if (!response.ok) throw new Error("فشل في جلب البيانات");
        
        const data = await response.json();
        
        setPhoneNumber(data.whatsAppNumber || '');
        setBio(data.bio || '');
        setPrice(data.price || 0); // 🔴 بيقرا السعر القديم من الداتا بيز
        
        if (data.skills) {
          setSelectedSkills(data.skills.split(',').map(s => s.trim()));
        }
        
        if (data.profilePicture) {
          setProfileImagePreview(`https://localhost:7088${data.profilePicture}`);
        }

        if (data.portfolioImages) {
          setExistingPortfolio(data.portfolioImages.split(',').filter(img => img.trim() !== ""));
        }

      } catch (err) {
        setError("حدث خطأ أثناء تحميل البيانات.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [providerId, navigate]);

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file); 
      setProfileImagePreview(URL.createObjectURL(file)); 
    }
  };

  const handlePortfolioUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const newPortfolio = files.map(file => ({
      file: file,
      preview: URL.createObjectURL(file)
    }));
    setPortfolioFiles(prev => [...prev, ...newPortfolio]);
  };

  const removeNewPortfolioImage = (indexToRemove) => {
    setPortfolioFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const removeExistingPortfolioImage = (indexToRemove) => {
    setExistingPortfolio(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSuccessMsg(""); 

    const formData = new FormData();
    formData.append('PricePerVisit', price || 0); // 🔴 بيبعت السعر للباك إند
    
    if (phoneNumber) formData.append('WhatsAppNumber', phoneNumber);
    if (bio) formData.append('Bio', bio);
    if (selectedSkills.length > 0) formData.append('Skills', selectedSkills.join(', '));
    if (existingPortfolio.length > 0) formData.append('ExistingPortfolioImages', existingPortfolio.join(','));
    
    if (profileImageFile) {
      formData.append('ProfileImage', profileImageFile);
    }

    portfolioFiles.forEach((portfolioObj) => {
      formData.append('PortfolioImages', portfolioObj.file);
    });

    try {
      const response = await fetch(`https://localhost:7088/api/providers/${providerId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}` 
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`مشكلة في السيرفر: ${errorText}`);
      }

      setSuccessMsg("Profile updated successfully! Redirecting...");
      setTimeout(() => {
        navigate(`/provider/${providerId}`);
      }, 1500);

    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء الحفظ. تأكد من البيانات وحاول مرة أخرى.");
      setIsSaving(false); 
    } 
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-10 h-10 animate-spin text-cyan-600" /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        
        <div className="px-8 py-8 border-b border-slate-100">
          <h1 className="text-3xl font-bold text-slate-900">Edit Your Profile</h1>
          <p className="text-slate-600 mt-2 font-medium">Update your information, skills, and portfolio.</p>
        </div>

        {error && (
          <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-bold">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mx-8 mt-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            {successMsg}
          </div>
        )}

        <div className="px-8 py-8">
          
          <div className="mb-8">
            <label className="block text-sm font-bold text-slate-900 mb-4">Profile Picture</label>
            <div className="flex items-center gap-6">
              <div className="relative">
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-2 border-cyan-600 shadow-sm"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-50 to-cyan-100 flex items-center justify-center border border-cyan-200 shadow-sm">
                    <span className="text-3xl">👤</span>
                  </div>
                )}
              </div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
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

          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Personal Info</h2>

            {/* 🔴 التعديل هنا: خلينا الموبايل والسعر جنب بعض في الشاشات الكبيرة 🔴 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">WhatsApp Number</label>
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

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Inspection Visit Price (EGP)</label>
                <div className="relative">
                  <Wallet className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 font-mono tracking-wide"
                    placeholder="e.g. 150"
                  />
                </div>
              </div>
            </div>

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

          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Portfolio / Previous Work</h2>
            <p className="text-sm text-slate-500 mb-4">Upload pictures of your previous work to attract more customers.</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <label className="cursor-pointer aspect-square rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-cyan-400 transition-colors flex flex-col items-center justify-center gap-2 text-slate-500">
                <input
                  type="file"
                  accept="image/*"
                  multiple 
                  onChange={handlePortfolioUpload}
                  className="hidden"
                />
                <ImagePlus size={28} className="text-cyan-600" />
                <span className="text-xs font-bold">Add Photos</span>
              </label>

              {existingPortfolio.map((imgSrc, index) => (
                <div key={`existing-${index}`} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                  <img src={`https://localhost:7088${imgSrc}`} alt="Portfolio" className="w-full h-full object-cover" />
                  <button
                    type="button" 
                    onClick={() => removeExistingPortfolioImage(index)}
                    className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-none"
                  >
                    <X size={14} strokeWidth={3} />
                  </button>
                </div>
              ))}

              {portfolioFiles.map((portfolioObj, index) => (
                <div key={`new-${index}`} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                  <img src={portfolioObj.preview} alt="Portfolio" className="w-full h-full object-cover" />
                  <button
                    type="button" 
                    onClick={() => removeNewPortfolioImage(index)}
                    className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-none"
                  >
                    <X size={14} strokeWidth={3} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-100 mb-8"></div>

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

        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(`/provider/${providerId}`)}
            disabled={isSaving}
            className="px-6 py-3 text-slate-700 font-bold rounded-xl border border-slate-200 bg-white hover:bg-slate-100 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-3 flex items-center gap-2 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-700 disabled:bg-cyan-400 transition-colors cursor-pointer shadow-sm border-none"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}