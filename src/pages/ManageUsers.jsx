import { useState } from "react"
import {
  Search,
  ChevronDown,
  Download,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react"

const USERS = [
  {
    id: 1,
    name: "Sara Al-Mutairi",
    email: "sara.almutairi@email.com",
    avatar: "SA",
    role: "Customer",
    joinDate: "Jan 12, 2026",
    status: "Active",
  },
  {
    id: 2,
    name: "Khalid Hassan",
    email: "khalid.hassan@email.com",
    avatar: "KH",
    role: "Provider",
    joinDate: "Feb 03, 2026",
    status: "Active",
  },
  {
    id: 3,
    name: "Layla Ibrahim",
    email: "layla.ibrahim@email.com",
    avatar: "LI",
    role: "Customer",
    joinDate: "Feb 28, 2026",
    status: "Suspended",
  },
  {
    id: 4,
    name: "Omar Abdullah",
    email: "omar.abdullah@email.com",
    avatar: "OA",
    role: "Provider",
    joinDate: "Mar 15, 2026",
    status: "Active",
  },
  {
    id: 5,
    name: "Noura Saleh",
    email: "noura.saleh@email.com",
    avatar: "NS",
    role: "Customer",
    joinDate: "Apr 02, 2026",
    status: "Suspended",
  },
]

const ROLE_FILTERS = ["All Roles", "Customer", "Provider"]

export default function ManageUsers() {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("All Roles")
  const [filterOpen, setFilterOpen] = useState(false)

  const filtered = USERS.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === "All Roles" || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleEdit = (name) => {
    alert(`Editing user: ${name}`);
  }

  const handleDelete = (name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      alert(`User ${name} deleted.`);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
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
          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-cyan-700 border-none cursor-pointer">
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
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm font-medium text-slate-500">
                      No users found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => (
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
                            aria-label={`Edit ${user.name}`}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-cyan-50 hover:text-cyan-600 border-none bg-transparent cursor-pointer"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.name)}
                            aria-label={`Delete ${user.name}`}
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

          {/* Pagination */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row bg-slate-50/50">
            <p className="text-sm font-medium text-slate-500">
              Showing <span className="font-bold text-slate-700">{filtered.length}</span> of{" "}
              <span className="font-bold text-slate-700">{USERS.length}</span> users
            </p>
            <div className="flex items-center gap-1">
              <button className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50 disabled:opacity-50 cursor-pointer">
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <button className="h-8 w-8 rounded-lg bg-cyan-600 text-sm font-bold text-white border-none cursor-pointer">1</button>
              <button className="h-8 w-8 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-600 transition hover:bg-slate-50 cursor-pointer">
                2
              </button>
              <button className="h-8 w-8 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-600 transition hover:bg-slate-50 cursor-pointer">
                3
              </button>
              <button className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 cursor-pointer">
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}