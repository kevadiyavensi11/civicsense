const express = require('express');
const router = express.Router();
const validate = require('../utils/routeValidator');
const areaController = require('../controllers/areaController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('admin', 'authority'), validate(areaController.createArea, 'createArea'))
    .get(protect, validate(areaController.getAreas, 'getAreas'));

router.post('/resolve', validate(areaController.resolveArea, 'resolveArea'));

module.exports = router;
