import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SettingsDashboard from '../pages/SettingsDashboard';
import settingsService from '../services/settingsService';

// Mock the settings service
jest.mock('../services/settingsService');

/**
 * Frontend Tests for SettingsDashboard
 * Tests settings management including crime types, priorities, and preferences
 */
describe('SettingsDashboard Component', () => {
  const mockCrimeTypes = [
    { id: 1, name: 'Theft', description: 'Stealing property' },
    { id: 2, name: 'Vehicle Theft', description: 'Stealing vehicles' },
    { id: 3, name: 'Assault', description: 'Physical attack' }
  ];

  const mockPriorities = [
    { id: 1, level: 'High', value: 1 },
    { id: 2, level: 'Medium', value: 2 },
    { id: 3, level: 'Low', value: 3 }
  ];

  const mockUserPreferences = {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    darkMode: false,
    language: 'en'
  };

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <SettingsDashboard />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    settingsService.getCrimeTypes.mockResolvedValue({
      success: true,
      data: mockCrimeTypes
    });
    settingsService.getPriorities.mockResolvedValue({
      success: true,
      data: mockPriorities
    });
    settingsService.getUserPreferences.mockResolvedValue({
      success: true,
      data: mockUserPreferences
    });
  });

  // ==================== TABBED INTERFACE TESTS ====================

  test('Should render settings dashboard with tabs', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /crime types/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /priorities/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /preferences/i })).toBeInTheDocument();
    });
  });

  test('Should display Crime Types tab content', async () => {
    renderComponent();

    const crimeTypesTab = screen.getByRole('tab', { name: /crime types/i });
    fireEvent.click(crimeTypesTab);

    await waitFor(() => {
      expect(screen.getByText('Theft')).toBeInTheDocument();
      expect(screen.getByText('Vehicle Theft')).toBeInTheDocument();
      expect(screen.getByText('Assault')).toBeInTheDocument();
    });
  });

  test('Should display Priorities tab content', async () => {
    renderComponent();

    const prioritiesTab = screen.getByRole('tab', { name: /priorities/i });
    fireEvent.click(prioritiesTab);

    await waitFor(() => {
      expect(screen.getByText('High')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('Low')).toBeInTheDocument();
    });
  });

  test('Should display Preferences tab content', async () => {
    renderComponent();

    const preferencesTab = screen.getByRole('tab', { name: /preferences/i });
    fireEvent.click(preferencesTab);

    await waitFor(() => {
      expect(screen.getByLabelText(/email notifications/i)).toBeChecked();
      expect(screen.getByLabelText(/sms notifications/i)).not.toBeChecked();
    });
  });

  // ==================== CRIME TYPES MANAGEMENT TESTS ====================

  test('Should display crime types in table format', async () => {
    renderComponent();

    const crimeTypesTab = screen.getByRole('tab', { name: /crime types/i });
    fireEvent.click(crimeTypesTab);

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /description/i })).toBeInTheDocument();
    });
  });

  test('Should add new crime type', async () => {
    const newCrimeType = {
      id: 4,
      name: 'Cybercrime',
      description: 'Online fraud and hacking'
    };
    settingsService.createCrimeType.mockResolvedValue({
      success: true,
      data: newCrimeType
    });

    renderComponent();

    const crimeTypesTab = screen.getByRole('tab', { name: /crime types/i });
    fireEvent.click(crimeTypesTab);

    const addButton = screen.getByRole('button', { name: /add crime type/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      const nameInput = screen.getByLabelText(/crime type name/i);
      const descriptionInput = screen.getByLabelText(/description/i);

      fireEvent.change(nameInput, { target: { value: 'Cybercrime' } });
      fireEvent.change(descriptionInput, { target: { value: 'Online fraud and hacking' } });

      const submitButton = screen.getByRole('button', { name: /save|submit/i });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(settingsService.createCrimeType).toHaveBeenCalledWith({
        name: 'Cybercrime',
        description: 'Online fraud and hacking'
      });
    });
  });

  test('Should edit existing crime type', async () => {
    const updatedCrimeType = {
      id: 1,
      name: 'Theft - Updated',
      description: 'Updated description'
    };
    settingsService.updateCrimeType.mockResolvedValue({
      success: true,
      data: updatedCrimeType
    });

    renderComponent();

    const crimeTypesTab = screen.getByRole('tab', { name: /crime types/i });
    fireEvent.click(crimeTypesTab);

    await waitFor(() => {
      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      fireEvent.click(editButtons[0]);
    });

    await waitFor(() => {
      const nameInput = screen.getByDisplayValue('Theft');
      fireEvent.change(nameInput, { target: { value: 'Theft - Updated' } });

      const submitButton = screen.getByRole('button', { name: /save|update/i });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(settingsService.updateCrimeType).toHaveBeenCalled();
    });
  });

  test('Should delete crime type with confirmation', async () => {
    settingsService.deleteCrimeType.mockResolvedValue({
      success: true,
      message: 'Crime type deleted'
    });

    renderComponent();

    const crimeTypesTab = screen.getByRole('tab', { name: /crime types/i });
    fireEvent.click(crimeTypesTab);

    await waitFor(() => {
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      fireEvent.click(deleteButtons[0]);
    });

    await waitFor(() => {
      expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
      const confirmButton = screen.getByRole('button', { name: /confirm|yes/i });
      fireEvent.click(confirmButton);
    });

    await waitFor(() => {
      expect(settingsService.deleteCrimeType).toHaveBeenCalled();
    });
  });

  // ==================== PRIORITIES MANAGEMENT TESTS ====================

  test('Should display priorities in table', async () => {
    renderComponent();

    const prioritiesTab = screen.getByRole('tab', { name: /priorities/i });
    fireEvent.click(prioritiesTab);

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText('High')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('Low')).toBeInTheDocument();
    });
  });

  test('Should edit priority inline', async () => {
    const updatedPriority = {
      id: 1,
      level: 'Critical',
      value: 0
    };
    settingsService.updatePriority.mockResolvedValue({
      success: true,
      data: updatedPriority
    });

    renderComponent();

    const prioritiesTab = screen.getByRole('tab', { name: /priorities/i });
    fireEvent.click(prioritiesTab);

    await waitFor(() => {
      const editableCell = screen.getByText('High');
      fireEvent.click(editableCell);
    });

    await waitFor(() => {
      const input = screen.getByDisplayValue('High');
      fireEvent.change(input, { target: { value: 'Critical' } });
      fireEvent.blur(input);
    });

    await waitFor(() => {
      expect(settingsService.updatePriority).toHaveBeenCalled();
    });
  });

  // ==================== USER PREFERENCES TESTS ====================

  test('Should display user notification preferences', async () => {
    renderComponent();

    const preferencesTab = screen.getByRole('tab', { name: /preferences/i });
    fireEvent.click(preferencesTab);

    await waitFor(() => {
      expect(screen.getByLabelText(/email notifications/i)).toBeChecked();
      expect(screen.getByLabelText(/sms notifications/i)).not.toBeChecked();
      expect(screen.getByLabelText(/push notifications/i)).toBeChecked();
    });
  });

  test('Should update notification preferences', async () => {
    settingsService.updateUserPreferences.mockResolvedValue({
      success: true,
      data: { ...mockUserPreferences, smsNotifications: true }
    });

    renderComponent();

    const preferencesTab = screen.getByRole('tab', { name: /preferences/i });
    fireEvent.click(preferencesTab);

    await waitFor(() => {
      const smsCheckbox = screen.getByLabelText(/sms notifications/i);
      fireEvent.click(smsCheckbox);
    });

    await waitFor(() => {
      expect(settingsService.updateUserPreferences).toHaveBeenCalledWith(
        expect.objectContaining({ smsNotifications: true })
      );
    });
  });

  test('Should update theme preference (dark mode)', async () => {
    settingsService.updateUserPreferences.mockResolvedValue({
      success: true,
      data: { ...mockUserPreferences, darkMode: true }
    });

    renderComponent();

    const preferencesTab = screen.getByRole('tab', { name: /preferences/i });
    fireEvent.click(preferencesTab);

    await waitFor(() => {
      const darkModeToggle = screen.getByLabelText(/dark mode/i);
      fireEvent.click(darkModeToggle);
    });

    await waitFor(() => {
      expect(settingsService.updateUserPreferences).toHaveBeenCalled();
    });
  });

  test('Should update language preference', async () => {
    settingsService.updateUserPreferences.mockResolvedValue({
      success: true,
      data: { ...mockUserPreferences, language: 'es' }
    });

    renderComponent();

    const preferencesTab = screen.getByRole('tab', { name: /preferences/i });
    fireEvent.click(preferencesTab);

    await waitFor(() => {
      const languageSelect = screen.getByLabelText(/language/i);
      fireEvent.change(languageSelect, { target: { value: 'es' } });
    });

    await waitFor(() => {
      expect(settingsService.updateUserPreferences).toHaveBeenCalled();
    });
  });

  // ==================== SEARCH AND FILTERING TESTS ====================

  test('Should search crime types by name', async () => {
    renderComponent();

    const crimeTypesTab = screen.getByRole('tab', { name: /crime types/i });
    fireEvent.click(crimeTypesTab);

    const searchInput = screen.getByPlaceholderText(/search crime types/i);
    fireEvent.change(searchInput, { target: { value: 'theft' } });

    await waitFor(() => {
      expect(screen.getByText('Theft')).toBeInTheDocument();
      expect(screen.queryByText('Assault')).not.toBeInTheDocument();
    });
  });

  test('Should sort crime types by name', async () => {
    renderComponent();

    const crimeTypesTab = screen.getByRole('tab', { name: /crime types/i });
    fireEvent.click(crimeTypesTab);

    const sortButton = screen.getByRole('button', { name: /sort/i });
    fireEvent.click(sortButton);

    await waitFor(() => {
      const dropdown = screen.getByRole('listbox');
      const option = within(dropdown).getByText(/name, a-z/i);
      fireEvent.click(option);
    });

    // Verify items are now sorted
    expect(settingsService.getCrimeTypes).toHaveBeenCalledWith(
      expect.objectContaining({ sortBy: 'name', sortOrder: 'asc' })
    );
  });

  // ==================== ERROR HANDLING TESTS ====================

  test('Should show error when crime type creation fails', async () => {
    settingsService.createCrimeType.mockRejectedValue(
      new Error('Failed to create crime type')
    );

    renderComponent();

    const crimeTypesTab = screen.getByRole('tab', { name: /crime types/i });
    fireEvent.click(crimeTypesTab);

    const addButton = screen.getByRole('button', { name: /add crime type/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      const nameInput = screen.getByLabelText(/crime type name/i);
      fireEvent.change(nameInput, { target: { value: 'New Type' } });

      const submitButton = screen.getByRole('button', { name: /save|submit/i });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/error.*crime type/i)).toBeInTheDocument();
    });
  });

  test('Should show validation error for empty crime type name', async () => {
    renderComponent();

    const crimeTypesTab = screen.getByRole('tab', { name: /crime types/i });
    fireEvent.click(crimeTypesTab);

    const addButton = screen.getByRole('button', { name: /add crime type/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /save|submit/i });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  // ==================== SUCCESS MESSAGE TESTS ====================

  test('Should show success message after adding crime type', async () => {
    settingsService.createCrimeType.mockResolvedValue({
      success: true,
      data: { id: 4, name: 'Cybercrime', description: 'Online fraud' }
    });

    renderComponent();

    const crimeTypesTab = screen.getByRole('tab', { name: /crime types/i });
    fireEvent.click(crimeTypesTab);

    const addButton = screen.getByRole('button', { name: /add crime type/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      const nameInput = screen.getByLabelText(/crime type name/i);
      fireEvent.change(nameInput, { target: { value: 'Cybercrime' } });

      const submitButton = screen.getByRole('button', { name: /save|submit/i });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/crime type added successfully/i)).toBeInTheDocument();
    });
  });

  // ==================== ACCESS CONTROL TESTS ====================

  test('Should disable crime type deletion if user is not admin', async () => {
    // Mock that current user is not admin
    const mockUserContext = { user: { role: 'ROLE_USER' } };

    renderComponent();

    const crimeTypesTab = screen.getByRole('tab', { name: /crime types/i });
    fireEvent.click(crimeTypesTab);

    await waitFor(() => {
      const deleteButtons = screen.queryAllByRole('button', { name: /delete/i });
      // Should not have delete buttons for non-admin
      expect(deleteButtons.length).toBe(0);
    });
  });

  // ==================== RESPONSIVE DESIGN TESTS ====================

  test('Should render tabs vertically on mobile screens', () => {
    global.innerWidth = 320;
    renderComponent();

    const tabContainer = screen.getByRole('tablist').parentElement;
    expect(tabContainer).toHaveStyle({ flexDirection: 'column' });
  });

  test('Should render tabs horizontally on desktop', () => {
    global.innerWidth = 1200;
    renderComponent();

    const tabContainer = screen.getByRole('tablist');
    expect(tabContainer).toHaveStyle({ display: 'flex' });
  });

  // ==================== ACCESSIBILITY TESTS ====================

  test('Should have proper ARIA labels on tabs', async () => {
    renderComponent();

    const crimeTypesTab = screen.getByRole('tab', { name: /crime types/i });
    expect(crimeTypesTab).toHaveAttribute('aria-selected');
  });

  test('Should support keyboard navigation between tabs', async () => {
    renderComponent();

    const crimeTypesTab = screen.getByRole('tab', { name: /crime types/i });
    crimeTypesTab.focus();

    fireEvent.keyDown(crimeTypesTab, { key: 'ArrowRight' });
    expect(document.activeElement).not.toBe(crimeTypesTab);
  });
});
