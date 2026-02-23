const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['image', 'link', 'document', 'note'],
    required: true
  },
  category: {
    type: String,
    enum: ['Images', 'Links', 'Documents', 'Notes'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Item', itemSchema);
