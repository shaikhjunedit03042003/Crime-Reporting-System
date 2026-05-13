import api from './api';

const BASE = '/api/notifications';
const getNotifications = (page = 0, size = 10) => api.get(`${BASE}?page=${page}&size=${size}`);
const getUnreadCount = () => api.get(`${BASE}/unread-count`);
const getRecentNotifications = (limit = 5) => api.get(`${BASE}/recent?limit=${limit}`);
const getUnreadNotifications = () => api.get(`${BASE}/unread`);
const markAsRead = (id) => api.put(`${BASE}/${id}/read`);
const markAllAsRead = () => api.put(`${BASE}/read-all`);
const deleteNotification = (id) => api.delete(`${BASE}/${id}`);

function listenForRealtimeNotifications(onMessage) {
  // SSE connection to the backend stream endpoint
  const url = '/api/notifications/stream';
  const evtSource = new EventSource(url);
  evtSource.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      onMessage && onMessage(data);
    } catch (err) {
      onMessage && onMessage(e.data);
    }
  };
  evtSource.addEventListener('notification', (e) => {
    try { onMessage && onMessage(JSON.parse(e.data)); } catch (err) { onMessage && onMessage(e.data); }
  });
  evtSource.onerror = (err) => { console.warn('SSE error', err); };
  return evtSource;
}

export default {
  getNotifications,
  getUnreadCount,
  getRecentNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  listenForRealtimeNotifications
};
import { notificationAPI } from "./api";

export const notificationService = {
  // Get all notifications with pagination
  async getNotifications(page = 0, size = 10) {
    try {
      const response = await notificationAPI.getNotifications(page, size);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to fetch notifications",
        data: null,
      };
    }
  },

  // Get unread count
  async getUnreadCount() {
    try {
      const response = await notificationAPI.getUnreadCount();
      return response.data;
    } catch (error) {
      return {
        success: false,
        unreadCount: 0,
      };
    }
  },

  // Get recent notifications
  async getRecentNotifications(limit = 5) {
    try {
      const response = await notificationAPI.getRecentNotifications(limit);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to fetch recent notifications",
        data: null,
      };
    }
  },

  // Get unread notifications
  async getUnreadNotifications() {
    try {
      const response = await notificationAPI.getUnreadNotifications();
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to fetch unread notifications",
        data: null,
      };
    }
  },

  // Mark single notification as read
  async markAsRead(notificationId) {
    try {
      const response = await notificationAPI.markAsRead(notificationId);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to mark notification as read",
        data: null,
      };
    }
  },

  // Mark all notifications as read
  async markAllAsRead() {
    try {
      const response = await notificationAPI.markAllAsRead();
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to mark all as read",
        data: null,
      };
    }
  },

  // Delete notification
  async deleteNotification(notificationId) {
    try {
      const response = await notificationAPI.deleteNotification(notificationId);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to delete notification",
        data: null,
      };
    }
  },

  // Get notification type label
  getTypeLabel(type) {
    const typeMap = {
      STATUS_UPDATE: "Status Update",
      INVESTIGATION_NOTE: "Investigation Note",
      ASSIGNMENT: "Assignment",
      CLOSURE: "Case Closure",
      SYSTEM: "System Message",
    };
    return typeMap[type] || type;
  },

  // Get notification type color
  getTypeColor(type) {
    const colorMap = {
      STATUS_UPDATE: "info",
      INVESTIGATION_NOTE: "warning",
      ASSIGNMENT: "primary",
      CLOSURE: "success",
      SYSTEM: "secondary",
    };
    return colorMap[type] || "secondary";
  },

  // Format notification message
  formatMessage(notification) {
    if (!notification) return "";
    return `${notification.subject}: ${notification.message}`;
  },

  // Get notification icon
  getTypeIcon(type) {
    const iconMap = {
      STATUS_UPDATE: "info-circle",
      INVESTIGATION_NOTE: "edit",
      ASSIGNMENT: "user-plus",
      CLOSURE: "check-circle",
      SYSTEM: "cog",
    };
    return iconMap[type] || "bell";
  },
};
