import { ShieldCheck, Award, Tag, Users, BadgeCheck, TrendingUp } from "lucide-react"

export default function About() {
  const stats = [
    { icon: Users, value: "10,000+", label: "Happy Customers" },
    { icon: BadgeCheck, value: "500+", label: "Verified Pros" },
    { icon: TrendingUp, value: "99%", label: "Success Rate" },
  ]

  const values = [
    {
      icon: ShieldCheck,
      title: "Trust & Safety",
      description: "Every professional is thoroughly vetted and background-checked, so you can welcome them into your home with complete peace of mind.",
    },
    {
      icon: Award,
      title: "Expert Quality",
      description: "We partner only with skilled, experienced professionals who take pride in their craft and deliver work that lasts.",
    },
    {
      icon: Tag,
      title: "Transparent Pricing",
      description: "No hidden fees, no surprises. Clear, upfront pricing means you always know exactly what you're paying for.",
    },
  ]

  return (
    <main className="bg-white text-slate-900 font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cyan-50 via-cyan-50/40 to-white">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-28 text-center">
          <p className="mb-6 inline-block rounded-full bg-cyan-100 px-4 py-1.5 text-sm font-medium text-cyan-700">
            About Baytak
          </p>
          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
            Revolutionizing Home Services in <span className="text-cyan-600">Egypt.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-slate-600 md:text-xl">
            We're building the most trusted way for homeowners to find skilled professionals — fast, safe, and without the guesswork.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-amber-500">Our Mission</h2>
        <p className="mt-6 text-balance text-2xl font-medium leading-relaxed text-slate-800 md:text-3xl">
          Baytak connects trusted professionals with homeowners <span className="text-cyan-600">instantly</span> — ensuring every service is delivered with uncompromising quality and safety.
        </p>
      </section>

      {/* Stats Row */}
      <section className="border-y border-slate-100 bg-slate-50/50">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 px-6 py-16 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600">
                <stat.icon className="h-7 w-7" />
              </div>
              <div className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">{stat.value}</div>
              <div className="mt-2 text-base font-medium text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-amber-500">What We Stand For</h2>
          <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Our Core Values</p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="rounded-2xl bg-slate-50 p-6 transition-shadow hover:shadow-lg border border-slate-100">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-600 text-white">
                <value.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{value.title}</h3>
              <p className="mt-3 text-pretty leading-relaxed text-slate-600">{value.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}