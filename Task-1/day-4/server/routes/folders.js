const express = require('express');
const router = express.Router();
const db = require('../utils/db');

const DEFAULT_USER_ID = 'default-user';

router.get('/', async (req, res) => {
  try {
    const folders = db.folders.find(f => f.userId === DEFAULT_USER_ID)
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });

    // Add item counts
    folders.forEach(folder => {
      folder.itemCount = db.items.countDocuments(i => i.folderId === folder._id && !i.isTrash);
    });

    const pinned = folders.filter(f => f.isPinned);
    const recent = folders.filter(f => !f.isPinned).slice(0, 10);

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
    const { name, isPinned } = req.body;

    const folder = db.folders.create({
      userId: DEFAULT_USER_ID,
      name,
      isPinned: isPinned || false
    });

    res.status(201).json({ success: true, data: folder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id/pin', async (req, res) => {
  try {
    const { id } = req.params;

    const folder = db.folders.findOne(f => f._id === id && f.userId === DEFAULT_USER_ID);

    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }

    const updatedFolder = db.folders.findOneAndUpdate(f => f._id === id, { isPinned: !folder.isPinned });

    res.json({ success: true, data: updatedFolder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const folder = db.folders.findOneAndDelete(f => f._id === id && f.userId === DEFAULT_USER_ID);

    if (!folder) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }

    res.json({ success: true, message: 'Folder deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
