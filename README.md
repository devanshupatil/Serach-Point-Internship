<!-- ====== PROJECT BADGE ====== -->
<div align="center">

![KeepBox Banner](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=FFD43B" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=38B2AC" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/React%20Router-6.30-CA4245?style=for-the-badge&logo=react-router&logoColor=CA4245" alt="React Router">
  <img src="https://img.shields.io/badge/Vitest-4.1-green?style=for-the-badge&logo=vitest&logoColor=6B9A42" alt="Vitest">
</p>

<h1 align="center">
  <picture>
    <source srcset="https://fonts.gstatic.com/s/googlefonts/pressstart2p/v15/e3t4euO8T-267oIAQAu6jDQyK3nVivM.woff2" media="(prefers-color-scheme: dark)">
    <img src="https://cdn-icons-png.flaticon.com/512/2965/2965327.png" width="48" height="48" alt="🔐">
  </picture>
  <span>KeepBox</span>
</h1>

<p align="center">
  <strong>Your Personal Cloud Storage — Save everything that matters.</strong>
</p>

> 🔗 Links · 🖼️ Images · 📄 Documents · 🎥 Videos · 📝 Notes — all in one secure place.

<p align="center">
  <a href="#-quick-start"><strong>🚀 Quick Start</strong></a>
  &nbsp;&nbsp;|&nbsp;&nbsp;
  <a href="#-features"><strong>⭐ Features</strong></a>
  &nbsp;&nbsp;|&nbsp;&nbsp;
  <a href="#-screens"><strong>🖥️ Screens</strong></a>
  &nbsp;&nbsp;|&nbsp;&nbsp;
  <a href="#-tech-stack"><strong>⚙️ Tech Stack</strong></a>
  &nbsp;&nbsp;|&nbsp;&nbsp;
  <a href="#-project-structure"><strong>📁 Structure</strong></a>
  &nbsp;&nbsp;|&nbsp;&nbsp;
  <a href="#-scripts"><strong>📜 Scripts</strong></a>
</p>

![KeepBox Banner](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

</div>

---

## 📌 Table of Contents

- [🔑 Key Features](#-key-features)
- [🚀 Quick Start](#-quick-start)
- [⭐ Features](#-features)
- [🖥️ Screens](#-screens)
- [⚙️ Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [📜 Scripts](#-scripts)
- [🎨 Design Tokens](#-design-tokens)

---

## 🔑 Key Features

| Feature | Description |
|---------|-------------|
| 🔐 **Auth System** | Login / Signup with localStorage session |
| 📂 **File Management** | Save links, images, documents, notes with categories |
| 🔍 **Search** | Debounced full-text search across all items |
| 📁 **Folders** | Organize items into custom folders |
| 🏷️ **Categories** | Browse by Links, Images, Documents, Videos, Notes |
| ⭐ **Starred Items** | Star/unstar any item for quick access |
| 📦 **Archive** | Archive items and restore them later |
| 🔔 **Reminders** | Set date/time reminders on any item |
| 🗑️ **Trash** | Soft delete with restore or permanent delete |
| 🌙 **Dark Mode** | Full dark theme with persistence |
| 📱 **Responsive** | Mobile-friendly responsive design |
| ⚡ **Fast** | Built with Vite — instant HMR |

---

## 🚀 Quick Start

```bash
# 1. Navigate to the project
cd Task-1/keepbox-app

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open in browser
# → http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test
```

---

## ⭐ Features

### 🏠 Dashboard
- Personalized greeting based on time of day
- Pinned folders grid with item counts
- Category browse cards with gradient backgrounds
- Recently saved items table

### 🔍 Search
- Instant debounced search (300ms)
- Filter chips: All, Links, Images, Documents, Videos, Notes
- Search across title, description, and content

### 📂 Folders & Categories
- Create and manage custom folders
- Browse by category type
- Items table with icons, dates, and actions

### ✏️ Item Management
- Tab-switcher Add modal (Link, Image, Document, Note)
- Edit modal for title, description, and folder assignment
- Context menu (right-click) with ActionSheet
- Star, Archive, Reminder, Delete actions

### 🗑️ Archive & Trash
- Archive items for later
- Restore from archive
- Soft delete → Trash
- Restore or permanently delete from trash
- Empty trash with confirmation

### 🔔 Reminders
- Set date + time reminders on any item
- Reminders page listing all upcoming items
- Edit or clear reminders

### ⚙️ Settings
- Dark mode toggle with system persistence
- Notification toggles
- Export data
- Sign out

### 💬 Help & Feedback
- Bug reports, feature requests, other
- Optional email field
- Success confirmation state

---

## 🖥️ Screens

| Screen | Route | Description |
|--------|-------|-------------|
| 🔐 **Login** | `/login` | Split-panel login with brand panel |
| 📝 **Signup** | `/signup` | Split-panel signup with gradient branding |
| 🏠 **Dashboard** | `/` | Home with folders, categories, recent items |
| 📁 **Files** | `/category/all` | All non-archived, non-deleted items |
| 🏷️ **Category** | `/category/:type` | Items filtered by category |
| 📂 **Folder** | `/folder/:id` | Items within a specific folder |
| 🔍 **Search** | `/search` | Search interface with filters |
| 📦 **Archive** | `/archive` | Archived items list |
| 🔔 **Reminders** | `/reminders` | Items with active reminders |
| 🗑️ **Trash** | `/trash` | Soft-deleted items |
| ⚙️ **Settings** | `/settings` | Theme, notifications, account |
| ❓ **Help** | `/help` | Feedback form |

---

## ⚙️ Tech Stack

```
Frontend
├── React 19.2          — UI library
├── Vite 8.0            — Build tool & dev server
├── React Router v6     — Client-side routing
├── Tailwind CSS 3.4    — Utility-first CSS
├── Vitest 4.1          — Unit testing framework
├── React Testing Lib   — Component testing
├── Inter Font          — Google Fonts display font
└── Material Symbols    — Google Icons
```

### Architecture

```
keepbox-app/
├── src/
│   ├── main.jsx              # Entry point
│   ├── App.jsx               # Route definitions
│   ├── index.css             # Tailwind + global styles
│   ├── test-setup.js         # Vitest setup
│   ├── context/
│   │   └── AuthContext.jsx   # User session state
│   ├── services/
│   │   └── storage.js        # All localStorage operations
│   ├── components/
│   │   ├── AppLayout.jsx     # Sidebar + header shell
│   │   ├── ProtectedRoute.jsx # Auth guard
│   │   ├── ItemCard.jsx      # Table row for items
│   │   ├── AddItemModal.jsx  # Tab-switcher add form
│   │   ├── EditModal.jsx     # Edit title/desc/folder
│   │   ├── ReminderModal.jsx # Date + time picker
│   │   ├── ActionSheet.jsx   # Right-click context menu
│   │   ├── Toast.jsx         # Transient notifications
│   │   ├── Skeletons.jsx     # Loading placeholders
│   │   └── ErrorBoundary.jsx # React error boundary
│   └── pages/
│       ├── Login.jsx
│       ├── Signup.jsx
│       ├── Home.jsx
│       ├── CategoryView.jsx
│       ├── FolderView.jsx
│       ├── SearchPage.jsx
│       ├── ArchivePage.jsx
│       ├── ReminderPage.jsx
│       ├── TrashPage.jsx
│       ├── Settings.jsx
│       └── HelpFeedback.jsx
├── tailwind.config.js
├── vite.config.js
├── index.html
└── package.json
```

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server on port 5173 |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview production build locally |
| `npm test` | Run Vitest test suite once |
| `npm run test:watch` | Run Vitest in watch mode |

---

## 🎨 Design Tokens

### Colors

```css
/* Primary */
--primary:        #135bec     /* Brand blue */

/* Backgrounds */
--bg-light:       #f6f6f8     /* Light mode background */
--bg-dark:        #101622     /* Dark mode background */

/* Surfaces */
--surface:        #ffffff     /* Card / modal background */
--surface-dark:   #1e293b     /* Dark mode surface */

/* Borders */
--border-default: #f1f5f9     /* Light mode borders */
--border-dark:    #1e293b     /* Dark mode borders */

/* Text */
--text-primary:   #0f172a     /* Primary text color */
--text-secondary: #94a3b8     /* Muted / secondary text */
```

### Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Display | Inter | 900 (Black) | 2xl+ |
| Heading | Inter | 800 (ExtraBold) | xl |
| Subheading | Inter | 600 (SemiBold) | lg |
| Body | Inter | 400 (Regular) | sm |
| Caption | Inter | 400 (Regular) | xs |

### Spacing

Uses Tailwind's default spacing scale. Key layout areas:
- **Sidebar**: `w-56` (224px)
- **Header**: `h-14` (56px)
- **Content padding**: `p-6` (24px)
- **Card padding**: `p-4` to `p-6` (16-24px)
- **Gap between cards**: `gap-3` (12px)

### Border Radius

| Token | Value |
|-------|-------|
| `DEFAULT` | 4px |
| `lg` | 8px |
| `xl` | 12px |
| `2xl` | 16px |
| `full` | 9999px |

### Shadows

| Name | Value |
|------|-------|
| Subtle | `shadow-md shadow-primary/25` |
| Medium | `shadow-lg shadow-primary/30` |
| Heavy | `shadow-2xl` |

### Gradients

| Name | Colors |
|------|--------|
| Primary | `#135bec` → `#0ea5e9` |
| Brand panel | `#2563eb` → `#0ea5e9` via `#135bec` |
| Category cards | Dynamic per category (see `Home.jsx`) |

---

## 🌐 Data Storage

All data is stored in **localStorage** under these keys:

| Key | Description |
|-----|-------------|
| `keepbox_user` | Logged-in user object `{ name, email }` |
| `keepbox_items` | Array of all saved items |
| `keepbox_folders` | Array of user-created folders |
| `keepbox_settings` | App settings `{ theme, notifications, reminderToggle }` |
| `keepbox_feedback` | Array of submitted feedback entries |

### Item Schema

```js
{
  id: "uuid-v4",
  type: "link" | "image" | "document" | "video" | "note",
  category: "Links" | "Images" | "Documents" | "Videos" | "Notes",
  autoCategory: string,
  title: string,
  content: string,          // URL, note text, etc.
  description: string,
  folderId: string | null,
  starred: boolean,
  archived: boolean,
  deleted: boolean,
  reminder: { date: string, time: string } | null,
  metadata: object,
  createdAt: "ISO date string",
  updatedAt: "ISO date string"
}
```

---

## 🧪 Testing

The project uses **Vitest** with **React Testing Library** and **jsdom**.

### Running Tests

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

### Test Structure

Tests follow the pattern of write-fail-first → implement → verify-pass:
- `src/services/storage.test.js` — localStorage CRUD operations
- `src/context/AuthContext.test.jsx` — auth state management
- `src/components/AppLayout.test.jsx` — layout rendering
- `src/pages/Login.test.jsx` — login form behavior
- `src/pages/Home.test.jsx` — dashboard rendering
- `src/pages/SearchPage.test.jsx` — search filtering

---

<div align="center">

![KeepBox Banner](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

**Built with ❤️ using React + Vite + Tailwind CSS**

*KeepBox — Save everything that matters.*

![KeepBox Banner](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

</div>
