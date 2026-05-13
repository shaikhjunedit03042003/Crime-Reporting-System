import React, { useState, useEffect } from "react";
import { policeService } from "../services/policeService";
import styles from "../styles/PoliceDashboard.module.css";
import { toast } from "react-toastify";

const ComplaintDetailsModal = ({ complaint, onClose, onStatusUpdated }) => {
  const [details, setDetails] = useState(complaint);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDetails(complaint);
  }, [complaint]);

  const handleAddNote = async () => {
    if (!notes.trim()) return toast.warning("Enter a note");
    setLoading(true);
    const response = await policeService.addInvestigationNote(complaint.id, { note: notes });
    setLoading(false);
    if (response.success) {
      toast.success("Note added");
      setNotes("");
      // Optionally refresh notes
    } else {
      toast.error(response.message || "Failed to add note");
    }
  };

  const handleUpdateStatus = async () => {
    setLoading(true);
    const response = await policeService.updateComplaintStatus(complaint.id, { status: details.status, remarks: details.remarks || "" });
    setLoading(false);
    if (response.success) {
      toast.success("Status updated");
      onStatusUpdated && onStatusUpdated();
    } else {
      toast.error(response.message || "Failed to update status");
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Complaint Details</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.detailGroup}>
            <label>Complaint ID:</label>
            <span>{details.complaintId}</span>
          </div>

          <div className={styles.detailGroup}>
            <label>Crime Type:</label>
            <span>{details.crimeType}</span>
          </div>

          <div className={styles.detailGroup}>
            <label>Location:</label>
            <span>{details.incidentLocation}</span>
          </div>

          <div className={styles.detailGroup}>
            <label>Description:</label>
            <span>{details.description}</span>
          </div>

          <div className={styles.detailRow}>
            <div className={styles.detailGroup}>
              <label>Status:</label>
              <select value={details.status} onChange={(e) => setDetails({ ...details, status: e.target.value })} className={styles.statusSelect}>
                <option value="REGISTERED">Registered</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="UNDER_INVESTIGATION">Under Investigation</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>

            <div className={styles.detailGroup}>
              <label>Priority:</label>
              <span>{details.priority || "MEDIUM"}</span>
            </div>
          </div>

          <div className={styles.detailGroup}>
            <label>Investigation Notes:</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className={styles.notesTextarea} rows={4} />
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <button className={styles.secondaryBtn} onClick={() => setNotes("")}>Clear</button>
              <button className={styles.primaryBtn} onClick={handleAddNote} disabled={loading}>{loading ? "Adding..." : "Add Note"}</button>
            </div>
          </div>

          <div className={styles.detailGroup}>
            <label>Previous Notes:</label>
            <div className={styles.notesList}>
              {(details.investigationNotes || []).map((n, idx) => (
                <div key={idx} className={styles.noteItem}>
                  <small>{new Date(n.createdAt).toLocaleString()}</small>
                  <p>{n.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.secondaryBtn} onClick={onClose}>Close</button>
          <button className={styles.primaryBtn} onClick={handleUpdateStatus} disabled={loading}>{loading ? "Updating..." : "Update Status"}</button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailsModal;
