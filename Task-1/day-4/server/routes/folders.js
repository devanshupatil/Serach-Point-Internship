const express = require('express');
const router = express.Router();
const Folder = require('../models/Folder');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    
    const folders = await Folder.find({ userId })
      .sort({ isPinned: -1, updatedAt: -1 });
    
    const pinned = folders.filter(f => f.isPinned);
    const recent = folders.filter(f => !f.isPinned).slice(0, 10);
    
    res.json({
      success: true,
      data: {
        all: folders,
        pinned,
        recent,
        count: folders.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, isPinned } = req.body;
    
    const folder = new Folder({
      userId,
      name,
      isPinned: isPinned || false
    });
    
    await folder.save();
    
    res.status(201).json({
      success: true,
      data: folder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.put('/:id/pin', async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const folder = await Folder.findOne({ _id: id, userId });
    
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found'
      });
    }
    
    folder.isPinned = !folder.isPinned;
    await folder.save();
    
    res.json({
      success: true,
      data: folder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const folder = await Folder.findOneAndDelete({ _id: id, userId });
    
    if (!folder) {
      return res.status(404).json({
        success: false,
        message: 'Folder not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Folder deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
