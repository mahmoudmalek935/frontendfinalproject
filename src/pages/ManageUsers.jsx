import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search,
  ChevronDown,
  Download,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  ArrowLeft
} from "lucide-react"

// زودنا الداتا شوية عشان نجرب تقليب الصفحات
const initialUsers = [
  { id: 1, name: "Sara Al-Mutairi", email: "sara.almutairi@email.com", avatar: "SA", role: "Customer", joinDate: "Jan 12, 2026", status: "Active" },
  { id: 2, name: "Khalid Hassan", email: "khalid.hassan@email.com", avatar: "KH", role: "Provider", joinDate: "Feb 03, 2026", status: "Active" },
  { id: 3, name: "Layla Ibrahim", email: "layla.ibrahim@email.com", avatar: "LI", role: "Customer", joinDate: "Feb 28, 2026", status: "Suspended" },
  { id: 4, name: "Omar Abdullah", email: "omar.abdullah@email.com", avatar: "OA", role: "Provider", joinDate: "Mar 15, 2026", status: "Active" },
  { id: 5, name: "Noura Saleh", email: "noura.saleh@email.com", avatar: "NS", role: "Customer", joinDate: "Apr 02, 2026", status: "Suspended" },
  { id: 6, name: "Ali Mahmoud", email: "ali.m@email.com", avatar: "AM", role: "Provider", joinDate: "May 10, 2026", status: "Active" },
  { id: 7, name: "Hoda Ali", email: "hoda.ali@email.com", avatar: "HA", role: "Customer", joinDate: "May 15, 2026", status: "Active" },
]

const ROLE_FILTERS = ["All Roles", "Customer", "Provider"]

export default function ManageUsers() {
  const navigate = useNavigate();
  
  // 🔴 اللوجيك الجديد (State) 🔴
  const [users, setUsers] = useState(initialUsers) // الداتا بقت متغيرة عشان نقدر نمسح منها
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("All Roles")
  const [filterOpen, setFilterOpen] = useState(false)
  
  // متغيرات الصفحات (Pagination)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4 // هنعرض 4 في كل صفحة

  // فلترة الداتا
  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === "All Roles" || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  // لو عملنا سيرش أو فلتر، نرجع للصفحة الأولى أوتوماتيك
  useEffect(() => {
    setCurrentPage(1)
  }, [search, roleFilter])

  // حسابات الصفحات
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = filtered.slice(startIndex, startIndex + itemsPerPage)

  // فنكشن المسح
  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      setUsers((prev) => prev.filter((user) => user.id !== id))
    }
  }

  const handleEdit = (name) => {
    alert(`Editing user: ${name} (Will open edit modal in production)`);
  }

  // فنكشن تصدير البيانات (Export to CSV)
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
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
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
          {/* 🔴 زرار التصدير شغال 🔴 */}
          <button 
            onClick={handleExport}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-cyan-700 border-none cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Export Data
          </button>
        </div>

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
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm font-medium text-slate-500">
                      No users found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  // 🔴 بنعرض الداتا بتاعة الصفحة الحالية بس 🔴
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
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                            user.role === "Provider"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-cyan-50 text-cyan-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">{user.joinDate}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                            user.status === "Active"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              user.status === "Active" ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                          />
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(user.name)}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-cyan-50 hover:text-cyan-600 border-none bg-transparent cursor-pointer"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id, user.name)}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 border-none bg-transparent cursor-pointer"
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

          {/* 🔴 Pagination شغال بالكامل 🔴 */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row bg-slate-50/50">
            <p className="text-sm font-medium text-slate-500">
              Showing <span className="font-bold text-slate-700">{paginatedUsers.length}</span> of{" "}
              <span className="font-bold text-slate-700">{filtered.length}</span> users
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

        </div>
      </div>
    </main>
  )
}