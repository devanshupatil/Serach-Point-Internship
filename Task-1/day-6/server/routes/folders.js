const express = require('express');
const router = express.Router();
const db = require('../utils/db');

const DEFAULT_USER_ID = 'default-user';

router.get('/', async (req, res) => {
  try {
    const userId = DEFAULT_USER_ID;

    const folders = db.folders.find(f => f.userId === userId && !f.isArchived)
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });

    folders.forEach(folder => {
      folder.itemCount = db.items.countDocuments(i => i.userId === userId && i.folderId === folder._id && !i.isTrash);
    });

    const pinned = folders.filter(f => f.isPinned);
    const recent = folders.filter(f => !f.isPinned);

    res.json({
      success: true,
      data: { all: folders, pinned, recent, count: folders.length }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const userId = DEFAULT_USER_ID;
    const { name, isPinned } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Folder name is required' });
    }

    const folder = db.folders.create({
      userId,
      name,
      isPinned: isPinned || false,
      isArchived: false
    });

    res.status(201).json({ success: true, data: folder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const userId = DEFAULT_USER_ID;
    const { id } = req.params;

    const folder = db.folders.findOne(f => f._id === id && f.userId === userId);

    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }

    const itemCount = db.items.countDocuments(i => i.userId === userId && i.folderId === id && !i.isTrash);

    res.json({ success: true, data: { ...folder, itemCount } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const userId = DEFAULT_USER_ID;
    const { id } = req.params;
    const { name, isPinned, isArchived } = req.body;

    const folder = db.folders.findOne(f => f._id === id && f.userId === userId);

    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }

    const update = {};
    if (name !== undefined) update.name = name;
    if (isPinned !== undefined) update.isPinned = isPinned;
    if (isArchived !== undefined) update.isArchived = isArchived;

    const updatedFolder = db.folders.findOneAndUpdate(f => f._id === id, update);

    res.json({ success: true, data: updatedFolder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const userId = DEFAULT_USER_ID;
    const { id } = req.params;
    const { moveItems } = req.body;

    const folder = db.folders.findOne(f => f._id === id && f.userId === userId);

    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }

    const itemCount = db.items.countDocuments(i => i.userId === userId && i.folderId === id && !i.isTrash);

    if (itemCount > 0 && !moveItems) {
      return res.status(400).json({
        success: false,
        message: `Folder contains ${itemCount} items. Use moveItems=true to move items to root or they will be deleted.`,
        itemCount
      });
    }

    if (moveItems) {
      db.items.updateMany(i => i.userId === userId && i.folderId === id, { folderId: null });
    } else {
      db.items.deleteMany(i => i.userId === userId && i.folderId === id);
    }

    db.folders.findOneAndDelete(f => f._id === id);

    res.json({ success: true, message: 'Folder deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id/pin', async (req, res) => {
  try {
    const userId = DEFAULT_USER_ID;
    const { id } = req.params;

    const folder = db.folders.findOne(f => f._id === id && f.userId === userId);

    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }

    const updatedFolder = db.folders.findOneAndUpdate(f => f._id === id, { isPinned: !folder.isPinned });

    res.json({ success: true, data: updatedFolder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
