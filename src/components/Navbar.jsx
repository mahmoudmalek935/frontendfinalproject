import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from '../assets/logo.jpeg' 
import { Menu, X } from "lucide-react"

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
        <Link to="/" className="flex items-center gap-2 decoration-none">
          <img src={logo} alt="Baytak logo" className="h-10 w-auto object-contain" />
        </Link>

        <ul className="hidden items-center gap-8 lg:flex m-0 p-0 list-none">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link to={link.href} className="text-sm font-medium text-slate-600 transition-colors hover:text-cyan-700 decoration-none">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          {token ? (
            <button onClick={handleLogout} className="rounded-lg border border-red-500 px-4 py-2 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50 cursor-pointer">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="rounded-lg border border-cyan-600 px-4 py-2 text-sm font-semibold text-cyan-700 transition-colors hover:bg-cyan-50 decoration-none">Login</Link>
              <Link to="/register" className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 decoration-none">Register</Link>
            </>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-slate-700 lg:hidden border-none bg-transparent cursor-pointer"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

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
              <button onClick={handleLogout} className="w-full rounded-lg border border-red-500 px-4 py-2 text-sm font-semibold text-red-500 cursor-pointer bg-transparent">Logout</button>
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