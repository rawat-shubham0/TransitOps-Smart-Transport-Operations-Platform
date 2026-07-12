import { useEffect, useState } from 'react';
import { Loader2, Plus, X } from 'lucide-react';
import api from '../api/api';

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    vehicle: '',
    driver: '',
    source: '',
    destination: '',
    cargo_weight: '',
    planned_distance: '',
    start_date: '',
    end_date: '',
    status: 'Draft',
  });

  const fetchTrips = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('trips/');
      setTrips(response.data || []);
    } catch (err) {
      console.error(err);
      setTrips([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLookupData = async () => {
    try {
      const [vehicleResponse, driverResponse] = await Promise.all([
        api.get('vehicles/'),
        api.get('drivers/'),
      ]);
      setVehicles(vehicleResponse.data || []);
      setDrivers(driverResponse.data || []);
    } catch (err) {
      console.error(err);
      setVehicles([]);
      setDrivers([]);
    }
  };

  useEffect(() => {
    fetchTrips();
    fetchLookupData();
  }, []);

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('trips/', {
        vehicle: Number(formData.vehicle),
        driver: Number(formData.driver),
        source: formData.source,
        destination: formData.destination,
        cargo_weight: Number(formData.cargo_weight || 0),
        planned_distance: Number(formData.planned_distance || 0),
        start_date: formData.start_date,
        end_date: formData.end_date,
        status: formData.status,
      });
      setIsModalOpen(false);
      setFormData({ vehicle: '', driver: '', source: '', destination: '', cargo_weight: '', planned_distance: '', start_date: '', end_date: '', status: 'Draft' });
      await fetchTrips();
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

  const getDriverLabel = (driverId) => {
    const match = drivers.find((driver) => driver.id === driverId);
    return match ? match.name : driverId;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 min-h-[400px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Trip Dispatcher</h2>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all shadow-sm whitespace-nowrap">
          <Plus className="w-4 h-4" /> Create Trip
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
              <th className="px-6 py-4 font-semibold">Vehicle</th>
              <th className="px-6 py-4 font-semibold">Driver</th>
              <th className="px-6 py-4 font-semibold">Source</th>
              <th className="px-6 py-4 font-semibold">Destination</th>
              <th className="px-6 py-4 font-semibold">Cargo Weight</th>
              <th className="px-6 py-4 font-semibold">Distance</th>
              <th className="px-6 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading && (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading trips...
                  </div>
                </td>
              </tr>
            )}
            {!isLoading && trips.map((trip) => (
              <tr key={trip.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-slate-600">{getVehicleLabel(trip.vehicle)}</td>
                <td className="px-6 py-4 text-slate-600">{getDriverLabel(trip.driver)}</td>
                <td className="px-6 py-4 text-slate-600">{trip.source}</td>
                <td className="px-6 py-4 text-slate-600">{trip.destination}</td>
                <td className="px-6 py-4 text-slate-600">{trip.cargo_weight}</td>
                <td className="px-6 py-4 text-slate-600">{trip.planned_distance}</td>
                <td className="px-6 py-4 text-slate-600">{trip.status}</td>
              </tr>
            ))}
            {!isLoading && trips.length === 0 && (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-slate-500">No Data Available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Create Trip</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-1.5 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="create-trip-form" onSubmit={handleCreateTrip} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700">Vehicle *</label>
                    <select value={formData.vehicle} onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white">
                      <option value="">Select vehicle</option>
                      {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.registration_number}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700">Driver *</label>
                    <select value={formData.driver} onChange={(e) => setFormData({ ...formData, driver: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white">
                      <option value="">Select driver</option>
                      {drivers.map((driver) => <option key={driver.id} value={driver.id}>{driver.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5"><label className="block text-sm font-semibold text-slate-700">Source *</label><input type="text" required value={formData.source} onChange={(e) => setFormData({ ...formData, source: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" /></div>
                  <div className="space-y-1.5"><label className="block text-sm font-semibold text-slate-700">Destination *</label><input type="text" required value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5"><label className="block text-sm font-semibold text-slate-700">Cargo Weight *</label><input type="number" required value={formData.cargo_weight} onChange={(e) => setFormData({ ...formData, cargo_weight: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" /></div>
                  <div className="space-y-1.5"><label className="block text-sm font-semibold text-slate-700">Distance *</label><input type="number" required value={formData.planned_distance} onChange={(e) => setFormData({ ...formData, planned_distance: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5"><label className="block text-sm font-semibold text-slate-700">Start Date *</label><input type="date" required value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-600" /></div>
                  <div className="space-y-1.5"><label className="block text-sm font-semibold text-slate-700">End Date *</label><input type="date" required value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-600" /></div>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 mt-auto">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
              <button type="submit" form="create-trip-form" className="px-4 py-2 font-medium text-white bg-primary rounded-lg hover:bg-blue-700 transition-colors shadow-sm">{isSubmitting ? 'Saving...' : 'Save Trip'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
