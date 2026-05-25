import React from 'react';
import authService from '../services/authService';
import { Calendar, Bell } from 'lucide-react';

const Navbar = ({ title }) => {
  const user = authService.getCurrentUser();
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="h-16 border-b border-slate-800 bg-[#0d121f] flex items-center justify-between px-8 z-25 shrink-0">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-bold text-white tracking-wide capitalize">{title}</h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-2 text-slate-400 bg-slate-900/50 px-3.5 py-1.5 rounded-lg border border-slate-800 text-xs">
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          <span>{formattedDate}</span>
        </div>

        <button className="p-2 text-slate-400 hover:text-white bg-slate-900/50 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors cursor-pointer relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
        </button>

        <div className="h-6 w-[1px] bg-slate-800"></div>

        <div className="flex items-center gap-2.5">
          <div className="text-right hidden md:block">
            <p className="text-xs font-semibold text-white">{user?.name}</p>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">{user?.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
