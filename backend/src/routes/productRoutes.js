const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authorize } = require('../middleware/auth');
const verifyJwt = require('../middleware/jwtAuth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);

// Protected routes (Admin/Vendor only)
router.post('/', verifyJwt, authorize(['admin', 'vendor']), upload.single('image'), productController.createProduct);
router.put('/:id', verifyJwt, authorize(['admin', 'vendor']), upload.single('image'), productController.updateProduct);
router.delete('/:id', verifyJwt, authorize(['admin', 'vendor']), productController.deleteProduct);

module.exports = router;
