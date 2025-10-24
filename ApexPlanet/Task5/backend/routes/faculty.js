const express = require('express');
const router = express.Router();
const {
  getProfile,
  getCourses,
  getSchedule,
  getTasks
} = require('../controllers/facultyController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and only for faculty
router.use(protect);
router.use(authorize('faculty'));

router.get('/profile', getProfile);
router.get('/courses', getCourses);
router.get('/schedule', getSchedule);
router.get('/tasks', getTasks);

module.exports = router;
