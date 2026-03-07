import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const saveItem = async (type, category, content) => {
  const response = await api.post('/items/save', { type, category, content });
  return response.data;
};

export const getItems = async () => {
  const response = await api.get('/items');
  return response.data;
};

export default api;
