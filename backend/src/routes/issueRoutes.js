const express = require('express');
const router = express.Router();
const validate = require('../utils/routeValidator');
const issueController = require('../controllers/issueController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, validate(issueController.createIssue, 'createIssue'))
    .get(protect, validate(issueController.getIssues, 'getIssues'));

router.route('/bulk')
    .put(protect, authorize('admin', 'authority'), validate(issueController.bulkUpdateIssues, 'bulkUpdateIssues'));

router.route('/:id/assign')
    .put(protect, authorize('admin', 'authority'), issueController.assignIssue)
    .patch(protect, authorize('admin', 'authority'), issueController.assignIssue);

router.get('/geocode', protect, issueController.geocodeLocation);
router.get('/search-location', protect, issueController.searchLocation);

router.route('/:id')
    .get(protect, validate(issueController.getIssueById, 'getIssueById'))
    .delete(protect, authorize('admin'), validate(issueController.deleteIssue, 'deleteIssue'));

router.route('/:id/status')
    .put(protect, authorize('admin', 'authority'), issueController.updateIssueStatus)
    .patch(protect, authorize('admin', 'authority'), issueController.updateIssueStatus);

module.exports = router;
