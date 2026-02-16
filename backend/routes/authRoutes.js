const express = require('express');
const { registerAdmin, loginAdmin } = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/register-admin
router.post('/register-admin', registerAdmin);

// POST /api/auth/login
router.post('/login', loginAdmin);

module.exports = router;

