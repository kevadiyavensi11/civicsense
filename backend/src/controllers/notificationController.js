const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Send a notification
// @route   POST /api/notifications
// @access  Private (Admin/Authority)
const sendNotification = async (req, res) => {
    try {
        let { recipientId, recipientRole, recipientEmail, title, message, type } = req.body;
        const senderId = req.user._id;

        // Validation
        if (!title || !message) {
            return res.status(400).json({ message: 'Title and message are required' });
        }

        // Resolve Email to ID
        if (recipientEmail) {
            const user = await User.findOne({ email: recipientEmail });
            if (!user) {
                return res.status(404).json({ message: `Recipient with email '${recipientEmail}' not found` });
            }
            recipientId = user._id;
        }

        const notification = await Notification.create({
            recipient: recipientId || null,
            recipientRole: recipientRole || null,
            sender: senderId,
            title,
            message,
            type: type || 'info'
        });

        res.status(201).json(notification);
    } catch (error) {
        console.error('Send Notification Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get notifications for the logged-in user
// @route   GET /api/notifications
// @access  Private
const getMyNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const userRole = req.user.role;

        // Fetch direct notifications + Broad casts to role + Broadcasts to 'all'
        const notifications = await Notification.find({
            $or: [
                { recipient: userId },
                { recipientRole: userRole },
                { recipientRole: 'all' }
            ]
        })
            .sort({ createdAt: -1 })
            .populate('sender', 'email name role');

        res.json(notifications);
    } catch (error) {
        console.error('Get Notifications Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get notifications SENT BY the logged-in user
// @route   GET /api/notifications/sent
// @access  Private
const getSentNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const notifications = await Notification.find({ sender: userId })
            .sort({ createdAt: -1 })
            .populate('recipient', 'email name role');

        res.json(notifications);
    } catch (error) {
        console.error('Get Sent Notifications Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        // Only the recipient can mark as read (Logical flaw for broadcasts, but ok for MVP)
        // For strictness, we check if user is the direct recipient. 
        // Broadcasts generally stay 'unread' in this simple schema or we accept anyone can toggle it? 
        // Actually, you CANNOT update a single broadcast record for everyone. 
        // So this only works for direct messages.
        if (notification.recipient && notification.recipient.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        notification.isRead = true;
        await notification.save();

        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    sendNotification,
    getMyNotifications,
    getSentNotifications,
    markAsRead
};
