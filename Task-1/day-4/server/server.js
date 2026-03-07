const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const itemRoutes = require('./routes/items');
const folderRoutes = require('./routes/folders');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/items', itemRoutes);
app.use('/api/folders', folderRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Search Point API - Day 4 READ' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
