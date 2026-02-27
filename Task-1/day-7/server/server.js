const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const folderRoutes = require('./routes/folders');
const searchRoutes = require('./routes/search');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/search', searchRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Search Point API - Local File Storage Version' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', storage: 'local-file', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} using Local File Storage`);
});

module.exports = app;
