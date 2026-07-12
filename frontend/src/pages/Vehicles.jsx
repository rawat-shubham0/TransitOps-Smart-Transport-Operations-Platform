import { useEffect, useState } from 'react';
import { Search, Plus, Filter, X, Loader2 } from 'lucide-react';
import api from '../api/api';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState(null);

  // Modal Form State
  const [formData, setFormData] = useState({
    regNo: '', model: '', type: 'Heavy Truck', capacity: '', odometer: '', cost: '', status: 'Available'
  });

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('vehicles/');
      setVehicles(response.data || []);
    } catch (err) {
      console.error(err);
      setVehicles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter(v => 
    String(v.registration_number || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    String(v.model || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddModal = () => {
    setEditingVehicleId(null);
    setFormData({ regNo: '', model: '', type: 'Heavy Truck', capacity: '', odometer: '', cost: '', status: 'Available' });
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle) => {
    setEditingVehicleId(vehicle.id);
    setFormData({
      regNo: vehicle.registration_number || '',
      model: vehicle.model || '',
      type: vehicle.vehicle_type || 'Heavy Truck',
      capacity: vehicle.capacity !== undefined && vehicle.capacity !== null ? String(vehicle.capacity) : '',
      odometer: vehicle.odometer !== undefined && vehicle.odometer !== null ? String(vehicle.odometer) : '',
      cost: vehicle.acquisition_cost !== undefined && vehicle.acquisition_cost !== null ? String(vehicle.acquisition_cost) : '',
      status: vehicle.status || 'Available',
    });
    setIsModalOpen(true);
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        registration_number: formData.regNo,
        model: formData.model,
        vehicle_type: formData.type,
        capacity: Number(formData.capacity),
        odometer: Number(formData.odometer || 0),
        acquisition_cost: formData.cost === '' ? 0 : Number(formData.cost),
        status: formData.status,
      };

      if (editingVehicleId) {
        await api.put(`vehicles/${editingVehicleId}/`, payload);
      } else {
        await api.post('vehicles/', payload);
      }

      setIsModalOpen(false);
      setEditingVehicleId(null);
      setFormData({ regNo: '', model: '', type: 'Heavy Truck', capacity: '', odometer: '', cost: '', status: 'Available' });
      await fetchVehicles();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVehicle = async (id) => {
    try {
      await api.delete(`vehicles/${id}/`);
      await fetchVehicles();
    } catch (err) {
      console.error(err);
    }
  };

  const statusColors = {
    'Available': 'bg-success/10 text-success border-success/20',
    'On Trip': 'bg-primary/10 text-primary border-primary/20',
    'In Shop': 'bg-warning/10 text-warning border-warning/20',
    'Retired': 'bg-slate-100 text-slate-600 border-slate-200',
  };

  const visibleCount = filteredVehicles.length;

  return (
    <div className="space-y-6 relative h-full">
      <div className="absolute -top-10 right-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
      <div className="absolute top-32 left-0 w-72 h-72 rounded-full bg-amber-400/10 blur-3xl pointer-events-none"></div>

      {/* Page Header & Top Bar */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50/80 p-6 shadow-sm">
        <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_65%)] pointer-events-none"></div>
        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-2">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
              Fleet Inventory
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Vehicle Management</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">Search, add, edit, and remove fleet assets while keeping the operational status of each vehicle visible at a glance.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:min-w-[520px]">
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total</p>
              <p className="mt-1 text-2xl font-black text-slate-900">{vehicles.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Visible</p>
              <p className="mt-1 text-2xl font-black text-slate-900">{visibleCount}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Available</p>
              <p className="mt-1 text-2xl font-black text-green-600">{vehicles.filter((vehicle) => vehicle.status === 'Available').length}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">In Trip</p>
              <p className="mt-1 text-2xl font-black text-blue-600">{vehicles.filter((vehicle) => vehicle.status === 'On Trip').length}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3 w-full flex-col md:flex-row md:justify-between">
          {/* SearchBar */}
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm bg-white"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto md:justify-end">
          <button className="flex items-center justify-center p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors bg-white hover:text-primary">
             <Filter className="w-4 h-4" />
          </button>

          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add Vehicle
          </button>
        </div>
      </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <th className="px-6 py-4 font-semibold">Reg No</th>
                <th className="px-6 py-4 font-semibold">Model</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Capacity</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Loading vehicles...
                    </div>
                  </td>
                </tr>
              )}
              {!isLoading && filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-600">{vehicle.model}</td>
                  <td className="px-6 py-4 text-slate-600">{vehicle.vehicle_type}</td>
                  <td className="px-6 py-4 text-slate-600">{vehicle.capacity}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[vehicle.status] || 'bg-slate-100 text-slate-600'}`}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <button onClick={() => openEditModal(vehicle)} className="text-primary hover:underline text-sm font-medium">Edit</button>
                     <button onClick={() => handleDeleteVehicle(vehicle.id)} className="ml-3 text-danger hover:underline text-sm font-medium">Delete</button>
                  </td>
                </tr>
              ))}
              {!isLoading && filteredVehicles.length === 0 && (
                <tr>
                   <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                      No Data Available
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Vehicle Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Register New Vehicle</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-1.5 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (Scrollable form) */}
            <div className="p-6 overflow-y-auto">
              <form id="add-vehicle-form" onSubmit={handleAddVehicle} className="space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700">Registration Number *</label>
                    <input type="text" required value={formData.regNo} onChange={e => setFormData({...formData, regNo: e.target.value})} placeholder="e.g. CA-552-TRK" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700">Vehicle Model *</label>
                    <input type="text" required value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} placeholder="e.g. Ford Transit" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700">Vehicle Type *</label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white">
                      <option value="Heavy Truck">Heavy Truck</option>
                      <option value="Box Truck">Box Truck</option>
                      <option value="Cargo Van">Cargo Van</option>
                      <option value="Pickup">Pickup</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700">Capacity (Kg) *</label>
                    <input type="number" required value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} placeholder="e.g. 10000" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700">Odometer (km)</label>
                    <input type="number" value={formData.odometer} onChange={e => setFormData({...formData, odometer: e.target.value})} placeholder="0" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700">Acquisition Cost ($)</label>
                    <input type="number" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} placeholder="45000" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                  </div>
                </div>

              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 mt-auto">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button type="submit" form="add-vehicle-form" className="px-4 py-2 font-medium text-white bg-primary rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                {isSubmitting ? 'Saving...' : 'Save Vehicle'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
