/**
 * Settings Service
 * Provides API wrapper methods for Settings/Configuration management endpoints
 * Handles HTTP requests for Crime Types, Priorities, and Notification Preferences
 */

import apiClient from './api';

// ============================================================
// CRIME TYPE API METHODS
// ============================================================

/**
 * Get all crime types with pagination
 */
export const getAllCrimeTypes = async (page = 0, size = 10) => {
  try {
    const response = await apiClient.get('/settings/crime-types', {
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching crime types:', error);
    throw error;
  }
};

/**
 * Get all active crime types (without pagination)
 */
export const getAllActiveCrimeTypes = async () => {
  try {
    const response = await apiClient.get('/settings/crime-types/active');
    return response.data;
  } catch (error) {
    console.error('Error fetching active crime types:', error);
    throw error;
  }
};

/**
 * Search crime types by keyword
 */
export const searchCrimeTypes = async (keyword, page = 0, size = 10) => {
  try {
    const response = await apiClient.get('/settings/crime-types/search', {
      params: { keyword, page, size }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching crime types:', error);
    throw error;
  }
};

/**
 * Get crime type by ID
 */
export const getCrimeTypeById = async (id) => {
  try {
    const response = await apiClient.get(`/settings/crime-types/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching crime type:', error);
    throw error;
  }
};

/**
 * Create new crime type
 */
export const createCrimeType = async (crimeTypeData) => {
  try {
    const response = await apiClient.post('/settings/crime-types', crimeTypeData);
    return response.data;
  } catch (error) {
    console.error('Error creating crime type:', error);
    throw error;
  }
};

/**
 * Update crime type
 */
export const updateCrimeType = async (id, crimeTypeData) => {
  try {
    const response = await apiClient.put(`/settings/crime-types/${id}`, crimeTypeData);
    return response.data;
  } catch (error) {
    console.error('Error updating crime type:', error);
    throw error;
  }
};

/**
 * Delete crime type
 */
export const deleteCrimeType = async (id) => {
  try {
    const response = await apiClient.delete(`/settings/crime-types/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting crime type:', error);
    throw error;
  }
};

/**
 * Toggle crime type active status
 */
export const toggleCrimeTypeStatus = async (id) => {
  try {
    const response = await apiClient.patch(`/settings/crime-types/${id}/toggle`);
    return response.data;
  } catch (error) {
    console.error('Error toggling crime type status:', error);
    throw error;
  }
};

// ============================================================
// PRIORITY API METHODS
// ============================================================

/**
 * Get all priorities with pagination
 */
export const getAllPriorities = async (page = 0, size = 10) => {
  try {
    const response = await apiClient.get('/settings/priorities', {
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching priorities:', error);
    throw error;
  }
};

/**
 * Get all active priorities (without pagination)
 */
export const getAllActivePriorities = async () => {
  try {
    const response = await apiClient.get('/settings/priorities/active');
    return response.data;
  } catch (error) {
    console.error('Error fetching active priorities:', error);
    throw error;
  }
};

/**
 * Search priorities by keyword
 */
export const searchPriorities = async (keyword, page = 0, size = 10) => {
  try {
    const response = await apiClient.get('/settings/priorities/search', {
      params: { keyword, page, size }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching priorities:', error);
    throw error;
  }
};

/**
 * Get priority by ID
 */
export const getPriorityById = async (id) => {
  try {
    const response = await apiClient.get(`/settings/priorities/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching priority:', error);
    throw error;
  }
};

/**
 * Create new priority
 */
export const createPriority = async (priorityData) => {
  try {
    const response = await apiClient.post('/settings/priorities', priorityData);
    return response.data;
  } catch (error) {
    console.error('Error creating priority:', error);
    throw error;
  }
};

/**
 * Update priority
 */
export const updatePriority = async (id, priorityData) => {
  try {
    const response = await apiClient.put(`/settings/priorities/${id}`, priorityData);
    return response.data;
  } catch (error) {
    console.error('Error updating priority:', error);
    throw error;
  }
};

/**
 * Delete priority
 */
export const deletePriority = async (id) => {
  try {
    const response = await apiClient.delete(`/settings/priorities/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting priority:', error);
    throw error;
  }
};

/**
 * Toggle priority active status
 */
export const togglePriorityStatus = async (id) => {
  try {
    const response = await apiClient.patch(`/settings/priorities/${id}/toggle`);
    return response.data;
  } catch (error) {
    console.error('Error toggling priority status:', error);
    throw error;
  }
};

// ============================================================
// NOTIFICATION PREFERENCE API METHODS
// ============================================================

/**
 * Get all notification preferences with pagination
 */
export const getAllNotificationPreferences = async (page = 0, size = 10) => {
  try {
    const response = await apiClient.get('/settings/notification-preferences', {
      params: { page, size }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    throw error;
  }
};

/**
 * Get all enabled notification preferences (without pagination)
 */
export const getAllEnabledPreferences = async () => {
  try {
    const response = await apiClient.get('/settings/notification-preferences/enabled');
    return response.data;
  } catch (error) {
    console.error('Error fetching enabled preferences:', error);
    throw error;
  }
};

/**
 * Search notification preferences by keyword
 */
export const searchNotificationPreferences = async (keyword, page = 0, size = 10) => {
  try {
    const response = await apiClient.get('/settings/notification-preferences/search', {
      params: { keyword, page, size }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching notification preferences:', error);
    throw error;
  }
};

/**
 * Get notification preference by ID
 */
export const getNotificationPreferenceById = async (id) => {
  try {
    const response = await apiClient.get(`/settings/notification-preferences/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notification preference:', error);
    throw error;
  }
};

/**
 * Create new notification preference
 */
export const createNotificationPreference = async (preferenceData) => {
  try {
    const response = await apiClient.post('/settings/notification-preferences', preferenceData);
    return response.data;
  } catch (error) {
    console.error('Error creating notification preference:', error);
    throw error;
  }
};

/**
 * Update notification preference
 */
export const updateNotificationPreference = async (id, preferenceData) => {
  try {
    const response = await apiClient.put(`/settings/notification-preferences/${id}`, preferenceData);
    return response.data;
  } catch (error) {
    console.error('Error updating notification preference:', error);
    throw error;
  }
};

/**
 * Delete notification preference
 */
export const deleteNotificationPreference = async (id) => {
  try {
    const response = await apiClient.delete(`/settings/notification-preferences/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting notification preference:', error);
    throw error;
  }
};

/**
 * Toggle notification preference enabled status
 */
export const toggleNotificationPreferenceStatus = async (id) => {
  try {
    const response = await apiClient.patch(`/settings/notification-preferences/${id}/toggle`);
    return response.data;
  } catch (error) {
    console.error('Error toggling notification preference status:', error);
    throw error;
  }
};

export default {
  // Crime Type Methods
  getAllCrimeTypes,
  getAllActiveCrimeTypes,
  searchCrimeTypes,
  getCrimeTypeById,
  createCrimeType,
  updateCrimeType,
  deleteCrimeType,
  toggleCrimeTypeStatus,

  // Priority Methods
  getAllPriorities,
  getAllActivePriorities,
  searchPriorities,
  getPriorityById,
  createPriority,
  updatePriority,
  deletePriority,
  togglePriorityStatus,

  // Notification Preference Methods
  getAllNotificationPreferences,
  getAllEnabledPreferences,
  searchNotificationPreferences,
  getNotificationPreferenceById,
  createNotificationPreference,
  updateNotificationPreference,
  deleteNotificationPreference,
  toggleNotificationPreferenceStatus
};
