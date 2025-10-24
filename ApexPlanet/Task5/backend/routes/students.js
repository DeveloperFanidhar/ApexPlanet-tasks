const express = require('express');
const router = express.Router();
const {
  getProfile,
  getCourses,
  getGrades,
  getNotifications,
  markNotificationRead
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and only for students
router.use(protect);
router.use(authorize('student'));

router.get('/profile', getProfile);
router.get('/courses', getCourses);
router.get('/grades', getGrades);
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);

module.exports = router;
