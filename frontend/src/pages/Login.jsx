import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Truck, Loader2 } from 'lucide-react';
import api from '../api/api';

const demoUsers = {
  fleet_manager: { label: 'Fleet Manager', username: 'fleet.manager', password: 'Fleet@123' },
  dispatcher: { label: 'Dispatcher', username: 'dispatcher', password: 'Dispatch@123' },
  safety_officer: { label: 'Safety Officer', username: 'safety.officer', password: 'Safety@123' },
  financial_analyst: { label: 'Financial Analyst', username: 'finance.analyst', password: 'Finance@123' },
};

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    email: demoUsers.dispatcher.username,
    password: demoUsers.dispatcher.password,
    role: 'dispatcher'
  });

  const handleRoleChange = (role) => {
    const presetUser = demoUsers[role];
    setFormData({
      role,
      email: presetUser.username,
      password: presetUser.password,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await api.post('token/', {
        username: formData.email,
        password: formData.password,
      });
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setErrorMessage('Invalid Username or Password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Graphic elements for premium feel */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 relative z-10">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 mb-4">
            <Truck size={32} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">TransitOps</h2>
          <p className="text-slate-500 mt-1 font-medium">Smart Transport Operations</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {errorMessage && (
            <div className="rounded-lg bg-red-50 text-danger border border-red-100 px-4 py-3 text-sm font-medium">
              {errorMessage}
            </div>
          )}
          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-700 bg-slate-50/50"
                placeholder="you@company.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-700 bg-slate-50/50"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Role (Optional Demo) */}
          <div className="space-y-1.5 pt-2">
             <label className="block text-sm font-semibold text-slate-700">Login Role (Demo)</label>
             <select 
                value={formData.role}
               onChange={(e) => handleRoleChange(e.target.value)}
                className="block w-full py-2.5 px-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-700 bg-slate-50/50"
             >
               <option value="fleet_manager">Fleet Manager</option>
               <option value="dispatcher">Dispatcher</option>
               <option value="safety_officer">Safety Officer</option>
               <option value="financial_analyst">Financial Analyst</option>
             </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all mt-4"
          >
            {isLoading ? (
               <Loader2 className="animate-spin h-5 w-5 text-white" />
            ) : (
               "Sign in to Dashboard"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
           Demo Credentials pre-filled for Hackathon
        </div>
      </div>
    </div>
  );
}
