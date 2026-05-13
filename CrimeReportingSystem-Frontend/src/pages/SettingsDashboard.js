/**
 * Settings Dashboard Component
 * Provides admin interface for managing:
 * - Crime Types
 * - Priorities
 * - Notification Preferences
 *
 * Features: Add, Edit, Delete, Toggle Status, Search, Pagination
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiSearch,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import settingsService from '../services/settingsService';
import styles from '../styles/Settings.module.css';

const SettingsDashboard = () => {
  const [activeTab, setActiveTab] = useState('crimeTypes');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Crime Types State
  const [crimeTypes, setCrimeTypes] = useState([]);
  const [crimeTypesPage, setCrimeTypesPage] = useState(0);
  const [crimeTypesTotalPages, setCrimeTypesTotalPages] = useState(0);
  const [crimeTypesPageSize, setCrimeTypesPageSize] = useState(10);
  const [crimeTypeSearch, setCrimeTypeSearch] = useState('');

  // Priorities State
  const [priorities, setPriorities] = useState([]);
  const [prioritiesPage, setPrioritiesPage] = useState(0);
  const [prioritiesTotalPages, setPrioritiesTotalPages] = useState(0);
  const [prioritiesPageSize, setPrioritiesPageSize] = useState(10);
  const [prioritySearch, setPrioritySearch] = useState('');

  // Notification Preferences State
  const [preferences, setPreferences] = useState([]);
  const [preferencesPage, setPreferencesPage] = useState(0);
  const [preferencesTotalPages, setPreferencesTotalPages] = useState(0);
  const [preferencesPageSize, setPreferencesPageSize] = useState(10);
  const [preferenceSearch, setPreferenceSearch] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  // ==================== CRIME TYPES OPERATIONS ====================

  const fetchCrimeTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await settingsService.getAllCrimeTypes(crimeTypesPage, crimeTypesPageSize);
      if (response.success && response.data) {
        setCrimeTypes(response.data.content || []);
        setCrimeTypesTotalPages(response.data.totalPages || 0);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching crime types');
    } finally {
      setLoading(false);
    }
  }, [crimeTypesPage, crimeTypesPageSize]);

  const searchCrimeTypes = useCallback(async () => {
    if (!crimeTypeSearch.trim()) {
      setCrimeTypesPage(0);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await settingsService.searchCrimeTypes(crimeTypeSearch, 0, crimeTypesPageSize);
      if (response.success && response.data) {
        setCrimeTypes(response.data.content || []);
        setCrimeTypesTotalPages(response.data.totalPages || 0);
        setCrimeTypesPage(0);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error searching crime types');
    } finally {
      setLoading(false);
    }
  }, [crimeTypeSearch, crimeTypesPageSize]);

  const handleAddCrimeType = () => {
    setModalType('add');
    setEditingItem(null);
    setFormData({ name: '', description: '', isActive: true });
    setModalOpen(true);
  };

  const handleEditCrimeType = (crimeType) => {
    setModalType('edit');
    setEditingItem(crimeType);
    setFormData({
      name: crimeType.name,
      description: crimeType.description || '',
      isActive: crimeType.isActive
    });
    setModalOpen(true);
  };

  const handleSaveCrimeType = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!formData.name || !formData.name.trim()) {
        setError('Crime type name is required');
        return;
      }

      if (modalType === 'add') {
        await settingsService.createCrimeType(formData);
        setSuccess('Crime type created successfully');
      } else {
        await settingsService.updateCrimeType(editingItem.id, formData);
        setSuccess('Crime type updated successfully');
      }

      setModalOpen(false);
      setFormData({});
      fetchCrimeTypes();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving crime type');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCrimeType = async (id) => {
    if (window.confirm('Are you sure you want to delete this crime type?')) {
      try {
        setLoading(true);
        await settingsService.deleteCrimeType(id);
        setSuccess('Crime type deleted successfully');
        fetchCrimeTypes();
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting crime type');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleCrimeTypeStatus = async (id) => {
    try {
      setLoading(true);
      await settingsService.toggleCrimeTypeStatus(id);
      setSuccess('Crime type status updated');
      fetchCrimeTypes();
    } catch (err) {
      setError(err.response?.data?.message || 'Error toggling crime type status');
    } finally {
      setLoading(false);
    }
  };

  // ==================== PRIORITIES OPERATIONS ====================

  const fetchPriorities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await settingsService.getAllPriorities(prioritiesPage, prioritiesPageSize);
      if (response.success && response.data) {
        setPriorities(response.data.content || []);
        setPrioritiesTotalPages(response.data.totalPages || 0);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching priorities');
    } finally {
      setLoading(false);
    }
  }, [prioritiesPage, prioritiesPageSize]);

  const searchPriorities = useCallback(async () => {
    if (!prioritySearch.trim()) {
      setPrioritiesPage(0);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await settingsService.searchPriorities(prioritySearch, 0, prioritiesPageSize);
      if (response.success && response.data) {
        setPriorities(response.data.content || []);
        setPrioritiesTotalPages(response.data.totalPages || 0);
        setPrioritiesPage(0);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error searching priorities');
    } finally {
      setLoading(false);
    }
  }, [prioritySearch, prioritiesPageSize]);

  const handleAddPriority = () => {
    setModalType('add');
    setEditingItem(null);
    setFormData({ name: '', level: 1, description: '', isActive: true });
    setModalOpen(true);
  };

  const handleEditPriority = (priority) => {
    setModalType('edit');
    setEditingItem(priority);
    setFormData({
      name: priority.name,
      level: priority.level,
      description: priority.description || '',
      isActive: priority.isActive
    });
    setModalOpen(true);
  };

  const handleSavePriority = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!formData.name || !formData.name.trim()) {
        setError('Priority name is required');
        return;
      }

      if (!formData.level || formData.level < 1) {
        setError('Priority level must be at least 1');
        return;
      }

      if (modalType === 'add') {
        await settingsService.createPriority(formData);
        setSuccess('Priority created successfully');
      } else {
        await settingsService.updatePriority(editingItem.id, formData);
        setSuccess('Priority updated successfully');
      }

      setModalOpen(false);
      setFormData({});
      fetchPriorities();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving priority');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePriority = async (id) => {
    if (window.confirm('Are you sure you want to delete this priority?')) {
      try {
        setLoading(true);
        await settingsService.deletePriority(id);
        setSuccess('Priority deleted successfully');
        fetchPriorities();
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting priority');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTogglePriorityStatus = async (id) => {
    try {
      setLoading(true);
      await settingsService.togglePriorityStatus(id);
      setSuccess('Priority status updated');
      fetchPriorities();
    } catch (err) {
      setError(err.response?.data?.message || 'Error toggling priority status');
    } finally {
      setLoading(false);
    }
  };

  // ==================== NOTIFICATION PREFERENCES OPERATIONS ====================

  const fetchNotificationPreferences = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await settingsService.getAllNotificationPreferences(preferencesPage, preferencesPageSize);
      if (response.success && response.data) {
        setPreferences(response.data.content || []);
        setPreferencesTotalPages(response.data.totalPages || 0);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching notification preferences');
    } finally {
      setLoading(false);
    }
  }, [preferencesPage, preferencesPageSize]);

  const searchPreferences = useCallback(async () => {
    if (!preferenceSearch.trim()) {
      setPreferencesPage(0);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await settingsService.searchNotificationPreferences(preferenceSearch, 0, preferencesPageSize);
      if (response.success && response.data) {
        setPreferences(response.data.content || []);
        setPreferencesTotalPages(response.data.totalPages || 0);
        setPreferencesPage(0);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error searching preferences');
    } finally {
      setLoading(false);
    }
  }, [preferenceSearch, preferencesPageSize]);

  const handleAddPreference = () => {
    setModalType('add');
    setEditingItem(null);
    setFormData({ preferenceKey: '', description: '', isEnabled: true });
    setModalOpen(true);
  };

  const handleEditPreference = (preference) => {
    setModalType('edit');
    setEditingItem(preference);
    setFormData({
      preferenceKey: preference.preferenceKey,
      description: preference.description || '',
      isEnabled: preference.isEnabled
    });
    setModalOpen(true);
  };

  const handleSavePreference = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!formData.preferenceKey || !formData.preferenceKey.trim()) {
        setError('Preference key is required');
        return;
      }

      if (modalType === 'add') {
        await settingsService.createNotificationPreference(formData);
        setSuccess('Notification preference created successfully');
      } else {
        await settingsService.updateNotificationPreference(editingItem.id, formData);
        setSuccess('Notification preference updated successfully');
      }

      setModalOpen(false);
      setFormData({});
      fetchNotificationPreferences();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving preference');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePreference = async (id) => {
    if (window.confirm('Are you sure you want to delete this preference?')) {
      try {
        setLoading(true);
        await settingsService.deleteNotificationPreference(id);
        setSuccess('Notification preference deleted successfully');
        fetchNotificationPreferences();
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting preference');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTogglePreferenceStatus = async (id) => {
    try {
      setLoading(true);
      await settingsService.toggleNotificationPreferenceStatus(id);
      setSuccess('Preference status updated');
      fetchNotificationPreferences();
    } catch (err) {
      setError(err.response?.data?.message || 'Error toggling preference status');
    } finally {
      setLoading(false);
    }
  };

  // ==================== LOAD DATA ON MOUNT ====================

  useEffect(() => {
    fetchCrimeTypes();
  }, [crimeTypesPage, crimeTypesPageSize]);

  useEffect(() => {
    fetchPriorities();
  }, [prioritiesPage, prioritiesPageSize]);

  useEffect(() => {
    fetchNotificationPreferences();
  }, [preferencesPage, preferencesPageSize]);

  // ==================== AUTO-DISMISS NOTIFICATIONS ====================

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // ==================== MODAL CONTENT RENDERING ====================

  const renderModalContent = () => {
    if (activeTab === 'crimeTypes') {
      return (
        <div className={styles.modalContent}>
          <h3 className={styles.modalTitle}>{modalType === 'add' ? 'Add Crime Type' : 'Edit Crime Type'}</h3>
          <div className={styles.formGroup}>
            <label>Name *</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter crime type name"
              disabled={loading}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter description (optional)"
              rows="4"
              disabled={loading}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.isActive || false}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                disabled={loading}
              />
              Active
            </label>
          </div>
        </div>
      );
    } else if (activeTab === 'priorities') {
      return (
        <div className={styles.modalContent}>
          <h3 className={styles.modalTitle}>{modalType === 'add' ? 'Add Priority' : 'Edit Priority'}</h3>
          <div className={styles.formGroup}>
            <label>Name *</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter priority name"
              disabled={loading}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Level *</label>
            <input
              type="number"
              min="1"
              value={formData.level || 1}
              onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 1 })}
              placeholder="Enter priority level"
              disabled={loading}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter description (optional)"
              rows="4"
              disabled={loading}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.isActive || false}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                disabled={loading}
              />
              Active
            </label>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.modalContent}>
          <h3 className={styles.modalTitle}>{modalType === 'add' ? 'Add Preference' : 'Edit Preference'}</h3>
          <div className={styles.formGroup}>
            <label>Preference Key *</label>
            <input
              type="text"
              value={formData.preferenceKey || ''}
              onChange={(e) => setFormData({ ...formData, preferenceKey: e.target.value })}
              placeholder="e.g., EMAIL_ON_COMPLAINT_FILED"
              disabled={loading}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Description</label>
            <input
              type="text"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter description (optional)"
              disabled={loading}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.isEnabled || false}
                onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })}
                disabled={loading}
              />
              Enabled
            </label>
          </div>
        </div>
      );
    }
  };

  // ==================== RENDER ====================

  return (
    <div className={styles.settingsContainer}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Settings & Configuration</h1>
        <p className={styles.subtitle}>Manage system settings, crime types, priorities, and notification preferences</p>
      </div>

      {/* Alerts */}
      {error && (
        <div className={styles.alert + ' ' + styles.alertDanger}>
          <span>{error}</span>
          <button onClick={() => setError(null)}><FiX /></button>
        </div>
      )}
      {success && (
        <div className={styles.alert + ' ' + styles.alertSuccess}>
          <span>{success}</span>
          <button onClick={() => setSuccess(null)}><FiX /></button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'crimeTypes' ? styles.tabActive : ''}`}
          onClick={() => {
            setActiveTab('crimeTypes');
            setCrimeTypeSearch('');
            setCrimeTypesPage(0);
          }}
        >
          Crime Types
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'priorities' ? styles.tabActive : ''}`}
          onClick={() => {
            setActiveTab('priorities');
            setPrioritySearch('');
            setPrioritiesPage(0);
          }}
        >
          Priorities
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'notifications' ? styles.tabActive : ''}`}
          onClick={() => {
            setActiveTab('notifications');
            setPreferenceSearch('');
            setPreferencesPage(0);
          }}
        >
          Notification Preferences
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {/* CRIME TYPES TAB */}
        {activeTab === 'crimeTypes' && (
          <div className={styles.section}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
              <div className={styles.searchBox}>
                <FiSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search crime types..."
                  value={crimeTypeSearch}
                  onChange={(e) => setCrimeTypeSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchCrimeTypes()}
                />
              </div>
              <button className={styles.btnPrimary} onClick={handleAddCrimeType} disabled={loading}>
                <FiPlus /> Add Crime Type
              </button>
            </div>

            {/* Table */}
            {loading && crimeTypes.length === 0 ? (
              <div className={styles.loading}>Loading crime types...</div>
            ) : crimeTypes.length === 0 ? (
              <div className={styles.empty}>No crime types found</div>
            ) : (
              <>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {crimeTypes.map((ct) => (
                        <tr key={ct.id}>
                          <td>{ct.id}</td>
                          <td>{ct.name}</td>
                          <td>{ct.description ? ct.description.substring(0, 50) + '...' : '-'}</td>
                          <td>
                            <span
                              className={`${styles.badge} ${ct.isActive ? styles.badgeSuccess : styles.badgeDanger}`}
                              onClick={() => handleToggleCrimeTypeStatus(ct.id)}
                              style={{ cursor: 'pointer' }}
                            >
                              {ct.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>{new Date(ct.createdAt).toLocaleDateString()}</td>
                          <td className={styles.actions}>
                            <button
                              className={styles.btnIcon}
                              onClick={() => handleEditCrimeType(ct)}
                              title="Edit"
                              disabled={loading}
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              className={styles.btnIconDanger}
                              onClick={() => handleDeleteCrimeType(ct.id)}
                              title="Delete"
                              disabled={loading}
                            >
                              <FiTrash2 />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className={styles.pagination}>
                  <select
                    value={crimeTypesPageSize}
                    onChange={(e) => {
                      setCrimeTypesPageSize(parseInt(e.target.value));
                      setCrimeTypesPage(0);
                    }}
                    disabled={loading}
                  >
                    <option value="5">5 per page</option>
                    <option value="10">10 per page</option>
                    <option value="20">20 per page</option>
                    <option value="50">50 per page</option>
                  </select>

                  <div className={styles.paginationControls}>
                    <span>
                      Page {crimeTypesPage + 1} of {crimeTypesTotalPages}
                    </span>
                    <button
                      onClick={() => setCrimeTypesPage(crimeTypesPage - 1)}
                      disabled={crimeTypesPage === 0 || loading}
                    >
                      <FiChevronLeft />
                    </button>
                    <button
                      onClick={() => setCrimeTypesPage(crimeTypesPage + 1)}
                      disabled={crimeTypesPage >= crimeTypesTotalPages - 1 || loading}
                    >
                      <FiChevronRight />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* PRIORITIES TAB */}
        {activeTab === 'priorities' && (
          <div className={styles.section}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
              <div className={styles.searchBox}>
                <FiSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search priorities..."
                  value={prioritySearch}
                  onChange={(e) => setPrioritySearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchPriorities()}
                />
              </div>
              <button className={styles.btnPrimary} onClick={handleAddPriority} disabled={loading}>
                <FiPlus /> Add Priority
              </button>
            </div>

            {/* Table */}
            {loading && priorities.length === 0 ? (
              <div className={styles.loading}>Loading priorities...</div>
            ) : priorities.length === 0 ? (
              <div className={styles.empty}>No priorities found</div>
            ) : (
              <>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Level</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {priorities.map((p) => (
                        <tr key={p.id}>
                          <td>{p.id}</td>
                          <td>{p.name}</td>
                          <td><strong>{p.level}</strong></td>
                          <td>{p.description ? p.description.substring(0, 50) + '...' : '-'}</td>
                          <td>
                            <span
                              className={`${styles.badge} ${p.isActive ? styles.badgeSuccess : styles.badgeDanger}`}
                              onClick={() => handleTogglePriorityStatus(p.id)}
                              style={{ cursor: 'pointer' }}
                            >
                              {p.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                          <td className={styles.actions}>
                            <button
                              className={styles.btnIcon}
                              onClick={() => handleEditPriority(p)}
                              title="Edit"
                              disabled={loading}
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              className={styles.btnIconDanger}
                              onClick={() => handleDeletePriority(p.id)}
                              title="Delete"
                              disabled={loading}
                            >
                              <FiTrash2 />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className={styles.pagination}>
                  <select
                    value={prioritiesPageSize}
                    onChange={(e) => {
                      setPrioritiesPageSize(parseInt(e.target.value));
                      setPrioritiesPage(0);
                    }}
                    disabled={loading}
                  >
                    <option value="5">5 per page</option>
                    <option value="10">10 per page</option>
                    <option value="20">20 per page</option>
                    <option value="50">50 per page</option>
                  </select>

                  <div className={styles.paginationControls}>
                    <span>
                      Page {prioritiesPage + 1} of {prioritiesTotalPages}
                    </span>
                    <button
                      onClick={() => setPrioritiesPage(prioritiesPage - 1)}
                      disabled={prioritiesPage === 0 || loading}
                    >
                      <FiChevronLeft />
                    </button>
                    <button
                      onClick={() => setPrioritiesPage(prioritiesPage + 1)}
                      disabled={prioritiesPage >= prioritiesTotalPages - 1 || loading}
                    >
                      <FiChevronRight />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* NOTIFICATION PREFERENCES TAB */}
        {activeTab === 'notifications' && (
          <div className={styles.section}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
              <div className={styles.searchBox}>
                <FiSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search preferences..."
                  value={preferenceSearch}
                  onChange={(e) => setPreferenceSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchPreferences()}
                />
              </div>
              <button className={styles.btnPrimary} onClick={handleAddPreference} disabled={loading}>
                <FiPlus /> Add Preference
              </button>
            </div>

            {/* Table */}
            {loading && preferences.length === 0 ? (
              <div className={styles.loading}>Loading preferences...</div>
            ) : preferences.length === 0 ? (
              <div className={styles.empty}>No preferences found</div>
            ) : (
              <>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Preference Key</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preferences.map((pref) => (
                        <tr key={pref.id}>
                          <td>{pref.id}</td>
                          <td><code>{pref.preferenceKey}</code></td>
                          <td>{pref.description || '-'}</td>
                          <td>
                            <span
                              className={`${styles.badge} ${pref.isEnabled ? styles.badgeSuccess : styles.badgeDanger}`}
                              onClick={() => handleTogglePreferenceStatus(pref.id)}
                              style={{ cursor: 'pointer' }}
                            >
                              {pref.isEnabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </td>
                          <td>{new Date(pref.createdAt).toLocaleDateString()}</td>
                          <td className={styles.actions}>
                            <button
                              className={styles.btnIcon}
                              onClick={() => handleEditPreference(pref)}
                              title="Edit"
                              disabled={loading}
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              className={styles.btnIconDanger}
                              onClick={() => handleDeletePreference(pref.id)}
                              title="Delete"
                              disabled={loading}
                            >
                              <FiTrash2 />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className={styles.pagination}>
                  <select
                    value={preferencesPageSize}
                    onChange={(e) => {
                      setPreferencesPageSize(parseInt(e.target.value));
                      setPreferencesPage(0);
                    }}
                    disabled={loading}
                  >
                    <option value="5">5 per page</option>
                    <option value="10">10 per page</option>
                    <option value="20">20 per page</option>
                    <option value="50">50 per page</option>
                  </select>

                  <div className={styles.paginationControls}>
                    <span>
                      Page {preferencesPage + 1} of {preferencesTotalPages}
                    </span>
                    <button
                      onClick={() => setPreferencesPage(preferencesPage - 1)}
                      disabled={preferencesPage === 0 || loading}
                    >
                      <FiChevronLeft />
                    </button>
                    <button
                      onClick={() => setPreferencesPage(preferencesPage + 1)}
                      disabled={preferencesPage >= preferencesTotalPages - 1 || loading}
                    >
                      <FiChevronRight />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            {renderModalContent()}

            <div className={styles.modalActions}>
              <button
                className={styles.btnSecondary}
                onClick={() => setModalOpen(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className={styles.btnPrimary}
                onClick={() => {
                  if (activeTab === 'crimeTypes') {
                    handleSaveCrimeType();
                  } else if (activeTab === 'priorities') {
                    handleSavePriority();
                  } else {
                    handleSavePreference();
                  }
                }}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsDashboard;
