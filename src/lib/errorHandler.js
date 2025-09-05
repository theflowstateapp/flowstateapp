// CTO Agent Task: Comprehensive Error Handling and Logging System
// Centralized error handling for LifeOS application

import React from 'react';
import { toast } from 'react-hot-toast';

// Error Types
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTH_ERROR',
  AUTHORIZATION: 'AUTHZ_ERROR',
  API: 'API_ERROR',
  UI: 'UI_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

// Error Severity Levels
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Error Handler Class
export class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.maxLogSize = 1000;
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  // Main error handling method
  handleError(error, context = {}) {
    const errorInfo = this.processError(error, context);
    
    // Log error
    this.logError(errorInfo);
    
    // Show user notification
    this.showUserNotification(errorInfo);
    
    // Report to monitoring service (in production)
    if (!this.isDevelopment) {
      this.reportToMonitoring(errorInfo);
    }
    
    return errorInfo;
  }

  // Process and categorize error
  processError(error, context) {
    const errorInfo = {
      id: this.generateErrorId(),
      timestamp: new Date().toISOString(),
      message: error.message || 'Unknown error occurred',
      stack: error.stack,
      type: this.categorizeError(error),
      severity: this.determineSeverity(error),
      context: context,
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: context.userId || 'anonymous'
    };

    return errorInfo;
  }

  // Categorize error type
  categorizeError(error) {
    if (error.name === 'NetworkError' || error.message.includes('fetch')) {
      return ERROR_TYPES.NETWORK;
    }
    if (error.name === 'ValidationError' || error.message.includes('validation')) {
      return ERROR_TYPES.VALIDATION;
    }
    if (error.name === 'AuthenticationError' || error.message.includes('auth')) {
      return ERROR_TYPES.AUTHENTICATION;
    }
    if (error.name === 'AuthorizationError' || error.message.includes('permission')) {
      return ERROR_TYPES.AUTHORIZATION;
    }
    if (error.message.includes('API') || error.message.includes('endpoint')) {
      return ERROR_TYPES.API;
    }
    if (error.message.includes('UI') || error.message.includes('component')) {
      return ERROR_TYPES.UI;
    }
    return ERROR_TYPES.UNKNOWN;
  }

  // Determine error severity
  determineSeverity(error) {
    if (error.name === 'ChunkLoadError' || error.message.includes('chunk')) {
      return ERROR_SEVERITY.CRITICAL;
    }
    if (error.name === 'NetworkError' || error.message.includes('network')) {
      return ERROR_SEVERITY.HIGH;
    }
    if (error.name === 'ValidationError' || error.message.includes('validation')) {
      return ERROR_SEVERITY.MEDIUM;
    }
    if (error.message.includes('UI') || error.message.includes('component')) {
      return ERROR_SEVERITY.LOW;
    }
    return ERROR_SEVERITY.MEDIUM;
  }

  // Log error to console and internal log
  logError(errorInfo) {
    // Console logging with appropriate level
    const logMethod = this.getLogMethod(errorInfo.severity);
    // eslint-disable-next-line no-console
    logMethod(`[${errorInfo.type}] ${errorInfo.message}`, errorInfo);

    // Add to internal log
    this.errorLog.unshift(errorInfo);
    
    // Maintain log size
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize);
    }

    // Store in localStorage for debugging
    if (this.isDevelopment) {
      localStorage.setItem('lifeos_error_log', JSON.stringify(this.errorLog.slice(0, 50)));
    }
  }

  // Get appropriate console method based on severity
  getLogMethod(severity) {
    switch (severity) {
      case ERROR_SEVERITY.CRITICAL:
        return console.error;
      case ERROR_SEVERITY.HIGH:
        return console.error;
      case ERROR_SEVERITY.MEDIUM:
        return console.warn;
      case ERROR_SEVERITY.LOW:
        return console.info;
      default:
        return console.log;
    }
  }

  // Show user notification
  showUserNotification(errorInfo) {
    const message = this.getUserFriendlyMessage(errorInfo);
    
    switch (errorInfo.severity) {
      case ERROR_SEVERITY.CRITICAL:
        toast.error(message, { duration: 10000 });
        break;
      case ERROR_SEVERITY.HIGH:
        toast.error(message, { duration: 5000 });
        break;
      case ERROR_SEVERITY.MEDIUM:
        toast.error(message, { duration: 3000 });
        break;
      case ERROR_SEVERITY.LOW:
        toast(message, { duration: 2000 });
        break;
      default:
        toast(message);
    }
  }

  // Get user-friendly error message
  getUserFriendlyMessage(errorInfo) {
    const messages = {
      [ERROR_TYPES.NETWORK]: 'Network connection issue. Please check your internet connection.',
      [ERROR_TYPES.VALIDATION]: 'Please check your input and try again.',
      [ERROR_TYPES.AUTHENTICATION]: 'Please log in again to continue.',
      [ERROR_TYPES.AUTHORIZATION]: 'You don\'t have permission to perform this action.',
      [ERROR_TYPES.API]: 'Service temporarily unavailable. Please try again later.',
      [ERROR_TYPES.UI]: 'Something went wrong with the interface. Please refresh the page.',
      [ERROR_TYPES.UNKNOWN]: 'An unexpected error occurred. Please try again.'
    };

    return messages[errorInfo.type] || messages[ERROR_TYPES.UNKNOWN];
  }

  // Report to monitoring service
  reportToMonitoring(errorInfo) {
    // In production, this would send to services like Sentry, LogRocket, etc.
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: errorInfo.message,
        fatal: errorInfo.severity === ERROR_SEVERITY.CRITICAL
      });
    }
  }

  // Generate unique error ID
  generateErrorId() {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get error log for debugging
  getErrorLog() {
    return this.errorLog;
  }

  // Clear error log
  clearErrorLog() {
    this.errorLog = [];
    if (this.isDevelopment) {
      localStorage.removeItem('lifeos_error_log');
    }
  }

  // Get error statistics
  getErrorStats() {
    const stats = {
      total: this.errorLog.length,
      byType: {},
      bySeverity: {},
      recent: this.errorLog.slice(0, 10)
    };

    this.errorLog.forEach(error => {
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
      stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1;
    });

    return stats;
  }
}

// Global error handler instance
export const errorHandler = new ErrorHandler();

// React Error Boundary Component
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    errorHandler.handleError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">Something went wrong</h2>
                <p className="text-sm text-gray-600">We're sorry for the inconvenience</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reload Page
              </button>
              
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Try Again
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-gray-600">Error Details</summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// API Error Handler
export const handleApiError = (error, context = {}) => {
  let errorMessage = 'An error occurred while processing your request';
  
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const data = error.response.data;
    
    switch (status) {
      case 400:
        errorMessage = data.message || 'Invalid request. Please check your input.';
        break;
      case 401:
        errorMessage = 'Please log in to continue';
        break;
      case 403:
        errorMessage = 'You don\'t have permission to perform this action';
        break;
      case 404:
        errorMessage = 'The requested resource was not found';
        break;
      case 429:
        errorMessage = 'Too many requests. Please try again later.';
        break;
      case 500:
        errorMessage = 'Server error. Please try again later.';
        break;
      default:
        errorMessage = data.message || `Server error (${status})`;
    }
  } else if (error.request) {
    // Request was made but no response received
    errorMessage = 'Network error. Please check your connection.';
  } else {
    // Something else happened
    errorMessage = error.message || 'An unexpected error occurred';
  }
  
  const processedError = new Error(errorMessage);
  processedError.originalError = error;
  
  return errorHandler.handleError(processedError, context);
};

// Validation Error Handler
export const handleValidationError = (errors, context = {}) => {
  const errorMessages = Object.values(errors).flat();
  const errorMessage = errorMessages.join(', ');
  
  const error = new Error(errorMessage);
  error.type = ERROR_TYPES.VALIDATION;
  error.errors = errors;
  
  return errorHandler.handleError(error, context);
};

// Network Error Handler
export const handleNetworkError = (error, context = {}) => {
  const networkError = new Error('Network connection failed. Please check your internet connection.');
  networkError.originalError = error;
  networkError.type = ERROR_TYPES.NETWORK;
  
  return errorHandler.handleError(networkError, context);
};

export default errorHandler;
