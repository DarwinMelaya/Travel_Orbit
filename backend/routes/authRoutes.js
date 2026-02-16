const express = require('express');
const { registerAdmin, registerCustomer, loginAdmin } = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/register-admin
router.post('/register-admin', registerAdmin);

// POST /api/auth/register-customer
router.post('/register-customer', registerCustomer);

// POST /api/auth/login
router.post('/login', loginAdmin);

module.exports = router;

