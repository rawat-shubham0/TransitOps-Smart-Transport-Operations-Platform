import { useEffect, useState } from 'react';
import api from '../api/api';

export default function Reports() {
  const [dashboardData, setDashboardData] = useState({});
  const [trips, setTrips] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [fuel, setFuel] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [dashboardResponse, tripsResponse, maintenanceResponse, fuelResponse, expensesResponse] = await Promise.all([
          api.get('dashboard/'),
          api.get('trips/'),
          api.get('maintenance/'),
          api.get('fuel/'),
          api.get('expenses/'),
        ]);
        setDashboardData(dashboardResponse.data || {});
        setTrips(tripsResponse.data || []);
        setMaintenance(maintenanceResponse.data || []);
        setFuel(fuelResponse.data || []);
        setExpenses(expensesResponse.data || []);
      } catch (err) {
        console.error(err);
        setDashboardData({});
        setTrips([]);
        setMaintenance([]);
        setFuel([]);
        setExpenses([]);
      }
    };

    fetchReports();
  }, []);

  const totalOperatingCost = (Number(dashboardData.fuel_cost || 0) + Number(dashboardData.expense_cost || 0));

  const getVehicleLabel = (vehicleId) => {
    const allRecords = [...fuel, ...expenses, ...maintenance, ...trips];
    const match = allRecords.find((record) => record.vehicle === vehicleId || record.vehicle?.id === vehicleId);
    return match?.vehicle?.registration_number || vehicleId;
  };

  const getDriverLabel = (driverId) => {
    const match = trips.find((trip) => trip.driver === driverId || trip.driver?.id === driverId);
    return match?.driver?.name || driverId;
  };

  return (
    <div className="space-y-6 relative">
      <div className="absolute -top-8 right-8 w-56 h-56 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
      <div className="absolute top-20 left-0 w-72 h-72 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none"></div>

      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50/80 p-6 shadow-sm">
        <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_65%)] pointer-events-none"></div>
        <div className="relative flex flex-col gap-2">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
            Finance Snapshot
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Fleet Analytics</h2>
          <p className="max-w-2xl text-sm text-slate-600">Cost and utilization metrics are pulled from the live dashboard API so this view stays in sync with the operational data.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.45)] backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Fuel Cost</p>
          <h3 className="mt-2 text-3xl font-black tracking-tight text-blue-600">{dashboardData.fuel_cost ?? 0}</h3>
          <p className="mt-1 text-sm text-slate-500">All fuel purchases recorded in the system.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.45)] backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Expense Cost</p>
          <h3 className="mt-2 text-3xl font-black tracking-tight text-amber-600">{dashboardData.expense_cost ?? 0}</h3>
          <p className="mt-1 text-sm text-slate-500">Operational and vehicle expense totals.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.45)] backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fleet Utilization</p>
          <h3 className="mt-2 text-3xl font-black tracking-tight text-emerald-600">{dashboardData.fleet_utilization ?? 0}%</h3>
          <p className="mt-1 text-sm text-slate-500">Active trips compared with total fleet size.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.45)] backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Operating Cost</p>
          <h3 className="mt-2 text-3xl font-black tracking-tight text-slate-900">{totalOperatingCost}</h3>
          <p className="mt-1 text-sm text-slate-500">Fuel plus expense cost combined.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.45)] backdrop-blur-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h3 className="text-lg font-black tracking-tight text-slate-900">Trips Report</h3>
            <p className="text-sm text-slate-500">Trip records currently stored in the backend.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-sm text-slate-500">
                  <th className="px-6 py-3 font-semibold">Vehicle</th>
                  <th className="px-6 py-3 font-semibold">Driver</th>
                  <th className="px-6 py-3 font-semibold">Route</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trips.map((trip) => (
                  <tr key={trip.id} className="transition-colors hover:bg-slate-50/70">
                    <td className="px-6 py-4 text-slate-700">{getVehicleLabel(trip.vehicle)}</td>
                    <td className="px-6 py-4 text-slate-700">{getDriverLabel(trip.driver)}</td>
                    <td className="px-6 py-4 text-slate-600">{trip.source} → {trip.destination}</td>
                    <td className="px-6 py-4 text-slate-600">{trip.status}</td>
                  </tr>
                ))}
                {trips.length === 0 && <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500">No Data Available</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.45)] backdrop-blur-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h3 className="text-lg font-black tracking-tight text-slate-900">Maintenance Report</h3>
            <p className="text-sm text-slate-500">Maintenance activity and service costs.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-sm text-slate-500">
                  <th className="px-6 py-3 font-semibold">Vehicle</th>
                  <th className="px-6 py-3 font-semibold">Type</th>
                  <th className="px-6 py-3 font-semibold">Cost</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {maintenance.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-slate-50/70">
                    <td className="px-6 py-4 text-slate-700">{getVehicleLabel(item.vehicle)}</td>
                    <td className="px-6 py-4 text-slate-700">{item.maintenance_type}</td>
                    <td className="px-6 py-4 text-slate-600">{item.cost}</td>
                    <td className="px-6 py-4 text-slate-600">{item.status}</td>
                  </tr>
                ))}
                {maintenance.length === 0 && <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500">No Data Available</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.45)] backdrop-blur-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h3 className="text-lg font-black tracking-tight text-slate-900">Fuel Report</h3>
            <p className="text-sm text-slate-500">Fuel usage and spend by vehicle.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-sm text-slate-500">
                  <th className="px-6 py-3 font-semibold">Vehicle</th>
                  <th className="px-6 py-3 font-semibold">Liters</th>
                  <th className="px-6 py-3 font-semibold">Cost</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fuel.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-slate-50/70">
                    <td className="px-6 py-4 text-slate-700">{getVehicleLabel(item.vehicle)}</td>
                    <td className="px-6 py-4 text-slate-700">{item.liters}</td>
                    <td className="px-6 py-4 text-slate-600">{item.cost}</td>
                    <td className="px-6 py-4 text-slate-600">{item.date}</td>
                  </tr>
                ))}
                {fuel.length === 0 && <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500">No Data Available</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.45)] backdrop-blur-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h3 className="text-lg font-black tracking-tight text-slate-900">Expense Report</h3>
            <p className="text-sm text-slate-500">Non-fuel operating expenses by vehicle.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-sm text-slate-500">
                  <th className="px-6 py-3 font-semibold">Vehicle</th>
                  <th className="px-6 py-3 font-semibold">Type</th>
                  <th className="px-6 py-3 font-semibold">Amount</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-slate-50/70">
                    <td className="px-6 py-4 text-slate-700">{getVehicleLabel(item.vehicle)}</td>
                    <td className="px-6 py-4 text-slate-700">{item.expense_type}</td>
                    <td className="px-6 py-4 text-slate-600">{item.amount}</td>
                    <td className="px-6 py-4 text-slate-600">{item.date}</td>
                  </tr>
                ))}
                {expenses.length === 0 && <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500">No Data Available</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
