import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { policeService } from "../services/policeService";
import ComplaintDetailsModal from "./ComplaintDetailsModal";
import PoliceStatsPanel from "./PoliceStatsPanel";
import InvestigationNotesList from "./InvestigationNotesList";
import styles from "../styles/PoliceDashboard.module.css";

/**
 * Police Dashboard Component
 * Displays assigned complaints with filtering, search, and detailed view
 */
const PoliceDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    pageSize: 10,
    totalPages: 1,
    totalElements: 0,
  });
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    location: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table"); // table or map

  // Fetch assigned complaints
  useEffect(() => {
    fetchComplaints();
  }, [pagination.currentPage, filters]);

  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);

    const response = await policeService.getAssignedComplaints(
      pagination.currentPage,
      pagination.pageSize,
      filters,
    );

    if (response.success && response.data) {
      const data = response.data.data || response.data;
      setComplaints(data.content || data);
      if (data.totalPages) {
        setPagination((prev) => ({
          ...prev,
          totalPages: data.totalPages,
          totalElements: data.totalElements,
        }));
      }
    } else {
      setError(response.message || "Failed to fetch complaints");
    }

    setLoading(false);
  };

  const handleViewComplaint = async (complaint) => {
    const response = await policeService.getComplaintDetails(complaint.id);
    if (response.success) {
      setSelectedComplaint(response.data.data || response.data);
      setShowModal(true);
    } else {
      setError("Failed to fetch complaint details");
    }
  };

  const handleStatusUpdate = async () => {
    // Refresh complaints after status update
    await fetchComplaints();
    setShowModal(false);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) =>({
      ...prev,
      [filterName]: value,
    }));
    setPagination((prev) => ({ ...prev, currentPage: 0 }));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredComplaints = complaints.filter((complaint) => {
    if (!searchTerm) return true;
    return (
      complaint.complaintId.includes(searchTerm) ||
      complaint.crimeType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.incidentLocation.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1>Police Dashboard</h1>
        <p className={styles.userName}>Welcome, {user?.name}</p>
      </div>

      {/* Stats Panel */}
      <PoliceStatsPanel />

      {/* View Mode Toggle */}
      <div className={styles.viewToggle}>
        <button
          className={`${styles.toggleBtn} ${viewMode === "table" ? styles.active : ""}`}
          onClick={() => setViewMode("table")}
        >
          📋 Table View
        </button>
        <button
          className={`${styles.toggleBtn} ${viewMode === "map" ? styles.active : ""}`}
          onClick={() => setViewMode("map")}
        >
          🗺️ Map View
        </button>
      </div>

      {/* Error Message */}
      {error && <div className={styles.errorMessage}>{error}</div>}

      {/* Filters and Search */}
      <div className={styles.filterSection}>
        <input
          type="text"
          placeholder="Search by Complaint ID, Crime Type, or Location..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className={styles.searchInput}
        />

        <select
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Statuses</option>
          <option value="REGISTERED">Registered</option>
          <option value="UNDER_INVESTIGATION">Under Investigation</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => handleFilterChange("priority", e.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All Priorities</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
          <option value="NORMAL">Normal</option>
        </select>

        <input
          type="text"
          placeholder="Filter by Location..."
          value={filters.location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
          className={styles.filterInput}
        />

        <button
          className={styles.exportBtn}
          onClick={() => policeService.exportComplaintsToCSV(filteredComplaints)}
        >
          📥 Export CSV
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading complaints...</p>
        </div>
      )}

      {/* Table View */}
      {!loading && viewMode === "table" && (
        <div className={styles.tableContainer}>
          <table className={styles.complaintTable}>
            <thead>
              <tr>
                <th>Complaint ID</th>
                <th>Crime Type</th>
                <th>Description</th>
                <th>Location</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Days Since</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((complaint) => (
                <tr key={complaint.id}>
                  <td className={styles.complaintId}>{complaint.complaintId}</td>
                  <td>{complaint.crimeType}</td>
                  <td className={styles.description}>{complaint.description.substring(0, 50)}...</td>
                  <td>{complaint.incidentLocation}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${styles[`priority-${complaint.priority.toLowerCase()}`]}`}
                    >
                      {complaint.priority}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${styles[`status-${complaint.status.toLowerCase()}`]}`}
                    >
                      {policeService.formatStatus(complaint.status)}
                    </span>
                  </td>
                  <td>{policeService.getDaysSinceRegistration(complaint.createdAt)}</td>
                  <td>
                    <button
                      className={styles.viewBtn}
                      onClick={() => handleViewComplaint(complaint)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredComplaints.length === 0 && (
            <p className={styles.noData}>No complaints found matching your criteria.</p>
          )}
        </div>
      )}

      {/* Map View Placeholder */}
      {!loading && viewMode === "map" && (
        <div className={styles.mapContainer}>
          <p className={styles.mapPlaceholder}>
            🗺️ Interactive map view will be displayed here with complaint markers
          </p>
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredComplaints.length > 0 && (
        <div className={styles.pagination}>
          <button
            disabled={pagination.currentPage === 0}
            onClick={() =>
              setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }))
            }
          >
            ← Previous
          </button>
          <span>
            Page {pagination.currentPage + 1} of {pagination.totalPages}
          </span>
          <button
            disabled={pagination.currentPage >= pagination.totalPages - 1}
            onClick={() =>
              setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }))
            }
          >
            Next →
          </button>
        </div>
      )}

      {/* Complaint Details Modal */}
      {showModal && selectedComplaint && (
        <ComplaintDetailsModal
          complaint={selectedComplaint}
          onClose={() => setShowModal(false)}
          onStatusUpdated={handleStatusUpdate}
        />
      )}
    </div>
  );
};

export default PoliceDashboard;
