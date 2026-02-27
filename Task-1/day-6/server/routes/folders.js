const express = require('express');
const router = express.Router();
const Folder = require('../models/Folder');
const Item = require('../models/Item');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    
    const folders = await Folder.find({ userId, isArchived: false })
      .sort({ isPinned: -1, updatedAt: -1 })
      .lean();
    
    const foldersWithCount = await Promise.all(folders.map(async (folder) => {
      const itemCount = await Item.countDocuments({ userId, folderId: folder._id, isTrash: false });
      return { ...folder, itemCount };
    }));
    
    const pinned = foldersWithCount.filter(f => f.isPinned);
    const recent = foldersWithCount.filter(f => !f.isPinned);
    
    res.json({
      success: true,
      data: {
        all: foldersWithCount,
        pinned,
        recent,
        count: foldersWithCount.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, isPinned } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, message: 'Folder name is required' });
    }
    
    const folder = new Folder({
      userId,
      name,
      isPinned: isPinned || false
    });
    
    await folder.save();
    
    res.status(201).json({ success: true, data: folder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const folder = await Folder.findOne({ _id: id, userId }).lean();
    
    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }
    
    const itemCount = await Item.countDocuments({ userId, folderId: id, isTrash: false });
    
    res.json({ success: true, data: { ...folder, itemCount } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, isPinned, isArchived } = req.body;
    
    const folder = await Folder.findOne({ _id: id, userId });
    
    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }
    
    if (name !== undefined) folder.name = name;
    if (isPinned !== undefined) folder.isPinned = isPinned;
    if (isArchived !== undefined) folder.isArchived = isArchived;
    
    await folder.save();
    
    res.json({ success: true, data: folder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { moveItems } = req.body;
    
    const folder = await Folder.findOne({ _id: id, userId });
    
    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }
    
    const itemCount = await Item.countDocuments({ userId, folderId: id, isTrash: false });
    
    if (itemCount > 0 && !moveItems) {
      return res.status(400).json({ 
        success: false, 
        message: `Folder contains ${itemCount} items. Use moveItems=true to move items to root or they will be deleted.`,
        itemCount
      });
    }
    
    if (moveItems) {
      await Item.updateMany({ userId, folderId: id }, { folderId: null });
    } else {
      await Item.deleteMany({ userId, folderId: id });
    }
    
    await Folder.findByIdAndDelete(id);
    
    res.json({ success: true, message: 'Folder deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id/pin', async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const folder = await Folder.findOne({ _id: id, userId });
    
    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }
    
    folder.isPinned = !folder.isPinned;
    await folder.save();
    
    res.json({ success: true, data: folder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
