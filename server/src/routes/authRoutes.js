import express from 'express';
import { signin, logout, resendVerificationCode, signup, verifyAccount, verifyOTP, resetPassword, forgotPassword, getUserDetailsById, updateUserProfile, changePassword, getAllUsers } from '../controllers/authController.js';

import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup)
router.post('/resendCode', resendVerificationCode)
router.post('/verifyAccount', verifyAccount)
router.post("/signin", signin);
router.get('/details',verifyToken, getAllUsers);
router.get('/:userId',verifyToken, getUserDetailsById);
router.put('/:userId',verifyToken, updateUserProfile);
router.put('/:userId/password',verifyToken, changePassword);

// Route for OTP verification
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);


router.post("/logout", logout);



 


export default router;