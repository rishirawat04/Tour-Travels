import express from 'express';
import { signin, logout, resendVerificationCode, signup, verifyAccount, verifyOTP, resetPassword, forgotPassword, getUserDetailsById, updateUserProfile, changePassword, getAllUsers } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { transporter } from '../utils/emailConfig.js';

const router = express.Router();

// Authentication routes
router.post('/signup', signup)
router.post('/verifyAccount', verifyAccount);
router.post('/verify-otp', verifyOTP);
router.post('/signin', signin);
router.post('/resendCode', resendVerificationCode);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// User profile routes
router.get('/:userId', verifyToken, getUserDetailsById);
router.put('/update-profile', verifyToken, updateUserProfile);
router.put('/change-password', verifyToken, changePassword);
router.get('/all', getAllUsers);

// Email testing route (for debug purposes only)
router.get('/test-email', async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ success: false, msg: 'This route is only available in development mode' });
  }
  
  try {
    // Basic email config test
    const transportConfig = {
      host: transporter.options.host,
      port: transporter.options.port,
      auth: {
        user: process.env.EMAIL ? process.env.EMAIL.substring(0, 5) + '...' : 'not set',
        pass: process.env.EMAIL_PASSWORD ? '[hidden]' : 'not set'
      }
    };
    
    // Test connection to email server
    const connectionTest = await new Promise((resolve) => {
      transporter.verify(function(error, success) {
        if (error) {
          resolve({ success: false, error: error.message });
        } else {
          resolve({ success: true });
        }
      });
    });
    
    return res.json({
      success: true,
      config: transportConfig,
      connection: connectionTest,
      message: 'Email configuration test completed'
    });
  } catch (error) {
    console.error('Email test error:', error);
    return res.status(500).json({ 
      success: false, 
      msg: 'Failed to test email configuration', 
      error: error.message 
    });
  }
});

export default router;