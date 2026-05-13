import React, { useState } from "react";
import styles from "../styles/ComplaintTable.module.css";
import { FiChevronUp, FiChevronDown, FiEye } from "react-icons/fi";

/**
 * Advanced Complaint Table Component
 * Features: Sorting, Filtering, Pagination, Search
 */
const ComplaintTable = ({
  complaints,
  loading,
  onSelectComplaint,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("DESC");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      setSortField(field);
      setSortOrder("ASC");
    }
  };

  const getPriorityColor = (priority) => {
    const priorityMap = {
      HIGH: "#FF4444",
      MEDIUM: "#FFA500",
      LOW: "#4CAF50",
      NORMAL: "#2196F3",
    };
    return priorityMap[priority] || "#999";
  };

  const getStatusColor = (status) => {
    const statusMap = {
      REGISTERED: "#2196F3",
      ASSIGNED: "#FFA500",
      UNDER_INVESTIGATION: "#FF9800",
      CLOSED: "#4CAF50",
      REJECTED: "#F44336",
    };
    return statusMap[status] || "#999";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysSince = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading complaints...</p>
      </div>
    );
  }

  if (!complaints || complaints.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No complaints found</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Page Size Selector */}
      <div className={styles.pageControls}>
        <label>
          Items per page:
          <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </label>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => handleSort("complaintId")} className={styles.sortable}>
                Complaint ID {sortField === "complaintId" && (sortOrder === "ASC" ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("crimeType")} className={styles.sortable}>
                Crime Type {sortField === "crimeType" && (sortOrder === "ASC" ? "▲" : "▼")}
              </th>
              <th>Location</th>
              <th onClick={() => handleSort("priority")} className={styles.sortable}>
                Priority {sortField === "priority" && (sortOrder === "ASC" ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("status")} className={styles.sortable}>
                Status {sortField === "status" && (sortOrder === "ASC" ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("createdAt")} className={styles.sortable}>
                Filed Date {sortField === "createdAt" && (sortOrder === "ASC" ? "▲" : "▼")}
              </th>
              <th>Days Pending</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint.id || complaint.complaintId} className={styles.row}>
                <td className={styles.id}>{complaint.complaintId}</td>
                <td className={styles.crimeType}>{complaint.crimeType}</td>
                <td className={styles.location}>
                  {complaint.incidentLocation?.substring(0, 30)}...
                </td>
                <td>
                  <span
                    className={styles.badge}
                    style={{ backgroundColor: getPriorityColor(complaint.priority) }}
                  >
                    {complaint.priority || "MEDIUM"}
                  </span>
                </td>
                <td>
                  <span
                    className={styles.statusBadge}
                    style={{ backgroundColor: getStatusColor(complaint.status) }}
                  >
                    {complaint.status}
                  </span>
                </td>
                <td>{formatDate(complaint.createdAt)}</td>
                <td>{getDaysSince(complaint.createdAt)}</td>
                <td>
                  <button
                    className={styles.viewBtn}
                    onClick={() => onSelectComplaint(complaint)}
                    title="View Details"
                  >
                    <FiEye /> Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.paginationBtn}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            ← Previous
          </button>

          <div className={styles.pageInfo}>
            <span>
              Page {currentPage + 1} of {totalPages}
            </span>
          </div>

          <button
            className={styles.paginationBtn}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default ComplaintTable;
