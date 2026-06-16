import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Eye,
  Star,
  User,
  Trash2,
  Wrench,
  Loader2,
  X,
  AlertTriangle,
  Phone // 🔴 ضفنا أيقونة التليفون
} from "lucide-react"

const FILTERS = ["All", "Pending", "In Progress", "Completed", "Cancelled"]

export default function MyRequests() {
  const [requests, setRequests] = useState([])
  const [activeFilter, setActiveFilter] = useState("All")
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // حالات الـ Modal الخاص بالتقييم
  const [isRateModalOpen, setIsRateModalOpen] = useState(false)
  const [orderToRate, setOrderToRate] = useState(null)
  const [ratingValue, setRatingValue] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  // حالات الـ Modals (تأكيد الإلغاء، النجاح، والخطأ)
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, orderId: null })
  const [feedbackModal, setFeedbackModal] = useState({ isOpen: false, type: "", title: "", message: "" })

  // 1. جلب الطلبات من الباك إند
  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('https://localhost:7088/api/Orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        const formattedData = data.map(order => {
          // 🔴 سحب اسم الصنايعي ورقم تليفونه من الداتا بيز
          const providerName = order.provider && order.provider.user ? order.provider.user.fullName : "Not Assigned";
          const providerPhone = order.provider ? (order.provider.whatsAppNumber || order.provider.user?.phoneNumber) : null;

          return {
            id: order.id,
            date: new Date(order.orderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            service: order.service?.name || "General Service",
            providerName: providerName, // 🔴 الاسم
            providerPhone: providerPhone, // 🔴 التليفون
            status: order.status,
            paid: null
          }
        });
        
        // نعرض أحدث الأوردرات فوق
        formattedData.sort((a, b) => b.id - a.id);
        setRequests(formattedData);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      showFeedback("error", "Connection Error", "Failed to load your requests. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // حساب الإحصائيات والفلترة
  const totalRequests = requests.length
  const pendingRequests = requests.filter(r => r.status === "Pending").length
  const completedRequests = requests.filter(r => r.status === "Completed").length

  const filteredRequests = requests.filter(req => {
    if (activeFilter === "All") return true
    return req.status === activeFilter
  })

  // دالة عرض رسائل النجاح والخطأ
  const showFeedback = (type, title, message) => {
    setFeedbackModal({ isOpen: true, type, title, message })
  }

  // الأكشنز
  const handleViewDetails = (id) => {
    navigate(`/order-details/${id}`);
  }

  // فتح نافذة تأكيد الإلغاء
  const initiateCancel = (id) => {
    setConfirmModal({ isOpen: true, orderId: id })
  }

  // تنفيذ الإلغاء الفعلي بعد تأكيد العميل
  const executeCancel = async () => {
    const id = confirmModal.orderId;
    setConfirmModal({ isOpen: false, orderId: null }); 
    
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`https://localhost:7088/api/Orders/${id}`, {
        method: 'DELETE', // أو PUT حسب ما إنت ضابط مسار الـ Cancel في الباك إند
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setRequests(prev => prev.map(req =>
          req.id === id ? { ...req, status: "Cancelled", providerName: req.providerName } : req
        ));
        showFeedback("success", "Request Cancelled", `Order #${id} has been cancelled successfully.`);
      } else {
        const err = await response.text();
        showFeedback("error", "Action Failed", err || "Failed to cancel the order.");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      showFeedback("error", "Network Error", "Could not connect to the server.");
    }
  }

  // دوال التقييم
  const openRateModal = (id) => {
    setOrderToRate(id);
    setRatingValue(5);
    setComment("");
    setIsRateModalOpen(true);
  }

  const closeRateModal = () => {
    setIsRateModalOpen(false);
    setOrderToRate(null);
  }

  const submitRating = async () => {
    setIsSubmittingReview(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch('https://localhost:7088/api/Reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId: orderToRate,
          ratingValue: ratingValue,
          comment: comment
        })
      });

      if (response.ok) {
        closeRateModal();
        showFeedback("success", "Thank You!", "Your review has been submitted successfully and added to the provider's profile.");
      } else {
        const errorData = await response.json();
        closeRateModal();
        showFeedback("error", "Submission Failed", errorData.message || "Failed to submit review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      closeRateModal();
      showFeedback("error", "Network Error", "An error occurred while sending your review. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  }

  // فنكشن الألوان للحالات
  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending": return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: <Clock className="w-4 h-4" /> }
      case "In Progress": return { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200", icon: <Wrench className="w-4 h-4" /> }
      case "Completed": return { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", icon: <CheckCircle2 className="w-4 h-4" /> }
      case "Cancelled": return { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", icon: <XCircle className="w-4 h-4" /> }
      default: return { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", icon: <AlertCircle className="w-4 h-4" /> }
    }
  }

  return (
    <div className="py-8 bg-slate-50 min-h-screen relative">
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
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors border cursor-pointer ${activeFilter === filter
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-10 h-10 text-cyan-600 animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Loading your requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
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
                      <p className="text-sm font-extrabold text-slate-900">Order #{req.id}</p>
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
                        
                        {/* 🔴 عرض اسم الصنايعي أو رسالة البحث */}
                        <p className={`text-sm font-bold ${req.providerName === "Not Assigned" ? "text-slate-400 italic" : "text-slate-900"}`}>
                          {req.providerName === "Not Assigned" ? "Searching for expert..." : req.providerName}
                        </p>
                        
                        {/* 🔴 عرض رقم التليفون لو الصنايعي موجود */}
                        {req.providerName !== "Not Assigned" && req.providerPhone && (
                          <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3" /> {req.providerPhone}
                          </p>
                        )}
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

                    {req.status === "Pending" && (
                      <button
                        onClick={() => initiateCancel(req.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white text-rose-600 border border-rose-200 rounded-xl text-sm font-bold hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" /> Cancel Request
                      </button>
                    )}

                    {req.status === "Completed" && (
                      <button
                        onClick={() => openRateModal(req.id)}
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

      {/* =========================================
          MODALS SECTION 
      ========================================= */}

      {/* 1. Modal تأكيد الإلغاء */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl animate-in zoom-in duration-200 border-2 border-rose-100">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
              <AlertTriangle className="h-8 w-8 text-rose-500" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Cancel Request?</h3>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Are you sure you want to cancel order #{confirmModal.orderId}? This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setConfirmModal({ isOpen: false, orderId: null })}
                className="flex-1 rounded-xl bg-slate-100 py-3 font-bold text-slate-700 transition hover:bg-slate-200 border-none cursor-pointer"
              >
                No, Keep it
              </button>
              <button
                onClick={executeCancel}
                className="flex-1 rounded-xl bg-rose-600 py-3 font-bold text-white transition hover:bg-rose-700 border-none cursor-pointer shadow-sm"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal النجاح والخطأ العام (Feedback Modal) */}
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
              onClick={() => setFeedbackModal({ isOpen: false, type: "", title: "", message: "" })}
              className="mt-6 w-full rounded-xl bg-slate-100 py-3 font-bold text-slate-700 transition hover:bg-slate-200 border-none cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 3. Modal التقييم */}
      {isRateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl relative animate-in fade-in zoom-in duration-200 border-2 border-amber-100">

            <button
              onClick={closeRateModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer bg-transparent border-none"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <h3 className="text-xl font-extrabold text-slate-900">Rate Your Experience</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">Order #{orderToRate}</p>
            </div>

            {/* تفاعل النجوم */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  onClick={() => setRatingValue(star)}
                  className={`w-10 h-10 cursor-pointer transition-colors ${star <= ratingValue
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-200 hover:text-amber-200"
                    }`}
                />
              ))}
            </div>

            {/* خانة التعليق */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Leave a comment (Optional)
              </label>
              <textarea
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was the service?"
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              ></textarea>
            </div>

            {/* زر الإرسال */}
            <button
              onClick={submitRating}
              disabled={isSubmittingReview}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 font-bold text-white transition hover:bg-amber-600 border-none cursor-pointer disabled:opacity-70 shadow-sm"
            >
              {isSubmittingReview ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Review"}
            </button>

          </div>
        </div>
      )}
    </div>
  )
}