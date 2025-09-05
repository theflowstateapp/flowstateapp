const { body } = require('express-validator');
const { supabase } = require('../config/database');
const { 
  generateTokens, 
  hashPassword, 
  verifyPassword, 
  validateRequest,
  successResponse,
  errorResponse 
} = require('../utils/auth');
const logger = require('../config/logger');

// Validation rules
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  validateRequest
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validateRequest
];

// Register new user
const register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return errorResponse(res, 'User with this email already exists', 409);
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (authError) {
      logger.error('Supabase auth signup error:', authError);
      return errorResponse(res, 'Failed to create user account', 500);
    }

    // Create profile record
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: email.toLowerCase(),
        full_name: fullName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (profileError) {
      logger.error('Profile creation error:', profileError);
      return errorResponse(res, 'Failed to create user profile', 500);
    }

    // Generate tokens
    const tokens = generateTokens(profile.id, profile.email);

    logger.info('User registered successfully:', profile.id);

    return successResponse(res, {
      user: {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        createdAt: profile.created_at
      },
      tokens
    }, 'User registered successfully', 201);

  } catch (error) {
    logger.error('Registration error:', error);
    return errorResponse(res, 'Registration failed', 500);
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password
    });

    if (authError) {
      logger.warn('Login failed for email:', email, authError.message);
      return errorResponse(res, 'Invalid email or password', 401);
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
      logger.error('Profile fetch error during login:', profileError);
      return errorResponse(res, 'User profile not found', 404);
    }

    // Generate tokens
    const tokens = generateTokens(profile.id, profile.email);

    // Update last login
    await supabase
      .from('profiles')
      .update({ 
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      })
      .eq('id', profile.id);

    logger.info('User logged in successfully:', profile.id);

    return successResponse(res, {
      user: {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        lastLogin: profile.last_login
      },
      tokens
    }, 'Login successful');

  } catch (error) {
    logger.error('Login error:', error);
    return errorResponse(res, 'Login failed', 500);
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.userId)
      .single();

    if (error || !profile) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, {
      user: {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        avatarUrl: profile.avatar_url,
        timezone: profile.timezone,
        preferences: profile.preferences,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
        lastLogin: profile.last_login
      }
    }, 'User profile retrieved successfully');

  } catch (error) {
    logger.error('Get current user error:', error);
    return errorResponse(res, 'Failed to get user profile', 500);
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    // In a more advanced implementation, you might want to:
    // 1. Add the token to a blacklist
    // 2. Update user's last logout time
    // 3. Clear any session data

    logger.info('User logged out:', req.userId);

    return successResponse(res, null, 'Logout successful');
  } catch (error) {
    logger.error('Logout error:', error);
    return errorResponse(res, 'Logout failed', 500);
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return errorResponse(res, 'Refresh token required', 400);
    }

    // Verify refresh token
    const { verifyToken } = require('../utils/auth');
    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (!decoded) {
      return errorResponse(res, 'Invalid refresh token', 401);
    }

    // Verify user still exists
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('id', decoded.userId)
      .single();

    if (error || !profile) {
      return errorResponse(res, 'User not found', 404);
    }

    // Generate new tokens
    const tokens = generateTokens(profile.id, profile.email);

    logger.info('Token refreshed for user:', profile.id);

    return successResponse(res, { tokens }, 'Token refreshed successfully');

  } catch (error) {
    logger.error('Token refresh error:', error);
    return errorResponse(res, 'Token refresh failed', 500);
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  logout,
  refreshToken,
  registerValidation,
  loginValidation
};
