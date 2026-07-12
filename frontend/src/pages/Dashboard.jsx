import { useEffect, useState } from 'react';
import { Truck, CheckCircle, Wrench, Map, Users, Percent, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/api';

// Dummy Data for the Charts
const tripStatusData = [
  { name: 'Completed', value: 45, color: '#22c55e' },
  { name: 'On Trip', value: 25, color: '#3b82f6' },
  { name: 'Pending', value: 15, color: '#f59e0b' },
  { name: 'Cancelled', value: 5, color: '#ef4444' }
];

const costData = [
  { name: 'Jan', fuel: 4000, maintenance: 2400 },
  { name: 'Feb', fuel: 3000, maintenance: 1398 },
  { name: 'Mar', fuel: 2000, maintenance: 9800 },
  { name: 'Apr', fuel: 2780, maintenance: 3908 },
  { name: 'May', fuel: 1890, maintenance: 4800 },
  { name: 'Jun', fuel: 2390, maintenance: 3800 },
];

const recentActivity = [
  { id: 1, action: 'Trip Completed', entity: 'Truck NY-402', time: '10 mins ago', status: 'success' },
  { id: 2, action: 'Vehicle Assigned', entity: 'Driver: John Doe', time: '1 hour ago', status: 'primary' },
  { id: 3, action: 'Maintenance Created', entity: 'Van LV-009', time: '3 hours ago', status: 'warning' },
  { id: 4, action: 'Trip Dispatched', entity: 'Truck TX-112', time: '5 hours ago', status: 'primary' },
];

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({});

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('dashboard/');
        setDashboardData(response.data || {});
      } catch (err) {
        console.error(err);
        setDashboardData({});
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="space-y-6 relative">
      <div className="absolute -top-10 right-8 w-56 h-56 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
      <div className="absolute top-28 left-0 w-72 h-72 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50/80 p-6 shadow-sm">
        <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_65%)] pointer-events-none"></div>
        <div className="relative flex flex-col gap-2">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
            Live Fleet Overview
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Operational Dashboard</h1>
          <p className="max-w-2xl text-sm text-slate-600">A real-time snapshot of fleet health, utilization, trip activity, and operating cost indicators pulled directly from the backend.</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {[
          { title: "Total Vehicles", value: dashboardData.total_vehicles ?? "0", icon: Truck, color: "text-blue-600", bg: "bg-blue-50" },
          { title: "Available Vehicles", value: dashboardData.available_vehicles ?? "0", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
          { title: "Maintenance", value: dashboardData.maintenance ?? "0", icon: Wrench, color: "text-amber-600", bg: "bg-amber-50" },
          { title: "Active Trips", value: dashboardData.active_trips ?? "0", icon: Map, color: "text-blue-600", bg: "bg-blue-50" },
          { title: "Drivers On Duty", value: dashboardData.drivers_on_duty ?? "0", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
          { title: "Fleet Utilization", value: `${dashboardData.fleet_utilization ?? 0}%`, icon: Percent, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
             <div key={idx} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.45)] backdrop-blur-sm transition-transform duration-200 hover:-translate-y-1">
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-10`} />
                <div className={`w-12 h-12 rounded-2xl ${kpi.bg} flex items-center justify-center ring-1 ring-inset ring-white shadow-sm`}>
                  <Icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
                <div className="mt-4">
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{kpi.title}</p>
                  <h3 className="mt-1 text-3xl font-black tracking-tight text-slate-900">{kpi.value}</h3>
                </div>
             </div>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Trip Status Pie Chart */}
        <div className="col-span-1 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.45)] backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-black tracking-tight text-slate-900">Trip Status</h3>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">Today</span>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={tripStatusData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {tripStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 flex-wrap text-sm">
            {tripStatusData.map(item => (
              <div key={item.name} className="flex items-center gap-1.5 border border-slate-100 px-2 py-1 rounded-md">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-slate-600 font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Analysis Bar Chart */}
        <div className="col-span-1 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.45)] backdrop-blur-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-black tracking-tight text-slate-900">Monthly Operational Costs</h3>
              <p className="text-sm text-slate-500">Fuel versus maintenance spend across recent months.</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-600">
              <ArrowDownRight size={16} /> 4.2% from last month
            </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="fuel" name="Fuel ($)" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="maintenance" name="Maintenance ($)" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recent Activity Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.45)] backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h3 className="text-lg font-black tracking-tight text-slate-900">Recent Activity</h3>
            <p className="text-sm text-slate-500">Latest operational updates from the fleet.</p>
          </div>
          <button className="text-sm font-semibold text-primary hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-sm text-slate-500">
                <th className="px-6 py-3 font-semibold">Action</th>
                <th className="px-6 py-3 font-semibold">Related Entity</th>
                <th className="px-6 py-3 font-semibold text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentActivity.map((activity) => (
                <tr key={activity.id} className="transition-colors hover:bg-slate-50/70">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full bg-${activity.status} shadow-sm`}></div>
                      <span className="font-semibold text-slate-800">{activity.action}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{activity.entity}</td>
                  <td className="px-6 py-4 text-slate-500 text-right text-sm">{activity.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
