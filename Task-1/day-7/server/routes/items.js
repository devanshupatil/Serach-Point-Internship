const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, category, title, content, description, folderId, metadata, reminder } = req.body;

    if (!type || !category || !content) {
      return res.status(400).json({ success: false, message: 'Type, category, and content are required' });
    }

    const item = db.items.create({
      userId,
      type,
      category,
      title: title || '',
      content,
      description: description || '',
      folderId: folderId || null,
      metadata,
      reminder: reminder || null,
      isStarred: false,
      isArchived: false,
      isTrash: false
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/recent', async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 20;
    
    const items = db.items.find(i => i.userId === userId && !i.isTrash && !i.isArchived)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
    
    // Simulate populate
    items.forEach(item => {
      if (item.folderId) {
        item.folderId = db.folders.findOne(f => f._id === item.folderId);
      }
    });
    
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/reminders', async (req, res) => {
  try {
    const userId = req.user.id;
    
    const items = db.items.find(i => i.userId === userId && !i.isTrash && i.reminder)
      .sort((a, b) => new Date(a.reminder) - new Date(b.reminder));
    
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, folderId, category, archived, page = 1, limit = 50 } = req.query;
    
    let items = db.items.find(i => i.userId === userId && !i.isTrash);
    
    if (archived === 'true') {
      items = items.filter(i => i.isArchived);
    } else {
      items = items.filter(i => !i.isArchived);
    }
    
    if (type) items = items.filter(i => i.type === type);
    if (category) items = items.filter(i => i.category === category);
    if (folderId) items = items.filter(i => i.folderId === folderId);
    
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const total = items.length;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedItems = items.slice(skip, skip + parseInt(limit));
    
    paginatedItems.forEach(item => {
      if (item.folderId) {
        item.folderId = db.folders.findOne(f => f._id === item.folderId);
      }
    });
    
    res.json({ 
      success: true, 
      data: paginatedItems, 
      count: paginatedItems.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/starred', async (req, res) => {
  try {
    const userId = req.user.id;
    
    const items = db.items.find(i => i.userId === userId && i.isStarred && !i.isTrash && !i.isArchived)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/trash', async (req, res) => {
  try {
    const userId = req.user.id;
    
    const items = db.items.find(i => i.userId === userId && i.isTrash)
      .sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt));
    
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const userId = req.user.id;
    const items = db.items.find(i => i.userId === userId && !i.isTrash && !i.isArchived);
    
    const counts = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});
    
    const autoCategories = [
      { name: 'Images', type: 'image', view: 'grid', count: counts['Images'] || 0 },
      { name: 'Documents', type: 'document', view: 'list', count: counts['Documents'] || 0 },
      { name: 'Links', type: 'link', view: 'preview', count: counts['Links'] || 0 },
      { name: 'Videos', type: 'video', view: 'embedded', count: counts['Videos'] || 0 },
      { name: 'Notes', type: 'note', view: 'list', count: counts['Notes'] || 0 }
    ];
    
    res.json({ success: true, data: autoCategories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const item = db.items.findOne(i => i._id === id && i.userId === userId);
    
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    
    if (item.folderId) {
      item.folderId = db.folders.findOne(f => f._id === item.folderId);
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
    const updateData = req.body;
    
    const item = db.items.findOne(i => i._id === id && i.userId === userId);
    
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    
    if (updateData.isTrash === true) {
      updateData.deletedAt = new Date();
    } else if (updateData.isTrash === false) {
      updateData.deletedAt = null;
    }
    
    const updatedItem = db.items.findOneAndUpdate(i => i._id === id, updateData);
    
    res.json({ success: true, data: updatedItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/:id/reminder', async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { reminder } = req.body;
    
    const updatedItem = db.items.findOneAndUpdate(i => i._id === id && i.userId === userId, { reminder: reminder || null });
    
    if (!updatedItem) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    
    res.json({ success: true, data: updatedItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/:id/archive', async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { isArchived } = req.body;
    
    const updatedItem = db.items.findOneAndUpdate(i => i._id === id && i.userId === userId, { isArchived: isArchived !== undefined ? isArchived : true });
    
    if (!updatedItem) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    
    res.json({ success: true, data: updatedItem });
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
      const deleted = db.items.findOneAndDelete(i => i._id === id && i.userId === userId);
      if (!deleted) return res.status(404).json({ success: false, message: 'Item not found' });
      return res.json({ success: true, message: 'Item permanently deleted' });
    }
    
    const updatedItem = db.items.findOneAndUpdate(i => i._id === id && i.userId === userId, { isTrash: true, deletedAt: new Date() });
    
    if (!updatedItem) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    
    res.json({ success: true, message: 'Item moved to trash' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/:id/restore', async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const updatedItem = db.items.findOneAndUpdate(i => i._id === id && i.userId === userId, { isTrash: false, deletedAt: null });
    
    if (!updatedItem) {
      return res.status(404).json({ success: false, message: 'Item not found in trash' });
    }
    
    res.json({ success: true, data: updatedItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/trash/empty', async (req, res) => {
  try {
    const userId = req.user.id;
    db.items.deleteMany(i => i.userId === userId && i.isTrash);
    res.json({ success: true, message: 'Trash emptied' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
