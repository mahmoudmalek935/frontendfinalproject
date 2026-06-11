import { useState } from "react"
import { Link } from "react-router-dom"
import { Search, ChevronDown, MessageCircle, Mail } from "lucide-react"

const faqs = [
  {
    question: "How do I pay for a service?",
    answer: "Baytak supports multiple payment methods across Egypt, including cash on completion, credit and debit cards, and popular mobile wallets like Vodafone Cash and InstaPay. You can choose your preferred method when booking, and payment is only finalized once the service is completed to your satisfaction.",
  },
  {
    question: "Are the service providers vetted?",
    answer: "Yes. Every provider on Baytak goes through a thorough verification process that includes ID checks, skill assessments, and background screening. We also rely on customer ratings and reviews to ensure only trusted professionals remain active on the platform.",
  },
  {
    question: "What if I am not satisfied with the service in my governorate?",
    answer: "Your satisfaction is our priority. If you are not happy with a service in any governorate, report the issue within 48 hours and our support team will arrange a free re-service or a refund according to our satisfaction guarantee policy.",
  },
  {
    question: "Which governorates does Baytak cover?",
    answer: "Baytak operates across major governorates including Cairo, Giza, Alexandria, and is rapidly expanding to the Delta and Upper Egypt. Availability of specific services may vary by area, which you can confirm by entering your location during booking.",
  },
  {
    question: "How quickly can a provider arrive?",
    answer: "For most home services, you can book same-day or next-day appointments. Urgent requests such as plumbing or electrical emergencies are prioritized, and you can track your provider's estimated arrival time directly in the app.",
  },
  {
    question: "Can I reschedule or cancel a booking?",
    answer: "Absolutely. You can reschedule or cancel a booking free of charge up to 3 hours before the scheduled appointment. Cancellations made closer to the appointment time may be subject to a small fee to compensate the provider.",
  },
  {
    question: "Is there a warranty on the work performed?",
    answer: "Most services come with a workmanship guarantee. If an issue related to the original job arises within the warranty window, we will send a provider back to fix it at no additional cost to you.",
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)
  const [query, setQuery] = useState("")

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(query.toLowerCase()) ||
      faq.answer.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Header */}
      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-cyan-50 px-4 py-1.5 text-sm font-medium text-cyan-700">
            Baytak Help Center
          </span>
          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            How can we help you?
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-slate-500 text-lg">
            Find answers to common questions about booking trusted home services across Egypt.
          </p>

          {/* Search input */}
          <div className="relative mx-auto mt-8 max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search FAQs..."
              aria-label="Search frequently asked questions"
              className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-base shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            />
          </div>
        </div>
      </section>

      {/* FAQ list */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-3xl">
          <div className="divide-y divide-slate-100 border-t border-slate-100">
            {filteredFaqs.length === 0 && (
              <p className="py-10 text-center text-slate-500">
                No questions match your search. Try a different keyword.
              </p>
            )}

            {filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index
              return (
                <div key={faq.question} className="py-3">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left bg-transparent border-none cursor-pointer"
                  >
                    <span className="text-lg font-bold text-slate-900">{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 flex-shrink-0 text-cyan-600 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100 mb-4" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pr-8 leading-relaxed text-slate-600">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact banner */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col items-center gap-6 rounded-3xl bg-cyan-600 px-6 py-12 text-center sm:px-12 shadow-md">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 shadow-sm">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Still have questions?</h2>
              <p className="mt-2 leading-relaxed text-cyan-100 text-lg">
                Our support team is here to help you with anything you need.
              </p>
            </div>
            <Link to="/contact" className="decoration-none">
              <button className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-cyan-700 shadow-sm transition-colors hover:bg-amber-500 hover:text-white cursor-pointer border-none mt-2">
                <Mail className="h-5 w-5" />
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}