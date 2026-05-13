import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ReportCrimePage from '../pages/ReportCrimePage';
import complaintService from '../services/complaintService';
import mobileService from '../services/mobileService';

// Mock the API services
jest.mock('../services/complaintService');
jest.mock('../services/mobileService');

// Mock for navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

/**
 * Frontend Tests for ReportCrimePage
 * Tests complaint filing form, validation, and submission
 */
describe('ReportCrimePage Component', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <ReportCrimePage />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================== FORM RENDERING TESTS ====================

  test('Should render complaint form with all required fields', () => {
    renderComponent();

    expect(screen.getByLabelText(/crime type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/incident location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/incident date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /file complaint/i })).toBeInTheDocument();
  });

  test('Should render form with priority and location fields', () => {
    renderComponent();

    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/incident location/i)).toBeInTheDocument();
  });

  // ==================== FORM VALIDATION TESTS ====================

  test('Should show error when crime type is empty', async () => {
    renderComponent();

    const submitButton = screen.getByRole('button', { name: /file complaint/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/crime type is required/i)).toBeInTheDocument();
    });
  });

  test('Should show error when description is empty', async () => {
    renderComponent();

    const crimeTypeField = screen.getByLabelText(/crime type/i);
    fireEvent.change(crimeTypeField, { target: { value: 'Theft' } });

    const submitButton = screen.getByRole('button', { name: /file complaint/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    });
  });

  test('Should show error when location is empty', async () => {
    renderComponent();

    const crimeTypeField = screen.getByLabelText(/crime type/i);
    const descriptionField = screen.getByLabelText(/description/i);

    fireEvent.change(crimeTypeField, { target: { value: 'Theft' } });
    fireEvent.change(descriptionField, { target: { value: 'Stolen wallet' } });

    const submitButton = screen.getByRole('button', { name: /file complaint/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/location is required/i)).toBeInTheDocument();
    });
  });

  test('Should show error when description is too short', async () => {
    renderComponent();

    const descriptionField = screen.getByLabelText(/description/i);
    fireEvent.change(descriptionField, { target: { value: 'ab' } });

    await waitFor(() => {
      expect(screen.getByText(/description must be at least 10 characters/i)).toBeInTheDocument();
    });
  });

  // ==================== FORM SUBMISSION TESTS ====================

  test('Should successfully submit valid complaint', async () => {
    const mockResponse = {
      success: true,
      data: { id: 1, complaintId: 'CRIME-001' }
    };
    complaintService.fileComplaint.mockResolvedValue(mockResponse);

    renderComponent();

    // Fill form
    fireEvent.change(screen.getByLabelText(/crime type/i), { target: { value: 'Theft' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Stolen wallet at market' } });
    fireEvent.change(screen.getByLabelText(/incident location/i), { target: { value: 'Central Market' } });

    // Submit
    const submitButton = screen.getByRole('button', { name: /file complaint/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(complaintService.fileComplaint).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/user-dashboard');
    });
  });

  test('Should show error message on submission failure', async () => {
    complaintService.fileComplaint.mockRejectedValue(
      new Error('Server error')
    );

    renderComponent();

    // Fill form
    fireEvent.change(screen.getByLabelText(/crime type/i), { target: { value: 'Theft' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Stolen wallet at market' } });
    fireEvent.change(screen.getByLabelText(/incident location/i), { target: { value: 'Central Market' } });

    // Submit
    const submitButton = screen.getByRole('button', { name: /file complaint/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/error filing complaint/i)).toBeInTheDocument();
    });
  });

  // ==================== FORM RESET TESTS ====================

  test('Should clear form when reset button is clicked', async () => {
    renderComponent();

    const crimeTypeField = screen.getByLabelText(/crime type/i);
    fireEvent.change(crimeTypeField, { target: { value: 'Theft' } });

    const resetButton = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(crimeTypeField.value).toBe('');
    });
  });

  // ==================== MOBILE FORM TESTS ====================

  test('Should support mobile complaint filing', async () => {
    const mockResponse = {
      success: true,
      data: { id: 1, complaintId: 'CRIME-MOBILE-001' }
    };
    mobileService.fileComplaintMobile.mockResolvedValue(mockResponse);

    renderComponent();

    // Fill form with minimal fields
    fireEvent.change(screen.getByLabelText(/crime type/i), { target: { value: 'Theft' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Stolen phone' } });
    fireEvent.change(screen.getByLabelText(/incident location/i), { target: { value: 'Bus Station' } });

    const submitButton = screen.getByRole('button', { name: /file complaint/i });
    fireEvent.click(submitButton);

    // Can now call mobile service
    expect(screen.getByRole('button', { name: /file on mobile/i })).toBeInTheDocument();
  });

  // ==================== FILE UPLOAD TESTS ====================

  test('Should allow file upload for evidence', async () => {
    renderComponent();

    const fileInput = screen.getByLabelText(/upload evidence/i);
    expect(fileInput).toBeInTheDocument();

    const file = new File(['dummy content'], 'evidence.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(fileInput.files[0]).toBe(file);
    });
  });

  test('Should reject non-image file uploads', async () => {
    renderComponent();

    const fileInput = screen.getByLabelText(/upload evidence/i);
    const invalidFile = new File(['dummy'], 'script.exe', { type: 'application/exe' });

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    await waitFor(() => {
      expect(screen.getByText(/invalid file type/i)).toBeInTheDocument();
    });
  });

  test('Should reject oversized file uploads', async () => {
    renderComponent();

    const fileInput = screen.getByLabelText(/upload evidence/i);
    // Create mock file larger than 5MB
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    await waitFor(() => {
      expect(screen.getByText(/file size exceeds/i)).toBeInTheDocument();
    });
  });
});

/**
 * Tests for Dashboard Component
 * Tests rendering, user data display, and interactions
 */
describe('Dashboard Component', () => {
  test('Should display user information', () => {
    // Mock user data
    const userData = {
      id: 1,
      name: 'John User',
      email: 'john@example.com',
      role: 'ROLE_USER'
    };

    // Component should render user name and email
    expect(screen.getByText('John User')).toBeInTheDocument();
  });

  test('Should show complaints list with pagination', () => {
    // Should display complaints in a paginated table
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText(/page 1/i)).toBeInTheDocument();
  });

  test('Should allow complaint filtering by status', async () => {
    const filterSelect = screen.getByLabelText(/filter by status/i);
    fireEvent.change(filterSelect, { target: { value: 'REGISTERED' } });

    await waitFor(() => {
      // Complaints should be filtered
      expect(screen.getByText(/showing filtered results/i)).toBeInTheDocument();
    });
  });
});

/**
 * Tests for Responsive Design
 * Tests mobile, tablet, and desktop layouts
 */
describe('Responsive Design Tests', () => {
  test('Should render correctly on mobile screens (320px)', () => {
    global.innerWidth = 320;
    global.dispatchEvent(new Event('resize'));

    const { container } = render(
      <BrowserRouter>
        <ReportCrimePage />
      </BrowserRouter>
    );

    // Verify mobile-friendly layout
    const form = container.querySelector('form');
    expect(form).toHaveStyle({ display: 'flex', flexDirection: 'column' });
  });

  test('Should render correctly on tablet screens (768px)', () => {
    global.innerWidth = 768;
    global.dispatchEvent(new Event('resize'));

    render(
      <BrowserRouter>
        <ReportCrimePage />
      </BrowserRouter>
    );

    // Verify tablet layout
    expect(screen.getByLabelText(/crime type/i)).toBeInTheDocument();
  });

  test('Should render correctly on desktop screens (1200px)', () => {
    global.innerWidth = 1200;
    global.dispatchEvent(new Event('resize'));

    render(
      <BrowserRouter>
        <ReportCrimePage />
      </BrowserRouter>
    );

    // Verify desktop layout (wider form)
    const form = screen.getByRole('button', { name: /file complaint/i }).closest('form');
    expect(form).toHaveStyle({ maxWidth: '800px' });
  });
});

/**
 * Accessibility Tests
 */
describe('Accessibility Tests', () => {
  test('Should have proper ARIA labels', () => {
    renderComponent();

    expect(screen.getByLabelText(/crime type/i)).toHaveAttribute('aria-required', 'true');
    expect(screen.getByLabelText(/description/i)).toHaveAttribute('aria-required', 'true');
  });

  test('Should have proper focus management', () => {
    renderComponent();

    const firstInput = screen.getByLabelText(/crime type/i);
    firstInput.focus();

    expect(document.activeElement).toBe(firstInput);
  });

  test('Should have keyboard navigation support', () => {
    renderComponent();

    const crimeTypeField = screen.getByLabelText(/crime type/i);
    crimeTypeField.focus();

    // Tab to next field
    fireEvent.keyDown(crimeTypeField, { key: 'Tab' });
    expect(document.activeElement).not.toBe(crimeTypeField);
  });
});
