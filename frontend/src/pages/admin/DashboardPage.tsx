import React from 'react';
import { TrendingUp, Users, Clock, Scissors } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const stats = [
    { label: 'Today\'s Revenue', value: '$1,240', icon: <TrendingUp className="text-green-600" />, change: '+12%' },
    { label: 'Active in Queue', value: '8', icon: <Clock className="text-blue-600" />, change: 'Avg. 25m' },
    { label: 'Total Clients', value: '1,420', icon: <Users className="text-purple-600" />, change: '+48 this month' },
    { label: 'Completed Cuts', value: '24', icon: <Scissors className="text-amber-600" />, change: 'Today' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-50 rounded-lg">{stat.icon}</div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg mb-4">Live Queue</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1E3A5F] text-white rounded-full flex items-center justify-center font-bold">
                    JD
                  </div>
                  <div>
                    <p className="font-semibold text-sm">John Doe</p>
                    <p className="text-xs text-slate-500">Skin Fade • Barber: Mike</p>
                  </div>
                </div>
                <span className="text-xs font-medium bg-amber-100 text-amber-800 px-2 py-1 rounded">
                  Waiting (15m)
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg mb-4">Recent Bookings</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100">
                  <th className="pb-3 font-medium">Client</th>
                  <th className="pb-3 font-medium">Service</th>
                  <th className="pb-3 font-medium">Time</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[1, 2, 3].map((i) => (
                  <tr key={i}>
                    <td className="py-4 font-medium">Alex Smith</td>
                    <td className="py-4 text-slate-500">Beard Trim</td>
                    <td className="py-4 text-slate-500">2:30 PM</td>
                    <td className="py-4">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Confirmed</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;