import React, { useState, useEffect, useCallback } from "react";
import { adminAPI } from "../services/api";
import styles from "../styles/AdminDashboard.module.css";
import {
  FiBarChart2,
  FiUsers,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiX,
  FiMapPin,
  FiDownload,
  FiSearch,
} from "react-icons/fi";

/**
 * Admin Dashboard Component
 * Displays system analytics, manages complaints and users
 * Enhanced with search, filters, and export functionality
 */
const AdminDashboard = () => {
  // State for complaints
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [complaintPage, setComplaintPage] = useState(0);
  const [complaintStatus, setComplaintStatus] = useState("");
  const [complaintSearchQuery, setComplaintSearchQuery] = useState("");

  // State for users
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userPage, setUserPage] = useState(0);
  const [userSearchQuery, setUserSearchQuery] = useState("");

  // State for statistics
  const [statistics, setStatistics] = useState(null);
  const [complaintStats, setComplaintStats] = useState(null);
  const [crimeDistribution, setCrimeDistribution] = useState(null);

  // State for police stations
  const [policeStations, setPoliceStations] = useState([]);

  // State for selected complaint
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // State for loading and errors
  const [loadingComplaints, setLoadingComplaints] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // State for modals
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedAssignComplaint, setSelectedAssignComplaint] = useState(null);
  const [selectedStatusComplaint, setSelectedStatusComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState("REGISTERED");
  const [remarks, setRemarks] = useState("");

  // Active tab
  const [activeTab, setActiveTab] = useState("complaints"); // complaints, users, analytics

  // Fetch all complaints
  const fetchComplaints = useCallback(async () => {
    setLoadingComplaints(true);
    setError("");
    try {
      const response = await adminAPI.getAllComplaints(
        complaintPage,
        10,
        complaintStatus,
      );
      setComplaints(response.data.data.content);
      filterComplaints(response.data.data.content, complaintSearchQuery);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError(
        "Failed to fetch complaints: " +
          (err.response?.data?.message || err.message),
      );
    } finally {
      setLoadingComplaints(false);
    }
  }, [complaintPage, complaintStatus, complaintSearchQuery]);

  // Filter complaints locally
  const filterComplaints = (data, query) => {
    if (!query) {
      setFilteredComplaints(data);
      return;
    }

    const filtered = data.filter(
      (complaint) =>
        complaint.complaintId.toLowerCase().includes(query.toLowerCase()) ||
        complaint.crimeType.toLowerCase().includes(query.toLowerCase()) ||
        complaint.incidentLocation.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredComplaints(filtered);
  };

  // Handle complaint search
  const handleComplaintSearch = (query) => {
    setComplaintSearchQuery(query);
    filterComplaints(complaints, query);
  };

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    setError("");
    try {
      const response = await adminAPI.getUsers(userPage, 10);
      setUsers(response.data.data.content);
      filterUsers(response.data.data.content, userSearchQuery);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(
        "Failed to fetch users: " +
          (err.response?.data?.message || err.message),
      );
    } finally {
      setLoadingUsers(false);
    }
  }, [userPage, userSearchQuery]);

  // Filter users locally
  const filterUsers = (data, query) => {
    if (!query) {
      setFilteredUsers(data);
      return;
    }

    const filtered = data.filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.mobileNumber.includes(query),
    );
    setFilteredUsers(filtered);
  };

  // Handle user search
  const handleUserSearch = (query) => {
    setUserSearchQuery(query);
    filterUsers(users, query);
  };

  // Fetch statistics
  const fetchStatistics = useCallback(async () => {
    setLoadingStats(true);
    setError("");
    try {
      const [statsRes, complaintStatsRes, crimeDistRes] = await Promise.all([
        adminAPI.getStatistics(),
        adminAPI.getComplaintStatistics(),
        adminAPI.getCrimeDistribution(),
      ]);

      setStatistics(statsRes.data.data);
      setComplaintStats(complaintStatsRes.data.data);
      setCrimeDistribution(crimeDistRes.data.data);
    } catch (err) {
      console.error("Error fetching statistics:", err);
      setError(
        "Failed to fetch statistics: " +
          (err.response?.data?.message || err.message),
      );
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Fetch police stations
  const fetchPoliceStations = useCallback(async () => {
    try {
      const response = await adminAPI.getPoliceStations();
      setPoliceStations(response.data.data);
    } catch (err) {
      console.error("Error fetching police stations:", err);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchPoliceStations();
    fetchStatistics();
  }, [fetchPoliceStations, fetchStatistics]);

  // Fetch data when tab changes
  useEffect(() => {
    if (activeTab === "complaints") {
      fetchComplaints();
    } else if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "analytics") {
      fetchStatistics();
    }
  }, [activeTab, fetchComplaints, fetchUsers, fetchStatistics]);

  // Assign complaint to station
  const handleAssignComplaint = async () => {
    if (!selectedAssignComplaint || !selectedAssignComplaint.selectedStation) {
      setError("Please select a police station");
      return;
    }

    try {
      await adminAPI.assignComplaintToStation(
        selectedAssignComplaint.id,
        selectedAssignComplaint.selectedStation,
        remarks,
      );

      setSuccessMessage("Complaint assigned successfully");
      setShowAssignModal(false);
      setRemarks("");
      setSelectedAssignComplaint(null);
      fetchComplaints();

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error assigning complaint:", err);
      setError(
        "Failed to assign complaint: " +
          (err.response?.data?.message || err.message),
      );
    }
  };

  // Update complaint status
  const handleUpdateStatus = async () => {
    if (!selectedStatusComplaint) {
      setError("Please select a complaint");
      return;
    }

    try {
      await adminAPI.updateComplaintStatus(
        selectedStatusComplaint.id,
        newStatus,
        remarks,
      );

      setSuccessMessage("Complaint status updated successfully");
      setShowStatusModal(false);
      setRemarks("");
      setNewStatus("REGISTERED");
      setSelectedStatusComplaint(null);
      fetchComplaints();

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error updating status:", err);
      setError(
        "Failed to update status: " +
          (err.response?.data?.message || err.message),
      );
    }
  };

  // Deactivate user
  const handleDeactivateUser = async (userId) => {
    if (window.confirm("Are you sure you want to deactivate this user?")) {
      try {
        await adminAPI.deactivateUser(userId, "Deactivated by admin");
        setSuccessMessage("User deactivated successfully");
        fetchUsers();
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (err) {
        console.error("Error deactivating user:", err);
        setError(
          "Failed to deactivate user: " +
            (err.response?.data?.message || err.message),
        );
      }
    }
  };

  // Export data to CSV
  const exportToCSV = (data, filename, headers) => {
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((header) => `"${row[header] || ""}"`).join(","),
      ),
    ].join("\n");

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent),
    );
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExportComplaints = () => {
    const headers = [
      "complaintId",
      "crimeType",
      "incidentLocation",
      "status",
      "priority",
      "createdAt",
    ];
    exportToCSV(complaints, "complaints.csv", headers);
  };

  const handleExportUsers = () => {
    const headers = ["name", "email", "mobileNumber", "role", "isActive"];
    exportToCSV(users, "users.csv", headers);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "REGISTERED":
        return "#f59e0b";
      case "ASSIGNED":
        return "#3b82f6";
      case "UNDER_INVESTIGATION":
        return "#8b5cf6";
      case "RESOLVED":
        return "#10b981";
      case "CLOSED":
        return "#10b981";
      case "REJECTED":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "REGISTERED":
        return <FiAlertCircle />;
      case "ASSIGNED":
        return <FiMapPin />;
      case "UNDER_INVESTIGATION":
        return <FiClock />;
      case "RESOLVED":
        return <FiCheckCircle />;
      case "CLOSED":
        return <FiCheckCircle />;
      case "REJECTED":
        return <FiX />;
      default:
        return <FiAlertCircle />;
    }
  };

  // Get role color
  const getRoleColor = (role) => {
    switch (role) {
      case "ROLE_ADMIN":
        return "#ef4444";
      case "ROLE_POLICE":
        return "#3b82f6";
      case "ROLE_USER":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>
        <FiBarChart2 style={{ marginRight: "10px" }} />
        Admin Dashboard
      </h1>

      {error && <div className={styles.errorMessage}>{error}</div>}
      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}

      {/* Tabs */}
      <div className={styles.tabsContainer}>
        <button
          onClick={() => setActiveTab("complaints")}
          className={`${styles.tab} ${activeTab === "complaints" ? styles.active : ""}`}
        >
          📋 Complaints Management
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`${styles.tab} ${activeTab === "users" ? styles.active : ""}`}
        >
          👥 Users Management
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`${styles.tab} ${activeTab === "analytics" ? styles.active : ""}`}
        >
          📊 Analytics & Statistics
        </button>
      </div>

      {/* Complaints Tab */}
      {activeTab === "complaints" && (
        <div className={styles.tabContent}>
          <div className={styles.sectionHeader}>
            <h2>All Complaints</h2>
            <div className={styles.filterContainer}>
              <div style={{ position: "relative", flex: 1, minWidth: "150px" }}>
                <FiSearch
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#6b7280",
                  }}
                />
                <input
                  type="text"
                  placeholder="Search complaints..."
                  className={styles.searchInput}
                  value={complaintSearchQuery}
                  onChange={(e) => handleComplaintSearch(e.target.value)}
                  style={{ paddingLeft: "35px" }}
                />
              </div>
              <select
                value={complaintStatus}
                onChange={(e) => {
                  setComplaintStatus(e.target.value);
                  setComplaintPage(0);
                }}
                className={styles.selectField}
              >
                <option value="">All Status</option>
                <option value="REGISTERED">Registered</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="UNDER_INVESTIGATION">Under Investigation</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
                <option value="REJECTED">Rejected</option>
              </select>
              <button
                onClick={handleExportComplaints}
                className={styles.statusButton}
                title="Export to CSV"
              >
                <FiDownload /> Export
              </button>
            </div>
          </div>

          {loadingComplaints ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              ⏳ Loading complaints...
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>📭</div>
              No complaints found
            </div>
          ) : (
            <>
              <div className={styles.complaintGrid}>
                {filteredComplaints.map((complaint) => (
                  <div key={complaint.id} className={styles.complaintCard}>
                    <div className={styles.complaintCardHeader}>
                      <h3 className={styles.complaintCardTitle}>
                        {complaint.complaintId}
                      </h3>
                      <span
                        className={styles.statusBadge}
                        style={{ backgroundColor: getStatusColor(complaint.status) }}
                      >
                        {getStatusIcon(complaint.status)} {complaint.status}
                      </span>
                    </div>

                    <div className={styles.complaintDetails}>
                      <p>
                        <strong>Crime Type:</strong> {complaint.crimeType}
                      </p>
                      <p>
                        <strong>Location:</strong> {complaint.incidentLocation}
                      </p>
                      <p>
                        <strong>Reporter:</strong> {complaint.reporter?.name} (
                        {complaint.reporter?.email})
                      </p>
                      <p>
                        <strong>Priority:</strong>{" "}
                        <span style={{ color: "#ef4444" }}>
                          {complaint.priority}
                        </span>
                      </p>
                      <small>
                        Filed: {new Date(complaint.createdAt).toLocaleDateString()}
                      </small>
                    </div>

                    <div className={styles.actionButtons}>
                      <button
                        onClick={() => setSelectedComplaint(complaint)}
                        className={styles.viewButton}
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          setSelectedStatusComplaint(complaint);
                          setShowStatusModal(true);
                        }}
                        className={styles.statusButton}
                      >
                        Update Status
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAssignComplaint(complaint);
                          setShowAssignModal(true);
                        }}
                        className={styles.assignButton}
                      >
                        Assign Station
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className={styles.paginationContainer}>
                <button
                  onClick={() => setComplaintPage(Math.max(0, complaintPage - 1))}
                  disabled={complaintPage === 0}
                  className={styles.paginationButton}
                >
                  Previous
                </button>
                <span className={styles.paginationInfo}>
                  Page {complaintPage + 1}
                </span>
                <button
                  onClick={() => setComplaintPage(complaintPage + 1)}
                  className={styles.paginationButton}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className={styles.tabContent}>
          <div className={styles.sectionHeader}>
            <h2>All Users</h2>
            <div className={styles.filterContainer}>
              <div style={{ position: "relative", flex: 1, minWidth: "150px" }}>
                <FiSearch
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#6b7280",
                  }}
                />
                <input
                  type="text"
                  placeholder="Search users..."
                  className={styles.searchInput}
                  value={userSearchQuery}
                  onChange={(e) => handleUserSearch(e.target.value)}
                  style={{ paddingLeft: "35px" }}
                />
              </div>
              <button
                onClick={handleExportUsers}
                className={styles.statusButton}
                title="Export to CSV"
              >
                <FiDownload /> Export
              </button>
            </div>
          </div>

          {loadingUsers ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              ⏳ Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>👤</div>
              No users found
            </div>
          ) : (
            <>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.tableHeader}>Name</th>
                      <th className={styles.tableHeader}>Email</th>
                      <th className={styles.tableHeader}>Mobile</th>
                      <th className={styles.tableHeader}>Role</th>
                      <th className={styles.tableHeader}>Status</th>
                      <th className={styles.tableHeader}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className={styles.tableCell}>{user.name}</td>
                        <td className={styles.tableCell}>{user.email}</td>
                        <td className={styles.tableCell}>{user.mobileNumber}</td>
                        <td className={styles.tableCell}>
                          <span
                            className={styles.roleBadge}
                            style={{ backgroundColor: getRoleColor(user.role) }}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className={styles.tableCell}>
                          <span
                            className={styles.statusBadge}
                            style={{
                              backgroundColor: user.isActive ? "#10b981" : "#ef4444",
                            }}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className={styles.tableCell}>
                          {user.isActive && (
                            <button
                              onClick={() => handleDeactivateUser(user.id)}
                              className={styles.deleteButton}
                            >
                              Deactivate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className={styles.paginationContainer}>
                <button
                  onClick={() => setUserPage(Math.max(0, userPage - 1))}
                  disabled={userPage === 0}
                  className={styles.paginationButton}
                >
                  Previous
                </button>
                <span className={styles.paginationInfo}>Page {userPage + 1}</span>
                <button
                  onClick={() => setUserPage(userPage + 1)}
                  className={styles.paginationButton}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className={styles.tabContent}>
          {loadingStats ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              ⏳ Loading statistics...
            </div>
          ) : (
            <>
              {/* System Statistics */}
              {statistics && (
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <FiUsers
                      style={{
                        fontSize: "28px",
                        color: "#3b82f6",
                        marginBottom: "8px",
                      }}
                    />
                    <h3>Total Users</h3>
                    <p className={styles.statNumber}>{statistics.totalUsers}</p>
                    <small className={styles.statSmall}>
                      Active: {statistics.activeUsers}
                    </small>
                  </div>
                  <div className={styles.statCard}>
                    <FiUsers
                      style={{
                        fontSize: "28px",
                        color: "#8b5cf6",
                        marginBottom: "8px",
                      }}
                    />
                    <h3>Police Officers</h3>
                    <p className={styles.statNumber}>
                      {statistics.policeofficers}
                    </p>
                  </div>
                  <div className={styles.statCard}>
                    <FiBarChart2
                      style={{
                        fontSize: "28px",
                        color: "#f59e0b",
                        marginBottom: "8px",
                      }}
                    />
                    <h3>Police Stations</h3>
                    <p className={styles.statNumber}>
                      {statistics.totalPoliceStations}
                    </p>
                  </div>
                  <div className={styles.statCard}>
                    <FiAlertCircle
                      style={{
                        fontSize: "28px",
                        color: "#ef4444",
                        marginBottom: "8px",
                      }}
                    />
                    <h3>Admin Users</h3>
                    <p className={styles.statNumber}>{statistics.adminCount}</p>
                  </div>
                </div>
              )}

              {/* Complaint Statistics */}
              {complaintStats && (
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <h3>Total Complaints</h3>
                    <p className={styles.statNumber}>
                      {complaintStats.totalComplaints}
                    </p>
                  </div>
                  <div className={styles.statCard}>
                    <h3>Registered</h3>
                    <p
                      style={{
                        fontSize: "24px",
                        color: "#f59e0b",
                        fontWeight: "bold",
                      }}
                    >
                      {complaintStats.registered}
                    </p>
                  </div>
                  <div className={styles.statCard}>
                    <h3>Investigating</h3>
                    <p
                      style={{
                        fontSize: "24px",
                        color: "#8b5cf6",
                        fontWeight: "bold",
                      }}
                    >
                      {complaintStats.inProgress}
                    </p>
                  </div>
                  <div className={styles.statCard}>
                    <h3>Closed</h3>
                    <p
                      style={{
                        fontSize: "24px",
                        color: "#10b981",
                        fontWeight: "bold",
                      }}
                    >
                      {complaintStats.closed}
                    </p>
                  </div>
                  <div className={styles.statCard}>
                    <h3>Completion Rate</h3>
                    <p
                      style={{
                        fontSize: "24px",
                        color: "#3b82f6",
                        fontWeight: "bold",
                      }}
                    >
                      {complaintStats.completionRate?.toFixed(1)}%
                    </p>
                  </div>
                </div>
              )}

              {/* Crime Distribution */}
              {crimeDistribution && (
                <div className={styles.crimeDistSection}>
                  <h3>Crime Type Distribution</h3>
                  <div className={styles.crimeDistGrid}>
                    {Object.entries(crimeDistribution.crimeTypes || {}).map(
                      ([crime, count]) => (
                        <div key={crime} className={styles.crimeItem}>
                          <span className={styles.crimeItemName}>{crime}</span>
                          <span className={styles.crimeItemCount}>{count}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Selected Complaint Details Modal */}
      {selectedComplaint && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedComplaint(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedComplaint(null)}
              className={styles.closeButton}
            >
              ✕
            </button>
            <h2>Complaint Details</h2>

            <div className={styles.complaintDetails}>
              <p>
                <strong>Complaint ID:</strong> {selectedComplaint.complaintId}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    backgroundColor: getStatusColor(selectedComplaint.status),
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "4px",
                  }}
                >
                  {selectedComplaint.status}
                </span>
              </p>
              <p>
                <strong>Crime Type:</strong> {selectedComplaint.crimeType}
              </p>
              <p>
                <strong>Description:</strong> {selectedComplaint.description}
              </p>
              <p>
                <strong>Location:</strong> {selectedComplaint.incidentLocation}
              </p>
              <p>
                <strong>Incident Date/Time:</strong>{" "}
                {new Date(selectedComplaint.incidentDateTime).toLocaleString()}
              </p>
              <p>
                <strong>Reporter:</strong> {selectedComplaint.reporter?.name} (
                {selectedComplaint.reporter?.email})
              </p>
              <p>
                <strong>Priority:</strong> {selectedComplaint.priority}
              </p>
              {selectedComplaint.assignedPoliceStation && (
                <p>
                  <strong>Assigned to:</strong>{" "}
                  {selectedComplaint.assignedPoliceStation?.stationName} (
                  {selectedComplaint.assignedPoliceStation?.contactNumber})
                </p>
              )}
              {selectedComplaint.investigationNotes && (
                <p>
                  <strong>Investigation Notes:</strong>{" "}
                  {selectedComplaint.investigationNotes}
                </p>
              )}
              <p style={{ color: "#6b7280", fontSize: "12px" }}>
                Created:{" "}
                {new Date(selectedComplaint.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Assign Station Modal */}
      {showAssignModal && selectedAssignComplaint && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowAssignModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAssignModal(false)}
              className={styles.closeButton}
            >
              ✕
            </button>
            <h2>Assign Complaint to Police Station</h2>

            <p style={{ marginBottom: "12px" }}>
              <strong>Complaint:</strong> {selectedAssignComplaint.complaintId}
            </p>

            <label className={styles.formLabel}>
              <strong>Select Police Station</strong>
            </label>
            <select
              value={selectedAssignComplaint.selectedStation || ""}
              onChange={(e) =>
                setSelectedAssignComplaint({
                  ...selectedAssignComplaint,
                  selectedStation: e.target.value,
                })
              }
              className={styles.formSelect}
            >
              <option value="">-- Select Station --</option>
              {policeStations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.stationName} ({station.city})
                </option>
              ))}
            </select>

            <label className={styles.formLabel}>
              <strong>Remarks (Optional)</strong>
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add any remarks..."
              className={styles.formTextarea}
              rows="3"
            />

            <div className={styles.modalButtonsContainer}>
              <button
                onClick={handleAssignComplaint}
                className={styles.submitButton}
              >
                Assign Complaint
              </button>
              <button
                onClick={() => setShowAssignModal(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showStatusModal && selectedStatusComplaint && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowStatusModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowStatusModal(false)}
              className={styles.closeButton}
            >
              ✕
            </button>
            <h2>Update Complaint Status</h2>

            <p style={{ marginBottom: "12px" }}>
              <strong>Complaint:</strong> {selectedStatusComplaint.complaintId}
            </p>
            <p style={{ marginBottom: "12px" }}>
              <strong>Current Status:</strong>{" "}
              <span
                style={{
                  backgroundColor: getStatusColor(selectedStatusComplaint.status),
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "4px",
                }}
              >
                {selectedStatusComplaint.status}
              </span>
            </p>

            <label className={styles.formLabel}>
              <strong>New Status</strong>
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className={styles.formSelect}
            >
              <option value="REGISTERED">Registered</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="UNDER_INVESTIGATION">Under Investigation</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
              <option value="REJECTED">Rejected</option>
            </select>

            <label className={styles.formLabel}>
              <strong>Remarks</strong>
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add remarks for the status change..."
              className={styles.formTextarea}
              rows="3"
            />

            <div className={styles.modalButtonsContainer}>
              <button
                onClick={handleUpdateStatus}
                className={styles.submitButton}
              >
                Update Status
              </button>
              <button
                onClick={() => setShowStatusModal(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
