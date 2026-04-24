const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyCognitoToken, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);

// Protected routes (Admin/Vendor only)
router.post('/', verifyCognitoToken, authorize(['admin', 'vendor']), upload.single('image'), productController.createProduct);
router.put('/:id', verifyCognitoToken, authorize(['admin', 'vendor']), upload.single('image'), productController.updateProduct);
router.delete('/:id', verifyCognitoToken, authorize(['admin', 'vendor']), productController.deleteProduct);

module.exports = router;
