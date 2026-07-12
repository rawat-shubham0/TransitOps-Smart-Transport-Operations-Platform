import { useEffect, useState } from 'react';
import api from '../api/api';

export default function Reports() {
  const [dashboardData, setDashboardData] = useState({});

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('dashboard/');
        setDashboardData(response.data || {});
      } catch (err) {
        console.error(err);
        setDashboardData({});
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 min-h-[400px]">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Fleet Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-slate-100 p-4"><p className="text-sm text-slate-500">Total Fuel Cost</p><h3 className="text-2xl font-bold text-slate-800">{dashboardData.fuel_cost ?? 0}</h3></div>
        <div className="rounded-lg border border-slate-100 p-4"><p className="text-sm text-slate-500">Total Expense Cost</p><h3 className="text-2xl font-bold text-slate-800">{dashboardData.expense_cost ?? 0}</h3></div>
        <div className="rounded-lg border border-slate-100 p-4"><p className="text-sm text-slate-500">Fleet Utilization</p><h3 className="text-2xl font-bold text-slate-800">{dashboardData.fleet_utilization ?? 0}%</h3></div>
      </div>
    </div>
  );
}
