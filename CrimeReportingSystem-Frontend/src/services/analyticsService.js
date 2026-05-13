import api from './api';

const BASE = '/api/analytics';

const getCrimeTrends = (filters) => {
  const params = new URLSearchParams(filters).toString();
  return api.get(`${BASE}/crime-trends?${params}`);
};

const getHotspotData = (filters) => {
  const params = new URLSearchParams(filters).toString();
  return api.get(`${BASE}/hotspots?${params}`);
};

const getPerformanceMetrics = (filters) => {
  const params = new URLSearchParams(filters).toString();
  return api.get(`${BASE}/performance?${params}`);
};

const getPeakTimes = (filters) => {
  const params = new URLSearchParams(filters).toString();
  return api.get(`${BASE}/peak-times?${params}`);
};

const exportReport = (filters, format = 'csv') => {
  const params = new URLSearchParams({ ...filters, format }).toString();
  return api.get(`${BASE}/export?${params}`, { responseType: 'blob' });
};

export default { getCrimeTrends, getHotspotData, getPerformanceMetrics, getPeakTimes, exportReport };
