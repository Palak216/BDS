import React, { useState, useEffect } from 'react';
import teamService from '../services/teamService';
import { BarChart3, CheckSquare, Target, Clock, AlertCircle, Loader, UserPlus, FileText, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await teamService.getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-slate-400 text-sm font-light">Loading dashboard analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  const { summary, salesPerformance, activities } = stats;

  const cardData = [
    {
      title: 'Total Leads',
      value: summary.totalLeads,
      description: 'Acquired sales opportunities',
      icon: BarChart3,
      color: 'from-blue-600/20 to-blue-500/5',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500/20',
    },
    {
      title: 'Converted Leads',
      value: summary.convertedLeads,
      description: 'Successfully won accounts',
      icon: Target,
      color: 'from-emerald-600/20 to-emerald-500/5',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
    },
    {
      title: 'Pending Follow-ups',
      value: summary.pendingFollowups,
      description: 'Active lead nurturing stages',
      icon: Clock,
      color: 'from-amber-600/20 to-amber-500/5',
      textColor: 'text-amber-400',
      borderColor: 'border-amber-500/20',
    },
    {
      title: 'Conversion Rate',
      value: `${summary.conversionRate}%`,
      description: 'Leads-to-wins efficiency',
      icon: CheckCircle,
      color: 'from-indigo-600/20 to-indigo-500/5',
      textColor: 'text-indigo-400',
      borderColor: 'border-indigo-500/20',
    },
  ];

  const pieData = [
    { name: 'Pending', value: summary.tasks.pending },
    { name: 'In Progress', value: summary.tasks.inProgress },
    { name: 'Completed', value: summary.tasks.completed },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Section */}
      <div>
        <h3 className="text-xl font-bold text-white">Dashboard</h3>
        <p className="text-sm text-slate-400 font-light mt-1">Real-time metrics for BDA pipelines, conversions, and task completions.</p>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`bg-gradient-to-br ${card.color} backdrop-blur-md border ${card.borderColor} p-6 rounded-2xl flex items-center justify-between shadow-lg`}
            >
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{card.title}</p>
                <h4 className="text-3xl font-extrabold text-white mt-2 tracking-tight">{card.value}</h4>
                <p className="text-[11px] text-slate-500 mt-1 font-light">{card.description}</p>
              </div>
              <div className={`p-3 bg-slate-900/60 border ${card.borderColor} rounded-xl ${card.textColor}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Performance Area Chart */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="mb-4">
            <h4 className="text-base font-bold text-white">Sales Conversion History</h4>
            <p className="text-xs text-slate-400 mt-1 font-light">Monthly frequency of successfully converted leads.</p>
          </div>
          <div className="h-64 w-full">
            {salesPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesPerformance} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      color: '#f8fafc',
                      fontSize: 12,
                      borderRadius: 8,
                    }}
                  />
                  <Area type="monotone" dataKey="leads" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">No sales conversion data yet</div>
            )}
          </div>
        </div>

        {/* Task Distribution Pie Chart */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-white">Task Completion Status</h4>
            <p className="text-xs text-slate-400 mt-1 font-light">Breakdown of active task completion states.</p>
          </div>
          <div className="h-56 flex items-center justify-center relative">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => {
                      let c = '#ef4444';
                      if (entry.name === 'In Progress') c = '#f59e0b';
                      if (entry.name === 'Completed') c = '#10b981';
                      return <Cell key={`cell-${index}`} fill={c} />;
                    })}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      color: '#f8fafc',
                      fontSize: 12,
                      borderRadius: 8,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-500 text-sm font-light">No tasks assigned yet</div>
            )}
            {summary.tasks.total > 0 && (
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-white">{summary.tasks.total}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Total</span>
              </div>
            )}
          </div>
          <div className="flex justify-center gap-4 text-xs font-semibold text-slate-400 mt-2">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span>Pending</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span>In Progress</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Completed</span>
          </div>
        </div>
      </div>

      {/* Bottom Grid for Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities Feed */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <h4 className="text-base font-bold text-white mb-4">Recent Pipelines Activity</h4>
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((act) => (
                <div key={act.id} className="flex gap-4 p-3 bg-slate-950/40 border border-slate-900 rounded-xl hover:border-slate-800/80 transition-colors">
                  <div className={`p-2.5 rounded-lg shrink-0 ${
                    act.type === 'lead' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/10' : 'bg-amber-600/10 text-amber-400 border border-amber-500/10'
                  }`}>
                    {act.type === 'lead' ? <UserPlus className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm text-slate-200 font-medium truncate">{act.message}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                      <span>{new Date(act.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                      <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                        act.status === 'Converted' || act.status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                          : act.status === 'New' || act.status === 'Pending'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/10'
                          : 'bg-slate-800 text-slate-400'
                      }`}>{act.status}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-center py-6 text-sm font-light">No activity recorded yet</div>
            )}
          </div>
        </div>

        {/* Shortcuts Panel */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-white mb-2">Workspace Shortcuts</h4>
            <p className="text-xs text-slate-400 font-light mb-6">Quick actions to manage tasks, clients, and pipelines.</p>
            <div className="space-y-3">
              <a
                href="/leads"
                className="flex items-center justify-between p-3.5 bg-slate-950/60 hover:bg-indigo-600/10 hover:border-indigo-500/30 border border-slate-900 text-slate-350 hover:text-indigo-400 rounded-xl transition-all font-medium text-sm group"
              >
                <span>Navigate Leads</span>
                <span className="text-xs bg-slate-905 group-hover:bg-indigo-500/20 px-2 py-0.5 rounded text-slate-500 group-hover:text-indigo-400 font-bold transition-colors">GO</span>
              </a>
              <a
                href="/tasks"
                className="flex items-center justify-between p-3.5 bg-slate-950/60 hover:bg-indigo-600/10 hover:border-indigo-500/30 border border-slate-900 text-slate-355 hover:text-indigo-400 rounded-xl transition-all font-medium text-sm group"
              >
                <span>Check Tasks</span>
                <span className="text-xs bg-slate-905 group-hover:bg-indigo-500/20 px-2 py-0.5 rounded text-slate-500 group-hover:text-indigo-400 font-bold transition-colors">GO</span>
              </a>
              <a
                href="/team"
                className="flex items-center justify-between p-3.5 bg-slate-950/60 hover:bg-indigo-600/10 hover:border-indigo-500/30 border border-slate-900 text-slate-360 hover:text-indigo-400 rounded-xl transition-all font-medium text-sm group"
              >
                <span>Team Board</span>
                <span className="text-xs bg-slate-905 group-hover:bg-indigo-500/20 px-2 py-0.5 rounded text-slate-500 group-hover:text-indigo-400 font-bold transition-colors">GO</span>
              </a>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-800 text-center text-[10px] text-slate-650">
            BDA CRM Dashboard v1.0.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
