import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, ListOrdered, Users, Banknote, Settings, LogOut } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const navItems = [
    { to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Overview', end: true },
    { to: '/admin/queue', icon: <ListOrdered size={20} />, label: 'Live Queue' },
    { to: '/admin/clients', icon: <Users size={20} />, label: 'Clients' },
    { to: '/admin/commission', icon: <Banknote size={20} />, label: 'Commission' },
  ];

  return (
    <div className="flex h-screen bg-slate-100">
      <aside className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6">
          <span className="text-xl font-bold text-[#1E3A5F]">Royal Fades</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Main</p>
          {navItems.slice(0, 2).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                  isActive ? 'bg-[#1E3A5F] text-white' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}

          <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mt-6 mb-2">Management</p>
          {navItems.slice(2).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                  isActive ? 'bg-[#1E3A5F] text-white' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button className="flex items-center gap-3 px-3 py-2 w-full text-slate-600 hover:text-red-600 transition-colors text-sm font-medium">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;