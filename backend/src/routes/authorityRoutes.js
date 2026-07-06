const express = require('express');
const router = express.Router();
const validate = require('../utils/routeValidator');
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Update Authority Settings
router.put('/settings', protect, authorize('authority'), validate(userController.updateAuthoritySettings, 'updateAuthoritySettings'));

module.exports = router;
