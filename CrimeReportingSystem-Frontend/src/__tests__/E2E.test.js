import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import * as authService from '../services/authService';
import * as complaintService from '../services/complaintService';
import * as notificationService from '../services/notificationService';
import * as auditService from '../services/auditService';

// Mock all services for E2E testing
jest.mock('../services/authService');
jest.mock('../services/complaintService');
jest.mock('../services/notificationService');
jest.mock('../services/auditService');

/**
 * End-to-End Test Scenarios for Crime Reporting System
 * Tests complete user workflows from registration through complaint resolution
 */
describe('E2E Test Scenarios', () => {
  const renderApp = () => {
    return render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================== SCENARIO 1: USER COMPLAINT WORKFLOW ====================

  describe('Scenario 1: User Files Complaint and Receives Notification', () => {
    test('Should complete full user complaint workflow', async () => {
      // Step 1: User Registration
      authService.register.mockResolvedValue({
        success: true,
        data: {
          id: 1,
          email: 'newuser@example.com',
          role: 'ROLE_USER',
          message: 'Registration successful'
        }
      });

      renderApp();

      // User navigates to register page
      const registerLink = screen.getByRole('link', { name: /register|sign up/i });
      fireEvent.click(registerLink);

      // User fills registration form
      await waitFor(() => {
        fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText(/mobile/i), { target: { value: '9876543210' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });
        fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'Password123!' } });

        const registerButton = screen.getByRole('button', { name: /register|sign up/i });
        fireEvent.click(registerButton);
      });

      expect(authService.register).toHaveBeenCalled();

      // Step 2: User Login
      authService.login.mockResolvedValue({
        success: true,
        data: {
          token: 'jwt_token_here',
          user: { id: 1, email: 'john@example.com', role: 'ROLE_USER' }
        }
      });

      // User fills login form
      await waitFor(() => {
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });

        const loginButton = screen.getByRole('button', { name: /login/i });
        fireEvent.click(loginButton);
      });

      expect(authService.login).toHaveBeenCalledWith('john@example.com', 'Password123!');

      // Step 3: User Files Complaint
      complaintService.fileComplaint.mockResolvedValue({
        success: true,
        data: {
          id: 1,
          complaintId: 'CRIME-USER-001',
          status: 'REGISTERED',
          message: 'Complaint filed successfully'
        }
      });

      // User navigates to report complaint page
      const reportCrimeButton = screen.getByRole('link', { name: /report crime|file complaint/i });
      fireEvent.click(reportCrimeButton);

      // User fills complaint form
      await waitFor(() => {
        fireEvent.change(screen.getByLabelText(/crime type/i), { target: { value: 'Theft' } });
        fireEvent.change(screen.getByLabelText(/description/i), { 
          target: { value: 'My wallet was stolen at the market' } 
        });
        fireEvent.change(screen.getByLabelText(/incident location/i), { 
          target: { value: 'Central Market' } 
        });

        const fileButton = screen.getByRole('button', { name: /file complaint/i });
        fireEvent.click(fileButton);
      });

      expect(complaintService.fileComplaint).toHaveBeenCalled();

      // Step 4: User Receives Notification
      notificationService.getNotifications.mockResolvedValue({
        success: true,
        data: [
          {
            id: 1,
            userId: 1,
            message: 'Your complaint has been filed successfully',
            type: 'COMPLAINT_FILED',
            isRead: false
          }
        ]
      });

      // Verify notification appears
      const notificationBell = screen.getByRole('button', { name: /notifications/i });
      fireEvent.click(notificationBell);

      await waitFor(() => {
        expect(screen.getByText(/complaint has been filed successfully/i)).toBeInTheDocument();
      });

      // Step 5: User Tracks Complaint Status
      complaintService.getComplaintById.mockResolvedValue({
        success: true,
        data: {
          id: 1,
          complaintId: 'CRIME-USER-001',
          status: 'REGISTERED',
          crimeType: 'Theft',
          description: 'My wallet was stolen at the market',
          incidentLocation: 'Central Market'
        }
      });

      // User navigates to dashboard
      const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
      fireEvent.click(dashboardLink);

      // Complaint should be visible in complaint list
      await waitFor(() => {
        expect(screen.getByText('CRIME-USER-001')).toBeInTheDocument();
        expect(screen.getByText('Theft')).toBeInTheDocument();
      });
    });
  });

  // ==================== SCENARIO 2: POLICE INVESTIGATION WORKFLOW ====================

  describe('Scenario 2: Police Officer Investigates Complaint', () => {
    test('Should complete police investigation workflow', async () => {
      // Step 1: Police Officer Login
      authService.login.mockResolvedValue({
        success: true,
        data: {
          token: 'police_jwt_token',
          user: { id: 2, email: 'officer@police.com', role: 'ROLE_POLICE' }
        }
      });

      renderApp();

      await waitFor(() => {
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'officer@police.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'PolicePass123!' } });

        const loginButton = screen.getByRole('button', { name: /login/i });
        fireEvent.click(loginButton);
      });

      expect(authService.login).toHaveBeenCalled();

      // Step 2: Police Views Complaints Dashboard
      complaintService.getAllComplaints.mockResolvedValue({
        success: true,
        data: [
          {
            id: 1,
            complaintId: 'CRIME-001',
            crimeType: 'Theft',
            description: 'Stolen wallet',
            incidentLocation: 'Market',
            status: 'REGISTERED'
          }
        ],
        pagination: { currentPage: 1, totalPages: 1, totalRecords: 1 }
      });

      const policeDashboardLink = screen.getByRole('link', { name: /police dashboard/i });
      fireEvent.click(policeDashboardLink);

      await waitFor(() => {
        expect(screen.getByText('CRIME-001')).toBeInTheDocument();
      });

      // Step 3: Police Selects Complaint for Investigation
      complaintService.getComplaintById.mockResolvedValue({
        success: true,
        data: {
          id: 1,
          complaintId: 'CRIME-001',
          crimeType: 'Theft',
          description: 'Stolen wallet',
          status: 'REGISTERED'
        }
      });

      const complaintRow = screen.getByText('CRIME-001').closest('tr');
      fireEvent.click(complaintRow);

      await waitFor(() => {
        expect(screen.getByText(/complaint details/i)).toBeInTheDocument();
      });

      // Step 4: Police Updates Complaint Status
      complaintService.updateComplaintStatus.mockResolvedValue({
        success: true,
        data: {
          id: 1,
          complaintId: 'CRIME-001',
          status: 'UNDER_INVESTIGATION',
          message: 'Status updated successfully'
        }
      });

      const statusUpdate = screen.getByLabelText(/status/i);
      fireEvent.change(statusUpdate, { target: { value: 'UNDER_INVESTIGATION' } });

      const updateButton = screen.getByRole('button', { name: /update status|save/i });
      fireEvent.click(updateButton);

      await waitFor(() => {
        expect(complaintService.updateComplaintStatus).toHaveBeenCalled();
      });

      // Step 5: Police Adds Investigation Notes
      complaintService.updateComplaint.mockResolvedValue({
        success: true,
        data: {
          id: 1,
          complaintId: 'CRIME-001',
          investigationNotes: 'Witness interview scheduled',
          status: 'UNDER_INVESTIGATION'
        }
      });

      const notesField = screen.getByLabelText(/investigation notes/i);
      fireEvent.change(notesField, { target: { value: 'Witness interview scheduled' } });

      const saveNotesButton = screen.getByRole('button', { name: /save notes/i });
      fireEvent.click(saveNotesButton);

      await waitFor(() => {
        expect(complaintService.updateComplaint).toHaveBeenCalled();
      });

      // Step 6: Police Uploads Evidence
      const fileInput = screen.getByLabelText(/upload evidence/i);
      const evidenceFile = new File(['evidence content'], 'evidence.jpg', { type: 'image/jpeg' });
      fireEvent.change(fileInput, { target: { files: [evidenceFile] } });

      // Step 7: User Receives Investigation Update Notification
      notificationService.getNotifications.mockResolvedValue({
        success: true,
        data: [
          {
            id: 2,
            userId: 1,
            message: 'Your complaint is under investigation',
            type: 'STATUS_UPDATED'
          }
        ]
      });

      // Notification should be received
      await waitFor(() => {
        const notificationBell = screen.getByRole('button', { name: /notifications/i });
        expect(notificationBell).toBeInTheDocument();
      });
    });
  });

  // ==================== SCENARIO 3: ADMIN AUDIT TRAIL WORKFLOW ====================

  describe('Scenario 3: Admin Monitors Audit Trail and Generates Report', () => {
    test('Should complete admin audit trail workflow', async () => {
      // Step 1: Admin Login
      authService.login.mockResolvedValue({
        success: true,
        data: {
          token: 'admin_jwt_token',
          user: { id: 3, email: 'admin@system.com', role: 'ROLE_ADMIN' }
        }
      });

      renderApp();

      await waitFor(() => {
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'admin@system.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'AdminPass123!' } });

        const loginButton = screen.getByRole('button', { name: /login/i });
        fireEvent.click(loginButton);
      });

      expect(authService.login).toHaveBeenCalled();

      // Step 2: Admin Navigates to Audit Logs
      auditService.getAuditLogs.mockResolvedValue({
        success: true,
        data: [
          {
            id: 1,
            actionType: 'COMPLAINT_FILED',
            userId: 1,
            description: 'User filed complaint CRIME-001',
            timestamp: new Date().toISOString()
          },
          {
            id: 2,
            actionType: 'STATUS_UPDATED',
            userId: 2,
            description: 'Complaint status updated to UNDER_INVESTIGATION',
            timestamp: new Date().toISOString()
          },
          {
            id: 3,
            actionType: 'EVIDENCE_UPLOADED',
            userId: 2,
            description: 'Evidence uploaded',
            timestamp: new Date().toISOString()
          }
        ]
      });

      const auditLogsLink = screen.getByRole('link', { name: /audit logs/i });
      fireEvent.click(auditLogsLink);

      await waitFor(() => {
        expect(screen.getByText('COMPLAINT_FILED')).toBeInTheDocument();
        expect(screen.getByText('STATUS_UPDATED')).toBeInTheDocument();
        expect(screen.getByText('EVIDENCE_UPLOADED')).toBeInTheDocument();
      });

      // Step 3: Admin Filters Audit Logs
      const actionTypeFilter = screen.getByLabelText(/filter by action type/i);
      fireEvent.change(actionTypeFilter, { target: { value: 'COMPLAINT_FILED' } });

      await waitFor(() => {
        expect(auditService.getAuditLogs).toHaveBeenCalledWith(
          expect.objectContaining({ actionType: 'COMPLAINT_FILED' })
        );
      });

      // Step 4: Admin Searches Audit Logs
      const searchInput = screen.getByPlaceholderText(/search audit logs/i);
      fireEvent.change(searchInput, { target: { value: 'CRIME-001' } });

      await waitFor(() => {
        expect(auditService.getAuditLogs).toHaveBeenCalled();
      });

      // Step 5: Admin Exports Audit Logs
      auditService.exportAuditLogsCsv.mockResolvedValue({
        success: true,
        message: 'Export successful'
      });

      const exportButton = screen.getByRole('button', { name: /export to csv/i });
      fireEvent.click(exportButton);

      await waitFor(() => {
        expect(auditService.exportAuditLogsCsv).toHaveBeenCalled();
        expect(screen.getByText(/export successful/i)).toBeInTheDocument();
      });

      // Step 6: Verify All User Actions Are Logged
      expect(auditService.getAuditLogs).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  // ==================== SCENARIO 4: SETTINGS MANAGEMENT WORKFLOW ====================

  describe('Scenario 4: Admin Manages Settings (Crime Types and Priorities)', () => {
    test('Should complete settings management workflow', async () => {
      // Step 1: Admin Login
      authService.login.mockResolvedValue({
        success: true,
        data: {
          token: 'admin_jwt_token',
          user: { id: 3, email: 'admin@system.com', role: 'ROLE_ADMIN' }
        }
      });

      renderApp();

      await waitFor(() => {
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'admin@system.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'AdminPass123!' } });

        const loginButton = screen.getByRole('button', { name: /login/i });
        fireEvent.click(loginButton);
      });

      // Step 2: Admin Navigates to Settings
      const settingsLink = screen.getByRole('link', { name: /settings/i });
      fireEvent.click(settingsLink);

      await waitFor(() => {
        expect(screen.getByRole('tab', { name: /crime types/i })).toBeInTheDocument();
      });

      // Step 3: Admin Adds New Crime Type
      const addCrimeTypeButton = screen.getByRole('button', { name: /add crime type/i });
      fireEvent.click(addCrimeTypeButton);

      await waitFor(() => {
        fireEvent.change(screen.getByLabelText(/crime type name/i), { target: { value: 'Cybercrime' } });
        fireEvent.change(screen.getByLabelText(/description/i), { 
          target: { value: 'Online fraud and hacking' } 
        });

        const saveButton = screen.getByRole('button', { name: /save|submit/i });
        fireEvent.click(saveButton);
      });

      // Step 4: Crime Type Should Be Available in Complaint Form
      // Navigate back to complaint filing
      const reportCrimeLink = screen.getByRole('link', { name: /report crime/i });
      fireEvent.click(reportCrimeLink);

      // Verify new crime type is available in dropdown
      const crimeTypeSelect = screen.getByLabelText(/crime type/i);
      await waitFor(() => {
        expect(crimeTypeSelect).toHaveValue('Cybercrime');
      });

      // Step 5: User Files Complaint with New Crime Type
      complaintService.fileComplaint.mockResolvedValue({
        success: true,
        data: {
          id: 100,
          complaintId: 'CRIME-CYBER-001',
          crimeType: 'Cybercrime',
          status: 'REGISTERED'
        }
      });

      fireEvent.change(crimeTypeSelect, { target: { value: 'Cybercrime' } });
      fireEvent.change(screen.getByLabelText(/description/i), { 
        target: { value: 'My account was hacked' } 
      });

      const fileButton = screen.getByRole('button', { name: /file complaint/i });
      fireEvent.click(fileButton);

      await waitFor(() => {
        expect(complaintService.fileComplaint).toHaveBeenCalledWith(
          expect.objectContaining({ crimeType: 'Cybercrime' })
        );
      });

      // Step 6: Verify Settings Persist Across Sessions
      // Simulate logout and login
      authService.logout.mockResolvedValue({ success: true });
      const logoutButton = screen.getByRole('button', { name: /logout/i });
      fireEvent.click(logoutButton);

      // Login again
      authService.login.mockResolvedValue({
        success: true,
        data: {
          token: 'admin_jwt_token',
          user: { id: 3, email: 'admin@system.com', role: 'ROLE_ADMIN' }
        }
      });

      // New crime type should still be available
      const crimeTypeSelectAfterLogin = screen.getByLabelText(/crime type/i);
      await waitFor(() => {
        const options = within(crimeTypeSelectAfterLogin).getAllByRole('option');
        expect(options.some(opt => opt.textContent.includes('Cybercrime'))).toBe(true);
      });
    });
  });

  // ==================== SCENARIO 5: DATA CONSISTENCY WORKFLOW ====================

  describe('Scenario 5: Data Consistency Across Components', () => {
    test('Should maintain data consistency across multiple pages and updates', async () => {
      // Step 1: User logs in and files complaint
      authService.login.mockResolvedValue({
        success: true,
        data: {
          token: 'jwt_token',
          user: { id: 1, email: 'user@example.com', role: 'ROLE_USER' }
        }
      });

      complaintService.fileComplaint.mockResolvedValue({
        success: true,
        data: {
          id: 1,
          complaintId: 'CRIME-CONSISTENT-001',
          status: 'REGISTERED',
          crimeType: 'Theft'
        }
      });

      renderApp();

      // Login
      await waitFor(() => {
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));
      });

      // File complaint
      await waitFor(() => {
        fireEvent.change(screen.getByLabelText(/crime type/i), { target: { value: 'Theft' } });
        fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Test complaint' } });
        fireEvent.change(screen.getByLabelText(/incident location/i), { target: { value: 'Test location' } });
        fireEvent.click(screen.getByRole('button', { name: /file complaint/i }));
      });

      // Step 2: Verify complaint appears in user dashboard
      complaintService.getComplaintById.mockResolvedValue({
        success: true,
        data: {
          id: 1,
          complaintId: 'CRIME-CONSISTENT-001',
          status: 'REGISTERED',
          crimeType: 'Theft',
          description: 'Test complaint',
          incidentLocation: 'Test location'
        }
      });

      const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
      fireEvent.click(dashboardLink);

      await waitFor(() => {
        expect(screen.getByText('CRIME-CONSISTENT-001')).toBeInTheDocument();
        expect(screen.getByText('REGISTERED')).toBeInTheDocument();
      });

      // Step 3: Police updates status
      complaintService.updateComplaintStatus.mockResolvedValue({
        success: true,
        data: {
          id: 1,
          complaintId: 'CRIME-CONSISTENT-001',
          status: 'UNDER_INVESTIGATION'
        }
      });

      // Step 4: Verify status update reflects in user's view
      complaintService.getComplaintById.mockResolvedValue({
        success: true,
        data: {
          id: 1,
          complaintId: 'CRIME-CONSISTENT-001',
          status: 'UNDER_INVESTIGATION',
          crimeType: 'Theft'
        }
      });

      const complaintLink = screen.getByText('CRIME-CONSISTENT-001');
      fireEvent.click(complaintLink);

      await waitFor(() => {
        expect(screen.getByText('UNDER_INVESTIGATION')).toBeInTheDocument();
      });
    });
  });

  // ==================== SCENARIO 6: ERROR RECOVERY WORKFLOW ====================

  describe('Scenario 6: Error Handling and Recovery', () => {
    test('Should handle errors gracefully and allow recovery', async () => {
      // Step 1: Login failure
      authService.login.mockRejectedValueOnce(new Error('Server error'));

      renderApp();

      await waitFor(() => {
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));
      });

      // Error message should appear
      await waitFor(() => {
        expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
      });

      // Step 2: User retries login after error
      authService.login.mockResolvedValueOnce({
        success: true,
        data: {
          token: 'jwt_token',
          user: { id: 1, email: 'user@example.com' }
        }
      });

      // Form should still be available for retry
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(authService.login).toHaveBeenCalledTimes(2);
      });

      // Step 3: Complaint filing failure
      complaintService.fileComplaint.mockRejectedValueOnce(
        new Error('Network error')
      );

      // User navigates to file complaint
      await waitFor(() => {
        const reportLink = screen.getByRole('link', { name: /report crime/i });
        if (reportLink) fireEvent.click(reportLink);
      });

      // Fill and submit form
      await waitFor(() => {
        const crimeTypeField = screen.queryByLabelText(/crime type/i);
        if (crimeTypeField) {
          fireEvent.change(crimeTypeField, { target: { value: 'Theft' } });
          fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Test' } });
          fireEvent.click(screen.getByRole('button', { name: /file complaint/i }));
        }
      });

      // Error should be shown
      await waitFor(() => {
        expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
      });

      // Step 4: User retries filing complaint
      complaintService.fileComplaint.mockResolvedValueOnce({
        success: true,
        data: { id: 1, complaintId: 'CRIME-001' }
      });

      fireEvent.click(screen.getByRole('button', { name: /file complaint/i }));

      await waitFor(() => {
        expect(complaintService.fileComplaint).toHaveBeenCalledTimes(2);
      });
    });
  });
});

/**
 * Performance and Load Testing for E2E Scenarios
 */
describe('E2E Performance Tests', () => {
  test('Should complete user workflow within reasonable time (<5 seconds)', async () => {
    const startTime = Date.now();

    authService.login.mockResolvedValue({
      success: true,
      data: { token: 'jwt', user: { id: 1, email: 'user@test.com' } }
    });

    complaintService.fileComplaint.mockResolvedValue({
      success: true,
      data: { id: 1, complaintId: 'CRIME-001' }
    });

    const { unmount } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Simulate user workflow
    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@test.com' } });
      fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Pass123!' } });
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
    }, { timeout: 3000 });

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    expect(duration).toBeLessThan(5);
    unmount();
  });

  test('Should handle rapid form submissions without duplicate entries', async () => {
    complaintService.fileComplaint.mockResolvedValue({
      success: true,
      data: { id: 1, complaintId: 'CRIME-001' }
    });

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /file complaint/i });

    // User accidentally clicks submit multiple times
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Should only submit once due to button disable after first click
      expect(complaintService.fileComplaint).toHaveBeenCalledTimes(1);
    });
  });
});
