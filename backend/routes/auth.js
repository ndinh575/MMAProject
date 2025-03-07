const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const verifyToken = require('../middleware/authMiddleware');
const verifyAdmin = require('../middleware/verifyAdmin');


// Đăng nhập và cấp token JWT
router.route('/login').post(UserController.login);

// Đăng ký người dùng
router.route('/register').post(UserController.register);

router.route('/users').get(verifyToken, verifyAdmin, UserController.getAllUsers);
router.route('/verify-token').get(verifyToken, (req, res) => res.json({ message: 'Token is valid' }));
router.route('/users/:id').get(verifyToken, UserController.getUserProfile);
router.route('/users/:id').put(verifyToken, UserController.updateUser);
router.route('/users/:id').delete(verifyToken, verifyAdmin, UserController.deleteUser);
module.exports = router;
