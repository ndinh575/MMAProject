const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');

router.post('/create-payment-intent', PaymentController.createOrder);
router.post('/confirm-payment/:orderId', PaymentController.confirmPayment);
router.get('/orders', PaymentController.getOrders);
router.get('/orders/:userId', PaymentController.getOrderByUserId);

module.exports = router;


