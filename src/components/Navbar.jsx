import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from '../assets/logo.jpeg' 
import { Menu, X, User, Briefcase, ShieldAlert } from "lucide-react" // ضفنا أيقونة Shield للـ Admin

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Providers Directory", href: "/providers" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate(0)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* اللوجو */}
        <Link to="/" className="flex items-center gap-2 decoration-none">
          <img src={logo} alt="Baytak logo" className="h-10 w-auto object-contain" />
        </Link>

        {/* اللينكات الأساسية */}
        <ul className="hidden items-center gap-8 lg:flex m-0 p-0 list-none">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link to={link.href} className="text-sm font-medium text-slate-600 transition-colors hover:text-cyan-700 decoration-none">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* زراير الدخول واللوحات */}
        <div className="hidden items-center gap-4 lg:flex">
          {token ? (
            <>
              {/* 1. زرار لوحة الإدارة (Admin) - لونه بنفسجي */}
              <Link to="/admin" className="flex items-center gap-1.5 text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors decoration-none bg-purple-50 px-3 py-1.5 rounded-lg">
                <ShieldAlert size={16} />
                Admin
              </Link>

              {/* 2. زرار لوحة الصنايعي - لونه برتقالي */}
              <Link to="/provider-dashboard" className="flex items-center gap-1.5 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors decoration-none bg-amber-50 px-3 py-1.5 rounded-lg">
                <Briefcase size={16} />
                Provider
              </Link>
              
              {/* 3. زرار طلبات العميل - لونه سماوي */}
              <Link to="/my-requests" className="flex items-center gap-1.5 text-sm font-medium text-cyan-700 hover:text-cyan-800 transition-colors decoration-none bg-cyan-50 px-3 py-1.5 rounded-lg">
                <User size={16} />
                My Requests
              </Link>

              {/* زرار تسجيل الخروج */}
              <button onClick={handleLogout} className="rounded-lg border border-red-500 px-4 py-2 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50 cursor-pointer bg-transparent ml-2">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-lg border border-cyan-600 px-4 py-2 text-sm font-semibold text-cyan-700 transition-colors hover:bg-cyan-50 decoration-none">Login</Link>
              <Link to="/register" className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 decoration-none">Register</Link>
            </>
          )}
        </div>

        {/* زرار الموبايل */}
        <button
          className="rounded-lg p-2 text-slate-700 lg:hidden border-none bg-transparent cursor-pointer"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* قائمة الموبايل */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <ul className="flex flex-col gap-3 m-0 p-0 list-none">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.href} onClick={() => setMobileOpen(false)} className="block rounded-lg px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 decoration-none">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2">
            {token ? (
              <>
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="w-full text-center rounded-lg bg-purple-50 border border-purple-200 px-4 py-2 text-sm font-bold text-purple-700 decoration-none">
                  Admin Dashboard
                </Link>
                <Link to="/provider-dashboard" onClick={() => setMobileOpen(false)} className="w-full text-center rounded-lg bg-amber-50 border border-amber-200 px-4 py-2 text-sm font-bold text-amber-700 decoration-none">
                  Provider Panel
                </Link>
                <Link to="/my-requests" onClick={() => setMobileOpen(false)} className="w-full text-center rounded-lg bg-cyan-50 border border-cyan-200 px-4 py-2 text-sm font-semibold text-cyan-700 decoration-none">
                  My Requests
                </Link>
                <button onClick={handleLogout} className="w-full rounded-lg border border-red-500 px-4 py-2 text-sm font-semibold text-red-500 cursor-pointer bg-transparent">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="w-full text-center rounded-lg border border-cyan-600 px-4 py-2 text-sm font-semibold text-cyan-700 decoration-none">Login</Link>
                <Link to="/register" className="w-full text-center rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white decoration-none">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}