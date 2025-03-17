const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');
const verifyToken = require('../middleware/authMiddleware');
const verifyAdmin = require('../middleware/verifyAdmin');

router.post('/create-payment-intent', PaymentController.createOrder);
router.post('/confirm-payment/:orderId', PaymentController.confirmPayment);
router.get('/orders', verifyToken, verifyAdmin, PaymentController.getOrders);
router.get('/orders/:userId', PaymentController.getOrderByUserId);

module.exports = router;


