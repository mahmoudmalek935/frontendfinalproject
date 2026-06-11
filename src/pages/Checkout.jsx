import { useState } from "react"
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  UploadCloud,
  ShieldCheck,
  CheckCircle2,
  Star,
} from "lucide-react"

export default function Checkout() {
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [address, setAddress] = useState("")
  const [problem, setProblem] = useState("")
  const [fileName, setFileName] = useState("")

  const inspection = 150
  const tax = 20
  const total = inspection + tax

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setFileName(file.name)
  }

  // فنكشن وهمية عشان الزرار ميضربش إيرور لما ندوس عليه
  const handleConfirmBooking = (e) => {
    e.preventDefault();
    alert("تم تأكيد الحجز بنجاح! هنربطها بالباك إند قريب.");
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page heading */}
        <div className="mb-8">
          <p className="text-sm font-medium text-cyan-600">Baytak</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl text-balance">
            Book Your Service
          </h1>
          <p className="mt-2 text-slate-500">
            Fill in the details below to confirm your booking with the provider.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleConfirmBooking} className="rounded-2xl bg-white p-6 shadow-sm sm:p-8 border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Service Details</h2>
              <p className="mt-1 text-sm text-slate-500">
                Let us know when and where you need help.
              </p>

              {/* Date & Time */}
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="date" className="mb-2 block text-sm font-medium text-slate-700">
                    Preferred Date
                  </label>
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-600" />
                    <input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="time" className="mb-2 block text-sm font-medium text-slate-700">
                    Preferred Time
                  </label>
                  <div className="relative">
                    <Clock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-600" />
                    <input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="mt-5">
                <label htmlFor="address" className="mb-2 block text-sm font-medium text-slate-700">
                  Detailed Address
                </label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-cyan-600" />
                  <textarea
                    id="address"
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    placeholder="Building no., street, district, city, governorate (e.g. 12 El Tahrir St., Dokki, Giza)"
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  />
                </div>
              </div>

              {/* Problem description */}
              <div className="mt-5">
                <label htmlFor="problem" className="mb-2 block text-sm font-medium text-slate-700">
                  Problem Description
                </label>
                <div className="relative">
                  <FileText className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-cyan-600" />
                  <textarea
                    id="problem"
                    rows={5}
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    required
                    placeholder="Describe the electrical issue... e.g. The living room sockets stopped working and the breaker keeps tripping."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  />
                </div>
              </div>

              {/* File upload */}
              <div className="mt-5 mb-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Photos of the Problem (Optional)
                </label>
                <label
                  htmlFor="file-upload"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-cyan-400 hover:bg-cyan-50/40"
                >
                  <UploadCloud className="h-8 w-8 text-cyan-600" />
                  <span className="mt-3 text-sm font-medium text-slate-700">
                    Upload photos of the problem
                  </span>
                  <span className="mt-1 text-xs text-slate-400">
                    PNG, JPG up to 10MB
                  </span>
                  {fileName && (
                    <span className="mt-3 flex items-center gap-1.5 text-xs font-medium text-cyan-700">
                      <CheckCircle2 className="h-4 w-4" />
                      {fileName}
                    </span>
                  )}
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
              </div>
              
              {/* زرار التأكيد لو الموبايل الشاشة صغيرة (أوبشنال) */}
              <div className="mt-6 lg:hidden">
                <button type="submit" className="w-full rounded-xl bg-amber-500 py-3 font-bold text-white transition hover:bg-amber-600 border-none cursor-pointer">
                  Confirm Booking (Mobile)
                </button>
              </div>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-24 rounded-2xl border-2 border-cyan-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>

              {/* Provider info */}
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-100 p-3">
                <img
                  src="/provider-electrician.png"
                  alt="Karim Hassan"
                  className="h-12 w-12 rounded-full object-cover"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Pro' }}
                />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">Karim Hassan</p>
                  <p className="text-sm text-slate-500">Licensed Electrician</p>
                </div>
                <div className="ml-auto flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span className="text-xs font-semibold text-amber-700">4.9</span>
                </div>
              </div>

              {/* Price breakdown */}
              <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Inspection Visit</span>
                  <span className="font-medium text-slate-900">150 EGP</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Estimated Tax</span>
                  <span className="font-medium text-slate-900">20 EGP</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="font-bold text-slate-900">Total</span>
                <span className="text-xl font-bold text-cyan-600">{total} EGP</span>
              </div>

              {/* Confirm button (Desktop) */}
              <button
                type="submit"
                onClick={handleConfirmBooking}
                className="mt-6 w-full rounded-xl bg-amber-500 py-3 font-bold text-white transition hover:bg-amber-600 border-none cursor-pointer shadow-sm"
              >
                Confirm Booking
              </button>

              {/* Trust badge */}
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-cyan-50 border border-cyan-100 p-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-cyan-600" />
                <p className="text-xs leading-relaxed text-cyan-800 font-medium">
                  Payment is done securely after the job is completed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}