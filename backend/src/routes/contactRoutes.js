const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
const User = require('../models/User'); // For checking admin role
const jwt = require('jsonwebtoken');

// Middleware to protect routes (Admin Only)
const adminOnly = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admin role required' });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// @desc    Save a new message from citizen
// @route   POST /api/contact/create
// @access  Public
router.post('/create', async (req, res) => {
    try {
        const { name, email, message, subject } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newMessage = await ContactMessage.create({ name, email, message, subject });

        res.status(201).json({
            success: true,
            message: 'Message sent successfully!',
            data: newMessage
        });
    } catch (error) {
        console.error('Create Contact Message Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get all messages (Sorted by newest)
// @route   GET /api/contact/all
// @access  Private (Admin)
router.get('/all', adminOnly, async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Return unread count (for admin notification badge)
// @route   GET /api/contact/unread-count
// @access  Private (Admin)
router.get('/unread-count', adminOnly, async (req, res) => {
    try {
        // Since we don't have a 'read' field in the schema yet, let's just return total for now
        // OR we can just return a fixed number or total messages as "new"
        const count = await ContactMessage.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete a message
// @route   DELETE /api/contact/:id
// @access  Private (Admin)
router.delete('/:id', adminOnly, async (req, res) => {
    try {
        const message = await ContactMessage.findById(req.params.id);
        if (!message) return res.status(404).json({ message: 'Message not found' });

        await message.deleteOne();
        res.json({ message: 'Message removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
