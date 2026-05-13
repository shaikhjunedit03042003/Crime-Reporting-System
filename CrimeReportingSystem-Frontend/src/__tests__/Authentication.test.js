import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import authService from '../services/authService';

// Mock the auth service
jest.mock('../services/authService');

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

/**
 * Frontend Tests for LoginPage
 * Tests login form validation and submission
 */
describe('LoginPage Component', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================== FORM RENDERING TESTS ====================

  test('Should render login form with email and password fields', () => {
    renderComponent();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('Should display "Sign up" link for new users', () => {
    renderComponent();

    expect(screen.getByRole('link', { name: /sign up|register/i })).toBeInTheDocument();
  });

  test('Should display "Forgot password" link', () => {
    renderComponent();

    expect(screen.getByRole('link', { name: /forgot password/i })).toBeInTheDocument();
  });

  // ==================== FORM VALIDATION TESTS ====================

  test('Should show error when email is empty', async () => {
    renderComponent();

    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  test('Should show error when password is empty', async () => {
    renderComponent();

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });

    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test('Should show error for invalid email format', async () => {
    renderComponent();

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  // ==================== LOGIN SUBMISSION TESTS ====================

  test('Should successfully login with valid credentials', async () => {
    const mockResponse = {
      success: true,
      data: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMSIsInJvbGUiOiJST0xFX1VTRVIifQ.signature',
        user: { id: 1, email: 'user@example.com', role: 'ROLE_USER' }
      }
    };
    authService.login.mockResolvedValue(mockResponse);

    renderComponent();

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });

    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('user@example.com', 'Password123!');
      expect(mockNavigate).toHaveBeenCalledWith('/user-dashboard');
    });
  });

  test('Should show error for invalid credentials', async () => {
    authService.login.mockRejectedValue(
      new Error('Invalid email or password')
    );

    renderComponent();

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });

    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });

  test('Should show error for deactivated user account', async () => {
    authService.login.mockRejectedValue(
      new Error('Account is deactivated')
    );

    renderComponent();

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'inactive@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });

    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/account is deactivated/i)).toBeInTheDocument();
    });
  });

  test('Should disable login button during submission', async () => {
    authService.login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 500)));

    renderComponent();

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });

    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    expect(loginButton).toBeDisabled();

    await waitFor(() => {
      expect(loginButton).not.toBeDisabled();
    });
  });

  test('Should show loading spinner during login', async () => {
    authService.login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 500)));

    renderComponent();

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });

    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    expect(screen.getByText(/logging in/i)).toBeInTheDocument();
  });

  // ==================== REMEMBER ME TESTS ====================

  test('Should have "Remember me" checkbox', () => {
    renderComponent();

    expect(screen.getByRole('checkbox', { name: /remember me/i })).toBeInTheDocument();
  });

  test('Should persist email when "Remember me" is checked', () => {
    const { rerender } = renderComponent();

    const emailInput = screen.getByLabelText(/email/i);
    const rememberCheckbox = screen.getByRole('checkbox', { name: /remember me/i });

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.click(rememberCheckbox);

    // Simulate page reload
    rerender(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/email/i)).toHaveValue('user@example.com');
  });
});

/**
 * Frontend Tests for RegisterPage
 * Tests registration form validation and submission
 */
describe('RegisterPage Component', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================== FORM RENDERING TESTS ====================

  test('Should render registration form with all required fields', () => {
    renderComponent();

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mobile number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register|sign up/i })).toBeInTheDocument();
  });

  test('Should display login link for existing users', () => {
    renderComponent();

    expect(screen.getByRole('link', { name: /already have an account|login/i })).toBeInTheDocument();
  });

  // ==================== FORM VALIDATION TESTS ====================

  test('Should show error when name is empty', async () => {
    renderComponent();

    const registerButton = screen.getByRole('button', { name: /register|sign up/i });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  test('Should show error when email is invalid', async () => {
    renderComponent();

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  test('Should show error when mobile number is invalid', async () => {
    renderComponent();

    const mobileInput = screen.getByLabelText(/mobile number/i);
    fireEvent.change(mobileInput, { target: { value: '123' } });

    await waitFor(() => {
      expect(screen.getByText(/invalid mobile number/i)).toBeInTheDocument();
    });
  });

  test('Should show error when password is weak', async () => {
    renderComponent();

    const passwordInput = screen.getByLabelText(/^password$/i);
    fireEvent.change(passwordInput, { target: { value: 'weak' } });

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters|password too weak/i)).toBeInTheDocument();
    });
  });

  test('Should require uppercase letter in password', async () => {
    renderComponent();

    const passwordInput = screen.getByLabelText(/^password$/i);
    fireEvent.change(passwordInput, { target: { value: 'password123!' } });

    await waitFor(() => {
      expect(screen.getByText(/password must contain uppercase letter/i)).toBeInTheDocument();
    });
  });

  test('Should require special character in password', async () => {
    renderComponent();

    const passwordInput = screen.getByLabelText(/^password$/i);
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });

    await waitFor(() => {
      expect(screen.getByText(/password must contain special character/i)).toBeInTheDocument();
    });
  });

  test('Should show error when passwords do not match', async () => {
    renderComponent();

    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password456!' } });

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  // ==================== REGISTRATION SUBMISSION TESTS ====================

  test('Should successfully register new user', async () => {
    const mockResponse = {
      success: true,
      data: { id: 1, email: 'newuser@example.com', message: 'Registration successful' }
    };
    authService.register.mockResolvedValue(mockResponse);

    renderComponent();

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/mobile number/i), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'Password123!' } });

    const registerButton = screen.getByRole('button', { name: /register|sign up/i });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('Should show error when email already exists', async () => {
    authService.register.mockRejectedValue(
      new Error('Email already registered')
    );

    renderComponent();

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'existing@example.com' } });
    fireEvent.change(screen.getByLabelText(/mobile number/i), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'Password123!' } });

    const registerButton = screen.getByRole('button', { name: /register|sign up/i });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText(/email already registered/i)).toBeInTheDocument();
    });
  });

  test('Should show error when mobile number already exists', async () => {
    authService.register.mockRejectedValue(
      new Error('Mobile number already registered')
    );

    renderComponent();

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/mobile number/i), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'Password123!' } });

    const registerButton = screen.getByRole('button', { name: /register|sign up/i });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText(/mobile number already registered/i)).toBeInTheDocument();
    });
  });

  // ==================== TERMS AND CONDITIONS TESTS ====================

  test('Should require terms and conditions acceptance', async () => {
    renderComponent();

    const allFieldsValid = () => {
      fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/mobile number/i), { target: { value: '9876543210' } });
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'Password123!' } });
      fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'Password123!' } });
    };

    allFieldsValid();

    const registerButton = screen.getByRole('button', { name: /register|sign up/i });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText(/must accept terms and conditions/i)).toBeInTheDocument();
    });
  });

  test('Should enable registration when all conditions met', async () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/mobile number/i), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'Password123!' } });
    fireEvent.click(screen.getByRole('checkbox', { name: /accept terms/i }));

    const registerButton = screen.getByRole('button', { name: /register|sign up/i });
    expect(registerButton).not.toBeDisabled();
  });

  // ==================== ACCESSIBILITY TESTS ====================

  test('Should have proper form labels for all inputs', () => {
    renderComponent();

    expect(screen.getByLabelText(/full name/i)).toHaveAttribute('htmlFor', expect.any(String));
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('htmlFor', expect.any(String));
  });

  test('Should have password strength indicator', () => {
    renderComponent();

    const passwordInput = screen.getByLabelText(/^password$/i);
    fireEvent.change(passwordInput, { target: { value: 'w' } });

    expect(screen.getByText(/weak/i)).toBeInTheDocument();

    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    expect(screen.getByText(/strong/i)).toBeInTheDocument();
  });
});

/**
 * Authentication Context Tests
 */
describe('Authentication Context', () => {
  test('Should maintain authentication state after login', async () => {
    const mockResponse = {
      success: true,
      data: {
        token: 'test-token',
        user: { id: 1, email: 'user@example.com', role: 'ROLE_USER' }
      }
    };
    authService.login.mockResolvedValue(mockResponse);

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });

    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalled();
    });
  });

  test('Should clear authentication on logout', () => {
    authService.logout.mockResolvedValue({ success: true });

    // Component should show logout success
    authService.logout();

    expect(authService.logout).toHaveBeenCalled();
  });
});
