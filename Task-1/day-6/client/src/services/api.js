import axios from 'axios';

const API_URL = '/api';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const retryRequest = async (fn, retries = MAX_RETRIES) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK' || error.response?.status >= 500)) {
      await sleep(RETRY_DELAY);
      return retryRequest(fn, retries - 1);
    }
    throw error;
  }
};

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
  const response = await retryRequest(() => api.post('/auth/login', { email, password }));
  return response.data;
};

export const signup = async (email, password) => {
  const response = await retryRequest(() => api.post('/auth/signup', { email, password }));
  return response.data;
};

export const getRecentItems = async (limit = 20) => {
  const response = await retryRequest(() => api.get(`/items/recent?limit=${limit}`));
  return response.data;
};

export const getItems = async (params = {}) => {
  const response = await retryRequest(() => api.get('/items', { params }));
  return response.data;
};

export const getStarredItems = async () => {
  const response = await retryRequest(() => api.get('/items/starred'));
  return response.data;
};

export const getTrashItems = async () => {
  const response = await retryRequest(() => api.get('/items/trash'));
  return response.data;
};

export const getCategories = async () => {
  const response = await retryRequest(() => api.get('/items/categories'));
  return response.data;
};

export const createItem = async (itemData) => {
  const response = await retryRequest(() => api.post('/items', itemData));
  return response.data;
};

export const getItem = async (id) => {
  const response = await retryRequest(() => api.get(`/items/${id}`));
  return response.data;
};

export const updateItem = async (id, data) => {
  const response = await retryRequest(() => api.patch(`/items/${id}`, data));
  return response.data;
};

export const deleteItem = async (id, permanent = false) => {
  const response = await retryRequest(() => api.delete(`/items/${id}?permanent=${permanent}`));
  return response.data;
};

export const restoreItem = async (id) => {
  const response = await retryRequest(() => api.post(`/items/${id}/restore`));
  return response.data;
};

export const emptyTrash = async () => {
  const response = await retryRequest(() => api.delete('/items/trash/empty'));
  return response.data;
};

export const moveToTrash = async (id) => {
  const response = await retryRequest(() => api.delete(`/items/${id}`));
  return response.data;
};

export const getFolders = async () => {
  const response = await retryRequest(() => api.get('/folders'));
  return response.data;
};

export const createFolder = async (folderData) => {
  const response = await retryRequest(() => api.post('/folders', folderData));
  return response.data;
};

export const getFolder = async (id) => {
  const response = await retryRequest(() => api.get(`/folders/${id}`));
  return response.data;
};

export const updateFolder = async (id, data) => {
  const response = await retryRequest(() => api.patch(`/folders/${id}`, data));
  return response.data;
};

export const deleteFolder = async (id, moveItems = false) => {
  const response = await retryRequest(() => api.delete(`/folders/${id}`, { data: { moveItems } }));
  return response.data;
};

export const togglePinFolder = async (folderId) => {
  const response = await retryRequest(() => api.put(`/folders/${folderId}/pin`));
  return response.data;
};

export const search = async (query, type = null) => {
  const params = { q: query };
  if (type) params.type = type;
  const response = await retryRequest(() => api.get('/search', { params }));
  return response.data;
};

export const getSearchSuggestions = async (query) => {
  const response = await retryRequest(() => api.get('/search/suggestions', { params: { q: query } }));
  return response.data;
};

export const cacheImage = async (url) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Failed to cache image:', error);
    return null;
  }
};

export default api;
