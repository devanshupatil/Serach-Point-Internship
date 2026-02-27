const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const Folder = require('../models/Folder');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, category, title, content, description, folderId, metadata } = req.body;

    if (!type || !category || !content) {
      return res.status(400).json({ success: false, message: 'Type, category, and content are required' });
    }

    const item = new Item({
      userId,
      type,
      category,
      title: title || '',
      content,
      description: description || '',
      folderId: folderId || null,
      metadata
    });

    await item.save();

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/recent', async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 20;
    
    const items = await Item.find({ userId, isTrash: false, isArchived: false })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('folderId', 'name isPinned');
    
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, folderId, category, search, includeTrash, includeArchived } = req.query;
    
    const query = { userId };
    
    if (!includeTrash) query.isTrash = false;
    if (!includeArchived) query.isArchived = false;
    if (type) query.type = type;
    if (category) query.category = category;
    if (folderId) query.folderId = folderId;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    const items = await Item.find(query)
      .sort({ createdAt: -1 })
      .populate('folderId', 'name isPinned');
    
    res.json({ success: true, data: items, count: items.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/starred', async (req, res) => {
  try {
    const userId = req.user.id;
    
    const items = await Item.find({ userId, isStarred: true, isTrash: false })
      .sort({ updatedAt: -1 })
      .populate('folderId', 'name isPinned');
    
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/trash', async (req, res) => {
  try {
    const userId = req.user.id;
    
    const items = await Item.find({ userId, isTrash: true })
      .sort({ deletedAt: -1 })
      .populate('folderId', 'name');
    
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const userId = req.user.id;
    
    const categories = await Item.aggregate([
      { $match: { userId: userId, isTrash: false, isArchived: false } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const autoCategories = [
      { name: 'Images', type: 'image', view: 'grid', count: 0 },
      { name: 'Documents', type: 'document', view: 'list', count: 0 },
      { name: 'Links', type: 'link', view: 'preview', count: 0 },
      { name: 'Videos', type: 'video', view: 'embedded', count: 0 },
      { name: 'Notes', type: 'note', view: 'list', count: 0 }
    ];
    
    categories.forEach(cat => {
      const autoCat = autoCategories.find(ac => ac.name === cat._id);
      if (autoCat) autoCat.count = cat.count;
    });
    
    res.json({ success: true, data: autoCategories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const item = await Item.findOne({ _id: id, userId })
      .populate('folderId', 'name isPinned');
    
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, content, description, folderId, isStarred, isArchived, isTrash, metadata } = req.body;
    
    const item = await Item.findOne({ _id: id, userId });
    
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    
    if (title !== undefined) item.title = title;
    if (content !== undefined) item.content = content;
    if (description !== undefined) item.description = description;
    if (folderId !== undefined) item.folderId = folderId;
    if (isStarred !== undefined) item.isStarred = isStarred;
    if (isArchived !== undefined) item.isArchived = isArchived;
    if (metadata !== undefined) item.metadata = metadata;
    
    if (isTrash !== undefined) {
      item.isTrash = isTrash;
      item.deletedAt = isTrash ? new Date() : null;
    }
    
    await item.save();
    
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { permanent } = req.query;
    
    if (permanent === 'true') {
      const item = await Item.findOneAndDelete({ _id: id, userId });
      
      if (!item) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }
      
      return res.json({ success: true, message: 'Item permanently deleted' });
    }
    
    const item = await Item.findOne({ _id: id, userId });
    
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    
    item.isTrash = true;
    item.deletedAt = new Date();
    await item.save();
    
    res.json({ success: true, message: 'Item moved to trash' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/:id/restore', async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const item = await Item.findOne({ _id: id, userId, isTrash: true });
    
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in trash' });
    }
    
    item.isTrash = false;
    item.deletedAt = null;
    await item.save();
    
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/trash/empty', async (req, res) => {
  try {
    const userId = req.user.id;
    
    await Item.deleteMany({ userId, isTrash: true });
    
    res.json({ success: true, message: 'Trash emptied' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
