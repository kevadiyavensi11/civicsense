const express = require('express');
const router = express.Router();
const { sendNotification, getMyNotifications, getSentNotifications, markAsRead } = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('admin', 'authority'), sendNotification);
router.get('/', protect, getMyNotifications);
router.get('/sent', protect, getSentNotifications);
router.put('/:id/read', protect, markAsRead);

module.exports = router;
