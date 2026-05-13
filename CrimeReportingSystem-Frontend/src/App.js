import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import Navbar from "./components/Navbar";

// Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboard from "./pages/UserDashboard";
import ReportCrimePage from "./pages/ReportCrimePage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPoliceManagement from "./pages/AdminPoliceManagement";
import AuditLogsDashboard from "./pages/AuditLogsDashboard";
import SettingsDashboard from "./pages/SettingsDashboard";
import UnauthorizedPage from "./pages/UnauthorizedPage";

// Styles
import "./App.css";

// Root redirect component
function RootRedirect() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
        }}
      >
        <div style={{ fontSize: "18px", color: "#6b7280" }}>⏳ Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}

// Layout wrapper for authenticated pages
function ProtectedLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes - User */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="ROLE_USER">
                <ProtectedLayout>
                  <UserDashboard />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/report-crime"
            element={
              <ProtectedRoute requiredRole="ROLE_USER">
                <ProtectedLayout>
                  <ReportCrimePage />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Police */}
          <Route
            path="/police/dashboard"
            element={
              <ProtectedRoute requiredRole="ROLE_POLICE">
                <ProtectedLayout>
                  <div>Police Dashboard (Coming Soon)</div>
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <ProtectedLayout>
                  <AdminDashboard />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/audit-logs"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <ProtectedLayout>
                  <AuditLogsDashboard />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <ProtectedLayout>
                  <SettingsDashboard />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/police-management"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <ProtectedLayout>
                  <AdminPoliceManagement />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />

          {/* Redirects */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
