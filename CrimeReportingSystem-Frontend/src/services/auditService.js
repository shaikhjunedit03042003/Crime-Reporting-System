import apiClient from "./api";

/**
 * Audit Service
 * Provides methods to fetch audit logs from the backend API
 */

/**
 * Get all audit logs with pagination
 * @param {number} page - Page number (0-based)
 * @param {number} size - Number of records per page
 * @param {string} sortBy - Field to sort by (default: timestamp)
 * @param {string} direction - Sort direction (ASC or DESC)
 * @returns {Promise} Page of audit logs
 */
export const getLogs = async (page = 0, size = 10, sortBy = "timestamp", direction = "DESC") => {
  try {
    const response = await apiClient.get("/audit/logs", {
      params: {
        page,
        size,
        sortBy,
        direction,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    throw error;
  }
};

/**
 * Get specific audit log by ID
 * @param {number} id - Audit log ID
 * @returns {Promise} Audit log details
 */
export const getLogById = async (id) => {
  try {
    const response = await apiClient.get(`/audit/logs/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching audit log:", error);
    throw error;
  }
};

/**
 * Filter audit logs by multiple criteria
 * @param {Object} filters - Filter criteria
 * @param {number} filters.userId - User ID
 * @param {string} filters.userRole - User role
 * @param {string} filters.actionType - Action type
 * @param {string} filters.targetEntity - Target entity
 * @param {string} filters.startDate - Start date (ISO format)
 * @param {string} filters.endDate - End date (ISO format)
 * @param {number} filters.page - Page number
 * @param {number} filters.size - Page size
 * @param {string} filters.sortBy - Sort by field
 * @param {string} filters.direction - Sort direction
 * @returns {Promise} Filtered page of audit logs
 */
export const filterLogs = async (filters = {}) => {
  try {
    const params = {
      page: filters.page || 0,
      size: filters.size || 10,
      sortBy: filters.sortBy || "timestamp",
      direction: filters.direction || "DESC",
    };

    if (filters.userId) params.userId = filters.userId;
    if (filters.userRole) params.userRole = filters.userRole;
    if (filters.actionType) params.actionType = filters.actionType;
    if (filters.targetEntity) params.targetEntity = filters.targetEntity;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;

    const response = await apiClient.get("/audit/logs/filter", { params });
    return response.data;
  } catch (error) {
    console.error("Error filtering audit logs:", error);
    throw error;
  }
};

/**
 * Get audit logs by user ID
 * @param {number} userId - User ID
 * @param {number} page - Page number
 * @param {number} size - Page size
 * @returns {Promise} Page of audit logs for the user
 */
export const getLogsByUserId = async (userId, page = 0, size = 10) => {
  try {
    const response = await apiClient.get(`/audit/logs/user/${userId}`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching logs by user ID:", error);
    throw error;
  }
};

/**
 * Get audit logs by user role
 * @param {string} userRole - User role
 * @param {number} page - Page number
 * @param {number} size - Page size
 * @returns {Promise} Page of audit logs for the role
 */
export const getLogsByUserRole = async (userRole, page = 0, size = 10) => {
  try {
    const response = await apiClient.get(`/audit/logs/role/${userRole}`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching logs by user role:", error);
    throw error;
  }
};

/**
 * Get audit logs by action type
 * @param {string} actionType - Action type
 * @param {number} page - Page number
 * @param {number} size - Page size
 * @returns {Promise} Page of audit logs for the action type
 */
export const getLogsByActionType = async (actionType, page = 0, size = 10) => {
  try {
    const response = await apiClient.get(`/audit/logs/action/${actionType}`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching logs by action type:", error);
    throw error;
  }
};

/**
 * Get audit logs for a specific resource
 * @param {string} targetEntity - Target entity type
 * @param {number} targetId - Target entity ID
 * @param {number} page - Page number
 * @param {number} size - Page size
 * @returns {Promise} Page of audit logs for the resource
 */
export const getLogsByResource = async (targetEntity, targetId, page = 0, size = 10) => {
  try {
    const response = await apiClient.get(`/audit/logs/resource/${targetEntity}/${targetId}`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching logs by resource:", error);
    throw error;
  }
};

/**
 * Get user audit trail for a date range
 * @param {number} userId - User ID
 * @param {string} startDate - Start date (ISO format)
 * @param {string} endDate - End date (ISO format)
 * @returns {Promise} List of audit logs
 */
export const getUserAuditTrail = async (userId, startDate, endDate) => {
  try {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await apiClient.get(`/audit/trail/user/${userId}`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching user audit trail:", error);
    throw error;
  }
};

/**
 * Get recent audit logs
 * @param {number} limit - Number of recent logs to retrieve
 * @returns {Promise} List of recent audit logs
 */
export const getRecentLogs = async (limit = 20) => {
  try {
    const response = await apiClient.get("/audit/recent", {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching recent logs:", error);
    throw error;
  }
};

// Export as object for alternative usage
export const auditService = {
  getLogs,
  getLogById,
  filterLogs,
  getLogsByUserId,
  getLogsByUserRole,
  getLogsByActionType,
  getLogsByResource,
  getUserAuditTrail,
  getRecentLogs,
};
