import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Truck, Users, Map, Wrench, Fuel, BarChart3, LogOut } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Vehicles', path: '/vehicles', icon: Truck },
  { name: 'Drivers', path: '/drivers', icon: Users },
  { name: 'Trips', path: '/trips', icon: Map },
  { name: 'Maintenance', path: '/maintenance', icon: Wrench },
  { name: 'Fuel & Expenses', path: '/expenses', icon: Fuel },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col shadow-sm">
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
          T
        </div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">TransitOps</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
                }`
              }
            >
              <Icon size={20} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <NavLink 
          to="/login"
          className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-red-50 hover:text-danger rounded-lg transition-colors font-medium"
        >
          <LogOut size={20} />
          Logout
        </NavLink>
      </div>
    </div>
  );
}
