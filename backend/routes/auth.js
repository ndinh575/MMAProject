const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const OTPController = require('../controllers/OTPController');
const verifyToken = require('../middleware/authMiddleware');
const verifyAdmin = require('../middleware/verifyAdmin');


// Đăng nhập và cấp token JWT
router.route('/login').post(UserController.login);

// Đăng ký người dùng
router.route('/register').post(UserController.register);
router.route('/me').get(verifyToken, UserController.getUserProfile);
router.route('/users').get(UserController.getAllUsers);
router.route('/update-profile').put(verifyToken, UserController.updateUserProfile);
router.route('/verify-token').get(verifyToken, verifyAdmin, (req, res) => res.json({ message: 'Token is valid' }));
router.route('/users/:id')
    .get(verifyToken, UserController.getUser)
    .delete(verifyToken, verifyAdmin, UserController.deleteUser);

// OTP Routes
router.post('/send-otp', OTPController.sendOTP);
router.post('/verify-otp', OTPController.verifyOTP);

module.exports = router;
