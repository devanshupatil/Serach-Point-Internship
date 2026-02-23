const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const JWT_SECRET = 'your-jwt-secret-key-change-in-production';
const users = [
  { id: 'demo-user', email: 'demo@example.com', password: btoa('demo123') }
];
const items = [];
const folders = [];

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};

const authenticate = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const userExists = users.find(u => u.email === email.toLowerCase());
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      password: btoa(password)
    };

    users.push(user);

    const token = generateToken(user.id);
    
    res.status(201).json({
      id: user.id,
      email: user.email,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = users.find(u => u.email === email.toLowerCase());
    
    if (!user || user.password !== btoa(password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    
    res.json({
      id: user.id,
      email: user.email,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/folders', (req, res) => {
  try {
    const decoded = authenticate(req);
    if (!decoded) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { name, type } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Folder name is required' });
    }

    const folder = {
      _id: Date.now().toString(),
      userId: decoded.id,
      name,
      type: type || 'general',
      createdAt: new Date().toISOString()
    };

    folders.push(folder);

    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/folders', (req, res) => {
  try {
    const decoded = authenticate(req);
    if (!decoded) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const userFolders = folders.filter(f => f.userId === decoded.id);
    res.json(userFolders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/items/save', (req, res) => {
  try {
    const decoded = authenticate(req);
    if (!decoded) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { 
      type, 
      category, 
      content,
      name,
      description,
      folderId,
      fileName,
      fileType,
      note
    } = req.body;

    if (!type || !category || !content) {
      return res.status(400).json({ message: 'Please provide type, category, and content' });
    }

    const validTypes = ['image', 'link', 'document', 'note'];
    const validCategories = ['Images', 'Links', 'Documents', 'Notes'];

    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid type' });
    }

    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const item = {
      _id: Date.now().toString(),
      userId: decoded.id,
      type,
      category,
      content,
      name: name || null,
      description: description || null,
      folderId: folderId || null,
      fileName: fileName || null,
      fileType: fileType || null,
      note: note || null,
      createdAt: new Date().toISOString()
    };

    items.push(item);

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/items', (req, res) => {
  try {
    const decoded = authenticate(req);
    if (!decoded) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { folderId } = req.query;
    let userItems = items.filter(item => item.userId === decoded.id);
    
    if (folderId) {
      userItems = userItems.filter(item => item.folderId === folderId);
    }
    
    userItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(userItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
