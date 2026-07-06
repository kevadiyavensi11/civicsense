const express = require('express');
const router = express.Router();
const validate = require('../utils/routeValidator');
const zoneController = require('../controllers/zoneController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(validate(zoneController.getZones, 'getZones'))
    .post(protect, authorize('admin'), validate(zoneController.createZone, 'createZone'));

router.route('/:id/localities')
    .put(protect, authorize('admin'), validate(zoneController.updateZoneLocalities, 'updateZoneLocalities'));

module.exports = router;
