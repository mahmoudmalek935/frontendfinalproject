import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search,
  ChevronDown,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  X,
  AlertTriangle,
  Ban
} from "lucide-react"

const ROLE_FILTERS = ["All Roles", "Customer", "Provider"]

export default function ManageUsers() {
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]) 
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("All Roles")
  const [filterOpen, setFilterOpen] = useState(false)
  
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6 

  // 🔴 States للمودال الشيك بدل الـ Alerts
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, userId: null, userName: "" })
  const [feedbackModal, setFeedbackModal] = useState({ isOpen: false, type: "", title: "", message: "" })

  const showFeedback = (type, title, message) => {
    setFeedbackModal({ isOpen: true, type, title, message })
  }

  // 1. جلب ودمج بيانات المستخدمين والصنايعية
  useEffect(() => {
    const fetchUsersAndProviders = async () => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const usersRes = await fetch("https://localhost:7088/api/Auth", { 
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!usersRes.ok) throw new Error("Failed to fetch users.");
        const usersData = await usersRes.json();

        const provRes = await fetch("https://localhost:7088/api/Providers/admin/all", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        let provData = [];
        if (provRes.ok) {
          provData = await provRes.json();
        }

        const formattedUsers = usersData.map(u => {
          let currentStatus = "Active";
          let providerId = null;

          if (u.role && u.role.toLowerCase() === "provider") {
            const matchedProvider = provData.find(p => p.userId === u.id);
            if (matchedProvider) {
              // 🔴 خلينا الحالة إما Active أو Inactive
              currentStatus = matchedProvider.isActive ? "Active" : "Inactive";
              providerId = matchedProvider.providerId;
            } else {
              currentStatus = "Profile Incomplete";
            }
          }

          return {
            id: u.id,
            providerId: providerId,
            name: u.fullName || "Unknown",
            email: u.email,
            avatar: u.fullName ? u.fullName.substring(0, 2).toUpperCase() : "U",
            role: u.role === "admin" ? "Admin" : u.role?.toLowerCase() === "provider" ? "Provider" : "Customer",
            joinDate: new Date(u.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: currentStatus
          };
        });

        // ترتيب الصنايعية اللي محتاجين تفعيل يظهروا الأول
        formattedUsers.sort((a, b) => (a.status === "Inactive" ? -1 : 1));

        setUsers(formattedUsers);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsersAndProviders();
  }, [navigate]);

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === "All Roles" || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  useEffect(() => {
    setCurrentPage(1)
  }, [search, roleFilter])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = filtered.slice(startIndex, startIndex + itemsPerPage)

  // 2. زرار التفعيل / الإلغاء (يعمل في صمت بدون إزعاج)
  const handleToggleStatus = async (providerId, currentStatus) => {
    const token = localStorage.getItem("token");
    const isActivating = currentStatus === "Inactive";

    // 🔴 تحديث الواجهة فوراً (Optimistic UI) لسرعة الاستجابة
    setUsers(prev => prev.map(u => 
        u.providerId === providerId ? { ...u, status: isActivating ? "Active" : "Inactive" } : u
    ));

    try {
      if (isActivating) {
        // تفعيل
        const res = await fetch(`https://localhost:7088/api/Providers/activate/${providerId}`, {
          method: 'PUT',
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to activate");
      } else {
        // تعطيل (بناءً على مسار مسح الصنايعي اللي بيخليه Inactive)
        const res = await fetch(`https://localhost:7088/api/Providers/${providerId}`, {
          method: 'DELETE',
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to deactivate");
      }
    } catch (error) {
      console.error("Toggle error:", error);
      // لو حصل خطأ في السيرفر، بنرجع حالة الزرار زي ما كانت ونظهرله خطأ
      setUsers(prev => prev.map(u => 
        u.providerId === providerId ? { ...u, status: currentStatus } : u
      ));
      showFeedback("error", "Action Failed", "Could not change the provider's status.");
    }
  }

  // 3. دوال الحذف باستخدام الـ Modal
  const initiateDelete = (id, name) => {
    setConfirmModal({ isOpen: true, userId: id, userName: name });
  }

  const executeDelete = async () => {
    const { userId, userName } = confirmModal;
    setConfirmModal({ isOpen: false, userId: null, userName: "" }); // قفل المودال فوراً
    
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`https://localhost:7088/api/Auth/${userId}`, {
        method: 'DELETE',
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        setUsers((prev) => prev.filter((user) => user.id !== userId));
        showFeedback("success", "User Deleted", `${userName} has been removed successfully.`);
      } else {
        showFeedback("error", "Deletion Failed", "Failed to delete the user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      showFeedback("error", "Network Error", "An error occurred while deleting.");
    }
  }

  // 4. دالة الإكسبورت
  const handleExport = () => {
    const headers = "ID,Name,Email,Role,Status,Join Date\n";
    const csvData = users.map(u => `${u.id},${u.name},${u.email},${u.role},${u.status},${u.joinDate}`).join("\n");
    const blob = new Blob([headers + csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Baytak_Users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10 relative">
      <div className="mx-auto max-w-6xl">
        
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
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
              <p className="text-sm text-slate-500 font-medium">Manage Baytak customers and providers</p>
            </div>
          </div>
          
          <button 
            onClick={handleExport}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-cyan-700 border-none cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Export Data
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
              placeholder="Search users by name or email..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setFilterOpen((o) => !o)}
              className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:w-48 cursor-pointer"
            >
              {roleFilter}
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${filterOpen ? "rotate-180" : ""}`} />
            </button>
            {filterOpen && (
              <div className="absolute right-0 z-10 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                {ROLE_FILTERS.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setRoleFilter(option)
                      setFilterOpen(false)
                    }}
                    className={`flex w-full items-center px-4 py-2.5 text-left text-sm transition hover:bg-slate-50 border-none cursor-pointer ${
                      roleFilter === option ? "font-bold text-cyan-600 bg-cyan-50/50" : "font-medium text-slate-700 bg-white"
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
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">User</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Role</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Join Date</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm font-medium text-slate-500">Loading users...</td>
                  </tr>
                ) : paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm font-medium text-slate-500">No users found.</td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <tr key={user.id} className="border-b border-slate-100 transition hover:bg-slate-50/60">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-sm font-bold text-cyan-700">
                            {user.avatar}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-900">{user.name}</p>
                            <p className="truncate text-xs font-medium text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                          user.role === "Provider" ? "bg-amber-100 text-amber-700" : user.role === "Admin" ? "bg-purple-100 text-purple-700" : "bg-cyan-50 text-cyan-700"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">{user.joinDate}</td>
                      <td className="px-6 py-4">
                        {user.status === "Active" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold bg-emerald-50 text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
                          </span>
                        )}
                        {user.status === "Inactive" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold bg-amber-50 text-amber-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Inactive
                          </span>
                        )}
                        {user.status === "Profile Incomplete" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold bg-slate-100 text-slate-600">
                            <AlertCircle className="w-3.5 h-3.5" /> Incomplete
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* 🔴 زرار التفعيل والتعطيل (صامت وسريع) 🔴 */}
                          {user.role === "Provider" && user.providerId && (
                            <button
                              onClick={() => handleToggleStatus(user.providerId, user.status)}
                              className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition border-none cursor-pointer ${
                                user.status === "Inactive" 
                                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" 
                                  : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                              }`}
                            >
                              {user.status === "Inactive" ? (
                                <><CheckCircle2 className="w-3.5 h-3.5" /> Activate</>
                              ) : (
                                <><Ban className="w-3.5 h-3.5" /> Deactivate</>
                              )}
                            </button>
                          )}

                          {/* زرار الحذف */}
                          <button
                            onClick={() => initiateDelete(user.id, user.name)}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 border-none bg-transparent cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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
                Showing <span className="font-bold text-slate-700">{paginatedUsers.length}</span> of <span className="font-bold text-slate-700">{filtered.length}</span> users
              </p>
              
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" /> Prev
                  </button>
                  
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`h-8 w-8 rounded-lg text-sm font-bold border cursor-pointer ${
                        currentPage === i + 1 
                          ? 'bg-cyan-600 text-white border-cyan-600' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ================= MODALS (بديل الـ ALERTS) ================= */}
      
      {/* 1. Confirm Delete Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl animate-in zoom-in duration-200 border-2 border-rose-100">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
              <AlertTriangle className="h-8 w-8 text-rose-500" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Delete User?</h3>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Are you sure you want to delete <span className="font-bold text-slate-800">{confirmModal.userName}</span>? This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setConfirmModal({ isOpen: false, userId: null, userName: "" })}
                className="flex-1 rounded-xl bg-slate-100 py-3 font-bold text-slate-700 transition hover:bg-slate-200 border-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="flex-1 rounded-xl bg-rose-600 py-3 font-bold text-white transition hover:bg-rose-700 border-none cursor-pointer shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Feedback Modal (نجاح أو خطأ عام) */}
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