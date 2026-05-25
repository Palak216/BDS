import API from './api';

const getLeads = async (filters = {}) => {
  const { search, status, assignedTo } = filters;
  const params = {};
  if (search) params.search = search;
  if (status) params.status = status;
  if (assignedTo) params.assignedTo = assignedTo;

  const response = await API.get('/leads', { params });
  return response.data;
};

const getLeadById = async (id) => {
  const response = await API.get(`/leads/${id}`);
  return response.data;
};

const createLead = async (leadData) => {
  const response = await API.post('/leads', leadData);
  return response.data;
};

const updateLead = async (id, leadData) => {
  const response = await API.put(`/leads/${id}`, leadData);
  return response.data;
};

const deleteLead = async (id) => {
  const response = await API.delete(`/leads/${id}`);
  return response.data;
};

const leadService = {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
};

export default leadService;
