import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Search, ShieldCheck, Star, MapPin, SlidersHorizontal, Loader2 } from "lucide-react"

const CATEGORIES = ["Plumbing", "Electrical", "Cleaning", "Painting", "Carpentry", "AC Repair"]
const LOCATIONS = ["Alexandria", "Cairo", "Giza"]

export default function Providers() {
  const [searchParams] = useSearchParams()
  const categoryFromUrl = searchParams.get("category")

  // 🔴 States جديدة لجلب البيانات الحقيقية
  const [providers, setProviders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const [search, setSearch] = useState("")
  const [selectedCategories, setSelectedCategories] = useState(
    categoryFromUrl ? [categoryFromUrl] : []
  )
  const [selectedLocations, setSelectedLocations] = useState([])
  const [minRating, setMinRating] = useState(null)

  // 🔴 جلب الصنايعية من الباك إند
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch("https://localhost:7088/api/Providers");
        if (!response.ok) throw new Error("فشل في جلب قائمة الفنيين");
        
        const data = await response.json();
        setProviders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, []);

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategories([categoryFromUrl])
    }
  }, [categoryFromUrl])

  const toggle = (value, list, setList) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  const clearFilters = () => {
    setSearch("")
    setSelectedCategories([])
    setSelectedLocations([])
    setMinRating(null)
  }

  // 🔴 تطبيق الفلاتر على البيانات الحقيقية
  const filtered = providers.filter((p) => {
    const fullName = p.fullName || "";
    const serviceName = p.serviceName || "";
    const governorate = p.governorate || "Not specified";
    const rating = p.rating || 0; // لسه مفيش تقييمات حقيقية في الداتا بيز فبنديها 0

    const matchesSearch =
      search.trim() === "" ||
      fullName.toLowerCase().includes(search.toLowerCase()) ||
      serviceName.toLowerCase().includes(search.toLowerCase())
      
    const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(governorate)
    const matchesRating = minRating === null || rating >= minRating
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.some((c) => serviceName.toLowerCase().includes(c.toLowerCase().split(" ")[0]))

    return matchesSearch && matchesLocation && matchesRating && matchesCategory
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-600" />
      </div>
    );
  }

  return (
    <div className="py-10 bg-slate-100 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 text-balance">Find the Right Expert</h1>
          <p className="mt-2 text-slate-600">Browse verified professionals in Egypt.</p>
        </header>

        <div className="flex flex-col gap-8 lg:flex-row">
          
          <aside className="lg:w-80 lg:flex-shrink-0">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:sticky lg:top-24 shadow-sm">
              <div className="mb-6 flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-cyan-600" />
                <h2 className="text-lg font-bold text-slate-900">Filters</h2>
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search providers..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Categories</h3>
                <div className="space-y-2.5">
                  {CATEGORIES.map((cat) => (
                    <label key={cat} className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggle(cat, selectedCategories, setSelectedCategories)}
                        className="h-4 w-4 rounded border-slate-300 text-cyan-600 accent-cyan-600 focus:ring-cyan-500 cursor-pointer"
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Location</h3>
                <div className="space-y-2.5">
                  {LOCATIONS.map((loc) => (
                    <label key={loc} className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={selectedLocations.includes(loc)}
                        onChange={() => toggle(loc, selectedLocations, setSelectedLocations)}
                        className="h-4 w-4 rounded border-slate-300 text-cyan-600 accent-cyan-600 focus:ring-cyan-500 cursor-pointer"
                      />
                      {loc}
                    </label>
                  ))}
                </div>
              </div>

              {/* Minimum Rating */}
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Minimum Rating</h3>
                <div className="space-y-2.5">
                  {[4, 3].map((r) => (
                    <label key={r} className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === r}
                        onChange={() => setMinRating(r)}
                        className="h-4 w-4 border-slate-300 text-cyan-600 accent-cyan-600 focus:ring-cyan-500 cursor-pointer"
                      />
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                        {r}+ stars
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          </aside>

          {/* Providers Grid */}
          <section className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">{filtered.length}</span> professionals found
              </p>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600 font-bold mb-4">
                {error}
              </div>
            )}

            {filtered.length === 0 && !error ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                <p className="text-slate-600">No providers match your filters.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 rounded-lg bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 border-none cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((p) => (
                  <article
                    key={p.providerId}
                    className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg relative"
                  >
                    {/* Top row */}
                    <div className="mb-4 flex items-start justify-between">
                      <img
                        src={p.profilePicture ? `https://localhost:7088${p.profilePicture}` : "/images/provider-karim.png"}
                        alt={`Photo of ${p.fullName}`}
                        className="h-16 w-16 rounded-full object-cover border-2 border-slate-100 bg-slate-50"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Pro' }}
                      />
                      <span className="inline-flex items-center gap-1 rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700">
                        <ShieldCheck className="h-3.5 w-3.5 text-cyan-600" />
                        Verified
                      </span>
                    </div>

                    {/* Name + specialty */}
                    <h3 className="text-xl font-bold text-slate-900">{p.fullName}</h3>
                    <p className="mt-0.5 text-sm font-medium text-cyan-700">{p.serviceName}</p>

                    {/* Rating (مؤقت لحد ما نبني جدول التقييمات) */}
                    <div className="mt-3 flex items-center gap-1.5 text-sm">
                      <Star className="h-4 w-4 fill-amber-500 text-amber-500 opacity-50" />
                      <span className="font-semibold text-slate-900">0.0</span>
                      <span className="text-slate-500">(0 reviews)</span>
                    </div>

                    {/* Location */}
                    <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-600">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      {p.governorate || "Not specified"}
                    </div>

                    {/* View Profile */}
                    <Link
                      to={`/provider/${p.providerId}`}
                      className="mt-auto pt-4 decoration-none"
                    >
                      <button className="w-full rounded-lg bg-cyan-600 py-2.5 font-semibold text-white transition-colors hover:bg-cyan-700 border-none cursor-pointer shadow-sm">
                        View Profile
                      </button>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}