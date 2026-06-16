import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Wrench, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Loader2,
  FileText,
  Phone,
  X
} from "lucide-react"

export default function OrderDetails() {
  const { id } = useParams() 
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Modal State
  const [feedbackModal, setFeedbackModal] = useState({ isOpen: false, type: "", title: "", message: "", redirect: false })

  const showFeedback = (type, title, message, redirect = false) => {
    setFeedbackModal({ isOpen: true, type, title, message, redirect })
  }

  const closeFeedback = () => {
    const shouldRedirect = feedbackModal.redirect
    setFeedbackModal({ isOpen: false, type: "", title: "", message: "", redirect: false })
    if (shouldRedirect) {
      navigate('/my-requests')
    }
  }

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate('/login')
        return
      }

      try {
        const response = await fetch(`https://localhost:7088/api/Orders/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (response.ok) {
          const data = await response.json()
          setOrder(data)
        } else {
          showFeedback("error", "Order Not Found", "This order does not exist or you are not authorized to view it.", true)
        }
      } catch (error) {
        console.error("Error fetching order details:", error)
        showFeedback("error", "Connection Error", "Failed to load order details. Please check your internet.", true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [id, navigate])

  const getStatusStyle = (status) => {
    switch(status) {
      case "Pending": return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: <Clock className="w-4 h-4" /> }
      case "In Progress": return { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200", icon: <Wrench className="w-4 h-4" /> }
      case "Completed": return { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", icon: <CheckCircle2 className="w-4 h-4" /> }
      case "Cancelled": 
      case "Canceled": return { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", icon: <XCircle className="w-4 h-4" /> }
      default: return { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", icon: <AlertCircle className="w-4 h-4" /> }
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-10 h-10 text-cyan-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading order details...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="py-10 bg-slate-50 min-h-screen relative">
        {feedbackModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl animate-in zoom-in duration-200 border-2 border-red-100">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">{feedbackModal.title}</h3>
              <p className="mt-2 text-sm font-medium text-slate-500">{feedbackModal.message}</p>
              <button
                onClick={closeFeedback}
                className="mt-6 w-full rounded-xl bg-slate-100 py-3 font-bold text-slate-700 transition hover:bg-slate-200 border-none cursor-pointer"
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  const statusStyle = getStatusStyle(order.status)
  
  const orderPrice = Number(order.totalPrice || order.price || (order.provider ? order.provider.pricePerVisit : 0) || 0)
  const providerName = order.provider && order.provider.user ? order.provider.user.fullName : "Not Assigned"
  const providerPhone = order.provider ? (order.provider.whatsAppNumber || order.provider.user?.phoneNumber) : null

  // 🔴 دالة ذكية لعرض نص الصنايعي بناءً على كل الحالات الممكنة
  const getProviderDisplayText = () => {
    if (providerName !== "Not Assigned") return providerName;
    if (order.status === "Pending") return "Searching for the best expert near you...";
    if (order.status === "Cancelled" || order.status === "Canceled") return "Order cancelled before assignment.";
    return "No expert assigned.";
  }

  return (
    <div className="py-10 bg-slate-50 min-h-screen relative">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        
        <button 
          onClick={() => navigate('/my-requests')}
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Requests
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          
          <div className="px-6 py-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
            <div>
              <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider">Baytack Order System</span>
              <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Order #{order.id}</h1>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Placed on: {new Date(order.orderDate).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
              {statusStyle.icon}
              {order.status}
            </span>
          </div>

          <div className="px-6 py-6 space-y-6">
            
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Requested Service</h3>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl p-4">
                <Wrench className="w-5 h-5 text-cyan-600" />
                <span className="font-bold text-slate-900 text-lg">{order.service?.name || "General Home Service"}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Service Location</h3>
                <div className="flex items-start gap-2.5 text-slate-700">
                  <MapPin className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-relaxed">{order.district}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Problem / Notes</h3>
                <div className="flex items-start gap-2.5 text-slate-700">
                  <FileText className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-relaxed whitespace-pre-line">{order.notes}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Assigned Professional</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  {/* 🔴 النص بقى ديناميكي ومتوافق مع كل الحالات */}
                  <p className={`text-sm font-bold ${providerName === "Not Assigned" ? "text-slate-400 italic" : "text-slate-900"}`}>
                    {getProviderDisplayText()}
                  </p>
                  
                  {providerName !== "Not Assigned" && providerPhone && (
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-1">
                      <Phone className="w-3 h-3" /> {providerPhone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {order.attachments && order.attachments.length > 0 && (
              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Problem Photo</h3>
                <div className="relative max-w-md rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
                  <img 
                    src={`https://localhost:7088${order.attachments[0].imageUrl}`} 
                    alt="Problem attachment" 
                    className="w-full h-auto object-cover max-h-80"
                    onError={(e) => { e.target.style.display = 'none' }} 
                  />
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-xl mt-6">
              <span className="font-medium text-slate-300">Total Amount</span>
              <span className="text-xl font-extrabold">EGP {orderPrice}</span>
            </div>

          </div>
        </div>
      </div>

      {feedbackModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className={`w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl animate-in zoom-in duration-200 border-2 ${feedbackModal.type === "success" ? "border-green-100" : "border-red-100"}`}>
            <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${feedbackModal.type === "success" ? "bg-green-50" : "bg-red-50"}`}>
              {feedbackModal.type === "success" ? (
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600" />
              )}
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">{feedbackModal.title}</h3>
            <p className="mt-2 text-sm font-medium text-slate-500">
              {feedbackModal.message}
            </p>
            <button
              onClick={closeFeedback}
              className="mt-6 w-full rounded-xl bg-slate-100 py-3 font-bold text-slate-700 transition hover:bg-slate-200 border-none cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  )
}