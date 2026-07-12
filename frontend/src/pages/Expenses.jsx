import { useEffect, useState } from 'react';
import { Loader2, Plus, X } from 'lucide-react';
import api from '../api/api';

export default function Expenses() {
  const [fuel, setFuel] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('fuel');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    vehicle: '',
    liters: '',
    cost: '',
    date: '',
    expense_type: '',
    amount: '',
  });

  const fetchVehicles = async () => {
    try {
      const response = await api.get('vehicles/');
      setVehicles(response.data || []);
    } catch (err) {
      console.error(err);
      setVehicles([]);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [fuelResponse, expensesResponse] = await Promise.all([
        api.get('fuel/'),
        api.get('expenses/'),
      ]);
      setFuel(fuelResponse.data || []);
      setExpenses(expensesResponse.data || []);
    } catch (err) {
      console.error(err);
      setFuel([]);
      setExpenses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchVehicles();
  }, []);

  const handleCreateRecord = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (activeTab === 'fuel') {
        await api.post('fuel/', {
          vehicle: Number(formData.vehicle),
          liters: Number(formData.liters || 0),
          cost: Number(formData.cost || 0),
          date: formData.date,
        });
      } else {
        await api.post('expenses/', {
          vehicle: Number(formData.vehicle),
          expense_type: formData.expense_type,
          amount: Number(formData.amount || 0),
          date: formData.date,
        });
      }
      setIsModalOpen(false);
      setFormData({ vehicle: '', liters: '', cost: '', date: '', expense_type: '', amount: '' });
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVehicleLabel = (vehicleId) => {
    const match = vehicles.find((vehicle) => vehicle.id === vehicleId);
    return match ? match.registration_number : vehicleId;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 min-h-[400px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Fuel & Expenses</h2>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all shadow-sm whitespace-nowrap"><Plus className="w-4 h-4" /> Add Record</button>
      </div>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-3">Fuel</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm"><th className="px-6 py-4 font-semibold">Vehicle</th><th className="px-6 py-4 font-semibold">Liters</th><th className="px-6 py-4 font-semibold">Cost</th><th className="px-6 py-4 font-semibold">Date</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading && <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500"><div className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading fuel...</div></td></tr>}
                {!isLoading && fuel.map((item) => <tr key={item.id} className="hover:bg-slate-50/50 transition-colors"><td className="px-6 py-4 text-slate-600">{getVehicleLabel(item.vehicle)}</td><td className="px-6 py-4 text-slate-600">{item.liters}</td><td className="px-6 py-4 text-slate-600">{item.cost}</td><td className="px-6 py-4 text-slate-600">{item.date}</td></tr>)}
                {!isLoading && fuel.length === 0 && <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500">No Data Available</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800 mb-3">Expense</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm"><th className="px-6 py-4 font-semibold">Vehicle</th><th className="px-6 py-4 font-semibold">Type</th><th className="px-6 py-4 font-semibold">Amount</th><th className="px-6 py-4 font-semibold">Date</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading && <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500"><div className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading expenses...</div></td></tr>}
                {!isLoading && expenses.map((item) => <tr key={item.id} className="hover:bg-slate-50/50 transition-colors"><td className="px-6 py-4 text-slate-600">{getVehicleLabel(item.vehicle)}</td><td className="px-6 py-4 text-slate-600">{item.expense_type}</td><td className="px-6 py-4 text-slate-600">{item.amount}</td><td className="px-6 py-4 text-slate-600">{item.date}</td></tr>)}
                {!isLoading && expenses.length === 0 && <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500">No Data Available</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Add Record</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-1.5 rounded-lg transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="flex items-center gap-2 mb-4 text-sm font-medium">
                <button type="button" onClick={() => setActiveTab('fuel')} className={`px-3 py-2 rounded-lg ${activeTab === 'fuel' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`}>Fuel</button>
                <button type="button" onClick={() => setActiveTab('expense')} className={`px-3 py-2 rounded-lg ${activeTab === 'expense' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`}>Expense</button>
              </div>
              <form id="add-expense-form" onSubmit={handleCreateRecord} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700">Vehicle *</label>
                  <select value={formData.vehicle} onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white">
                    <option value="">Select vehicle</option>
                    {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.registration_number}</option>)}
                  </select>
                </div>
                {activeTab === 'fuel' ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5"><label className="block text-sm font-semibold text-slate-700">Liters *</label><input type="number" required value={formData.liters} onChange={(e) => setFormData({ ...formData, liters: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" /></div>
                      <div className="space-y-1.5"><label className="block text-sm font-semibold text-slate-700">Cost *</label><input type="number" required value={formData.cost} onChange={(e) => setFormData({ ...formData, cost: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" /></div>
                    </div>
                    <div className="space-y-1.5"><label className="block text-sm font-semibold text-slate-700">Date *</label><input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-600" /></div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1.5"><label className="block text-sm font-semibold text-slate-700">Expense Type *</label><input type="text" required value={formData.expense_type} onChange={(e) => setFormData({ ...formData, expense_type: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5"><label className="block text-sm font-semibold text-slate-700">Amount *</label><input type="number" required value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" /></div>
                      <div className="space-y-1.5"><label className="block text-sm font-semibold text-slate-700">Date *</label><input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-600" /></div>
                    </div>
                  </>
                )}
              </form>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 mt-auto">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
              <button type="submit" form="add-expense-form" className="px-4 py-2 font-medium text-white bg-primary rounded-lg hover:bg-blue-700 transition-colors shadow-sm">{isSubmitting ? 'Saving...' : 'Save Record'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
