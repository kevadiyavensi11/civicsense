const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null // If null, look at recipientRole
    },
    recipientRole: {
        type: String,
        enum: ['citizen', 'authority', 'admin', 'all'],
        default: null // If null, look at recipient
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['info', 'alert', 'warning', 'success'],
        default: 'info'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
notificationSchema.index({ recipient: 1, recipientRole: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
