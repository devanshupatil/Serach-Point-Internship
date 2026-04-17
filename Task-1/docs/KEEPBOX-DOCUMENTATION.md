# KeepBox Documentation

**Version:** 1.0  
**Date:** April 2026  
**Project:** KeepBox - Personal Cloud Storage Application

---

## 1. Project Overview

### 1.1 Introduction

KeepBox is a personal cloud storage web application that allows users to save and organize various types of content including links, images, documents, videos, and notes. The application provides a modern, responsive interface with features like folder organization, search, reminders, and dark mode support.

### 1.2 Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.4 | UI Library |
| React DOM | 19.2.4 | React renderer |
| React Router | 6.30.3 | Client-side routing |
| Vite | 8.0.0 | Build tool & dev server |
| Tailwind CSS | 3.4.19 | Utility-first CSS |
| Vitest | 4.1.0 | Testing framework |
| ESLint | 9.39.4 | Code linting |

### 1.3 Project Structure

```
keepbox-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx              # Application entry point
│   ├── App.jsx               # Route definitions
│   ├── index.css             # Global styles
│   ├── test-setup.js        # Vitest configuration
│   ├── context/
│   │   └── AuthContext.jsx # Authentication context
│   ├── services/
│   │   └── storage.js      # LocalStorage operations
│   ├── components/
│   │   ├── AddItemModal.jsx    # Add new item modal
│   │   ├── AppLayout.jsx    # Main layout component
│   │   ├── ActionSheet.jsx # Context menu
│   │   ├── EditModal.jsx   # Edit item modal
│   │   ├── ErrorBoundary.jsx # Error boundary
│   │   ├── ItemCard.jsx    # Item display card
│   │   ├── ProtectedRoute.jsx # Auth protection
│   │   ├── ReminderModal.jsx # Reminder picker
│   │   ├── Skeletons.jsx   # Loading placeholders
│   │   ├── Toast.jsx       # Notifications
│   │   └── index.css
│   └── pages/
│       ├── ArchivePage.jsx    # Archived items
│       ├── CategoryView.jsx  # Category browsing
│       ├── FolderView.jsx    # Folder view
│       ├── HelpFeedback.jsx   # Help & feedback
│       ├── Home.jsx          # Dashboard
│       ├── Login.jsx         # Login page
│       ├── ReminderPage.jsx # Reminders list
│       ├── SearchPage.jsx   # Search interface
│       ├── Settings.jsx      # App settings
│       ├── Signup.jsx       # Registration
│       └── TrashPage.jsx     # Deleted items
├── dist/                    # Production build output
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
├── eslint.config.js
└── postcss.config.js
```

---

## 2. Features

### 2.1 Authentication System

- **Login:** Email/password authentication with localStorage session
- **Signup:** New user registration
- **Session Management:** Persistent login via localStorage

### 2.2 File Management

| Type | Icon | Description |
|------|------|-------------|
| Links | link | Save URLs and web resources |
| Images | image | Store photos and graphics |
| Documents | description | PDFs and documents |
| Videos | movie | Video clips and recordings |
| Notes | sticky_note_2 | Quick notes and text |

### 2.3 Core Features

- **Folders:** Create and manage custom folders
- **Categories:** Browse items by type (Links, Images, Documents, Videos, Notes)
- **Search:** Full-text search with 300ms debounce
- **Starred Items:** Quick access to important items
- **Archive:** Soft delete with restore capability
- **Trash:** Soft delete with permanent delete option
- **Reminders:** Date/time reminders on any item

### 2.4 User Interface

- **Dashboard:** Personalized greeting, pinned folders, category cards, recent items
- **Dark Mode:** Full dark theme with system persistence
- **Responsive Design:** Mobile-friendly layout
- **Quick Actions:** Right-click context menu (ActionSheet)

---

## 3. Design System

### 3.1 Color Palette

| Color Name | Value | Usage |
|-----------|-------|-------|
| Primary | #135bec | Brand blue, buttons, links |
| BG Light | #f6f6f8 | Light mode background |
| BG Dark | #101622 | Dark mode background |
| Surface | #ffffff | Cards, modals (light) |
| Surface Dark | #1e293b | Cards, modals (dark) |
| Border Default | #f1f5f9 | Light mode borders |
| Border Dark | #1e293b | Dark mode borders |
| Text Primary | #0f172a | Primary text |
| Text Secondary | #94a3b8 | Muted text |

### 3.2 Category Colors

| Category | From | To |
|----------|------|-----|
| Links | #2563eb | #0ea5e9 |
| Images | #e11d48 | #f43f5e |
| Documents | #d97706 | #f59e0b |
| Videos | #334155 | #475569 |
| Notes | #7c3aed | #8b5cf6 |

### 3.3 Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Display | Inter | 900 (Black) | 2xl+ |
| Heading | Inter | 800 (ExtraBold) | xl |
| Subheading | Inter | 600 (SemiBold) | lg |
| Body | Inter | 400 (Regular) | sm |
| Caption | Inter | 400 (Regular) | xs |

### 3.4 Spacing

- Sidebar: 224px (w-56)
- Header: 56px (h-14)
- Content padding: 24px (p-6)
- Card padding: 16-24px (p-4 to p-6)
- Card gap: 12px (gap-3)

### 3.5 Border Radius

| Token | Value |
|-------|-------|
| DEFAULT | 4px |
| lg | 8px |
| xl | 12px |
| 2xl | 16px |
| full | 9999px |

### 3.6 Shadows

| Name | Value |
|------|-------|
| Subtle | shadow-md shadow-primary/25 |
| Medium | shadow-lg shadow-primary/30 |
| Heavy | shadow-2xl |

---

## 4. Data Storage

### 4.1 LocalStorage Keys

| Key | Description |
|-----|-------------|
| keepbox_user | Logged-in user object { name, email } |
| keepbox_items | Array of all saved items |
| keepbox_folders | Array of user-created folders |
| keepbox_settings | App settings { theme, notifications, reminderToggle } |
| keepbox_feedback | Array of submitted feedback |

### 4.2 Item Schema

```javascript
{
  id: "uuid-v4",                          // Unique identifier
  type: "link|image|document|video|note", // Item type
  category: "Links|Images|Documents|...", // Category display
  autoCategory: string,                  // Auto-assigned category
  title: string,                       // Item title
  content: string,                    // URL, note text, etc.
  description: string,                // Optional description
  folderId: string | null,            // Parent folder ID
  starred: boolean,                  // Starred status
  archived: boolean,                  // Archived status
  deleted: boolean,                  // Soft delete status
  reminder: { date: string, time: string } | null, // Reminder
  metadata: object,                   // Additional metadata
  createdAt: "ISO date string",        // Creation timestamp
  updatedAt: "ISO date string"       // Last update timestamp
}
```

---

## 5. API Reference

### 5.1 Storage Service

#### getItems()

Returns all items from storage.

```javascript
const items = getItems()
```

#### addItem(item)

Adds a new item to storage.

```javascript
const newItem = addItem({
  type: 'link',
  title: 'My Link',
  content: 'https://example.com',
  category: 'Links'
})
```

#### updateItem(id, patch)

Updates an item by ID.

```javascript
const updated = updateItem(id, { title: 'New Title' })
```

#### deleteItem(id)

Soft deletes an item (sets deleted: true).

```javascript
deleteItem(id)
```

#### permanentDelete(id)

Permanently removes an item.

```javascript
permanentDelete(id)
```

#### Folder Operations

```javascript
getFolders()          // Get all folders
addFolder(name)      // Create new folder
updateFolder(id, { name: 'New Name' })
deleteFolder(id)    // Delete folder
```

#### Settings Operations

```javascript
getSettings()       // Get app settings
updateSettings({ theme: 'dark' })
```

### 5.2 Auth Context

#### useAuth()

Hook to access auth state.

```javascript
const { user, login, logout } = useAuth()
```

---

## 6. Routes

| Route | Component | Description |
|-------|-----------|-------------|
| /login | Login | Login page |
| /signup | Signup | Registration page |
| / | Home | Dashboard |
| /category/:type | CategoryView | Category items |
| /folder/:id | FolderView | Folder items |
| /search | SearchPage | Search interface |
| /archive | ArchivePage | Archived items |
| /reminders | ReminderPage | Items with reminders |
| /trash | TrashPage | Deleted items |
| /settings | Settings | App settings |
| /help | HelpFeedback | Help & feedback |

---

## 7. Scripts

### 7.1 Available Commands

| Command | Description |
|---------|-------------|
| npm run dev | Start Vite dev server (port 5173) |
| npm run build | Build for production (outputs to dist/) |
| npm run preview | Preview production build |
| npm test | Run Vitest test suite once |
| npm run test:watch | Run tests in watch mode |
| npm run lint | Run ESLint |

### 7.2 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# → http://localhost:5173

# Build for production
npm run build
```

---

## 8. Testing

### 8.1 Test Structure

Tests follow the pattern of write-fail-first → implement → verify-pass:

- `src/services/storage.test.js` - localStorage CRUD operations
- `src/context/AuthContext.test.jsx` - auth state management
- `src/components/AppLayout.test.jsx` - layout rendering
- `src/pages/Login.test.jsx` - login form behavior
- `src/pages/Home.test.jsx` - dashboard rendering
- `src/pages/SearchPage.test.jsx` - search filtering

### 8.2 Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- Login
npm test -- Home
npm test -- SearchPage
```

---

## 9. Component Reference

### 9.1 Layout Components

| Component | Description |
|-----------|-------------|
| AppLayout | Main sidebar + header shell |
| ProtectedRoute | Authentication guard |
| ErrorBoundary | React error boundary |

### 9.2 Modal Components

| Component | Description |
|-----------|-------------|
| AddItemModal | Tab-switcher add form |
| EditModal | Edit title/desc/folder |
| ReminderModal | Date + time picker |
| ActionSheet | Right-click context menu |

### 9.3 Display Components

| Component | Description |
|-----------|-------------|
| ItemCard | Table row for items |
| Skeletons | Loading placeholders |
| Toast | Transient notifications |

---

## 10. Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Requires JavaScript enabled and localStorage support.

---

## 11. License

MIT License

---

**KeepBox — Save everything that matters.**