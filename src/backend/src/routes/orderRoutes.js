const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyCognitoToken, authorize } = require('../middleware/auth');

// Protected routes (Student only for personal orders)
router.post('/', verifyCognitoToken, orderController.createOrder);
router.get('/', verifyCognitoToken, orderController.getUserOrders);
router.get('/:id', verifyCognitoToken, orderController.getOrder);
router.put('/:id/cancel', verifyCognitoToken, orderController.cancelOrder);

// Admin/Vendor routes
router.put('/:id/status', verifyCognitoToken, authorize(['admin', 'vendor']), orderController.updateOrderStatus);

module.exports = router;
