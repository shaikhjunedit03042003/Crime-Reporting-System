import api from './api';

/**
 * AI Analytics Service
 * Provides API wrapper methods for AI/ML analytics endpoints
 * Used for hotspot prediction, pattern detection, and analytics
 */

/**
 * Predict crime hotspots based on historical data
 * @param {Object} filters - Filter parameters
 *   - startDate: ISO string for start date
 *   - endDate: ISO string for end date
 *   - crimeType: Specific crime type (optional)
 * @returns {Promise} - Array of PredictedHotspotDTO objects
 */
export const predictHotspots = async (filters = {}) => {
  try {
    const response = await api.get('/api/analytics/predict-hotspots', {
      params: {
        startDate: filters.startDate || null,
        endDate: filters.endDate || null,
        crimeType: filters.crimeType || null
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error predicting hotspots:', error);
    throw error;
  }
};

/**
 * Get predicted hotspots with filtering
 * @param {Object} filters - Filter parameters
 *   - startDate: ISO string
 *   - endDate: ISO string
 *   - crimeType: Crime type filter
 *   - minRiskLevel: Minimum risk level (LOW, MEDIUM, HIGH, CRITICAL)
 * @returns {Promise} - Array of filtered hotspots
 */
export const getHotspots = async (filters = {}) => {
  try {
    const response = await api.get('/api/analytics/hotspots', {
      params: {
        startDate: filters.startDate || null,
        endDate: filters.endDate || null,
        crimeType: filters.crimeType || null,
        minRiskLevel: filters.minRiskLevel || null
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching hotspots:', error);
    throw error;
  }
};

/**
 * Detect crime patterns and anomalies
 * @param {Object} filters - Filter parameters
 *   - startDate: ISO string
 *   - endDate: ISO string
 * @returns {Promise} - Array of CrimePatternDTO objects
 */
export const detectPatterns = async (filters = {}) => {
  try {
    const response = await api.get('/api/analytics/pattern-detection', {
      params: {
        startDate: filters.startDate || null,
        endDate: filters.endDate || null
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error detecting patterns:', error);
    throw error;
  }
};

/**
 * Get crime patterns with filtering
 * @param {Object} filters - Filter parameters
 *   - startDate: ISO string
 *   - endDate: ISO string
 *   - crimeType: Specific crime type (optional)
 * @returns {Promise} - Array of filtered patterns
 */
export const getPatterns = async (filters = {}) => {
  try {
    const response = await api.get('/api/analytics/patterns', {
      params: {
        startDate: filters.startDate || null,
        endDate: filters.endDate || null,
        crimeType: filters.crimeType || null
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching patterns:', error);
    throw error;
  }
};

/**
 * Get analytics summary (combined hotspots and patterns)
 * @param {Object} filters - Filter parameters
 *   - startDate: ISO string
 *   - endDate: ISO string
 *   - crimeType: Specific crime type (optional)
 * @returns {Promise} - Summary object with analytics data
 */
export const getAnalyticsSummary = async (filters = {}) => {
  try {
    const response = await api.get('/api/analytics/summary', {
      params: {
        startDate: filters.startDate || null,
        endDate: filters.endDate || null,
        crimeType: filters.crimeType || null
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    throw error;
  }
};

/**
 * Check AI analytics service health
 * @returns {Promise} - Health status object
 */
export const checkHealthStatus = async () => {
  try {
    const response = await api.get('/api/analytics/health');
    return response.data;
  } catch (error) {
    console.error('Error checking AI service health:', error);
    throw error;
  }
};

/**
 * Get risk score color based on risk level
 * @param {string} riskLevel - Risk level (LOW, MEDIUM, HIGH, CRITICAL)
 * @returns {string} - Color code for UI
 */
export const getRiskLevelColor = (riskLevel) => {
  const colorMap = {
    'LOW': '#4CAF50',      // Green
    'MEDIUM': '#FF9800',   // Orange
    'HIGH': '#F44336',     // Red
    'CRITICAL': '#880E4F'  // Dark Red
  };
  return colorMap[riskLevel] || '#9E9E9E'; // Grey for unknown
};

/**
 * Get risk score percentage (0-100)
 * @param {number} riskScore - Risk score (0-1)
 * @returns {number} - Percentage value
 */
export const getRiskScorePercentage = (riskScore) => {
  return Math.round(riskScore * 100);
};

/**
 * Format trend direction for display
 * @param {string} trend - Trend value (INCREASING, STABLE, DECREASING)
 * @returns {string} - Formatted trend string with symbol
 */
export const formatTrend = (trend) => {
  const trendMap = {
    'INCREASING': '📈 Increasing',
    'STABLE': '➡️ Stable',
    'DECREASING': '📉 Decreasing'
  };
  return trendMap[trend] || trend;
};

/**
 * Get severity level color
 * @param {string} severity - Severity level
 * @returns {string} - Color code
 */
export const getSeverityColor = (severity) => {
  const colorMap = {
    'LOW': '#4CAF50',
    'MEDIUM': '#FF9800',
    'HIGH': '#F44336',
    'CRITICAL': '#880E4F'
  };
  return colorMap[severity] || '#9E9E9E';
};

/**
 * Create date range filter for analytics
 * @param {number} daysBack - Number of days to look back
 * @returns {Object} - Filter object with startDate and endDate
 */
export const createDateRangeFilter = (daysBack = 30) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysBack);

  return {
    startDate: startDate.toISOString().split('T')[0] + 'T00:00:00',
    endDate: endDate.toISOString().split('T')[0] + 'T23:59:59'
  };
};

export default {
  predictHotspots,
  getHotspots,
  detectPatterns,
  getPatterns,
  getAnalyticsSummary,
  checkHealthStatus,
  getRiskLevelColor,
  getRiskScorePercentage,
  formatTrend,
  getSeverityColor,
  createDateRangeFilter
};
