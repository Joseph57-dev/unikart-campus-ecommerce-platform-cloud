const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyCognitoToken } = require('../middleware/auth');

// Public routes (no auth required)
router.post('/logout', authController.logout);

// Protected routes
router.get('/verify', verifyCognitoToken, authController.verify);

module.exports = router;
