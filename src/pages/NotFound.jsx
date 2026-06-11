import { Link } from 'react-router-dom'
import { Home, AlertTriangle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="bg-slate-900 min-h-screen flex items-center justify-center px-4 w-full">
      <div className="text-center max-w-2xl w-full bg-slate-800 p-10 rounded-3xl border border-slate-700 shadow-2xl">
        {/* أيقونة التحذير /}
        <div className="flex justify-center mb-6">
          <div className="bg-red-500/20 p-4 rounded-full">
            <AlertTriangle className="w-16 h-16 text-red-500" />
          </div>
        </div>

        {/ 404 Text /}
        <div className="mb-4">
          <h1 className="text-8xl md:text-9xl font-black text-white tracking-widest">
            404
          </h1>
        </div>

        {/ Main Heading - تحذير /}
        <h2 className="text-2xl md:text-3xl font-bold text-red-400 mb-4 uppercase tracking-wider">
          System Error Detected
        </h2>

        {/ Subtitle - كلام تحذيري /}
        <div className="bg-slate-900/50 rounded-xl p-6 mb-8 border border-slate-700">
          <p className="text-lg text-slate-300 leading-relaxed font-mono">
            <span className="text-amber-500 font-bold">WARNING:</span> The requested path could not be resolved by our servers. 
            The page you are attempting to access has either been permanently deleted, renamed, or you lack the necessary permissions to view it.
          </p>
        </div>

        {/ Back to Homepage Button */}
        
        <h2 className="text-2xl md:text-3xl font-bold text-red-400 mb-4 uppercase tracking-wider">
          System Error Detected
        </h2>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl py-4 px-8 transition-colors duration-200 decoration-none shadow-lg"
        >
          <Home size={20} />
          Return to Safe Zone (Home)
        </Link>
      </div>
    </div>
  )
}