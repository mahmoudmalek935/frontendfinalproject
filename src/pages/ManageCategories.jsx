import {
  Plus,
  Pencil,
  Trash2,
  Wrench,
  Zap,
  Sparkles,
  PaintRoller,
  Hammer,
  Snowflake,
  Leaf,
  Bug,
} from "lucide-react"

const categories = [
  {
    id: 1,
    title: "Plumbing",
    description: "Pipe repairs, leak fixes, installations, and drainage solutions.",
    providers: 24,
    icon: Wrench,
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  {
    id: 2,
    title: "Electrical",
    description: "Wiring, lighting, panel upgrades, and electrical maintenance.",
    providers: 18,
    icon: Zap,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-500",
  },
  {
    id: 3,
    title: "Cleaning",
    description: "Deep cleaning, regular housekeeping, and sanitization services.",
    providers: 42,
    icon: Sparkles,
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  {
    id: 4,
    title: "Painting",
    description: "Interior and exterior painting, wall finishes, and touch-ups.",
    providers: 15,
    icon: PaintRoller,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-500",
  },
  {
    id: 5,
    title: "Carpentry",
    description: "Furniture assembly, repairs, custom woodwork, and fittings.",
    providers: 11,
    icon: Hammer,
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  {
    id: 6,
    title: "AC & Cooling",
    description: "Air conditioning installation, servicing, and repairs.",
    providers: 20,
    icon: Snowflake,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-500",
  },
  {
    id: 7,
    title: "Gardening",
    description: "Landscaping, lawn care, plant maintenance, and garden design.",
    providers: 9,
    icon: Leaf,
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  {
    id: 8,
    title: "Pest Control",
    description: "Inspection, extermination, and prevention treatments.",
    providers: 7,
    icon: Bug,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-500",
  },
]

export default function ManageCategories() {
  const handleAddCategory = () => {
    alert("Open 'Add Category' modal/form (To be implemented with backend)");
  }

  const handleEdit = (title) => {
    alert(`Editing category: ${title}`);
  }

  const handleDelete = (title) => {
    if (window.confirm(`Are you sure you want to delete ${title}?`)) {
      alert(`${title} deleted!`);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
          <div>
            <p className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-1">Baytak Admin</p>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl text-balance">
              Service Categories
            </h1>
            <p className="mt-1 text-base text-slate-500">
              Manage the service categories available on your platform.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddCategory}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-cyan-700 cursor-pointer border-none"
          >
            <Plus className="h-5 w-5" />
            Add New Category
          </button>
        </header>

        {/* Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <article
                key={category.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl ${category.iconBg}`}
                >
                  <Icon className={`h-8 w-8 ${category.iconColor}`} />
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-900">
                  {category.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500 font-medium">
                  {category.description}
                </p>

                <div className="mt-5 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200">
                    Active providers:
                    <span className="ml-1.5 font-bold text-cyan-600 text-sm">
                      {category.providers}
                    </span>
                  </span>
                </div>

                {/* Footer Buttons */}
                <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                  <button
                    type="button"
                    onClick={() => handleEdit(category.title)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-50 px-3 py-2.5 text-sm font-bold text-cyan-700 transition-colors hover:bg-cyan-100 cursor-pointer border border-cyan-200"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(category.title)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-100 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}