import api from './api';

const BASE = '/api/evidence';

const uploadEvidence = (complaintId, file, description, onUploadProgress) => {
  const form = new FormData();
  form.append('complaintId', complaintId);
  form.append('file', file);
  if (description) form.append('description', description);
  return api.post(`${BASE}/upload`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress
  });
};

const getEvidenceList = (complaintId) => api.get(`${BASE}/${complaintId}`);
const downloadEvidence = (fileId) => api.get(`${BASE}/download/${fileId}`, { responseType: 'blob' });
const deleteEvidence = (fileId) => api.delete(`${BASE}/${fileId}`);

export default {
  uploadEvidence,
  getEvidenceList,
  downloadEvidence,
  deleteEvidence
};
