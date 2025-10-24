const express = require('express');
const router = express.Router();
const {
  getProfile,
  getStats,
  getApprovals,
  getActivities,
  updateApproval
} = require('../controllers/managementController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and only for management
router.use(protect);
router.use(authorize('management'));

router.get('/profile', getProfile);
router.get('/stats', getStats);
router.get('/approvals', getApprovals);
router.get('/activities', getActivities);
router.put('/approvals/:id', updateApproval);

module.exports = router;
