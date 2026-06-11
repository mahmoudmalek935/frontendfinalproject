import { Link } from "react-router-dom"
import { MapPin, Phone, Mail, Globe, Share2, MessageCircle, Send } from "lucide-react"

export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold text-white">Baytack</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Your trusted home services marketplace in Egypt. Verified experts, guaranteed quality, secure payments.
            </p>
            <div className="mt-5 space-y-2 text-sm text-slate-400">
              <p className="flex items-center gap-2 m-0"><Phone className="h-4 w-4 text-cyan-400" /> +20 100 000 0000</p>
              <p className="flex items-center gap-2 m-0"><Mail className="h-4 w-4 text-cyan-400" /> support@baytak.com</p>
              <p className="flex items-center gap-2 m-0"><MapPin className="h-4 w-4 text-cyan-400" /> Egypt</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white m-0">Baytack</h4>
            <ul className="mt-4 space-y-3 text-sm m-0 p-0 list-none">
              {["About Us", "Blog", "Contact Us", "Careers"].map((link) => (
                <li key={link}><Link to="/" className="text-slate-400 transition-colors hover:text-cyan-400 decoration-none">{link}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white m-0">Support</h4>
            <ul className="mt-4 space-y-3 text-sm m-0 p-0 list-none">
              {["FAQ / Help Center", "Terms & Privacy", "Dispute Resolution"].map((link) => (
                <li key={link}><Link to="/" className="text-slate-400 transition-colors hover:text-cyan-400 decoration-none">{link}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white m-0">Explore</h4>
            <ul className="mt-4 space-y-3 text-sm m-0 p-0 list-none">
              {["Plumbing", "Cleaning", "Handyman"].map((link) => (
                <li key={link}><Link to="/providers" className="text-slate-400 transition-colors hover:text-cyan-400 decoration-none">{link}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500 m-0">&copy; {new Date().getFullYear()} Baytak. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {[Globe, MessageCircle, Send, Share2].map((Icon, i) => (
              <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-colors hover:bg-cyan-600 hover:text-white decoration-none">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}