const express = require('express');
const router = express.Router();
const { login, register, verifyCode, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', login);
router.post('/register', register);
router.post('/verify-code', verifyCode);
router.get('/me', protect, getMe);

module.exports = router;
