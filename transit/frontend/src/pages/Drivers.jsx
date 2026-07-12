import { useState } from 'react';
import { Search, Plus, Filter, X, ShieldCheck, ShieldAlert } from 'lucide-react';

const initialDrivers = [
  { id: 1, name: 'James Wilson', license: 'CDL-89302', expiry: '2027-05-14', phone: '(555) 123-4567', score: 95, status: 'Available' },
  { id: 2, name: 'Sarah Connor', license: 'CDL-11293', expiry: '2023-10-01', phone: '(555) 987-6543', score: 88, status: 'Suspended' },
  { id: 3, name: 'Michael Chang', license: 'CDL-44920', expiry: '2025-11-20', phone: '(555) 321-7890', score: 72, status: 'On Trip' },
  { id: 4, name: 'David Smith', license: 'CDL-77482', expiry: '2026-02-28', phone: '(555) 654-3210', score: 98, status: 'Available' },
  { id: 5, name: 'Emily Davis', license: 'CDL-99211', expiry: '2024-01-15', phone: '(555) 432-1098', score: 91, status: 'Off Duty' }
];

export default function Drivers() {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '', license: '', expiry: '', phone: '', score: ''
  });

  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.license.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDriver = (e) => {
    e.preventDefault();
    const newDriver = {
      id: drivers.length + 1,
      name: formData.name,
      license: formData.license,
      expiry: formData.expiry,
      phone: formData.phone,
      score: parseInt(formData.score) || 100,
      status: 'Available'
    };
    setDrivers([newDriver, ...drivers]);
    setIsModalOpen(false);
    setFormData({ name: '', license: '', expiry: '', phone: '', score: '' });
  };

  const statusColors = {
    'Available': 'bg-success/10 text-success border-success/20',
    'On Trip': 'bg-primary/10 text-primary border-primary/20',
    'Off Duty': 'bg-slate-100 text-slate-600 border-slate-200',
    'Suspended': 'bg-danger/10 text-danger border-danger/20',
  };

  // Helper to check License Expiry
  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="space-y-6 relative h-full flex flex-col">
      {/* Page Header & Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Driver Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage driver credentials, safety scores, and duty status.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* SearchBar */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search driver or license..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm bg-white"
            />
          </div>
          
          <button className="flex items-center justify-center p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors bg-white hover:text-primary">
             <Filter className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add Driver
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <th className="px-6 py-4 font-semibold">Driver Name</th>
                <th className="px-6 py-4 font-semibold">License No.</th>
                <th className="px-6 py-4 font-semibold">License Expiry</th>
                <th className="px-6 py-4 font-semibold">Safety Score</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDrivers.map((driver) => {
                const expired = isExpired(driver.expiry);
                return (
                  <tr key={driver.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{driver.name}</div>
                      <div className="text-xs text-slate-500">{driver.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-sm">{driver.license}</td>
                    
                    {/* The Hackathon Extra Feature: License Status */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {expired ? (
                          <div className="flex items-center gap-1.5 text-danger bg-danger/10 px-2 py-1 rounded text-xs font-semibold">
                            <ShieldAlert size={14} /> Expired
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-success bg-success/10 px-2 py-1 rounded text-xs font-semibold">
                            <ShieldCheck size={14} /> Valid
                          </div>
                        )}
                        <span className="text-sm text-slate-500">{driver.expiry}</span>
                      </div>
                    </td>

                    {/* Safety Score Logic */}
                    <td className="px-6 py-4">
                      <div className={`font-bold text-lg ${driver.score >= 90 ? 'text-success' : driver.score < 80 ? 'text-danger' : 'text-warning'}`}>
                        {driver.score}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[driver.status] || 'bg-slate-100 text-slate-600'}`}>
                        {driver.status}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                       <button className="text-primary hover:underline text-sm font-medium">Edit</button>
                    </td>
                  </tr>
                );
              })}
              {filteredDrivers.length === 0 && (
                <tr>
                   <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                      No drivers found matching your search.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Driver Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Register New Driver</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 p-1.5 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form id="add-driver-form" onSubmit={handleAddDriver} className="space-y-4">
                
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700">Full Name *</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. John Doe" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700">License Number *</label>
                    <input type="text" required value={formData.license} onChange={e => setFormData({...formData, license: e.target.value})} placeholder="CDL-XXXXX" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700">Expiry Date *</label>
                    <input type="date" required value={formData.expiry} onChange={e => setFormData({...formData, expiry: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-600" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700">Phone Number *</label>
                    <input type="text" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="(555) 000-0000" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700">Initial Safety Score</label>
                    <input type="number" min="0" max="100" value={formData.score} onChange={e => setFormData({...formData, score: e.target.value})} placeholder="100" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                  </div>
                </div>

              </form>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 mt-auto">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button type="submit" form="add-driver-form" className="px-4 py-2 font-medium text-white bg-primary rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                Save Driver
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
