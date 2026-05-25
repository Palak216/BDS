import API from './api';

const getTasks = async (filters = {}) => {
  const { status, assignedUser } = filters;
  const params = {};
  if (status) params.status = status;
  if (assignedUser) params.assignedUser = assignedUser;

  const response = await API.get('/tasks', { params });
  return response.data;
};

const createTask = async (taskData) => {
  const response = await API.post('/tasks', taskData);
  return response.data;
};

const updateTask = async (id, taskData) => {
  const response = await API.put(`/tasks/${id}`, taskData);
  return response.data;
};

const deleteTask = async (id) => {
  const response = await API.delete(`/tasks/${id}`);
  return response.data;
};

const taskService = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};

export default taskService;
