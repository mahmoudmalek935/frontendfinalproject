import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
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
  ArrowLeft,
  Loader2,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  X
} from "lucide-react"

// ماب لربط كل اسم خدمة بأيقونة
const getServiceIcon = (name) => {
  const lowerName = name?.toLowerCase() || "";
  if (lowerName.includes("plumb")) return { icon: Wrench, bg: "bg-cyan-100", text: "text-cyan-600" };
  if (lowerName.includes("electri")) return { icon: Zap, bg: "bg-amber-100", text: "text-amber-500" };
  if (lowerName.includes("clean")) return { icon: Sparkles, bg: "bg-cyan-100", text: "text-cyan-600" };
  if (lowerName.includes("paint")) return { icon: PaintRoller, bg: "bg-amber-100", text: "text-amber-500" };
  if (lowerName.includes("carp")) return { icon: Hammer, bg: "bg-cyan-100", text: "text-cyan-600" };
  if (lowerName.includes("ac ") || lowerName.includes("cool")) return { icon: Snowflake, bg: "bg-amber-100", text: "text-amber-500" };
  if (lowerName.includes("garden")) return { icon: Leaf, bg: "bg-cyan-100", text: "text-cyan-600" };
  if (lowerName.includes("pest")) return { icon: Bug, bg: "bg-amber-100", text: "text-amber-500" };
  return { icon: Wrench, bg: "bg-slate-100", text: "text-slate-600" };
};

export default function ManageCategories() {
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // States للمودالز
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState({ isOpen: false, type: "", title: "", message: "" });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, title: "" });
  const [manageModal, setManageModal] = useState({ isOpen: false, mode: "add", id: null, title: "", description: "" });

  const showFeedback = (type, title, message) => {
    setFeedbackModal({ isOpen: true, type, title, message });
  }

  // 1. جلب الأقسام
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://localhost:7088/api/Services");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      
      const formatted = data.map(cat => ({
        id: cat.id,
        title: cat.name,
        description: cat.description,
        providers: cat.providersCount || 0, 
        ...getServiceIcon(cat.name)
      }));
      
      setCategories(formatted);
    } catch (err) {
      console.error(err);
      setError("Could not load categories from server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setManageModal({ isOpen: true, mode: "add", id: null, title: "", description: "" });
  }

  const openEditModal = (id, title, description) => {
    setManageModal({ isOpen: true, mode: "edit", id, title, description });
  }

  // 2. الحفظ (إضافة أو تعديل)
  const handleSaveCategory = async () => {
    const { mode, id, title, description } = manageModal;
    
    if (!title.trim()) {
      showFeedback("error", "Validation Error", "Category name cannot be empty.");
      return;
    }

    setActionLoading(true);
    const token = localStorage.getItem("token");

    try {
      const url = mode === "add" ? "https://localhost:7088/api/Services" : `https://localhost:7088/api/Services/${id}`;
      const method = mode === "add" ? "POST" : "PUT";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        // 🔴 بعتنا الداتا بأسماء تطابق الـ DTO في الباك إند
        body: JSON.stringify({ Name: title, Description: description }) 
      });
      
      if (res.ok) {
        showFeedback("success", mode === "add" ? "Category Added" : "Category Updated", "Changes have been saved successfully.");
        fetchCategories(); 
      } else {
        const errText = await res.text();
        showFeedback("error", "Action Failed", errText || "Could not save the category details.");
      }
    } catch (err) {
      showFeedback("error", "Network Error", "Could not connect to the server.");
    } finally {
      setActionLoading(false);
      setManageModal({ ...manageModal, isOpen: false });
    }
  }

  // 3. مسح القسم 🔴 (بتقرأ الإيرور من الباك إند وتعرضه)
  const executeDelete = async () => {
    const { id, title } = deleteModal;
    setDeleteModal({ isOpen: false, id: null, title: "" }); // قفل المودال فوراً
    
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`https://localhost:7088/api/Services/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        setCategories(prev => prev.filter(c => c.id !== id));
        showFeedback("success", "Category Deleted", `${title} has been successfully removed.`);
      } else {
        // 🔴 بنقرا رسالة الرفض الجاية من الباك إند ونعرضها في المودال (زي لا يمكن مسح الخدمة لوجود عمال)
        const errorText = await res.text();
        showFeedback("error", "Deletion Failed", errorText || "Failed to delete the category.");
      }
    } catch (err) {
      showFeedback("error", "Network Error", "Could not connect to the server.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 relative">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        <button 
          onClick={() => navigate('/admin')}
          className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-cyan-600 transition-colors bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
          <div>
            <p className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-1">Baytak Admin</p>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl text-balance">
              Service Categories
            </h1>
            <p className="mt-1 text-base text-slate-500 font-medium">
              Manage the service categories available on your platform.
            </p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-cyan-700 cursor-pointer border-none"
          >
            <Plus className="h-5 w-5" />
            Add New Category
          </button>
        </header>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 flex items-center gap-3 text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-cyan-600 mb-4" />
            <p className="text-slate-500 font-medium">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
            <p className="text-slate-500 font-bold">No categories found.</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon || Wrench;
              return (
                <article
                  key={category.id}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${category.bg}`}>
                    <Icon className={`h-8 w-8 ${category.text}`} />
                  </div>

                  <h2 className="mt-5 text-xl font-bold text-slate-900">
                    {category.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500 font-medium">
                    {category.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200">
                      Active providers:
                      <span className="ml-1.5 font-extrabold text-cyan-600 text-sm">
                        {category.providers}
                      </span>
                    </span>
                  </div>

                  {/* Footer Buttons */}
                  <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                    <button
                      type="button"
                      onClick={() => openEditModal(category.id, category.title, category.description)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-50 px-3 py-2.5 text-sm font-bold text-cyan-700 transition-colors hover:bg-cyan-100 cursor-pointer border border-cyan-200"
                    >
                      <Pencil className="h-4 w-4" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteModal({ isOpen: true, id: category.id, title: category.title })}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-100 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>

      {/* ================= MODALS ================= */}

      {/* 1. Manage (Add/Edit) Category Modal */}
      {manageModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-in zoom-in duration-200 relative">
            <button
              onClick={() => setManageModal({ ...manageModal, isOpen: false })}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors bg-transparent border-none cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-extrabold text-slate-900 mb-4">
              {manageModal.mode === "add" ? "Add New Category" : "Edit Category"}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Category Name</label>
                <input
                  type="text"
                  value={manageModal.title}
                  onChange={(e) => setManageModal({ ...manageModal, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  placeholder="e.g. Plumbing"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={manageModal.description}
                  onChange={(e) => setManageModal({ ...manageModal, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none"
                  placeholder="Short description..."
                ></textarea>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setManageModal({ ...manageModal, isOpen: false })}
                className="flex-1 rounded-xl bg-slate-100 py-2.5 font-bold text-slate-700 transition hover:bg-slate-200 border-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCategory}
                disabled={actionLoading}
                className="flex-1 flex items-center justify-center rounded-xl bg-cyan-600 py-2.5 font-bold text-white transition hover:bg-cyan-700 border-none cursor-pointer disabled:opacity-70"
              >
                {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Category"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Confirm Delete Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl animate-in zoom-in duration-200 border-2 border-rose-100">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
              <AlertTriangle className="h-8 w-8 text-rose-500" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Delete Category?</h3>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Are you sure you want to delete <span className="font-bold text-slate-800">"{deleteModal.title}"</span>?
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteModal({ isOpen: false, id: null, title: "" })}
                className="flex-1 rounded-xl bg-slate-100 py-3 font-bold text-slate-700 transition hover:bg-slate-200 border-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="flex-1 rounded-xl bg-rose-600 py-3 font-bold text-white transition hover:bg-rose-700 border-none cursor-pointer shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. General Feedback Modal (بيقرأ الـ Error اللي جاي من الباك إند) */}
      {feedbackModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className={`w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl animate-in zoom-in duration-200 border-2 ${feedbackModal.type === "success" ? "border-green-100" : "border-red-100"}`}>
            <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${feedbackModal.type === "success" ? "bg-green-50" : "bg-red-50"}`}>
              {feedbackModal.type === "success" ? (
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              ) : (
                <X className="h-8 w-8 text-red-600" />
              )}
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">{feedbackModal.title}</h3>
            <p className="mt-2 text-sm font-medium text-slate-500">
              {feedbackModal.message}
            </p>
            <button
              onClick={() => setFeedbackModal({ isOpen: false, type: "", title: "", message: "" })}
              className="mt-6 w-full rounded-xl bg-slate-100 py-3 font-bold text-slate-700 transition hover:bg-slate-200 border-none cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  )
}