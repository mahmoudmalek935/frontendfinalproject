import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Search, Wrench, Zap, Sparkles, PaintRoller, Hammer, Wind,
  Star, ShieldCheck, Award, Lock, ArrowRight, MousePointerClick,
  CalendarCheck, Smile, UserPlus, Briefcase, Wallet, MapPin, CheckCircle2
} from "lucide-react"

const services = [
  { icon: Wrench, title: "Plumbing", desc: "Leaks, installations, and pipe repairs by licensed plumbers." },
  { icon: Zap, title: "Electrical", desc: "Wiring, fixtures, and safe electrical troubleshooting." },
  { icon: Sparkles, title: "Cleaning", desc: "Deep home cleaning and regular maintenance services." },
  { icon: PaintRoller, title: "Painting", desc: "Interior and exterior painting with a flawless finish." },
  { icon: Hammer, title: "Carpentry", desc: "Custom woodwork, furniture fixes, and door repairs." },
  { icon: Wind, title: "AC Repair", desc: "Air conditioning installation, servicing, and cooling fixes." },
]

const providers = [
  { name: "Karim Hassan", specialty: "Certified Electrician", rating: "4.9", reviews: 218, image: "/provider-electrician.png" },
  { name: "Mostafa Ali", specialty: "Master Plumber", rating: "4.8", reviews: 174, image: "/provider-plumber.png" },
  { name: "Salma Ibrahim", specialty: "Cleaning Specialist", rating: "5.0", reviews: 302, image: "/provider-cleaner.png" },
]

const trust = [
  { icon: ShieldCheck, title: "Verified Professionals", desc: "We interview and vet every provider before they join our network." },
  { icon: Award, title: "Quality Guaranteed", desc: "Service protection and honest customer reviews on every job." },
  { icon: Lock, title: "Secure Payment", desc: "Pay safely only after the work is completed to your satisfaction." },
]

const customerSteps = [
  { icon: MousePointerClick, title: "Browse", desc: "Explore trusted experts by category and rating." },
  { icon: CalendarCheck, title: "Request", desc: "Book the service that fits your schedule and budget." },
  { icon: Smile, title: "Enjoy Service", desc: "Sit back while a verified pro handles the job." },
]

const providerSteps = [
  { icon: UserPlus, title: "Create Profile", desc: "Showcase your skills, experience, and certifications." },
  { icon: Briefcase, title: "Accept Jobs", desc: "Receive requests from nearby customers instantly." },
  { icon: Wallet, title: "Earn Money", desc: "Get paid securely for every completed service." },
]

export default function Home() {
  const [query, setQuery] = useState("")

  return (
    <div className="bg-slate-100 font-sans text-slate-800">
      
      {/* ===== Hero ===== */}
      <section id="home" className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-1.5 text-sm font-medium text-cyan-700">
              <MapPin className="h-4 w-4" /> Serving all in Egypt
            </span>
            <h1 className="mt-6 text-balance text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Expert Home Services, <span className="text-cyan-600">Seconds Away.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-slate-600">
              Connect with verified, top-rated professional experts for all your home maintenance needs in Egypt.
            </p>

            <div className="mx-auto mt-10 max-w-xl">
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg sm:flex-row sm:items-center sm:rounded-full">
                <div className="flex flex-1 items-center gap-2 px-3">
                  <Search className="h-5 w-5 shrink-0 text-slate-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    type="text"
                    placeholder="Search for Plumbing, Cleaning..."
                    className="w-full bg-transparent py-2.5 text-sm text-slate-800 placeholder:text-slate-400 border-none focus:outline-none focus:ring-0"
                  />
                </div>
                <button className="inline-flex cursor-pointer border-none items-center justify-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 sm:rounded-full">
                  Find Expert <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500">
                <span className="font-medium text-slate-600">Popular:</span>
                {["Plumbing", "AC Repair", "Cleaning", "Electrical"].map((tag) => (
                  <span key={tag} className="cursor-pointer rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-cyan-50 hover:text-cyan-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Services Grid ===== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Browse by Category</h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div key={service.title} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-cyan-200 hover:shadow-lg">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 transition-colors group-hover:bg-amber-50 group-hover:text-amber-500">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-900">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{service.desc}</p>
                <Link to="/providers" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-700 transition-colors group-hover:text-amber-500 decoration-none">
                  View Professionals <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            )
          })}
        </div>
      </section>

      {/* ===== Featured Providers ===== */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Top-Rated Providers</h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {providers.map((provider) => (
              <div key={provider.name} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg">
                <div className="relative">
                  <img src={provider.image} alt={provider.name} className="h-60 w-full object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Provider' }} />
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-slate-800 shadow">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" /> {provider.rating}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900">{provider.name}</h3>
                  <p className="mt-1 text-sm font-medium text-cyan-700">{provider.specialty}</p>
                  {/* تم تعديل اللينك هنا ليوجه لصفحة البروفايل */}
                  <Link to={`/provider/${provider.name.toLowerCase().replace(' ', '-')}`} className="mt-5 flex justify-center w-full rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 decoration-none">
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Trust Indicators ===== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {trust.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">How Baytak Works</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-4 py-1.5 text-sm font-semibold text-cyan-800">For Customers</span>
              <div className="mt-6 space-y-6">
                {customerSteps.map((step, i) => {
                  const Icon = step.icon
                  return (
                    <div key={step.title} className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-600 text-white"><Icon className="h-6 w-6" /></div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900">{i + 1}. {step.title}</h4>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-200 px-4 py-1.5 text-sm font-semibold text-amber-900">For Providers</span>
              <div className="mt-6 space-y-6">
                {providerSteps.map((step, i) => {
                  const Icon = step.icon
                  return (
                    <div key={step.title} className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white"><Icon className="h-6 w-6" /></div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900">{i + 1}. {step.title}</h4>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Provider Recruitment CTA ===== */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-cyan-700 px-6 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-left">
            <div className="max-w-2xl">
              <h2 className="text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Join Baytak's Professional Network.</h2>
              <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-cyan-50 lg:justify-start m-0 p-0 list-none">
                {["Free to join", "Flexible schedule", "Secure payouts"].map((perk) => (
                  <li key={perk} className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-amber-300" /> {perk}</li>
                ))}
              </ul>
            </div>
            <Link to="/register" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-amber-500 px-8 py-4 text-base font-bold text-white shadow-lg transition-colors hover:bg-amber-600 decoration-none">
              Join as Provider <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  )
}