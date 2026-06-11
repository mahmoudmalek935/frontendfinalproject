import { FileText, ShieldCheck, CreditCard, Users, ArrowRight } from "lucide-react"

export default function Terms() {
  const handleAccept = () => {
    alert("Thanks for accepting the Terms of Service!");
    window.history.back(); // بيرجعه للصفحة اللي كان فيها
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 flex justify-center">
      <div className="mx-auto max-w-4xl w-full rounded-3xl bg-white p-6 shadow-sm sm:p-10 border border-slate-100 relative pb-28">
        {/* Header */}
        <header className="border-b border-slate-100 pb-8">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50">
            <FileText className="h-6 w-6 text-cyan-600" aria-hidden="true" />
          </div>
          <h1 className="text-pretty text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm font-medium text-slate-500">Last updated: June 2026</p>
          <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-slate-600 text-lg">
            Welcome to Baytak. These terms govern your access to and use of our platform connecting homeowners with
            trusted service providers. Please read them carefully.
          </p>
        </header>

        {/* Content */}
        <article className="mt-10 max-w-none text-slate-600">
          <section className="mb-10">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <ShieldCheck className="h-6 w-6 text-cyan-600" aria-hidden="true" />
              1. Agreement to Terms
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              By accessing or using Baytak, you agree to be bound by these Terms of Service and our Privacy Policy. If
              you do not agree to these terms, you may not use our platform. We reserve the right to modify these terms
              at any time, and your continued use constitutes acceptance of any changes.
            </p>
            <p className="mt-3 leading-relaxed text-slate-600">
              You must be at least 18 years old and capable of forming a binding contract to use Baytak. By creating an
              account, you confirm that the information you provide is accurate and complete.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <Users className="h-6 w-6 text-cyan-600" aria-hidden="true" />
              2. User Responsibilities
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              You are responsible for maintaining the confidentiality of your account credentials and for all activity
              that occurs under your account. You agree to use Baytak only for lawful purposes and in accordance with
              these terms.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-600 marker:text-cyan-600">
              <li>Provide accurate, current, and complete information during registration.</li>
              <li>Treat service providers and other users with respect and professionalism.</li>
              <li>Do not engage in fraudulent, abusive, or harmful behavior on the platform.</li>
              <li>Comply with all applicable local laws and regulations.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <CreditCard className="h-6 w-6 text-cyan-600" aria-hidden="true" />
              3. Payment and Fees
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              Baytak may charge fees for certain services. All fees are displayed before you confirm a booking and are
              billed through our secure payment partners. By completing a transaction, you authorize us to charge the
              applicable amount to your selected payment method.
            </p>
            <p className="mt-3 leading-relaxed text-slate-600">
              Refunds are handled in accordance with our refund policy. Service providers are responsible for setting
              their own rates, and Baytak retains a service fee on each completed booking as disclosed at the time of
              purchase.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <FileText className="h-6 w-6 text-cyan-600" aria-hidden="true" />
              4. Provider Guidelines
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              Service providers on Baytak agree to deliver services with professionalism, honesty, and care. Providers
              must hold any required licenses or certifications and maintain the standards expected by our community.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-600 marker:text-cyan-600">
              <li>Honor confirmed bookings and arrive on time for scheduled appointments.</li>
              <li>Accurately represent your skills, experience, and qualifications.</li>
              <li>Maintain clear and timely communication with clients.</li>
              <li>Resolve disputes in good faith and adhere to Baytak's quality standards.</li>
            </ul>
          </section>
        </article>

        {/* Sticky Accept Button */}
        {/* <div className="absolute bottom-0 left-0 right-0 bg-slate-50/90 backdrop-blur-sm border-t border-slate-200 p-6 rounded-b-3xl flex justify-end">
          <button 
            onClick={handleAccept}
            className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-xl transition-colors cursor-pointer border-none shadow-md"
          >
            I Accept these Terms <ArrowRight className="w-5 h-5" />
          </button>
        </div> */}
      </div>
    </main>
  )
}