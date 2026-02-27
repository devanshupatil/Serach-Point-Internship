const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const Folder = require('../models/Folder');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { q, type, limit = 20 } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.json({ success: true, data: { items: [], folders: [], total: 0 } });
    }
    
    const searchRegex = new RegExp(q.trim(), 'i');
    const searchLimit = parseInt(limit);
    
    const [items, folders] = await Promise.all([
      Item.find({
        userId,
        isTrash: false,
        $or: [
          { title: searchRegex },
          { content: searchRegex },
          { description: searchRegex },
          { 'metadata.tags': searchRegex }
        ]
      })
        .sort({ createdAt: -1 })
        .limit(searchLimit)
        .populate('folderId', 'name')
        .lean(),
      
      Folder.find({
        userId,
        isArchived: false,
        name: searchRegex
      })
        .sort({ isPinned: -1, updatedAt: -1 })
        .limit(10)
        .lean()
    ]);
    
    const results = {
      items,
      folders,
      total: items.length + folders.length,
      query: q
    };
    
    if (type) {
      results.items = results.items.filter(item => item.type === type);
      results.total = results.items.length + results.folders.length;
    }
    
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/suggestions', async (req, res) => {
  try {
    const userId = req.user.id;
    const { q, limit = 5 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.json({ success: true, data: [] });
    }
    
    const searchRegex = new RegExp(`^${q.trim()}`, 'i');
    
    const [items, folders] = await Promise.all([
      Item.find({
        userId,
        isTrash: false,
        $or: [
          { title: searchRegex },
          { content: searchRegex }
        ]
      })
        .select('title type content')
        .limit(parseInt(limit))
        .lean(),
      
      Folder.find({
        userId,
        isArchived: false,
        name: searchRegex
      })
        .select('name')
        .limit(parseInt(limit))
        .lean()
    ]);
    
    const suggestions = [
      ...folders.map(f => ({ type: 'folder', name: f.name, id: f._id })),
      ...items.map(i => ({ type: 'item', name: i.title || i.content, id: i._id, itemType: i.type }))
    ];
    
    res.json({ success: true, data: suggestions.slice(0, 10) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
