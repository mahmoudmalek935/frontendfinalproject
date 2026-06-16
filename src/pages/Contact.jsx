import { useState, useEffect } from "react"
import { MapPin, Mail, Phone, Send, Loader2, MessageSquare, CheckCircle, Trash2, Filter, X } from "lucide-react"

export default function Contact() {
  const userRole = (localStorage.getItem('Role') || localStorage.getItem('role') || localStorage.getItem('userRole') || '').toLowerCase().trim();

  // ================= STATES (CUSTOMER) =================
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState("") 
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ================= STATES (ADMIN) =================
  const [messages, setMessages] = useState([])
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false)
  const [adminFeedback, setAdminFeedback] = useState({ type: "", text: "" }) 
  
  // 🔴 حالات الفلاتر والحذف (بدون Alert)
  const [filterRole, setFilterRole] = useState("All")
  const [filterStatus, setFilterStatus] = useState("All")
  const [deleteConfirmId, setDeleteConfirmId] = useState(null) // عشان نعرض زرار التأكيد بدل الأليرت

  // ================= ADMIN FUNCTIONS =================
  useEffect(() => {
    if (userRole === 'admin') {
      fetchMessages()
    }
  }, [userRole])

  const showAdminFeedback = (type, text) => {
    setAdminFeedback({ type, text });
    setTimeout(() => setAdminFeedback({ type: "", text: "" }), 3000);
  }

  const fetchMessages = async () => {
    setIsLoadingAdmin(true)
    try {
      const response = await fetch('https://localhost:7088/api/ContactMessages')
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      } else {
        showAdminFeedback('error', 'Failed to load messages from server.')
      }
    } catch (error) {
      showAdminFeedback('error', 'Connection error while loading messages.')
    } finally {
      setIsLoadingAdmin(false)
    }
  }

  const handleResolveMessage = async (id) => {
    try {
      const response = await fetch(`https://localhost:7088/api/ContactMessages/resolve/${id}`, { method: 'PUT' })
      if (response.ok) {
        setMessages(messages.map(msg => msg.id === id ? { ...msg, isResolved: true } : msg))
        showAdminFeedback('success', 'Message marked as resolved.')
      } else {
        showAdminFeedback('error', 'Failed to resolve message.')
      }
    } catch (error) {
      showAdminFeedback('error', 'Connection error. Could not resolve message.')
    }
  }

  // 🔴 دالة الحذف الجديدة بدون Alert
  const confirmDeleteMessage = async (id) => {
    try {
      const response = await fetch(`https://localhost:7088/api/ContactMessages/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setMessages(messages.filter(msg => msg.id !== id))
        showAdminFeedback('success', 'Message deleted successfully.')
      } else {
        showAdminFeedback('error', 'Failed to delete message.')
      }
    } catch (error) {
      showAdminFeedback('error', 'Connection error. Could not delete message.')
    } finally {
      setDeleteConfirmId(null) // نقفل رسالة التأكيد
    }
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  // 🔴 تطبيق الفلاتر على الرسائل
  const filteredMessages = messages.filter(msg => {
    const msgRole = msg.role ? msg.role.toLowerCase() : 'visitor';
    const matchRole = filterRole === "All" || msgRole === filterRole.toLowerCase();
    const matchStatus = filterStatus === "All" || 
                       (filterStatus === "Resolved" && msg.isResolved) || 
                       (filterStatus === "Pending" && !msg.isResolved);
    return matchRole && matchStatus;
  });

  // ================= CUSTOMER FUNCTIONS =================
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError("") 
    setSubmitted(false) 

    // تحديد حالة اليوزر اللي بيبعت الرسالة دلوقتي
    const senderRole = userRole === 'admin' ? 'visitor' : (userRole || 'visitor');

    try {
      const response = await fetch('https://localhost:7088/api/ContactMessages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: senderRole }) // 🔴 بعتنا الـ Role للباك إند
      })

      if (response.ok) {
        setSubmitted(true)
        setForm({ name: "", email: "", subject: "", message: "" })
        setTimeout(() => setSubmitted(false), 4000)
      } else {
        setFormError("Failed to send message. Please try again.") 
      }
    } catch (error) {
      setFormError("An error occurred. Please check your connection.") 
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactDetails = [
    { icon: MapPin, title: "Address", value: "Cairo, Egypt" },
    { icon: Mail, title: "Email", value: "support@baytack.com", href: "mailto:support@baytak.com" },
    { icon: Phone, title: "Phone", value: "+20 100 000 0000", href: "tel:+201000000000" },
  ]

  // ================= ADMIN VIEW RENDER =================
  if (userRole === 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-amber-500">Baytack Dashboard</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 flex items-center justify-center sm:justify-start gap-3">
                <MessageSquare className="w-8 h-8 text-cyan-600" />
                Inbox ({filteredMessages.length})
              </h1>
            </div>
            <button 
              onClick={fetchMessages}
              className="mt-4 sm:mt-0 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl shadow-sm hover:bg-slate-50 transition border-none cursor-pointer"
            >
              Refresh Data
            </button>
          </header>

          {/* 🔴 شريط الفلاتر (جديد) */}
          <div className="mb-6 flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <Filter className="w-4 h-4 text-cyan-600" /> Filters:
            </div>
            <select 
              value={filterRole} 
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-cyan-600"
            >
              <option value="All">All Roles</option>
              <option value="Customer">Customers </option>
              <option value="Provider">Providers </option>
              <option value="Visitor">Visitors </option>
            </select>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-cyan-600"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending </option>
              <option value="Resolved">Resolved </option>
            </select>
          </div>

          {adminFeedback.text && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-bold border ${
              adminFeedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}>
              {adminFeedback.text}
            </div>
          )}

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-md overflow-hidden">
            {isLoadingAdmin ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="w-10 h-10 text-cyan-600 animate-spin" />
                <p className="text-slate-500 font-medium">Loading messages...</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-20 text-slate-400 font-medium text-lg">
                No messages found matching your filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-semibold text-sm border-b border-slate-100">
                      <th className="p-4 rounded-tl-xl w-1/4">Sender Info</th>
                      <th className="p-4 w-1/3">Message Details</th>
                      <th className="p-4 w-1/6">Status</th>
                      <th className="p-4 rounded-tr-xl w-1/6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredMessages.map((msg) => (
                      <tr key={msg.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4">
                          <div className="font-bold text-slate-900 text-base">{msg.name}</div>
                          <div className="text-slate-500 mt-0.5 mb-2">{msg.email}</div>
                          {/* 🔴 باج بيوضح نوع اللي باعت الرسالة */}
                          <span className={`px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${
                            msg.role?.toLowerCase() === 'provider' ? 'bg-indigo-50 text-indigo-600' : 
                            msg.role?.toLowerCase() === 'customer' ? 'bg-blue-50 text-blue-600' : 
                            'bg-slate-100 text-slate-500'
                          }`}>
                            {msg.role || 'Visitor'}
                          </span>
                          <div className="text-xs text-slate-400 mt-2">{formatDate(msg.createdAt)}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-slate-800 mb-1.5 text-base">{msg.subject}</div>
                          <div className="text-slate-600 leading-relaxed break-words line-clamp-3">
                            {msg.message}
                          </div>
                        </td>
                        <td className="p-4">
                          {msg.isResolved ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                              <CheckCircle className="w-4 h-4" /> Resolved
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            {/* 🔴 لوجيك الحذف الجديد (تأكيد داخلي بدون Alert) */}
                            {deleteConfirmId === msg.id ? (
                              <div className="flex flex-col gap-1 items-center bg-rose-50 p-2 rounded-xl border border-rose-100">
                                <span className="text-[10px] font-bold text-rose-600 uppercase">Confirm?</span>
                                <div className="flex gap-1">
                                  <button onClick={() => confirmDeleteMessage(msg.id)} className="bg-rose-500 text-white px-2 py-1 rounded text-xs border-none cursor-pointer hover:bg-rose-600">Yes</button>
                                  <button onClick={() => setDeleteConfirmId(null)} className="bg-slate-200 text-slate-700 px-2 py-1 rounded text-xs border-none cursor-pointer hover:bg-slate-300">No</button>
                                </div>
                              </div>
                            ) : (
                              <>
                                {!msg.isResolved && (
                                  <button
                                    onClick={() => handleResolveMessage(msg.id)}
                                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition cursor-pointer border-none bg-transparent"
                                    title="Mark as Resolved"
                                  >
                                    <CheckCircle className="w-5 h-5" />
                                  </button>
                                )}
                                <button
                                  onClick={() => setDeleteConfirmId(msg.id)}
                                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer border-none bg-transparent"
                                  title="Delete Message"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ================= CUSTOMER VIEW RENDER =================
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-500">Baytack</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Get in Touch</h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">We're here to help you 24/7.</p>
        </header>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <section className="flex flex-col gap-6">
            {contactDetails.map((item) => {
              const Icon = item.icon
              const content = (
                <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-600/10 text-cyan-600">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{item.title}</h2>
                    <p className="mt-1 text-lg font-medium text-slate-900">{item.value}</p>
                  </div>
                </div>
              )
              return item.href ? <a key={item.title} href={item.href} className="block decoration-none text-inherit">{content}</a> : <div key={item.title}>{content}</div>
            })}
          </section>

          <section>
            <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-100 bg-white p-8 shadow-md">
              <div className="flex flex-col gap-5">
                
                {formError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold rounded-xl text-center">
                    {formError}
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">Name</label>
                  <input
                    id="name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder="Your full name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                  <input
                    id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-slate-700">Subject</label>
                  <input
                    id="subject" name="subject" type="text" required value={form.subject} onChange={handleChange} placeholder="How can we help?"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-slate-700">Message</label>
                  <textarea
                    id="message" name="message" required rows={5} value={form.message} onChange={handleChange} placeholder="Write your message here..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20"
                  />
                </div>

                <button
                  type="submit" disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 font-semibold text-white hover:bg-cyan-700 border-none cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>

                {submitted && (
                  <p className="text-center text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 py-2.5 rounded-xl">
                    Thanks! Your message has been sent successfully.
                  </p>
                )}
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  )
}