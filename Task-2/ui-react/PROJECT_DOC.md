# Glow & Grace - Project Documentation

## Internship Submission Document

---

## 1. Project Overview

**Project Title:** Glow & Grace - Salon Discovery Platform

**Project Type:** Single Page Web Application (React)

**Core Functionality:** A mobile-first web application that enables users to discover nearby salons, view service details, and book appointments for beauty and wellness services.

---

## 2. Brief Project Description

### What I Built
I built **Glow & Grace**, a React-based web application that serves as a digital concierge for beauty and wellness services. Users can:

- Browse recommended and nearby salons on the home page
- Search for salons by name, service type, or category
- Filter search results by price range and service category
- View detailed salon information including services offered
- Book appointments with interactive date and time selection
- Manage their personal profile with editable details

### Why I Built It
The project was built to solve the common problem of discovering and booking salon appointments. Traditional methods require phone calls or in-person visits. This app provides a seamless, mobile-friendly alternative where users can:
- Instantly find nearby salons
- Compare services and prices
- Book appointments 24/7
- Receive instant confirmations

---

## 3. Technical Stack

| Technology | Purpose | Version |
|-------------|---------|---------|
| React | UI Framework | 18.2.0 |
| Vite | Build Tool & Dev Server | 5.4.21 |
| Pure CSS | Styling (CSS Variables) | - |
| LocalStorage | Data Persistence | - |

### Architecture
- **Single Page Application (SPA)** - No page reloads
- **Component-based** - Modular React components
- **CSS Variables** - Consistent theming without frameworks
- **Local Storage** - No backend required for demo

---

## 4. Feature List

### Implemented Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | Home Page | Personalized greetings with recommended & nearby salons |
| 2 | Search | Search bars with filters (category, price) |
| 3 | Shop Detail | Salon gallery, services menu, booking button |
| 4 | Booking Flow | Calendar, time slots, confirmation |
| 5 | My Bookings | View upcoming and past appointments |
| 6 | Profile Management | Edit name, email, phone, profile image |
| 7 | Responsive Design | Mobile + Desktop layouts |
| 8 | Notifications | Toast notifications for actions |

### Key Functionality

1. **Profile Editing**
   - Edit name, email, phone number
   - Upload profile image from file or URL
   - Changes reflect across all pages

2. **Search & Filter**
   - Search by salon name or service type
   - Filter by category (Hair, Nails, Spa, etc.)
   - Filter by price range ($, $$, $$$)

3. **Booking System**
   - Select date from calendar
   - Choose available time slot
   - Confirm booking with toast notification

---

## 5. Project Structure

```
Task-2/ui-react/
├── index.html              # HTML Entry Point
├── package.json            # Dependencies
├── vite.config.js          # Vite Configuration
├── README.md               # Project README
├── dist/                   # Production Build
│   ├── index.html
│   └── assets/
└── src/
    ├── main.jsx           # React Entry
    ├── App.jsx            # Main Component (1343 lines)
    ├── styles.css         # CSS Styling (971 lines)
    └── storage.js        # Data Layer (198 lines)
```

---

## 6. Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Navigate to project directory
cd Task-2/ui-react

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Access
- Development: `http://localhost:5173`
- Production: `dist/` folder

---

## 7. Design System

### Color Palette

| Color | Hex Code | Usage |
|-------|---------|-------|
| Primary | #8a4853 | Rose Gold - Buttons, highlights |
| Primary Dark | #6d3840 | Hover states |
| Surface | #fef8f4 | Background |
| Surface Low | #f8f2ef | Cards, inputs |
| On Surface | #1d1b19 | Text |
| On Surface Variant | #524345 | Secondary text |

### Typography

| Element | Font | Weight |
|---------|------|--------|
| Headlines | Manrope | 700, 800 |
| Body | Plus Jakarta Sans | 400, 600, 700 |

### UI Components
- Bottom navigation (Mobile)
- Sidebar navigation (Desktop)
- Modal dialogs
- Toast notifications
- Cards with hover effects
- Chips for categories

---

## 8. Challenges & Solutions

### Challenge 1: Modal Display
**Problem:** Edit profile modal was not displaying correctly due to Tailwind opacity syntax not working.

**Solution:** Replaced `bg-black/50` with inline style: `style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}`

### Challenge 2: Profile Changes Not Reflecting
**Problem:** Updated profile name didn't show on home page after saving.

**Solution:** Passed profile prop to all components (HomePage, Sidebar, MobileMenu, MobileHeader)

### Challenge 3: Search Not Working
**Problem:** Search bar on home page didn't navigate to results.

**Solution:** Added shared search state in App component and passed to both HomePage and SearchPage

---

## 9. Screenshots Description

### Screen 1: Home Page (Mobile)
- Personalized greeting "Good Morning, [Name]"
- Recommended salons carousel
- Nearby salons list
- Bottom navigation

### Screen 2: Search Page
- Search input field
- Category filter chips
- Price filter buttons
- Salon results list

### Screen 3: Shop Detail
- Salon hero image
- Rating, distance, wait time
- Services list with prices
- Book Now button

### Screen 4: Profile Page
- Profile header with avatar
- Edit Profile button
- Personal preferences section

### Screen 5: Edit Profile Modal
- Profile image (editable)
- Name, Email, Phone inputs
- Cancel and Save buttons

---

## 10. Future Enhancements

Planned features for production:

- User authentication (login/signup)
- Backend API with Python/Flask
- ML recommendation engine
- Real booking system integration
- Payment processing
- Push notifications
- Dark mode support

---

## 11. Conclusion

This project demonstrates:
- React component architecture
- Responsive design implementation
- CSS custom properties for theming
- Local storage data management
- SPA navigation patterns
- User experience best practices

**Built by:** Devanshu Patil
**Date:** April 2026
**Submission:** Internship Project

---

*Glow & Grace - Your Digital Beauty Concierge*