import api from './api';

/**
 * Mobile Service
 * Provides API wrapper methods for mobile endpoints
 * Optimized for low-bandwidth clients with minimal payloads
 */

/**
 * File a new complaint via mobile
 * @param {Object} complaintData - Mobile complaint request DTO
 * @returns {Promise} - Response with complaint details
 */
export const fileComplaintMobile = async (complaintData) => {
  try {
    const response = await api.post('/api/mobile/complaints', complaintData);
    return response.data;
  } catch (error) {
    console.error('Error filing complaint via mobile:', error);
    throw error;
  }
};

/**
 * Get complaint status by ID
 * @param {string} complaintId - Complaint ID
 * @returns {Promise} - Mobile complaint response with minimal fields
 */
export const getComplaintStatus = async (complaintId) => {
  try {
    const response = await api.get(`/api/mobile/complaints/${complaintId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching complaint status:', error);
    throw error;
  }
};

/**
 * Get all complaints for authenticated user
 * @param {number} page - Page number (0-indexed)
 * @param {number} size - Number of items per page
 * @returns {Promise} - Paginated user complaints
 */
export const getUserComplaints = async (page = 0, size = 10) => {
  try {
    const response = await api.get('/api/mobile/complaints', {
      params: {
        page,
        size
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user complaints:', error);
    throw error;
  }
};

/**
 * Get notifications for user
 * @param {number} page - Page number (0-indexed)
 * @param {number} size - Number of items per page
 * @returns {Promise} - Paginated notifications
 */
export const getNotifications = async (page = 0, size = 20) => {
  try {
    const response = await api.get('/api/mobile/notifications', {
      params: {
        page,
        size
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

/**
 * Mark notification as read
 * @param {number} notificationId - Notification ID
 * @returns {Promise} - Updated notification response
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.patch(`/api/mobile/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Get count of unread notifications
 * @returns {Promise} - Object with unreadCount property
 */
export const getUnreadNotificationCount = async () => {
  try {
    const response = await api.get('/api/mobile/notifications/count/unread');
    return response.data;
  } catch (error) {
    console.error('Error fetching unread notification count:', error);
    throw error;
  }
};

/**
 * Get active crime types for mobile dropdown
 * @returns {Promise} - Array of crime type objects {id, name}
 */
export const getCrimeTypesForMobile = async () => {
  try {
    const response = await api.get('/api/mobile/settings/crime-types');
    return response.data;
  } catch (error) {
    console.error('Error fetching crime types for mobile:', error);
    throw error;
  }
};

/**
 * Get active priorities for mobile dropdown
 * @returns {Promise} - Array of priority objects {id, name, level}
 */
export const getPrioritiesForMobile = async () => {
    try {
    const response = await api.get('/api/mobile/settings/priorities');
    return response.data;
  } catch (error) {
    console.error('Error fetching priorities for mobile:', error);
    throw error;
  }
};

/**
 * Create a mobile complaint request DTO
 * @param {Object} complaintData - Raw complaint data
 * @returns {Object} - MobileComplaintRequest DTO
 */
export const createMobileComplaintRequest = (complaintData) => {
  return {
    crimeType: complaintData.crimeType || '',
    description: complaintData.description || '',
    incidentLocation: complaintData.incidentLocation || '',
    incidentDateTime: complaintData.incidentDateTime || new Date().toISOString(),
    latitude: complaintData.latitude || null,
    longitude: complaintData.longitude || null,
    priority: complaintData.priority || 'NORMAL',
    attachmentUrls: complaintData.attachmentUrls || []
  };
};

export default {
  fileComplaintMobile,
  getComplaintStatus,
  getUserComplaints,
  getNotifications,
  markNotificationAsRead,
  getUnreadNotificationCount,
  getCrimeTypesForMobile,
  getPrioritiesForMobile,
  createMobileComplaintRequest
};
