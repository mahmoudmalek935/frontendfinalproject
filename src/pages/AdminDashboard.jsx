import { useState, useEffect } from "react"
import { Link } from "react-router-dom" 
import {
  Users,
  Briefcase,
  CheckCircle,
  Wallet,
  TrendingUp,
  MoreVertical,
  Settings,
  ClipboardList,
  Loader2,
  AlertCircle,
  CheckCircle2
} from "lucide-react"

export default function AdminDashboard() {
  // 🔴 States لتخزين الداتا الحقيقية من الباك إند
  const [isLoading, setIsLoading] = useState(true);
  const [statsData, setStatsData] = useState({ totalUsers: 0, activeProviders: 0, completedJobs: 0, revenue: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  // 🔴 States المودالز الشيك بدل الأليرت
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchDashboardOverview = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const [usersRes, provRes, ordersRes] = await Promise.all([
          fetch("https://localhost:7088/api/Auth", { headers: { "Authorization": `Bearer ${token}` } }),
          fetch("https://localhost:7088/api/Providers/admin/all", { headers: { "Authorization": `Bearer ${token}` } }),
          fetch("https://localhost:7088/api/Orders", { headers: { "Authorization": `Bearer ${token}` } })
        ]);

        const users = usersRes.ok ? await usersRes.json() : [];
        const providers = provRes.ok ? await provRes.json() : [];
        const orders = ordersRes.ok ? await ordersRes.json() : [];

        // 📊 حساب الأرقام للبطاقات اللي فوق
        const completedOrders = orders.filter(o => o.status === "Completed");
        
        // 🌟 التعديل السحري: هنستخرج العمال من الأوردرات (عشان نضمن إن حقل totalEarnings موجود) ونجمعهم بدون تكرار
        const uniqueProvidersFromOrders = [];
        orders.forEach(o => {
            if (o.provider && !uniqueProvidersFromOrders.some(p => p.id === o.provider.id)) {
                uniqueProvidersFromOrders.push(o.provider);
            }
        });

        // 💰 نجمع الأرباح من العمال اللي استخرجناهم
        const totalRev = uniqueProvidersFromOrders.reduce((sum, p) => {
            return sum + (Number(p.totalEarnings) || 0);
        }, 0);

        setStatsData({
          totalUsers: users.length,
          activeProviders: providers.filter(p => p.isActive).length,
          completedJobs: completedOrders.length,
          revenue: totalRev // 🔴 المفروض كده يقرأ الرقم صح 100%
        });

        // 👥 أحدث 4 مستخدمين سجلوا
        const sortedUsers = [...users].reverse().slice(0, 4);
        setRecentUsers(sortedUsers.map(u => {
          const isProvider = u.role?.toLowerCase() === "provider";
          const matchedProv = isProvider ? providers.find(p => p.userId === u.id) : null;
          return {
            name: u.fullName || "Unknown",
            role: isProvider ? (matchedProv?.serviceName ? `Provider (${matchedProv.serviceName})` : "Provider") : "Customer",
            status: isProvider ? (matchedProv?.isActive ? "Active" : "Pending") : "Active",
          };
        }));

        // 💸 أحدث 4 أوردرات (Transactions)
        const sortedOrders = [...orders].sort((a, b) => b.id - a.id).slice(0, 4);
        setRecentTransactions(sortedOrders.map(o => {
          const price = Number(o.totalPrice || o.price || (o.provider ? o.provider.pricePerVisit : 0) || 0);
          return {
            id: `#ORD-${o.id}`,
            service: o.service?.name || "Service Request",
            amount: `EGP ${price}`,
            commission: `EGP ${(price * 0.1).toFixed(2)}`,
            status: o.status || "Pending"
          };
        }));

      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        setErrorMessage("Connection error. Failed to load dashboard data."); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardOverview();
  }, []);

  const stats = [
    { label: "Total Users", value: statsData.totalUsers, increase: "Live", icon: Users, color: "text-cyan-600", bg: "bg-cyan-100" },
    { label: "Active Providers", value: statsData.activeProviders, increase: "Live", icon: Briefcase, color: "text-amber-600", bg: "bg-amber-100" },
    { label: "Completed Jobs", value: statsData.completedJobs, increase: "Live", icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
    { label: "Total Revenue", value: `EGP ${statsData.revenue}`, increase: "Live", icon: Wallet, color: "text-purple-600", bg: "bg-purple-100" },
  ]

  if (isLoading) {
    return <div className="min-h-screen bg-slate-100 flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-cyan-600" /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Quick Actions */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Overview</h1>
            <p className="mt-1 text-slate-600 font-medium">Platform performance at a glance.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* 1. Manage Categories */}
            <Link 
              to="/manage-categories" 
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm decoration-none"
            >
              <Settings className="w-4 h-4" />
              Manage Categories
            </Link>
            
            {/* 2. Manage Orders */}
            <Link 
              to="/manage-orders" 
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm decoration-none"
            >
              <ClipboardList className="w-4 h-4" />
              Manage Orders
            </Link>

            {/* 3. Manage Users */}
            <Link 
              to="/manage-users" 
              className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-700 transition-colors shadow-sm decoration-none border-none"
            >
              <Users className="w-4 h-4" />
              Manage Users
            </Link>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center justify-between transition-transform hover:-translate-y-1">
              <div>
                <p className="text-sm font-bold text-slate-500 mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-extrabold text-slate-900">{stat.value}</h3>
                  <span className="flex items-center text-xs font-bold text-green-600">
                    <TrendingUp className="w-3 h-3 mr-0.5" />
                    {stat.increase}
                  </span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Middle Section (Two columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Users */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-extrabold text-slate-900">Recent Users Joined</h2>
              <Link to="/manage-users" className="text-sm font-bold text-cyan-600 hover:text-cyan-700 bg-transparent border-none cursor-pointer decoration-none">
                View All
              </Link>
            </div>
            <div className="divide-y divide-slate-100 flex-1">
              {recentUsers.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-medium">No users found.</div>
              ) : (
                recentUsers.map((user, idx) => (
                  <div key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-extrabold text-sm shadow-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{user.name}</p>
                        <p className="text-xs font-medium text-slate-500">{user.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        {user.status}
                      </span>
                      <Link to="/manage-users" className="text-slate-400 hover:text-cyan-600 bg-transparent border-none cursor-pointer p-1 transition-colors decoration-none">
                        <MoreVertical className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-extrabold text-slate-900">Recent Transactions</h2>
              <Link to="/manage-orders" className="text-sm font-bold text-cyan-600 hover:text-cyan-700 bg-transparent border-none cursor-pointer decoration-none">
                View All
              </Link>
            </div>
            <div className="divide-y divide-slate-100 flex-1">
              {recentTransactions.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-medium">No transactions yet.</div>
              ) : (
                recentTransactions.map((trx, idx) => (
                  <div key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-slate-900">{trx.id}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                          trx.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                          trx.status === 'Canceled' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          'bg-cyan-50 text-cyan-700 border-cyan-200'
                        }`}>
                          {trx.status}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-500">{trx.service}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-slate-900">{trx.amount}</p>
                      <p className="text-xs font-bold text-cyan-600 mt-0.5">App Fee: {trx.commission}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ---------------- MODALS (رسائل النجاح والخطأ) ---------------- */}
      
      {/* Success Modal */}
      {successMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl animate-in zoom-in duration-300 border-2 border-green-100">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Success!</h3>
            <p className="mt-2 text-sm font-medium text-slate-500">
              {successMessage}
            </p>
            <button
              onClick={() => setSuccessMessage("")}
              className="mt-6 w-full rounded-xl bg-slate-100 py-2.5 font-bold text-slate-700 transition hover:bg-slate-200 border-none cursor-pointer"
            >
              Awesome
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
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

    </div>
  )
}