import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const logService = {
  getLogs: () => api.get('/logs'),

  getErrorLogs: (fileName, levels = ['ERROR', 'WARN', 'INFO']) =>
    api.get('/logs/errors', {
      params: {
        fileName,
        levels: levels.join(','),
      },
    }),

  uploadLogs: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/logs/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  analyzeLogs: (fileName) =>
    api.get('/logs/analyze', {
      params: { fileName },
    }),
};

export default api;
