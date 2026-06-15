import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import {
    ShieldCheck,
    MapPin,
    Star,
    CheckCircle2,
    Wallet,
    BadgeCheck,
    Edit,
    Loader2,
    Phone,
    MessageCircle,
    ImageOff // 👈 ضفنا الأيقونة دي لو مفيش صور
} from "lucide-react"

const DefaultSkillIcon = CheckCircle2;

export default function ProviderProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const userRole = localStorage.getItem("role");

    const [providerData, setProviderData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const loggedInProviderId = localStorage.getItem("providerId");
    const isMyProfile = String(loggedInProviderId) === String(id);

    useEffect(() => {
        const fetchProviderData = async () => {
            try {
                const response = await fetch(`https://localhost:7088/api/providers/${id}`);
                if (!response.ok) {
                    throw new Error("لم يتم العثور على بيانات هذا الفني.");
                }
                const data = await response.json();
                setProviderData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProviderData();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <Loader2 className="w-10 h-10 animate-spin text-cyan-600" />
            </div>
        );
    }

    if (error || !providerData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 gap-4">
                <h2 className="text-2xl font-bold text-red-600">{error || "حدث خطأ ما"}</h2>
                <Link to="/providers" className="text-cyan-600 font-bold hover:underline">العودة لقائمة الفنيين</Link>
            </div>
        );
    }

    const providerSkills = providerData.skills
        ? providerData.skills.split(',').map(s => s.trim())
        : [];

    // 🔴 تجهيز صور معرض الأعمال (بنجيب المسارات من الداتا بيز ونقسمها)
    const portfolioImages = providerData.portfolioImages
        ? providerData.portfolioImages.split(',').filter(img => img.trim() !== "")
        : [];

    return (
        <div className="py-8 bg-slate-100 text-slate-900 min-h-screen">
            <section className="bg-white shadow-sm max-w-6xl mx-auto rounded-2xl overflow-hidden mb-8 border border-slate-200">
                <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-slate-200">
                    <img
                        src="/images/cover-banner.png"
                        alt="Cover"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/1200x400?text=Cover+Image' }}
                    />
                </div>

                <div className="px-6 pb-8">
                    <div className="flex flex-col sm:flex-row sm:items-end gap-6">
                        <img
                            src={providerData.profilePicture ? `https://localhost:7088${providerData.profilePicture}` : "/images/provider-karim.png"}
                            alt={providerData.fullName}
                            className="w-32 h-32 rounded-full border-4 border-white -mt-16 ml-0 sm:ml-8 shadow-md object-cover bg-slate-200 relative z-10"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Pro' }}
                        />

                        <div className="flex-1 sm:pb-2">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 text-balance">
                                    {providerData.fullName}
                                </h1>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 border border-cyan-200 px-3 py-1 text-xs font-semibold text-cyan-700">
                                    <ShieldCheck className="w-4 h-4" />
                                    Verified Professional
                                </span>
                            </div>

                            <p className="mt-1 text-base font-medium text-cyan-600">{providerData.serviceName}</p>

                            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-600">
                                <span className="inline-flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    {providerData.governorate}
                                </span>

                                <span className="inline-flex items-center gap-1.5">
                                    <Star className="w-4 h-4 text-amber-500 fill-amber-500 opacity-50" />
                                    {/* 🔴 التعديل هنا: هنقرأ من الداتا ونقرب لأقرب رقم عشري */}
                                    <span className="font-semibold text-slate-900">
                                        {providerData.rating ? providerData.rating.toFixed(1) : "0.0"}
                                    </span>
                                    {/* 🔴 اختياري: لو حابب تخفي (0 reviews) لحد ما نربط عدد التقييمات */}
                                    <span className="text-slate-500">(Reviews)</span>
                                </span>

                                {providerData.phone && providerData.phone !== "N/A" && (
                                    <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
                                        <Phone className="w-4 h-4 text-cyan-600" />
                                        {providerData.phone}
                                    </span>
                                )}

                                {providerData.whatsAppNumber && (
                                    <span className="inline-flex items-center gap-1.5 text-green-700 font-medium bg-green-50 px-2 py-1 rounded-md border border-green-200">
                                        <MessageCircle className="w-4 h-4 text-green-600" />
                                        {providerData.whatsAppNumber}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <article className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-slate-900">About Me</h2>
                            <p className="mt-3 text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {providerData.bio || "لا يوجد وصف حالياً."}
                            </p>
                        </article>

                        {providerSkills.length > 0 && (
                            <article className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                                <h2 className="text-lg font-bold text-slate-900">Skills &amp; Expertise</h2>
                                <div className="mt-4 flex flex-wrap gap-2.5">
                                    {providerSkills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-200 px-3.5 py-1.5 text-sm font-medium text-slate-700"
                                        >
                                            <DefaultSkillIcon className="w-4 h-4 text-cyan-600" />
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </article>
                        )}

                        <article className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-slate-900">Portfolio / Previous Work</h2>

                            {/* 🔴 عرض صور الشغل الحقيقية 🔴 */}
                            {portfolioImages.length > 0 ? (
                                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {portfolioImages.map((imgSrc, index) => (
                                        <div key={index} className="aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                                            <img
                                                src={`https://localhost:7088${imgSrc}`}
                                                alt={`Portfolio Work ${index + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=Work' }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-4 flex flex-col items-center justify-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    <ImageOff className="w-12 h-12 mb-2 opacity-50" />
                                    <p className="text-sm font-medium">No portfolio images uploaded yet.</p>
                                </div>
                            )}
                        </article>
                    </div>

                    <aside className="lg:col-span-1">
                        <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                            <div className="flex items-baseline justify-between">
                                <span className="text-sm font-medium text-slate-600">Inspection Visit</span>
                                <span className="text-2xl font-bold text-slate-900">
                                    {providerData.price} <span className="text-base font-semibold text-slate-500">EGP</span>
                                </span>
                            </div>

                            {isMyProfile ? (
                                <button
                                    type="button"
                                    onClick={() => navigate('/provider/edit')}
                                    className="flex items-center justify-center gap-2 bg-white border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-50 w-full py-3 rounded-xl font-bold text-lg mb-4 mt-5 transition-colors cursor-pointer shadow-sm"
                                >
                                    <Edit className="w-5 h-5" /> Edit Profile
                                </button>
                            ) : (

                                <Link to={`/checkout/${providerData.providerId}`} className="block w-full decoration-none">
                                    {userRole !== 'provider' && userRole !== 'admin' && (
                                        <button
                                            type="button"
                                            className="bg-cyan-600 hover:bg-cyan-700 text-white w-full py-3 rounded-xl font-bold text-lg mb-4 mt-5 transition-colors border-none cursor-pointer shadow-sm"
                                        >
                                            Request Service
                                        </button>
                                    )}
                                </Link>
                            )}

                            <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 mt-2">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                                </span>
                                <span className="text-sm font-semibold text-green-700">Available Today</span>
                            </div>

                            <div className="mt-6 border-t border-slate-200 pt-5 flex flex-col gap-4">
                                <div className="flex items-start gap-3">
                                    <Wallet className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Payment after completion</p>
                                        <p className="text-xs text-slate-500">Only pay once the job is done right.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <BadgeCheck className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Baytak Guarantee</p>
                                        <p className="text-xs text-slate-500">Every booking is fully protected.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Verified &amp; checked</p>
                                        <p className="text-xs text-slate-500">Identity confirmed by Baytak.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </div>
    )
}