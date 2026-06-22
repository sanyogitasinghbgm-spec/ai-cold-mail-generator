const mongoose = require('mongoose');

const emailHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  prompt: {
    type: String,
    required: [true, 'Prompt is required'],
    trim: true,
  },
  tone: {
    type: String,
    default: 'Professional',
  },
  targetAudience: {
    type: String,
    default: 'General',
  },
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  linkedinDm: {
    type: String,
    required: true,
  },
  followUp: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('EmailHistory', emailHistorySchema);
