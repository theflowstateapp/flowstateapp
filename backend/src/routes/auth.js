const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passwordResetController = require('../controllers/passwordResetController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/register', authController.registerValidation, authController.register);
router.post('/login', authController.loginValidation, authController.login);
router.post('/refresh', authController.refreshToken);

// Password reset routes
router.post('/forgot-password', passwordResetController.requestPasswordResetValidation, passwordResetController.requestPasswordReset);
router.post('/reset-password', passwordResetController.resetPasswordValidation, passwordResetController.resetPassword);
router.post('/verify-email', passwordResetController.verifyEmail);
router.post('/resend-verification', passwordResetController.resendVerification);

// Protected routes
router.get('/me', authenticateToken, authController.getCurrentUser);
router.post('/logout', authenticateToken, authController.logout);

module.exports = router;
