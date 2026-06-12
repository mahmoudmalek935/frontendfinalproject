import { useParams, Link, useNavigate } from "react-router-dom"
import {
    ShieldCheck,
    MapPin,
    Star,
    Wrench,
    Lightbulb,
    Zap,
    Plug,
    Gauge,
    CheckCircle2,
    Wallet,
    BadgeCheck,
    Edit 
} from "lucide-react"

const skills = [
    { label: "Wiring", icon: Zap },
    { label: "Lighting Installation", icon: Lightbulb },
    { label: "Panel Upgrades", icon: Gauge },
    { label: "Smart Switches", icon: Plug },
    { label: "Troubleshooting", icon: Wrench },
]

const portfolio = [
    { src: "/images/work-1.png", alt: "Organized electrical panel and wiring installation" },
    { src: "/images/work-2.png", alt: "Recessed ceiling lighting in a living room" },
    { src: "/images/work-3.png", alt: "Installing a smart home wall switch panel" },
    { src: "/images/work-4.png", alt: "Outdoor garden lighting installation at dusk" },
]

const reviews = [
    {
        name: "Mona Adel",
        date: "2 weeks ago",
        text: "The provider rewired our entire kitchen and installed new lighting. Extremely professional, punctual, and left everything spotless. Highly recommend!",
    },
    {
        name: "Tarek Saleh",
        date: "1 month ago",
        text: "Fixed a tricky electrical fault that two other electricians couldn't solve. Fair pricing and excellent communication throughout. Will definitely book again.",
    },
]

function Stars({ count = 5 }) {
    return (
        <div className="flex items-center gap-0.5" aria-label={`${count} out of 5 stars`}>
            {Array.from({ length: count }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
            ))}
        </div>
    )
}

export default function ProviderProfile() {
    const { name } = useParams();
    const navigate = useNavigate();
    const displayName = name ? name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : "Mostafa Adel";

    // 🔴 اللوجيك الديناميكي: بنقرا نوع الحساب من المتصفح
    const userRole = localStorage.getItem("userRole");
    const isMyProfile = userRole === "provider"; 

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
                        {/* 🔴 رجعنا الصورة زي الأول بالظبط 🔴 */}
                        <img
                            src="/images/provider-karim.png"
                            alt={displayName}
                            className="w-32 h-32 rounded-full border-4 border-white -mt-16 ml-0 sm:ml-8 shadow-md object-cover bg-slate-200 relative z-10"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Pro' }}
                        />

                        <div className="flex-1 sm:pb-2">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 text-balance">
                                    {displayName}
                                </h1>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 border border-cyan-200 px-3 py-1 text-xs font-semibold text-cyan-700">
                                    <ShieldCheck className="w-4 h-4" />
                                    Verified Professional
                                </span>
                            </div>

                            <p className="mt-1 text-base font-medium text-cyan-600">Certified Electrician</p>

                            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
                                <span className="inline-flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    Egypt
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                    <span className="font-semibold text-slate-900">4.9</span>
                                    <span className="text-slate-500">(128 reviews)</span>
                                </span>
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
                            <p className="mt-3 text-slate-600 leading-relaxed">
                                With over 12 years of hands-on experience, I specialize in residential and
                                commercial electrical work. From full home rewiring to modern lighting
                                design and smart home installations, I take pride in delivering safe, clean, and
                                reliable work. Every job is backed by careful inspection and a commitment to your
                                satisfaction.
                            </p>
                        </article>

                        <article className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-slate-900">Skills &amp; Expertise</h2>
                            <div className="mt-4 flex flex-wrap gap-2.5">
                                {skills.map((skill) => (
                                    <span
                                        key={skill.label}
                                        className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-200 px-3.5 py-1.5 text-sm font-medium text-slate-700"
                                    >
                                        <skill.icon className="w-4 h-4 text-cyan-600" />
                                        {skill.label}
                                    </span>
                                ))}
                            </div>
                        </article>

                        <article className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-slate-900">Portfolio / Previous Work</h2>
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {portfolio.map((item) => (
                                    <div key={item.src} className="aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                                        <img
                                            src={item.src}
                                            alt={item.alt}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=Work' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </article>

                        <article className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-slate-900">Customer Reviews</h2>
                            <div className="mt-4 flex flex-col gap-5">
                                {reviews.map((review) => (
                                    <div key={review.name} className="border border-slate-200 rounded-xl p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-cyan-600 text-white flex items-center justify-center text-sm font-semibold">
                                                    {review.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">{review.name}</p>
                                                    <p className="text-xs text-slate-500">{review.date}</p>
                                                </div>
                                            </div>
                                            <Stars />
                                        </div>
                                        <p className="mt-3 text-sm text-slate-600 leading-relaxed">{review.text}</p>
                                    </div>
                                ))}
                            </div>
                        </article>
                    </div>

                    <aside className="lg:col-span-1">
                        <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                            <div className="flex items-baseline justify-between">
                                <span className="text-sm font-medium text-slate-600">Inspection Visit</span>
                                <span className="text-2xl font-bold text-slate-900">
                                    150 <span className="text-base font-semibold text-slate-500">EGP</span>
                                </span>
                            </div>

                            {/* 🔴 هنا الزرار بيتغير حسب نوع الحساب 🔴 */}
                            {isMyProfile ? (
                                <button
                                    type="button"
                                    onClick={() => navigate('/provider/edit')}
                                    className="flex items-center justify-center gap-2 bg-white border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-50 w-full py-3 rounded-xl font-bold text-lg mb-4 mt-5 transition-colors cursor-pointer shadow-sm"
                                >
                                    <Edit className="w-5 h-5" /> Edit Profile
                                </button>
                            ) : (
                                <Link to="/checkout" className="block w-full decoration-none">
                                    <button
                                        type="button"
                                        className="bg-cyan-600 hover:bg-cyan-700 text-white w-full py-3 rounded-xl font-bold text-lg mb-4 mt-5 transition-colors border-none cursor-pointer shadow-sm"
                                    >
                                        Request Service
                                    </button>
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