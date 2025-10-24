const Student = require('../models/Student');
const User = require('../models/User');

// @desc    Get student profile
// @route   GET /api/students/profile
// @access  Private (Student only)
exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id }).populate('user', '-password');
    
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get enrolled courses
// @route   GET /api/students/courses
// @access  Private (Student only)
exports.getCourses = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, data: student.courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get grades
// @route   GET /api/students/grades
// @access  Private (Student only)
exports.getGrades = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, data: student.grades });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get notifications
// @route   GET /api/students/notifications
// @access  Private (Student only)
exports.getNotifications = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, data: student.notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/students/notifications/:id/read
// @access  Private (Student only)
exports.markNotificationRead = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const notification = student.notifications.id(req.params.id);
    if (notification) {
      notification.read = true;
      await student.save();
    }

    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
