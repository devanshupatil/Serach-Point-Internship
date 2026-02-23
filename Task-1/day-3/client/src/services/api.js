import axios from 'axios';

const API_URL = '/api/auth';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  const response = await api.post('/login', { email, password });
  return response.data;
};

export const saveItem = async (itemData) => {
  const response = await api.post('/items/save', itemData);
  return response.data;
};

export const getItems = async (folderId) => {
  const response = await api.get('/items', { params: { folderId } });
  return response.data;
};

export const saveFolder = async (folderData) => {
  const response = await api.post('/folders', folderData);
  return response.data;
};

export const getFolders = async () => {
  const response = await api.get('/folders');
  return response.data;
};

export default api;
