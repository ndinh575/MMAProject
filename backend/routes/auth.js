const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const OTPController = require('../controllers/OTPController');
const verifyToken = require('../middleware/authMiddleware');
const verifyAdmin = require('../middleware/verifyAdmin');
const verifyOTP = require('../middleware/verifyOTP');

// Authentication routes
router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.get('/me', verifyToken, UserController.getUserProfile);
router.get('/users', UserController.getAllUsers);
router.put('/update-profile', verifyToken, UserController.updateUserProfile);
router.get('/verify-token', verifyToken, verifyAdmin, (req, res) => res.json({ message: 'Token is valid' }));
router.route('/users/:id')
    .get(verifyToken, UserController.getUser)
    .delete(verifyToken, verifyAdmin, UserController.deleteUser);

// OTP Routes
router.post('/send-otp', OTPController.sendOTP);
router.post('/verify-otp', OTPController.verifyOTP);

// Password management routes
router.post('/forgot-password', UserController.forgotPassword);
router.post('/reset-password', verifyOTP, UserController.resetPassword);
router.post('/change-password', verifyToken, UserController.changePassword);

module.exports = router;
