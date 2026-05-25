import React, { useState, useEffect } from 'react';
import taskService from '../services/taskService';
import teamService from '../services/teamService';
import authService from '../services/authService';
import { Plus, Edit2, Trash2, Calendar, User, AlertCircle, Loader, X, ChevronRight, ChevronLeft, Check } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = authService.getCurrentUser();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [assignedUser, setAssignedUser] = useState('');
  const [dueDate, setDueDate] = useState('');

  const fetchTasksAndTeam = async () => {
    try {
      const [tasksData, teamData] = await Promise.all([
        taskService.getTasks(),
        teamService.getTeamMembers(),
      ]);
      setTasks(tasksData);
      setTeam(teamData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksAndTeam();
  }, []);

  const handleOpenModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setAssignedUser(task.assignedUser?._id || '');
      setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
    } else {
      setEditingTask(null);
      setTitle('');
      setDescription('');
      setStatus('Pending');
      setAssignedUser(currentUser?._id || '');
      setDueDate('');
    }
    setFormError('');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    const payload = {
      title,
      description,
      status,
      assignedUser,
      dueDate,
    };

    try {
      if (editingTask) {
        await taskService.updateTask(editingTask._id, payload);
      } else {
        await taskService.createTask(payload);
      }
      fetchTasksAndTeam();
      handleCloseModal();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        await taskService.deleteTask(id);
        fetchTasksAndTeam();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  const handleMoveStatus = async (task, targetStatus) => {
    try {
      await taskService.updateTask(task._id, {
        status: targetStatus,
      });
      fetchTasksAndTeam();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update task status');
    }
  };

  const isOverdue = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateString);
    return dueDate < today;
  };

  const pendingTasks = tasks.filter((t) => t.status === 'Pending');
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress');
  const completedTasks = tasks.filter((t) => t.status === 'Completed');

  const renderTaskCard = (task) => {
    const isTaskOverdue = isOverdue(task.dueDate) && task.status !== 'Completed';
    const canModify = currentUser?.role === 'Admin' || task.assignedUser?._id === currentUser?._id;

    return (
      <div
        key={task._id}
        className="bg-slate-905 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md hover:border-slate-700/80 transition-all flex flex-col gap-3 group"
      >
        <div className="flex justify-between items-start gap-2">
          <h5 className="font-semibold text-white text-sm line-clamp-1 group-hover:text-indigo-400 transition-colors">
            {task.title}
          </h5>
          <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => handleOpenModal(task)}
              disabled={!canModify}
              className="p-1 text-slate-450 hover:text-indigo-400 rounded disabled:opacity-30 cursor-pointer"
              title="Edit Task"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDeleteTask(task._id)}
              disabled={!canModify}
              className="p-1 text-slate-450 hover:text-rose-400 rounded disabled:opacity-30 cursor-pointer"
              title="Delete Task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {task.description && (
          <p className="text-xs text-slate-400 line-clamp-2 font-light">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between border-t border-slate-850 pt-3 mt-1 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 bg-slate-850 rounded-full flex items-center justify-center font-bold text-indigo-400 border border-slate-800">
              {task.assignedUser?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="truncate max-w-[80px]">{task.assignedUser?.name || 'Unassigned'}</span>
          </div>

          <div className={`flex items-center gap-1 ${isTaskOverdue ? 'text-red-400 font-medium' : 'text-slate-400'}`}>
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>

        {canModify && (
          <div className="flex gap-1.5 pt-2 border-t border-slate-850/60 mt-1">
            {task.status === 'In Progress' && (
              <button
                onClick={() => handleMoveStatus(task, 'Pending')}
                className="flex-1 py-1 text-[10px] bg-slate-850 hover:bg-slate-800 text-slate-400 rounded flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3 h-3" />
                <span>Move Left</span>
              </button>
            )}
            {task.status === 'Pending' && (
              <button
                onClick={() => handleMoveStatus(task, 'In Progress')}
                className="flex-1 py-1 text-[10px] bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/10 rounded flex items-center justify-center gap-1 transition-colors cursor-pointer font-semibold"
              >
                <span>Start Task</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
            {task.status !== 'Completed' && (
              <button
                onClick={() => handleMoveStatus(task, 'Completed')}
                className="flex-1 py-1 text-[10px] bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/10 rounded flex items-center justify-center gap-1 transition-colors cursor-pointer font-semibold"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Complete</span>
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">Task Management Board</h3>
          <p className="text-sm text-slate-400 font-light mt-1">Manage pipeline actions and client deliverables in Jira-style Kanban boards.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors border border-indigo-400/20 shadow-lg shadow-indigo-600/10 cursor-pointer w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Task</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <Loader className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Pending Column */}
          <div className="bg-[#0c1220]/60 border border-slate-850 p-4 rounded-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <h4 className="font-bold text-white text-sm">To Do / Pending</h4>
              </div>
              <span className="text-xs bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-semibold">
                {pendingTasks.length}
              </span>
            </div>
            <div className="flex flex-col gap-3 min-h-[400px]">
              {pendingTasks.length > 0 ? (
                pendingTasks.map((t) => renderTaskCard(t))
              ) : (
                <div className="flex-1 border border-dashed border-slate-800 rounded-xl flex items-center justify-center py-12 text-slate-500 text-xs font-light">
                  No pending tasks.
                </div>
              )}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="bg-[#0c1220]/60 border border-slate-850 p-4 rounded-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <h4 className="font-bold text-white text-sm">In Progress</h4>
              </div>
              <span className="text-xs bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-semibold">
                {inProgressTasks.length}
              </span>
            </div>
            <div className="flex flex-col gap-3 min-h-[400px]">
              {inProgressTasks.length > 0 ? (
                inProgressTasks.map((t) => renderTaskCard(t))
              ) : (
                <div className="flex-1 border border-dashed border-slate-880 border-slate-800 rounded-xl flex items-center justify-center py-12 text-slate-505 text-slate-500 text-xs font-light">
                  No active tasks.
                </div>
              )}
            </div>
          </div>

          {/* Completed Column */}
          <div className="bg-[#0c1220]/60 border border-slate-850 p-4 rounded-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <h4 className="font-bold text-white text-sm">Completed</h4>
              </div>
              <span className="text-xs bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-semibold">
                {completedTasks.length}
              </span>
            </div>
            <div className="flex flex-col gap-3 min-h-[400px]">
              {completedTasks.length > 0 ? (
                completedTasks.map((t) => renderTaskCard(t))
              ) : (
                <div className="flex-1 border border-dashed border-slate-800 rounded-xl flex items-center justify-center py-12 text-slate-500 text-xs font-light">
                  No completed tasks yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Task Creation / Editing Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/30">
              <h4 className="text-base font-bold text-white">
                {editingTask ? 'Edit Task Details' : 'Create Action Task'}
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
              <div>
                <label className="block text-slate-300 text-xs font-semibold mb-1.5">Task Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Review contract, call customer..."
                  className="w-full bg-slate-950/60 border border-slate-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 placeholder:text-slate-650"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-semibold mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Task details and scope..."
                  rows="3"
                  className="w-full bg-slate-950/60 border border-slate-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 placeholder:text-slate-650"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-xs font-semibold mb-1.5">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 text-xs font-semibold mb-1.5">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-semibold mb-1.5">Assigned User</label>
                <select
                  value={assignedUser}
                  onChange={(e) => setAssignedUser(e.target.value)}
                  disabled={currentUser?.role !== 'Admin'}
                  className="w-full bg-slate-950/60 border border-slate-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50"
                >
                  {currentUser?.role !== 'Admin' && (
                    <option value={assignedUser}>{editingTask?.assignedUser?.name || currentUser?.name}</option>
                  )}
                  {currentUser?.role === 'Admin' && team.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name} ({member.role})
                    </option>
                  ))}
                </select>
                {currentUser?.role !== 'Admin' && (
                  <p className="text-[10px] text-slate-500 mt-1">Only administrators can reassign tasks.</p>
                )}
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
                  <span>{editingTask ? 'Update Task' : 'Create Task'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
