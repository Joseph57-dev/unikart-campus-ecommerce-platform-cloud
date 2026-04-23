const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authorize } = require('../middleware/auth');
const verifyJwt = require('../middleware/jwtAuth');

// Protected routes (Student only for personal orders)
router.post('/', verifyJwt, orderController.createOrder);
router.get('/', verifyJwt, orderController.getUserOrders);
router.get('/:id', verifyJwt, orderController.getOrder);
router.put('/:id/cancel', verifyJwt, orderController.cancelOrder);

// Admin/Vendor routes
router.put('/:id/status', verifyJwt, authorize(['admin', 'vendor']), orderController.updateOrderStatus);

module.exports = router;
