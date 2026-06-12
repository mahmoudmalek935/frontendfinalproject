import { useState } from "react"
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Eye, 
  Star, 
  User, 
  Trash2,
  Wrench
} from "lucide-react"

const initialRequests = [
  {
    id: "#1024",
    date: "Oct 25, 2026",
    service: "Electrical Wiring Repair",
    provider: "Karim Hassan",
    status: "In Progress",
    paid: null,
  },
  {
    id: "#1025",
    date: "Oct 26, 2026",
    service: "Deep Home Cleaning",
    provider: "Searching for expert...",
    status: "Pending",
    paid: null,
  },
  {
    id: "#1010",
    date: "Oct 10, 2026",
    service: "Plumbing Fix",
    provider: "Mostafa Ali",
    status: "Completed",
    paid: "350 EGP",
  }
]

const FILTERS = ["All", "Pending", "In Progress", "Completed", "Cancelled"]

export default function MyRequests() {
  const [requests, setRequests] = useState(initialRequests)
  const [activeFilter, setActiveFilter] = useState("All")

  // حساب الإحصائيات
  const totalRequests = requests.length
  const pendingRequests = requests.filter(r => r.status === "Pending").length
  const completedRequests = requests.filter(r => r.status === "Completed").length

  // فلترة الطلبات
  const filteredRequests = requests.filter(req => {
    if (activeFilter === "All") return true
    return req.status === activeFilter
  })

  // الأكشنز (Actions)
  const handleViewDetails = (id) => {
    alert(`Redirecting to details page for order ${id}...`);
  }

  const handleCancel = (id) => {
    if (window.confirm(`Are you sure you want to cancel order ${id}?`)) {
      setRequests(prev => prev.map(req => 
        req.id === id ? { ...req, status: "Cancelled", provider: "Cancelled by user" } : req
      ))
    }
  }

  const handleRate = (id) => {
    const rating = window.prompt(`Rate the service for order ${id} (1 to 5 stars):`, "5");
    if (rating && !isNaN(rating) && rating >= 1 && rating <= 5) {
      alert(`Thank you! You rated order ${id} with ${rating} stars.`);
    } else if (rating) {
      alert("Please enter a valid number between 1 and 5.");
    }
  }

  // فنكشن عشان نجيب لون ونوع كل Status
  const getStatusStyle = (status) => {
    switch(status) {
      case "Pending":
        return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: <Clock className="w-4 h-4" /> }
      case "In Progress":
        return { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200", icon: <Wrench className="w-4 h-4" /> }
      case "Completed":
        return { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", icon: <CheckCircle2 className="w-4 h-4" /> }
      case "Cancelled":
        return { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", icon: <XCircle className="w-4 h-4" /> }
      default:
        return { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", icon: <AlertCircle className="w-4 h-4" /> }
    }
  }

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Service Requests</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">Track and manage your home service bookings.</p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <p className="text-sm font-bold text-slate-500 mb-2">Total Requests</p>
            <p className="text-3xl font-extrabold text-slate-900">{totalRequests}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <p className="text-sm font-bold text-amber-500 mb-2">Pending</p>
            <p className="text-3xl font-extrabold text-amber-600">{pendingRequests}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <p className="text-sm font-bold text-green-500 mb-2">Completed</p>
            <p className="text-3xl font-extrabold text-green-600">{completedRequests}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {FILTERS.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors border cursor-pointer ${
                activeFilter === filter 
                  ? "bg-cyan-600 text-white border-cyan-600 shadow-sm" 
                  : "bg-white text-slate-600 border-slate-200 hover:border-cyan-300"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Requests List */}
        <div className="flex flex-col gap-4">
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
              <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-lg font-bold text-slate-900">No requests found</p>
              <p className="text-sm text-slate-500 mt-1">You don't have any requests in this category.</p>
            </div>
          ) : (
            filteredRequests.map(req => {
              const statusStyle = getStatusStyle(req.status)
              
              return (
                <div key={req.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-shadow hover:shadow-md">
                  
                  {/* Card Header */}
                  <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
                    <div>
                      <p className="text-sm font-extrabold text-slate-900">Order {req.id}</p>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">Date: {req.date}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                      {statusStyle.icon}
                      {req.status}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="px-6 py-5">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">{req.service}</h3>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Provider</p>
                        <p className="text-sm font-bold text-slate-900">{req.provider}</p>
                      </div>
                    </div>

                    {req.paid && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-sm font-medium text-slate-500">
                          Total Paid: <span className="font-extrabold text-slate-900">{req.paid}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Card Footer (Actions) */}
                  <div className="px-6 py-4 bg-slate-50 flex flex-wrap gap-3 border-t border-slate-100">
                    <button 
                      onClick={() => handleViewDetails(req.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-xl text-sm font-bold hover:bg-cyan-700 transition-colors cursor-pointer border-none shadow-sm"
                    >
                      <Eye className="w-4 h-4" /> View Details
                    </button>

                    {/* أزرار حسب الحالة */}
                    {req.status === "Pending" && (
                      <button 
                        onClick={() => handleCancel(req.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white text-rose-600 border border-rose-200 rounded-xl text-sm font-bold hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" /> Cancel Request
                      </button>
                    )}

                    {req.status === "Completed" && (
                      <button 
                        onClick={() => handleRate(req.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white text-amber-600 border border-amber-200 rounded-xl text-sm font-bold hover:bg-amber-50 transition-colors cursor-pointer"
                      >
                        <Star className="w-4 h-4" /> Rate Service
                      </button>
                    )}
                  </div>

                </div>
              )
            })
          )}
        </div>

      </div>
    </div>
  )
}