const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../db.json');

// Initial structure
const initialData = {
  users: [],
  items: [],
  folders: []
};

const readDB = () => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading DB file:', error);
    return initialData;
  }
};

const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing to DB file:', error);
    return false;
  }
};

const db = {
  // Users
  users: {
    find: (predicate) => readDB().users.filter(predicate),
    findOne: (predicate) => readDB().users.find(predicate),
    create: (userData) => {
      const data = readDB();
      const newUser = { ...userData, _id: Date.now().toString() };
      data.users.push(newUser);
      writeDB(data);
      return newUser;
    }
  },
  // Items
  items: {
    find: (predicate) => readDB().items.filter(predicate),
    findOne: (predicate) => readDB().items.find(predicate),
    create: (itemData) => {
      const data = readDB();
      const newItem = { ...itemData, _id: Date.now().toString(), createdAt: new Date(), updatedAt: new Date() };
      data.items.push(newItem);
      writeDB(data);
      return newItem;
    },
    findOneAndUpdate: (predicate, update) => {
      const data = readDB();
      const index = data.items.findIndex(predicate);
      if (index !== -1) {
        data.items[index] = { ...data.items[index], ...update, updatedAt: new Date() };
        writeDB(data);
        return data.items[index];
      }
      return null;
    },
    findOneAndDelete: (predicate) => {
      const data = readDB();
      const index = data.items.findIndex(predicate);
      if (index !== -1) {
        const deleted = data.items.splice(index, 1);
        writeDB(data);
        return deleted[0];
      }
      return null;
    },
    deleteMany: (predicate) => {
      const data = readDB();
      const initialCount = data.items.length;
      data.items = data.items.filter(item => !predicate(item));
      writeDB(data);
      return { deletedCount: initialCount - data.items.length };
    }
  },
  // Folders
  folders: {
    find: (predicate) => readDB().folders.filter(predicate),
    findOne: (predicate) => readDB().folders.find(predicate),
    create: (folderData) => {
      const data = readDB();
      const newFolder = { ...folderData, _id: Date.now().toString(), createdAt: new Date(), updatedAt: new Date() };
      data.folders.push(newFolder);
      writeDB(data);
      return newFolder;
    },
    findOneAndUpdate: (predicate, update) => {
      const data = readDB();
      const index = data.folders.findIndex(predicate);
      if (index !== -1) {
        data.folders[index] = { ...data.folders[index], ...update, updatedAt: new Date() };
        writeDB(data);
        return data.folders[index];
      }
      return null;
    },
    findOneAndDelete: (predicate) => {
      const data = readDB();
      const index = data.folders.findIndex(predicate);
      if (index !== -1) {
        const deleted = data.folders.splice(index, 1);
        writeDB(data);
        return deleted[0];
      }
      return null;
    }
  }
};

module.exports = db;
