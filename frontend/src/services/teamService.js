import API from './api';

const getTeamMembers = async () => {
  const response = await API.get('/team');
  return response.data;
};

const getDashboardStats = async () => {
  const response = await API.get('/team/dashboard-stats');
  return response.data;
};

const teamService = {
  getTeamMembers,
  getDashboardStats,
};

export default teamService;
