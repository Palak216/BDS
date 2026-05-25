import API from './api';

const login = async (email, password) => {
  const response = await API.post('/auth/login', { email, password });
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const register = async (name, email, password, role) => {
  const response = await API.post('/auth/register', { name, email, password, role });
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const authService = {
  login,
  register,
  logout,
  getCurrentUser,
};

export default authService;
