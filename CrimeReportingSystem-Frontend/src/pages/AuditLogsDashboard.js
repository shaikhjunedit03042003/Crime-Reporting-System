import React, { useState, useEffect, useCallback } from "react";
import { getLogs, filterLogs, getRecentLogs } from "../services/auditService";
import styles from "../styles/Audit.module.css";
import {
  FiFilter,
  FiDownload,
  FiSearch,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiUser,
  FiTarget,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

/**
 * Audit Logs Dashboard Component
 * Displays system audit logs with filtering, sorting, and pagination
 * Admin-only access
 */
const AuditLogsDashboard = () => {
  // State for audit logs
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Pagination state
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Filter state
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({
    userId: "",
    userRole: "",
    actionType: "",
    targetEntity: "",
    startDate: "",
    endDate: "",
  });

  // Sorting state
  const [sortBy, setSortBy] = useState("timestamp");
  const [sortDirection, setSortDirection] = useState("DESC");

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Modal state
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch logs
  const fetchLogs = useCallback(
    async (pageNum = 0) => {
      setLoading(true);
      setError("");
      try {
        let response;

        if (
          activeTab === "filtered" &&
          Object.values(filters).some((val) => val)
        ) {
          response = await filterLogs({
            ...filters,
            page: pageNum,
            size: pageSize,
            sortBy,
            direction: sortDirection,
          });
        } else {
          response = await getLogs(
            pageNum,
            pageSize,
            sortBy,
            sortDirection
          );
        }

        if (response.success) {
          setLogs(response.data.content || []);
          setTotalPages(response.data.totalPages || 0);
          setTotalElements(response.data.totalElements || 0);
          setPage(pageNum);
        } else {
          setError(response.message || "Failed to fetch audit logs");
        }
      } catch (err) {
        console.error("Error fetching audit logs:", err);
        setError("Failed to fetch audit logs. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [filters, pageSize, sortBy, sortDirection, activeTab]
  );

  // Fetch logs on component mount or when dependencies change
  useEffect(() => {
    fetchLogs(0);
  }, []);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Apply filters
  const handleApplyFilters = async () => {
    setActiveTab("filtered");
    setShowFilterModal(false);
    setPage(0);
    await fetchLogs(0);
    setSuccessMessage("Filters applied successfully");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Clear filters
  const handleClearFilters = async () => {
    setFilters({
      userId: "",
      userRole: "",
      actionType: "",
      targetEntity: "",
      startDate: "",
      endDate: "",
    });
    setActiveTab("all");
    setPage(0);
    await fetchLogs(0);
    setSuccessMessage("Filters cleared");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchLogs(newPage);
    }
  };

  // Handle sort change
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
    } else {
      setSortBy(field);
      setSortDirection("DESC");
    }
  };

  // Handle export to CSV
  const handleExportCSV = () => {
    if (logs.length === 0) {
      setError("No logs to export");
      return;
    }

    const headers = [
      "ID",
      "Timestamp",
      "User Name",
      "User Role",
      "Action Type",
      "Target Entity",
      "Target ID",
      "Description",
      "Status",
    ];

    const csvContent = [
      headers.join(","),
      ...logs.map((log) =>
        [
          log.id,
          log.timestamp,
          log.userName,
          log.userRole,
          log.actionType,
          log.targetEntity,
          log.targetId,
          `"${log.description || ""}"`,
          log.status,
        ].join(",")
      ),
    ].join("\n");

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent)
    );
    element.setAttribute(
      "download",
      `audit_logs_${new Date().toISOString().split("T")[0]}.csv`
    );
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setSuccessMessage("Audit logs exported successfully");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Get action type badge color
  const getActionTypeBadgeClass = (actionType) => {
    const typeMap = {
      COMPLAINT_FILED: "badge-primary",
      COMPLAINT_STATUS_UPDATED: "badge-info",
      INVESTIGATION_NOTE_ADDED: "badge-warning",
      EVIDENCE_UPLOADED: "badge-success",
      USER_CREATED: "badge-primary",
      USER_DEACTIVATED: "badge-danger",
      NOTIFICATION_SENT: "badge-secondary",
      OPERATION_FAILED: "badge-danger",
    };
    return typeMap[actionType] || "badge-secondary";
  };

  // Get status badge color
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "SUCCESS":
        return "badge-success";
      case "FAILURE":
        return "badge-danger";
      default:
        return "badge-secondary";
    }
  };

  // Get role badge color
  const getRoleBadgeClass = (role) => {
    const roleMap = {
      ROLE_ADMIN: "badge-danger",
      ROLE_POLICE: "badge-info",
      ROLE_USER: "badge-primary",
    };
    return roleMap[role] || "badge-secondary";
  };

  return (
    <div className={styles.auditContainer}>
      {/* Header */}
      <div className={styles.header}>
        <h1>
          <FiClock className={styles.icon} /> Audit Logs
        </h1>
        <p>Track all system activities and user actions</p>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className={`${styles.alert} ${styles.alertError}`}>
          <FiAlertCircle />
          {error}
          <button onClick={() => setError("")}>
            <FiX />
          </button>
        </div>
      )}

      {successMessage && (
        <div className={`${styles.alert} ${styles.alertSuccess}`}>
          <FiCheckCircle />
          {successMessage}
        </div>
      )}

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => setShowFilterModal(!showFilterModal)}
          >
            <FiFilter /> Filters
          </button>

          {Object.values(filters).some((val) => val) && (
            <button
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={handleClearFilters}
            >
              <FiX /> Clear Filters
            </button>
          )}
        </div>

        <button
          className={`${styles.btn} ${styles.btnSuccess}`}
          onClick={handleExportCSV}
        >
          <FiDownload /> Export CSV
        </button>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className={styles.filterModal}>
          <div className={styles.filterContent}>
            <h2>Filter Audit Logs</h2>

            <div className={styles.filterGrid}>
              <div className={styles.filterGroup}>
                <label>User ID</label>
                <input
                  type="number"
                  name="userId"
                  value={filters.userId}
                  onChange={handleFilterChange}
                  placeholder="Enter user ID"
                />
              </div>

              <div className={styles.filterGroup}>
                <label>User Role</label>
                <select
                  name="userRole"
                  value={filters.userRole}
                  onChange={handleFilterChange}
                >
                  <option value="">All Roles</option>
                  <option value="ROLE_USER">User</option>
                  <option value="ROLE_POLICE">Police</option>
                  <option value="ROLE_ADMIN">Admin</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>Action Type</label>
                <select
                  name="actionType"
                  value={filters.actionType}
                  onChange={handleFilterChange}
                >
                  <option value="">All Actions</option>
                  <option value="COMPLAINT_FILED">Complaint Filed</option>
                  <option value="COMPLAINT_STATUS_UPDATED">Status Updated</option>
                  <option value="INVESTIGATION_NOTE_ADDED">Investigation Note Added</option>
                  <option value="EVIDENCE_UPLOADED">Evidence Uploaded</option>
                  <option value="USER_CREATED">User Created</option>
                  <option value="USER_DEACTIVATED">User Deactivated</option>
                  <option value="NOTIFICATION_SENT">Notification Sent</option>
                  <option value="OPERATION_FAILED">Operation Failed</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>Target Entity</label>
                <select
                  name="targetEntity"
                  value={filters.targetEntity}
                  onChange={handleFilterChange}
                >
                  <option value="">All Entities</option>
                  <option value="COMPLAINT">Complaint</option>
                  <option value="EVIDENCE">Evidence</option>
                  <option value="USER">User</option>
                  <option value="NOTIFICATION">Notification</option>
                  <option value="SYSTEM">System</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>Start Date</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                />
              </div>

              <div className={styles.filterGroup}>
                <label>End Date</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div className={styles.filterActions}>
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={handleApplyFilters}
              >
                Apply Filters
              </button>
              <button
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => setShowFilterModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logs Table */}
      <div className={styles.tableWrapper}>
        {loading ? (
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
            <p>Loading audit logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className={styles.emptyState}>
            <FiClock className={styles.emptyIcon} />
            <h3>No audit logs found</h3>
            <p>Try adjusting your filters or check back later</p>
          </div>
        ) : (
          <table className={styles.logsTable}>
            <thead>
              <tr>
                <th onClick={() => handleSort("timestamp")}>
                  Timestamp{" "}
                  {sortBy === "timestamp" && (
                    <span className={styles.sortIndicator}>
                      {sortDirection === "ASC" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th>User Name</th>
                <th>User Role</th>
                <th onClick={() => handleSort("actionType")}>
                  Action Type{" "}
                  {sortBy === "actionType" && (
                    <span className={styles.sortIndicator}>
                      {sortDirection === "ASC" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th>Target</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className={styles.timestamp}>
                    {formatTimestamp(log.timestamp)}
                  </td>
                  <td>
                    <span className={styles.userName}>
                      <FiUser /> {log.userName}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${getRoleBadgeClass(log.userRole)}`}>
                      {log.userRole}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${getActionTypeBadgeClass(log.actionType)}`}>
                      {log.actionType}
                    </span>
                  </td>
                  <td className={styles.target}>
                    <FiTarget className={styles.targetIcon} />
                    {log.targetEntity} #{log.targetId}
                  </td>
                  <td className={styles.description}>
                    {log.description || "—"}
                  </td>
                  <td>
                    <span className={`${styles.badge} ${getStatusBadgeClass(log.status)}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className={styles.actions}>
                    <button
                      className={`${styles.btn} ${styles.btnSmall} ${styles.btnInfo}`}
                      onClick={() => {
                        setSelectedLog(log);
                        setShowDetailsModal(true);
                      }}
                      title="View details"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {logs.length > 0 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, totalElements)} of{" "}
            {totalElements} logs
          </div>

          <div className={styles.paginationControls}>
            <button
              className={`${styles.btn} ${styles.btnSmall} ${
                page === 0 ? styles.btnDisabled : ""
              }`}
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0}
            >
              <FiChevronLeft /> Previous
            </button>

            <div className={styles.pageInfo}>
              Page {page + 1} of {totalPages}
            </div>

            <button
              className={`${styles.btn} ${styles.btnSmall} ${
                page + 1 >= totalPages ? styles.btnDisabled : ""
              }`}
              onClick={() => handlePageChange(page + 1)}
              disabled={page + 1 >= totalPages}
            >
              Next <FiChevronRight />
            </button>

            <select
              className={styles.pageSize}
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(0);
              }}
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedLog && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Audit Log Details</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setShowDetailsModal(false)}
              >
                <FiX />
              </button>
            </div>

            <div className={styles.detailsGrid}>
              <div className={styles.detailRow}>
                <label>Log ID:</label>
                <span>{selectedLog.id}</span>
              </div>

              <div className={styles.detailRow}>
                <label>Timestamp:</label>
                <span>{formatTimestamp(selectedLog.timestamp)}</span>
              </div>

              <div className={styles.detailRow}>
                <label>User:</label>
                <span>{selectedLog.userName} ({selectedLog.userId})</span>
              </div>

              <div className={styles.detailRow}>
                <label>User Role:</label>
                <span className={`${styles.badge} ${getRoleBadgeClass(selectedLog.userRole)}`}>
                  {selectedLog.userRole}
                </span>
              </div>

              <div className={styles.detailRow}>
                <label>Action Type:</label>
                <span className={`${styles.badge} ${getActionTypeBadgeClass(selectedLog.actionType)}`}>
                  {selectedLog.actionType}
                </span>
              </div>

              <div className={styles.detailRow}>
                <label>Target Entity:</label>
                <span>{selectedLog.targetEntity}</span>
              </div>

              <div className={styles.detailRow}>
                <label>Target ID:</label>
                <span>{selectedLog.targetId}</span>
              </div>

              <div className={styles.detailRow}>
                <label>Status:</label>
                <span className={`${styles.badge} ${getStatusBadgeClass(selectedLog.status)}`}>
                  {selectedLog.status}
                </span>
              </div>

              <div className={styles.detailRow}>
                <label>IP Address:</label>
                <span>{selectedLog.ipAddress || "N/A"}</span>
              </div>

              <div className={styles.detailRow}>
                <label>Description:</label>
                <span className={styles.description}>
                  {selectedLog.description || "N/A"}
                </span>
              </div>

              {selectedLog.errorMessage && (
                <div className={styles.detailRow}>
                  <label>Error Message:</label>
                  <span className={styles.errorMessage}>
                    {selectedLog.errorMessage}
                  </span>
                </div>
              )}
            </div>

            <div className={styles.modalActions}>
              <button
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogsDashboard;
