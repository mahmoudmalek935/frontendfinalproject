import { useState } from 'react';
import { Star, MessageSquare, Clock, CheckCircle2, AlertCircle, XCircle, RotateCcw } from 'lucide-react';

export default function MyRequests() {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Pending', 'In Progress', 'Completed', 'Cancelled'];

  const requests = [
    {
      id: 1024,
      date: 'Oct 25, 2026',
      status: 'In Progress',
      statusColor: 'bg-cyan-100 text-cyan-700',
      statusIcon: Clock,
      service: 'Electrical Wiring Repair',
      provider: 'Karim Hassan',
      avatar: 'K',
      actions: ['View Details', 'Message Provider'],
    },
    {
      id: 1025,
      date: 'Oct 26, 2026',
      status: 'Pending Approval',
      statusColor: 'bg-amber-100 text-amber-700',
      statusIcon: AlertCircle,
      service: 'Deep Home Cleaning',
      provider: 'Searching for expert...',
      avatar: null,
      actions: ['Cancel Request'],
    },
    {
      id: 1010,
      date: 'Oct 10, 2026',
      status: 'Completed',
      statusColor: 'bg-green-100 text-green-700',
      statusIcon: CheckCircle2,
      service: 'Plumbing Fix',
      provider: 'Mostafa Ali',
      avatar: 'M',
      paid: '350 EGP',
      actions: ['Rate Service', 'Rebook'],
    },
  ];

  return (
    <div className="py-12 bg-slate-100 text-slate-900">
      <div className="max-w-4xl mx-auto px-6">
        {/* Dashboard Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Service Requests</h1>
          <p className="text-slate-600 mb-8">Track and manage your home service bookings.</p>

          {/* Quick Summary Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <div className="text-sm text-slate-600 font-medium">Total Requests</div>
              <div className="text-3xl font-bold text-slate-900 mt-2">3</div>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <div className="text-sm text-slate-600 font-medium">Pending</div>
              <div className="text-3xl font-bold text-amber-500 mt-2">1</div>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <div className="text-sm text-slate-600 font-medium">Completed</div>
              <div className="text-3xl font-bold text-green-600 mt-2">2</div>
            </div>
          </div>
        </div>

        {/* Filter/Tabs Row */}
        <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === filter
                  ? 'bg-cyan-600 text-white border-cyan-600'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {requests.map((request) => {
            const StatusIcon = request.statusIcon;
            return (
              <div
                key={request.id}
                className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between bg-slate-50 px-6 py-4 border-b border-slate-200">
                  <div>
                    <p className="font-semibold text-slate-900">Order #{request.id}</p>
                    <p className="text-sm text-slate-600">Date: {request.date}</p>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${request.statusColor}`}>
                    <StatusIcon className="w-4 h-4" />
                    <span className="font-medium text-sm">{request.status}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="px-6 py-5">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">{request.service}</h3>
                  <div className="flex items-center gap-3">
                    {request.avatar ? (
                      <div className="w-10 h-10 bg-cyan-600 text-white rounded-full flex items-center justify-center font-semibold">
                        {request.avatar}
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                        <Clock className="w-5 h-5 text-slate-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">Provider: {request.provider}</p>
                      {request.paid && <p className="text-sm text-slate-600">Total Paid: {request.paid}</p>}
                    </div>
                  </div>
                </div>

                {/* Card Footer/Actions */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex gap-3">
                  {request.actions.map((action) => {
                    let buttonStyle = 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50';
                    let icon = null;

                    if (action === 'Message Provider') {
                      icon = MessageSquare;
                    } else if (action === 'Rate Service') {
                      icon = Star;
                      buttonStyle = 'bg-amber-100 text-amber-600 border border-amber-200 hover:bg-amber-50 border-none';
                    } else if (action === 'Cancel Request') {
                      icon = XCircle;
                      buttonStyle = 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 border-none';
                    } else if (action === 'Rebook') {
                      icon = RotateCcw;
                      buttonStyle = 'bg-cyan-100 text-cyan-600 border border-cyan-200 hover:bg-cyan-50 border-none';
                    } else if (action === 'View Details') {
                      buttonStyle = 'bg-cyan-600 text-white hover:bg-cyan-700 border-none';
                    }

                    const Icon = icon;

                    return (
                      <button
                        key={action}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 cursor-pointer ${buttonStyle}`}
                      >
                        {Icon && <Icon className="w-4 h-4" />}
                        {action}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}