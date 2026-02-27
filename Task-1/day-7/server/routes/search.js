const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { q, type, limit = 20 } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.json({ success: true, data: { items: [], folders: [], total: 0 } });
    }
    
    const queryStr = q.trim().toLowerCase();
    const searchLimit = parseInt(limit);
    
    let items = db.items.find(i => 
      i.userId === userId && 
      !i.isTrash && 
      !i.isArchived &&
      (
        i.title.toLowerCase().includes(queryStr) || 
        i.content.toLowerCase().includes(queryStr) || 
        i.description.toLowerCase().includes(queryStr)
      )
    );
    
    if (type) items = items.filter(i => i.type === type);
    
    const folders = db.folders.find(f => 
      f.userId === userId && 
      f.name.toLowerCase().includes(queryStr)
    ).slice(0, 10);
    
    const limitedItems = items.slice(0, searchLimit);
    
    limitedItems.forEach(item => {
      if (item.folderId) {
        item.folderId = db.folders.findOne(f => f._id === item.folderId);
      }
    });
    
    res.json({
      success: true,
      data: {
        items: limitedItems,
        folders,
        total: items.length + folders.length,
        query: q
      }
    });
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
    
    const queryStr = q.trim().toLowerCase();
    
    const items = db.items.find(i => 
      i.userId === userId && 
      !i.isTrash && 
      !i.isArchived &&
      (i.title.toLowerCase().includes(queryStr) || i.content.toLowerCase().includes(queryStr))
    ).slice(0, parseInt(limit));
    
    const folders = db.folders.find(f => 
      f.userId === userId && 
      f.name.toLowerCase().includes(queryStr)
    ).slice(0, parseInt(limit));
    
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
