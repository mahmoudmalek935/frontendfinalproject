import { useState } from "react"
import {
  Users,
  Briefcase,
  CheckCircle,
  Wallet,
  TrendingUp,
  Clock,
  MoreVertical,
} from "lucide-react"

export default function AdminDashboard() {
  // بيانات وهمية للداشبورد
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Admin Overview</h1>
          <p className="mt-1 text-slate-600">Platform performance at a glance.</p>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                  <span className="flex items-center text-xs font-semibold text-green-600">
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
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">Recent Users Joined</h2>
              <button className="text-sm font-semibold text-cyan-600 hover:text-cyan-700 bg-transparent border-none cursor-pointer">View All</button>
            </div>
            <div className="divide-y divide-slate-100">
              {recentUsers.map((user, idx) => (
                <div key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                      {user.status}
                    </span>
                    <button className="text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-1">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
              <button className="text-sm font-semibold text-cyan-600 hover:text-cyan-700 bg-transparent border-none cursor-pointer">View All</button>
            </div>
            <div className="divide-y divide-slate-100">
              {recentTransactions.map((trx, idx) => (
                <div key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-slate-900">{trx.id}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${trx.status === 'Completed' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                        {trx.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{trx.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{trx.amount}</p>
                    <p className="text-xs font-medium text-cyan-600">Fee: {trx.commission}</p>
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