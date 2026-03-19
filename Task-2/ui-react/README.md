# Glow & Grace ✨

> A premium salon discovery and booking platform built with React + Vite

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
</p>

---

## 🎯 Overview

**Glow & Grace** is a sophisticated mobile-first web application designed for discovering and booking appointments at premium salons and spas. The app features a luxurious rose gold aesthetic with smooth animations and a seamless user experience.

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **Vite 5** | Build Tool & Dev Server |
| **Pure CSS** | Styling (CSS Variables, No Framework) |

## ✨ Features

### 📱 Responsive Design
- **Desktop**: Elegant sidebar navigation
- **Mobile**: Bottom navigation bar
- Fully responsive across all screen sizes

### 🏠 Pages

| Page | Description |
|------|-------------|
| **Home** | Personalized greetings, recommended salons, nearby listings |
| **Search** | Search with category filters (Hair, Nails, Spa, etc.) |
| **Shop Detail** | Salon gallery, stats, services menu, similar shops |
| **Booking** | Interactive calendar, time slots, payment summary |
| **My Bookings** | Upcoming appointments & booking history |
| **Profile** | User preferences, settings, account management |

### 🎨 Design System

- **Primary Color**: Rose Gold (`#8a4853`)
- **Typography**: Manrope + Plus Jakarta Sans (Google Fonts)
- **Icon Library**: Material Symbols Outlined
- **Effects**: Glassmorphism, shadows, smooth transitions
- **Animations**: Fade-in, slide-in, button press feedback

## 📂 Project Structure

```
ui-react/
├── index.html              # HTML entry point
├── package.json            # Dependencies & scripts
├── vite.config.js          # Vite configuration
├── README.md               # Documentation
├── dist/                   # Production build
└── src/
    ├── main.jsx            # React entry point
    ├── App.jsx             # Main application component
    └── styles.css           # Global styles & CSS variables
```

## 🚀 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 🎭 User Experience

- **Smooth Page Transitions**: Animated navigation between pages
- **Toast Notifications**: Confirmation messages for actions
- **Interactive Elements**: Hover effects, button press animations
- **Mobile Menu**: Slide-in drawer for mobile navigation
- **Category Chips**: Quick filtering of services

## 📦 Build Output

```
dist/
├── index.html
├── assets/
│   ├── index-*.css       # Minified CSS
│   └── index-*.js        # Minified JS bundle
```

## 🔧 Customization

The app uses CSS variables for easy theming. Key variables in `styles.css`:

```css
:root {
  --primary: #8a4853;
  --surface: #fffcf7;
  --on-surface-variant: #5f5f5f;
  /* ... more variables */
}
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <p><strong>Glow & Grace</strong> — Your Digital Beauty Concierge</p>
  <p>Designed with 💜 for the modern beauty enthusiast</p>
</div>
