const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['image', 'link', 'document', 'video', 'note'],
    required: true
  },
  category: {
    type: String,
    enum: ['Images', 'Links', 'Documents', 'Videos', 'Notes'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null
  },
  metadata: {
    thumbnail: String,
    size: Number,
    mimeType: String,
    url: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

itemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Item', itemSchema);
