const Faculty = require('../models/Faculty');
const User = require('../models/User');

// @desc    Get faculty profile
// @route   GET /api/faculty/profile
// @access  Private (Faculty only)
exports.getProfile = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ user: req.user.id }).populate('user', '-password');
    
    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    res.json({ success: true, data: faculty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get assigned courses
// @route   GET /api/faculty/courses
// @access  Private (Faculty only)
exports.getCourses = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ user: req.user.id });
    
    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    res.json({ success: true, data: faculty.courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get schedule
// @route   GET /api/faculty/schedule
// @access  Private (Faculty only)
exports.getSchedule = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ user: req.user.id });
    
    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    res.json({ success: true, data: faculty.schedule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get pending tasks
// @route   GET /api/faculty/tasks
// @access  Private (Faculty only)
exports.getTasks = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ user: req.user.id });
    
    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty not found' });
    }

    res.json({ success: true, data: faculty.pendingTasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
