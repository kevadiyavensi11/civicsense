const express = require('express');
const router = express.Router();
const validate = require('../utils/routeValidator');
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'profiles',
        allowed_formats: ['jpg', 'png', 'jpeg']
    }
});
const upload = multer({ storage: storage });

// Register
router.post('/', validate(userController.registerUser, 'registerUser'));
router.post('/login', validate(userController.loginUser, 'loginUser'));
router.post('/profile/photo', protect, upload.single('photo'), userController.uploadProfilePhoto);

// Social Login
router.post('/google-login', validate(userController.googleLogin, 'googleLogin'));
router.post('/github-login', validate(userController.githubLogin, 'githubLogin'));

// Forgot Password
router.post('/forgot-password', validate(userController.forgotPassword, 'forgotPassword'));
router.post('/verify-otp', validate(userController.verifyOtp, 'verifyOtp'));
router.post('/reset-password', validate(userController.resetPassword, 'resetPassword'));

// Profile Management
router.get('/profile', protect, validate(userController.getUserProfile, 'getUserProfile'));
router.put('/profile', protect, validate(userController.updateProfile, 'updateProfile'));
router.put('/change-password', protect, validate(userController.changePassword, 'changePassword'));
router.put('/settings', protect, validate(userController.updateUserSettings, 'updateUserSettings'));

// Admin Routes (Protect + Authorize Admin)
router.get('/', protect, authorize('admin'), validate(userController.getAllUsers, 'getAllUsers'));
router.delete('/:id', protect, authorize('admin'), validate(userController.deleteUser, 'deleteUser'));
router.put('/:id', protect, authorize('admin'), validate(userController.updateUser, 'updateUser'));

module.exports = router;
