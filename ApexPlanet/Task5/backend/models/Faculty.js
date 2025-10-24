const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  designation: {
    type: String,
    required: true,
    enum: ['professor', 'associate', 'assistant', 'lecturer']
  },
  qualification: {
    type: String,
    required: true,
    enum: ['phd', 'mtech', 'msc', 'mba']
  },
  courses: [{
    courseId: String,
    courseName: String,
    courseCode: String,
    students: Number,
    section: String
  }],
  schedule: [{
    day: String,
    time: String,
    course: String,
    room: String
  }],
  pendingTasks: [{
    task: String,
    deadline: String,
    priority: String
  }]
});

module.exports = mongoose.model('Faculty', facultySchema);
