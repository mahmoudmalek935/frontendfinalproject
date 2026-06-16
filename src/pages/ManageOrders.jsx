import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search,
  ChevronDown,
  Download,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  ArrowLeft,
  Loader2,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  X,
  MapPin,
  Calendar,
  Clock,
  User,
  Wrench
} from "lucide-react"

const STATUS_FILTERS = ["All Statuses", "Pending", "Accepted", "In Progress", "Completed", "Canceled"]

export default function ManageOrders() {
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [filterOpen, setFilterOpen] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // States للمودالز
  const [feedbackModal, setFeedbackModal] = useState({ isOpen: false, type: "", title: "", message: "" });
  const [cancelModal, setCancelModal] = useState({ isOpen: false, id: null });
  const [viewModal, setViewModal] = useState({ isOpen: false, order: null });

  const showFeedback = (type, title, message) => {
    setFeedbackModal({ isOpen: true, type, title, message });
  }

  // 1. جلب الأوردرات من الباك إند
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch("https://localhost:7088/api/Orders", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Failed to fetch orders.");

        const data = await response.json();
        
        const formattedOrders = data.map(order => {
          // حساب السعر الحقيقي للطلب
          const orderPrice = Number(order.totalPrice || order.price || (order.provider ? order.provider.pricePerVisit : 0) || 0);

          return {
            id: order.id,
            customerName: order.customer ? order.customer.fullName : `Customer #${order.customerId}`,
            // 🔴 جلب اسم الصنايعي بشكل سليم
            providerName: order.provider && order.provider.user ? order.provider.user.fullName : "Not Assigned",
            service: order.service ? order.service.name : "Unknown Service",
            district: order.district || "Not specified",
            notes: order.notes || "No notes provided.",
            date: new Date(order.orderDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            time: new Date(order.orderDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            status: order.status || "Pending",
            amount: `EGP ${orderPrice}`,
            urgency: order.urgency || "Normal"
          };
        });

        formattedOrders.sort((a, b) => b.id - a.id);
        setOrders(formattedOrders);
      } catch (err) {
        console.error(err);
        setError("Could not load orders from the server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // فلترة الداتا
  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.providerName.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toString().includes(search)
    const matchesStatus = statusFilter === "All Statuses" || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  useEffect(() => {
    setCurrentPage(1)
  }, [search, statusFilter])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOrders = filtered.slice(startIndex, startIndex + itemsPerPage)

  // 2. إلغاء الأوردر بالقوة (Force Cancel by Admin)
  const executeCancel = async () => {
    const { id } = cancelModal;
    setCancelModal({ isOpen: false, id: null }); 
    
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`https://localhost:7088/api/Orders/${id}`, {
        method: 'PUT',
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ Status: "Canceled" })
      });

      if (response.ok) {
        setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: "Canceled" } : o));
        showFeedback("success", "Order Canceled", `Order #${id} has been forcefully canceled.`);
      } else {
        showFeedback("error", "Action Failed", "Failed to cancel the order.");
      }
    } catch (error) {
      showFeedback("error", "Network Error", "Could not connect to the server.");
    }
  }

  // 3. تصدير البيانات CSV
  const handleExport = () => {
    const headers = "Order ID,Customer,Provider,Service,Amount,Status,Date\n";
    const csvData = orders.map(o => `${o.id},${o.customerName},${o.providerName},${o.service},${o.amount},${o.status},${o.date}`).join("\n");
    const blob = new Blob([headers + csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Baytak_Orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending": return "bg-amber-50 text-amber-700 border-amber-200";
      case "Accepted": 
      case "In Progress": return "bg-cyan-50 text-cyan-700 border-cyan-200";
      case "Completed": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Canceled": return "bg-rose-50 text-rose-700 border-rose-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10 relative">
      <div className="mx-auto max-w-7xl">
        
        <button 
          onClick={() => navigate('/admin')}
          className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-cyan-600 transition-colors bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-600 text-white shadow-sm">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Order Management</h1>
              <p className="text-sm text-slate-500 font-medium">Track and manage all service requests.</p>
            </div>
          </div>
          
          <button 
            onClick={handleExport}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-cyan-700 border-none cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Export Orders
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 flex items-center gap-3 text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {/* Top bar (Search & Filter) */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order ID, Customer, or Provider..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setFilterOpen((o) => !o)}
              className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:w-48 cursor-pointer"
            >
              {statusFilter}
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${filterOpen ? "rotate-180" : ""}`} />
            </button>
            {filterOpen && (
              <div className="absolute right-0 z-10 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                {STATUS_FILTERS.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setStatusFilter(option)
                      setFilterOpen(false)
                    }}
                    className={`flex w-full items-center px-4 py-2.5 text-left text-sm transition hover:bg-slate-50 border-none cursor-pointer ${
                      statusFilter === option ? "font-bold text-cyan-600 bg-cyan-50/50" : "font-medium text-slate-700 bg-white"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Order ID</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Customer</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Provider</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Service</th>
                  {/* 🔴 ضفنا عمود السعر هنا 🔴 */}
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
                        <p className="text-sm font-medium text-slate-500">Loading orders...</p>
                      </div>
                    </td>
                  </tr>
                ) : paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-sm font-medium text-slate-500">
                      No orders found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-100 transition hover:bg-slate-50/60">
                      <td className="px-6 py-4 font-bold text-slate-900">#{order.id}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900">{order.customerName}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{order.district}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-bold ${order.providerName === "Not Assigned" ? "bg-slate-100 text-slate-500 border border-slate-200" : "bg-cyan-50 text-cyan-700 border border-cyan-100"}`}>
                          {order.providerName === "Not Assigned" ? <Clock className="w-3 h-3" /> : <User className="w-3 h-3" />}
                          {order.providerName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900">{order.service}</p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{order.date}</p>
                      </td>
                      {/* 🔴 عرض السعر في الجدول 🔴 */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-extrabold text-slate-900">{order.amount}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewModal({ isOpen: true, order })}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-cyan-50 hover:text-cyan-600 border-none bg-transparent cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          {/* الإدمن يقدر يلغي الأوردر لو لسه شغال */}
                          {order.status !== "Completed" && order.status !== "Canceled" && (
                            <button
                              onClick={() => setCancelModal({ isOpen: true, id: order.id })}
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 border-none bg-transparent cursor-pointer"
                              title="Force Cancel Order"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && filtered.length > 0 && (
            <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row bg-slate-50/50">
              <p className="text-sm font-medium text-slate-500">
                Showing <span className="font-bold text-slate-700">{paginatedOrders.length}</span> of <span className="font-bold text-slate-700">{filtered.length}</span> orders
              </p>
              
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" /> Prev
                  </button>
                  
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`h-8 w-8 rounded-lg text-sm font-bold border cursor-pointer ${
                        currentPage === i + 1 ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {/* 1. View Order Details Modal */}
      {viewModal.isOpen && viewModal.order && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl animate-in zoom-in duration-200 relative overflow-hidden">
            <button onClick={() => setViewModal({ isOpen: false, order: null })} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer">
              <X className="h-6 w-6" />
            </button>
            
            <div className="mb-6 border-b border-slate-100 pb-4">
              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold mb-3 ${getStatusBadge(viewModal.order.status)}`}>
                {viewModal.order.status}
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900">Order #{viewModal.order.id}</h3>
              <p className="text-sm font-medium text-slate-500 flex items-center gap-2 mt-2">
                <Calendar className="w-4 h-4" /> {viewModal.order.date} <span className="text-slate-300">|</span> <Clock className="w-4 h-4" /> {viewModal.order.time}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center"><User className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Customer</p>
                  <p className="text-sm font-bold text-slate-900">{viewModal.order.customerName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center"><Wrench className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Provider & Service</p>
                  <p className="text-sm font-bold text-slate-900">{viewModal.order.providerName} • {viewModal.order.service}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="w-10 h-10 shrink-0 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><MapPin className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Location & Notes</p>
                  <p className="text-sm font-bold text-slate-900">{viewModal.order.district}</p>
                  <p className="text-sm text-slate-600 mt-1">{viewModal.order.notes}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-xl">
              <span className="font-medium text-slate-300">Total Amount</span>
              <span className="text-xl font-extrabold">{viewModal.order.amount}</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Confirm Force Cancel Modal */}
      {cancelModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl animate-in zoom-in duration-200 border-2 border-rose-100">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
              <AlertTriangle className="h-8 w-8 text-rose-500" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Force Cancel Order?</h3>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Are you sure you want to cancel order <span className="font-bold text-slate-800">#{cancelModal.id}</span>? This will stop any ongoing progress.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setCancelModal({ isOpen: false, id: null })}
                className="flex-1 rounded-xl bg-slate-100 py-3 font-bold text-slate-700 transition hover:bg-slate-200 border-none cursor-pointer"
              >
                Keep It
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

      {/* 3. Feedback Modal */}
      {feedbackModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className={`w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl animate-in zoom-in duration-200 border-2 ${feedbackModal.type === "success" ? "border-green-100" : "border-red-100"}`}>
            <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${feedbackModal.type === "success" ? "bg-green-50" : "bg-red-50"}`}>
              {feedbackModal.type === "success" ? (
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              ) : (
                <X className="h-8 w-8 text-red-600" />
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

    </main>
  )
}