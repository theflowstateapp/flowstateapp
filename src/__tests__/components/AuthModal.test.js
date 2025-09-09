import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthModal from '../../components/AuthModal';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock the AuthContext
const mockSignIn = jest.fn();
const mockSignUp = jest.fn();

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
    signUp: mockSignUp,
  }),
  AuthProvider: ({ children }) => <div data-testid="auth-provider">{children}</div>,
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

const renderAuthModal = (props = {}) => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    mode: 'signin',
    ...props,
  };

  return render(
    <AuthProvider>
      <AuthModal {...defaultProps} />
    </AuthProvider>
  );
};

describe('AuthModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('should not render when isOpen is false', () => {
      renderAuthModal({ isOpen: false });
      expect(screen.queryByText('Welcome Back')).not.toBeInTheDocument();
    });

    test('should render sign in form by default', () => {
      renderAuthModal();
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByText('Sign in to your Life OS account')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    });

    test('should render sign up form when mode is signup', () => {
      renderAuthModal({ mode: 'signup' });
      expect(screen.getByText('Create Account')).toBeInTheDocument();
      expect(screen.getByText('Start your productivity journey')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
    });

    test('should show full name field only in sign up mode', () => {
      renderAuthModal({ mode: 'signup' });
      expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument();
      
      renderAuthModal({ mode: 'signin' });
      expect(screen.queryByPlaceholderText('Enter your full name')).not.toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    test('should update email field when user types', async () => {
      const user = userEvent.setup();
      renderAuthModal();
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      await user.type(emailInput, 'test@example.com');
      
      expect(emailInput).toHaveValue('test@example.com');
    });

    test('should update password field when user types', async () => {
      const user = userEvent.setup();
      renderAuthModal();
      
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      await user.type(passwordInput, 'password123');
      
      expect(passwordInput).toHaveValue('password123');
    });

    test('should update full name field when user types in signup mode', async () => {
      const user = userEvent.setup();
      renderAuthModal({ mode: 'signup' });
      
      const nameInput = screen.getByPlaceholderText('Enter your full name');
      await user.type(nameInput, 'John Doe');
      
      expect(nameInput).toHaveValue('John Doe');
    });

    test('should toggle password visibility', async () => {
      const user = userEvent.setup();
      renderAuthModal();
      
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const toggleButton = screen.getByRole('button', { name: '' }); // Eye icon button
      
      // Password should be hidden by default
      expect(passwordInput).toHaveAttribute('type', 'password');
      
      // Click to show password
      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
      
      // Click to hide password
      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('should toggle between sign in and sign up modes', async () => {
      const user = userEvent.setup();
      renderAuthModal();
      
      // Initially in sign in mode
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      
      // Click toggle button
      const toggleButton = screen.getByText("Don't have an account? Sign up");
      await user.click(toggleButton);
      
      // Should now be in sign up mode
      expect(screen.getByText('Create Account')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument();
      
      // Click toggle button again
      const toggleBackButton = screen.getByText('Already have an account? Sign in');
      await user.click(toggleBackButton);
      
      // Should be back in sign in mode
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    test('should call signIn when submitting sign in form', async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();
      mockSignIn.mockResolvedValue({ error: null });
      
      renderAuthModal({ onClose });
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const submitButton = screen.getByRole('button', { name: 'Sign In' });
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
      
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    test('should call signUp when submitting sign up form', async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();
      mockSignUp.mockResolvedValue({ error: null });
      
      renderAuthModal({ mode: 'signup', onClose });
      
      const nameInput = screen.getByPlaceholderText('Enter your full name');
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const submitButton = screen.getByRole('button', { name: 'Create Account' });
      
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
      
      expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'password123', { full_name: 'John Doe' });
    });

    test('should show loading state during submission', async () => {
      const user = userEvent.setup();
      mockSignIn.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      renderAuthModal();
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const submitButton = screen.getByRole('button', { name: 'Sign In' });
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
      
      expect(screen.getByText('Processing...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    test('should call onClose after successful sign in', async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();
      mockSignIn.mockResolvedValue({ error: null });
      
      renderAuthModal({ onClose });
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const submitButton = screen.getByRole('button', { name: 'Sign In' });
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(onClose).toHaveBeenCalled();
      });
    });

    test('should call onClose after successful sign up', async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();
      mockSignUp.mockResolvedValue({ error: null });
      
      renderAuthModal({ mode: 'signup', onClose });
      
      const nameInput = screen.getByPlaceholderText('Enter your full name');
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const submitButton = screen.getByRole('button', { name: 'Create Account' });
      
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(onClose).toHaveBeenCalled();
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle sign in error', async () => {
      const user = userEvent.setup();
      const error = { message: 'Invalid credentials' };
      mockSignIn.mockResolvedValue({ error });
      
      renderAuthModal();
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const submitButton = screen.getByRole('button', { name: 'Sign In' });
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
      });
    });

    test('should handle sign up error', async () => {
      const user = userEvent.setup();
      const error = { message: 'Email already exists' };
      mockSignUp.mockResolvedValue({ error });
      
      renderAuthModal({ mode: 'signup' });
      
      const nameInput = screen.getByPlaceholderText('Enter your full name');
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const submitButton = screen.getByRole('button', { name: 'Create Account' });
      
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'existing@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith('existing@example.com', 'password123', { full_name: 'John Doe' });
      });
    });

    test('should handle unexpected errors', async () => {
      const user = userEvent.setup();
      mockSignIn.mockRejectedValue(new Error('Network error'));
      
      renderAuthModal();
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const submitButton = screen.getByRole('button', { name: 'Sign In' });
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });
  });

  describe('Accessibility', () => {
    test('should have proper form labels', () => {
      renderAuthModal();
      
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    test('should have proper form labels in signup mode', () => {
      renderAuthModal({ mode: 'signup' });
      
      expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    test('should have required fields', () => {
      renderAuthModal();
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      
      expect(emailInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    });

    test('should have required fields in signup mode', () => {
      renderAuthModal({ mode: 'signup' });
      
      const nameInput = screen.getByPlaceholderText('Enter your full name');
      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      
      expect(nameInput).toBeRequired();
      expect(emailInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    });
  });

  describe('Modal Behavior', () => {
    test('should call onClose when clicking outside modal', async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();
      
      renderAuthModal({ onClose });
      
      const backdrop = screen.getByRole('presentation');
      await user.click(backdrop);
      
      expect(onClose).toHaveBeenCalled();
    });

    test('should call onClose when clicking cancel button', async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();
      
      renderAuthModal({ onClose });
      
      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);
      
      expect(onClose).toHaveBeenCalled();
    });

    test('should not call onClose when clicking inside modal', async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();
      
      renderAuthModal({ onClose });
      
      const modalContent = screen.getByText('Welcome Back').closest('div');
      await user.click(modalContent);
      
      expect(onClose).not.toHaveBeenCalled();
    });
  });
});




