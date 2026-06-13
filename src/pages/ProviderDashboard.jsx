import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Briefcase,
  Wallet,
  Clock,
  MapPin,
  Wrench,
  Calendar,
  Check,
  X,
  User,
  AlertCircle,
  Star,
  Edit,
  ClipboardList,
  CheckCircle2,
  PlayCircle
} from "lucide-react"

const initialRequests = [
  {
    id: 1,
    customer: "Mona Adel",
    city: "Cairo",
    district: "Nasr City",
    service: "Electrical Fault Repair",
    description: "Lights in the kitchen are flickering and one socket stopped working entirely. Need someone to check the wiring as soon as possible.",
    date: "11 Jun 2026",
    time: "10:30 AM",
    urgency: "amber",
  },
  {
    id: 2,
    customer: "Karim Hassan",
    city: "Giza",
    district: "Dokki",
    service: "Plumbing - Leak Fix",
    description: "Water is leaking from under the bathroom sink and the floor is getting wet. Looking for an urgent visit today.",
    date: "11 Jun 2026",
    time: "01:15 PM",
    urgency: "green",
  },
]

// داتا وهمية لسجل الشغل (History)
const initialCompletedJobs = [
  {
    id: 101,
    customer: "Ahmed Tarek",
    service: "AC Maintenance",
    date: "05 Jun 2026",
    amount: "450 EGP",
    rating: 5,
  },
  {
    id: 102,
    customer: "Sara Ibrahim",
    service: "Lighting Installation",
    date: "02 Jun 2026",
    amount: "300 EGP",
    rating: 4,
  },
]

export default function ProviderDashboard() {
  // 🔴 States جديدة عشان الحركة تبقى ديناميكية 🔴
  const [requests, setRequests] = useState(initialRequests)
  const [activeJobs, setActiveJobs] = useState([]) // الشغلانات النشطة
  const [history, setHistory] = useState(initialCompletedJobs) // السجل
  const [activeTab, setActiveTab] = useState("requests") 

  // 1. قبول الطلب (بينقله من الجديد للنشط)
  const handleAccept = (id) => {
    const jobToAccept = requests.find((r) => r.id === id);
    if (jobToAccept) {
      setActiveJobs((prev) => [...prev, jobToAccept]);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      setActiveTab("active"); // ينقله تلقائي لتاب الشغل النشط
    }
  }

  // 2. رفض الطلب الجديد
  const handleDecline = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id))
  }

  // 3. إنهاء الشغلانة النشطة (بينقلها للسجل)
  const handleCompleteJob = (id) => {
    const jobToComplete = activeJobs.find((j) => j.id === id);
    if (jobToComplete) {
      const newHistoryItem = {
        id: jobToComplete.id,
        customer: jobToComplete.customer,
        service: jobToComplete.service,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        amount: "Pending", // السعر هيتحدد لاحقاً
        rating: 0, // لسه متقيمش
      };
      setHistory((prev) => [newHistoryItem, ...prev]);
      setActiveJobs((prev) => prev.filter((j) => j.id !== id));
      setActiveTab("history"); // ينقله تلقائي للسجل
    }
  }

  // 4. إلغاء شغلانة نشطة
  const handleCancelActiveJob = (id) => {
    if(window.confirm("Are you sure you want to cancel this active job? The customer will be notified.")){
        setActiveJobs((prev) => prev.filter((j) => j.id !== id));
    }
  }

  const stats = [
    {
      label: "Active Jobs",
      value: String(activeJobs.length), // بيقرا العدد الحقيقي دلوقتي
      icon: Briefcase,
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-700",
    },
    {
      label: "Total Earnings",
      value: "EGP 1,950",
      icon: Wallet,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      label: "Pending Requests",
      value: String(requests.length),
      icon: Clock,
      iconBg: "bg-slate-200",
      iconColor: "text-slate-700",
    },
  ]

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Header with Edit Profile Button */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-balance text-3xl font-extrabold tracking-tight text-slate-900">
              Provider Dashboard
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Manage your incoming bookings and track your history.
            </p>
          </div>
          <Link to="/provider/edit" className="inline-flex items-center gap-2 bg-white border border-cyan-600 text-cyan-700 px-4 py-2.5 rounded-xl font-bold shadow-sm hover:bg-cyan-50 transition-colors decoration-none">
            <Edit className="w-5 h-5" />
            Edit Profile
          </Link>
        </header>

        {/* Quick Stats */}
        <section aria-label="Quick statistics" className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.iconBg}`}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-500">{stat.label}</p>
                  <p className="text-xl font-extrabold text-slate-900 sm:text-2xl">{stat.value}</p>
                </div>
              </div>
            )
          })}
        </section>

        {/* 🔴 Tabs Navigation (ضفنا التاب التالت) 🔴 */}
        <div className="flex gap-2 border-b border-slate-200 mb-6 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex whitespace-nowrap items-center gap-2 px-4 py-3 font-bold text-sm border-b-2 transition-colors border-none cursor-pointer bg-transparent ${
              activeTab === "requests"
                ? "border-cyan-600 text-cyan-700 border-b-cyan-600 border-solid"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            New Requests
            {requests.length > 0 && (
              <span className="bg-amber-100 text-amber-700 py-0.5 px-2 rounded-full text-xs ml-1">{requests.length}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`flex whitespace-nowrap items-center gap-2 px-4 py-3 font-bold text-sm border-b-2 transition-colors border-none cursor-pointer bg-transparent ${
              activeTab === "active"
                ? "border-cyan-600 text-cyan-700 border-b-cyan-600 border-solid"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            Active Jobs
            {activeJobs.length > 0 && (
              <span className="bg-cyan-100 text-cyan-700 py-0.5 px-2 rounded-full text-xs ml-1">{activeJobs.length}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex whitespace-nowrap items-center gap-2 px-4 py-3 font-bold text-sm border-b-2 transition-colors border-none cursor-pointer bg-transparent ${
              activeTab === "history"
                ? "border-cyan-600 text-cyan-700 border-b-cyan-600 border-solid"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Job History
          </button>
        </div>

        {/* Main Content Area based on Active Tab */}
        
        {/* ---------------- TAB 1: NEW REQUESTS ---------------- */}
        {activeTab === "requests" && (
          <section className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {requests.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white px-6 py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
                  <Check className="h-8 w-8 text-cyan-600" aria-hidden="true" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">All caught up!</h2>
                <p className="mt-2 text-sm text-slate-500 font-medium">You have no pending job requests right now.</p>
              </div>
            ) : (
              requests.map((req) => (
                <article key={req.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-6 py-3.5">
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${req.urgency === "amber" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                      <span className="relative flex h-2 w-2">
                        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${req.urgency === "amber" ? "bg-amber-500" : "bg-green-500"}`} />
                        <span className={`relative inline-flex h-2 w-2 rounded-full ${req.urgency === "amber" ? "bg-amber-500" : "bg-green-500"}`} />
                      </span>
                      New Request
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      <Calendar className="h-4 w-4" /> {req.date}
                      <span className="text-slate-300 mx-1">|</span>
                      <Clock className="h-4 w-4" /> {req.time}
                    </span>
                  </div>

                  <div className="px-6 py-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-600 text-lg font-bold text-white shadow-sm">
                          {req.customer.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="flex items-center gap-1.5 text-lg font-bold text-slate-900">
                            <User className="h-4 w-4 text-slate-400" /> {req.customer}
                          </p>
                          <p className="flex items-center gap-1.5 text-sm font-medium text-slate-500 mt-1">
                            <MapPin className="h-4 w-4 text-slate-400" /> {req.district}, {req.city}
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 border border-slate-200 px-3.5 py-1.5 text-sm font-bold text-slate-700">
                        <Wrench className="h-4 w-4 text-cyan-600" /> {req.service}
                      </span>
                    </div>

                    <div className="mt-5 flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-100 p-4">
                      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                      <p className="text-sm font-medium leading-relaxed text-slate-700">{req.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row bg-slate-50">
                    <button
                      type="button"
                      onClick={() => handleAccept(req.id)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-cyan-700 border-none cursor-pointer shadow-sm"
                    >
                      <Check className="h-5 w-5" /> Accept Job
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDecline(req.id)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-red-100 bg-white px-4 py-3 text-sm font-bold text-red-600 transition-colors hover:bg-red-50 hover:border-red-200 cursor-pointer"
                    >
                      <X className="h-5 w-5" /> Decline
                    </button>
                  </div>
                </article>
              ))
            )}
          </section>
        )}

        {/* ---------------- TAB 2: ACTIVE JOBS (التاب الجديد) ---------------- */}
        {activeTab === "active" && (
          <section className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {activeJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white px-6 py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
                  <Briefcase className="h-8 w-8 text-cyan-600" aria-hidden="true" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">No Active Jobs</h2>
                <p className="mt-2 text-sm text-slate-500 font-medium">Accept a request to start working on a job.</p>
              </div>
            ) : (
              activeJobs.map((job) => (
                <article key={job.id} className="overflow-hidden rounded-2xl border border-cyan-200 bg-white shadow-sm transition-shadow hover:shadow-md ring-1 ring-cyan-600/5">
                  <div className="flex items-center justify-between gap-3 border-b border-cyan-100 bg-cyan-50 px-6 py-3.5">
                    <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold bg-cyan-100 text-cyan-700">
                      <PlayCircle className="w-3.5 h-3.5" /> In Progress
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-700">
                      <Calendar className="h-4 w-4" /> {job.date}
                    </span>
                  </div>

                  <div className="px-6 py-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-600 text-lg font-bold text-white shadow-sm">
                          {job.customer.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="flex items-center gap-1.5 text-lg font-bold text-slate-900">
                            <User className="h-4 w-4 text-slate-400" /> {job.customer}
                          </p>
                          <p className="flex items-center gap-1.5 text-sm font-medium text-slate-500 mt-1">
                            <MapPin className="h-4 w-4 text-slate-400" /> {job.district}, {job.city}
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 border border-slate-200 px-3.5 py-1.5 text-sm font-bold text-slate-700">
                        <Wrench className="h-4 w-4 text-cyan-600" /> {job.service}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row bg-slate-50">
                    <button
                      type="button"
                      onClick={() => handleCompleteJob(job.id)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-green-700 border-none cursor-pointer shadow-sm"
                    >
                      <CheckCircle2 className="h-5 w-5" /> Mark as Completed
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCancelActiveJob(job.id)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:border-slate-300 cursor-pointer"
                    >
                      <X className="h-5 w-5" /> Cancel Job
                    </button>
                  </div>
                </article>
              ))
            )}
          </section>
        )}

        {/* ---------------- TAB 3: JOB HISTORY ---------------- */}
        {activeTab === "history" && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50">
                <h2 className="text-lg font-bold text-slate-900">Completed Jobs</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Review your past work and earnings.</p>
              </div>
              
              <div className="divide-y divide-slate-100">
                {history.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 font-medium">No completed jobs yet.</div>
                ) : (
                    history.map((job) => (
                    <div key={job.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">{job.service}</h3>
                            <p className="text-sm font-medium text-slate-500 flex items-center gap-2 mt-1">
                            <User className="w-4 h-4" /> {job.customer}
                            <span className="text-slate-300">|</span>
                            <Calendar className="w-4 h-4" /> {job.date}
                            </p>
                        </div>
                        </div>
                        
                        <div className="flex flex-col sm:items-end gap-2">
                        <span className="text-lg font-extrabold text-slate-900">{job.amount}</span>
                        <div className="flex items-center gap-0.5">
                            {job.rating > 0 ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${i < job.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} 
                                />
                                ))
                            ) : (
                                <span className="text-xs text-slate-400 font-medium">Pending Rating</span>
                            )}
                        </div>
                        </div>
                    </div>
                    ))
                )}
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  )
}