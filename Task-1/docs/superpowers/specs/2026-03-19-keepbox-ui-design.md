# KeepBox — Unified UI Design Spec

**Date:** 2026-03-19
**Status:** Approved
**Project:** `Task-1/keepbox-app/` (new unified React + Vite app)

---

## Overview

Build a single unified desktop web app for KeepBox — a personal cloud storage / save-anything app. All screens from the 8-day implementation plan are consolidated into one React + Vite project at `Task-1/keepbox-app/`. Data persists in browser `localStorage` via a shared storage service.

---

## Design System

| Token | Value |
|-------|-------|
| Primary | `#135bec` |
| Primary gradient | `linear-gradient(135deg, #135bec, #2563eb)` |
| Background light | `#f6f6f8` |
| Background dark | `#101622` |
| Surface | `#ffffff` |
| Border | `#f1f5f9` |
| Text primary | `#0f172a` |
| Text secondary | `#94a3b8` |
| Font | Inter (400, 500, 600, 700, 800, 900) |
| Border radius (cards) | `12px` |
| Border radius (inputs) | `10px` |
| Border radius (buttons) | `10px` |
| Shadow (cards) | `0 1px 4px rgba(0,0,0,0.04)` |
| Shadow (modals) | `0 25px 60px rgba(0,0,0,0.5)` |
| Shadow (primary btn) | `0 4px 14px rgba(19,91,236,0.35)` |

### Category Colors
| Category | Gradient |
|----------|----------|
| Links | `linear-gradient(135deg, #2563eb, #0ea5e9)` |
| Images | `linear-gradient(135deg, #e11d48, #f43f5e)` |
| Documents | `linear-gradient(135deg, #d97706, #f59e0b)` |
| Videos | `linear-gradient(135deg, #334155, #475569)` |
| Notes | `linear-gradient(135deg, #7c3aed, #8b5cf6)` |

---

## Project Structure

```
Task-1/keepbox-app/
├── src/
│   ├── App.jsx                     # Router with all routes
│   ├── main.jsx                    # Entry point
│   ├── index.css                   # Tailwind directives
│   ├── services/
│   │   └── storage.js              # Single localStorage service (full CRUD)
│   ├── context/
│   │   └── AuthContext.jsx         # User session via localStorage
│   ├── components/
│   │   ├── AppLayout.jsx           # Sidebar + Header shell
│   │   ├── ProtectedRoute.jsx      # Auth guard
│   │   ├── ItemCard.jsx            # File/link/image row card
│   │   ├── AddItemModal.jsx        # Tab-switcher form (Link/Image/Doc/Note)
│   │   ├── EditModal.jsx           # Edit title/description/folder
│   │   ├── ReminderModal.jsx       # Date + time picker
│   │   ├── ActionSheet.jsx         # Right-click context menu
│   │   ├── Toast.jsx               # Transient success/error notification
│   │   ├── Skeletons.jsx           # Loading skeleton placeholders
│   │   └── ErrorBoundary.jsx       # React error boundary wrapper
│   └── pages/
│       ├── Login.jsx               # Day 1 — split-panel auth
│       ├── Signup.jsx              # Day 1 — split-panel auth
│       ├── Home.jsx                # Day 3–4 — dashboard
│       ├── CategoryView.jsx        # Day 4 — filtered item list
│       ├── SearchPage.jsx          # Day 6 — search with filter chips
│       ├── ArchivePage.jsx         # Day 7 — archived items
│       ├── ReminderPage.jsx        # Day 7 — items with reminders
│       ├── TrashPage.jsx           # Day 6+8 — deleted items
│       ├── Settings.jsx            # Day 8 — toggle settings
│       ├── FolderView.jsx           # Folder drill-down (items by folderId)
│       └── HelpFeedback.jsx        # Day 8 — feedback form
├── index.html
├── package.json                    # React 18, Vite, React Router v6, Tailwind 3
├── vite.config.js
└── tailwind.config.js              # Extends with KeepBox design tokens
```

---

## Routes

| Path | Component | Layout | Auth Required |
|------|-----------|--------|---------------|
| `/login` | Login | Full-page | No |
| `/signup` | Signup | Full-page | No |
| `/` | Home | AppLayout | Yes |
| `/category/:type` | CategoryView | AppLayout | Yes |
| `/search` | SearchPage | AppLayout | Yes |
| `/archive` | ArchivePage | AppLayout | Yes |
| `/reminders` | ReminderPage | AppLayout | Yes |
| `/trash` | TrashPage | AppLayout | Yes |
| `/settings` | Settings | AppLayout | Yes |
| `/folder/:id` | FolderView | AppLayout | Yes |
| `/help` | HelpFeedback | AppLayout | Yes |

---

## Components

### AppLayout
- **Left sidebar** (220px fixed): Logo + brand, grouped nav items, user avatar + storage indicator, "Add New" CTA button
- **Nav groups**: Main (Home, Search, Files) · Manage (Archive, Reminders with badge, Trash) · Account (Settings, Help)
- **Active state**: `linear-gradient(135deg, #eff6ff, #dbeafe)` background, `#135bec` text, bold weight
- **Top header** (56px): Search bar (max 440px) with `⌘K` shortcut chip, notification bell with red dot, user icon
- **Add New button**: Full-width, gradient background, opens `AddItemModal`

### Auth Screens (Login / Signup)
- **Split-panel layout**: Left **auth brand panel** (200px, distinct from the 220px app sidebar) gradient brand (`#1d4ed8 → #135bec → #0ea5e9`) with logo, tagline, decorative circles. Right panel white with form.
- **Fields**: Email, Password (Login) / Full Name, Email, Password (Signup)
- **CTA**: Gradient primary button with arrow
- **Footer link**: Toggle between login ↔ signup

### Home Dashboard
- **Greeting header**: "Good morning, [Name] 👋" with storage usage bar
- **Time filter**: Today / Week / Month pill switcher
- **Pinned Folders** (4-col grid): White card, colored folder icon, name, item count + size
- **Browse by Category** (4-col grid): Gradient cards with emoji icon, category name, subtitle
- **Recently Saved** (table): Icon, name, type badge, modified time, size, action `⋯` button

### CategoryView
- Renders items filtered by `category === type` param
- **Images**: 3-col thumbnail grid
- **Links**: List with favicon placeholder, URL, description
- **Documents / Videos / Notes**: Table-style list matching Home's "Recently Saved"
- Empty state: centered icon + message

### SearchPage
- **Large search input** (full width, blue border, shadow focus) with icon prefix
- **Filter chips** row: All · Links · Docs · Images · Videos · Notes
- **Results count** label
- **Result rows**: Icon (colored by type) · name · folder · relative time

### AddItemModal
- Centered overlay with backdrop blur
- **Type tabs**: Link · Image · Document · Note
- **Fields per type**:
  - Link: Title, URL, Folder, Description
  - Image: Title, File upload, Folder, Description
  - Document: Title, File upload, Folder, Description
  - Note: Title, Content (textarea), Folder
- **Actions**: "Save Item" (gradient) + "Cancel"

### EditModal
- Intentionally shows only the **three shared fields** (Title, Description, Folder dropdown) regardless of item type. Type-specific fields (URL, file) are not editable after creation.
- Fields pre-populated from the existing item's data
- Actions: Save + Cancel

### ActionSheet (right-click / hover menu)
- Positioned contextually near item
- Items: ⭐ Star · ✏️ Edit · 📦 Archive · 🔔 Set Reminder · — · 🗑️ Delete (red)
- Closes on outside click or Escape

### ReminderModal
- Date picker + Time picker
- Save / Clear (if reminder exists) / Cancel
- Overlay with backdrop

### ArchivePage
- List of items where `archived === true && deleted !== true`
- Each row: item icon, title, type/category, "Restore" button
- Empty state message

### ReminderPage
- List of items where `reminder !== null && deleted !== true`
- Each row: item title, formatted reminder date + time, bell icon
- Click row → opens ReminderModal to edit/clear

### TrashPage
- List of items where `deleted === true`
- Each row: item title, type, "Restore" + "Delete Forever" buttons
- Confirm dialog before permanent delete
- "Empty Trash" button at top

### Settings
- **Grouped sections** with section labels:
  - Appearance: Dark Mode toggle
  - Notifications: Push Notifications toggle, Reminder Alerts toggle
  - Account: Export Data link, Sign Out (red)
- Toggle style: pill shape, blue when on, gray when off

### HelpFeedback
- Select: Report a Bug / Request a Feature / Other
- Textarea: description
- Email input: optional
- Submit button → success state with thank-you message

### Toast
- Bottom-right fixed, auto-dismiss after 3s
- Variants: success (green), error (red), info (blue)
- Slide-in animation

### Skeletons
- Pulse animation placeholders matching card/row shapes
- Used while `localStorage` reads on mount

---

## Storage Service (`storage.js`)

Single file, all components import from here. Never touches `localStorage` directly in components.

```js
// keepbox_items    → Item[]
// keepbox_folders  → Folder[]
// keepbox_settings → Settings
// keepbox_feedback → Feedback[]
// keepbox_user     → User
```

Exports: `getItems`, `addItem`, `updateItem`, `deleteItem`, `getFolders`, `addFolder`, `updateFolder`, `deleteFolder`, `getSettings`, `updateSettings`, `addFeedback`

> `getFeedback` is intentionally omitted — feedback is write-only (fire-and-forget). HelpFeedback.jsx only ever calls `addFeedback`.

---

## Tech Stack

| Package | Version |
|---------|---------|
| React | 18 |
| Vite | latest |
| React Router | v6 |
| Tailwind CSS | 3 |
| Inter font | via Google Fonts |
| Material Symbols | via Google Fonts (icons) |

---

## Tailwind Config Extensions

```js
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
  }
}
```

---

## Dark Mode

All components support Tailwind `dark:` variants. `Settings.jsx` toggles the `dark` class on `<html>` and persists to `keepbox_settings.theme`.

### Dark Mode Tokens

| Token | Light | Dark |
|-------|-------|------|
| Background | `#f6f6f8` | `#101622` |
| Surface | `#ffffff` | `#1e293b` |
| Border | `#f1f5f9` | `#1e293b` |
| Text primary | `#0f172a` | `#f8fafc` |
| Text secondary | `#94a3b8` | `#64748b` |
| Sidebar bg | `#ffffff` | `#0f172a` |
| Header bg | `#ffffff` | `#0f172a` |

---

## Accessibility

- All interactive elements have `aria-label` or visible label
- Focus rings on all keyboard-navigable elements (`focus:ring-2 focus:ring-primary/50`)
- Modal traps focus; closes on `Escape`
- Color contrast meets WCAG AA for all text/background combinations
