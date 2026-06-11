import { useState } from "react"
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
  {
    id: 3,
    customer: "Salma Ibrahim",
    city: "Alexandria",
    district: "Smouha",
    service: "AC Maintenance",
    description: "Living room air conditioner is not cooling properly and makes a loud noise when turned on. Requesting a full check-up and cleaning.",
    date: "12 Jun 2026",
    time: "09:00 AM",
    urgency: "amber",
  },
  {
    id: 4,
    customer: "Omar Tarek",
    city: "Cairo",
    district: "Maadi",
    service: "Carpentry - Door Repair",
    description: "The main bedroom door is not closing properly and the hinge seems loose. Need it fixed and adjusted.",
    date: "12 Jun 2026",
    time: "03:45 PM",
    urgency: "green",
  },
]

export default function ProviderDashboard() {
  const [requests, setRequests] = useState(initialRequests)
  const [activeJobs, setActiveJobs] = useState(5)

  const handleAccept = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id))
    setActiveJobs((n) => n + 1)
  }

  const handleDecline = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id))
  }

  const stats = [
    {
      label: "Active Jobs",
      value: String(activeJobs),
      icon: Briefcase,
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-700",
    },
    {
      label: "Today's Earnings",
      value: "EGP 1,850",
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
    <div className="py-8 bg-slate-100 min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-balance text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            New Job Requests
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-slate-500 sm:text-base">
            Manage your incoming customer bookings.
          </p>
        </header>

        {/* Quick Stats */}
        <section aria-label="Quick statistics" className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${stat.iconBg}`}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="text-xl font-bold text-slate-900 sm:text-2xl">{stat.value}</p>
                </div>
              </div>
            )
          })}
        </section>

        {/* Main Content - Requests List */}
        <section aria-label="Incoming job requests" className="flex flex-col gap-5">
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                <Check className="h-7 w-7 text-cyan-600" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">All caught up!</h2>
              <p className="mt-1 text-sm text-slate-500">You have no pending job requests right now.</p>
            </div>
          ) : (
            requests.map((req) => (
              <article key={req.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                {/* Card Top */}
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-5 py-3">
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${req.urgency === "amber" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                    <span className="relative flex h-2 w-2">
                      <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${req.urgency === "amber" ? "bg-amber-500" : "bg-green-500"}`} />
                      <span className={`relative inline-flex h-2 w-2 rounded-full ${req.urgency === "amber" ? "bg-amber-500" : "bg-green-500"}`} />
                    </span>
                    New Request
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <Calendar className="h-4 w-4" aria-hidden="true" /> {req.date}
                    <span className="text-slate-300">|</span>
                    <Clock className="h-4 w-4" aria-hidden="true" /> {req.time}
                  </span>
                </div>

                {/* Card Body */}
                <div className="px-5 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-600 text-sm font-bold text-white">
                        {req.customer.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="flex items-center gap-1.5 text-base font-semibold text-slate-900">
                          <User className="h-4 w-4 text-slate-400" aria-hidden="true" /> {req.customer}
                        </p>
                        <p className="flex items-center gap-1.5 text-sm text-slate-500">
                          <MapPin className="h-4 w-4 text-slate-400" aria-hidden="true" /> {req.district}, {req.city}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-50 px-3 py-1.5 text-sm font-semibold text-cyan-700">
                      <Wrench className="h-4 w-4" aria-hidden="true" /> {req.service}
                    </span>
                  </div>

                  <div className="mt-4 flex items-start gap-2 rounded-lg bg-slate-50 p-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
                    <p className="text-sm leading-relaxed text-slate-600">{req.description}</p>
                  </div>
                </div>

                {/* Card Bottom Actions */}
                <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => handleAccept(req.id)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 border-none cursor-pointer"
                  >
                    <Check className="h-5 w-5" aria-hidden="true" /> Accept Job
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDecline(req.id)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 cursor-pointer"
                  >
                    <X className="h-5 w-5" aria-hidden="true" /> Decline
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  )
}