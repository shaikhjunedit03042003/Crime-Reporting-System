import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AuditLogsDashboard from '../pages/AuditLogsDashboard';
import auditService from '../services/auditService';

// Mock the audit service
jest.mock('../services/auditService');

/**
 * Frontend Tests for AuditLogsDashboard
 * Tests audit log table, filtering, search, pagination, and export functionality
 */
describe('AuditLogsDashboard Component', () => {
  const mockAuditLogs = [
    {
      id: 1,
      actionType: 'COMPLAINT_FILED',
      userId: 'user1',
      description: 'Complaint filed for theft',
      timestamp: '2024-01-15T10:00:00Z',
      entityId: 'CRIME-001'
    },
    {
      id: 2,
      actionType: 'STATUS_UPDATED',
      userId: 'police1',
      description: 'Complaint status updated to UNDER_INVESTIGATION',
      timestamp: '2024-01-15T11:30:00Z',
      entityId: 'CRIME-001'
    },
    {
      id: 3,
      actionType: 'EVIDENCE_UPLOADED',
      userId: 'police1',
      description: 'Evidence uploaded: photo.jpg',
      timestamp: '2024-01-15T12:00:00Z',
      entityId: 'CRIME-001'
    }
  ];

  const mockPaginatedResponse = {
    success: true,
    data: mockAuditLogs,
    pagination: {
      currentPage: 1,
      totalPages: 3,
      totalRecords: 25,
      pageSize: 10
    }
  };

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <AuditLogsDashboard />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    auditService.getAuditLogs.mockResolvedValue(mockPaginatedResponse);
  });

  // ==================== TABLE RENDERING TESTS ====================

  test('Should render audit logs table with headers', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /action type/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /user id/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /description/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /timestamp/i })).toBeInTheDocument();
    });
  });

  test('Should display audit logs data in table rows', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('COMPLAINT_FILED')).toBeInTheDocument();
      expect(screen.getByText('STATUS_UPDATED')).toBeInTheDocument();
      expect(screen.getByText('EVIDENCE_UPLOADED')).toBeInTheDocument();
    });
  });

  test('Should display correct number of log entries', async () => {
    renderComponent();

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      // Header row + 3 data rows
      expect(rows).toHaveLength(4);
    });
  });

  // ==================== FILTERING TESTS ====================

  test('Should filter audit logs by action type', async () => {
    const filteredResponse = {
      success: true,
      data: [mockAuditLogs[0]],
      pagination: { currentPage: 1, totalPages: 1, totalRecords: 1 }
    };
    auditService.getAuditLogs.mockResolvedValue(filteredResponse);

    renderComponent();

    const actionTypeFilter = screen.getByLabelText(/filter by action type/i);
    fireEvent.change(actionTypeFilter, { target: { value: 'COMPLAINT_FILED' } });

    await waitFor(() => {
      expect(auditService.getAuditLogs).toHaveBeenCalledWith(
        expect.objectContaining({ actionType: 'COMPLAINT_FILED' })
      );
    });
  });

  test('Should filter audit logs by user ID', async () => {
    renderComponent();

    const userIdFilter = screen.getByLabelText(/filter by user/i);
    fireEvent.change(userIdFilter, { target: { value: 'police1' } });

    await waitFor(() => {
      expect(auditService.getAuditLogs).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'police1' })
      );
    });
  });

  test('Should filter audit logs by date range', async () => {
    renderComponent();

    const startDateInput = screen.getByLabelText(/start date/i);
    const endDateInput = screen.getByLabelText(/end date/i);

    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
    fireEvent.change(endDateInput, { target: { value: '2024-01-31' } });

    const applyFilterButton = screen.getByRole('button', { name: /apply filters/i });
    fireEvent.click(applyFilterButton);

    await waitFor(() => {
      expect(auditService.getAuditLogs).toHaveBeenCalled();
    });
  });

  // ==================== SEARCH TESTS ====================

  test('Should search audit logs by description', async () => {
    const searchResponse = {
      success: true,
      data: [mockAuditLogs[0]],
      pagination: { currentPage: 1, totalPages: 1, totalRecords: 1 }
    };
    auditService.getAuditLogs.mockResolvedValue(searchResponse);

    renderComponent();

    const searchInput = screen.getByPlaceholderText(/search audit logs/i);
    fireEvent.change(searchInput, { target: { value: 'theft' } });

    await waitFor(() => {
      expect(auditService.getAuditLogs).toHaveBeenCalledWith(
        expect.objectContaining({ description: 'theft' })
      );
    });
  });

  test('Should perform real-time search', async () => {
    renderComponent();

    const searchInput = screen.getByPlaceholderText(/search audit logs/i);
    
    fireEvent.change(searchInput, { target: { value: 't' } });
    fireEvent.change(searchInput, { target: { value: 'th' } });
    fireEvent.change(searchInput, { target: { value: 'the' } });
    fireEvent.change(searchInput, { target: { value: 'theft' } });

    await waitFor(() => {
      expect(auditService.getAuditLogs).toHaveBeenCalledWith(
        expect.objectContaining({ description: 'theft' })
      );
    });
  });

  // ==================== PAGINATION TESTS ====================

  test('Should display pagination controls', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
      expect(screen.getByText(/page 1 of 3/i)).toBeInTheDocument();
    });
  });

  test('Should navigate to next page', async () => {
    const page2Response = {
      success: true,
      data: [mockAuditLogs[0]],
      pagination: { currentPage: 2, totalPages: 3, totalRecords: 25 }
    };
    auditService.getAuditLogs.mockResolvedValueOnce(mockPaginatedResponse);
    auditService.getAuditLogs.mockResolvedValueOnce(page2Response);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/page 1 of 3/i)).toBeInTheDocument();
    });

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(auditService.getAuditLogs).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 2 })
      );
    });
  });

  test('Should navigate to previous page', async () => {
    const page1Response = mockPaginatedResponse;
    auditService.getAuditLogs.mockResolvedValue(page1Response);

    renderComponent();

    await waitFor(() => {
      const previousButton = screen.getByRole('button', { name: /previous/i });
      expect(previousButton).toBeDisabled(); // On first page
    });
  });

  test('Should change page size', async () => {
    renderComponent();

    const pageSizeSelect = screen.getByLabelText(/items per page/i);
    fireEvent.change(pageSizeSelect, { target: { value: '25' } });

    await waitFor(() => {
      expect(auditService.getAuditLogs).toHaveBeenCalledWith(
        expect.objectContaining({ pageSize: 25 })
      );
    });
  });

  // ==================== SORTING TESTS ====================

  test('Should sort audit logs by timestamp', async () => {
    renderComponent();

    const timestampHeader = screen.getByRole('columnheader', { name: /timestamp/i });
    fireEvent.click(timestampHeader);

    await waitFor(() => {
      expect(auditService.getAuditLogs).toHaveBeenCalledWith(
        expect.objectContaining({ sortBy: 'timestamp', sortOrder: 'desc' })
      );
    });
  });

  test('Should toggle sort order (ascending/descending)', async () => {
    renderComponent();

    const actionTypeHeader = screen.getByRole('columnheader', { name: /action type/i });
    
    fireEvent.click(actionTypeHeader);
    await waitFor(() => {
      expect(auditService.getAuditLogs).toHaveBeenCalledWith(
        expect.objectContaining({ sortBy: 'actionType', sortOrder: 'asc' })
      );
    });

    fireEvent.click(actionTypeHeader);
    await waitFor(() => {
      expect(auditService.getAuditLogs).toHaveBeenCalledWith(
        expect.objectContaining({ sortBy: 'actionType', sortOrder: 'desc' })
      );
    });
  });

  // ==================== EXPORT TESTS ====================

  test('Should export audit logs to CSV', async () => {
    auditService.exportAuditLogsCsv.mockResolvedValue({
      success: true,
      data: 'CSV_BLOB'
    });

    renderComponent();

    const exportButton = screen.getByRole('button', { name: /export to csv/i });
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(auditService.exportAuditLogsCsv).toHaveBeenCalled();
    });
  });

  test('Should show export success message', async () => {
    auditService.exportAuditLogsCsv.mockResolvedValue({
      success: true,
      message: 'Export successful'
    });

    renderComponent();

    const exportButton = screen.getByRole('button', { name: /export to csv/i });
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(screen.getByText(/export successful/i)).toBeInTheDocument();
    });
  });

  test('Should show export error message on failure', async () => {
    auditService.exportAuditLogsCsv.mockRejectedValue(
      new Error('Export failed')
    );

    renderComponent();

    const exportButton = screen.getByRole('button', { name: /export to csv/i });
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(screen.getByText(/error exporting logs/i)).toBeInTheDocument();
    });
  });

  // ==================== ACTION DETAILS TESTS ====================

  test('Should display action details modal on row click', async () => {
    renderComponent();

    await waitFor(() => {
      const firstRow = screen.getByText('COMPLAINT_FILED').closest('tr');
      fireEvent.click(firstRow);
    });

    await waitFor(() => {
      expect(screen.getByText(/audit log details/i)).toBeInTheDocument();
      expect(screen.getByText('Complaint filed for theft')).toBeInTheDocument();
    });
  });

  test('Should close details modal', async () => {
    renderComponent();

    await waitFor(() => {
      const firstRow = screen.getByText('COMPLAINT_FILED').closest('tr');
      fireEvent.click(firstRow);
    });

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText(/audit log details/i)).not.toBeInTheDocument();
    });
  });

  // ==================== ERROR HANDLING TESTS ====================

  test('Should show error message when loading fails', async () => {
    auditService.getAuditLogs.mockRejectedValue(
      new Error('Failed to load audit logs')
    );

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/error loading audit logs/i)).toBeInTheDocument();
    });
  });

  test('Should show empty state when no logs available', async () => {
    const emptyResponse = {
      success: true,
      data: [],
      pagination: { currentPage: 1, totalPages: 0, totalRecords: 0 }
    };
    auditService.getAuditLogs.mockResolvedValue(emptyResponse);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/no audit logs found/i)).toBeInTheDocument();
    });
  });

  // ==================== RESPONSIVE DESIGN TESTS ====================

  test('Should display table responsively on mobile', () => {
    global.innerWidth = 320;
    renderComponent();

    const table = screen.getByRole('table');
    expect(table).toHaveClass('responsive-table');
  });

  test('Should show/hide action column on small screens', () => {
    global.innerWidth = 480;
    renderComponent();

    // On mobile, action column might be hidden
    const actionColumn = screen.queryByRole('columnheader', { name: /actions/i });
    expect(actionColumn).toBeInTheDocument();
  });

  // ==================== ACCESSIBILITY TESTS ====================

  test('Should have proper ARIA labels for interactive elements', async () => {
    renderComponent();

    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toHaveAttribute('aria-label');

    const searchInput = screen.getByPlaceholderText(/search audit logs/i);
    expect(searchInput).toHaveAttribute('aria-describedby');
  });

  test('Should maintain keyboard navigation', async () => {
    renderComponent();

    const searchInput = screen.getByPlaceholderText(/search audit logs/i);
    searchInput.focus();

    expect(document.activeElement).toBe(searchInput);

    fireEvent.keyDown(searchInput, { key: 'Tab' });
    expect(document.activeElement).not.toBe(searchInput);
  });
});
