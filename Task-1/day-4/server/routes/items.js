const express = require('express');
const router = express.Router();
const db = require('../utils/db');

const DEFAULT_USER_ID = 'default-user';

router.get('/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const items = db.items.find(i => i.userId === DEFAULT_USER_ID && !i.isTrash && !i.isArchived)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);

    // Simulate populate
    items.forEach(item => {
      if (item.folderId) {
        const folder = db.folders.findOne(f => f._id === item.folderId);
        if (folder) item.folder = { name: folder.name, isPinned: folder.isPinned };
      }
    });

    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { type, folderId, category, search } = req.query;

    let items = db.items.find(i => i.userId === DEFAULT_USER_ID && !i.isTrash && !i.isArchived);

    if (type) items = items.filter(i => i.type === type);
    if (category) items = items.filter(i => i.category === category);
    if (folderId) items = items.filter(i => i.folderId === folderId);

    if (search) {
      const searchLower = search.toLowerCase();
      items = items.filter(i =>
        (i.title && i.title.toLowerCase().includes(searchLower)) ||
        (i.content && i.content.toLowerCase().includes(searchLower))
      );
    }

    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const groupedItems = {
      all: items,
      byType: {},
      byCategory: {}
    };

    items.forEach(item => {
      if (!groupedItems.byType[item.type]) groupedItems.byType[item.type] = [];
      groupedItems.byType[item.type].push(item);

      if (!groupedItems.byCategory[item.category]) groupedItems.byCategory[item.category] = [];
      groupedItems.byCategory[item.category].push(item);
    });

    res.json({ success: true, data: items, grouped: groupedItems, count: items.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const items = db.items.find(i => i.userId === DEFAULT_USER_ID && !i.isTrash && !i.isArchived);

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
    const { id } = req.params;

    const item = db.items.findOne(i => i._id === id && i.userId === DEFAULT_USER_ID);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (item.folderId) {
      const folder = db.folders.findOne(f => f._id === item.folderId);
      if (folder) item.folder = { name: folder.name, isPinned: folder.isPinned };
    }

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
