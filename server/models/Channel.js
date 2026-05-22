const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Channel name is required'],
    unique: true,
    trim: true,
    maxlength: [30, 'Channel name must be at most 30 characters'],
  },
  description: {
    type: String,
    default: '',
    maxlength: [200, 'Description must be at most 200 characters'],
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Channel', channelSchema);
