import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from '../assets/logo.jpeg' 
import { Menu, X, Briefcase, ShieldAlert, LogOut, UserCircle, ClipboardList } from "lucide-react"

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
  const userRole = localStorage.getItem("userRole") || "customer"

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userRole")
    window.location.href = "/"; 
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* اللوجو */}
        <Link to="/" className="flex items-center gap-2 decoration-none">
          <img src={logo} alt="Baytak logo" className="h-10 w-auto object-contain" />
        </Link>

        {/* اللينكات الأساسية */}
        <ul className="hidden items-center gap-6 lg:flex m-0 p-0 list-none">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link to={link.href} className="text-sm font-bold text-slate-600 transition-colors hover:text-cyan-700 decoration-none">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* زراير اللوحات */}
        <div className="hidden items-center gap-2 lg:flex">
          {token ? (
            <>
              {userRole === 'admin' && (
                <Link to="/admin" className="flex items-center gap-1.5 text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors decoration-none bg-purple-50 hover:bg-purple-100 px-3 py-2 rounded-xl">
                  <ShieldAlert size={16} />
                  Admin
                </Link>
              )}

              {userRole === 'provider' && (
                <Link to="/provider-dashboard" className="flex items-center gap-1.5 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors decoration-none bg-amber-50 hover:bg-amber-100 px-3 py-2 rounded-xl">
                  <Briefcase size={16} />
                  Provider
                </Link>
              )}

              {userRole === 'customer' && (
                <>
                  <Link to="/my-requests" className="flex items-center gap-1.5 text-sm font-bold text-cyan-700 hover:text-cyan-800 transition-colors decoration-none bg-cyan-50 hover:bg-cyan-100 px-3 py-2 rounded-xl">
                    <ClipboardList size={16} />
                    Requests
                  </Link>
                  <Link to="/my-profile" className="flex items-center gap-1.5 text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors decoration-none bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl shadow-sm">
                    <UserCircle size={16} />
                    Account
                  </Link>
                </>
              )}

              <button 
                onClick={handleLogout} 
                className="flex items-center gap-1.5 rounded-xl border border-rose-200 px-3 py-2 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-50 cursor-pointer bg-white ml-1 shadow-sm"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-xl border-2 border-cyan-100 px-5 py-2 text-sm font-bold text-cyan-700 transition-colors hover:bg-cyan-50 hover:border-cyan-200 decoration-none bg-white shadow-sm">
                Login
              </Link>
              <Link to="/register" className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-cyan-700 decoration-none shadow-sm ml-2">
                Register
              </Link>
            </>
          )}
        </div>

        {/* الموبايل */}
        <button
          className="rounded-lg p-2 text-slate-700 lg:hidden border-none bg-transparent cursor-pointer hover:bg-slate-100 transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 lg:hidden shadow-lg absolute w-full">
          <ul className="flex flex-col gap-2 m-0 p-0 list-none mb-4">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.href} onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-cyan-700 transition-colors decoration-none">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
            {token ? (
              <>
                {userRole === 'admin' && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 w-full rounded-xl bg-purple-50 text-purple-700 px-4 py-3 text-sm font-bold decoration-none border border-purple-100">
                    <ShieldAlert size={18} /> Admin Dashboard
                  </Link>
                )}
                
                {userRole === 'provider' && (
                  <Link to="/provider-dashboard" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 w-full rounded-xl bg-amber-50 text-amber-700 px-4 py-3 text-sm font-bold decoration-none border border-amber-100">
                    <Briefcase size={18} /> Provider Panel
                  </Link>
                )}
                
                {userRole === 'customer' && (
                  <>
                    <Link to="/my-requests" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 w-full rounded-xl bg-cyan-50 text-cyan-700 px-4 py-3 text-sm font-bold decoration-none border border-cyan-100">
                      <ClipboardList size={18} /> My Requests
                    </Link>
                    <Link to="/my-profile" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 w-full rounded-xl bg-slate-100 text-slate-700 px-4 py-3 text-sm font-bold decoration-none border border-slate-200">
                      <UserCircle size={18} /> Account Settings
                    </Link>
                  </>
                )}

                <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full rounded-xl border border-rose-200 px-4 py-3 text-sm font-bold text-rose-600 cursor-pointer bg-white mt-2 shadow-sm hover:bg-rose-50 transition-colors">
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="w-full text-center rounded-xl border-2 border-cyan-100 px-4 py-3 text-sm font-bold text-cyan-700 hover:bg-cyan-50 transition-colors decoration-none bg-white">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="w-full text-center rounded-xl bg-cyan-600 px-4 py-3 text-sm font-bold text-white hover:bg-cyan-700 transition-colors decoration-none shadow-sm">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}