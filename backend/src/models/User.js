const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for OAuth users
    phone: { type: String },
    role: {
        type: String,
        enum: ['citizen', 'authority', 'admin'],
        default: 'citizen'
    },
    photoUrl: { type: String },
    area: { type: String }, // specific sub-area (optional)
    // Authority Routing Fields
    state: { type: String },
    city: { type: String },
    zone: { type: String }, // e.g. "West Zone"
    isActive: { type: Boolean, default: true },
    googleId: { type: String, unique: true, sparse: true },
    githubId: { type: String, unique: true, sparse: true },
    otp: { type: String },
    otpExpires: { type: Date },

    // Preferences
    themePreference: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light'
    },
    emailNotificationPreference: {
        type: String,
        enum: ['all', 'assigned', 'high_priority', 'none'],
        default: 'all'
    },
    languagePreference: {
        type: String,
        enum: ['en', 'hi'],
        default: 'en'
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
