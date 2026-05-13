import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { complaintAPI } from "../services/api";
import {
  FiFileText,
  FiMapPin,
  FiCalendar,
  FiPhone,
  FiAlertCircle,
} from "react-icons/fi";
import styles from "../styles/Form.module.css";

/**
 * User Dashboard Component
 * SOLUTION TO PROBLEM #3: Real-Time Status Tracking
 * - Display all user complaints with status
 * - Show assigned police station details
 * - Real-time status updates
 */
const UserDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [page, setPage] = useState(0);
  const pageSize = 10;

  console.log("UserDashboard mounted, user:", user);

  const fetchUserComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      console.log("Fetching complaints for page:", page);
      const response = await complaintAPI.getUserComplaints(page, pageSize);
      console.log("Complaints response:", response);

      // Handle different possible response formats
      const complaintsData =
        response.data?.data?.content || response.data?.content || [];
      console.log("Complaints data extracted:", complaintsData);
      setComplaints(complaintsData);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load complaints. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchUserComplaints();
  }, [fetchUserComplaints]);

  const getStatusColor = (status) => {
    const colors = {
      REGISTERED: "#3b82f6",
      ASSIGNED: "#f59e0b",
      UNDER_INVESTIGATION: "#8b5cf6",
      RESOLVED: "#10b981",
      CLOSED: "#6b7280",
      REJECTED: "#ef4444",
    };
    return colors[status] || "#6b7280";
  };

  const getStatusIcon = (status) => {
    const icons = {
      REGISTERED: "📝",
      ASSIGNED: "🚔",
      UNDER_INVESTIGATION: "🔍",
      RESOLVED: "✅",
      CLOSED: "📁",
      REJECTED: "❌",
    };
    return icons[status] || "📍";
  };

  if (loading) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardWrapper}>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <div className={styles.spinner} style={{ margin: "0 auto" }}>
              Loading complaints...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardWrapper}>
        <div className={styles.dashboardHeader}>
          <div>
            <h1 className={styles.dashboardTitle}>🔍 My Crime Reports</h1>
            <p style={{ color: "#6b7280", marginTop: "8px" }}>
              Welcome, <strong>{user?.name}</strong>! Track and manage your
              filed crime reports.
            </p>
          </div>
          <a href="/report-crime" className={styles.reportButton}>
            <FiFileText style={{ marginRight: "8px" }} />
            File New Report
          </a>
        </div>

        {error && (
          <div className={styles.errorMessage} style={{ marginBottom: "20px" }}>
            <FiAlertCircle />
            <span>{error}</span>
          </div>
        )}

        {complaints.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>📋</div>
            <h2 className={styles.emptyStateTitle}>No Crime Reports Yet</h2>
            <p className={styles.emptyStateDescription}>
              You haven't filed any crime reports yet. Start by filing your
              first report.
            </p>
            <a href="/report-crime" className={styles.reportButton}>
              <FiFileText style={{ marginRight: "8px" }} />
              File Your First Report
            </a>
          </div>
        ) : (
          <div className={styles.complaintsGrid}>
            {complaints.map((c) => (
              <div
                key={c.id}
                className={styles.complaintCard}
                onClick={() =>
                  setSelectedComplaint(
                    selectedComplaint?.id === c.id ? null : c,
                  )
                }
              >
                <div className={styles.complaintHeader}>
                  <span className={styles.complaintId}>
                    Complaint #{c.complaintId}
                  </span>
                  <span
                    className={styles.statusBadge}
                    style={{
                      backgroundColor: getStatusColor(c.status) + "20",
                      color: getStatusColor(c.status),
                      borderLeft: `4px solid ${getStatusColor(c.status)}`,
                    }}
                  >
                    {getStatusIcon(c.status)} {c.status.replace("_", " ")}
                  </span>
                </div>

                <div style={{ marginTop: "12px" }}>
                  <span className={styles.complaintType}>{c.crimeType}</span>
                </div>

                <div
                  style={{
                    marginTop: "12px",
                    color: "#6b7280",
                    fontSize: "14px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <FiMapPin size={16} />
                    <span>
                      {c.incidentLocation || "Location not specified"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <FiCalendar size={16} />
                    <span>
                      {new Date(c.createdAt).toLocaleDateString()} at{" "}
                      {new Date(c.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                {c.assignedPoliceStation && (
                  <div className={styles.stationInfo}>
                    <span className={styles.stationInfoLabel}>
                      🚔 Assigned Police Station
                    </span>
                    <div style={{ marginTop: "8px" }}>
                      <strong style={{ color: "#111827" }}>
                        {c.assignedPoliceStation.stationName}
                      </strong>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          marginTop: "6px",
                          color: "#6b7280",
                          fontSize: "14px",
                        }}
                      >
                        <FiPhone size={14} />
                        {c.assignedPoliceStation.contactNumber}
                      </div>
                    </div>
                  </div>
                )}

                {selectedComplaint?.id === c.id && (
                  <div
                    style={{
                      marginTop: "12px",
                      padding: "12px",
                      backgroundColor: "#f0f9ff",
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: "#1e40af",
                    }}
                  >
                    <strong>📌 Description:</strong>
                    <p style={{ marginTop: "8px" }}>{c.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {complaints.length > 0 && (
          <div className={styles.pagination} style={{ marginTop: "30px" }}>
            <button
              className={styles.paginationButton}
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              ← Previous
            </button>
            <span style={{ padding: "0 16px", color: "#6b7280" }}>
              Page {page + 1}
            </span>
            <button
              className={styles.paginationButton}
              onClick={() => setPage(page + 1)}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
