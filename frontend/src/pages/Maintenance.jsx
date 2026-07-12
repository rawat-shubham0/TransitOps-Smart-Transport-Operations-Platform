import { useEffect, useState } from 'react';
import { Loader2, Plus, X } from 'lucide-react';
import api from '../api/api';

export default function Maintenance() {
  const [maintenance, setMaintenance] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    vehicle: '',
    maintenance_type: '',
    description: '',
    cost: '',
    start_date: '',
    completion_date: '',
    status: 'Pending',
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

  const fetchMaintenance = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('maintenance/');
      setMaintenance(response.data || []);
    } catch (err) {
      console.error(err);
      setMaintenance([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenance();
    fetchVehicles();
  }, []);

  const handleCreateMaintenance = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('maintenance/', {
        vehicle: Number(formData.vehicle),
        maintenance_type: formData.maintenance_type,
        description: formData.description,
        cost: Number(formData.cost || 0),
        start_date: formData.start_date,
        completion_date: formData.completion_date || null,
        status: formData.status,
      });
      setIsModalOpen(false);
      setFormData({ vehicle: '', maintenance_type: '', description: '', cost: '', start_date: '', completion_date: '', status: 'Pending' });
      await fetchMaintenance();
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
        <h2 className="text-2xl font-bold text-slate-800">Maintenance Schedule</h2>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all shadow-sm whitespace-nowrap"><Plus className="w-4 h-4" /> Add Maintenance</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
              <th className="px-6 py-4 font-semibold">Vehicle</th>
              <th className="px-6 py-4 font-semibold">Type</th>
              <th className="px-6 py-4 font-semibold">Description</th>
              <th className="px-6 py-4 font-semibold">Cost</th>
              <th className="px-6 py-4 font-semibold">Start Date</th>
              <th className="px-6 py-4 font-semibold">Completion Date</th>
              <th className="px-6 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading && (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-slate-500"><div className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading maintenance...</div></td>
              </tr>
            )}
            {!isLoading && maintenance.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-slate-600">{getVehicleLabel(item.vehicle)}</td>
                <td className="px-6 py-4 text-slate-600">{item.maintenance_type}</td>
                <td className="px-6 py-4 text-slate-600">{item.description}</td>
                <td className="px-6 py-4 text-slate-600">{item.cost}</td>
                <td className="px-6 py-4 text-slate-600">{item.start_date}</td>
                <td className="px-6 py-4 text-slate-600">{item.completion_date || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{item.status}</td>
              </tr>
            ))}
            {!isLoading && maintenance.length === 0 && (
              <tr><td colSpan="7" className="px-6 py-8 text-center text-slate-500">No Data Available</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Add Maintenance</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-1.5 rounded-lg transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="add-maintenance-form" onSubmit={handleCreateMaintenance} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700">Vehicle *</label>
                  <select value={formData.vehicle} onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white">
                    <option value="">Select vehicle</option>
                    {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.registration_number}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5"><label className="block text-sm font-semibold text-slate-700">Maintenance Type *</label><input type="text" required value={formData.maintenance_type} onChange={(e) => setFormData({ ...formData, maintenance_type: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" /></div>
                <div className="space-y-1.5"><label className="block text-sm font-semibold text-slate-700">Description *</label><textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5"><label className="block text-sm font-semibold text-slate-700">Cost *</label><input type="number" required value={formData.cost} onChange={(e) => setFormData({ ...formData, cost: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" /></div>
                  <div className="space-y-1.5"><label className="block text-sm font-semibold text-slate-700">Status *</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"><option value="Pending">Pending</option><option value="In Progress">In Progress</option><option value="Completed">Completed</option></select></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5"><label className="block text-sm font-semibold text-slate-700">Start Date *</label><input type="date" required value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-600" /></div>
                  <div className="space-y-1.5"><label className="block text-sm font-semibold text-slate-700">Completion Date</label><input type="date" value={formData.completion_date} onChange={(e) => setFormData({ ...formData, completion_date: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-600" /></div>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 mt-auto">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
              <button type="submit" form="add-maintenance-form" className="px-4 py-2 font-medium text-white bg-primary rounded-lg hover:bg-blue-700 transition-colors shadow-sm">{isSubmitting ? 'Saving...' : 'Save Maintenance'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
