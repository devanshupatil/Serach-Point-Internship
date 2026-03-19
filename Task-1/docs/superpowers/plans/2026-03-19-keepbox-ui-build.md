# KeepBox Unified UI Build — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single unified desktop React + Vite app at `Task-1/keepbox-app/` with all KeepBox screens — Auth, Dashboard, Search, Categories, Folders, Archive, Reminders, Trash, Settings, Help — wired to localStorage with the polished design from the approved spec.

**Architecture:** One React 18 + Vite app, React Router v6 for all routes, Tailwind CSS with KeepBox design tokens, single `storage.js` service that is the only file touching `localStorage`. `AppLayout` provides the sidebar + header shell for all authenticated pages. Auth is stored in `localStorage` under `keepbox_user`.

**Tech Stack:** React 18 · Vite · React Router v6 · Tailwind CSS 3 · Vitest · React Testing Library · Inter font (Google Fonts) · Material Symbols (Google Fonts)

**Spec:** `docs/superpowers/specs/2026-03-19-keepbox-ui-design.md`

---

## File Map

| File | Responsibility |
|------|---------------|
| `src/main.jsx` | Entry point, mounts App |
| `src/App.jsx` | All routes, AuthProvider wrapper |
| `src/index.css` | Tailwind directives, global styles |
| `tailwind.config.js` | KeepBox design tokens |
| `src/services/storage.js` | All localStorage reads/writes |
| `src/context/AuthContext.jsx` | User session state |
| `src/components/AppLayout.jsx` | Sidebar + header shell |
| `src/components/ProtectedRoute.jsx` | Auth guard |
| `src/components/ItemCard.jsx` | Single file/link/image row |
| `src/components/AddItemModal.jsx` | Tab-switcher add form |
| `src/components/EditModal.jsx` | Edit title/description/folder |
| `src/components/ReminderModal.jsx` | Date + time picker |
| `src/components/ActionSheet.jsx` | Right-click context menu |
| `src/components/Toast.jsx` | Transient notifications |
| `src/components/Skeletons.jsx` | Loading placeholders |
| `src/components/ErrorBoundary.jsx` | React error boundary |
| `src/pages/Login.jsx` | Split-panel login |
| `src/pages/Signup.jsx` | Split-panel signup |
| `src/pages/Home.jsx` | Dashboard: pinned folders + categories + recent |
| `src/pages/CategoryView.jsx` | Items filtered by category type |
| `src/pages/FolderView.jsx` | Items filtered by folderId |
| `src/pages/SearchPage.jsx` | Search with filter chips |
| `src/pages/ArchivePage.jsx` | archived=true items |
| `src/pages/ReminderPage.jsx` | reminder≠null items |
| `src/pages/TrashPage.jsx` | deleted=true items |
| `src/pages/Settings.jsx` | Toggle settings |
| `src/pages/HelpFeedback.jsx` | Feedback form |

---

## Task 1: Scaffold Project

**Files:**
- Create: `Task-1/keepbox-app/` (whole project)
- Create: `Task-1/keepbox-app/tailwind.config.js`
- Create: `Task-1/keepbox-app/src/index.css`

- [ ] **Step 1: Scaffold Vite + React project**

```bash
cd "Task-1"
npm create vite@latest keepbox-app -- --template react
cd keepbox-app
npm install
```

- [ ] **Step 2: Install dependencies**

```bash
npm install react-router-dom@6
npm install -D tailwindcss@3 postcss autoprefixer
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
npx tailwindcss init -p
```

- [ ] **Step 3: Configure Tailwind**

Replace `tailwind.config.js` with:

```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#135bec',
        'bg-light': '#f6f6f8',
        'bg-dark': '#101622',
        surface: '#ffffff',
        'surface-dark': '#1e293b',
        'border-default': '#f1f5f9',
        'border-dark': '#1e293b',
        'text-primary': '#0f172a',
        'text-secondary': '#94a3b8',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 4: Set up index.css**

Replace `src/index.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap');

body {
  font-family: 'Inter', sans-serif;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
```

- [ ] **Step 5: Configure Vitest in vite.config.js**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.js',
  },
})
```

- [ ] **Step 6: Create test setup file**

Create `src/test-setup.js`:

```js
import '@testing-library/jest-dom'
```

- [ ] **Step 7: Add test script to package.json**

In `package.json`, add to scripts:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 8: Verify dev server starts**

```bash
npm run dev
```

Expected: Vite dev server at `http://localhost:5173` with default React app.

- [ ] **Step 9: Commit**

```bash
git add Task-1/keepbox-app/
git commit -m "feat(keepbox): scaffold React+Vite project with Tailwind and Vitest"
```

---

## Task 2: Storage Service

**Files:**
- Create: `Task-1/keepbox-app/src/services/storage.js`
- Create: `Task-1/keepbox-app/src/services/storage.test.js`

- [ ] **Step 1: Write failing tests**

Create `src/services/storage.test.js`:

```js
import { describe, it, expect, beforeEach } from 'vitest'
import {
  getItems, addItem, updateItem, deleteItem,
  getFolders, addFolder, updateFolder, deleteFolder,
  getSettings, updateSettings, addFeedback,
} from './storage'

beforeEach(() => localStorage.clear())

describe('items', () => {
  it('returns empty array by default', () => {
    expect(getItems()).toEqual([])
  })

  it('addItem prepends and returns item with id', () => {
    const item = addItem({ type: 'link', category: 'Links', title: 'Test', content: 'http://x.com' })
    expect(item.id).toBeDefined()
    expect(item.starred).toBe(false)
    expect(item.deleted).toBe(false)
    expect(getItems()).toHaveLength(1)
  })

  it('updateItem patches matching item', () => {
    const item = addItem({ type: 'link', title: 'Old', content: '' })
    updateItem(item.id, { title: 'New' })
    expect(getItems()[0].title).toBe('New')
  })

  it('deleteItem sets deleted:true', () => {
    const item = addItem({ type: 'link', title: 'x', content: '' })
    deleteItem(item.id)
    expect(getItems()[0].deleted).toBe(true)
  })
})

describe('folders', () => {
  it('returns default General folder', () => {
    const folders = getFolders()
    expect(folders[0].name).toBe('General')
  })

  it('addFolder appends folder', () => {
    addFolder('Work')
    expect(getFolders().some(f => f.name === 'Work')).toBe(true)
  })
})

describe('settings', () => {
  it('returns defaults', () => {
    expect(getSettings().theme).toBe('light')
  })

  it('updateSettings patches', () => {
    updateSettings({ theme: 'dark' })
    expect(getSettings().theme).toBe('dark')
  })
})
```

- [ ] **Step 2: Run tests — expect failure**

```bash
npm test
```

Expected: FAIL — `storage` module not found.

- [ ] **Step 3: Implement storage.js**

Create `src/services/storage.js`:

```js
const KEYS = {
  ITEMS: 'keepbox_items',
  FOLDERS: 'keepbox_folders',
  SETTINGS: 'keepbox_settings',
  FEEDBACK: 'keepbox_feedback',
}

const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback }
  catch { return fallback }
}
const write = (key, val) => localStorage.setItem(key, JSON.stringify(val))

// --- items ---
export const getItems = () => read(KEYS.ITEMS, [])
export const saveItems = (items) => write(KEYS.ITEMS, items)

export const addItem = (item) => {
  const items = getItems()
  const newItem = {
    id: crypto.randomUUID(),
    starred: false, archived: false, deleted: false,
    reminder: null, description: '', folderId: null,
    autoCategory: item.category ?? '',
    metadata: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...item,
  }
  saveItems([newItem, ...items])
  return newItem
}

export const updateItem = (id, patch) => {
  const items = getItems().map(i =>
    i.id === id ? { ...i, ...patch, updatedAt: new Date().toISOString() } : i
  )
  saveItems(items)
  return items.find(i => i.id === id)
}

export const deleteItem = (id) => updateItem(id, { deleted: true })

export const permanentDelete = (id) => saveItems(getItems().filter(i => i.id !== id))

// --- folders ---
const defaultFolders = () => [{ id: 'default', name: 'General', createdAt: new Date().toISOString() }]

export const getFolders = () => read(KEYS.FOLDERS, defaultFolders())
export const saveFolders = (f) => write(KEYS.FOLDERS, f)

export const addFolder = (name) => {
  const folders = getFolders()
  const folder = { id: crypto.randomUUID(), name, createdAt: new Date().toISOString() }
  saveFolders([...folders, folder])
  return folder
}

export const updateFolder = (id, patch) => {
  saveFolders(getFolders().map(f => f.id === id ? { ...f, ...patch } : f))
}

export const deleteFolder = (id) => saveFolders(getFolders().filter(f => f.id !== id))

// --- settings ---
const defaultSettings = { theme: 'light', notifications: true, reminderToggle: true }
export const getSettings = () => read(KEYS.SETTINGS, defaultSettings)
export const updateSettings = (patch) => write(KEYS.SETTINGS, { ...getSettings(), ...patch })

// --- feedback (write-only) ---
export const addFeedback = (entry) => {
  const list = read(KEYS.FEEDBACK, [])
  write(KEYS.FEEDBACK, [...list, { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...entry }])
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm test
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add Task-1/keepbox-app/src/services/
git commit -m "feat(keepbox): add localStorage storage service with tests"
```

---

## Task 3: Auth Context + Protected Route

**Files:**
- Create: `Task-1/keepbox-app/src/context/AuthContext.jsx`
- Create: `Task-1/keepbox-app/src/components/ProtectedRoute.jsx`

- [ ] **Step 1: Write failing test**

Create `src/context/AuthContext.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'

function Consumer() {
  const { user } = useAuth()
  return <div>{user ? user.name : 'no user'}</div>
}

beforeEach(() => localStorage.clear())

it('returns null user when no localStorage entry', () => {
  render(<AuthProvider><Consumer /></AuthProvider>)
  expect(screen.getByText('no user')).toBeInTheDocument()
})

it('returns user from localStorage on mount', () => {
  localStorage.setItem('keepbox_user', JSON.stringify({ name: 'Alex', email: 'a@b.com' }))
  render(<AuthProvider><Consumer /></AuthProvider>)
  expect(screen.getByText('Alex')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test — expect failure**

```bash
npm test
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement AuthContext.jsx**

Create `src/context/AuthContext.jsx`:

```jsx
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('keepbox_user')) }
    catch { return null }
  })

  const login = (userData) => {
    localStorage.setItem('keepbox_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('keepbox_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

- [ ] **Step 4: Implement ProtectedRoute.jsx**

Create `src/components/ProtectedRoute.jsx`:

```jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}
```

- [ ] **Step 5: Run tests — expect pass**

```bash
npm test
```

Expected: All tests PASS.

- [ ] **Step 6: Commit**

```bash
git add Task-1/keepbox-app/src/context/ Task-1/keepbox-app/src/components/ProtectedRoute.jsx
git commit -m "feat(keepbox): auth context and protected route"
```

---

## Task 4: App Router

**Files:**
- Modify: `Task-1/keepbox-app/src/App.jsx`
- Modify: `Task-1/keepbox-app/src/main.jsx`

- [ ] **Step 1: Set up main.jsx**

Replace `src/main.jsx`:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
)
```

- [ ] **Step 2: Set up App.jsx with all routes**

Replace `src/App.jsx`:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/AppLayout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import CategoryView from './pages/CategoryView'
import FolderView from './pages/FolderView'
import SearchPage from './pages/SearchPage'
import ArchivePage from './pages/ArchivePage'
import ReminderPage from './pages/ReminderPage'
import TrashPage from './pages/TrashPage'
import Settings from './pages/Settings'
import HelpFeedback from './pages/HelpFeedback'

function ProtectedLayout({ children }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<ProtectedLayout><Home /></ProtectedLayout>} />
        <Route path="/category/:type" element={<ProtectedLayout><CategoryView /></ProtectedLayout>} />
        <Route path="/folder/:id" element={<ProtectedLayout><FolderView /></ProtectedLayout>} />
        <Route path="/search" element={<ProtectedLayout><SearchPage /></ProtectedLayout>} />
        <Route path="/archive" element={<ProtectedLayout><ArchivePage /></ProtectedLayout>} />
        <Route path="/reminders" element={<ProtectedLayout><ReminderPage /></ProtectedLayout>} />
        <Route path="/trash" element={<ProtectedLayout><TrashPage /></ProtectedLayout>} />
        <Route path="/settings" element={<ProtectedLayout><Settings /></ProtectedLayout>} />
        <Route path="/help" element={<ProtectedLayout><HelpFeedback /></ProtectedLayout>} />
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 3: Create stub pages (so App compiles)**

For each missing page/component, create a minimal stub. Run this script:

```bash
mkdir -p src/pages src/components
for f in AppLayout Toast Skeletons ErrorBoundary ItemCard AddItemModal EditModal ReminderModal ActionSheet; do
  [ ! -f "src/components/$f.jsx" ] && echo "export default function $f() { return null }" > "src/components/$f.jsx"
done
for f in Home CategoryView FolderView SearchPage ArchivePage ReminderPage TrashPage Settings HelpFeedback; do
  [ ! -f "src/pages/$f.jsx" ] && echo "export default function $f() { return <div>$f</div> }" > "src/pages/$f.jsx"
done
```

- [ ] **Step 4: Verify app compiles and routes work**

```bash
npm run dev
```

Navigate to `http://localhost:5173` → should redirect to `/login` (no user in localStorage).
Navigate to `http://localhost:5173/login` → should render blank Login stub.

- [ ] **Step 5: Commit**

```bash
git add Task-1/keepbox-app/src/
git commit -m "feat(keepbox): wire all routes in App.jsx with stub pages"
```

---

## Task 5: AppLayout — Sidebar + Header

**Files:**
- Modify: `Task-1/keepbox-app/src/components/AppLayout.jsx`

- [ ] **Step 1: Write failing test**

Create `src/components/AppLayout.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import AppLayout from './AppLayout'

beforeEach(() => {
  localStorage.setItem('keepbox_user', JSON.stringify({ name: 'Alex', email: 'a@b.com' }))
})
afterEach(() => localStorage.clear())

function Wrapper({ children }) {
  return <MemoryRouter><AuthProvider>{children}</AuthProvider></MemoryRouter>
}

it('renders KeepBox logo', () => {
  render(<Wrapper><AppLayout>content</AppLayout></Wrapper>)
  expect(screen.getAllByText('KeepBox').length).toBeGreaterThan(0)
})

it('renders all nav items', () => {
  render(<Wrapper><AppLayout>content</AppLayout></Wrapper>)
  expect(screen.getByText('Home')).toBeInTheDocument()
  expect(screen.getByText('Search')).toBeInTheDocument()
  expect(screen.getByText('Archive')).toBeInTheDocument()
  expect(screen.getByText('Trash')).toBeInTheDocument()
  expect(screen.getByText('Settings')).toBeInTheDocument()
})

it('renders user name in sidebar', () => {
  render(<Wrapper><AppLayout>content</AppLayout></Wrapper>)
  expect(screen.getByText('Alex')).toBeInTheDocument()
})

it('renders children in main content area', () => {
  render(<Wrapper><AppLayout><p>hello world</p></AppLayout></Wrapper>)
  expect(screen.getByText('hello world')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test — expect failure**

```bash
npm test AppLayout
```

Expected: FAIL.

- [ ] **Step 3: Implement AppLayout.jsx**

Replace `src/components/AppLayout.jsx`:

```jsx
import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import AddItemModal from './AddItemModal'

const NAV_MAIN = [
  { to: '/', icon: 'home', label: 'Home' },
  { to: '/search', icon: 'search', label: 'Search' },
  { to: '/category/all', icon: 'folder', label: 'Files' },
]
const NAV_MANAGE = [
  { to: '/archive', icon: 'archive', label: 'Archive' },
  { to: '/reminders', icon: 'notifications', label: 'Reminders' },
  { to: '/trash', icon: 'delete', label: 'Trash' },
]
const NAV_ACCOUNT = [
  { to: '/settings', icon: 'settings', label: 'Settings' },
  { to: '/help', icon: 'help', label: 'Help' },
]

export default function AppLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showAddModal, setShowAddModal] = useState(false)

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer
     ${isActive
       ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-primary font-semibold'
       : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}`

  return (
    <div className="flex h-screen overflow-hidden bg-bg-light dark:bg-bg-dark font-display">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col">
        {/* Logo */}
        <div className="p-4 flex items-center gap-2.5 border-b border-slate-50 dark:border-slate-800">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-400 rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-white text-sm">cloud</span>
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900 dark:text-white leading-none">KeepBox</h1>
            <p className="text-[9px] uppercase tracking-widest text-slate-400 mt-0.5">Cloud Storage</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest px-3 py-2">Main</p>
          {NAV_MAIN.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'} className={navItemClass}>
              <span className="material-symbols-outlined text-[18px]">{icon}</span>
              {label}
            </NavLink>
          ))}
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest px-3 py-2 mt-2">Manage</p>
          {NAV_MANAGE.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} className={navItemClass}>
              <span className="material-symbols-outlined text-[18px]">{icon}</span>
              {label}
            </NavLink>
          ))}
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest px-3 py-2 mt-2">Account</p>
          {NAV_ACCOUNT.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} className={navItemClass}>
              <span className="material-symbols-outlined text-[18px]">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-2 px-2">
            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 border-2 border-blue-200 dark:border-blue-700 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-blue-500 hover:from-blue-600 hover:to-blue-400 text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-md shadow-primary/25"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Add New
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center px-5 gap-3">
          <div className="flex-1 max-w-md">
            <button
              onClick={() => navigate('/search')}
              className="w-full flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-8 px-3 text-left hover:border-primary/40 transition-colors"
            >
              <span className="material-symbols-outlined text-slate-400 text-[16px]">search</span>
              <span className="text-xs text-slate-400 flex-1">Search files, folders, links…</span>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded-md font-mono">⌘K</span>
            </button>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined text-slate-500 text-[18px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white dark:border-slate-900" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {showAddModal && <AddItemModal onClose={() => setShowAddModal(false)} />}
    </div>
  )
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm test AppLayout
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add Task-1/keepbox-app/src/components/AppLayout.jsx Task-1/keepbox-app/src/components/AppLayout.test.jsx
git commit -m "feat(keepbox): AppLayout sidebar and header shell"
```

---

## Task 6: Auth Pages — Login + Signup

**Files:**
- Modify: `Task-1/keepbox-app/src/pages/Login.jsx`
- Modify: `Task-1/keepbox-app/src/pages/Signup.jsx`

- [ ] **Step 1: Write failing tests**

Create `src/pages/Login.test.jsx`:

```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import Login from './Login'

beforeEach(() => localStorage.clear())

function Wrapper() {
  return <MemoryRouter><AuthProvider><Login /></AuthProvider></MemoryRouter>
}

it('renders login form', () => {
  render(<Wrapper />)
  expect(screen.getByText('Welcome back')).toBeInTheDocument()
  expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
})

it('stores user in localStorage on submit', () => {
  render(<Wrapper />)
  fireEvent.change(screen.getByPlaceholderText(/name/i), { target: { value: 'Alex' } })
  fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'a@b.com' } })
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
  expect(JSON.parse(localStorage.getItem('keepbox_user')).name).toBe('Alex')
})
```

- [ ] **Step 2: Run test — expect failure**

```bash
npm test Login
```

Expected: FAIL.

- [ ] **Step 3: Implement Login.jsx**

Replace `src/pages/Login.jsx`:

```jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    login({ name: form.name, email: form.email })
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-bg-dark p-4">
      <div className="flex w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl">
        {/* Brand panel */}
        <div className="hidden md:flex w-52 flex-shrink-0 flex-col justify-between p-7 bg-gradient-to-br from-blue-700 via-primary to-sky-500 relative overflow-hidden">
          <div className="absolute w-40 h-40 bg-white/5 rounded-full -bottom-10 -left-10" />
          <div className="absolute w-24 h-24 bg-white/5 rounded-full top-5 -right-8" />
          <div className="flex items-center gap-2.5 relative z-10">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-lg">cloud</span>
            </div>
            <div>
              <h1 className="text-white font-black text-base leading-none">KeepBox</h1>
              <p className="text-white/60 text-[9px] uppercase tracking-widest mt-0.5">Cloud Storage</p>
            </div>
          </div>
          <div className="relative z-10">
            <h2 className="text-white font-black text-xl leading-snug">Save everything that matters.</h2>
            <p className="text-white/70 text-xs mt-2 leading-relaxed">Links, files, images — all in one secure place.</p>
          </div>
        </div>

        {/* Form panel */}
        <div className="flex-1 bg-white dark:bg-slate-900 p-8 flex flex-col justify-center">
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">Welcome back</h2>
          <p className="text-xs text-slate-400 mb-6">Sign in to continue to KeepBox</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Full Name</label>
              <input
                placeholder="Your name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-primary to-blue-500 hover:from-blue-600 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all mt-2"
            >
              Sign In →
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-5">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-semibold hover:underline">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Implement Signup.jsx**

Replace `src/pages/Signup.jsx` (same split-panel, different heading + no login link needed):

```jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    login({ name: form.name, email: form.email })
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-bg-dark p-4">
      <div className="flex w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl">
        <div className="hidden md:flex w-52 flex-shrink-0 flex-col justify-between p-7 bg-gradient-to-br from-blue-700 via-primary to-sky-500 relative overflow-hidden">
          <div className="absolute w-40 h-40 bg-white/5 rounded-full -bottom-10 -left-10" />
          <div className="absolute w-24 h-24 bg-white/5 rounded-full top-5 -right-8" />
          <div className="flex items-center gap-2.5 relative z-10">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-lg">cloud</span>
            </div>
            <div>
              <h1 className="text-white font-black text-base leading-none">KeepBox</h1>
              <p className="text-white/60 text-[9px] uppercase tracking-widest mt-0.5">Cloud Storage</p>
            </div>
          </div>
          <div className="relative z-10">
            <h2 className="text-white font-black text-xl leading-snug">Start saving everything.</h2>
            <p className="text-white/70 text-xs mt-2 leading-relaxed">Your personal cloud, always with you.</p>
          </div>
        </div>

        <div className="flex-1 bg-white dark:bg-slate-900 p-8 flex flex-col justify-center">
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">Create account</h2>
          <p className="text-xs text-slate-400 mb-6">Join KeepBox — it's free</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Full Name</label>
              <input placeholder="Alex Rivera" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Email Address</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Password</label>
              <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary" />
            </div>
            <button type="submit"
              className="w-full h-11 bg-gradient-to-r from-primary to-blue-500 hover:from-blue-600 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all mt-2">
              Create Account →
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Run tests — expect pass**

```bash
npm test Login
```

Expected: All tests PASS.

- [ ] **Step 6: Verify in browser**

```bash
npm run dev
```

Visit `http://localhost:5173/login` — should show split-panel login. Fill name + email → submit → lands on `/` (Home stub).

- [ ] **Step 7: Commit**

```bash
git add Task-1/keepbox-app/src/pages/Login.jsx Task-1/keepbox-app/src/pages/Signup.jsx Task-1/keepbox-app/src/pages/Login.test.jsx
git commit -m "feat(keepbox): auth pages — login and signup with split-panel design"
```

---

## Task 7: Shared Components — Toast, Skeletons, ErrorBoundary, ItemCard

**Files:**
- Modify: `Task-1/keepbox-app/src/components/Toast.jsx`
- Modify: `Task-1/keepbox-app/src/components/Skeletons.jsx`
- Modify: `Task-1/keepbox-app/src/components/ErrorBoundary.jsx`
- Modify: `Task-1/keepbox-app/src/components/ItemCard.jsx`

- [ ] **Step 1: Implement Toast.jsx**

```jsx
import { useEffect } from 'react'

const VARIANTS = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  info: 'bg-primary',
}

export default function Toast({ message, variant = 'success', onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl text-white text-sm font-semibold shadow-xl animate-slide-in ${VARIANTS[variant]}`}>
      {message}
      <button onClick={onDismiss} className="ml-1 opacity-70 hover:opacity-100">✕</button>
    </div>
  )
}
```

Add to `index.css`:
```css
@keyframes slide-in {
  from { transform: translateY(20px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
.animate-slide-in { animation: slide-in 0.2s ease-out; }
```

- [ ] **Step 2: Implement Skeletons.jsx**

```jsx
function Pulse({ className }) {
  return <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg ${className}`} />
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 p-4 space-y-2">
      <Pulse className="h-8 w-8 rounded-lg" />
      <Pulse className="h-3 w-3/4" />
      <Pulse className="h-2 w-1/2" />
    </div>
  )
}

export function RowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
      <Pulse className="h-5 w-5 rounded" />
      <Pulse className="h-3 flex-1" />
      <Pulse className="h-2 w-20" />
    </div>
  )
}
```

- [ ] **Step 3: Implement ErrorBoundary.jsx**

```jsx
import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">error</span>
          <h2 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">Something went wrong</h2>
          <p className="text-sm text-slate-400 mb-4">{this.state.error.message}</p>
          <button onClick={() => this.setState({ error: null })}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold">
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
```

- [ ] **Step 4: Implement ItemCard.jsx**

```jsx
import { useState } from 'react'
import ActionSheet from './ActionSheet'

const TYPE_ICONS = {
  link: { icon: 'link', bg: 'bg-blue-100 dark:bg-blue-900/30', color: 'text-blue-600' },
  image: { icon: 'image', bg: 'bg-rose-100 dark:bg-rose-900/30', color: 'text-rose-500' },
  document: { icon: 'description', bg: 'bg-amber-100 dark:bg-amber-900/30', color: 'text-amber-600' },
  video: { icon: 'movie', bg: 'bg-purple-100 dark:bg-purple-900/30', color: 'text-purple-500' },
  note: { icon: 'sticky_note_2', bg: 'bg-green-100 dark:bg-green-900/30', color: 'text-green-600' },
}

export default function ItemCard({ item, onUpdate, onDelete }) {
  const [showActions, setShowActions] = useState(false)
  const [anchorPos, setAnchorPos] = useState(null)
  const meta = TYPE_ICONS[item.type] || TYPE_ICONS.note

  const handleContextMenu = (e) => {
    e.preventDefault()
    setAnchorPos({ x: e.clientX, y: e.clientY })
    setShowActions(true)
  }

  return (
    <>
      <tr
        onContextMenu={handleContextMenu}
        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group border-b border-slate-100 dark:border-slate-800"
      >
        <td className="px-6 py-3.5">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.bg}`}>
              <span className={`material-symbols-outlined text-[18px] ${meta.color}`}>{meta.icon}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.title}</p>
              {item.description && <p className="text-xs text-slate-400 truncate">{item.description}</p>}
            </div>
          </div>
        </td>
        <td className="px-6 py-3.5 text-xs text-slate-400 capitalize">{item.type}</td>
        <td className="px-6 py-3.5 text-xs text-slate-400">
          {new Date(item.updatedAt).toLocaleDateString()}
        </td>
        <td className="px-6 py-3.5 text-right">
          <button
            onClick={(e) => { e.stopPropagation(); setAnchorPos({ x: e.clientX, y: e.clientY }); setShowActions(true) }}
            className="p-1 opacity-0 group-hover:opacity-100 hover:text-primary transition-all"
            aria-label="Item actions"
          >
            <span className="material-symbols-outlined text-[18px]">more_horiz</span>
          </button>
        </td>
      </tr>

      {showActions && (
        <ActionSheet
          item={item}
          position={anchorPos}
          onClose={() => setShowActions(false)}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      )}
    </>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add Task-1/keepbox-app/src/components/
git commit -m "feat(keepbox): shared components — Toast, Skeletons, ErrorBoundary, ItemCard"
```

---

## Task 8: ActionSheet + AddItemModal + EditModal + ReminderModal

**Files:**
- Modify: `Task-1/keepbox-app/src/components/ActionSheet.jsx`
- Modify: `Task-1/keepbox-app/src/components/AddItemModal.jsx`
- Modify: `Task-1/keepbox-app/src/components/EditModal.jsx`
- Modify: `Task-1/keepbox-app/src/components/ReminderModal.jsx`

- [ ] **Step 1: Implement ActionSheet.jsx**

```jsx
import { useEffect, useRef } from 'react'
import { updateItem, deleteItem } from '../services/storage'

export default function ActionSheet({ item, position, onClose, onUpdate, onDelete }) {
  const ref = useRef()

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) onClose() }
    const keyHandler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', keyHandler)
    return () => { document.removeEventListener('mousedown', handler); document.removeEventListener('keydown', keyHandler) }
  }, [onClose])

  const actions = [
    { icon: 'star', label: item.starred ? 'Unstar' : 'Star', action: () => { onUpdate(updateItem(item.id, { starred: !item.starred })); onClose() } },
    { icon: 'edit', label: 'Edit', action: () => { onClose(); onUpdate({ ...item, _openEdit: true }) } },
    { icon: 'archive', label: 'Archive', action: () => { onUpdate(updateItem(item.id, { archived: true })); onClose() } },
    { icon: 'notifications', label: 'Set Reminder', action: () => { onClose(); onUpdate({ ...item, _openReminder: true }) } },
  ]

  return (
    <div
      ref={ref}
      style={{ position: 'fixed', top: position.y, left: position.x, zIndex: 1000 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl py-1.5 w-44 text-sm"
    >
      {actions.map(({ icon, label, action }) => (
        <button key={label} onClick={action}
          className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors text-left">
          <span className="material-symbols-outlined text-[16px] text-slate-400">{icon}</span>
          {label}
        </button>
      ))}
      <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
      <button onClick={() => { onDelete(item.id); onClose() }}
        className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors text-left">
        <span className="material-symbols-outlined text-[16px]">delete</span>
        Delete
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Implement AddItemModal.jsx**

```jsx
import { useState, useEffect } from 'react'
import { addItem, getFolders } from '../services/storage'

const TYPES = ['Link', 'Image', 'Document', 'Note']
const CATEGORY_MAP = { Link: 'Links', Image: 'Images', Document: 'Documents', Note: 'Notes' }

export default function AddItemModal({ onClose, onAdded }) {
  const [type, setType] = useState('Link')
  const [folders, setFolders] = useState([])
  const [form, setForm] = useState({ title: '', content: '', description: '', folderId: '' })

  useEffect(() => { setFolders(getFolders()) }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const item = addItem({
      type: type.toLowerCase(),
      category: CATEGORY_MAP[type],
      autoCategory: CATEGORY_MAP[type],
      title: form.title,
      content: form.content,
      description: form.description,
      folderId: form.folderId || null,
    })
    onAdded?.(item)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-black text-slate-900 dark:text-white">Add New Item</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700">✕</button>
        </div>

        <div className="px-6 pt-4">
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1 mb-5">
            {TYPES.map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${type === t ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-400'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Title</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} required placeholder={type === 'Link' ? 'My saved link' : 'Item title'}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary" />
          </div>

          {(type === 'Link') && (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">URL</label>
              <input value={form.content} onChange={e => set('content', e.target.value)} placeholder="https://" type="url"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary" />
            </div>
          )}

          {(type === 'Note') && (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Content</label>
              <textarea value={form.content} onChange={e => set('content', e.target.value)} rows={3} placeholder="Write your note…"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none" />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Folder</label>
            <select value={form.folderId} onChange={e => set('folderId', e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary">
              <option value="">No folder</option>
              {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Description <span className="normal-case font-normal">(optional)</span></label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} placeholder="Optional notes…"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none" />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="submit"
              className="flex-1 h-11 bg-gradient-to-r from-primary to-blue-500 text-white font-bold rounded-xl shadow-md shadow-primary/25 hover:from-blue-600 hover:to-blue-400 transition-all">
              Save Item
            </button>
            <button type="button" onClick={onClose}
              className="w-24 h-11 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Implement EditModal.jsx**

```jsx
import { useState, useEffect } from 'react'
import { updateItem, getFolders } from '../services/storage'

export default function EditModal({ item, onClose, onUpdated }) {
  const [folders, setFolders] = useState([])
  const [form, setForm] = useState({ title: item.title, description: item.description || '', folderId: item.folderId || '' })

  useEffect(() => { setFolders(getFolders()) }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const updated = updateItem(item.id, { title: form.title, description: form.description, folderId: form.folderId || null })
    onUpdated?.(updated)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-black text-slate-900 dark:text-white">Edit Item</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Title</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Folder</label>
            <select value={form.folderId} onChange={e => setForm(f => ({ ...f, folderId: e.target.value }))}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary">
              <option value="">No folder</option>
              {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="submit" className="flex-1 h-10 bg-gradient-to-r from-primary to-blue-500 text-white font-bold rounded-xl shadow-md shadow-primary/25">Save</button>
            <button type="button" onClick={onClose} className="w-20 h-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold rounded-xl">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Implement ReminderModal.jsx**

```jsx
import { useState } from 'react'
import { updateItem } from '../services/storage'

export default function ReminderModal({ item, onClose, onUpdated }) {
  const [date, setDate] = useState(item.reminder?.date || '')
  const [time, setTime] = useState(item.reminder?.time || '')

  const save = () => {
    if (!date || !time) return
    const updated = updateItem(item.id, { reminder: { date, time } })
    onUpdated?.(updated)
    onClose()
  }

  const clear = () => {
    const updated = updateItem(item.id, { reminder: null })
    onUpdated?.(updated)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-80">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-black text-slate-900 dark:text-white">Set Reminder</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">✕</button>
        </div>
        <div className="px-5 py-5 space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Time</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary" />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={save} className="flex-1 h-10 bg-gradient-to-r from-primary to-blue-500 text-white font-bold rounded-xl shadow-md shadow-primary/25">Save</button>
            {item.reminder && (
              <button onClick={clear} className="flex-1 h-10 bg-red-50 dark:bg-red-900/20 text-red-500 font-semibold rounded-xl">Clear</button>
            )}
            <button onClick={onClose} className="flex-1 h-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold rounded-xl">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add Task-1/keepbox-app/src/components/
git commit -m "feat(keepbox): ActionSheet, AddItemModal, EditModal, ReminderModal"
```

---

## Task 9: Home Dashboard

**Files:**
- Modify: `Task-1/keepbox-app/src/pages/Home.jsx`

- [ ] **Step 1: Write failing test**

Create `src/pages/Home.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'

beforeEach(() => localStorage.clear())

it('renders dashboard heading', () => {
  render(<MemoryRouter><Home /></MemoryRouter>)
  expect(screen.getByText(/dashboard/i)).toBeInTheDocument()
})

it('shows empty recent message when no items', () => {
  render(<MemoryRouter><Home /></MemoryRouter>)
  expect(screen.getByText(/no items saved yet/i)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test — expect failure**

```bash
npm test Home
```

- [ ] **Step 3: Implement Home.jsx**

```jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getItems, getFolders } from '../services/storage'
import ItemCard from '../components/ItemCard'
import { RowSkeleton } from '../components/Skeletons'

const CATEGORIES = [
  { type: 'Links', label: 'Links', sub: 'Saved resources', icon: 'link', from: '#2563eb', to: '#0ea5e9' },
  { type: 'Images', label: 'Images', sub: 'Photos & Graphics', icon: 'image', from: '#e11d48', to: '#f43f5e' },
  { type: 'Documents', label: 'Documents', sub: 'PDFs & Docs', icon: 'description', from: '#d97706', to: '#f59e0b' },
  { type: 'Videos', label: 'Videos', sub: 'Clips & Records', icon: 'movie', from: '#334155', to: '#475569' },
  { type: 'Notes', label: 'Notes', sub: 'Quick notes', icon: 'sticky_note_2', from: '#7c3aed', to: '#8b5cf6' },
]

const FOLDER_COLORS = ['bg-blue-100 text-blue-600', 'bg-rose-100 text-rose-500', 'bg-green-100 text-green-600', 'bg-purple-100 text-purple-500']

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [folders, setFolders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setItems(getItems().filter(i => !i.deleted && !i.archived))
    setFolders(getFolders())
    setLoading(false)
  }, [])

  const refresh = () => setItems(getItems().filter(i => !i.deleted && !i.archived))
  const recent = items.slice(0, 8)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {greeting}, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-sm text-slate-400 mt-1">Dashboard</p>
        </div>
        <div className="flex bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-1 gap-1">
          {['Today', 'Week', 'Month'].map((t, i) => (
            <button key={t} className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${i === 0 ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}>{t}</button>
          ))}
        </div>
      </div>

      {/* Pinned Folders */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">📌 Pinned Folders</h3>
          <button className="text-xs font-semibold text-primary hover:underline">View all</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {folders.slice(0, 4).map((folder, i) => (
            <Link key={folder.id} to={`/folder/${folder.id}`}
              className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow group cursor-pointer">
              <div className="flex justify-between items-start mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${FOLDER_COLORS[i % FOLDER_COLORS.length]}`}>
                  <span className="material-symbols-outlined text-xl">folder</span>
                </div>
                <span className="material-symbols-outlined text-slate-200 group-hover:text-primary transition-colors text-[18px]">push_pin</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{folder.name}</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {items.filter(item => item.folderId === folder.id).length} items
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">🗂️ Browse by Category</h3>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {CATEGORIES.map(({ type, label, sub, icon, from, to }) => (
            <button key={type} onClick={() => navigate(`/category/${type}`)}
              style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
              className="relative overflow-hidden rounded-2xl aspect-[4/3] p-4 flex flex-col justify-between group cursor-pointer">
              <span className="material-symbols-outlined text-white/50 group-hover:text-white/80 transition-opacity text-3xl">{icon}</span>
              <div>
                <p className="text-base font-black text-white">{label}</p>
                <p className="text-xs text-white/70">{sub}</p>
              </div>
              <div className="absolute -right-3 -bottom-3 opacity-10 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[80px] text-white">{icon}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Recently Saved */}
      <section>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">🕐 Recently Saved</h3>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          {loading ? (
            <div>{[...Array(4)].map((_, i) => <RowSkeleton key={i} />)}</div>
          ) : recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="material-symbols-outlined text-5xl text-slate-200 mb-3">inbox</span>
              <p className="text-sm font-semibold text-slate-400">No items saved yet</p>
              <p className="text-xs text-slate-300 mt-1">Click "Add New" to save your first item</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <tr className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Type</th>
                  <th className="px-6 py-3 text-left">Modified</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody>
                {recent.map(item => (
                  <ItemCard key={item.id} item={item}
                    onUpdate={refresh}
                    onDelete={(id) => { const { deleteItem } = require('../services/storage'); deleteItem(id); refresh() }}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  )
}
```

> **Note:** Replace the inline `require` in `onDelete` with a top-level import of `deleteItem` from storage. The pattern shown is illustrative.

- [ ] **Step 4: Fix the onDelete import**

At the top of `Home.jsx` add:
```jsx
import { getItems, getFolders, deleteItem } from '../services/storage'
```
And update `onDelete` to:
```jsx
onDelete={(id) => { deleteItem(id); refresh() }}
```

- [ ] **Step 5: Run tests — expect pass**

```bash
npm test Home
```

- [ ] **Step 6: Commit**

```bash
git add Task-1/keepbox-app/src/pages/Home.jsx Task-1/keepbox-app/src/pages/Home.test.jsx
git commit -m "feat(keepbox): Home dashboard with folders, categories, recent items"
```

---

## Task 10: CategoryView + FolderView

**Files:**
- Modify: `Task-1/keepbox-app/src/pages/CategoryView.jsx`
- Modify: `Task-1/keepbox-app/src/pages/FolderView.jsx`

- [ ] **Step 1: Implement CategoryView.jsx**

```jsx
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getItems, deleteItem } from '../services/storage'
import ItemCard from '../components/ItemCard'
import { RowSkeleton } from '../components/Skeletons'

export default function CategoryView() {
  const { type } = useParams()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    const all = getItems().filter(i => !i.deleted && !i.archived)
    setItems(type === 'all' ? all : all.filter(i => i.category === type))
    setLoading(false)
  }

  useEffect(() => { load() }, [type])

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Link to="/" className="text-slate-400 hover:text-primary text-sm">Home</Link>
        <span className="text-slate-300">›</span>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">{type === 'all' ? 'All Files' : type}</h2>
        <span className="ml-2 text-xs bg-slate-100 dark:bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-semibold">{items.length}</span>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        {loading ? (
          [...Array(5)].map((_, i) => <RowSkeleton key={i} />)
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-200 mb-3">folder_open</span>
            <p className="text-sm font-semibold text-slate-400">No {type} yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <tr className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Modified</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <ItemCard key={item.id} item={item}
                  onUpdate={load}
                  onDelete={(id) => { deleteItem(id); load() }}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Implement FolderView.jsx**

```jsx
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getItems, getFolders, deleteItem } from '../services/storage'
import ItemCard from '../components/ItemCard'

export default function FolderView() {
  const { id } = useParams()
  const [items, setItems] = useState([])
  const [folder, setFolder] = useState(null)

  const load = () => {
    const folders = getFolders()
    setFolder(folders.find(f => f.id === id) || { name: 'Unknown Folder' })
    setItems(getItems().filter(i => i.folderId === id && !i.deleted && !i.archived))
  }

  useEffect(() => { load() }, [id])

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Link to="/" className="text-slate-400 hover:text-primary text-sm">Home</Link>
        <span className="text-slate-300">›</span>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">{folder?.name}</h2>
        <span className="ml-2 text-xs bg-slate-100 dark:bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-semibold">{items.length} items</span>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-200 mb-3">folder_open</span>
            <p className="text-sm font-semibold text-slate-400">This folder is empty</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <tr className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Modified</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <ItemCard key={item.id} item={item}
                  onUpdate={load}
                  onDelete={(id) => { deleteItem(id); load() }}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add Task-1/keepbox-app/src/pages/CategoryView.jsx Task-1/keepbox-app/src/pages/FolderView.jsx
git commit -m "feat(keepbox): CategoryView and FolderView pages"
```

---

## Task 11: SearchPage

**Files:**
- Modify: `Task-1/keepbox-app/src/pages/SearchPage.jsx`

- [ ] **Step 1: Write failing test**

Create `src/pages/SearchPage.test.jsx`:

```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SearchPage from './SearchPage'

beforeEach(() => {
  localStorage.clear()
  const items = [
    { id: '1', type: 'link', category: 'Links', title: 'React docs', content: 'https://react.dev', description: '', starred: false, archived: false, deleted: false, reminder: null, folderId: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', type: 'document', category: 'Documents', title: 'Budget 2024', content: '', description: '', starred: false, archived: false, deleted: false, reminder: null, folderId: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ]
  localStorage.setItem('keepbox_items', JSON.stringify(items))
})

it('shows results matching query', async () => {
  render(<MemoryRouter><SearchPage /></MemoryRouter>)
  fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'react' } })
  await new Promise(r => setTimeout(r, 350)) // debounce
  expect(screen.getByText('React docs')).toBeInTheDocument()
  expect(screen.queryByText('Budget 2024')).not.toBeInTheDocument()
})
```

- [ ] **Step 2: Run test — expect failure**

```bash
npm test SearchPage
```

- [ ] **Step 3: Implement SearchPage.jsx**

```jsx
import { useState, useEffect } from 'react'
import { getItems } from '../services/storage'
import ItemCard from '../components/ItemCard'

const FILTERS = ['All', 'Links', 'Images', 'Documents', 'Videos', 'Notes']

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [results, setResults] = useState([])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!query.trim()) { setResults([]); return }
      const q = query.toLowerCase()
      const found = getItems().filter(i =>
        !i.deleted && !i.archived &&
        (filter === 'All' || i.category === filter) &&
        (i.title?.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q) || i.content?.toLowerCase().includes(q))
      )
      setResults(found)
    }, 300)
    return () => clearTimeout(timer)
  }, [query, filter])

  const refresh = () => {
    const q = query.toLowerCase()
    setResults(getItems().filter(i =>
      !i.deleted && !i.archived &&
      (filter === 'All' || i.category === filter) &&
      (i.title?.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q))
    ))
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-black text-slate-900 dark:text-white mb-5">Search</h2>

      {/* Search input */}
      <div className="relative mb-4">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
        <input
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search files, links, notes…"
          className="w-full pl-10 pr-4 h-12 bg-white dark:bg-slate-900 border-2 border-primary/30 focus:border-primary rounded-2xl text-sm shadow-md shadow-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${filter === f ? 'bg-primary text-white shadow-sm shadow-primary/30' : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-700 hover:border-primary/40'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Results */}
      {query.trim() && (
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
        </p>
      )}

      {results.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <table className="w-full">
            <tbody>
              {results.map(item => (
                <ItemCard key={item.id} item={item} onUpdate={refresh} onDelete={(id) => { const { deleteItem } = require('../services/storage'); deleteItem(id); refresh() }} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {query.trim() && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="material-symbols-outlined text-5xl text-slate-200 mb-3">search_off</span>
          <p className="text-sm font-semibold text-slate-400">No results for "{query}"</p>
          <p className="text-xs text-slate-300 mt-1">Try different keywords or a different filter</p>
        </div>
      )}
    </div>
  )
}
```

> **Note:** Replace `require` with top-level `import { deleteItem } from '../services/storage'`.

- [ ] **Step 4: Run tests — expect pass**

```bash
npm test SearchPage
```

- [ ] **Step 5: Commit**

```bash
git add Task-1/keepbox-app/src/pages/SearchPage.jsx Task-1/keepbox-app/src/pages/SearchPage.test.jsx
git commit -m "feat(keepbox): SearchPage with debounced search and filter chips"
```

---

## Task 12: Archive + Reminders + Trash

**Files:**
- Modify: `Task-1/keepbox-app/src/pages/ArchivePage.jsx`
- Modify: `Task-1/keepbox-app/src/pages/ReminderPage.jsx`
- Modify: `Task-1/keepbox-app/src/pages/TrashPage.jsx`

- [ ] **Step 1: Implement ArchivePage.jsx**

```jsx
import { useState, useEffect } from 'react'
import { getItems, updateItem } from '../services/storage'
import { RowSkeleton } from '../components/Skeletons'

export default function ArchivePage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => { setItems(getItems().filter(i => i.archived && !i.deleted)); setLoading(false) }
  useEffect(() => { load() }, [])

  const restore = (id) => { updateItem(id, { archived: false }); load() }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-black text-slate-900 dark:text-white mb-5">📦 Archive</h2>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        {loading ? (
          [...Array(3)].map((_, i) => <RowSkeleton key={i} />)
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-200 mb-3">archive</span>
            <p className="text-sm font-semibold text-slate-400">Archive is empty</p>
            <p className="text-xs text-slate-300 mt-1">Right-click any item and choose Archive</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5 capitalize">{item.type} · {item.category}</p>
                </div>
                <button onClick={() => restore(item.id)}
                  className="text-xs text-primary font-semibold hover:underline px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  Restore
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Implement ReminderPage.jsx**

```jsx
import { useState, useEffect } from 'react'
import { getItems } from '../services/storage'
import ReminderModal from '../components/ReminderModal'

export default function ReminderPage() {
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState(null)

  const load = () => setItems(getItems().filter(i => i.reminder && !i.deleted && !i.archived))
  useEffect(() => { load() }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-black text-slate-900 dark:text-white mb-5">🔔 Reminders</h2>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-200 mb-3">notifications_none</span>
            <p className="text-sm font-semibold text-slate-400">No reminders set</p>
            <p className="text-xs text-slate-300 mt-1">Right-click any item and choose "Set Reminder"</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map(item => (
              <div key={item.id} onClick={() => setSelected(item)}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                  <p className="text-xs text-primary mt-0.5">{item.reminder.date} at {item.reminder.time}</p>
                </div>
                <span className="material-symbols-outlined text-slate-300 text-[20px]">notifications</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {selected && (
        <ReminderModal item={selected} onClose={() => setSelected(null)} onUpdated={load} />
      )}
    </div>
  )
}
```

- [ ] **Step 3: Implement TrashPage.jsx**

```jsx
import { useState, useEffect } from 'react'
import { getItems, updateItem, permanentDelete } from '../services/storage'

export default function TrashPage() {
  const [items, setItems] = useState([])

  const load = () => setItems(getItems().filter(i => i.deleted))
  useEffect(() => { load() }, [])

  const restore = (id) => { updateItem(id, { deleted: false }); load() }
  const permDelete = (id) => {
    if (!confirm('Permanently delete this item? This cannot be undone.')) return
    permanentDelete(id)
    load()
  }
  const emptyTrash = () => {
    if (!confirm(`Permanently delete all ${items.length} items? This cannot be undone.`)) return
    items.forEach(i => permanentDelete(i.id))
    load()
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-black text-slate-900 dark:text-white">🗑️ Trash</h2>
        {items.length > 0 && (
          <button onClick={emptyTrash}
            className="text-xs text-red-500 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-900 transition-colors">
            Empty Trash ({items.length})
          </button>
        )}
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-200 mb-3">delete_outline</span>
            <p className="text-sm font-semibold text-slate-400">Trash is empty</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <div>
                  <p className="text-sm font-semibold text-slate-500 line-through">{item.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5 capitalize">{item.type}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => restore(item.id)} className="text-xs text-primary font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">Restore</button>
                  <button onClick={() => permDelete(item.id)} className="text-xs text-red-500 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">Delete forever</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add Task-1/keepbox-app/src/pages/ArchivePage.jsx Task-1/keepbox-app/src/pages/ReminderPage.jsx Task-1/keepbox-app/src/pages/TrashPage.jsx
git commit -m "feat(keepbox): Archive, Reminders, and Trash pages"
```

---

## Task 13: Settings + HelpFeedback

**Files:**
- Modify: `Task-1/keepbox-app/src/pages/Settings.jsx`
- Modify: `Task-1/keepbox-app/src/pages/HelpFeedback.jsx`

- [ ] **Step 1: Implement Settings.jsx**

```jsx
import { useState, useEffect } from 'react'
import { getSettings, updateSettings } from '../services/storage'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Toggle({ on, onToggle }) {
  return (
    <button onClick={onToggle} role="switch" aria-checked={on}
      className={`relative w-10 h-6 rounded-full transition-colors ${on ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}>
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${on ? 'left-5' : 'left-1'}`} />
    </button>
  )
}

function SettingsRow({ icon, iconBg, label, description, right }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50 dark:border-slate-800 last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${iconBg}`}>{icon}</div>
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-white">{label}</p>
          {description && <p className="text-xs text-slate-400">{description}</p>}
        </div>
      </div>
      {right}
    </div>
  )
}

export default function Settings() {
  const [settings, setSettings] = useState(getSettings)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const toggle = (key) => {
    const updated = { ...settings, [key]: !settings[key] }
    updateSettings(updated)
    setSettings(updated)
    if (key === 'theme') {
      document.documentElement.classList.toggle('dark', updated.theme === 'dark')
    }
  }

  const setTheme = (theme) => {
    const updated = { ...settings, theme }
    updateSettings(updated)
    setSettings(updated)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }

  // Apply saved theme on mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.theme === 'dark')
  }, [])

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">⚙️ Settings</h2>

      <div className="space-y-4">
        {/* Appearance */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Appearance</p>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <SettingsRow icon="🌙" iconBg="bg-blue-50 dark:bg-blue-900/20" label="Dark Mode" description="Switch to dark theme"
              right={<Toggle on={settings.theme === 'dark'} onToggle={() => setTheme(settings.theme === 'dark' ? 'light' : 'dark')} />}
            />
          </div>
        </div>

        {/* Notifications */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Notifications</p>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <SettingsRow icon="🔔" iconBg="bg-blue-50 dark:bg-blue-900/20" label="Push Notifications" description="Get alerts for reminders"
              right={<Toggle on={settings.notifications} onToggle={() => toggle('notifications')} />}
            />
            <SettingsRow icon="⏰" iconBg="bg-amber-50 dark:bg-amber-900/20" label="Reminder Alerts" description="Notify when reminder is due"
              right={<Toggle on={settings.reminderToggle} onToggle={() => toggle('reminderToggle')} />}
            />
          </div>
        </div>

        {/* Account */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Account</p>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <SettingsRow icon="📤" iconBg="bg-rose-50 dark:bg-rose-900/20" label="Export Data" description="Download all your items as JSON"
              right={<button className="text-xs text-primary font-semibold hover:underline">Export →</button>}
            />
            <SettingsRow icon="🚪" iconBg="bg-red-50 dark:bg-red-900/20" label="Sign Out" description="Log out of KeepBox"
              right={<button onClick={handleLogout} className="text-xs text-red-500 font-semibold hover:underline">Sign out</button>}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Implement HelpFeedback.jsx**

```jsx
import { useState } from 'react'
import { addFeedback } from '../services/storage'

const TYPES = [
  { value: 'bug', label: '🐛 Report a Bug' },
  { value: 'feature', label: '✨ Request a Feature' },
  { value: 'other', label: '💬 Other' },
]

export default function HelpFeedback() {
  const [type, setType] = useState('bug')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!message.trim()) return
    addFeedback({ type, message, email })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="p-6 max-w-2xl mx-auto flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-emerald-500 text-3xl">check_circle</span>
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Thanks for your feedback!</h2>
        <p className="text-sm text-slate-400">We appreciate you taking the time to share your thoughts.</p>
        <button onClick={() => { setSubmitted(false); setMessage(''); setEmail('') }}
          className="mt-6 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-md shadow-primary/25">
          Send another
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">❓ Help & Feedback</h2>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Type</label>
            <div className="flex flex-col gap-2">
              {TYPES.map(({ value, label }) => (
                <label key={value} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${type === value ? 'border-primary bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-primary/40'}`}>
                  <input type="radio" name="type" value={value} checked={type === value} onChange={() => setType(value)} className="accent-primary" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Message</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} required rows={4}
              placeholder="Describe your issue or idea in detail…"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none" />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Email <span className="normal-case font-normal">(optional)</span></label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary" />
          </div>

          <button type="submit"
            className="w-full h-11 bg-gradient-to-r from-primary to-blue-500 text-white font-bold rounded-xl shadow-md shadow-primary/25 hover:from-blue-600 hover:to-blue-400 transition-all">
            Send Feedback
          </button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add Task-1/keepbox-app/src/pages/Settings.jsx Task-1/keepbox-app/src/pages/HelpFeedback.jsx
git commit -m "feat(keepbox): Settings with dark mode toggle and HelpFeedback form"
```

---

## Task 14: Final Integration + Dark Mode Init + Full Test Run

**Files:**
- Modify: `Task-1/keepbox-app/src/App.jsx` (apply saved theme on mount)
- Modify: `Task-1/keepbox-app/index.html` (add font preconnects)

- [ ] **Step 1: Add theme init to App.jsx**

Add this before the `return` in `App.jsx`:

```jsx
import { useEffect } from 'react'
import { getSettings } from './services/storage'

// Inside App():
useEffect(() => {
  const { theme } = getSettings()
  document.documentElement.classList.toggle('dark', theme === 'dark')
}, [])
```

- [ ] **Step 2: Update index.html with font preconnects**

```html
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>KeepBox — Personal Cloud Storage</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
</head>
```

- [ ] **Step 3: Run all tests**

```bash
npm test
```

Expected: All tests PASS.

- [ ] **Step 4: Run dev server and manually verify all routes**

```bash
npm run dev
```

Checklist:
- [ ] `/login` — split-panel auth renders
- [ ] `/signup` — split-panel signup renders
- [ ] Sign up → redirected to `/` → sidebar visible
- [ ] `/` — Dashboard with folders, categories, recent items
- [ ] `/search` — search input + filters work
- [ ] `/category/Links` — filtered list
- [ ] `/archive` — empty state or archived items
- [ ] `/reminders` — empty state or reminder items
- [ ] `/trash` — empty state or deleted items
- [ ] `/settings` — dark mode toggle persists on refresh
- [ ] `/help` — feedback form submits → success state
- [ ] Right-click any item → ActionSheet appears
- [ ] "Add New" button → AddItemModal opens, save works
- [ ] Dark mode toggle in Settings changes theme

- [ ] **Step 5: Final commit**

```bash
git add Task-1/keepbox-app/
git commit -m "feat(keepbox): complete unified UI — all screens, dark mode, full test suite"
```

---

## Final Verification Checklist

- [ ] `npm test` — all tests pass
- [ ] `npm run dev` — app starts on `http://localhost:5173`
- [ ] Auth flow: signup → dashboard → logout → back to login
- [ ] Add item → appears in Home recent and CategoryView
- [ ] Archive item → disappears from Home → appears in Archive → restore works
- [ ] Delete item → disappears from Home → appears in Trash → restore and permanent delete work
- [ ] Set reminder → appears in Reminders → clear works
- [ ] Search finds items by title and description
- [ ] Dark mode persists across page refreshes
- [ ] All sidebar nav links route correctly
