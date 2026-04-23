const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyJwt = require('../middleware/jwtAuth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/verify', verifyJwt, authController.verify);

module.exports = router;
