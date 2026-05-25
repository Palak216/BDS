import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DashboardLayout = () => {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Business Development Overview';
      case '/leads':
        return 'Leads & Sales Pipeline';
      case '/tasks':
        return 'Task Management Board';
      case '/team':
        return 'Team Performance Metrics';
      default:
        return 'Control Panel';
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b0f19]">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar title={getTitle()} />
        <main className="flex-1 overflow-y-auto bg-[#070a13] p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
