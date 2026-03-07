import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getRecentItems = async (limit = 20) => {
  const response = await api.get(`/items/recent?limit=${limit}`);
  return response.data;
};

export const getItems = async (params = {}) => {
  const response = await api.get('/items', { params });
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/items/categories');
  return response.data;
};

export const getFolders = async () => {
  const response = await api.get('/folders');
  return response.data;
};

export const createFolder = async (folderData) => {
  const response = await api.post('/folders', folderData);
  return response.data;
};

export const togglePinFolder = async (folderId) => {
  const response = await api.put(`/folders/${folderId}/pin`);
  return response.data;
};

export const deleteFolder = async (folderId) => {
  const response = await api.delete(`/folders/${folderId}`);
  return response.data;
};

export default api;
