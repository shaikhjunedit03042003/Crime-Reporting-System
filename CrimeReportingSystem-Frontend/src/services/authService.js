import { authAPI } from "./api";

export const authService = {
  // Register new user
  async register(userData) {
    try {
      const response = await authAPI.register({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        mobileNumber: userData.mobileNumber,
        address: userData.address,
        city: userData.city,
        role: userData.role || "USER",
      });

      if (response.data.success) {
        const { accessToken, refreshToken, ...user } = response.data.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
      }

      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
        data: null,
      };
    }
  },

  // Login user
  async login(emailOrMobile, password) {
    try {
      const response = await authAPI.login(emailOrMobile, password);

      if (response.data.success) {
        const { accessToken, refreshToken, ...user } = response.data.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
      }

      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
        data: null,
      };
    }
  },

  // Logout user
  logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },

  // Get current user
  async getCurrentUser() {
    try {
      const response = await authAPI.getCurrentUser();
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to fetch current user",
        data: null,
      };
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem("accessToken");
  },

  // Get stored user
  getStoredUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get user role
  getUserRole() {
    const user = this.getStoredUser();
    return user?.role || null;
  },

  // Refresh token
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await authAPI.refreshToken(refreshToken);
      if (response.data.success) {
        const { accessToken } = response.data.data;
        localStorage.setItem("accessToken", accessToken);
      }
      return response.data;
    } catch (error) {
      this.logout();
      return {
        success: false,
        message: "Token refresh failed",
        data: null,
      };
    }
  },
};
