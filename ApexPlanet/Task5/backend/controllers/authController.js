const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Management = require('../models/Management');
const RegistrationCode = require('../models/RegistrationCode');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { userId, password } = req.body;

    // Find user
    const user = await User.findOne({ userId });

    if (user && (await user.matchPassword(password))) {
      // Get role-specific data
      let roleData = null;
      if (user.userType === 'student') {
        roleData = await Student.findOne({ user: user._id });
      } else if (user.userType === 'faculty') {
        roleData = await Faculty.findOne({ user: user._id });
      } else if (user.userType === 'management') {
        roleData = await Management.findOne({ user: user._id });
      }

      res.json({
        success: true,
        user: {
          id: user._id,
          userId: user.userId,
          name: user.fullName,
          email: user.email,
          userType: user.userType,
          department: user.department
        },
        roleData,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify registration code
// @route   POST /api/auth/verify-code
// @access  Public
exports.verifyCode = async (req, res) => {
  try {
    const { code } = req.body;

    const registrationCode = await RegistrationCode.findOne({ 
      code: code.toUpperCase(),
      isUsed: false 
    });

    if (!registrationCode) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or already used registration code' 
      });
    }

    // Check if code has expired
    if (registrationCode.expiresAt && registrationCode.expiresAt < new Date()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Registration code has expired' 
      });
    }

    res.json({
      success: true,
      userType: registrationCode.userType
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { 
      registrationCode, 
      userId, 
      password, 
      fullName, 
      email, 
      phone, 
      department,
      userType,
      // Student fields
      program,
      enrollmentYear,
      // Faculty fields
      designation,
      qualification,
      // Management fields
      role
    } = req.body;

    // Verify registration code
    const regCode = await RegistrationCode.findOne({ 
      code: registrationCode.toUpperCase(),
      isUsed: false 
    });

    if (!regCode) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid registration code' 
      });
    }

    // Check if userId or email already exists
    const existingUser = await User.findOne({ $or: [{ userId }, { email }] });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID or email already exists' 
      });
    }

    // Create user
    const user = await User.create({
      userId,
      password,
      fullName,
      email,
      phone,
      department,
      userType: regCode.userType
    });

    // Create role-specific record
    if (regCode.userType === 'student') {
      await Student.create({
        user: user._id,
        program,
        enrollmentYear,
        courses: [],
        grades: [],
        notifications: []
      });
    } else if (regCode.userType === 'faculty') {
      await Faculty.create({
        user: user._id,
        designation,
        qualification,
        courses: [],
        schedule: [],
        pendingTasks: []
      });
    } else if (regCode.userType === 'management') {
      await Management.create({
        user: user._id,
        role,
        permissions: [],
        recentActivities: [],
        pendingApprovals: []
      });
    }

    // Mark registration code as used
    regCode.isUsed = true;
    regCode.usedBy = user._id;
    await regCode.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        userId: user.userId,
        name: user.fullName,
        userType: user.userType
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
