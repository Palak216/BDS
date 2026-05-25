import React, { useState, useEffect } from 'react';
import teamService from '../services/teamService';
import { Shield, Calendar, AlertCircle, Loader } from 'lucide-react';

const Team = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data = await teamService.getTeamMembers();
        setMembers(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch team members');
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <Loader className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
        <AlertCircle className="w-5 h-5" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-white">Team Performance Metrics</h3>
        <p className="text-sm text-slate-400 font-light mt-1">Review team member assignments, task queues, and pipeline conversion rates.</p>
      </div>

      {/* Grid of Team Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => {
          const { metrics } = member;
          const initials = member.name.charAt(0).toUpperCase();

          return (
            <div
              key={member._id}
              className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between hover:border-slate-700/60 transition-all duration-200 group"
            >
              <div>
                {/* Header Profile Section */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-slate-850 rounded-full flex items-center justify-center font-bold text-indigo-400 border border-slate-850 text-base shadow-inner group-hover:scale-105 transition-transform duration-200">
                      {initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base group-hover:text-indigo-400 transition-colors duration-200">{member.name}</h4>
                      <p className="text-xs text-slate-500 font-light truncate max-w-[150px]">{member.email}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border flex items-center gap-1 ${
                    member.role === 'Admin'
                      ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                      : 'bg-slate-850 text-slate-400 border-slate-800'
                  }`}>
                    <Shield className="w-3 h-3 animate-pulse" />
                    <span>{member.role}</span>
                  </span>
                </div>

                {/* Date Registered */}
                <div className="flex items-center gap-1.5 mt-4 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500/70" />
                  <span>Joined {new Date(member.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>

                {/* Metrics Stats */}
                <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-slate-850/60">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Leads</span>
                    <p className="text-lg font-bold text-white mt-1">{metrics.totalLeads}</p>
                  </div>
                  <div className="text-center border-x border-slate-850/60">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Won</span>
                    <p className="text-lg font-bold text-emerald-400 mt-1">{metrics.convertedLeads}</p>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tasks</span>
                    <p className="text-lg font-bold text-amber-400 mt-1">{metrics.pendingTasks}</p>
                  </div>
                </div>
              </div>

              {/* Conversion Rate Progress Bar */}
              <div className="mt-6 pt-4 border-t border-slate-850/60">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-2">
                  <span>Lead Conversion Rate</span>
                  <span className="text-emerald-400 font-bold">{metrics.conversionRate}%</span>
                </div>
                <div className="w-full bg-slate-950/60 h-2 rounded-full overflow-hidden border border-slate-805 border-slate-800">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${metrics.conversionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Team;
