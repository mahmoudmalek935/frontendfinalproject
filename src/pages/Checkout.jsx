import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  UploadCloud,
  ShieldCheck,
  CheckCircle2,
  Star,
  Loader2,
  AlertCircle 
} from "lucide-react"

export default function Checkout() {
  const { id } = useParams() 
  const navigate = useNavigate()

  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [address, setAddress] = useState("")
  const [problem, setProblem] = useState("")
  const [fileName, setFileName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [formError, setFormError] = useState("") 
  const [errors, setErrors] = useState({}) 
  const [errorMessage, setErrorMessage] = useState("")

  const [providerData, setProviderData] = useState(null)
  const [isFetchingProvider, setIsFetchingProvider] = useState(true)

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        if (!id) {
          setIsFetchingProvider(false);
          return;
        }
        const response = await fetch(`https://localhost:7088/api/providers/${id}`);
        if (!response.ok) throw new Error("Provider not found");
        const data = await response.json();
        setProviderData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetchingProvider(false);
      }
    };

    fetchProvider();
  }, [id]);

  const inspection = providerData?.price || 0;
  const tax = 20;
  const total = inspection + tax;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setFileName(file.name)
  }

  const handleConfirmBooking = async (e) => {
    if (e) e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginModal(true);
      setTimeout(() => {
        navigate('/login', { state: { from: `/checkout/${id}` } });
      }, 2500);
      return;
    }

    const newErrors = {};
    if (!date) newErrors.date = "Required field";
    if (!time) newErrors.time = "Required field";
    if (!address) newErrors.address = "Required field";
    if (!problem) newErrors.problem = "Required field";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setFormError("Please fill in all required fields.");
      return; 
    }

    setErrors({});
    setFormError("");

    if (!providerData) {
      setErrorMessage("Provider details are incomplete. Cannot proceed with booking.");
      return;
    }

    const serviceId = providerData?.serviceId || providerData?.ServiceId;
    try {
      setIsLoading(true);

      const formData = new FormData();
      // 🔴 الأسماء هنا كابيتال عشان تطابق الـ CreateOrderDto في الباك إند
      formData.append("ProviderId", id); 
      formData.append("ServiceId", serviceId); 
      formData.append("District", address);
      formData.append("Notes", `Date: ${date}, Time: ${time} | Problem: ${problem}`);
      formData.append("Urgency", "Low"); 

      const fileInput = document.getElementById("file-upload");
      if (fileInput && fileInput.files.length > 0) {
        formData.append("Image", fileInput.files[0]); 
      }

      const response = await fetch('https://localhost:7088/api/Orders/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}` 
        },
        body: formData 
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(responseText || 'Failed to confirm booking');
      }

      setShowSuccessModal(true);
      
      setTimeout(() => {
        navigate('/my-requests'); 
      }, 3000);

    } catch (error) {
      console.error("Error confirming booking:", error);
      setErrorMessage(`Backend Error: ${error.message}`); 
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetchingProvider && id) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-10 h-10 animate-spin text-cyan-600" /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8 relative">
      <div className="mx-auto max-w-6xl">
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
          <div className="lg:col-span-2">
            <form onSubmit={handleConfirmBooking} noValidate className="rounded-2xl bg-white p-6 shadow-sm sm:p-8 border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Service Details</h2>
              <p className="mt-1 text-sm text-slate-500 mb-6">
                Let us know when and where you need help.
              </p>

              {formError && (
                <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 p-4 text-sm font-bold text-red-700">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="date" className="mb-2 block text-sm font-medium text-slate-700">Preferred Date</label>
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-600" />
                    <input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                        if (errors.date) setErrors({ ...errors, date: null }); 
                      }}
                      className={`w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition ${errors.date ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100' : 'border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100'}`}
                    />
                  </div>
                  {errors.date && <p className="mt-1.5 text-xs font-bold text-red-500">{errors.date}</p>}
                </div>

                <div>
                  <label htmlFor="time" className="mb-2 block text-sm font-medium text-slate-700">Preferred Time</label>
                  <div className="relative">
                    <Clock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-600" />
                    <input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => {
                        setTime(e.target.value);
                        if (errors.time) setErrors({ ...errors, time: null });
                      }}
                      className={`w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition ${errors.time ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100' : 'border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100'}`}
                    />
                  </div>
                  {errors.time && <p className="mt-1.5 text-xs font-bold text-red-500">{errors.time}</p>}
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="address" className="mb-2 block text-sm font-medium text-slate-700">Detailed Address</label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-cyan-600" />
                  <textarea
                    id="address"
                    rows={3}
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address) setErrors({ ...errors, address: null });
                    }}
                    placeholder="Building no., street, district, city, governorate..."
                    className={`w-full resize-none rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 outline-none transition ${errors.address ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100' : 'border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100'}`}
                  />
                </div>
                {errors.address && <p className="mt-1.5 text-xs font-bold text-red-500">{errors.address}</p>}
              </div>

              <div className="mt-5">
                <label htmlFor="problem" className="mb-2 block text-sm font-medium text-slate-700">Problem Description</label>
                <div className="relative">
                  <FileText className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-cyan-600" />
                  <textarea
                    id="problem"
                    rows={5}
                    value={problem}
                    onChange={(e) => {
                      setProblem(e.target.value);
                      if (errors.problem) setErrors({ ...errors, problem: null });
                    }}
                    placeholder="Describe the issue..."
                    className={`w-full resize-none rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 outline-none transition ${errors.problem ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100' : 'border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100'}`}
                  />
                </div>
                {errors.problem && <p className="mt-1.5 text-xs font-bold text-red-500">{errors.problem}</p>}
              </div>

              <div className="mt-5 mb-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">Photos of the Problem (Optional)</label>
                <label
                  htmlFor="file-upload"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-cyan-400 hover:bg-cyan-50/40"
                >
                  <UploadCloud className="h-8 w-8 text-cyan-600" />
                  <span className="mt-3 text-sm font-medium text-slate-700">Upload photos of the problem</span>
                  <span className="mt-1 text-xs text-slate-400">PNG, JPG up to 10MB</span>
                  {fileName && (
                    <span className="mt-3 flex items-center gap-1.5 text-xs font-bold text-cyan-700">
                      <CheckCircle2 className="h-4 w-4" /> {fileName}
                    </span>
                  )}
                  <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
                </label>
              </div>
              
              <div className="mt-6 lg:hidden">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 font-bold text-white transition hover:bg-amber-600 border-none cursor-pointer disabled:opacity-70"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-24 rounded-2xl border-2 border-cyan-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>

              <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-100 p-3">
                <img
                  src={providerData?.profilePicture ? `https://localhost:7088${providerData.profilePicture}` : "/provider-electrician.png"}
                  alt={providerData?.fullName || "Provider"}
                  className="h-12 w-12 rounded-full object-cover"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Pro' }}
                />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{providerData?.fullName || "Loading..."}</p>
                  <p className="text-sm text-slate-500">{providerData?.serviceName || "Service"}</p>
                </div>
                <div className="ml-auto flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span className="text-xs font-semibold text-amber-700">
                    {providerData?.rating ? providerData.rating.toFixed(1) : "0.0"}
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Inspection Visit</span>
                  <span className="font-medium text-slate-900">{inspection} EGP</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Estimated Tax</span>
                  <span className="font-medium text-slate-900">{tax} EGP</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="font-bold text-slate-900">Total</span>
                <span className="text-xl font-bold text-cyan-600">{total} EGP</span>
              </div>

              <button
                type="button"
                disabled={isLoading}
                onClick={handleConfirmBooking}
                className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 font-bold text-white transition hover:bg-amber-600 border-none cursor-pointer shadow-sm disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Booking"}
              </button>

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

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl animate-in zoom-in duration-300 border-2 border-amber-100">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
              <AlertCircle className="h-8 w-8 text-amber-500" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Please Login First</h3>
            <p className="mt-2 text-sm font-medium text-slate-500">
              You need to log in to book this service. Redirecting you securely...
            </p>
            <div className="mt-6 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-cyan-600" />
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl animate-in zoom-in duration-300 border-2 border-red-100">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Oops!</h3>
            <p className="mt-2 text-sm font-medium text-slate-500">
              {errorMessage}
            </p>
            <button
              onClick={() => setErrorMessage("")}
              className="mt-6 w-full rounded-xl bg-slate-100 py-2.5 font-bold text-slate-700 transition hover:bg-slate-200 border-none cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl animate-in zoom-in duration-300 border-2 border-green-100">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Booking Confirmed!</h3>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Your request has been sent successfully. We'll redirect you momentarily...
            </p>
            <div className="mt-6 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-cyan-600" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}