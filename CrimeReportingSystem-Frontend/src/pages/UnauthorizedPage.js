import React from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertTriangle, FiArrowLeft, FiLogOut } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleHome = () => {
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <FiAlertTriangle style={styles.icon} />
        <h1 style={styles.title}>Unauthorized Access</h1>
        <p style={styles.message}>
          You do not have permission to access this page.
        </p>
        <p style={styles.subMessage}>
          Your current role may not have the required permissions for this
          resource.
        </p>

        <div style={styles.buttonGroup}>
          <button style={styles.primaryButton} onClick={handleGoBack}>
            <FiArrowLeft style={styles.buttonIcon} />
            Go Back
          </button>
          <button style={styles.secondaryButton} onClick={handleHome}>
            Return to Home
          </button>
          <button style={styles.dangerButton} onClick={handleLogout}>
            <FiLogOut style={styles.buttonIcon} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
    padding: "20px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "40px",
    maxWidth: "500px",
    width: "100%",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  icon: {
    fontSize: "64px",
    color: "#dc2626",
    marginBottom: "20px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "10px",
  },
  message: {
    fontSize: "18px",
    color: "#4b5563",
    marginBottom: "10px",
  },
  subMessage: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "30px",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  primaryButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    padding: "12px 24px",
    fontSize: "16px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  secondaryButton: {
    backgroundColor: "#9ca3af",
    color: "white",
    border: "none",
    padding: "12px 24px",
    fontSize: "16px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  dangerButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    padding: "12px 24px",
    fontSize: "16px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  buttonIcon: {
    fontSize: "18px",
  },
};

export default UnauthorizedPage;
