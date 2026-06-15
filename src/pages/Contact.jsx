import { useState } from "react"
import { MapPin, Mail, Phone, Send, Loader2 } from "lucide-react"

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false) // 🔴 حالة التحميل

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // 🔴 ربطنا الدالة بالباك إند 🔴
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('https://localhost:7088/api/ContactMessages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })

      if (response.ok) {
        setSubmitted(true)
        setForm({ name: "", email: "", subject: "", message: "" })
        setTimeout(() => setSubmitted(false), 4000)
      } else {
        alert("Failed to send message. Please try again.")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      alert("An error occurred. Please check your connection.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactDetails = [
    {
      icon: MapPin,
      title: "Address",
      value: "Cairo, Egypt",
    },
    {
      icon: Mail,
      title: "Email",
      value: "support@baytack.com",
      href: "mailto:support@baytak.com",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+20 100 000 0000",
      href: "tel:+201000000000",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page Header */}
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-500">Baytack</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Get in Touch
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">We're here to help you 24/7.</p>
        </header>

        {/* Two column layout */}
        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Left Column - Contact Info */}
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

              return item.href ? (
                <a key={item.title} href={item.href} className="block decoration-none text-inherit">
                  {content}
                </a>
              ) : (
                <div key={item.title}>{content}</div>
              )
            })}
          </section>

          {/* Right Column - Contact Form */}
          <section>
            <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-100 bg-white p-8 shadow-md">
              <div className="flex flex-col gap-5">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-slate-700">Subject</label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-slate-700">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 font-semibold text-white hover:bg-cyan-700 border-none cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>

                {submitted && (
                  <p className="text-center text-sm font-bold text-green-600 bg-green-50 py-2 rounded-lg">
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