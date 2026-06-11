import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Search, ShieldCheck, Star, MapPin, SlidersHorizontal } from "lucide-react"

const CATEGORIES = ["Plumbing", "Electrical", "Cleaning", "Painting", "Carpentry", "AC Repair"]
const LOCATIONS = ["Alexandria", "Cairo", "Giza"]

const PROVIDERS = [
  {
    name: "Ahmed Hassan",
    specialty: "Plumbing Specialist",
    rating: 4.9,
    reviews: 214,
    location: "Cairo",
    photo: "/providers/ahmed.png",
  },
  {
    name: "Sara Ibrahim",
    specialty: "Home Cleaning Expert",
    rating: 4.8,
    reviews: 187,
    location: "Giza",
    photo: "/providers/sara.png",
  },
  {
    name: "Mostafa Adel",
    specialty: "Electrical Engineer",
    rating: 5.0,
    reviews: 302,
    location: "Alexandria",
    photo: "/providers/mostafa.png",
  },
  {
    name: "Khaled Nabil",
    specialty: "Professional Painter",
    rating: 4.7,
    reviews: 98,
    location: "Cairo",
    photo: "/providers/khaled.png",
  },
  {
    name: "Laila Mansour",
    specialty: "Carpentry & Woodwork",
    rating: 4.9,
    reviews: 156,
    location: "Giza",
    photo: "/providers/laila.png",
  },
  {
    name: "Omar Farouk",
    specialty: "AC Repair Technician",
    rating: 4.8,
    reviews: 241,
    location: "Alexandria",
    photo: "/providers/omar.png",
  },
]

export default function Providers() {
  // قراءة القسم من اللينك
  const [searchParams] = useSearchParams()
  const categoryFromUrl = searchParams.get("category")

  const [search, setSearch] = useState("")
  // تعيين القسم المختار بناءً على اللينك (لو موجود)
  const [selectedCategories, setSelectedCategories] = useState(
    categoryFromUrl ? [categoryFromUrl] : []
  )
  const [selectedLocations, setSelectedLocations] = useState([])
  const [minRating, setMinRating] = useState(null)

  // تحديث الفلتر لو اليوزر داس على لينك تاني وهو جوه الصفحة
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

  const filtered = PROVIDERS.filter((p) => {
    const matchesSearch =
      search.trim() === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.specialty.toLowerCase().includes(search.toLowerCase())
    const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(p.location)
    const matchesRating = minRating === null || p.rating >= minRating
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.some((c) => p.specialty.toLowerCase().includes(c.toLowerCase().split(" ")[0]))
    
    return matchesSearch && matchesLocation && matchesRating && matchesCategory
  })

  return (
    <div className="py-10 bg-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 text-balance">Find the Right Expert</h1>
          <p className="mt-2 text-slate-600">Browse verified professionals in Egypt.</p>
        </header>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Filters Sidebar */}
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

            {filtered.length === 0 ? (
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
                    key={p.name}
                    className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    {/* Top row */}
                    <div className="mb-4 flex items-start justify-between">
                      <img
                        src={p.photo}
                        alt={`Photo of ${p.name}`}
                        className="h-16 w-16 rounded-full object-cover border-2 border-slate-100"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Pro' }}
                      />
                      <span className="inline-flex items-center gap-1 rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700">
                        <ShieldCheck className="h-3.5 w-3.5 text-cyan-600" />
                        Verified
                      </span>
                    </div>

                    {/* Name + specialty */}
                    <h3 className="text-xl font-bold text-slate-900">{p.name}</h3>
                    <p className="mt-0.5 text-sm font-medium text-cyan-700">{p.specialty}</p>

                    {/* Rating */}
                    <div className="mt-3 flex items-center gap-1.5 text-sm">
                      <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                      <span className="font-semibold text-slate-900">{p.rating}</span>
                      <span className="text-slate-500">({p.reviews} reviews)</span>
                    </div>

                    {/* Location */}
                    <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-600">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      {p.location}
                    </div>

                    {/* View Profile */}
                    <Link 
                      to={`/provider/${p.name.toLowerCase().replace(' ', '-')}`} 
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