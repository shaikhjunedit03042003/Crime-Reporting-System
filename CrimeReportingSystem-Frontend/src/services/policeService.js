import apiClient from "./api";

// Police Officer Service Functions
export const policeService = {
  // =================== POLICE OFFICER ENDPOINTS ===================

  /**
   * Get assigned complaints with optional filters
   */
  async getAssignedComplaints(page = 0, size = 10, filters = {}) {
    try {
      const params = new URLSearchParams({
        page,
        size,
      });

      if (filters.status) params.append("status", filters.status);
      if (filters.priority) params.append("priority", filters.priority);
      if (filters.location) params.append("location", filters.location);

      const response = await apiClient.get(`/police/complaints?${params.toString()}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch assigned complaints",
        data: null,
      };
    }
  },

  /**
   * Get complaint details
   */
  async getComplaintDetails(id) {
    try {
      const response = await apiClient.get(`/police/complaints/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch complaint details",
        data: null,
      };
    }
  },

  /**
   * Update complaint status
   */
  async updateComplaintStatus(id, statusUpdate) {
    try {
      const response = await apiClient.put(`/police/complaints/${id}/status`, statusUpdate);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update complaint status",
        data: null,
      };
    }
  },

  /**
   * Add investigation note to complaint
   */
  async addInvestigationNote(id, noteContent, noteCategory = "GENERAL") {
    try {
      const response = await apiClient.put(`/police/complaints/${id}/notes`, {
        noteContent,
        noteCategory,
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to add investigation note",
        data: null,
      };
    }
  },

  /**
   * Get investigation notes for a complaint
   */
  async getInvestigationNotes(id) {
    try {
      const response = await apiClient.get(`/police/complaints/${id}/notes`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch investigation notes",
        data: null,
      };
    }
  },

  /**
   * Get police officer performance statistics
   */
  async getPoliceStatistics() {
    try {
      const response = await apiClient.get("/police/statistics");
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch statistics",
        data: null,
      };
    }
  },

  /**
   * Get police station information
   */
  async getStationInfo() {
    try {
      const response = await apiClient.get("/police/station");
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch station info",
        data: null,
      };
    }
  },

  /**
   * Get complaints with geolocation for maps
   */
  async getComplaintsForMap(filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.status) params.append("status", filters.status);
      if (filters.priority) params.append("priority", filters.priority);

      const response = await apiClient.get(
        `/police/complaints/map${params.toString() ? "?" + params.toString() : ""}`,
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch complaints for map",
        data: null,
      };
    }
  },

  // =================== ADMIN POLICE MANAGEMENT ENDPOINTS ===================

  /**
   * Get all police officers (admin endpoint)
   */
  async getAllPoliceOfficers(page = 0, size = 10) {
    try {
      const response = await apiClient.get(`/admin/police?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch police officers",
        data: null,
      };
    }
  },

  /**
   * Add new police officer (admin endpoint)
   */
  async addPoliceOfficer(policeData) {
    try {
      const response = await apiClient.post("/admin/police", policeData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to add police officer",
        data: null,
      };
    }
  },

  /**
   * Update police officer (admin endpoint)
   */
  async updatePoliceOfficer(id, policeData) {
    try {
      const response = await apiClient.put(`/admin/police/${id}`, policeData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update police officer",
        data: null,
      };
    }
  },

  /**
   * Get police officer performance metrics (admin endpoint)
   */
  async getPolicePerformance(officerId) {
    try {
      const response = await apiClient.get(`/admin/police/${officerId}/performance`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch police performance",
        data: null,
      };
    }
  },

  /**
   * Get overall police statistics (admin endpoint)
   */
  async getAdminPoliceStatistics() {
    try {
      const response = await apiClient.get("/admin/police/statistics");
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch police statistics",
        data: null,
      };
    }
  },

  // =================== HELPER FUNCTIONS ===================

  /**
   * Format complaint status for display
   */
  formatStatus(status) {
    const statusMap = {
      REGISTERED: "Registered",
      ASSIGNED: "Assigned",
      UNDER_INVESTIGATION: "Under Investigation",
      RESOLVED: "Resolved",
      CLOSED: "Closed",
      REJECTED: "Rejected",
    };
    return statusMap[status] || status;
  },

  /**
   * Get status badge color
   */
  getStatusColor(status) {
    const colorMap = {
      REGISTERED: "primary",
      ASSIGNED: "info",
      UNDER_INVESTIGATION: "warning",
      RESOLVED: "success",
      CLOSED: "secondary",
      REJECTED: "danger",
    };
    return colorMap[status] || "secondary";
  },

  /**
   * Get priority badge color
   */
  getPriorityColor(priority) {
    const colorMap = {
      HIGH: "danger",
      MEDIUM: "warning",
      LOW: "info",
      NORMAL: "secondary",
    };
    return colorMap[priority] || "secondary";
  },

  /**
   * Calculate days since registration
   */
  getDaysSinceRegistration(createdAt) {
    const createdDate = new Date(createdAt);
    const today = new Date();
    const diffTime = Math.abs(today - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  },

  /**
   * Export complaints to CSV
   */
  exportComplaintsToCSV(complaints, fileName = "assigned_complaints.csv") {
    if (!complaints || complaints.length === 0) {
      alert("No complaints to export");
      return;
    }

    const headers = [
      "Complaint ID",
      "Crime Type",
      "Status",
      "Location",
      "Priority",
      "Reporter",
      "Days Since Registration",
    ];

    const rows = complaints.map((complaint) => [
      complaint.complaintId,
      complaint.crimeType,
      this.formatStatus(complaint.status),
      complaint.incidentLocation,
      complaint.priority,
      complaint.reporter?.name || "N/A",
      this.getDaysSinceRegistration(complaint.createdAt),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  /**
   * Format performance rating
   */
  formatPerformanceRating(rating) {
    const ratingMap = {
      EXCELLENT: "Excellent",
      GOOD: "Good",
      AVERAGE: "Average",
      NEEDS_IMPROVEMENT: "Needs Improvement",
    };
    return ratingMap[rating] || rating;
  },

  /**
   * Get performance rating color
   */
  getPerformanceColor(rating) {
    const colorMap = {
      EXCELLENT: "success",
      GOOD: "info",
      AVERAGE: "warning",
      NEEDS_IMPROVEMENT: "danger",
    };
    return colorMap[rating] || "secondary";
  },
};

