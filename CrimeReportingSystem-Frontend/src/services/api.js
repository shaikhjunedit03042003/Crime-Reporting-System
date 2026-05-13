import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to request headers if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle response errors with automatic token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh-token`,
            {},
            {
              headers: { Authorization: `Bearer ${refreshToken}` },
            },
          );

          if (response.data.success) {
            const newAccessToken = response.data.data.accessToken;
            localStorage.setItem("accessToken", newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        // Token refresh failed - redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 401) {
      // First 401 or refresh failed
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

// Authentication APIs
export const authAPI = {
  login: (emailOrMobile, password) =>
    apiClient.post("/auth/login", { emailOrMobile, password }),

  register: (data) => apiClient.post("/auth/register", data),

  refreshToken: (refreshToken) =>
    apiClient.post(
      "/auth/refresh-token",
      {},
      {
        headers: { Authorization: `Bearer ${refreshToken}` },
      },
    ),

  getCurrentUser: () => apiClient.get("/auth/me"),
};

// Complaint APIs
export const complaintAPI = {
  registerComplaint: (data) => apiClient.post("/complaints/register", data),

  getComplaintById: (id) => apiClient.get(`/complaints/${id}`),

  trackComplaint: (complaintId) =>
    apiClient.get(`/complaints/track/${complaintId}`),

  getUserComplaints: (page = 0, size = 10) =>
    apiClient.get(`/complaints/my-complaints?page=${page}&size=${size}`),

  updateComplaintStatus: (id, status, remarks) =>
    apiClient.put(
      `/complaints/${id}/status`,
      {},
      {
        params: { status, remarks },
      },
    ),

  addInvestigationNotes: (id, notes) =>
    apiClient.put(`/complaints/${id}/notes`, { notes }),

  getStationComplaints: (stationId, page = 0, size = 10) =>
    apiClient.get(
      `/police/complaints?stationId=${stationId}&page=${page}&size=${size}`,
    ),
};

// User APIs
export const userAPI = {
  getProfile: () => apiClient.get("/users/profile"),

  updateProfile: (data) => apiClient.put("/users/profile", data),

  changePassword: (oldPassword, newPassword) =>
    apiClient.post("/users/change-password", { oldPassword, newPassword }),
};

// Admin APIs
export const adminAPI = {
  getAllComplaints: (page = 0, size = 10, status = null) => {
    const url = status
      ? `/admin/complaints?page=${page}&size=${size}&status=${status}`
      : `/admin/complaints?page=${page}&size=${size}`;
    return apiClient.get(url);
  },

  getStatistics: () => apiClient.get("/admin/statistics"),

  getComplaintStatistics: () => apiClient.get("/admin/complaint-stats"),

  getCrimeDistribution: () => apiClient.get("/admin/crime-distribution"),

  assignComplaintToStation: (complaintId, stationId, reason = "") =>
    apiClient.put(`/admin/complaints/${complaintId}/assign-station`, {
      stationId,
      reason,
    }),

  updateComplaintStatus: (complaintId, status, remarks = "") =>
    apiClient.put(`/admin/complaints/${complaintId}/status`, {
      status,
      remarks,
    }),

  getPoliceStations: () => apiClient.get("/admin/police-stations"),

  getUsers: (page = 0, size = 10) =>
    apiClient.get(`/admin/users?page=${page}&size=${size}`),

  deactivateUser: (userId, reason = "") =>
    apiClient.put(`/admin/users/${userId}/deactivate`, { reason }),

  // Police Officer Management
  getOfficers: (page = 0, size = 10) =>
    apiClient.get(`/admin/police-officers?page=${page}&size=${size}`),

  addOfficer: (data) => apiClient.post("/admin/police-officers", data),

  updateOfficer: (officerId, data) =>
    apiClient.put(`/admin/police-officers/${officerId}`, data),

  deleteOfficer: (officerId, reason = "") =>
    apiClient.delete(`/admin/police-officers/${officerId}`, {
      data: { reason },
    }),

  assignOfficerToStation: (officerId, stationId) =>
    apiClient.put(`/admin/police-officers/${officerId}/assign-station`, {
      stationId,
    }),

  getOfficerDetails: (officerId) =>
    apiClient.get(`/admin/police-officers/${officerId}`),

  getOfficerPerformance: (officerId) =>
    apiClient.get(`/admin/police-officers/${officerId}/performance`),

  searchOfficers: (query) =>
    apiClient.get(`/admin/police-officers/search?query=${query}`),
};

// Police APIs
export const policeAPI = {
  getAssignedComplaints: (page = 0, size = 10, status = "") => {
    const url = status
      ? `/police/complaints?page=${page}&size=${size}&status=${status}`
      : `/police/complaints?page=${page}&size=${size}`;
    return apiClient.get(url);
  },

  getComplaintDetails: (complaintId) =>
    apiClient.get(`/police/complaints/${complaintId}`),

  updateComplaintStatus: (complaintId, status, remarks = "") =>
    apiClient.put(`/police/complaints/${complaintId}/status`, {
      status,
      remarks,
    }),

  addInvestigationNotes: (complaintId, notes) =>
    apiClient.put(`/police/complaints/${complaintId}/notes`, { notes }),

  getInvestigationNotes: (complaintId) =>
    apiClient.get(`/police/complaints/${complaintId}/notes`),

  getPoliceStatistics: () => apiClient.get("/police/statistics"),

  getStationInfo: () => apiClient.get("/police/station"),
};

// Notification APIs
export const notificationAPI = {
  getNotifications: (page = 0, size = 10) =>
    apiClient.get(`/notifications?page=${page}&size=${size}`),

  getUnreadCount: () => apiClient.get("/notifications/unread-count"),

  getRecentNotifications: (limit = 5) =>
    apiClient.get(`/notifications/recent?limit=${limit}`),

  getUnreadNotifications: () => apiClient.get("/notifications/unread"),

  markAsRead: (notificationId) =>
    apiClient.put(`/notifications/${notificationId}/read`),

  markAllAsRead: () => apiClient.put("/notifications/read-all"),

  deleteNotification: (notificationId) =>
    apiClient.delete(`/notifications/${notificationId}`),
};

export default apiClient;
