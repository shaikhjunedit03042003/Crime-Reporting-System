import React, { useState, useEffect } from 'react';
import aiAnalyticsService from '../services/aiAnalyticsService';
import styles from '../styles/Dashboards.module.css';

/**
 * AI Analytics Dashboard Component
 * Displays predictive analytics, crime hotspots, and pattern detection
 * Supports filters and interactive visualizations
 */
const AIAnalyticsDashboard = () => {
  const [hotspots, setHotspots] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('hotspots');

  // Filter state
  const [filters, setFilters] = useState({
    crimeType: '',
    minRiskLevel: 'MEDIUM',
    daysBack: 30
  });

  /**
   * Fetch analytics data
   */
  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const dateRange = aiAnalyticsService.createDateRangeFilter(filters.daysBack);

      // Fetch hotspots and patterns in parallel
      const [hotspotsResponse, patternsResponse, summaryResponse] = await Promise.all([
        aiAnalyticsService.getHotspots({
          ...dateRange,
          crimeType: filters.crimeType || undefined,
          minRiskLevel: filters.minRiskLevel
        }),
        aiAnalyticsService.getPatterns({
          ...dateRange,
          crimeType: filters.crimeType || undefined
        }),
        aiAnalyticsService.getAnalyticsSummary({
          ...dateRange,
          crimeType: filters.crimeType || undefined
        })
      ]);

      if (hotspotsResponse?.success) {
        setHotspots(hotspotsResponse.data || []);
      }

      if (patternsResponse?.success) {
        setPatterns(patternsResponse.data || []);
      }

      if (summaryResponse?.success) {
        setSummary(summaryResponse.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch analytics data');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyFilters = () => {
    fetchAnalytics();
  };

  const getRiskLevelColor = (riskLevel) => {
    const colorMap = {
      'LOW': '#4CAF50',
      'MEDIUM': '#FF9800',
      'HIGH': '#F44336',
      'CRITICAL': '#880E4F'
    };
    return colorMap[riskLevel] || '#9E9E9E';
  };

  const renderHotspots = () => {
    if (loading) {
      return (
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
        </div>
      );
    }

    if (hotspots.length === 0) {
      return (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>📍</div>
          <div className={styles.emptyStateMessage}>No hotspots detected</div>
        </div>
      );
    }

    return (
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr className={styles.tableHeadRow}>
              <th className={styles.tableHeadCell}>Location</th>
              <th className={styles.tableHeadCell}>Risk Score</th>
              <th className={styles.tableHeadCell}>Risk Level</th>
              <th className={styles.tableHeadCell}>Incidents</th>
              <th className={styles.tableHeadCell}>Trend</th>
              <th className={styles.tableHeadCell}>Crime Type</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {hotspots.map((hotspot, idx) => (
              <tr key={idx} className={styles.tableRow}>
                <td className={styles.tableCell}>
                  <strong>{hotspot.location}</strong>
                  <br />
                  <small style={{ color: '#999' }}>
                    ({hotspot.latitude?.toFixed(4)}, {hotspot.longitude?.toFixed(4)})
                  </small>
                </td>
                <td className={styles.tableCell}>
                  <div style={{
                    width: '100%',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    height: '24px'
                  }}>
                    <div style={{
                      width: `${aiAnalyticsService.getRiskScorePercentage(hotspot.riskScore)}%`,
                      backgroundColor: getRiskLevelColor(hotspot.riskLevel),
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'white'
                    }}>
                      {aiAnalyticsService.getRiskScorePercentage(hotspot.riskScore)}%
                    </div>
                  </div>
                </td>
                <td className={styles.tableCell}>
                  <span className={styles.riskLevel} style={{
                    backgroundColor: getRiskLevelColor(hotspot.riskLevel) + '20',
                    color: getRiskLevelColor(hotspot.riskLevel)
                  }}>
                    {hotspot.riskLevel}
                  </span>
                </td>
                <td className={styles.tableCell}>
                  <strong>{hotspot.historicalIncidents}</strong>
                </td>
                <td className={styles.tableCell}>
                  {aiAnalyticsService.formatTrend(hotspot.trend)}
                </td>
                <td className={styles.tableCell}>
                  <span className={styles.badge + ' ' + styles.badgePrimary}>
                    {hotspot.crimeType}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderPatterns = () => {
    if (loading) {
      return (
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
        </div>
      );
    }

    if (patterns.length === 0) {
      return (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>🔍</div>
          <div className={styles.emptyStateMessage}>No patterns detected</div>
        </div>
      );
    }

    return (
      <div style={{ display: 'grid', gap: '16px' }}>
        {patterns.map((pattern, idx) => (
          <div key={idx} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
                {pattern.patternType}
              </h3>
              <span className={styles.badge + ' ' + (
                pattern.severity === 'CRITICAL' || pattern.severity === 'HIGH' 
                  ? styles.badgeDanger 
                  : styles.badgeWarning
              )}>
                {pattern.severity}
              </span>
            </div>

            <p style={{ color: '#666', margin: '8px 0' }}>
              {pattern.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginTop: '12px' }}>
              <div>
                <small style={{ color: '#999' }}>Frequency</small>
                <div style={{ fontSize: '18px', fontWeight: '600' }}>{pattern.frequency}</div>
              </div>
              <div>
                <small style={{ color: '#999' }}>Confidence</small>
                <div style={{ fontSize: '18px', fontWeight: '600' }}>
                  {aiAnalyticsService.getRiskScorePercentage(pattern.confidence)}%
                </div>
              </div>
              <div>
                <small style={{ color: '#999' }}>Crime Type</small>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>{pattern.crimeType}</div>
              </div>
            </div>

            <div style={{ marginTop: '12px' }}>
              <small style={{ color: '#999' }}>Time Pattern</small>
              <p style={{ margin: '4px 0', color: '#666' }}>{pattern.timePattern}</p>
            </div>

            <div style={{ marginTop: '12px' }}>
              <small style={{ color: '#999' }}>Location Pattern</small>
              <p style={{ margin: '4px 0', color: '#666' }}>{pattern.locationPattern}</p>
            </div>

            <div style={{ marginTop: '12px' }}>
              <small style={{ color: '#999' }}>Recommendation</small>
              <p style={{ margin: '4px 0', color: '#666', fontStyle: 'italic' }}>
                💡 {pattern.recommendation}
              </p>
            </div>

            {pattern.affectedLocations && pattern.affectedLocations.length > 0 && (
              <div style={{ marginTop: '12px' }}>
                <small style={{ color: '#999' }}>Affected Locations</small>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                  {pattern.affectedLocations.map((loc, i) => (
                    <span key={i} className={styles.badge + ' ' + styles.badgePrimary}>
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderSummary = () => {
    if (!summary) return null;

    return (
      <div className={styles.cardsGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Total Hotspots</h3>
            <span className={styles.cardIcon}>📍</span>
          </div>
          <div className={styles.cardValue}>{summary.hotspotsCount || 0}</div>
          <p className={styles.cardDescription}>Predicted crime hotspots</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Patterns Detected</h3>
            <span className={styles.cardIcon}>🔍</span>
          </div>
          <div className={styles.cardValue}>{summary.patternsCount || 0}</div>
          <p className={styles.cardDescription}>Anomalies and patterns</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Critical Issues</h3>
            <span className={styles.cardIcon}>⚠️</span>
          </div>
          <div className={styles.cardValue}>{summary.criticalPatterns || 0}</div>
          <p className={styles.cardDescription}>High/Critical severity</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Top Risk Location</h3>
            <span className={styles.cardIcon}>🎯</span>
          </div>
          <div style={{ fontSize: '16px', fontWeight: '600', marginTop: '8px', color: '#F44336' }}>
            {summary.topHotspots && summary.topHotspots.length > 0
              ? summary.topHotspots[0].location
              : 'N/A'}
          </div>
          <p className={styles.cardDescription}>Highest risk area</p>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className={styles.dashboardContainer}>
        <div style={{
          backgroundColor: '#FFEBEE',
          color: '#C62828',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>🤖 AI Analytics Dashboard</h1>
        <button
          className={styles.filterButton}
          onClick={handleApplyFilters}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filterContainer}>
        <div className={styles.filterGrid}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Crime Type</label>
            <input
              type="text"
              name="crimeType"
              className={styles.filterInput}
              placeholder="All types"
              value={filters.crimeType}
              onChange={handleFilterChange}
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Min Risk Level</label>
            <select
              name="minRiskLevel"
              className={styles.filterSelect}
              value={filters.minRiskLevel}
              onChange={handleFilterChange}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Time Period</label>
            <select
              name="daysBack"
              className={styles.filterSelect}
              value={filters.daysBack}
              onChange={handleFilterChange}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="60">Last 60 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {renderSummary()}

      {/* Tabs */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabsHeader}>
          <button
            className={`${styles.tabButton} ${activeTab === 'hotspots' ? styles.active : ''}`}
            onClick={() => setActiveTab('hotspots')}
          >
            📍 Hotspots
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'patterns' ? styles.active : ''}`}
            onClick={() => setActiveTab('patterns')}
          >
            🔍 Patterns
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'hotspots' && renderHotspots()}
          {activeTab === 'patterns' && renderPatterns()}
        </div>
      </div>
    </div>
  );
};

export default AIAnalyticsDashboard;
