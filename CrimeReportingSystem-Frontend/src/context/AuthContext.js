import React, { createContext, useState, useCallback, useEffect } from "react";
import { authAPI } from "../services/api";

export const AuthContext = createContext();

// Helper function to normalize user role
const normalizeRole = (user) => {
  if (!user || !user.role) return user;

  // If role already has ROLE_ prefix, return as is
  if (user.role.startsWith("ROLE_")) {
    return user;
  }

  // Add ROLE_ prefix to the role
  return {
    ...user,
    role: `ROLE_${user.role}`,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if token exists on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const normalizedUser = normalizeRole(parsedUser);
        setUser(normalizedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      }
    } else if (token) {
      // Token exists but no user, clear invalid state
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }

    setLoading(false);
  }, []);

  const login = useCallback(async (emailOrMobile, password) => {
    try {
      const response = await authAPI.login(emailOrMobile, password);
      const { data: authData } = response.data;

      // Normalize user role
      const normalizedUser = normalizeRole(authData.user);

      // Store tokens
      localStorage.setItem("accessToken", authData.accessToken);
      localStorage.setItem("refreshToken", authData.refreshToken);

      // Store normalized user info
      localStorage.setItem("user", JSON.stringify(normalizedUser));

      // Store normalized user info
      setUser(normalizedUser);
      setIsAuthenticated(true);

      return { success: true, user: normalizedUser };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      return { success: false, error: message };
    }
  }, []);

  const register = useCallback(async (formData) => {
    try {
      const response = await authAPI.register(formData);
      const { data: authData } = response.data;

      // Normalize user role
      const normalizedUser = normalizeRole(authData.user);

      // Store normalized user info
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      // Store tokens
      localStorage.setItem("accessToken", authData.accessToken);
      localStorage.setItem("refreshToken", authData.refreshToken);

      // Store normalized user info
      setUser(normalizedUser);
      setIsAuthenticated(true);

      return { success: true, user: normalizedUser };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const refreshAccessToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        logout();
        return false;
      }

      const response = await authAPI.refreshToken(refreshToken);
      const { data: authData } = response.data;

      localStorage.setItem("accessToken", authData.accessToken);
      return true;
    } catch (error) {
      logout();
      return false;
    }
  }, [logout]);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
