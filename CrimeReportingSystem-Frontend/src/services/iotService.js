import api from './api';

/**
 * IoT Service
 * Provides API wrapper methods for IoT event management
 * Handles CCTV and sensor data ingestion, retrieval, and processing
 */

/**
 * Ingest a single IoT event from a device
 * @param {Object} eventData - IoT event data
 * @returns {Promise} - Ingested event response
 */
export const ingestEvent = async (eventData) => {
  try {
    const response = await api.post('/api/iot/events', eventData);
    return response.data;
  } catch (error) {
    console.error('Error ingesting IoT event:', error);
    throw error;
  }
};

/**
 * Bulk ingest multiple IoT events (admin only)
 * @param {Array} events - Array of IoT event objects
 * @returns {Promise} - Bulk ingestion response with counts
 */
export const bulkIngestEvents = async (events) => {
  try {
    if (!Array.isArray(events) || events.length === 0) {
      throw new Error('Events array cannot be empty');
    }

    const response = await api.post('/api/iot/events/bulk', events);
    return response.data;
  } catch (error) {
    console.error('Error bulk ingesting IoT events:', error);
    throw error;
  }
};

/**
 * Get all IoT events (paginated, admin/police only)
 * @param {number} page - Page number (0-indexed)
 * @param {number} size - Items per page
 * @returns {Promise} - Paginated events
 */
export const getAllEvents = async (page = 0, size = 20) => {
  try {
    const response = await api.get('/api/iot/events', {
      params: {
        page,
        size
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching IoT events:', error);
    throw error;
  }
};

/**
 * Get IoT event by ID
 * @param {number} eventId - Event ID
 * @returns {Promise} - Event details
 */
export const getEventById = async (eventId) => {
  try {
    const response = await api.get(`/api/iot/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    throw error;
  }
};

/**
 * Get IoT events by location (for hotspot analysis)
 * @param {string} location - Location name/area
 * @param {number} page - Page number
 * @param {number} size - Items per page
 * @returns {Promise} - Events for location
 */
export const getEventsByLocation = async (location, page = 0, size = 20) => {
  try {
    const response = await api.get(`/api/iot/events/location/${location}`, {
      params: {
        page,
        size
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching events by location:', error);
    throw error;
  }
};

/**
 * Get IoT events by device ID
 * @param {string} deviceId - Device identifier
 * @param {number} page - Page number
 * @param {number} size - Items per page
 * @returns {Promise} - Events from device
 */
export const getEventsByDeviceId = async (deviceId, page = 0, size = 20) => {
  try {
    const response = await api.get(`/api/iot/events/device/${deviceId}`, {
      params: {
        page,
        size
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching events by device ID:', error);
    throw error;
  }
};

/**
 * Get IoT events by type
 * @param {string} eventType - Event type (MOTION, ALERT, etc.)
 * @param {number} page - Page number
 * @param {number} size - Items per page
 * @returns {Promise} - Events of type
 */
export const getEventsByType = async (eventType, page = 0, size = 20) => {
  try {
    const response = await api.get(`/api/iot/events/type/${eventType}`, {
      params: {
        page,
        size
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching events by type:', error);
    throw error;
  }
};

/**
 * Get unprocessed IoT events for analysis/linking
 * @param {number} page - Page number
 * @param {number} size - Items per page
 * @returns {Promise} - Unprocessed events
 */
export const getUnprocessedEvents = async (page = 0, size = 20) => {
  try {
    const response = await api.get('/api/iot/events/unprocessed/list', {
      params: {
        page,
        size
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching unprocessed events:', error);
    throw error;
  }
};

/**
 * Link IoT event to a complaint
 * @param {number} eventId - IoT event ID
 * @param {number} complaintId - Complaint ID to link
 * @returns {Promise} - Updated event
 */
export const linkEventToComplaint = async (eventId, complaintId) => {
  try {
    const response = await api.patch(
      `/api/iot/events/${eventId}/complaint/${complaintId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error linking event to complaint:', error);
    throw error;
  }
};

/**
 * Mark IoT event as processed
 * @param {number} eventId - Event ID
 * @returns {Promise} - Updated event
 */
export const markEventAsProcessed = async (eventId) => {
  try {
    const response = await api.patch(`/api/iot/events/${eventId}/process`);
    return response.data;
  } catch (error) {
    console.error('Error marking event as processed:', error);
    throw error;
  }
};

/**
 * Delete IoT event (admin only)
 * @param {number} eventId - Event ID
 * @returns {Promise} - Deletion confirmation
 */
export const deleteEvent = async (eventId) => {
  try {
    const response = await api.delete(`/api/iot/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

/**
 * Get severity badge color
 * @param {string} severity - Severity level
 * @returns {string} - Color code
 */
export const getSeverityColor = (severity) => {
  const colorMap = {
    'LOW': '#4CAF50',      // Green
    'MEDIUM': '#FF9800',   // Orange
    'HIGH': '#F44336',     // Red
    'CRITICAL': '#880E4F'  // Dark Red
  };
  return colorMap[severity] || '#9E9E9E';
};

/**
 * Format event timestamp for display
 * @param {string} timestamp - ISO timestamp
 * @returns {string} - Formatted date string
 */
export const formatEventTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

/**
 * Create IoT event request DTO
 * @param {Object} eventData - Event data
 * @returns {Object} - Formatted IoT event DTO
 */
export const createIoTEventDTO = (eventData) => {
  return {
    deviceId: eventData.deviceId || '',
    eventType: eventData.eventType || 'ALERT',
    location: eventData.location || '',
    latitude: eventData.latitude || null,
    longitude: eventData.longitude || null,
    description: eventData.description || '',
    severity: eventData.severity || 'MEDIUM',
    metadata: eventData.metadata || {},
    isProcessed: eventData.isProcessed || false
  };
};

/**
 * Get event status badge
 * @param {boolean} isProcessed - Processing status
 * @returns {Object} - Object with status and color
 */
export const getEventStatus = (isProcessed) => {
  return isProcessed 
    ? { status: 'Processed', color: '#4CAF50' }
    : { status: 'Pending', color: '#FF9800' };
};

export default {
  ingestEvent,
  bulkIngestEvents,
  getAllEvents,
  getEventById,
  getEventsByLocation,
  getEventsByDeviceId,
  getEventsByType,
  getUnprocessedEvents,
  linkEventToComplaint,
  markEventAsProcessed,
  deleteEvent,
  getSeverityColor,
  formatEventTimestamp,
  createIoTEventDTO,
  getEventStatus
};
