const express = require('express');
const router = express.Router();
const validate = require('../utils/routeValidator');
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/stats', protect, authorize('admin'), validate(adminController.getSystemStats, 'getSystemStats'));
router.get('/dashboard-stats', protect, authorize('admin'), adminController.getDashboardStats);
router.get('/analytics', protect, authorize('admin'), validate(adminController.getComplaintAnalytics, 'getComplaintAnalytics'));
router.get('/users', protect, authorize('admin'), validate(adminController.getUsers, 'getUsers'));
router.get('/users/:id', protect, authorize('admin'), validate(adminController.getUserById, 'getUserById'));
router.put('/users/:id', protect, authorize('admin'), validate(adminController.updateUserStatus, 'updateUserStatus'));

module.exports = router;
