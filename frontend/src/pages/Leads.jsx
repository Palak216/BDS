import React, { useState, useEffect } from 'react';
import leadService from '../services/leadService';
import teamService from '../services/teamService';
import authService from '../services/authService';
import { Search, Filter, Plus, Edit2, Trash2, Calendar, User, Building, AlertCircle, Loader, X } from 'lucide-react';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = authService.getCurrentUser();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const [clientName, setClientName] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState('New');
  const [assignedTo, setAssignedTo] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [notes, setNotes] = useState('');

  const fetchLeadsAndTeam = async () => {
    try {
      const filters = { search, status: statusFilter, assignedTo: assigneeFilter };
      const [leadsData, teamData] = await Promise.all([
        leadService.getLeads(filters),
        teamService.getTeamMembers(),
      ]);
      setLeads(leadsData);
      setTeam(teamData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch directory data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadsAndTeam();
  }, [search, statusFilter, assigneeFilter]);

  const handleOpenModal = (lead = null) => {
    if (lead) {
      setEditingLead(lead);
      setClientName(lead.clientName);
      setCompany(lead.company);
      setStatus(lead.status);
      setAssignedTo(lead.assignedTo?._id || '');
      setFollowUpDate(lead.followUpDate ? lead.followUpDate.split('T')[0] : '');
      setNotes(lead.notes || '');
    } else {
      setEditingLead(null);
      setClientName('');
      setCompany('');
      setStatus('New');
      setAssignedTo(currentUser?._id || '');
      setFollowUpDate('');
      setNotes('');
    }
    setFormError('');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingLead(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    const payload = {
      clientName,
      company,
      status,
      assignedTo,
      followUpDate: followUpDate || null,
      notes,
    };

    try {
      if (editingLead) {
        await leadService.updateLead(editingLead._id, payload);
      } else {
        await leadService.createLead(payload);
      }
      fetchLeadsAndTeam();
      handleCloseModal();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save lead information');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteLead = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead? This action is permanent.')) {
      try {
        await leadService.deleteLead(id);
        fetchLeadsAndTeam();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete lead');
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'New':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'Contacted':
        return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
      case 'Interested':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'Converted':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'Closed':
        return 'bg-rose-500/10 text-rose-450 border border-rose-500/20';
      default:
        return 'bg-slate-800 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">Leads Directory</h3>
          <p className="text-sm text-slate-400 font-light mt-1">Add, assign, filter, and progress sales leads through the pipeline.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors border border-indigo-400/20 shadow-lg shadow-indigo-600/10 cursor-pointer w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Lead</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/40 border border-slate-850 p-4 rounded-xl backdrop-blur-md">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search by client or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 text-white text-xs pl-9 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all placeholder:text-slate-600"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 text-white text-xs pl-9 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all appearance-none"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Interested">Interested</option>
            <option value="Converted">Converted</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Assignee Filter */}
        <div className="relative">
          <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 text-white text-xs pl-9 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all appearance-none"
          >
            <option value="">All Assignees</option>
            {team.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content (Table) */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <Loader className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      ) : leads.length === 0 ? (
        <div className="bg-slate-900/10 border border-dashed border-slate-800 text-center py-12 rounded-xl text-slate-550 text-sm font-light">
          No leads match your filter parameters. Try expanding your search query.
        </div>
      ) : (
        <div className="bg-slate-900/20 border border-slate-850 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                  <th className="py-4 px-6">Client Name</th>
                  <th className="py-4 px-6">Company</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Assigned Representative</th>
                  <th className="py-4 px-6">Follow-up Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60 text-sm text-slate-350">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="py-4 px-6 font-semibold text-white">{lead.clientName}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Building className="w-3.5 h-3.5 text-slate-500" />
                        <span>{lead.company}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded text-xs font-semibold ${getStatusBadgeClass(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center text-[10px] font-bold text-indigo-400 border border-slate-700">
                          {lead.assignedTo?.name?.charAt(0).toUpperCase()}
                        </div>
                        <span>{lead.assignedTo?.name || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {lead.followUpDate ? (
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400/80" />
                          <span>{new Date(lead.followUpDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      ) : (
                        <span className="text-slate-600 text-xs">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(lead)}
                          className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20 rounded-lg transition-all cursor-pointer"
                          title="Edit Lead"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {currentUser?.role === 'Admin' && (
                          <button
                            onClick={() => handleDeleteLead(lead._id)}
                            className="p-2 text-slate-400 hover:text-rose-450 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-lg transition-all cursor-pointer"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/30">
              <h4 className="text-base font-bold text-white">
                {editingLead ? 'Edit Lead Details' : 'Add New Pipeline Lead'}
              </h4>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mx-6 mt-4 flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-xs font-semibold mb-1.5">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Contact person name"
                    className="w-full bg-slate-950/60 border border-slate-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 placeholder:text-slate-650"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-semibold mb-1.5">Company *</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company name"
                    className="w-full bg-slate-950/60 border border-slate-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 placeholder:text-slate-650"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-xs font-semibold mb-1.5">Pipeline Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Interested">Interested</option>
                    <option value="Converted">Converted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 text-xs font-semibold mb-1.5">Assigned Representative</label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    disabled={currentUser?.role !== 'Admin'}
                    className="w-full bg-slate-950/60 border border-slate-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50"
                  >
                    {currentUser?.role !== 'Admin' && (
                      <option value={assignedTo}>{editingLead?.assignedTo?.name || currentUser?.name}</option>
                    )}
                    {currentUser?.role === 'Admin' && team.map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name} ({member.role})
                      </option>
                    ))}
                  </select>
                  {currentUser?.role !== 'Admin' && (
                    <p className="text-[10px] text-slate-500 mt-1">Only administrators can reassign leads.</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-semibold mb-1.5">Follow-up Date</label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-semibold mb-1.5">Interaction Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Details of client discussion, manufacturing requirements..."
                  rows="3"
                  className="w-full bg-slate-950/60 border border-slate-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 placeholder:text-slate-650"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-slate-850 flex justify-end gap-3 bg-slate-950/10 -mx-6 -mb-6 p-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-slate-850 hover:bg-slate-850 text-slate-300 px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {formLoading && <Loader className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingLead ? 'Update Lead' : 'Create Lead'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
