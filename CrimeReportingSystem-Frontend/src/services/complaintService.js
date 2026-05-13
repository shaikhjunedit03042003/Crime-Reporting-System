import { complaintAPI } from "./api";

export const complaintService = {
  // Register new complaint
  async registerComplaint(complaintData) {
    try {
      const response = await complaintAPI.registerComplaint({
        crimeType: complaintData.crimeType,
        description: complaintData.description,
        incidentLocation: complaintData.incidentLocation,
        incidentDateTime: complaintData.incidentDateTime,
        priority: complaintData.priority || "MEDIUM",
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to register complaint",
        data: null,
      };
    }
  },

  // Get complaint by ID
  async getComplaintById(complaintId) {
    try {
      const response = await complaintAPI.getComplaintById(complaintId);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Complaint not found",
        data: null,
      };
    }
  },

  // Track complaint (public endpoint)
  async trackComplaint(complaintId) {
    try {
      const response = await complaintAPI.trackComplaint(complaintId);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Complaint not found",
        data: null,
      };
    }
  },

  // Get user's complaints with pagination
  async getUserComplaints(page = 0, size = 10) {
    try {
      const response = await complaintAPI.getUserComplaints(page, size);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to fetch complaints",
        data: null,
      };
    }
  },

  // Update complaint status
  async updateComplaintStatus(complaintId, status, remarks = "") {
    try {
      const response = await complaintAPI.updateComplaintStatus(
        complaintId,
        status,
        remarks,
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to update complaint status",
        data: null,
      };
    }
  },

  // Add investigation notes
  async addInvestigationNotes(complaintId, notes) {
    try {
      const response = await complaintAPI.addInvestigationNotes(
        complaintId,
        notes,
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to add investigation notes",
        data: null,
      };
    }
  },

  // Get station complaints
  async getStationComplaints(stationId, page = 0, size = 10) {
    try {
      const response = await complaintAPI.getStationComplaints(
        stationId,
        page,
        size,
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to fetch station complaints",
        data: null,
      };
    }
  },

  // Format complaint status for display
  formatStatus(status) {
    const statusMap = {
      REGISTERED: "Registered",
      ASSIGNED: "Assigned to Police",
      UNDER_INVESTIGATION: "Under Investigation",
      RESOLVED: "Resolved",
      CLOSED: "Closed",
      REJECTED: "Rejected",
    };
    return statusMap[status] || status;
  },

  // Get status badge color
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
};
