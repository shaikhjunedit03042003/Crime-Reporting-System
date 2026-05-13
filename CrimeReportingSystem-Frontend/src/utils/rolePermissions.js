/**
 * Role-Based Access Control Utilities
 * Defines permissions for different user roles
 */

// Role definitions
export const ROLES = {
  ADMIN: "ROLE_ADMIN",
  POLICE: "ROLE_POLICE",
  USER: "ROLE_USER",
};

// Permission definitions for AdminPoliceManagement
export const PERMISSIONS = {
  VIEW_OFFICERS: "view_officers",
  CREATE_OFFICER: "create_officer",
  EDIT_OFFICER: "edit_officer",
  DELETE_OFFICER: "delete_officer",
  ASSIGN_OFFICER: "assign_officer",
  ASSIGN_COMPLAINT: "assign_complaint",
  VIEW_PERFORMANCE: "view_performance",
};

// Role-Permission Mapping
export const rolePermissions = {
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_OFFICERS,
    PERMISSIONS.CREATE_OFFICER,
    PERMISSIONS.EDIT_OFFICER,
    PERMISSIONS.DELETE_OFFICER,
    PERMISSIONS.ASSIGN_OFFICER,
    PERMISSIONS.ASSIGN_COMPLAINT,
    PERMISSIONS.VIEW_PERFORMANCE,
  ],
  [ROLES.POLICE]: [
    PERMISSIONS.VIEW_OFFICERS, // Can view officers from their station
    PERMISSIONS.ASSIGN_COMPLAINT, // Can assign complaints to officers
    PERMISSIONS.VIEW_PERFORMANCE, // Can view performance metrics
  ],
  [ROLES.USER]: [], // No permissions for regular users
};

/**
 * Check if a user has a specific permission
 * @param {string} userRole - The user's role
 * @param {string} permission - The permission to check
 * @returns {boolean} True if user has permission
 */
export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false;
  const permissions = rolePermissions[userRole] || [];
  return permissions.includes(permission);
};

/**
 * Check if a user has any of the specified permissions
 * @param {string} userRole - The user's role
 * @param {array} permissions - Array of permissions to check
 * @returns {boolean} True if user has at least one permission
 */
export const hasAnyPermission = (userRole, permissions) => {
  if (!userRole || !permissions || permissions.length === 0) return false;
  return permissions.some((permission) => hasPermission(userRole, permission));
};

/**
 * Check if user can access police management
 * @param {string} userRole - The user's role
 * @returns {boolean} True if user can access
 */
export const canAccessPoliceManagement = (userRole) => {
  return hasPermission(userRole, PERMISSIONS.VIEW_OFFICERS);
};

/**
 * Check if user can create officers
 * @param {string} userRole - The user's role
 * @returns {boolean} True if user can create
 */
export const canCreateOfficer = (userRole) => {
  return hasPermission(userRole, PERMISSIONS.CREATE_OFFICER);
};

/**
 * Check if user can edit officers
 * @param {string} userRole - The user's role
 * @returns {boolean} True if user can edit
 */
export const canEditOfficer = (userRole) => {
  return hasPermission(userRole, PERMISSIONS.EDIT_OFFICER);
};

/**
 * Check if user can delete officers
 * @param {string} userRole - The user's role
 * @returns {boolean} True if user can delete
 */
export const canDeleteOfficer = (userRole) => {
  return hasPermission(userRole, PERMISSIONS.DELETE_OFFICER);
};

/**
 * Check if user can assign complaints
 * @param {string} userRole - The user's role
 * @returns {boolean} True if user can assign
 */
export const canAssignComplaint = (userRole) => {
  return hasPermission(userRole, PERMISSIONS.ASSIGN_COMPLAINT);
};

/**
 * Check if user can view performance metrics
 * @param {string} userRole - The user's role
 * @returns {boolean} True if user can view
 */
export const canViewPerformance = (userRole) => {
  return hasPermission(userRole, PERMISSIONS.VIEW_PERFORMANCE);
};

/**
 * Get role display name
 * @param {string} role - The user's role
 * @returns {string} Display name for the role
 */
export const getRoleDisplayName = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return "Administrator";
    case ROLES.POLICE:
      return "Police Officer";
    case ROLES.USER:
      return "User";
    default:
      return "Unknown";
  }
};
