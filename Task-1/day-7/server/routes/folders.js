const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const folders = db.folders.find(f => f.userId === userId);
    
    // Simulate itemCount
    folders.forEach(folder => {
      folder.itemCount = db.items.find(i => i.folderId === folder._id && !i.isTrash).length;
    });
    
    const pinned = folders.filter(f => f.isPinned);
    const recent = folders.filter(f => !f.isPinned).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    
    res.json({ success: true, data: { pinned, recent } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;
    
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });
    
    const folder = db.folders.create({
      userId,
      name,
      isPinned: false
    });
    
    res.status(201).json({ success: true, data: folder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const folder = db.folders.findOne(f => f._id === req.params.id && f.userId === userId);
    if (!folder) return res.status(404).json({ success: false, message: 'Folder not found' });
    res.json({ success: true, data: folder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedFolder = db.folders.findOneAndUpdate(f => f._id === req.params.id && f.userId === userId, req.body);
    if (!updatedFolder) return res.status(404).json({ success: false, message: 'Folder not found' });
    res.json({ success: true, data: updatedFolder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id/pin', async (req, res) => {
  try {
    const userId = req.user.id;
    const folder = db.folders.findOne(f => f._id === req.params.id && f.userId === userId);
    if (!folder) return res.status(404).json({ success: false, message: 'Folder not found' });
    
    const updatedFolder = db.folders.findOneAndUpdate(f => f._id === req.params.id, { isPinned: !folder.isPinned });
    res.json({ success: true, data: updatedFolder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const { moveItems } = req.body;
    
    const folder = db.folders.findOne(f => f._id === req.params.id && f.userId === userId);
    if (!folder) return res.status(404).json({ success: false, message: 'Folder not found' });
    
    db.folders.findOneAndDelete(f => f._id === req.params.id);
    
    if (!moveItems) {
      db.items.find(i => i.folderId === req.params.id).forEach(item => {
        db.items.findOneAndUpdate(i => i._id === item._id, { isTrash: true, deletedAt: new Date() });
      });
    } else {
      db.items.find(i => i.folderId === req.params.id).forEach(item => {
        db.items.findOneAndUpdate(i => i._id === item._id, { folderId: null });
      });
    }
    
    res.json({ success: true, message: 'Folder deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
