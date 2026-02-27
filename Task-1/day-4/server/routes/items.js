const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/recent', async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 20;
    
    const items = await Item.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('folderId', 'name isPinned');
    
    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, folderId, category, search } = req.query;
    
    const query = { userId };
    
    if (type) {
      query.type = type;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (folderId) {
      query.folderId = folderId;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    const items = await Item.find(query)
      .sort({ createdAt: -1 })
      .populate('folderId', 'name isPinned');
    
    const groupedItems = {
      all: items,
      byType: {},
      byCategory: {}
    };
    
    items.forEach(item => {
      if (!groupedItems.byType[item.type]) {
        groupedItems.byType[item.type] = [];
      }
      groupedItems.byType[item.type].push(item);
      
      if (!groupedItems.byCategory[item.category]) {
        groupedItems.byCategory[item.category] = [];
      }
      groupedItems.byCategory[item.category].push(item);
    });
    
    res.json({
      success: true,
      data: items,
      grouped: groupedItems,
      count: items.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const userId = req.user.id;
    
    const categories = await Item.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          items: { $push: '$$ROOT' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    const autoCategories = [
      { name: 'Images', type: 'image', view: 'grid', count: 0 },
      { name: 'Documents', type: 'document', view: 'list', count: 0 },
      { name: 'Links', type: 'link', view: 'preview', count: 0 },
      { name: 'Videos', type: 'video', view: 'embedded', count: 0 },
      { name: 'Notes', type: 'note', view: 'list', count: 0 }
    ];
    
    for (const cat of categories) {
      const autoCat = autoCategories.find(ac => ac.name === cat._id);
      if (autoCat) {
        autoCat.count = cat.count;
        autoCat.items = cat.items.slice(0, 10);
      }
    }
    
    res.json({
      success: true,
      data: autoCategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const item = await Item.findOne({ _id: id, userId })
      .populate('folderId', 'name isPinned');
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
