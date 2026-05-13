import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { complaintAPI } from "../services/api";
import styles from "../styles/Form.module.css";

/**
 * Crime Report Page Component
 * SOLUTION TO PROBLEM #1: Easy Online Complaint Registration
 * - Simple and intuitive user interface
 * - Form validation and error handling
 * - Real-time feedback on submission
 */
const ReportCrimePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    crimeType: "",
    description: "",
    incidentLocation: "",
    incidentDateTime: "",
    priority: "NORMAL",
    attachments: [],
  });

  console.log("ReportCrimePage mounted, user:", user);

  const crimeTypes = [
    "Theft",
    "Robbery",
    "Assault",
    "Burglary",
    "Vandalism",
    "Fraud",
    "Cybercrime",
    "Traffic Violation",
    "Domestic Violence",
    "Other",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessage("");
  };

  const validateForm = () => {
    if (!formData.crimeType.trim()) {
      setErrorMessage("Please select a crime type");
      return false;
    }

    if (
      !formData.description.trim() ||
      formData.description.trim().length < 20
    ) {
      setErrorMessage("Please describe the incident in at least 20 characters");
      return false;
    }

    if (!formData.incidentLocation.trim()) {
      setErrorMessage("Incident location is required");
      return false;
    }

    if (!formData.incidentDateTime) {
      setErrorMessage("Incident date and time are required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await complaintAPI.registerComplaint(formData);

      if (response.data && response.data.data) {
        const complaint = response.data.data;
        setSuccessMessage(
          `✅ Crime report registered successfully!\n\n` +
            `Your Complaint ID: ${complaint.complaintId}\n\n` +
            `📧 Confirmation email has been sent.\n` +
            `🚔 Automatically assigned to: ${complaint.assignedPoliceStation?.stationName || "Processing"}\n\n` +
            `Track your case anytime using your Complaint ID.`,
        );

        setFormData({
          crimeType: "",
          description: "",
          incidentLocation: "",
          incidentDateTime: "",
          priority: "NORMAL",
          attachments: [],
        });

        setTimeout(() => {
          navigate("/dashboard");
        }, 4000);
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to register complaint";
      setErrorMessage(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1>📋 File a Crime Report</h1>
        <p className={styles.subtitle}>
          Report a crime quickly and securely. Your information is protected.
        </p>

        {successMessage && (
          <div className={styles.successMessage}>
            <pre>{successMessage}</pre>
          </div>
        )}

        {errorMessage && (
          <div className={styles.errorMessage}>{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="crimeType">Crime Type *</label>
            <select
              id="crimeType"
              name="crimeType"
              value={formData.crimeType}
              onChange={handleInputChange}
              required
              className={styles.input}
            >
              <option value="">-- Select a Crime Type --</option>
              {crimeTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">
              Incident Description * (minimum 20 characters)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the crime incident in detail..."
              rows="5"
              required
              className={styles.input}
            />
            <small>{formData.description.length} / 20 minimum</small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="incidentLocation">Incident Location *</label>
            <input
              id="incidentLocation"
              type="text"
              name="incidentLocation"
              value={formData.incidentLocation}
              onChange={handleInputChange}
              placeholder="e.g., Main Street, Downtown, City, State"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="incidentDateTime">Incident Date & Time *</label>
            <input
              id="incidentDateTime"
              type="datetime-local"
              name="incidentDateTime"
              value={formData.incidentDateTime}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? "⏳ Registering..." : "✅ Register Complaint"}
            </button>
            <button
              type="button"
              className={styles.resetBtn}
              onClick={() => {
                setFormData({
                  crimeType: "",
                  description: "",
                  incidentLocation: "",
                  incidentDateTime: "",
                  priority: "NORMAL",
                  attachments: [],
                });
                setErrorMessage("");
              }}
            >
              🔄 Clear Form
            </button>
          </div>
        </form>

        <div className={styles.infoBox}>
          <h3>📌 Important:</h3>
          <ul>
            <li>✅ Auto-assigned to relevant police station</li>
            <li>📧 Email confirmation sent immediately</li>
            <li>🔍 Track status anytime with your Complaint ID</li>
            <li>🔔 Real-time email updates on progress</li>
            <li>🔒 All information confidential & secure</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReportCrimePage;
