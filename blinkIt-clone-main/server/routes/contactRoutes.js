const express = require('express');
const router = express.Router();
const { submitContact, getContacts, updateContactStatus } = require('../controllers/contactController');
const { isAuthenticated, authorizeRoles } = require('../middleware/auth');

// Public route for submitting contact form
router.post('/contact', submitContact);

// Admin routes
router.get('/contact', isAuthenticated, authorizeRoles('ADMIN'), getContacts);
router.patch('/contact/:id', isAuthenticated, authorizeRoles('ADMIN'), updateContactStatus);

module.exports = router; 