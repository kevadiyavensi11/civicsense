const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');

// @desc    Upload file to Cloudinary
// @route   POST /api/upload
// @access  Public (or Private depending on needs, kept Public for generic usage)
router.post('/', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({ url: req.file.path });
});

module.exports = router;
