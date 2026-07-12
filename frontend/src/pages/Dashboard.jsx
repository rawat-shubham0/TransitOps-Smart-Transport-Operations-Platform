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
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Operational Dashboard</h1>
        <p className="text-slate-500">Welcome back! Here is what's happening today.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
             <div key={idx} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{kpi.title}</p>
                  <h3 className="text-2xl font-bold text-slate-800">{kpi.value}</h3>
                </div>
             </div>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trip Status Pie Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm col-span-1">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Trip Status</h3>
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
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Monthly Operational Costs</h3>
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-2 py-1 rounded font-medium">
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
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
          <button className="text-primary text-sm font-medium hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                <th className="px-6 py-3 font-semibold">Action</th>
                <th className="px-6 py-3 font-semibold">Related Entity</th>
                <th className="px-6 py-3 font-semibold text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentActivity.map((activity) => (
                <tr key={activity.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full bg-${activity.status}`}></div>
                      <span className="font-semibold text-slate-700">{activity.action}</span>
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
