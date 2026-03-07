import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

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
