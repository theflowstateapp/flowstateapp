// Security utilities and configurations
export const securityConfig = {
  // Content Security Policy
  csp: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'",
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
      "https://vercel.live"
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'",
      "https://fonts.googleapis.com"
    ],
    'font-src': [
      "'self'",
      "https://fonts.gstatic.com"
    ],
    'img-src': [
      "'self'",
      "data:",
      "https:",
      "blob:"
    ],
    'connect-src': [
      "'self'",
      "https://api.openai.com",
      "https://www.google-analytics.com",
      "https://vercel.live",
      "wss://vercel.live"
    ],
    'frame-src': [
      "'none'"
    ],
    'object-src': [
      "'none'"
    ],
    'base-uri': [
      "'self'"
    ],
    'form-action': [
      "'self'"
    ]
  },
  
  // Security headers
  headers: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
  },
  
  // Rate limiting
  rateLimiting: {
    enabled: true,
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  },
  
  // Input validation
  validation: {
    maxLength: {
      email: 254,
      password: 128,
      name: 100,
      description: 1000,
      title: 200
    },
    patterns: {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      name: /^[a-zA-Z\s'-]+$/,
      alphanumeric: /^[a-zA-Z0-9\s]+$/
    }
  },
  
  // Session security
  session: {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
};

// Input sanitization
export const sanitizeInput = (input, type = 'text') => {
  if (typeof input !== 'string') return '';
  
  // Remove potentially dangerous characters
  let sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
  
  // Type-specific sanitization
  switch (type) {
    case 'email':
      sanitized = sanitized.toLowerCase();
      break;
    case 'html':
      // Allow basic HTML tags for rich text
      sanitized = sanitized.replace(/<(?!\/?(p|br|strong|em|ul|ol|li|h[1-6])\b)[^>]*>/gi, '');
      break;
    case 'url':
      // Validate URL format
      try {
        new URL(sanitized);
      } catch {
        sanitized = '';
      }
      break;
    default:
      // Remove all HTML tags for plain text
      sanitized = sanitized.replace(/<[^>]*>/g, '');
  }
  
  return sanitized;
};

// Input validation
export const validateInput = (input, type, required = true) => {
  if (required && (!input || input.trim() === '')) {
    return { valid: false, error: 'This field is required' };
  }
  
  if (!input || input.trim() === '') {
    return { valid: true };
  }
  
  const config = securityConfig.validation;
  const sanitized = sanitizeInput(input, type);
  
  // Length validation
  if (config.maxLength[type] && sanitized.length > config.maxLength[type]) {
    return { 
      valid: false, 
      error: `Maximum length is ${config.maxLength[type]} characters` 
    };
  }
  
  // Pattern validation
  if (config.patterns[type] && !config.patterns[type].test(sanitized)) {
    return { 
      valid: false, 
      error: `Invalid ${type} format` 
    };
  }
  
  return { valid: true, sanitized };
};

// Password strength validation
export const validatePassword = (password) => {
  const config = securityConfig.validation.patterns.password;
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[@$!%*?&]/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&)');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password)
  };
};

// Calculate password strength
const calculatePasswordStrength = (password) => {
  let score = 0;
  
  // Length bonus
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  // Character variety bonus
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[@$!%*?&]/.test(password)) score += 1;
  
  // Common patterns penalty
  if (/(.)\1{2,}/.test(password)) score -= 1; // Repeated characters
  if (/123|abc|qwe/i.test(password)) score -= 1; // Common sequences
  
  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  if (score <= 6) return 'strong';
  return 'very-strong';
};

// Generate secure random tokens
export const generateSecureToken = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const crypto = window.crypto || window.msCrypto;
  
  if (crypto && crypto.getRandomValues) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
  } else {
    // Fallback for older browsers
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  
  return result;
};

// Check for security vulnerabilities
export const checkSecurityVulnerabilities = () => {
  const vulnerabilities = [];
  
  // Check for insecure protocols
  if (window.location.protocol === 'http:') {
    vulnerabilities.push({
      type: 'insecure_protocol',
      severity: 'high',
      message: 'Application is running over HTTP instead of HTTPS'
    });
  }
  
  // Check for missing security headers
  const requiredHeaders = [
    'X-Frame-Options',
    'X-Content-Type-Options',
    'X-XSS-Protection'
  ];
  
  // Note: This is a client-side check and may not detect all headers
  // Server-side validation is recommended
  
  // Check for console errors that might indicate security issues
  const originalError = console.error;
  console.error = function(...args) {
    const message = args.join(' ');
    if (message.includes('CORS') || message.includes('security') || message.includes('XSS')) {
      vulnerabilities.push({
        type: 'console_security_error',
        severity: 'medium',
        message: `Console security error: ${message}`
      });
    }
    originalError.apply(console, args);
  };
  
  return vulnerabilities;
};

// Initialize security measures
export const initSecurity = () => {
  // Check for vulnerabilities
  const vulnerabilities = checkSecurityVulnerabilities();
  
  if (vulnerabilities.length > 0) {
    console.warn('Security vulnerabilities detected:', vulnerabilities);
    
    // Report to analytics in production
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/security/vulnerabilities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vulnerabilities,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      }).catch(err => console.log('Security report error:', err));
    }
  }
  
  // Set up security event listeners
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (target.tagName === 'A' && target.href) {
      // Check for suspicious URLs
      if (target.href.includes('javascript:') || target.href.includes('data:')) {
        event.preventDefault();
        console.warn('Blocked potentially malicious link:', target.href);
      }
    }
  });
  
  // Monitor for XSS attempts
  document.addEventListener('DOMNodeInserted', (event) => {
    const node = event.target;
    if (node.nodeType === Node.ELEMENT_NODE) {
      const html = node.outerHTML;
      if (html.includes('<script') || html.includes('javascript:')) {
        console.warn('Potential XSS attempt detected:', html);
        node.remove();
      }
    }
  });
};

export default {
  securityConfig,
  sanitizeInput,
  validateInput,
  validatePassword,
  generateSecureToken,
  checkSecurityVulnerabilities,
  initSecurity
};
