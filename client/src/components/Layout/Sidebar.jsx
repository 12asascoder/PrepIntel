import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Radio, Cpu, Box, BarChart3, User } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/simulator', icon: Radio, label: 'Simulator' },
  { to: '/sensors', icon: Cpu, label: 'Sensors' },
  { to: '/digital-twin', icon: Box, label: 'Digital Twin' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[220px] bg-navy flex flex-col z-50">
      {/* Brand */}
      <div className="px-5 pt-6 pb-8">
        <h1 className="text-white text-lg font-bold tracking-tight">PrepIntel</h1>
        <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-[0.2em] mt-0.5">Industrial Command</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(item => {
          const isActive = location.pathname === item.to || 
            (item.to !== '/' && location.pathname.startsWith(item.to));
          return (
            <NavLink key={item.to} to={item.to} className={`sidebar-link ${isActive ? 'active' : ''}`}>
              <item.icon size={18} strokeWidth={isActive ? 2 : 1.5} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center">
            <User size={14} className="text-white" />
          </div>
          <div>
            <p className="text-white text-sm font-medium leading-tight">Admin Operator</p>
            <p className="text-slate-400 text-[10px]">Facility 04-A</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
