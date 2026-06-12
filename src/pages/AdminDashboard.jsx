import { useState } from "react"
import { Link } from "react-router-dom" 
import {
  Users,
  Briefcase,
  CheckCircle,
  Wallet,
  TrendingUp,
  Clock,
  MoreVertical,
  Settings, 
} from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    { label: "Total Users", value: "2,450", increase: "+12%", icon: Users, color: "text-cyan-600", bg: "bg-cyan-100" },
    { label: "Active Providers", value: "185", increase: "+5%", icon: Briefcase, color: "text-amber-600", bg: "bg-amber-100" },
    { label: "Completed Jobs", value: "1,204", increase: "+18%", icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
    { label: "Total Revenue", value: "EGP 45,200", increase: "+8%", icon: Wallet, color: "text-purple-600", bg: "bg-purple-100" },
  ]

  const recentUsers = [
    { name: "Ahmed Youssef", role: "Customer", status: "Active", date: "Today" },
    { name: "Salma Nabil", role: "Provider (Cleaning)", status: "Pending", date: "Yesterday" },
    { name: "Mostafa Gamal", role: "Customer", status: "Active", date: "Yesterday" },
    { name: "Karim Hassan", role: "Provider (Electrical)", status: "Active", date: "2 days ago" },
  ]

  const recentTransactions = [
    { id: "#TRX-1029", service: "Plumbing Repair", amount: "EGP 350", commission: "EGP 35", status: "Completed" },
    { id: "#TRX-1028", service: "AC Maintenance", amount: "EGP 450", commission: "EGP 45", status: "Completed" },
    { id: "#TRX-1027", service: "House Cleaning", amount: "EGP 200", commission: "EGP 20", status: "Pending" },
    { id: "#TRX-1026", service: "Electrical Fix", amount: "EGP 150", commission: "EGP 15", status: "Completed" },
  ]

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Quick Actions */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Overview</h1>
            <p className="mt-1 text-slate-600 font-medium">Platform performance at a glance.</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* 🔴 اتعدلت لـ /manage-categories 🔴 */}
            <Link 
              to="/manage-categories" 
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm decoration-none"
            >
              <Settings className="w-4 h-4" />
              Manage Categories
            </Link>
            {/* 🔴 اتعدلت لـ /manage-users 🔴 */}
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
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center justify-between">
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
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-extrabold text-slate-900">Recent Users Joined</h2>
              {/* 🔴 اتعدلت لـ /manage-users 🔴 */}
              <Link to="/manage-users" className="text-sm font-bold text-cyan-600 hover:text-cyan-700 bg-transparent border-none cursor-pointer decoration-none">
                View All
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {recentUsers.map((user, idx) => (
                <div key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-extrabold text-sm shadow-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs font-medium text-slate-500">{user.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${user.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      {user.status}
                    </span>
                    <button className="text-slate-400 hover:text-cyan-600 bg-transparent border-none cursor-pointer p-1 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-extrabold text-slate-900">Recent Transactions</h2>
              <button className="text-sm font-bold text-cyan-600 hover:text-cyan-700 bg-transparent border-none cursor-pointer decoration-none">
                View All
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {recentTransactions.map((trx, idx) => (
                <div key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-slate-900">{trx.id}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${trx.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        {trx.status}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-500">{trx.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-slate-900">{trx.amount}</p>
                    <p className="text-xs font-bold text-cyan-600 mt-0.5">Fee: {trx.commission}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}