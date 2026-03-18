# KeepBox — Full 8-Day Build Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build KeepBox — an Android-first save-anything app with auto-capture, CRUD, search, reminders, archive, trash, and settings — across 8 daily modules, each independently runnable.

**Architecture:** Fully client-side. No backend server. All data persists in **browser `localStorage`**. Each day is a standalone React + Vite app that reads/writes through a shared `storage.js` service layer. No `db.json`, no Express, no API calls.

**Tech Stack:** React 18 · Vite · React Router v6 · Tailwind CSS 3 · Browser localStorage · Capacitor (Android) · TypeScript (Day 8)

---

## Current Status (as of 2026-03-18)

| Day | Module | Status |
|-----|--------|--------|
| 1 | Auth + Foundation | Scaffold exists — replace API calls with localStorage |
| 2 | Share Intent + Auto Save | Scaffold exists — replace server save with localStorage |
| 3 | Manual Add + Create | Scaffold exists — replace server save with localStorage |
| 4 | Home + Categories + Read | Scaffold exists — replace API reads with localStorage |
| 5 | Update + Delete (CRUD) | Scaffold exists — replace PATCH/DELETE with localStorage |
| 6 | Search + Offline + Performance | Scaffold exists — search runs on localStorage data |
| 7 | Reminders + Archive | Missing pages — build with localStorage |
| 8 | Trash + Settings + Help & Feedback | Frontend exists — wire to localStorage, delete server folder |

---

## localStorage Schema (used across all days)

```js
// Keys
'keepbox_items'    → Item[]
'keepbox_folders'  → Folder[]
'keepbox_settings' → Settings
'keepbox_feedback' → Feedback[]
'keepbox_user'     → User  (Day 1 only)

// Item shape
{
  id: string,           // crypto.randomUUID()
  type: 'link' | 'image' | 'document' | 'video' | 'note',
  category: 'Links' | 'Images' | 'Documents' | 'Videos' | 'Notes',
  title: string,
  content: string,
  description: string,
  folderId: string | null,
  autoCategory: string,
  metadata: { thumbnail, size, mimeType, url },
  starred: boolean,
  archived: boolean,
  deleted: boolean,
  reminder: { date: string, time: string } | null,
  createdAt: string,    // ISO
  updatedAt: string
}

// Folder shape
{ id: string, name: string, createdAt: string }

// Settings shape
{ theme: 'light' | 'dark', notifications: boolean, reminderToggle: boolean }
```

---

## Shared Storage Service (used in every day)

Every day's client has `src/services/storage.js`. This is the **only** file that touches `localStorage`. All components call this, never `localStorage` directly.

```js
// src/services/storage.js

const KEYS = {
  ITEMS: 'keepbox_items',
  FOLDERS: 'keepbox_folders',
  SETTINGS: 'keepbox_settings',
  FEEDBACK: 'keepbox_feedback',
};

// --- helpers ---
const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};
const write = (key, val) => localStorage.setItem(key, JSON.stringify(val));

// --- items ---
export const getItems = ()          => read(KEYS.ITEMS, []);
export const saveItems = (items)    => write(KEYS.ITEMS, items);

export const addItem = (item) => {
  const items = getItems();
  const newItem = {
    id: crypto.randomUUID(),
    starred: false, archived: false, deleted: false,
    reminder: null, description: '', folderId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...item,
  };
  saveItems([newItem, ...items]);
  return newItem;
};

export const updateItem = (id, patch) => {
  const items = getItems().map(i =>
    i.id === id ? { ...i, ...patch, updatedAt: new Date().toISOString() } : i
  );
  saveItems(items);
  return items.find(i => i.id === id);
};

export const deleteItem = (id) => updateItem(id, { deleted: true });

// --- folders ---
export const getFolders = ()        => read(KEYS.FOLDERS, [{ id: 'default', name: 'General', createdAt: new Date().toISOString() }]);
export const saveFolders = (f)      => write(KEYS.FOLDERS, f);

export const addFolder = (name) => {
  const folders = getFolders();
  const folder = { id: crypto.randomUUID(), name, createdAt: new Date().toISOString() };
  saveFolders([...folders, folder]);
  return folder;
};

export const updateFolder = (id, patch) => {
  const folders = getFolders().map(f => f.id === id ? { ...f, ...patch } : f);
  saveFolders(folders);
};

export const deleteFolder = (id) => saveFolders(getFolders().filter(f => f.id !== id));

// --- settings ---
export const getSettings = () => read(KEYS.SETTINGS, { theme: 'light', notifications: true, reminderToggle: true });
export const updateSettings = (patch) => write(KEYS.SETTINGS, { ...getSettings(), ...patch });

// --- feedback ---
export const addFeedback = (entry) => {
  const list = read(KEYS.FEEDBACK, []);
  write(KEYS.FEEDBACK, [...list, { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...entry }]);
};
```

---

## File Structure Map

```
Task-1/
├── day-1/client/src/
│   ├── App.jsx                           # Routes: /, /login, /signup
│   ├── pages/Login.jsx                   # Writes keepbox_user to localStorage
│   ├── pages/Signup.jsx                  # Writes keepbox_user to localStorage
│   ├── pages/Home.jsx                    # Reads keepbox_user — protected
│   ├── components/AuthCard.jsx
│   ├── components/InputField.jsx
│   ├── components/ProtectedRoute.jsx     # Checks localStorage for user
│   ├── context/AuthContext.jsx           # Reads/writes keepbox_user
│   └── services/storage.js              # ← localStorage service (all days)
│
├── day-2/client/src/
│   ├── pages/SharePage.jsx               # Calls storage.addItem()
│   ├── components/ShareHandler.jsx       # Detects type, calls addItem
│   ├── components/Toast.jsx
│   └── services/storage.js
│   (NO server/ folder needed)
│
├── day-3/client/src/
│   ├── pages/Home.jsx                    # FAB opens AddItemModal
│   ├── components/AddItemModal.jsx       # Calls addItem() + addFolder()
│   └── services/storage.js
│   (NO server/ folder needed)
│
├── day-4/client/src/
│   ├── pages/Home.jsx                    # Reads getItems(), getFolders()
│   ├── pages/CategoryView.jsx            # Filters items by type
│   └── services/storage.js
│   (NO server/ folder needed)
│
├── day-5/client/src/
│   ├── pages/Home.jsx
│   ├── components/ItemCard.jsx           # Long-press → action sheet
│   ├── components/EditModal.jsx          # Calls updateItem()
│   └── services/storage.js
│   (NO server/ folder needed)
│
├── day-6/client/src/
│   ├── pages/SearchPage.jsx              # Filters getItems() by keyword
│   ├── pages/TrashPage.jsx               # Filters items where deleted=true
│   ├── components/ErrorBoundary.jsx
│   ├── components/Skeletons.jsx
│   ├── hooks/useSearch.js                # Debounced filter over localStorage
│   └── services/storage.js
│   (NO server/ folder needed)
│
├── day-7/client/src/
│   ├── pages/ArchivePage.jsx             # CREATE — filters archived=true
│   ├── pages/ReminderPage.jsx            # CREATE — filters reminder != null
│   ├── components/ReminderModal.jsx      # CREATE — date+time picker
│   └── services/storage.js
│   (NO server/ folder needed)
│
└── day-8/src/
    ├── App.tsx                           # Routes: /trash, /settings, /help
    ├── components/Trash.tsx              # Reads deleted items, restore/perm-delete
    ├── components/Settings.tsx           # Reads/writes keepbox_settings
    ├── components/HelpFeedback.tsx       # Writes to keepbox_feedback
    └── services/storage.ts              # TypeScript version of storage.js
    (NO server/ folder)
```

---

## Task 1: Day 1 — Auth + Foundation

> **Note:** Auth backend was removed (commit `479a293`). Day 1 is UI-only. User "session" is stored in `localStorage` as `keepbox_user`.

**Files:**
- Modify: `Task-1/day-1/client/src/context/AuthContext.jsx`
- Modify: `Task-1/day-1/client/src/pages/Login.jsx`
- Modify: `Task-1/day-1/client/src/pages/Signup.jsx`
- Modify: `Task-1/day-1/client/src/components/ProtectedRoute.jsx`
- Create: `Task-1/day-1/client/src/services/storage.js`

- [ ] **Step 1: Create storage.js (copy the shared service from above)**

Create `Task-1/day-1/client/src/services/storage.js` with the full shared storage service listed in the "Shared Storage Service" section above.

- [ ] **Step 2: Update AuthContext to use localStorage**

`Task-1/day-1/client/src/context/AuthContext.jsx` must read/write `keepbox_user`:

```jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('keepbox_user')); }
    catch { return null; }
  });

  const login = (userData) => {
    localStorage.setItem('keepbox_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('keepbox_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

- [ ] **Step 3: Update Login.jsx to call auth.login() with localStorage**

```jsx
// On form submit:
const handleLogin = (e) => {
  e.preventDefault();
  // No API call — just store user in localStorage
  auth.login({ name: formData.name, email: formData.email });
  navigate('/');
};
```

- [ ] **Step 4: Update Signup.jsx similarly**

```jsx
const handleSignup = (e) => {
  e.preventDefault();
  auth.login({ name: formData.name, email: formData.email });
  navigate('/');
};
```

- [ ] **Step 5: Verify ProtectedRoute checks localStorage**

```jsx
// ProtectedRoute.jsx
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}
```

- [ ] **Step 6: Start and verify**

```bash
cd "Task-1/day-1/client"
npm install && npm run dev
```

Test: signup → redirected to `/` → refresh → still logged in (localStorage persists). Logout → redirected to `/login`.

- [ ] **Step 7: Delete server folder if it exists**

```bash
rm -rf "Task-1/day-1/server"
```

- [ ] **Step 8: Commit**

```bash
git add Task-1/day-1/
git commit -m "feat(day-1): replace auth API with localStorage — no backend needed"
```

---

## Task 2: Day 2 — Share Intent + Auto Save

**Files:**
- Modify: `Task-1/day-2/client/src/components/ShareHandler.jsx`
- Modify: `Task-1/day-2/client/src/pages/SharePage.jsx`
- Create: `Task-1/day-2/client/src/services/storage.js`

- [ ] **Step 1: Create storage.js**

Copy the shared storage service into `Task-1/day-2/client/src/services/storage.js`.

- [ ] **Step 2: Update ShareHandler to call addItem() from storage**

```jsx
import { addItem } from '../services/storage';

function detectType(sharedData) {
  if (/^https?:\/\//.test(sharedData.text || '')) return 'link';
  if (sharedData.mimeType?.startsWith('image/')) return 'image';
  if (sharedData.mimeType?.includes('pdf') || sharedData.mimeType?.includes('word')) return 'document';
  return 'note';
}

export function handleShare(sharedData, onSaved) {
  const type = detectType(sharedData);
  const categoryMap = { link: 'Links', image: 'Images', document: 'Documents', note: 'Notes' };
  const item = addItem({
    type,
    category: categoryMap[type],
    autoCategory: categoryMap[type],
    title: sharedData.title || sharedData.text?.slice(0, 60) || 'Untitled',
    content: sharedData.text || sharedData.url || '',
  });
  onSaved(item);
}
```

- [ ] **Step 3: Update SharePage to use handleShare**

```jsx
import { handleShare } from '../components/ShareHandler';
import Toast from '../components/Toast';

export default function SharePage() {
  const [saved, setSaved] = useState(null);
  const params = new URLSearchParams(window.location.search);

  useEffect(() => {
    handleShare(
      { text: params.get('url') || params.get('text'), title: params.get('title') },
      setSaved
    );
  }, []);

  return saved ? <Toast message={`Saved to ${saved.category}`} /> : <p>Saving...</p>;
}
```

- [ ] **Step 4: Start and test**

```bash
cd "Task-1/day-2/client"
npm install && npm run dev
```

Navigate to `http://localhost:5173/share?url=https://example.com` → Toast shows "Saved to Links". Open DevTools → Application → localStorage → `keepbox_items` should have one entry.

- [ ] **Step 5: Delete server folder**

```bash
rm -rf "Task-1/day-2/server"
```

- [ ] **Step 6: Commit**

```bash
git add Task-1/day-2/
git commit -m "feat(day-2): save shared content to localStorage — remove server"
```

---

## Task 3: Day 3 — Manual Add + Create

**Files:**
- Modify: `Task-1/day-3/client/src/components/AddItemModal.jsx`
- Create: `Task-1/day-3/client/src/services/storage.js`

- [ ] **Step 1: Create storage.js**

Copy the shared storage service into `Task-1/day-3/client/src/services/storage.js`.

- [ ] **Step 2: Update AddItemModal to call storage functions**

```jsx
import { addItem, addFolder, getFolders } from '../services/storage';

// On form submit:
const handleSubmit = (e) => {
  e.preventDefault();
  addItem({
    type: selectedType,        // 'link' | 'document' | 'image'
    category: categoryMap[selectedType],
    autoCategory: categoryMap[selectedType],
    title: form.name,
    content: form.url || form.file || '',
    description: form.description || '',
    folderId: form.folderId || null,
  });
  onClose();
};
```

- [ ] **Step 3: Load folders from localStorage for the folder dropdown**

```jsx
const [folders, setFolders] = useState([]);
useEffect(() => { setFolders(getFolders()); }, []);
```

- [ ] **Step 4: Wire "New Folder" creation**

```jsx
const handleNewFolder = (name) => {
  const folder = addFolder(name);
  setFolders(prev => [...prev, folder]);
  setForm(f => ({ ...f, folderId: folder.id }));
};
```

- [ ] **Step 5: Start and test**

```bash
cd "Task-1/day-3/client"
npm install && npm run dev
```

Click ➕ → fill Link form → submit → check `keepbox_items` in DevTools localStorage.

- [ ] **Step 6: Delete server folder**

```bash
rm -rf "Task-1/day-3/server"
```

- [ ] **Step 7: Commit**

```bash
git add Task-1/day-3/
git commit -m "feat(day-3): manual add writes to localStorage — remove server"
```

---

## Task 4: Day 4 — Home, Categories & Read

**Files:**
- Modify: `Task-1/day-4/client/src/pages/Home.jsx`
- Modify: `Task-1/day-4/client/src/pages/CategoryView.jsx`
- Create: `Task-1/day-4/client/src/services/storage.js`

- [ ] **Step 1: Create storage.js**

Copy the shared storage service into `Task-1/day-4/client/src/services/storage.js`.

- [ ] **Step 2: Update Home.jsx to read from localStorage**

```jsx
import { getItems, getFolders } from '../services/storage';

export default function Home() {
  const [items, setItems] = useState([]);
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    setItems(getItems().filter(i => !i.deleted && !i.archived));
    setFolders(getFolders());
  }, []);

  const recent = items.slice(0, 10);
  const categories = ['Images', 'Links', 'Documents', 'Videos', 'Notes'];

  // render recent + categories grid
}
```

- [ ] **Step 3: Update CategoryView.jsx to filter by type**

```jsx
import { getItems } from '../services/storage';
import { useParams } from 'react-router-dom';

export default function CategoryView() {
  const { type } = useParams();   // e.g. 'Images', 'Links'
  const items = getItems().filter(i => i.category === type && !i.deleted && !i.archived);
  // Images → grid, Documents → list, Links → preview list
}
```

- [ ] **Step 4: Start and test**

```bash
cd "Task-1/day-4/client"
npm install && npm run dev
```

Add some items via DevTools (set `keepbox_items` manually), then verify Home and CategoryView display them.

- [ ] **Step 5: Delete server folder**

```bash
rm -rf "Task-1/day-4/server"
```

- [ ] **Step 6: Commit**

```bash
git add Task-1/day-4/
git commit -m "feat(day-4): home and category views read from localStorage"
```

---

## Task 5: Day 5 — Update + Delete (Full CRUD)

**Files:**
- Modify: `Task-1/day-5/client/src/` (item action components)
- Create: `Task-1/day-5/client/src/services/storage.js`

- [ ] **Step 1: Create storage.js**

Copy the shared storage service into `Task-1/day-5/client/src/services/storage.js`.

- [ ] **Step 2: Wire item actions to storage functions**

```jsx
import { updateItem, deleteItem, updateFolder, deleteFolder } from '../services/storage';

// Star toggle
const toggleStar = (id) => {
  const item = items.find(i => i.id === id);
  updateItem(id, { starred: !item.starred });
  setItems(getItems().filter(i => !i.deleted && !i.archived));
};

// Soft delete (moves to trash)
const handleDelete = (id) => {
  deleteItem(id);   // sets deleted: true
  setItems(prev => prev.filter(i => i.id !== id));
};

// Rename
const handleRename = (id, title) => updateItem(id, { title });

// Change folder
const handleChangeFolder = (id, folderId) => updateItem(id, { folderId });
```

- [ ] **Step 3: Wire EditModal submit to updateItem**

```jsx
const handleEditSubmit = (id, formData) => {
  updateItem(id, {
    title: formData.title,
    description: formData.description,
    folderId: formData.folderId,
  });
  setItems(getItems().filter(i => !i.deleted && !i.archived));
};
```

- [ ] **Step 4: Start and test**

```bash
cd "Task-1/day-5/client"
npm install && npm run dev
```

Long-press / right-click item → star it → check `starred: true` in localStorage. Delete → check `deleted: true`.

- [ ] **Step 5: Delete server folder**

```bash
rm -rf "Task-1/day-5/server"
```

- [ ] **Step 6: Commit**

```bash
git add Task-1/day-5/
git commit -m "feat(day-5): CRUD update/delete wired to localStorage"
```

---

## Task 6: Day 6 — Search + Offline + Performance

**Files:**
- Modify: `Task-1/day-6/client/src/pages/SearchPage.jsx`
- Modify: `Task-1/day-6/client/src/hooks/useSearch.js`
- Modify: `Task-1/day-6/client/src/pages/TrashPage.jsx`
- Create: `Task-1/day-6/client/src/services/storage.js`

- [ ] **Step 1: Create storage.js**

Copy the shared storage service into `Task-1/day-6/client/src/services/storage.js`.

- [ ] **Step 2: Update useSearch.js to search localStorage directly**

```js
import { useState, useEffect } from 'react';
import { getItems } from '../services/storage';

export function useSearch(query) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const timer = setTimeout(() => {
      const q = query.toLowerCase();
      const found = getItems().filter(i =>
        !i.deleted && !i.archived &&
        (i.title?.toLowerCase().includes(q) ||
         i.description?.toLowerCase().includes(q) ||
         i.content?.toLowerCase().includes(q))
      );
      setResults(found);
    }, 300); // debounce
    return () => clearTimeout(timer);
  }, [query]);

  return results;
}
```

- [ ] **Step 3: Update SearchPage to use useSearch hook**

```jsx
import { useSearch } from '../hooks/useSearch';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const results = useSearch(query);

  return (
    <div className="p-4">
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search items..."
        className="w-full border rounded-xl p-3 mb-4"
      />
      {results.map(item => <ItemCard key={item.id} item={item} />)}
    </div>
  );
}
```

- [ ] **Step 4: Update TrashPage to read deleted items from localStorage**

```jsx
import { getItems, updateItem } from '../services/storage';

export default function TrashPage() {
  const [items, setItems] = useState(() => getItems().filter(i => i.deleted));

  const restore = (id) => {
    updateItem(id, { deleted: false });
    setItems(prev => prev.filter(i => i.id !== id));
  };
  // render trash list with restore button
}
```

- [ ] **Step 5: Verify offline behavior**

Because all data is in localStorage, the app works offline by default — no extra caching needed. Confirm DevTools → Network → Offline → items still appear.

- [ ] **Step 6: Delete server folder**

```bash
rm -rf "Task-1/day-6/server"
```

- [ ] **Step 7: Commit**

```bash
git add Task-1/day-6/
git commit -m "feat(day-6): search runs on localStorage, offline works natively"
```

---

## Task 7: Day 7 — Reminders + Archive (BUILD)

**Files:**
- Create: `Task-1/day-7/client/src/pages/ArchivePage.jsx`
- Create: `Task-1/day-7/client/src/pages/ReminderPage.jsx`
- Create: `Task-1/day-7/client/src/components/ReminderModal.jsx`
- Modify: `Task-1/day-7/client/src/App.jsx`
- Create: `Task-1/day-7/client/src/services/storage.js`

- [ ] **Step 1: Create storage.js**

Copy the shared storage service into `Task-1/day-7/client/src/services/storage.js`.

- [ ] **Step 2: Create ArchivePage.jsx**

Create `Task-1/day-7/client/src/pages/ArchivePage.jsx`:

```jsx
import { useState } from 'react';
import { getItems, updateItem } from '../services/storage';

export default function ArchivePage() {
  const [items, setItems] = useState(() => getItems().filter(i => i.archived && !i.deleted));

  const restore = (id) => {
    updateItem(id, { archived: false });
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Archive</h1>
      {items.length === 0 && <p className="text-gray-500">No archived items.</p>}
      {items.map(item => (
        <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow mb-2">
          <div>
            <p className="font-medium">{item.title}</p>
            <p className="text-xs text-gray-400">{item.type} · {item.category}</p>
          </div>
          <button onClick={() => restore(item.id)}
            className="text-sm text-blue-600 hover:underline">
            Restore
          </button>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create ReminderModal.jsx**

Create `Task-1/day-7/client/src/components/ReminderModal.jsx`:

```jsx
import { useState } from 'react';
import { updateItem } from '../services/storage';

export default function ReminderModal({ item, onClose, onUpdated }) {
  const [date, setDate] = useState(item.reminder?.date || '');
  const [time, setTime] = useState(item.reminder?.time || '');

  const save = () => {
    if (!date || !time) return;
    const updated = updateItem(item.id, { reminder: { date, time } });
    onUpdated(updated);
    onClose();
  };

  const clear = () => {
    const updated = updateItem(item.id, { reminder: null });
    onUpdated(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-80">
        <h2 className="text-lg font-bold mb-4">Set Reminder</h2>
        <label className="block text-sm mb-1">Date</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)}
          className="w-full border rounded p-2 mb-3" />
        <label className="block text-sm mb-1">Time</label>
        <input type="time" value={time} onChange={e => setTime(e.target.value)}
          className="w-full border rounded p-2 mb-4" />
        <div className="flex gap-2">
          <button onClick={save} className="flex-1 bg-blue-600 text-white rounded py-2">Save</button>
          {item.reminder && (
            <button onClick={clear} className="flex-1 bg-red-100 text-red-600 rounded py-2">Clear</button>
          )}
          <button onClick={onClose} className="flex-1 bg-gray-100 rounded py-2">Cancel</button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create ReminderPage.jsx**

Create `Task-1/day-7/client/src/pages/ReminderPage.jsx`:

```jsx
import { useState } from 'react';
import { getItems, updateItem } from '../services/storage';
import ReminderModal from '../components/ReminderModal';

export default function ReminderPage() {
  const [items, setItems] = useState(() =>
    getItems().filter(i => i.reminder && !i.deleted && !i.archived)
  );
  const [selected, setSelected] = useState(null);

  const onUpdated = (updated) => {
    setItems(prev =>
      prev.map(i => i.id === updated.id ? updated : i).filter(i => i.reminder)
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Reminders</h1>
      {items.length === 0 && <p className="text-gray-500">No reminders set.</p>}
      {items.map(item => (
        <div key={item.id} onClick={() => setSelected(item)}
          className="flex items-center justify-between p-3 bg-white rounded-lg shadow mb-2 cursor-pointer">
          <div>
            <p className="font-medium">{item.title}</p>
            <p className="text-xs text-blue-500">{item.reminder.date} at {item.reminder.time}</p>
          </div>
          <span className="text-xl">🔔</span>
        </div>
      ))}
      {selected && (
        <ReminderModal item={selected} onClose={() => setSelected(null)} onUpdated={onUpdated} />
      )}
    </div>
  );
}
```

- [ ] **Step 5: Add archive action to ItemModal**

Open `Task-1/day-7/client/src/components/ItemModal.jsx`. Add Archive button:

```jsx
import { updateItem } from '../services/storage';

// Inside action buttons:
<button onClick={() => {
  updateItem(item.id, { archived: true });
  onClose();
  onItemUpdated(); // trigger re-fetch in parent
}}>
  Archive
</button>
```

- [ ] **Step 6: Add reminder action to ItemModal**

```jsx
import ReminderModal from './ReminderModal';

// Inside component state:
const [showReminder, setShowReminder] = useState(false);

// Button:
<button onClick={() => setShowReminder(true)}>Set Reminder</button>
{showReminder && (
  <ReminderModal item={item} onClose={() => setShowReminder(false)} onUpdated={onItemUpdated} />
)}
```

- [ ] **Step 7: Add routes to App.jsx**

Open `Task-1/day-7/client/src/App.jsx` and add:

```jsx
import ArchivePage from './pages/ArchivePage';
import ReminderPage from './pages/ReminderPage';

// Inside <Routes>:
<Route path="/archive" element={<ArchivePage />} />
<Route path="/reminders" element={<ReminderPage />} />
```

- [ ] **Step 8: Start and do end-to-end test**

```bash
cd "Task-1/day-7/client"
npm install && npm run dev
```

Test:
1. Open any item → Archive → item gone from Home → appears at `/archive` → Restore → back in Home
2. Open any item → Set Reminder (date + time) → appears at `/reminders` → click to edit → Clear → removed from list

- [ ] **Step 9: Delete server folder**

```bash
rm -rf "Task-1/day-7/server"
```

- [ ] **Step 10: Commit**

```bash
git add Task-1/day-7/
git commit -m "feat(day-7): archive and reminder pages built on localStorage"
```

---

## Task 8: Day 8 — Trash + Settings + Help & Feedback

**Files:**
- Modify: `Task-1/day-8/src/App.tsx`
- Modify: `Task-1/day-8/src/components/Trash.tsx`
- Modify: `Task-1/day-8/src/components/Settings.tsx`
- Modify: `Task-1/day-8/src/components/HelpFeedback.tsx`
- Create: `Task-1/day-8/src/services/storage.ts`

- [ ] **Step 1: Create storage.ts (TypeScript version)**

Create `Task-1/day-8/src/services/storage.ts`:

```ts
export interface Item {
  id: string;
  type: 'link' | 'image' | 'document' | 'video' | 'note';
  category: string;
  title: string;
  content: string;
  description: string;
  folderId: string | null;
  starred: boolean;
  archived: boolean;
  deleted: boolean;
  reminder: { date: string; time: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  theme: 'light' | 'dark';
  notifications: boolean;
  reminderToggle: boolean;
}

export interface FeedbackEntry {
  id: string;
  type: 'bug' | 'feature' | 'other';
  message: string;
  email: string;
  createdAt: string;
}

const KEYS = {
  ITEMS: 'keepbox_items',
  SETTINGS: 'keepbox_settings',
  FEEDBACK: 'keepbox_feedback',
};

const read = <T>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback; }
  catch { return fallback; }
};
const write = (key: string, val: unknown) => localStorage.setItem(key, JSON.stringify(val));

export const getItems = (): Item[] => read(KEYS.ITEMS, []);
export const saveItems = (items: Item[]) => write(KEYS.ITEMS, items);

export const updateItem = (id: string, patch: Partial<Item>): Item | undefined => {
  const items = getItems().map(i =>
    i.id === id ? { ...i, ...patch, updatedAt: new Date().toISOString() } : i
  );
  saveItems(items);
  return items.find(i => i.id === id);
};

export const permanentDelete = (id: string) => saveItems(getItems().filter(i => i.id !== id));

export const getSettings = (): Settings =>
  read(KEYS.SETTINGS, { theme: 'light', notifications: true, reminderToggle: true });

export const updateSettings = (patch: Partial<Settings>) =>
  write(KEYS.SETTINGS, { ...getSettings(), ...patch });

export const addFeedback = (entry: Omit<FeedbackEntry, 'id' | 'createdAt'>) => {
  const list = read<FeedbackEntry[]>(KEYS.FEEDBACK, []);
  write(KEYS.FEEDBACK, [
    ...list,
    { ...entry, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
  ]);
};
```

- [ ] **Step 2: Wire Trash.tsx to storage**

Open `Task-1/day-8/src/components/Trash.tsx` and replace any API calls with storage functions:

```tsx
import { useState } from 'react';
import { getItems, updateItem, permanentDelete } from '../services/storage';

export default function Trash() {
  const [items, setItems] = useState(() => getItems().filter(i => i.deleted));

  const restore = (id: string) => {
    updateItem(id, { deleted: false });
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const permDelete = (id: string) => {
    if (!confirm('Permanently delete? Cannot be undone.')) return;
    permanentDelete(id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Trash</h1>
      {items.length === 0 && <p className="text-gray-500">Trash is empty.</p>}
      {items.map(item => (
        <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow mb-2">
          <div>
            <p className="font-medium">{item.title}</p>
            <p className="text-xs text-gray-400">{item.type}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => restore(item.id)} className="text-blue-600 text-sm">Restore</button>
            <button onClick={() => permDelete(item.id)} className="text-red-600 text-sm">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Wire Settings.tsx to storage**

Open `Task-1/day-8/src/components/Settings.tsx`:

```tsx
import { useState } from 'react';
import { getSettings, updateSettings } from '../services/storage';

export default function Settings() {
  const [settings, setSettings] = useState(getSettings);

  const toggle = (key: keyof typeof settings) => {
    const updated = { ...settings, [key]: !settings[key] };
    updateSettings(updated);
    setSettings(updated);
  };

  const setTheme = (theme: 'light' | 'dark') => {
    updateSettings({ theme });
    setSettings(s => ({ ...s, theme }));
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Settings</h1>
      {/* Theme */}
      <div className="flex justify-between items-center mb-4">
        <span>Theme</span>
        <button onClick={() => setTheme(settings.theme === 'light' ? 'dark' : 'light')}
          className="bg-gray-200 rounded-full px-4 py-1">
          {settings.theme === 'light' ? 'Light' : 'Dark'}
        </button>
      </div>
      {/* Notifications */}
      <div className="flex justify-between items-center mb-4">
        <span>Notifications</span>
        <input type="checkbox" checked={settings.notifications} onChange={() => toggle('notifications')} />
      </div>
      {/* Reminder toggle */}
      <div className="flex justify-between items-center">
        <span>Reminders</span>
        <input type="checkbox" checked={settings.reminderToggle} onChange={() => toggle('reminderToggle')} />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Wire HelpFeedback.tsx to storage**

Open `Task-1/day-8/src/components/HelpFeedback.tsx`:

```tsx
import { useState } from 'react';
import { addFeedback } from '../services/storage';

export default function HelpFeedback() {
  const [type, setType] = useState<'bug' | 'feature' | 'other'>('bug');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    addFeedback({ type, message, email });
    setSubmitted(true);
  };

  if (submitted) return <p className="p-4 text-green-600">Thanks for your feedback!</p>;

  return (
    <form onSubmit={submit} className="p-4">
      <h1 className="text-xl font-bold mb-4">Help & Feedback</h1>
      <select value={type} onChange={e => setType(e.target.value as typeof type)}
        className="w-full border rounded p-2 mb-3">
        <option value="bug">Report a Bug</option>
        <option value="feature">Request a Feature</option>
        <option value="other">Other</option>
      </select>
      <textarea value={message} onChange={e => setMessage(e.target.value)}
        placeholder="Describe your issue or idea..." rows={4}
        className="w-full border rounded p-2 mb-3" />
      <input value={email} onChange={e => setEmail(e.target.value)}
        placeholder="Email (optional)" className="w-full border rounded p-2 mb-4" />
      <button type="submit" className="w-full bg-blue-600 text-white rounded py-2">Send</button>
    </form>
  );
}
```

- [ ] **Step 5: Verify App.tsx has routing**

Open `Task-1/day-8/src/App.tsx` — ensure:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Trash from './components/Trash';
import Settings from './components/Settings';
import HelpFeedback from './components/HelpFeedback';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/trash" element={<Trash />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<HelpFeedback />} />
      </Routes>
    </BrowserRouter>
  );
}
```

- [ ] **Step 6: Start and test all three pages**

```bash
cd "Task-1/day-8"
npm install && npm run dev
```

Test:
1. `/trash` → shows deleted items (add one manually in DevTools) → Restore → Permanent delete
2. `/settings` → toggle dark mode → refresh → setting persists in localStorage
3. `/help` → submit feedback → "Thanks" message → check `keepbox_feedback` in DevTools

- [ ] **Step 7: Delete server folder**

```bash
rm -rf "Task-1/day-8/server" 2>/dev/null; echo "done"
```

- [ ] **Step 8: Final commit**

```bash
git add Task-1/day-8/
git commit -m "feat(day-8): trash/settings/feedback wired to localStorage — no backend"
```

---

## Final Verification Checklist

- [ ] Day 1: Login/Signup stores `keepbox_user` in localStorage, ProtectedRoute works
- [ ] Day 2: Share URL → auto-detected as link → saved to `keepbox_items`
- [ ] Day 3: FAB → AddItemModal → all three form types save to localStorage
- [ ] Day 4: Home reads `keepbox_items`, CategoryView filters by type
- [ ] Day 5: Edit/star/delete update `keepbox_items` correctly
- [ ] Day 6: Search filters localStorage data, offline works by default
- [ ] Day 7: Archive page shows `archived:true` items, Reminder page shows `reminder!=null` items
- [ ] Day 8: Trash restore/delete, Settings persist, Feedback saves to `keepbox_feedback`

---

## Quick Start Reference

```bash
# Start any day's client (replace N with 1-8)
cd "Task-1/day-N/client" && npm install && npm run dev

# Day 8 (no client/ subfolder)
cd "Task-1/day-8" && npm install && npm run dev

# Check localStorage in browser
# DevTools → Application → Local Storage → http://localhost:5173
# Keys: keepbox_items, keepbox_folders, keepbox_settings, keepbox_feedback, keepbox_user
```
