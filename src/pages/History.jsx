import { Calendar, User, Download, CheckCircle2, XCircle, Wrench } from "lucide-react"

const SERVICE_HISTORY = [
  {
    id: "1",
    date: "May 12, 2026",
    title: "Plumbing Repair",
    provider: "Ahmed Hassan",
    price: "EGP 250",
    status: "Completed",
  },
  {
    id: "2",
    date: "Apr 28, 2026",
    title: "AC Maintenance",
    provider: "CoolTech Services",
    price: "EGP 400",
    status: "Completed",
  },
  {
    id: "3",
    date: "Apr 15, 2026",
    title: "Electrical Inspection",
    provider: "Mostafa Electric",
    price: "EGP 180",
    status: "Canceled",
  },
  {
    id: "4",
    date: "Mar 30, 2026",
    title: "Deep Home Cleaning",
    provider: "SparkleClean Co.",
    price: "EGP 600",
    status: "Completed",
  },
  {
    id: "5",
    date: "Mar 09, 2026",
    title: "Carpentry Work",
    provider: "Tarek Woodworks",
    price: "EGP 320",
    status: "Canceled",
  },
]

function StatusBadge({ status }) {
  const isCompleted = status === "Completed"
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
        isCompleted ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
      {status}
    </span>
  )
}

export default function History() {
  const handleDownload = (id) => {
    alert(`Downloading receipt for booking #${id}...`);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <header className="mb-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Service History</h1>
          <p className="mt-2 text-base leading-relaxed text-slate-500">
            A complete record of all the services you've booked with Baytak. Review past jobs, providers, and
            download receipts for completed work.
          </p>
        </header>

        {/* List Card */}
        <div className="rounded-3xl bg-white p-2 sm:p-6 shadow-sm border border-slate-100">
          <ul className="flex flex-col m-0 p-0 list-none">
            {SERVICE_HISTORY.map((record, index) => (
              <li
                key={record.id}
                className={`flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between transition-colors hover:bg-slate-50 rounded-2xl ${
                  index !== SERVICE_HISTORY.length - 1 ? "border-b border-slate-100" : ""
                }`}
              >
                {/* Left: icon + details */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                    <Wrench className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h2 className="text-lg font-bold text-slate-900">{record.title}</h2>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        {record.date}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <User className="h-4 w-4 text-slate-400" />
                        {record.provider}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: price + status + action */}
                <div className="flex items-center justify-between gap-4 pl-[4.25rem] sm:justify-end sm:pl-0">
                  <span className="text-lg font-black text-slate-900">{record.price}</span>
                  <StatusBadge status={record.status} />
                  
                  {record.status === "Completed" ? (
                    <button
                      type="button"
                      onClick={() => handleDownload(record.id)}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border-2 border-cyan-100 bg-white px-4 py-2 text-sm font-bold text-cyan-700 transition-colors hover:bg-cyan-50 hover:border-cyan-200 focus:outline-none cursor-pointer"
                    >
                      <Download className="h-4 w-4" />
                      Receipt
                    </button>
                  ) : (
                    // مساحة فاضية لو الطلب ملغي عشان نحافظ على التصميم
                    <div className="w-[105px]"></div> 
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}