const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  program: {
    type: String,
    required: true,
    enum: ['btech', 'mtech', 'mba', 'bsc', 'msc']
  },
  enrollmentYear: {
    type: Number,
    required: true
  },
  cgpa: {
    type: Number,
    default: 0,
    min: 0,
    max: 4
  },
  totalCredits: {
    type: Number,
    default: 0
  },
  courses: [{
    courseId: String,
    courseName: String,
    courseCode: String,
    credits: Number,
    attendance: Number,
    semester: String
  }],
  grades: [{
    course: String,
    code: String,
    grade: String,
    credits: Number,
    semester: String
  }],
  notifications: [{
    title: String,
    date: String,
    type: String,
    read: {
      type: Boolean,
      default: false
    }
  }]
});

module.exports = mongoose.model('Student', studentSchema);
