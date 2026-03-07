<div align="center">

# 📦 KeepBox

### *Save Anything. Find Everything. Forget Nothing.*

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4.18-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-Android-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)](https://capacitorjs.com/)

---

**KeepBox** is a personal content-saving & organizing app — a smarter replacement for messaging yourself on WhatsApp.  
Save links, images, documents, videos, and notes with **zero friction** via Android's Share Sheet or manual input.

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Auth & Security** | Signup, Login, OTP verification, JWT-based session |
| 📤 **Android Share Intent** | Share from any app → KeepBox auto-saves instantly |
| ➕ **Manual Save** | Add links, images, docs, videos & notes via forms |
| 🏠 **Smart Home Feed** | Pinned folders, categories, recently saved timeline |
| ✏️ **Full CRUD** | Create, Read, Update, Delete with folder organization |
| 🔍 **Global Search** | Search across titles, descriptions & folder names |
| 📴 **Offline Support** | Cached data available offline with sync-on-reconnect |
| ⏰ **Reminders** | Set date/time reminders on any saved item |
| 🗄️ **Archive & Trash** | Archive for declutter, Trash with restore & auto-purge |
| ⚙️ **Settings** | Dark/Light mode, storage stats, notification controls |
| 💬 **Help & Feedback** | Bug reports, feature requests, FAQ |

---

## 🏗️ Project Structure

```
Task-1/
├── day-1/          🔐 Auth + Foundation (Login / Signup / JWT)
│   └── client/         React + Vite frontend
│
├── day-2/          📤 Android Share Intent + Auto Save
│   ├── client/         Share capture UI
│   └── server/         Save API + type detection
│
├── day-3/          ➕ Manual Add + Create (CRUD - Create)
│   ├── client/         Dynamic forms (Link, Doc, Image)
│   └── server/         File upload + folder creation
│
├── day-4/          🏠 Home, Categories & Read (CRUD - Read)
│   ├── client/         Home feed, category views, folder views
│   └── server/         Items & folders listing APIs
│
├── day-5/          ✏️ Update + Delete (CRUD - Update/Delete)
│   ├── client/         Edit, move, star, delete actions
│   └── server/         PATCH & DELETE endpoints
│
├── day-6/          🔍 Search + Offline + Performance
│   ├── client/         Global search, lazy loading, skeletons
│   └── server/         Search API + filters
│
├── day-7/          ⏰ Reminders + Archive
│   ├── client/         Reminder picker, archive section
│   └── server/         Reminder & archive APIs
│
└── day-8/          🗑️ Trash + Settings + Help & Feedback
                        Trash system, settings UI, feedback forms
```

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 · Vite · React Router v6 |
| **Styling** | Tailwind CSS 3 |
| **Backend** | Node.js · Express 4 |
| **Auth** | JWT (jsonwebtoken) · bcrypt |
| **Mobile** | Capacitor (Android) |
| **Database** | MongoDB / Supabase (PostgreSQL) |

</div>

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Run Any Day's Module

```bash
# 1. Clone the repo
git clone https://github.com/devanshupatil/Serach-Point-Internship.git
cd Serach-Point-Internship

# 2. Start the backend (Days 2–7)
cd Task-1/day-{N}/server
npm install
npm run dev

# 3. Start the frontend (any day)
cd Task-1/day-{N}/client
npm install
npm run dev
```

> Replace `{N}` with the day number (1–8).

---

## 📅 Development Roadmap

```
Day 1  ██████████████████████████████  Auth + Foundation
Day 2  ██████████████████████████████  Share Intent + Auto Save
Day 3  ██████████████████████████████  Manual Add + Create
Day 4  ██████████████████████████████  Home + Categories + Read
Day 5  ██████████████████████████████  Update + Delete
Day 6  ██████████████████████████████  Search + Offline + Performance
Day 7  ██████████████████████████████  Reminders + Archive
Day 8  ██████████████████████████████  Trash + Settings + Feedback
```

---

## 📄 API Overview

| Method | Endpoint | Day | Purpose |
|--------|----------|-----|---------|
| `POST` | `/auth/signup` | 1 | Register new user |
| `POST` | `/auth/login` | 1 | Login with credentials |
| `POST` | `/auth/verify-otp` | 1 | Verify OTP |
| `GET` | `/auth/me` | 1 | Get current user |
| `POST` | `/items` | 2, 3 | Save item (auto/manual) |
| `GET` | `/items?type=...` | 4 | Get items by category |
| `GET` | `/items?folderId=...` | 4 | Get items in folder |
| `PATCH` | `/items/:id` | 5 | Update item |
| `DELETE` | `/items/:id` | 5 | Delete item |
| `GET` | `/items/search?q=...` | 6 | Search items |
| `PATCH` | `/items/:id` | 7 | Set reminder / archive |
| `GET` | `/folders` | 4 | List all folders |
| `POST` | `/folders` | 3 | Create folder |
| `POST` | `/feedback` | 8 | Submit feedback |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is part of the **Search Point Internship** program.

---

<div align="center">

**Built with ❤️ by [Devanshu Patil](https://github.com/devanshupatil)**

</div>
