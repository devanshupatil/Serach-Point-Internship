# 🔍 Search Point Task

> A collection of modern web applications featuring personal cloud storage and salon discovery platforms

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react" alt="React 18">
  <img src="https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python" alt="Python">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
</p>

---

## 📋 Project Overview

This repository contains two full-stack web applications:

| Task | Project | Description |
|------|---------|-------------|
| **Task-1** | KeepBox | Personal cloud storage and bookmark manager |
| **Task-2** | Glow & Grace | Salon discovery and booking platform |

---

## 📁 Project Structure

```
Search Point Task/
├── Task-1/
│   ├── .gitignore
│   ├── docs/
│   │   └── superpowers/         # Feature documentation
│   ├── keepbox-app/            # KeepBox application
│   └── README.md
│
├── Task-2/
│   ├── PLAN.md                 # Recommendation model plan
│   ├── ui-react/               # Glow & Grace frontend
│   └── README.md
│
└── README.md                   # This file
```

---

## 🚀 Quick Start

### Task-1: KeepBox

```bash
# Navigate to KeepBox
cd Task-1/keepbox-app

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Task-2: Glow & Grace

```bash
# Navigate to Glow & Grace
cd Task-2/ui-react

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📦 Task-1: KeepBox

### 🔑 Key Features

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

### 🖥️ Screens

| Screen | Route | Description |
|--------|-------|-------------|
| 🔐 **Login** | `/login` | Split-panel login with brand panel |
| 📝 **Signup** | `/signup` | Split-panel signup with gradient branding |
| 🏠 **Dashboard** | `/` | Home with folders, categories, recent items |
| 📁 **Files** | `/category/all` | All items view |
| 🏷️ **Category** | `/category/:type` | Items filtered by category |
| 📂 **Folder** | `/folder/:id` | Items within a specific folder |
| 🔍 **Search** | `/search` | Search interface with filters |
| 📦 **Archive** | `/archive` | Archived items list |
| 🔔 **Reminders** | `/reminders` | Items with active reminders |
| 🗑️ **Trash** | `/trash` | Soft-deleted items |
| ⚙️ **Settings** | `/settings` | Theme, notifications, account |
| ❓ **Help** | `/help` | Feedback form |

### ⚙️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **Vite 8** | Build Tool |
| **Tailwind CSS 3.4** | Styling |
| **React Router v6** | Client-side routing |
| **Vitest 4.1** | Testing |

---

## ✨ Task-2: Glow & Grace

### 🎯 Overview

**Glow & Grace** is a sophisticated salon discovery and booking platform featuring:

- **Beautiful React UI** — Mobile-first responsive design with rose gold aesthetics
- **Smart Recommendation Engine** — ML-powered personalized salon suggestions
- **Seamless Booking Experience** — Intuitive appointment scheduling

### 🏠 Pages

| Page | Description |
|------|-------------|
| **Home** | Personalized greetings, recommended salons, nearby listings |
| **Search** | Search with category filters (Hair, Nails, Spa, etc.) |
| **Shop Detail** | Salon gallery, stats, services menu, similar shops |
| **Booking** | Interactive calendar, time slots, payment summary |
| **My Bookings** | Upcoming appointments & booking history |
| **Profile** | User preferences, settings, account management |

### 🤖 Recommendation Engine

**Model: Customer Discovery & Recommendation**

| Feature | Description |
|---------|-------------|
| Distance Score | Closer salons rank higher |
| Service Match | Matches user's preferred services |
| Rating Weight | Higher-rated shops prioritized |
| Wait Time Penalty | Longer wait = lower score |
| Repeat Affinity | Loyal users get similar recommendations |

### ⚙️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **Vite 5** | Build Tool & Dev Server |
| **Pure CSS** | Styling with CSS Variables |
| **Python** (Planned) | ML Model & API |

---

## 🎨 Design Highlights

### KeepBox
- **Primary Color**: Blue (`#135bec`)
- **Theme**: Light/Dark mode support
- **Typography**: Inter font family
- **Style**: Modern, clean with gradients

### Glow & Grace
- **Primary Color**: Rose Gold (`#8a4853`)
- **Surface**: Cream (`#fffcf7`)
- **Typography**: Manrope + Plus Jakarta Sans
- **Style**: Luxurious, premium feel with glassmorphism

---

## 🧪 Testing

### KeepBox (Task-1)
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

---

## 📊 Project Comparison

| Aspect | KeepBox | Glow & Grace |
|--------|---------|--------------|
| **Purpose** | Personal storage | Salon discovery |
| **Auth** | ✅ Required | ✅ (Planned) |
| **Data Storage** | localStorage | Backend API (Planned) |
| **ML/AI** | ❌ None | ✅ Recommendation Engine |
| **Styling** | Tailwind CSS | Pure CSS + Variables |
| **Dark Mode** | ✅ Full support | ❌ Light only |
| **Testing** | Vitest | ❌ (Planned) |

---

## 🔮 Future Roadmap

### KeepBox
- [ ] Backend API integration
- [ ] Cloud sync with real storage providers
- [ ] Collaborative sharing features
- [ ] Mobile app (React Native)

### Glow & Grace
- [ ] Backend API with Python/Flask
- [ ] ML recommendation model implementation
- [ ] User authentication system
- [ ] Real booking system integration
- [ ] Payment processing
- [ ] Push notifications

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <p>Built with 💜 for modern web experiences</p>
  <p>Search Point Task © 2024</p>
</div>
