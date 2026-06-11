import { Link } from "react-router-dom"
import { MapPin, Phone, Mail, Globe, Share2, MessageCircle, Send, Home } from "lucide-react"

export default function Footer() {
  // فصلنا اللينكات في مصفوفات (Objects) عشان كل لينك يروح للمسار بتاعه
  const companyLinks = [
    { name: "About Us", path: "/about" },
    { name: "Blog", path: "/blog" },
    { name: "Contact Us", path: "/contact" },
  ]

  const supportLinks = [
    { name: "FAQ / Help Center", path: "/faq" },
    { name: "Terms & Privacy", path: "/terms" },
  ]

  const exploreLinks = [
  { name: "Plumbing", path: "/providers?category=Plumbing" },
  { name: "Cleaning", path: "/providers?category=Cleaning" },
  { name: "Electrical", path: "/providers?category=Electrical" },
]

  return (
    <footer id="contact" className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
          {/* Logo & Info */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 decoration-none cursor-pointer">
              <Home className="h-7 w-7 text-cyan-500" />
              <span className="text-2xl font-extrabold text-white">Baytak</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Your trusted home services marketplace. Verified experts, guaranteed quality, secure payments.
            </p>
            <div className="mt-5 space-y-3 text-sm text-slate-400">
              <p className="flex items-center gap-2 m-0"><Phone className="h-4 w-4 text-cyan-400" /> +20 100 000 0000</p>
              <p className="flex items-center gap-2 m-0"><Mail className="h-4 w-4 text-cyan-400" /> support@baytak.com</p>
              <p className="flex items-center gap-2 m-0"><MapPin className="h-4 w-4 text-cyan-400" /> Egypt</p>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white m-0">Company</h4>
            <ul className="mt-4 space-y-3 text-sm m-0 p-0 list-none">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-slate-400 transition-colors hover:text-cyan-400 decoration-none">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white m-0">Support</h4>
            <ul className="mt-4 space-y-3 text-sm m-0 p-0 list-none">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-slate-400 transition-colors hover:text-cyan-400 decoration-none">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white m-0">Explore</h4>
            <ul className="mt-4 space-y-3 text-sm m-0 p-0 list-none">
              {exploreLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-slate-400 transition-colors hover:text-cyan-400 decoration-none">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500 m-0">&copy; {new Date().getFullYear()} Baytak. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {[Globe, MessageCircle, Send, Share2].map((Icon, i) => (
              <button key={i} className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-colors hover:bg-cyan-600 hover:text-white border-none cursor-pointer p-0">
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}