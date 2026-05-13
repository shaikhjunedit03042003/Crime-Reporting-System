import { adminAPI } from "./api";

export const adminService = {
  // Get all complaints with pagination and status filter
  async getAllComplaints(page = 0, size = 10, status = null) {
    try {
      const response = await adminAPI.getAllComplaints(page, size, status);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to fetch complaints",
        data: null,
      };
    }
  },

  // Get system statistics
  async getStatistics() {
    try {
      const response = await adminAPI.getStatistics();
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to fetch statistics",
        data: null,
      };
    }
  },

  // Get complaint statistics
  async getComplaintStatistics() {
    try {
      const response = await adminAPI.getComplaintStatistics();
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to fetch complaint statistics",
        data: null,
      };
    }
  },

  // Get crime distribution
  async getCrimeDistribution() {
    try {
      const response = await adminAPI.getCrimeDistribution();
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to fetch crime distribution",
        data: null,
      };
    }
  },

  // Assign complaint to police station
  async assignComplaintToStation(complaintId, stationId, reason = "") {
    try {
      const response = await adminAPI.assignComplaintToStation(
        complaintId,
        stationId,
        reason,
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to assign complaint",
        data: null,
      };
    }
  },

  // Update complaint status
  async updateComplaintStatus(complaintId, status, remarks = "") {
    try {
      const response = await adminAPI.updateComplaintStatus(
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

  // Get all police stations
  async getPoliceStations() {
    try {
      const response = await adminAPI.getPoliceStations();
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to fetch police stations",
        data: null,
      };
    }
  },

  // Get all users with pagination
  async getUsers(page = 0, size = 10) {
    try {
      const response = await adminAPI.getUsers(page, size);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to fetch users",
        data: null,
      };
    }
  },

  // Deactivate user
  async deactivateUser(userId, reason = "") {
    try {
      const response = await adminAPI.deactivateUser(userId, reason);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to deactivate user",
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

  // Get priority badge color
  getPriorityColor(priority) {
    const colorMap = {
      LOW: "info",
      MEDIUM: "warning",
      HIGH: "danger",
      CRITICAL: "dark",
    };
    return colorMap[priority] || "secondary";
  },

  // Export complaints to CSV
  exportComplaintsToCSV(complaints, fileName = "complaints.csv") {
    if (!complaints || complaints.length === 0) {
      alert("No complaints to export");
      return;
    }

    const headers = [
      "Complaint ID",
      "Crime Type",
      "Status",
      "Priority",
      "Location",
      "Reporter",
      "Created Date",
      "Updated Date",
    ];

    const rows = complaints.map((complaint) => [
      complaint.complaintId,
      complaint.crimeType,
      this.formatStatus(complaint.status),
      complaint.priority,
      complaint.incidentLocation,
      complaint.reporterName,
      new Date(complaint.createdAt).toLocaleDateString(),
      new Date(complaint.updatedAt).toLocaleDateString(),
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

  // Export users to CSV
  exportUsersToCSV(users, fileName = "users.csv") {
    if (!users || users.length === 0) {
      alert("No users to export");
      return;
    }

    const headers = [
      "User ID",
      "Name",
      "Email",
      "Mobile",
      "Role",
      "City",
      "Active",
      "Registered Date",
    ];

    const rows = users.map((user) => [
      user.id,
      user.name,
      user.email,
      user.mobileNumber,
      user.role,
      user.city,
      user.active ? "Yes" : "No",
      new Date(user.createdAt).toLocaleDateString(),
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
};
