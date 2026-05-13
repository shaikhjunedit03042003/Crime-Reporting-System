// import React, { useState, useEffect, useCallback } from "react";
// import { adminAPI } from "../services/api";
// import { useAuth } from "../hooks/useAuth";
// import styles from "../styles/AdminPoliceManagement.module.css";
// import {
//   FiPlus,
//   FiEdit2,
//   FiTrash2,
//   FiSearch,
//   FiFilter,
//   FiRefreshCw,
//   FiEye,
//   FiDownload,
//   FiX,
//   FiCheckCircle,
//   FiAlertCircle,
//   FiLock,
// } from "react-icons/fi";
// import { toast } from "react-toastify";
// import {
//   PERMISSIONS,
//   canCreateOfficer,
//   canEditOfficer,
//   canDeleteOfficer,
//   canAssignComplaint,
//   canViewPerformance,
//   canAccessPoliceManagement,
// } from "../utils/rolePermissions";

// /**
//  * Admin Police Management Page
//  * Manage police officers, assignments, performance tracking
//  * Features: CRUD operations with role-based access control
//  */
// const AdminPoliceManagement = () => {
//   // Get current user from auth context
//   const { user } = useAuth();

//   // Check if user can access this page
//   const userRole = user?.role;
//   const canAccess = canAccessPoliceManagement(userRole);

//   // State for police officers
//   const [officers, setOfficers] = useState([]);
//   const [filteredOfficers, setFilteredOfficers] = useState([]);
//   const [page, setPage] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [pageSize, setPageSize] = useState(10);

//   // State for filters
//   const [searchQuery, setSearchQuery] = useState("");
//   const [stationFilter, setStationFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState(""); // active, inactive

//   // State for police stations
//   const [stations, setStations] = useState([]);

//   // State for selected officer
//   const [selectedOfficer, setSelectedOfficer] = useState(null);
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [showAssignModal, setShowAssignModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [deleteOfficerId, setDeleteOfficerId] = useState(null);
//   const [deleteReason, setDeleteReason] = useState("");

//   // State for edit form
//   const [editFormData, setEditFormData] = useState({
//     name: "",
//     email: "",
//     mobileNumber: "",
//     badgeNumber: "",
//     designation: "",
//     policeStationId: "",
//     isActive: true,
//   });

//   // State for assignment
//   const [complaintToAssign, setComplaintToAssign] = useState("");
//   const [assignmentReason, setAssignmentReason] = useState("");

//   // State for loading and errors
//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");
//   const [activeTab, setActiveTab] = useState("officers"); // officers or assignments

//   // Access denied component
//   if (!canAccess) {
//     return (
//       <div className={styles.container}>
//         <div className={styles.accessDenied}>
//           <FiLock size={48} />
//           <h2>Access Denied</h2>
//           <p>You don't have permission to access Police Management.</p>
//           <p>
//             Only administrators and authorized police personnel can access this
//             page.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // Fetch police officers
//   const fetchOfficers = useCallback(async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const response = (await adminAPI.getOfficers?.(page, pageSize)) || {
//         data: {
//           success: true,
//           data: {
//             content: [],
//             totalPages: 0,
//           },
//         },
//       };

//       if (response.data?.success || response.data?.data) {
//         const data = response.data.data || response.data;
//         setOfficers(data.content || data);
//         setTotalPages(data.totalPages || 0);
//         filterOfficers(data.content || []);
//       }
//     } catch (err) {
//       const errorMsg =
//         err.response?.data?.message || "Failed to fetch officers";
//       setError(errorMsg);
//       toast.error(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   }, [page, pageSize]);

//   // Fetch police stations
//   const fetchStations = useCallback(async () => {
//     try {
//       const response = await adminAPI.getPoliceStations?.();
//       if (response.data?.data) {
//         setStations(response.data.data);
//       }
//     } catch (err) {
//       console.error("Error fetching stations:", err);
//     }
//   }, []);

//   // Filter officers locally
//   const filterOfficers = (data) => {
//     let filtered = [...data];

//     if (searchQuery) {
//       filtered = filtered.filter(
//         (o) =>
//           o.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           o.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           o.badgeNumber?.includes(searchQuery),
//       );
//     }

//     if (stationFilter) {
//       filtered = filtered.filter(
//         (o) => o.policeStationId === parseInt(stationFilter),
//       );
//     }

//     if (statusFilter) {
//       const isActive = statusFilter === "active";
//       filtered = filtered.filter((o) => o.isActive === isActive);
//     }

//     setFilteredOfficers(filtered);
//   };

//   useEffect(() => {
//     filterOfficers(officers);
//   }, [searchQuery, stationFilter, statusFilter]);

//   // Initial load
//   useEffect(() => {
//     fetchOfficers();
//     fetchStations();
//   }, [fetchOfficers, fetchStations]);

//   // Handle selection
//   const handleSelectOfficer = (officer) => {
//     setSelectedOfficer(officer);
//     setShowDetailModal(true);
//   };

//   const handleRefresh = () => {
//     setPage(0);
//     fetchOfficers();
//     toast.success("Data refreshed");
//   };

//   // Handle edit officer - Open edit modal
//   const handleEditOfficer = (officer) => {
//     if (!canEditOfficer(userRole)) {
//       toast.error("You don't have permission to edit officers");
//       return;
//     }
//     setSelectedOfficer(officer);
//     setEditFormData({
//       name: officer.name || "",
//       email: officer.email || "",
//       mobileNumber: officer.mobileNumber || "",
//       badgeNumber: officer.badgeNumber || "",
//       designation: officer.designation || "",
//       policeStationId: officer.policeStationId || "",
//       isActive: officer.isActive ?? true,
//     });
//     setShowDetailModal(false);
//     setShowEditModal(true);
//   };

//   // Handle save edited officer
//   const handleSaveEditOfficer = async () => {
//     if (!selectedOfficer?.id) {
//       toast.error("Officer ID is missing");
//       return;
//     }

//     if (
//       !editFormData.name ||
//       !editFormData.email ||
//       !editFormData.badgeNumber
//     ) {
//       toast.error("Please fill in all required fields");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const response = await adminAPI.updateOfficer(
//         selectedOfficer.id,
//         editFormData,
//       );
//       if (response.data?.success) {
//         toast.success("Officer updated successfully");
//         setShowEditModal(false);
//         setSelectedOfficer(null);
//         fetchOfficers();
//       } else {
//         toast.error(response.data?.message || "Failed to update officer");
//       }
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || "Error updating officer";
//       toast.error(errorMsg);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Handle delete officer - Open confirmation dialog
//   const handleDeleteOfficer = (officer) => {
//     if (!canDeleteOfficer(userRole)) {
//       toast.error("You don't have permission to delete officers");
//       return;
//     }
//     setDeleteOfficerId(officer.id);
//     setSelectedOfficer(officer);
//     setShowDetailModal(false);
//     setShowDeleteConfirm(true);
//   };

//   // Handle confirm delete
//   const handleConfirmDelete = async () => {
//     if (!deleteOfficerId) return;

//     if (!deleteReason.trim()) {
//       toast.error("Please provide a reason for deletion");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const response = await adminAPI.deleteOfficer(
//         deleteOfficerId,
//         deleteReason,
//       );
//       if (response.data?.success) {
//         toast.success("Officer deleted successfully");
//         setShowDeleteConfirm(false);
//         setDeleteOfficerId(null);
//         setDeleteReason("");
//         setSelectedOfficer(null);
//         fetchOfficers();
//       } else {
//         toast.error(response.data?.message || "Failed to delete officer");
//       }
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || "Error deleting officer";
//       toast.error(errorMsg);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Handle assign complaint
//   const handleAssignComplaint = async () => {
//     if (!canAssignComplaint(userRole)) {
//       toast.error("You don't have permission to assign complaints");
//       return;
//     }

//     if (!selectedOfficer?.id) {
//       toast.error("Please select an officer");
//       return;
//     }

//     if (!complaintToAssign.trim()) {
//       toast.error("Please enter a complaint ID");
//       return;
//     }

//     if (!assignmentReason.trim()) {
//       toast.error("Please provide an assignment reason");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       // This would call an actual API endpoint
//       // const response = await adminAPI.assignComplaintToOfficer(selectedOfficer.id, complaintToAssign, assignmentReason);
//       // For now, simulate success
//       setTimeout(() => {
//         toast.success(
//           `Complaint assigned to ${selectedOfficer.name} successfully`,
//         );
//         setComplaintToAssign("");
//         setAssignmentReason("");
//         setSelectedOfficer(null);
//         setSubmitting(false);
//       }, 500);
//     } catch (err) {
//       toast.error("Error assigning complaint");
//       setSubmitting(false);
//     }
//   };

//   // Export to CSV
//   const handleExport = () => {
//     const headers = [
//       "Badge Number",
//       "Name",
//       "Email",
//       "Station",
//       "Assigned Cases",
//       "Resolved Cases",
//       "Status",
//     ];
//     const rows = filteredOfficers.map((o) => [
//       o.badgeNumber || "N/A",
//       o.name,
//       o.email,
//       o.stationName || "N/A",
//       o.assignedComplaintsCount || 0,
//       o.resolvedComplaintsCount || 0,
//       o.isActive ? "Active" : "Inactive",
//     ]);

//     const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `police-officers-${new Date().toISOString().split("T")[0]}.csv`;
//     a.click();
//     toast.success("Exported successfully");
//   };

//   return (
//     <div className={styles.container}>
//       {/* Header */}
//       <div className={styles.header}>
//         <h1>Police Officer Management</h1>
//         <div className={styles.headerActions}>
//           <button className={styles.refreshBtn} onClick={handleRefresh}>
//             <FiRefreshCw /> Refresh
//           </button>
//           <button className={styles.exportBtn} onClick={handleExport}>
//             <FiDownload /> Export
//           </button>
//         </div>
//       </div>

//       {/* Error Message */}
//       {error && <div className={styles.errorMessage}>{error}</div>}

//       {/* Tab Navigation */}
//       <div className={styles.tabBar}>
//         <button
//           className={`${styles.tabBtn} ${activeTab === "officers" ? styles.active : ""}`}
//           onClick={() => setActiveTab("officers")}
//         >
//           Police Officers
//         </button>
//         <button
//           className={`${styles.tabBtn} ${activeTab === "assignments" ? styles.active : ""}`}
//           onClick={() => setActiveTab("assignments")}
//         >
//           Assign Cases
//         </button>
//       </div>

//       {/* Officers Tab */}
//       {activeTab === "officers" && (
//         <div className={styles.contentSection}>
//           {/* Filters */}
//           <div className={styles.filterSection}>
//             <div className={styles.searchBox}>
//               <FiSearch className={styles.searchIcon} />
//               <input
//                 type="text"
//                 placeholder="Search by name, email, or badge number..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className={styles.searchInput}
//               />
//             </div>

//             <div className={styles.filterGroup}>
//               <select
//                 value={stationFilter}
//                 onChange={(e) => setStationFilter(e.target.value)}
//                 className={styles.filterSelect}
//               >
//                 <option value="">All Stations</option>
//                 {stations.map((station) => (
//                   <option key={station.id} value={station.id}>
//                     {station.name}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className={styles.filterSelect}
//               >
//                 <option value="">All Status</option>
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>
//             </div>
//           </div>

//           {/* Officers Table */}
//           {loading ? (
//             <div className={styles.loadingContainer}>
//               <div className={styles.spinner}></div>
//               <p>Loading officers...</p>
//             </div>
//           ) : filteredOfficers.length === 0 ? (
//             <div className={styles.emptyState}>
//               <p>No officers found matching your criteria</p>
//             </div>
//           ) : (
//             <>
//               <div className={styles.tableWrapper}>
//                 <table className={styles.table}>
//                   <thead>
//                     <tr>
//                       <th>Badge</th>
//                       <th>Name</th>
//                       <th>Email</th>
//                       <th>Station</th>
//                       <th>Assigned</th>
//                       <th>Resolved</th>
//                       <th>Rating</th>
//                       <th>Status</th>
//                       <th>Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredOfficers.map((officer) => (
//                       <tr key={officer.id} className={styles.row}>
//                         <td>{officer.badgeNumber || "N/A"}</td>
//                         <td>{officer.name}</td>
//                         <td>{officer.email}</td>
//                         <td>{officer.stationName || "N/A"}</td>
//                         <td className={styles.number}>
//                           {officer.assignedComplaintsCount || 0}
//                         </td>
//                         <td className={styles.number}>
//                           {officer.resolvedComplaintsCount || 0}
//                         </td>
//                         <td>
//                           <span
//                             className={`${styles.badge} ${styles[`rating-${(officer.performanceRating || "good").toLowerCase()}`]}`}
//                           >
//                             {officer.performanceRating || "Good"}
//                           </span>
//                         </td>
//                         <td>
//                           <span
//                             className={`${styles.statusBadge} ${officer.isActive ? styles.active : styles.inactive}`}
//                           >
//                             {officer.isActive ? "Active" : "Inactive"}
//                           </span>
//                         </td>
//                         <td>
//                           <button
//                             className={styles.actionBtn}
//                             onClick={() => handleSelectOfficer(officer)}
//                             title="View Details"
//                           >
//                             <FiEye /> Details
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               {totalPages > 1 && (
//                 <div className={styles.pagination}>
//                   <button
//                     onClick={() => setPage(Math.max(0, page - 1))}
//                     disabled={page === 0}
//                     className={styles.paginationBtn}
//                   >
//                     ← Previous
//                   </button>
//                   <span>
//                     Page {page + 1} of {totalPages}
//                   </span>
//                   <button
//                     onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
//                     disabled={page >= totalPages - 1}
//                     className={styles.paginationBtn}
//                   >
//                     Next →
//                   </button>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       )}

//       {/* Assignments Tab */}
//       {activeTab === "assignments" && (
//         <div className={styles.contentSection}>
//           <div className={styles.assignmentPanel}>
//             <h2>Assign Complaint to Officer</h2>
//             <div className={styles.assignmentForm}>
//               <div className={styles.formGroup}>
//                 <label>Select Officer:</label>
//                 <select
//                   className={styles.formSelect}
//                   onChange={(e) => {
//                     const officer = officers.find(
//                       (o) => o.id === parseInt(e.target.value),
//                     );
//                     setSelectedOfficer(officer);
//                   }}
//                 >
//                   <option value="">Choose an officer...</option>
//                   {officers
//                     .filter((o) => o.isActive)
//                     .map((officer) => (
//                       <option key={officer.id} value={officer.id}>
//                         {officer.name} - {officer.stationName} (
//                         {officer.assignedComplaintsCount || 0} cases)
//                       </option>
//                     ))}
//                 </select>
//               </div>

//               <div className={styles.formGroup}>
//                 <label>Complaint ID:</label>
//                 <input
//                   type="text"
//                   className={styles.formInput}
//                   placeholder="Enter complaint ID..."
//                   value={complaintToAssign}
//                   onChange={(e) => setComplaintToAssign(e.target.value)}
//                 />
//               </div>

//               <div className={styles.formGroup}>
//                 <label>Assignment Reason:</label>
//                 <textarea
//                   className={styles.formTextarea}
//                   placeholder="Provide reason for assignment..."
//                   value={assignmentReason}
//                   onChange={(e) => setAssignmentReason(e.target.value)}
//                   rows={4}
//                 />
//               </div>

//               <button className={styles.submitBtn}>Assign Complaint</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Officer Detail Modal */}
//       {showDetailModal && selectedOfficer && (
//         <OfficerDetailModal
//           officer={selectedOfficer}
//           onClose={() => {
//             setShowDetailModal(false);
//             setSelectedOfficer(null);
//           }}
//         />
//       )}
//     </div>
//   );
// };

// // Officer Detail Modal Component
// const OfficerDetailModal = ({ officer, onClose }) => {
//   return (
//     <div className={styles.modalOverlay} onClick={onClose}>
//       <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
//         <div className={styles.modalHeader}>
//           <h2>{officer.name}</h2>
//           <button className={styles.closeBtn} onClick={onClose}>
//             <FiX />
//           </button>
//         </div>

//         <div className={styles.modalBody}>
//           <div className={styles.infoGrid}>
//             <div className={styles.infoGroup}>
//               <label>Badge Number:</label>
//               <span>{officer.badgeNumber || "N/A"}</span>
//             </div>

//             <div className={styles.infoGroup}>
//               <label>Email:</label>
//               <span>{officer.email}</span>
//             </div>

//             <div className={styles.infoGroup}>
//               <label>Mobile:</label>
//               <span>{officer.mobileNumber || "N/A"}</span>
//             </div>

//             <div className={styles.infoGroup}>
//               <label>Designation:</label>
//               <span>{officer.designation || "N/A"}</span>
//             </div>

//             <div className={styles.infoGroup}>
//               <label>Station:</label>
//               <span>{officer.stationName || "N/A"}</span>
//             </div>

//             <div className={styles.infoGroup}>
//               <label>Status:</label>
//               <span
//                 className={`${styles.badge} ${officer.isActive ? styles.activeB : styles.inactiveB}`}
//               >
//                 {officer.isActive ? "Active" : "Inactive"}
//               </span>
//             </div>

//             <div className={styles.infoGroup}>
//               <label>Assigned Cases:</label>
//               <span>{officer.assignedComplaintsCount || 0}</span>
//             </div>

//             <div className={styles.infoGroup}>
//               <label>Resolved Cases:</label>
//               <span>{officer.resolvedComplaintsCount || 0}</span>
//             </div>

//             <div className={styles.infoGroup}>
//               <label>Performance Rating:</label>
//               <span
//                 className={`${styles.badge} ${styles[`rating-${(officer.performanceRating || "good").toLowerCase()}`]}`}
//               >
//                 {officer.performanceRating || "Good"}
//               </span>
//             </div>

//             <div className={styles.infoGroup}>
//               <label>Joined:</label>
//               <span>{new Date(officer.createdAt).toLocaleDateString()}</span>
//             </div>
//           </div>

//           <div className={styles.address}>
//             <label>Address:</label>
//             <p>
//               {officer.address}, {officer.city}, {officer.state}{" "}
//               {officer.zipCode}
//             </p>
//           </div>
//         </div>

//         <div className={styles.modalFooter}>
//           <button className={styles.secondaryBtn} onClick={onClose}>
//             Close
//           </button>
//           <button className={styles.primaryBtn}>Edit Officer</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminPoliceManagement;
