import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  User, Mail, Phone, ShieldCheck, FileText, 
  ArrowLeft, CheckCircle, XCircle, Loader2, Image as ImageIcon 
} from "lucide-react";

export default function ReviewProvider() {
  const { id } = useParams(); // سحب الـ ID من الـ URL
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [provider, setProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // 1. جلب بيانات الصنايعي التفصيلية من الباك إند
  useEffect(() => {
    const fetchProviderDetails = async () => {
      try {
        const response = await fetch(`https://localhost:7088/api/Providers/${id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to load provider details");
        const data = await response.json();
        setProvider(data);
      } catch (error) {
        setMessage({ type: "error", text: "Error loading provider data." });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProviderDetails();
  }, [id, token]);

  // 2. فك حظر / تفعيل الحساب (Approve)
  const handleApprove = async () => {
    setIsActionLoading(true);
    try {
      // 🔴 التعديل هنا: غيرنا المسار لـ activate عشان يطابق الباك إند بتاعك بالظبط
      const response = await fetch(`https://localhost:7088/api/Providers/activate/${id}`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        // تحديث الواجهة فوراً عشان يظهر إنه اتفعل
        setProvider(prev => ({ ...prev, isActive: true }));
        setMessage({ type: "success", text: "Provider verified and activated successfully! 🎉" });
        
        // بيرجعه لصفحة الإدارة بعد ثانيتين
        setTimeout(() => navigate("/manage-users"), 2000); 
      } else {
        throw new Error("Failed to approve");
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to activate provider account." });
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-cyan-600" /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <Link to="/manage-users" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 mb-6 decoration-none">
          <ArrowLeft className="w-4 h-4" /> Back to Users Management
        </Link>

        {/* Status Messages */}
        {message.text && (
          <div className={`p-4 rounded-xl mb-6 font-bold flex items-center gap-2 ${message.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"}`}>
            {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            {message.text}
          </div>
        )}

        {provider && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* Header / Profile Summary */}
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center gap-5">
              <img 
                src={provider.profilePicture ? `https://localhost:7088${provider.profilePicture}` : "https://via.placeholder.com/150"} 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover shadow-sm border-2 border-white"
                onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
              />
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-extrabold text-slate-900">{provider.fullName}</h1>
                <p className="text-sm font-bold text-cyan-600 mt-1">{provider.serviceName || "Service Provider"}</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold mt-2 ${provider.isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                  {provider.isActive ? "Active" : "Pending Verification"}
                </span>
              </div>
            </div>

            {/* Core Info Grid */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Contact Information</h2>
                <div className="space-y-3">
                  <p className="flex items-center gap-2.5 text-sm font-bold text-slate-700"><Phone className="w-4 h-4 text-slate-400" /> {provider.phone}</p>
                  <p className="flex items-center gap-2.5 text-sm font-bold text-slate-700"><Phone className="w-4 h-4 text-emerald-500" /> WhatsApp: {provider.whatsAppNumber || "N/A"}</p>
                  <p className="flex items-center gap-2.5 text-sm font-bold text-slate-700"><User className="w-4 h-4 text-slate-400" /> City: {provider.governorate || "N/A"}</p>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Professional Details</h2>
                <div className="space-y-3">
                  <p className="flex items-center gap-2.5 text-sm font-bold text-slate-700"><ShieldCheck className="w-4 h-4 text-slate-400" /> National ID: <span className="font-mono">{provider.nationalId || "N/A"}</span></p>
                  <p className="flex items-center gap-2.5 text-sm font-bold text-slate-700"><FileText className="w-4 h-4 text-slate-400" /> Visit Price: EGP {provider.price}</p>
                </div>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-bold text-slate-400 mb-2">Bio / Description</h3>
                <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3.5 font-medium border border-slate-100">{provider.bio || "No biography provided."}</p>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-bold text-slate-400 mb-2">Skills</h3>
                <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3.5 font-medium border border-slate-100">{provider.skills || "No skills specified."}</p>
              </div>
            </div>

            {/* Verification Documents (صورة البطاقة وش وضهر) */}
            <div className="p-6 bg-slate-50/50 border-b border-slate-100">
              <h2 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-cyan-600" /> Identity Verification Documents
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* ID Front */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-slate-500">National ID - Front Side</span>
                  <div className="aspect-[16/10] bg-slate-100 rounded-xl border border-slate-200 overflow-hidden relative shadow-sm">
                    <img 
                      src={provider.idFrontImage ? `https://localhost:7088${provider.idFrontImage}` : "https://via.placeholder.com/400x250?text=No+Front+Image"} 
                      alt="ID Front" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/400x250?text=No+Front+Image"; }}
                      onClick={() => window.open(provider.idFrontImage ? `https://localhost:7088${provider.idFrontImage}` : "", '_blank')} 
                    />
                  </div>
                </div>

                {/* ID Back */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-slate-500">National ID - Back Side</span>
                  <div className="aspect-[16/10] bg-slate-100 rounded-xl border border-slate-200 overflow-hidden relative shadow-sm">
                    <img 
                      src={provider.idBackImage ? `https://localhost:7088${provider.idBackImage}` : "https://via.placeholder.com/400x250?text=No+Back+Image"} 
                      alt="ID Back" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/400x250?text=No+Back+Image"; }}
                      onClick={() => window.open(provider.idBackImage ? `https://localhost:7088${provider.idBackImage}` : "", '_blank')}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons (أزرار التحكم) */}
            <div className="p-6 flex flex-col sm:flex-row gap-4 bg-slate-50">
              {!provider.isActive && (
                <button
                  type="button"
                  disabled={isActionLoading}
                  onClick={handleApprove}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700 border-none cursor-pointer shadow-sm disabled:opacity-70"
                >
                  {isActionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                  Approve & Activate Account
                </button>
              )}
              
              <button
                type="button"
                onClick={() => navigate("/manage-users")}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 cursor-pointer"
              >
                Back to List
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}