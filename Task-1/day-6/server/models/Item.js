const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
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
    default: '',
    index: 'text'
  },
  content: {
    type: String,
    required: true,
    index: 'text'
  },
  description: {
    type: String,
    default: ''
  },
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null,
    index: true
  },
  isStarred: {
    type: Boolean,
    default: false,
    index: true
  },
  isArchived: {
    type: Boolean,
    default: false,
    index: true
  },
  isTrash: {
    type: Boolean,
    default: false,
    index: true
  },
  deletedAt: {
    type: Date,
    default: null
  },
  metadata: {
    thumbnail: String,
    size: Number,
    mimeType: String,
    url: String,
    tags: [String]
  },
  cachedUrl: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

itemSchema.index({ title: 'text', content: 'text', description: 'text' });
itemSchema.index({ userId: 1, isTrash: 1, createdAt: -1 });
itemSchema.index({ userId: 1, isStarred: 1 });

itemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Item', itemSchema);
