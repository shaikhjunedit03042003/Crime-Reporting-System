import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import styles from "../styles/Form.module.css";

export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardWrapper}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
              gap: "20px",
            }}
          >
            <div className={styles.spinner}></div>
            <p
              style={{ color: "#6b7280", fontSize: "16px", fontWeight: "500" }}
            >
              ⏳ Verifying your session...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required, check if user has it
  if (requiredRole && user) {
    console.log("Checking role:", user.role, "Expected:", requiredRole);

    if (user.role === requiredRole) {
      // User has the required role, render children
      return children;
    } else {
      // User role doesn't match required role
      console.log("User role mismatch, redirecting to unauthorized");
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // If no role required, just render children
  return children;
};
