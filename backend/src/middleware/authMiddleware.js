const jwt = require('jsonwebtoken');
const { admin, firebaseEnabled } = require('../config/firebase');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // 1. Try Custom JWT (Node.js/Mongoose flow)
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_123');
                req.user = await User.findById(decoded.id).select('-password');

                if (req.user) {
                    return next();
                } else {
                    console.warn('[Auth] Token valid but user does not exist in DB.');
                    return res.status(401).json({ message: 'User not found. Session expired.' });
                }
            } catch (jwtErr) {
                // Not a valid custom JWT, or expired.
                // If it was meant to be a JWT but failed (expired), we might want to stop here.
                // But for compatibility with Firebase, we fall through.
            }

            // 2. Try Firebase (Legacy flow - only if enabled)
            if (firebaseEnabled) {
                try {
                    const decodedToken = await admin.auth().verifyIdToken(token);
                    req.user = await User.findOne({ email: decodedToken.email });
                    if (req.user) return next();
                } catch (firebaseErr) {
                    console.error('Firebase Auth Error:', firebaseErr.message);
                }
            }

            return res.status(401).json({ message: 'Not authorized, token failed' });
        } catch (error) {
            console.error('General Auth Error:', error.message);
            res.status(401).json({ message: 'Authentication error' });
        }
    } else {
        res.status(401).json({ message: 'No authorization token provided.' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated.' });
        }

        if (!roles.includes(req.user.role)) {
            console.warn(`Security Access Denied: User ${req.user.email} with role '${req.user.role}' attempted to access protected resource requiring [${roles.join(', ')}].`);
            return res.status(403).json({
                message: 'Access Denied: You do not have permission to perform this action.',
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
