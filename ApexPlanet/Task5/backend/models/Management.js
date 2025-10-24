const mongoose = require('mongoose');

const managementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['dean', 'hod', 'registrar', 'admin', 'accountant']
  },
  permissions: [{
    type: String
  }],
  recentActivities: [{
    title: String,
    date: String,
    type: String
  }],
  pendingApprovals: [{
    item: String,
    department: String,
    priority: String,
    status: {
      type: String,
      default: 'pending'
    }
  }]
});

module.exports = mongoose.model('Management', managementSchema);
