import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { LayoutDashboard, Users, CheckSquare, BarChart3, LogOut, Factory } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Leads Directory', path: '/leads', icon: BarChart3 },
    { name: 'Task Board', path: '/tasks', icon: CheckSquare },
    { name: 'Team Metrics', path: '/team', icon: Users },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="p-2 bg-indigo-600/10 text-indigo-400 rounded-lg border border-indigo-500/20">
          <Factory className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-white leading-tight">BDA CRM</h1>
          <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Manufacturing</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex flex-col gap-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center font-bold text-indigo-400 border border-slate-700">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role || 'Team Member'}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-2 bg-slate-850 hover:bg-red-500/10 hover:text-red-400 text-slate-400 rounded-lg text-xs font-semibold border border-slate-800 hover:border-red-500/20 transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
