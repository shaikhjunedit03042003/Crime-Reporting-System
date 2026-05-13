import React, { useState, useEffect } from 'react';
import iotService from '../services/iotService';
import styles from '../styles/Dashboards.module.css';

/**
 * IoT Dashboard Component
 * Displays CCTV and sensor events with filtering and real-time monitoring
 * Allows event processing and linking to complaints
 */
const IoTDashboard = () => {
  const [events, setEvents] = useState([]);
  const [unprocessedEvents, setUnprocessedEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    location: '',
    deviceId: '',
    eventType: '',
    page: 0,
    size: 20
  });

  /**
   * Fetch IoT events
   */
  useEffect(() => {
    fetchEvents();
  }, [activeTab]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;

      if (activeTab === 'all') {
        response = await iotService.getAllEvents(filters.page, filters.size);
      } else if (activeTab === 'unprocessed') {
        response = await iotService.getUnprocessedEvents(filters.page, filters.size);
      }

      if (response?.success && response.data) {
        if (activeTab === 'all') {
          setEvents(response.data.content || []);
        } else if (activeTab === 'unprocessed') {
          setUnprocessedEvents(response.data.content || []);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch IoT events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 0
    }));
  };

  const handleApplyFilters = () => {
    fetchEvents();
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const handleMarkAsProcessed = async (eventId) => {
    try {
      await iotService.markEventAsProcessed(eventId);
      // Refresh events
      fetchEvents();
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Failed to mark event as processed');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await iotService.deleteEvent(eventId);
      // Refresh events
      fetchEvents();
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Failed to delete event');
    }
  };

  const renderEventsList = (eventsList) => {
    if (loading) {
      return (
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
        </div>
      );
    }

    if (eventsList.length === 0) {
      return (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>📡</div>
          <div className={styles.emptyStateMessage}>No IoT events found</div>
        </div>
      );
    }

    return (
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr className={styles.tableHeadRow}>
              <th className={styles.tableHeadCell}>Device ID</th>
              <th className={styles.tableHeadCell}>Event Type</th>
              <th className={styles.tableHeadCell}>Location</th>
              <th className={styles.tableHeadCell}>Severity</th>
              <th className={styles.tableHeadCell}>Timestamp</th>
              <th className={styles.tableHeadCell}>Status</th>
              <th className={styles.tableHeadCell}>Action</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {eventsList.map((event, idx) => (
              <tr key={idx} className={styles.tableRow}>
                <td className={styles.tableCell}>
                  <strong>{event.deviceId}</strong>
                </td>
                <td className={styles.tableCell}>
                  <span className={styles.badge + ' ' + styles.badgePrimary}>
                    {event.eventType}
                  </span>
                </td>
                <td className={styles.tableCell}>
                  {event.location}
                  {event.latitude && event.longitude && (
                    <div style={{ fontSize: '11px', color: '#999' }}>
                      ({event.latitude.toFixed(4)}, {event.longitude.toFixed(4)})
                    </div>
                  )}
                </td>
                <td className={styles.tableCell}>
                  <span className={styles.riskLevel} style={{
                    backgroundColor: iotService.getSeverityColor(event.severity) + '20',
                    color: iotService.getSeverityColor(event.severity)
                  }}>
                    {event.severity}
                  </span>
                </td>
                <td className={styles.tableCell}>
                  <small>{iotService.formatEventTimestamp(event.eventTimestamp)}</small>
                </td>
                <td className={styles.tableCell}>
                  {(() => {
                    const status = iotService.getEventStatus(event.isProcessed);
                    return (
                      <span className={styles.badge} style={{
                        backgroundColor: status.color + '20',
                        color: status.color
                      }}>
                        {status.status}
                      </span>
                    );
                  })()}
                </td>
                <td className={styles.tableCell}>
                  <button
                    className={styles.button + ' ' + styles.buttonSecondary + ' ' + styles.buttonSmall}
                    onClick={() => handleSelectEvent(event)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderEventModal = () => {
    if (!selectedEvent || !showModal) return null;

    return (
      <div className={styles.modalOverlay} onClick={handleCloseModal}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>Event Details</h2>
            <button className={styles.modalClose} onClick={handleCloseModal}>
              ✕
            </button>
          </div>

          <div style={{ display: 'grid', gap: '16px' }}>
            {/* Event Info */}
            <div>
              <label style={{ fontSize: '12px', color: '#999', fontWeight: '600', textTransform: 'uppercase' }}>
                Device ID
              </label>
              <p style={{ margin: '4px 0', fontSize: '16px', fontWeight: '600' }}>
                {selectedEvent.deviceId}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#999', fontWeight: '600', textTransform: 'uppercase' }}>
                  Event Type
                </label>
                <p style={{ margin: '4px 0', fontSize: '14px' }}>
                  <span className={styles.badge + ' ' + styles.badgePrimary}>
                    {selectedEvent.eventType}
                  </span>
                </p>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#999', fontWeight: '600', textTransform: 'uppercase' }}>
                  Severity
                </label>
                <p style={{ margin: '4px 0', fontSize: '14px' }}>
                  <span className={styles.riskLevel} style={{
                    backgroundColor: iotService.getSeverityColor(selectedEvent.severity) + '20',
                    color: iotService.getSeverityColor(selectedEvent.severity)
                  }}>
                    {selectedEvent.severity}
                  </span>
                </p>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#999', fontWeight: '600', textTransform: 'uppercase' }}>
                Location
              </label>
              <p style={{ margin: '4px 0', fontSize: '14px' }}>
                {selectedEvent.location}
              </p>
              {selectedEvent.latitude && selectedEvent.longitude && (
                <p style={{ margin: '4px 0', fontSize: '12px', color: '#666' }}>
                  Coordinates: ({selectedEvent.latitude.toFixed(6)}, {selectedEvent.longitude.toFixed(6)})
                </p>
              )}
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#999', fontWeight: '600', textTransform: 'uppercase' }}>
                Timestamp
              </label>
              <p style={{ margin: '4px 0', fontSize: '14px' }}>
                {iotService.formatEventTimestamp(selectedEvent.eventTimestamp)}
              </p>
            </div>

            {selectedEvent.description && (
              <div>
                <label style={{ fontSize: '12px', color: '#999', fontWeight: '600', textTransform: 'uppercase' }}>
                  Description
                </label>
                <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>
                  {selectedEvent.description}
                </p>
              </div>
            )}

            <div>
              <label style={{ fontSize: '12px', color: '#999', fontWeight: '600', textTransform: 'uppercase' }}>
                Status
              </label>
              <p style={{ margin: '4px 0', fontSize: '14px' }}>
                {(() => {
                  const status = iotService.getEventStatus(selectedEvent.isProcessed);
                  return (
                    <span className={styles.badge} style={{
                      backgroundColor: status.color + '20',
                      color: status.color
                    }}>
                      {status.status}
                    </span>
                  );
                })()}
              </p>
            </div>

            {selectedEvent.isLinkedToComplaint && selectedEvent.complaintId && (
              <div style={{
                padding: '12px',
                backgroundColor: '#E8F5E9',
                borderRadius: '4px',
                color: '#2E7D32'
              }}>
                <strong>✓ Linked to Complaint ID:</strong> {selectedEvent.complaintId}
              </div>
            )}

            {/* Actions */}
            <div className={styles.buttonGroup}>
              {!selectedEvent.isProcessed && (
                <button
                  className={styles.button + ' ' + styles.buttonPrimary}
                  onClick={() => handleMarkAsProcessed(selectedEvent.id)}
                >
                  Mark as Processed
                </button>
              )}

              <button
                className={styles.button + ' ' + styles.buttonSecondary}
                onClick={handleCloseModal}
              >
                Close
              </button>

              <button
                className={styles.button}
                style={{ backgroundColor: '#F44336', color: 'white' }}
                onClick={() => handleDeleteEvent(selectedEvent.id)}
              >
                Delete
              </button>
            </div>
          </div>
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
        <h1 className={styles.dashboardTitle}>📡 IoT Event Dashboard</h1>
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
            <label className={styles.filterLabel}>Device ID</label>
            <input
              type="text"
              name="deviceId"
              className={styles.filterInput}
              placeholder="All devices"
              value={filters.deviceId}
              onChange={handleFilterChange}
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Location</label>
            <input
              type="text"
              name="location"
              className={styles.filterInput}
              placeholder="All locations"
              value={filters.location}
              onChange={handleFilterChange}
            />
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Event Type</label>
            <input
              type="text"
              name="eventType"
              className={styles.filterInput}
              placeholder="All types"
              value={filters.eventType}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className={styles.cardsGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Total Events</h3>
            <span className={styles.cardIcon}>📡</span>
          </div>
          <div className={styles.cardValue}>{events.length}</div>
          <p className={styles.cardDescription}>All ingested events</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Unprocessed</h3>
            <span className={styles.cardIcon}>⏳</span>
          </div>
          <div className={styles.cardValue}>{unprocessedEvents.length}</div>
          <p className={styles.cardDescription}>Pending analysis</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>High Severity</h3>
            <span className={styles.cardIcon}>⚠️</span>
          </div>
          <div className={styles.cardValue} style={{ color: '#F44336' }}>
            {(activeTab === 'all' ? events : unprocessedEvents).filter(e => 
              e.severity === 'HIGH' || e.severity === 'CRITICAL'
            ).length}
          </div>
          <p className={styles.cardDescription}>Require attention</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Linked</h3>
            <span className={styles.cardIcon}>🔗</span>
          </div>
          <div className={styles.cardValue} style={{ color: '#4CAF50' }}>
            {(activeTab === 'all' ? events : unprocessedEvents).filter(e => 
              e.isLinkedToComplaint
            ).length}
          </div>
          <p className={styles.cardDescription}>Linked to complaints</p>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabsHeader}>
          <button
            className={`${styles.tabButton} ${activeTab === 'all' ? styles.active : ''}`}
            onClick={() => setActiveTab('all')}
          >
            📡 All Events
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'unprocessed' ? styles.active : ''}`}
            onClick={() => setActiveTab('unprocessed')}
          >
            ⏳ Unprocessed
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'all' && renderEventsList(events)}
          {activeTab === 'unprocessed' && renderEventsList(unprocessedEvents)}
        </div>
      </div>

      {/* Event Modal */}
      {renderEventModal()}
    </div>
  );
};

export default IoTDashboard;
