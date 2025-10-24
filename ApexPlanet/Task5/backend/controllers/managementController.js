const Management = require('../models/Management');
const User = require('../models/User');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

// @desc    Get management profile
// @route   GET /api/management/profile
// @access  Private (Management only)
exports.getProfile = async (req, res) => {
  try {
    const management = await Management.findOne({ user: req.user.id }).populate('user', '-password');
    
    if (!management) {
      return res.status(404).json({ success: false, message: 'Management profile not found' });
    }

    res.json({ success: true, data: management });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get university statistics
// @route   GET /api/management/stats
// @access  Private (Management only)
exports.getStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalFaculty = await Faculty.countDocuments();
    
    // Get department-wise count
    const studentsByDept = await User.aggregate([
      { $match: { userType: 'student' } },
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    res.json({ 
      success: true, 
      data: {
        totalStudents,
        totalFaculty,
        departments: 12,
        activeCourses: 87,
        studentsByDepartment: studentsByDept
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get pending approvals
// @route   GET /api/management/approvals
// @access  Private (Management only)
exports.getApprovals = async (req, res) => {
  try {
    const management = await Management.findOne({ user: req.user.id });
    
    if (!management) {
      return res.status(404).json({ success: false, message: 'Management profile not found' });
    }

    res.json({ success: true, data: management.pendingApprovals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get recent activities
// @route   GET /api/management/activities
// @access  Private (Management only)
exports.getActivities = async (req, res) => {
  try {
    const management = await Management.findOne({ user: req.user.id });
    
    if (!management) {
      return res.status(404).json({ success: false, message: 'Management profile not found' });
    }

    res.json({ success: true, data: management.recentActivities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve/reject item
// @route   PUT /api/management/approvals/:id
// @access  Private (Management only)
exports.updateApproval = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    
    const management = await Management.findOne({ user: req.user.id });
    
    if (!management) {
      return res.status(404).json({ success: false, message: 'Management profile not found' });
    }

    const approval = management.pendingApprovals.id(req.params.id);
    if (approval) {
      approval.status = status;
      await management.save();
    }

    res.json({ success: true, message: `Item ${status}`, data: approval });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
